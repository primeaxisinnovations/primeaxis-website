import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreakingBar from '@/components/sections/BreakingBar'
import { getProfileBySlug } from '@/lib/profile-content'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  return profile ? { title: `${profile.name} | PrimeAxis`, description: profile.bio } : { title: 'Profile | PrimeAxis' }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) notFound()

  return (
    <div className="min-h-screen bg-cream">
      <BreakingBar />
      <main className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        <Link href="/about" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:text-deep">Back to About</Link>
        <div className="grid md:grid-cols-[320px_1fr] gap-10 md:gap-16 mt-10 items-start">
          <div className="aspect-[4/3] overflow-hidden bg-deep/10">
            {profile.photo && <Image src={profile.photo} alt={profile.name} width={640} height={480} className="w-full h-full object-cover" priority />}
          </div>
          <article>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">PrimeAxis Profile</p>
            <h1 className="font-display text-[clamp(34px,5vw,58px)] leading-tight font-semibold text-deep mt-3">{profile.name}</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-teal mt-4">{profile.role}</p>
            <p className="font-sans text-[16px] leading-[1.8] text-ink mt-8 whitespace-pre-line">{profile.bio}</p>
            <div className="flex flex-wrap gap-5 mt-8 font-mono text-[10px] uppercase tracking-[0.1em] text-teal">
              {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-gold">Email</a>}
              {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-gold">LinkedIn</a>}
              {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-gold">X</a>}
              {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-gold">Website</a>}
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}
