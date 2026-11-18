import { redirect } from 'next/navigation'

type PageProps = { params: Promise<{ slug: string }> }

export default async function IndustryNewsReportArticleRoute({ params }: PageProps) {
  const { slug } = await params
  redirect(`/intelligence-hub/${slug}`)
}
