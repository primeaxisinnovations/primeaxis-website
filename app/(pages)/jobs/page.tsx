import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllJobs } from '@/lib/jobs'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Jobs | PrimeAxis', description: 'Join PrimeAxis Innovations and help shape Africa’s maritime intelligence future.' }

export default async function JobsPage() {
  const jobs = await getAllJobs()
  return <main className="min-h-screen bg-cream px-6 py-16 md:px-12"><div className="mx-auto max-w-6xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Careers at PrimeAxis</p><h1 className="mt-3 max-w-3xl font-display text-5xl text-deep md:text-7xl">Build the intelligence behind Africa&apos;s blue economy.</h1><p className="mt-6 max-w-2xl text-muted">Explore open roles across editorial, research, strategy and maritime intelligence.</p><div className="mt-14 grid gap-5 md:grid-cols-2">{jobs.length === 0 ? <p className="text-muted">There are no open roles at the moment. Check back soon.</p> : jobs.map((job) => <Link key={job.slug} href={`/jobs/${job.slug}`} className="group border border-border bg-white p-7 transition-colors hover:border-gold"><p className="font-mono text-xs uppercase tracking-wider text-gold">{job.department}</p><h2 className="mt-3 font-display text-3xl text-deep group-hover:text-gold">{job.title}</h2><p className="mt-4 text-sm text-muted">{job.summary}</p><div className="mt-7 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-wider text-muted"><span>{job.location}</span><span>{job.type}</span></div></Link>)}</div></div></main>
}
