import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES, categoryToSlug } from '@/lib/categories'

export const dynamic = 'force-static'
type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const slug = (await params).slug; const category = CATEGORIES.find((item) => categoryToSlug(item) === slug); return category ? { title: `${category} | PrimeAxis`, description: `PrimeAxis intelligence and strategic commentary on ${category}.` } : { title: 'Category not found | PrimeAxis' } }
export default async function CategoryPage({ params }: Props) { const slug = (await params).slug; const category = CATEGORIES.find((item) => categoryToSlug(item) === slug); if (!category) notFound(); return <main className="min-h-screen bg-cream px-6 py-16 md:px-12"><div className="mx-auto max-w-5xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">PrimeAxis Intelligence</p><h1 className="mt-4 font-display text-5xl text-deep md:text-7xl">{category}</h1><p className="mt-6 max-w-2xl text-lg text-muted">Explore PrimeAxis reporting, analysis and executive perspective across {category}.</p><Link href="/intelligence-hub" className="mt-10 inline-block border border-deep px-6 py-3 font-mono text-xs uppercase tracking-wider text-deep hover:bg-deep hover:text-cream">Browse intelligence</Link></div></main> }
