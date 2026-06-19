export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readingTime: string
  featuredImage: string
  referenceCode: string
  body: string
  content?: string
  tags?: string[]
}

export interface Conversation {
  slug: string
  executiveName: string
  title: string
  position: string
  organisation: string
  photo: string
  initials?: string
  qa: { question: string; answer: string }[]
  transcriptRef: string
  excerpt: string
  date: string
  content?: string
}

export interface Service {
  title: string
  description: string
  icon: string
  outcomes: string[]
}
