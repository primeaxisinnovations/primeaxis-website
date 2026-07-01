import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getAllConversations, getConversationBySlug } from '@/lib/conversation-content'
import { formatDate } from '@/lib/utils'
import { paragraphExcerpt, ogDescription } from '@/lib/share-excerpt'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConversationCard from '@/components/ui/ConversationCard'
import DispatchHeader from '@/components/ui/DispatchHeader'
import NewsletterForm from '@/components/ui/NewsletterForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxisinnovations.com.ng'

type PageProps = { params: Promise<{ slug: string }> }

// ISR: pre-built for every known slug at deploy time, then served from the
// CDN cache and regenerated in the background at most once an hour (3600s) — a
// Publish/Unpublish/Save shows up within ~an hour. Raised from 60s to cut
// GitHub-API cold-load latency on cache misses.
export const revalidate = 3600

export async function generateStaticParams() {
  const conversations = await getAllConversations()
  return conversations.map((conversation) => ({ slug: conversation.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const conversation = await getConversationBySlug(slug)
  if (!conversation) return {}
  // Conversations have no article body. Prefer the first paragraph of the
  // (optional, HTML) introduction; otherwise keep the hand-written standfirst
  // excerpt, which is already a purpose-built OG-length summary.
  const description =
    (conversation.introduction && ogDescription(conversation.introduction)) ||
    conversation.excerpt
  const ogTitle = `${conversation.executiveName} — ${conversation.title}`
  return {
    title: `${conversation.executiveName} | Executive Conversations | PrimeAxis`,
    description,
    openGraph: {
      title: ogTitle,
      description,
      images: [{ url: conversation.photo }],
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: ogTitle,
      description,
      images: [conversation.photo],
    },
  }
}

// Large italic Playfair Display pull-quote on a dark full-bleed band — same
// gold-accent pattern as the About page's positioning statement, reused here
// for both the Pull Quote and Closing Quote fields.
function PullQuoteSection({ text }: { text: string }) {
  return (
    <section className="bg-deep py-[80px] max-sm:py-14">
      <div className="max-w-[900px] mx-auto px-11 max-md:px-5 text-center">
        <span className="block w-8 h-0.5 bg-gold mx-auto mb-10" />
        <p className="font-display italic text-[clamp(17px,2vw,26px)] text-white leading-[1.65]">
          {text}
        </p>
        <span className="block w-8 h-0.5 bg-gold mx-auto mt-10" />
      </div>
    </section>
  )
}

export default async function ConversationPage({ params }: PageProps) {
  const { slug } = await params
  const conversation = await getConversationBySlug(slug)
  if (!conversation) notFound()

  const others = (await getAllConversations()).filter((c) => c.slug !== conversation.slug)

  const pageUrl = `${SITE_URL}/executive-conversations/${conversation.slug}`
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(
    `${conversation.executiveName} — ${conversation.title} | PrimeAxis`
  )

  // WhatsApp shares carry a real excerpt (first two paragraphs). Conversations
  // have no body, so use the introduction prose when present, else the
  // standfirst excerpt. WhatsApp renders this text directly.
  const whatsappExcerpt = paragraphExcerpt(
    conversation.introduction ?? conversation.excerpt,
    2,
    400
  )
  const whatsappText = whatsappExcerpt
    ? `${conversation.executiveName} — ${conversation.title}\n\n${whatsappExcerpt}…\n\nRead more: ${pageUrl}`
    : `${conversation.executiveName} — ${conversation.title}\n\n${pageUrl}`
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Breadcrumb ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5 py-3">
          <nav className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-muted flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors duration-150">Home</Link>
            <span>/</span>
            <Link href="/executive-conversations" className="hover:text-gold transition-colors duration-150">Executive Conversations</Link>
            <span>/</span>
            <span className="text-ink/50 line-clamp-1 max-w-[260px]">{conversation.executiveName}</span>
          </nav>
        </div>
      </div>

      {/* ── Header — dark ───────────────────────────────────────────── */}
      <section className="bg-deep pt-[60px] pb-[72px]">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <AnimatedSection>

            <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-10">
              Executive Conversations
            </span>

            {/* Avatar + name + position row */}
            <div className="flex items-start gap-8 max-sm:flex-col max-sm:gap-6 mb-8">

              {/* Avatar — real photo takes priority, falling back to the
                  initials gradient only when no photo is set (same
                  conditional pattern as ConversationCard). */}
              {conversation.photo ? (
                <div className="relative w-[140px] h-[140px] flex-shrink-0 overflow-hidden border border-gold/25">
                  <Image
                    src={conversation.photo}
                    alt={conversation.executiveName}
                    fill
                    priority
                    quality={80}
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
              ) : (
                <div className="w-[140px] h-[140px] flex-shrink-0 flex items-center justify-center bg-teal border border-gold/25">
                  <span className="font-display text-[36px] font-semibold text-white/85 tracking-wider">
                    {conversation.initials}
                  </span>
                </div>
              )}

              {/* Name + role */}
              <div className="flex-1 min-w-0 pt-1">
                <h1 className="font-display text-[clamp(24px,3.5vw,46px)] font-semibold text-white leading-[1.1] mb-3">
                  {conversation.executiveName}
                </h1>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45 leading-[1.8]">
                  {conversation.position}
                  <br />
                  {conversation.organisation}
                </p>
              </div>
            </div>

            {/* Conversation title */}
            <p className="font-display italic text-[clamp(17px,1.8vw,22px)] text-gold/80 leading-[1.45] max-w-[640px] mb-6">
              &ldquo;{conversation.title}&rdquo;
            </p>

            {/* Standfirst excerpt */}
            <p className="font-sans text-[16px] text-white/60 leading-[1.75] max-w-[640px] pl-5 border-l-2 border-gold/35">
              {conversation.excerpt}
            </p>

            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25 mt-7">
              Published {formatDate(conversation.date)}
            </p>

          </AnimatedSection>
        </div>
      </section>

      {/* ── Introduction (HTML, optional) — renders nothing at all when
          unset, not even an empty container. dangerouslySetInnerHTML is
          safe here for the same reason as the Q&A answers below: this HTML
          originates only from the authenticated admin's RichTextEditor. */}
      {conversation.introduction && (
        <section style={{ background: '#F5F0E8' }}>
          <div className="max-w-[780px] mx-auto pt-16 pb-0 px-12 max-sm:px-5">
            <AnimatedSection>
              <div
                className="article-prose"
                style={{ fontSize: '16px', lineHeight: 1.85, color: '#1C2B4A', fontWeight: 300 }}
                dangerouslySetInnerHTML={{ __html: conversation.introduction }}
              />
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── Pull Quote (optional) — placed as the Q&A section opens */}
      {conversation.pullQuote && <PullQuoteSection text={conversation.pullQuote} />}

      {/* ── Q&A body + share ──────────────────────────────────────────── */}
      <section style={{ background: '#F5F0E8' }}>
      <div className="max-w-[780px] mx-auto py-16 px-12 max-sm:px-5 text-left">

        <AnimatedSection delay={100}>
          <div className="mb-8">
            <DispatchHeader
              refCode={conversation.transcriptRef}
              date={formatDate(conversation.date)}
              desk="ON RECORD"
              dateLabel="RECORDED"
              refLabel="TRANSCRIPT REF"
              deskLabel="STATUS"
            />
          </div>

          <div>

            {conversation.qa.map((pair, i) => (
              <div key={i}>
                {/* Thin gold separator between the previous answer and this question */}
                {i > 0 && (
                  <div style={{ width: '40px', height: '1px', background: '#c8a96e', margin: '40px 0' }} />
                )}

                {/* Question — glass pill */}
                <div
                  style={{
                    background: 'rgba(28, 43, 74, 0.08)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(200, 169, 110, 0.25)',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '32px',
                      fontWeight: 700,
                      color: '#c8a96e',
                      lineHeight: 1,
                      marginRight: '16px',
                      float: 'left',
                    }}
                    aria-hidden="true"
                  >
                    Q
                  </span>
                  <p
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontSize: '17px',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      color: '#1C2B4A',
                      lineHeight: 1.65,
                    }}
                  >
                    {pair.question}
                  </p>
                </div>

                {/* Answer (HTML) — plain on cream, no card. dangerouslySetInnerHTML
                    is safe here specifically because pair.answer originates only
                    from RichTextEditor inside the authenticated admin's own
                    conversation editor — it is never derived from public user
                    input. Do not copy this pattern for any content that
                    originates outside the admin CMS. */}
                <div
                  className="qa-answer"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0 0 48px 0',
                    marginBottom: 0,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '16px',
                    fontWeight: 300,
                    lineHeight: 1.85,
                    color: '#1C2B4A',
                  }}
                  dangerouslySetInnerHTML={{ __html: pair.answer }}
                />
              </div>
            ))}

            {/* ── Share row ──────────────────────────────────────────── */}
            <div className="flex items-center gap-3 pt-8 mt-[56px] border-t border-border">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mr-1">Share</span>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="w-8 h-8 border border-border flex items-center justify-center text-muted hover:border-gold hover:text-gold transition-all duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>

          </div>
        </AnimatedSection>

      </div>
      </section>

      {/* ── Closing Quote (optional) — the dramatic last word before the
          editorial wrap-up content */}
      {conversation.closingQuote && <PullQuoteSection text={conversation.closingQuote} />}

      <div className="max-w-[1240px] mx-auto px-11 max-md:px-5 pt-[56px] pb-[72px] max-sm:pt-10 max-sm:pb-14">

        <AnimatedSection>
          <div
            style={{
              maxWidth: '780px',
              margin: '0 auto',
              padding: '48px 48px 64px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            {/* ── Editor's Note (HTML, optional) — distinct callout box,
                not to be confused with the fixed "Editorial Note" disclaimer
                below. dangerouslySetInnerHTML is safe here for the same
                reason as the Q&A answers above. */}
            {conversation.editorsNote && (
              <div className="editors-note-pill">
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: '#c8a96e',
                    marginBottom: '12px',
                    display: 'block',
                  }}
                >
                  Editor&apos;s Note
                </span>
                <div
                  className="qa-answer"
                  style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.78, color: '#1C2B4A' }}
                  dangerouslySetInnerHTML={{ __html: conversation.editorsNote }}
                />
              </div>
            )}

            {/* ── About Executive Conversations — fixed section, identical
                on every conversation page, not tied to any data field. */}
            <div className="mb-10">
              <span className="block w-6 h-0.5 bg-gold mb-3 mx-auto" />
              <h2 className="font-display text-[19px] font-semibold text-deep mb-2.5 text-center">
                About Executive Conversations
              </h2>
              {/* PLACEHOLDER COPY — pending Nneoma's final wording. */}
              <p className="font-sans text-[14px] text-muted leading-relaxed max-w-[580px] mx-auto text-center">
                Executive Conversations is PrimeAxis&apos;s flagship interview series, engaging the
                leaders, regulators, and institution builders shaping Africa&apos;s maritime and
                blue economy future.
              </p>
            </div>

            {/* ── Editorial Note — fixed disclaimer, identical on every
                conversation page. Understated by design: this is a standard
                editorial footnote, not a featured section. */}
            <p className="font-mono text-[10.5px] tracking-[0.08em] text-muted/70 leading-relaxed max-w-[620px] mx-auto text-center">
              Editorial Note: This interview has been edited for clarity, length, and flow while
              preserving the substance of the conversation.
            </p>

          </div>
        </AnimatedSection>

        {/* ── More Conversations ──────────────────────────────────────── */}
        {others.length > 0 && (
          <div className="mt-[80px] pt-[60px] border-t border-border max-sm:mt-14 max-sm:pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block w-6 h-0.5 bg-gold mb-3" />
                <h2 className="font-display text-[clamp(20px,2vw,28px)] font-semibold text-deep">
                  More Conversations
                </h2>
              </div>
              <Link
                href="/executive-conversations"
                className="font-mono text-[10px] tracking-[0.15em] uppercase text-gold hover:text-gold/70 transition-colors duration-150 hidden sm:block"
              >
                All Conversations →
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {others.map((c) => (
                <ConversationCard key={c.slug} conversation={c} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Newsletter CTA ──────────────────────────────────────────── */}
      <section className="bg-deep py-[56px] max-sm:py-14">
        <div className="max-w-[600px] mx-auto px-11 max-md:px-5 text-center">
          <span className="block font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">
            Intelligence Briefings
          </span>
          <h2 className="font-display text-[clamp(22px,2.5vw,34px)] font-semibold text-white leading-[1.15] mb-4">
            Stay Ahead of Africa&apos;s Maritime Story
          </h2>
          <p className="font-sans text-[14px] text-white/50 leading-relaxed mb-8">
            Strategic intelligence, policy analysis, and industry perspectives — direct to your
            inbox, free.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>

    </div>
  )
}
