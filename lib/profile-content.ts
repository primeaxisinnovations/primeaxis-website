import { cache } from 'react'
import { listFiles, getFile } from './github'
import { getProfilePlainText, parseProfile } from './content-parsers'
import type { Profile } from '@/types'

const PROFILES_DIR = 'content/profiles'
export { getProfilePlainText }
export const getAllProfiles = cache(async function getAllProfiles(): Promise<Profile[]> {
  let files: string[]
  try {
    files = (await listFiles(PROFILES_DIR)).filter((name) => name.endsWith('.md'))
  } catch (error) {
    // The profiles directory is optional until the first profile is created.
    // Keep the dashboard usable when that directory does not exist yet.
    if (typeof error === 'object' && error !== null && 'message' in error && String(error.message).includes('not found')) {
      return []
    }
    throw error
  }

  const results = await Promise.all(
    files.map(async (filename) => {
      try {
        const file = await getFile(`${PROFILES_DIR}/${filename}`)
        return file ? parseProfile(filename.replace(/\.md$/, ''), file.content) : null
      } catch {
        return null
      }
    }),
  )
  return results.filter((profile): profile is Profile => profile !== null && profile.status === 'published')
})
export async function getProfileBySlug(slug: string): Promise<Profile | undefined> { const file = await getFile(`${PROFILES_DIR}/${slug}.md`); if (!file) return undefined; const profile = parseProfile(slug, file.content); return profile.status === 'published' ? profile : undefined }
