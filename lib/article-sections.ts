import type { ArticleSection } from '@/types'

export const ARTICLE_SECTIONS = [
  { value: 'intelligence', label: 'Intelligence' },
  { value: 'industry-news-reports', label: 'Industry News & Reports' },
] as const

export function isArticleSection(value: unknown): value is ArticleSection {
  return value === 'intelligence' || value === 'industry-news-reports'
}

export function parseArticleSection(value: unknown): ArticleSection {
  return isArticleSection(value) ? value : 'intelligence'
}

export function articleSectionLabel(section: ArticleSection): string {
  return section === 'industry-news-reports' ? 'Industry News & Reports' : 'Intelligence'
}

export function articleSectionPath(section: ArticleSection): string {
  return section === 'industry-news-reports' ? '/industry-news-reports' : '/intelligence-hub'
}
