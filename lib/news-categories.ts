// Client-safe module — plain constants, no GitHub/Octokit imports.
//
// These live apart from lib/news.ts (which is SERVER-ONLY: it imports
// lib/github.ts and reads GITHUB_TOKEN) so client components — the filter
// pills, the admin form's category dropdown — can import the category list
// and its labels without dragging the GitHub client into the browser bundle.
// Same split as lib/categories.ts vs lib/content.ts.

export const NEWS_CATEGORIES = [
  'regulatory',
  'security',
  'trade',
  'infrastructure',
  'policy',
] as const

export type NewsCategory = (typeof NEWS_CATEGORIES)[number]

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  regulatory: 'Regulatory',
  security: 'Security',
  trade: 'Trade',
  infrastructure: 'Infrastructure',
  policy: 'Policy',
}
