import type { ArticleSection } from '@/types'

export const ARTICLE_SECTIONS = [
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'industry-news-reports', label: 'Industry News & Reports' },
  { value: 'beyond-the-headlines', label: 'Beyond the Headlines' },
] as const

export function isArticleSection(value: unknown): value is ArticleSection {
  return value === 'intelligence'
    || value === 'industry-news-reports'
    || value === 'beyond-the-headlines'
}

export function parseArticleSection(value: unknown): ArticleSection {
  return isArticleSection(value) ? value : 'intelligence'
}

export function articleSectionLabel(section: ArticleSection): string {
  if (section === 'industry-news-reports') return 'Industry News & Reports'
  if (section === 'beyond-the-headlines') return 'Beyond the Headlines'
  return 'Intelligence'
}

export function articleSectionPath(section: ArticleSection): string {
  if (section === 'industry-news-reports') return '/industry-news-reports'
  if (section === 'beyond-the-headlines') return '/beyond-the-headlines'
  return '/intelligence-hub'
}

export function articleAdminPath(section: ArticleSection): string {
  return section === 'beyond-the-headlines'
    ? '/admin/articles?section=beyond-the-headlines'
    : '/admin/articles'
}
