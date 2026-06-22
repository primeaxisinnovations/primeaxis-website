// SERVER-ONLY MODULE — never import this into any client component.
// It reads GITHUB_TOKEN (a repo-scoped write credential) and talks
// directly to the GitHub REST API. Only import it from server-side code:
// Route Handlers, Server Components, Server Actions.

import { Octokit } from '@octokit/rest'

// Startup check — runs once when this module is first imported (each
// serverless cold start). Warns loudly so a missing token shows up in logs
// immediately instead of as a wall of per-file "auth error" noise once
// real traffic starts calling getFile/listFiles. Never logs the value.
if (!process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN.trim() === '') {
  console.warn(
    'lib/github.ts: GITHUB_TOKEN is not set or empty. Every GitHub-backed read/write (articles, conversations, the admin CMS) will fail until this is configured.'
  )
}

let octokit: Octokit | null = null

function getOctokit(): Octokit {
  if (!octokit) {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set — cannot talk to GitHub.')
    }
    octokit = new Octokit({ auth: token })
  }
  return octokit
}

// Every read goes through `ref`, every write goes through `branch` — both
// always set explicitly from GITHUB_BRANCH. Never omit this and let
// Octokit/GitHub fall back to the repo's default branch: see the
// GITHUB_BRANCH comment in .env.local for why that's dangerous.
function getRepoConfig(): { owner: string; repo: string; branch: string } {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH
  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO must be set — cannot talk to GitHub.')
  }
  if (!branch) {
    throw new Error(
      'GITHUB_BRANCH is not set — refusing to guess a branch. Set it explicitly (development during the build, main only at go-live).'
    )
  }
  return { owner, repo, branch }
}

function isNotFoundError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && (error as { status: unknown }).status === 404
}

function wrapGitHubError(action: string, path: string, error: unknown): Error {
  const status = typeof error === 'object' && error !== null && 'status' in error ? (error as { status?: number }).status : undefined
  const rawMessage = error instanceof Error ? error.message : String(error)

  if (status === 401 || status === 403) {
    return new Error(
      `GitHub ${action} failed for "${path}": authentication/permission error — check GITHUB_TOKEN is valid and has Contents read-and-write access to this repo. (${rawMessage})`
    )
  }
  if (status === 404) {
    return new Error(
      `GitHub ${action} failed for "${path}": not found — check GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, and the path are correct. (${rawMessage})`
    )
  }
  if (status !== undefined) {
    return new Error(`GitHub ${action} failed for "${path}": GitHub returned status ${status}. (${rawMessage})`)
  }
  return new Error(`GitHub ${action} failed for "${path}": network or unexpected error talking to GitHub. (${rawMessage})`)
}

export interface GitHubFile {
  content: string
  sha: string
}

// Configurable so a slow network (or a deliberately tight test) can override
// the default without a code change. 10s matches the connect-timeout window
// where we've actually observed GitHub API hangs from this environment.
function getRequestTimeoutMs(): number {
  const raw = Number(process.env.GITHUB_REQUEST_TIMEOUT_MS)
  return Number.isFinite(raw) && raw > 0 ? raw : 10_000
}

const RETRY_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 500

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Thrown for failures that are about the data, not the network — retrying
// can never fix these, so isTransientError must never say yes for them.
class NonRetryableError extends Error {}

// 401/403/404 (and any other non-5xx HTTP status) are real, permanent
// answers from GitHub — retrying won't change them, so they fail fast.
// Anything else — a 5xx, or a raw network/timeout error with no HTTP
// status at all (a dropped connection, our own AbortSignal firing) — is
// the transient class this retry loop exists for.
function isTransientError(error: unknown): boolean {
  if (error instanceof NonRetryableError) return false
  if (typeof error !== 'object' || error === null) return true
  if (!('status' in error)) return true
  const status = (error as { status?: unknown }).status
  return typeof status === 'number' && status >= 500
}

// Returns the file's decoded content and sha, or null if it doesn't exist
// yet — callers can tell "doesn't exist" apart from a real error.
//
// Retries transient network/5xx failures (up to RETRY_ATTEMPTS, exponential
// backoff) because we've directly observed GitHub API connect timeouts from
// this environment that succeed on a bare retry seconds later. Genuine
// 401/403/404 fail on the first attempt, same as before this change.
export async function getFile(path: string): Promise<GitHubFile | null> {
  const client = getOctokit()
  const { owner, repo, branch } = getRepoConfig()
  const timeoutMs = getRequestTimeoutMs()

  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const response = await client.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
        request: { signal: AbortSignal.timeout(timeoutMs) },
      })

      if (Array.isArray(response.data) || response.data.type !== 'file' || typeof response.data.content !== 'string') {
        throw new NonRetryableError(`GitHub getFile failed for "${path}": path does not point to a regular file.`)
      }

      return {
        content: Buffer.from(response.data.content, 'base64').toString('utf-8'),
        sha: response.data.sha,
      }
    } catch (error) {
      if (isNotFoundError(error)) return null

      if (!isTransientError(error) || attempt === RETRY_ATTEMPTS) {
        throw wrapGitHubError('getFile', path, error)
      }

      console.warn(
        `GitHub getFile: transient error on attempt ${attempt}/${RETRY_ATTEMPTS} for "${path}", retrying — ${error instanceof Error ? error.message : String(error)}`
      )
      await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
    }
  }

  // Unreachable — the loop above always returns or throws.
  throw new Error(`GitHub getFile failed for "${path}": exhausted retries.`)
}

// Creates the file if it doesn't exist, or updates it in place if it does.
export async function createOrUpdateFile(path: string, content: string, commitMessage: string): Promise<{ sha: string }> {
  const { owner, repo, branch } = getRepoConfig()
  const client = getOctokit()

  const existing = await getFile(path)

  try {
    const response = await client.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: commitMessage,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    })

    const sha = response.data.content?.sha
    if (!sha) {
      throw new Error(`GitHub createOrUpdateFile succeeded for "${path}" but returned no sha.`)
    }
    return { sha }
  } catch (error) {
    throw wrapGitHubError('createOrUpdateFile', path, error)
  }
}

export async function deleteFile(path: string, sha: string, commitMessage: string): Promise<void> {
  const { owner, repo, branch } = getRepoConfig()
  const client = getOctokit()

  try {
    await client.rest.repos.deleteFile({ owner, repo, path, message: commitMessage, sha, branch })
  } catch (error) {
    throw wrapGitHubError('deleteFile', path, error)
  }
}

// Returns the filenames (not full paths) of every file directly inside `directory`.
export async function listFiles(directory: string): Promise<string[]> {
  const { owner, repo, branch } = getRepoConfig()
  const client = getOctokit()

  let response
  try {
    response = await client.rest.repos.getContent({ owner, repo, path: directory, ref: branch })
  } catch (error) {
    throw wrapGitHubError('listFiles', directory, error)
  }

  if (!Array.isArray(response.data)) {
    throw new Error(`GitHub listFiles failed for "${directory}": path is a file, not a directory.`)
  }

  return response.data.filter((entry) => entry.type === 'file').map((entry) => entry.name)
}
