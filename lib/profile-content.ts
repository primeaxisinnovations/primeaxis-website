import { cache } from 'react'
import matter from 'gray-matter'
import { listFiles, getFile } from './github'
import type { Profile } from '@/types'

const PROFILES_DIR = 'content/profiles'
function parseProfile(slug: string, raw: string): Profile {
  const { data } = matter(raw)
  return { slug, name: String(data.name ?? ''), role: String(data.role ?? ''), bio: String(data.bio ?? ''), photo: String(data.photo ?? ''), email: typeof data.email === 'string' ? data.email : undefined, linkedin: typeof data.linkedin === 'string' ? data.linkedin : undefined, twitter: typeof data.twitter === 'string' ? data.twitter : undefined, website: typeof data.website === 'string' ? data.website : undefined, status: data.status === 'published' ? 'published' : 'draft' }
}
export const getAllProfiles = cache(async function getAllProfiles(): Promise<Profile[]> {
  let files: string[]
  try {
    files = (await listFiles(PROFILES_DIR)).filter((name) => name.endsWith('.md'))
  } catch (error) {
    // The profiles directory is optional until the first profile is created.
    // Keep public pages buildable when that directory does not exist yet.
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
