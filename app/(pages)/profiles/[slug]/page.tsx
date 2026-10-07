import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreakingBar from '@/components/sections/BreakingBar'
import ViewCounter from '@/components/ui/ViewCounter'
import ProfileShareButtons from '@/components/ui/ProfileShareButtons'
import { getProfileBySlug } from '@/lib/profile-content'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  return profile ? { title: `${profile.name} | PrimeAxis`, description: profile.bio.replace(/<[^>]+>/g, '').slice(0, 160) } : { title: 'Profile | PrimeAxis' }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) notFound()
  return <div className="min-h-screen bg-cream"><BreakingBar /><main className="mx-auto max-w-[1120px] px-6 py-12 md:py-20">
    <Link href="/about" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:text-deep">Back to About</Link>
    <section className="mt-8 overflow-hidden border border-deep/10 bg-white shadow-[0_20px_60px_rgba(13,24,36,0.08)]">
      <div className="relative h-48 bg-deep md:h-64">{profile.banner && <Image src={profile.banner} alt="" fill className="object-cover opacity-80" priority />}<div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" /></div>
      <div className="grid gap-8 px-6 pb-10 md:grid-cols-[220px_1fr] md:gap-12 md:px-12">
        <div className="relative -mt-20 aspect-square overflow-hidden border-8 border-white bg-deep/10 md:-mt-24">{profile.photo && <Image src={profile.photo} alt={profile.name} fill className="object-cover" priority />}</div>
        <article className="pt-2 md:pt-8"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">PrimeAxis Profile</p><h1 className="mt-3 font-display text-[clamp(34px,5vw,58px)] leading-tight font-semibold text-deep">{profile.name}</h1><p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-teal">{profile.role}</p>
          <div className="mt-7 font-sans text-[16px] leading-[1.8] text-ink [&_a]:text-teal [&_a]:underline [&_h2]:font-display [&_h2]:text-2xl" dangerouslySetInnerHTML={{ __html: profile.bio }} />
          <div className="mt-8 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.1em] text-teal">{profile.email && <a href={`mailto:${profile.email}`} className="hover:text-gold">Email</a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-gold">LinkedIn</a>}{profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-gold">X</a>}{profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-gold">Website</a>}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-deep/10 pt-6"><ViewCounter mode="interactive" type="profile" slug={profile.slug} initialCount={0} /><ProfileShareButtons name={profile.name} /></div>
        </article>
      </div>
    </section>
  </main></div>
}
