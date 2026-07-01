// Helpers for building social-share excerpts from CMS content.
//
// Article bodies (article.body) and conversation introductions
// (conversation.introduction) are HTML produced by the admin RichTextEditor —
// NOT markdown. So excerpts are derived by splitting on block-level closings
// and stripping tags, rather than the naive `\n\n` split / markdown-symbol
// strip that only works on plain text. Plain-text sources (e.g. the standfirst
// `excerpt` field) pass through unharmed as a single paragraph.

const BLOCK_BOUNDARY = /<\/(?:p|div|h[1-6]|li|blockquote|section)>/i

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
}

// Turn an HTML (or plain-text) string into an ordered list of clean, tag-free
// paragraphs. Empty/whitespace-only paragraphs are dropped.
export function toParagraphs(source: string): string[] {
  return source
    .split(BLOCK_BOUNDARY)
    .map((chunk) =>
      decodeEntities(chunk.replace(/<[^>]+>/g, ''))
        .replace(/\s+/g, ' ')
        .trim()
    )
    .filter((p) => p.length > 0)
}

// Full WhatsApp-style excerpt: the first `count` paragraphs joined together,
// hard-capped at `cap` characters so the share URL can't balloon. Returns ''
// when the source has no extractable text.
export function paragraphExcerpt(source: string, count: number, cap: number): string {
  return toParagraphs(source).slice(0, count).join('\n\n').slice(0, cap)
}

// Single-paragraph Open Graph / social description. Truncates to `cap` and
// appends an ellipsis ONLY when the text was actually cut, so hand-written
// standfirsts that already fit stay clean (no stray "…").
export function ogDescription(source: string, cap = 200): string {
  const first = toParagraphs(source)[0] ?? ''
  return first.length > cap ? `${first.slice(0, cap).trimEnd()}…` : first
}
