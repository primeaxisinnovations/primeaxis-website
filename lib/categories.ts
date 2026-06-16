export const CATEGORIES = [
  "Maritime Policy",
  "Blue Economy",
  "Ports & Infrastructure",
  "Shipping & Logistics",
  "Maritime Security",
  "Trade & Facilitation",
  "Regulation & Governance",
  "Industry Intelligence",
  "Executive Perspectives",
  "Strategic Commentary",
] as const

export type Category = (typeof CATEGORIES)[number]

export function categoryToSlug(category: Category | string): string {
  return category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
}
