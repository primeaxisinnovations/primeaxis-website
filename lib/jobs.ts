import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import type { Job } from '@/types'

const JOBS_DIR = 'content/jobs'

function parseJob(slug: string, raw: string): Job {
  const { data, content } = matter(raw)
  return {
    slug,
    title: String(data.title ?? ''),
    location: String(data.location ?? ''),
    type: String(data.type ?? ''),
    department: String(data.department ?? ''),
    closingDate: String(data.closingDate ?? ''),
    summary: String(data.summary ?? ''),
    body: content.trim(),
    status: data.status === 'published' ? 'published' : 'draft',
  }
}

export async function getAllJobs(): Promise<Job[]> {
  let files: string[]
  try { files = (await listFiles(JOBS_DIR)).filter((name) => name.endsWith('.md')) } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) return []
    throw error
  }
  const results = await Promise.all(files.map(async (filename) => {
    try { const file = await getFile(`${JOBS_DIR}/${filename}`); return file ? parseJob(filename.replace(/\.md$/, ''), file.content) : null } catch { return null }
  }))
  return results.filter((job): job is Job => job !== null && job.status === 'published').sort((a, b) => a.title.localeCompare(b.title))
}

export async function getJobBySlug(slug: string): Promise<Job | undefined> {
  const file = await getFile(`${JOBS_DIR}/${slug}.md`)
  if (!file) return undefined
  const job = parseJob(slug, file.content)
  return job.status === 'published' ? job : undefined
}

export function buildJobFrontmatter(job: Omit<Job, 'slug' | 'body'>) {
  return { title: job.title, location: job.location, type: job.type, department: job.department, closingDate: job.closingDate, summary: job.summary, status: job.status }
}

export { parseJob, JOBS_DIR }
