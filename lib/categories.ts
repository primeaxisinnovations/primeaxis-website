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

export const CATEGORY_CODES: Record<Category, string> = {
  "Maritime Policy":        "MP",
  "Blue Economy":           "BE",
  "Ports & Infrastructure": "PI",
  "Shipping & Logistics":   "SL",
  "Maritime Security":      "MS",
  "Trade & Facilitation":   "TF",
  "Regulation & Governance":"RG",
  "Industry Intelligence":  "II",
  "Executive Perspectives": "EP",
  "Strategic Commentary":   "SC",
}

export function categoryToSlug(category: Category | string): string {
  return category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")
}
