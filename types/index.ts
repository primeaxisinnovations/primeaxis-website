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
  status: 'draft' | 'published'
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
  status: 'draft' | 'published'
  introduction?: string
  pullQuote?: string
  closingQuote?: string
  editorsNote?: string
}

export interface EventGalleryItem {
  url: string
  type: 'image' | 'video'
  caption?: string
}

export interface Event {
  slug: string
  title: string
  date: string
  category: 'conference' | 'summit' | 'press-briefing'
  status: 'published' | 'draft'
  coverImage: string
  description: string
  gallery: EventGalleryItem[]
}

export interface Service {
  title: string
  description: string
  icon: string
  outcomes: string[]
}
