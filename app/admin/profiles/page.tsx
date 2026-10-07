import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import matter from 'gray-matter'
import { listFiles, getFile } from '@/lib/github'
import { getAllViewCounts } from '@/lib/view-counts'
import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'
import ProfileRowActions from '@/components/admin/ProfileRowActions'

export const dynamic = 'force-dynamic'

export default async function ProfilesAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const store = await cookies()
  if (!verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value)) redirect('/admin/login')

  let files: string[] = []
  try {
    files = (await listFiles('content/profiles')).filter((name) => name.endsWith('.md'))
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('not found')) throw error
  }

  const [profiles, viewCounts] = await Promise.all([
    Promise.all(files.map(async (filename) => {
      const file = await getFile(`content/profiles/${filename}`)
      if (!file) return null
      const { data } = matter(file.content)
      return {
        slug: filename.replace(/\.md$/, ''),
        name: String(data.name ?? ''),
        role: String(data.role ?? ''),
        bio: String(data.bio ?? ''),
        photo: String(data.photo ?? ''),
        banner: String(data.banner ?? ''),
        email: String(data.email ?? ''),
        linkedin: String(data.linkedin ?? ''),
        twitter: String(data.twitter ?? ''),
        website: String(data.website ?? ''),
        status: data.status === 'published' ? 'published' as const : 'draft' as const,
      }
    })),
    getAllViewCounts('profile'),
  ])
  const { saved } = await searchParams
  const validProfiles = profiles.filter((profile): profile is NonNullable<typeof profile> => profile !== null)

  return (
    <div className="min-h-screen bg-cream px-8 py-10 max-sm:px-4">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div><p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">PrimeAxis Admin</p><h1 className="font-display text-[28px] font-semibold text-deep">Profiles</h1></div>
          <Link href="/admin/profiles/new" className="bg-gold px-6 py-3 font-sans text-[13px] font-semibold text-deep">+ New Profile</Link>
        </div>
        {saved && <div className="mb-6 border border-gold/40 bg-gold/10 px-5 py-4 font-sans text-[13px] text-deep">Profile saved successfully.</div>}
        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full min-w-[720px] text-left"><thead><tr className="border-b border-border bg-cream"><th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-deep">Profile</th><th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-deep">Role</th><th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-deep">Views</th><th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-deep">Status</th><th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-deep">Actions</th></tr></thead>
            <tbody>{validProfiles.map((profile) => <tr key={profile.slug} className="border-b border-border last:border-0"><td className="px-5 py-4"><div className="flex items-center gap-3">{profile.photo ? <Image src={profile.photo} alt="" width={48} height={48} className="size-12 rounded-full object-cover" /> : <div className="flex size-12 items-center justify-center rounded-full bg-deep text-sm text-white">{profile.name.charAt(0)}</div>}<span className="font-display text-[18px] font-semibold text-deep">{profile.name}</span></div></td><td className="px-5 py-4 font-sans text-[13px] text-ink">{profile.role || '—'}</td><td className="px-5 py-4 font-mono text-[12px] text-ink">{viewCounts[profile.slug] ?? 0}</td><td className="px-5 py-4"><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-teal">{profile.status}</span></td><td className="px-5 py-4"><ProfileRowActions {...profile} /></td></tr>)}</tbody>
          </table>
          {validProfiles.length === 0 && <p className="px-5 py-10 font-sans text-sm text-muted-foreground">No profiles have been created yet.</p>}
        </div>
      </div>
    </div>
  )
}
