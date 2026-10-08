import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getJobBySlug } from '@/lib/jobs'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const job = await getJobBySlug((await params).slug); if (!job) return { title: 'Job not found | PrimeAxis' }; return { title: `${job.title} | Jobs | PrimeAxis`, description: job.summary, openGraph: { title: job.title, description: job.summary, type: 'website' }, twitter: { card: 'summary', title: job.title, description: job.summary } } }

export default async function JobPage({ params }: Props) { const job = await getJobBySlug((await params).slug); if (!job) notFound(); return <main className="min-h-screen bg-cream px-6 py-16 md:px-12"><article className="mx-auto max-w-4xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{job.department} · {job.type}</p><h1 className="mt-4 font-display text-5xl text-deep md:text-7xl">{job.title}</h1><p className="mt-6 text-lg text-muted">{job.summary}</p><div className="mt-8 flex flex-wrap gap-5 border-y border-border py-5 font-mono text-xs uppercase tracking-wider text-muted"><span>{job.location}</span>{job.closingDate && <span>Closes {job.closingDate}</span>}</div><div className="prose prose-lg mt-12 max-w-none text-ink" dangerouslySetInnerHTML={{ __html: job.body }} /></article></main> }
