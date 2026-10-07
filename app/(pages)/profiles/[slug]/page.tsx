import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BreakingBar from '@/components/sections/BreakingBar'
import ViewCounter from '@/components/ui/ViewCounter'
import ProfileShareButtons from '@/components/ui/ProfileShareButtons'
import { getAllProfiles, getProfileBySlug, getProfilePlainText } from '@/lib/profile-content'
import { getAllViewCounts, getViewCount } from '@/lib/view-counts'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'
const DEFAULT_PROFILE_DESCRIPTION =
  "Explore PrimeAxis profiles featuring the people shaping Africa's maritime intelligence and blue economy."

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) {
    return {
      title: 'Prime Axis Profile | PrimeAxis',
      description: DEFAULT_PROFILE_DESCRIPTION,
      robots: { index: false, follow: false },
    }
  }

  const description = getProfilePlainText(profile.bio).slice(0, 160) || DEFAULT_PROFILE_DESCRIPTION
  const title = `Prime Axis Profile : ${profile.name}`
  const url = `${SITE_URL}/profiles/${profile.slug}`
  const image = profile.banner || profile.photo

  return {
    title,
    description,
    keywords: [profile.name, profile.role, 'PrimeAxis', 'Africa maritime intelligence', 'blue economy'].filter(Boolean),
    alternates: { canonical: url },
    authors: [{ name: profile.name, url }],
    creator: 'PrimeAxis Innovations Limited',
    publisher: 'PrimeAxis Innovations Limited',
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      title,
      description,
      url,
      siteName: 'PrimeAxis',
      type: 'profile',
      locale: 'en_NG',
      firstName: profile.name.split(' ')[0],
      images: image ? [{ url: image, alt: `${profile.name} — PrimeAxis profile` }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile) notFound()

  const profileDescription = getProfilePlainText(profile.bio) || DEFAULT_PROFILE_DESCRIPTION
  const profileUrl = `${SITE_URL}/profiles/${profile.slug}`
  const [viewCount, recentProfiles, viewCounts] = await Promise.all([
    getViewCount('profile', profile.slug),
    getAllProfiles(),
    getAllViewCounts('profile'),
  ])
  const relatedProfiles = recentProfiles.filter((item) => item.slug !== profile.slug).slice(0, 6)
  const sameAs = [profile.linkedin, profile.twitter, profile.website].filter(Boolean)
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role || undefined,
    description: profileDescription,
    url: profileUrl,
    image: [profile.photo, profile.banner].filter(Boolean),
    sameAs,
    worksFor: {
      '@type': 'Organization',
      name: 'PrimeAxis Innovations Limited',
      url: SITE_URL,
    },
  }

  return <div className="min-h-screen bg-cream"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} /><BreakingBar /><main className="mx-auto max-w-[1120px] px-6 py-12 md:py-20">
    <Link href="/about" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:text-deep">Back to About</Link>
    <section className="mt-8 overflow-hidden border border-deep/10 bg-white shadow-[0_20px_60px_rgba(13,24,36,0.08)]">
      <div className="relative h-48 bg-deep md:h-64">{profile.banner && <Image src={profile.banner} alt="" fill className="object-cover opacity-80" priority />}<div className="absolute inset-0 bg-gradient-to-t from-deep/80 to-transparent" /></div>
      <div className="grid gap-8 px-6 pb-10 md:grid-cols-[220px_1fr] md:gap-12 md:px-12">
        <div className="relative -mt-20 aspect-square overflow-hidden border-8 border-white bg-deep/10 md:-mt-24">{profile.photo && <Image src={profile.photo} alt={profile.name} fill className="object-cover" priority />}</div>
        <article className="pt-2 md:pt-8"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">PrimeAxis Profile</p><h1 className="mt-3 font-display text-[clamp(34px,5vw,58px)] leading-tight font-semibold text-deep">{profile.name}</h1><p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-teal">{profile.role}</p>
          <div className="mt-7 font-sans text-[16px] leading-[1.8] text-ink [&_a]:text-teal [&_a]:underline [&_h2]:font-display [&_h2]:text-2xl" dangerouslySetInnerHTML={{ __html: profile.bio }} />
          <div className="mt-8 flex flex-wrap items-center gap-5 font-mono text-[10px] uppercase tracking-[0.1em] text-teal">{profile.email && <a href={`mailto:${profile.email}`} className="hover:text-gold">Email</a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-gold">LinkedIn</a>}{profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-gold">X</a>}{profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-gold">Website</a>}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-deep/10 pt-6"><ViewCounter mode="interactive" type="profile" slug={profile.slug} initialCount={viewCount} /><ProfileShareButtons name={profile.name} /></div>
        </article>
      </div>
    </section>
    {relatedProfiles.length > 0 && (
      <section className="mt-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">People shaping the conversation</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-deep">More PrimeAxis profiles</h2>
          </div>
          <Link href="/about" className="font-mono text-[10px] uppercase tracking-[0.14em] text-teal hover:text-gold">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedProfiles.map((item) => (
            <article key={item.slug} className="overflow-hidden border border-deep/10 bg-white">
              <Link href={`/profiles/${item.slug}`} className="block">
                <div className="relative aspect-[16/9] bg-deep/10">
                  {item.banner ? <Image src={item.banner} alt="" fill className="object-cover" /> : item.photo ? <Image src={item.photo} alt="" fill className="object-cover" /> : null}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-deep">{item.name}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{item.role}</p>
                  <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-ink">{getProfilePlainText(item.bio)}</p>
                </div>
              </Link>
              <div className="flex items-center justify-between border-t border-deep/10 px-5 py-3">
                <ViewCounter mode="display" count={viewCounts[item.slug] ?? 0} />
                <Link href={`/profiles/${item.slug}`} className="font-mono text-[10px] uppercase tracking-[0.12em] text-teal hover:text-gold">View profile</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    )}
  </main></div>
}
