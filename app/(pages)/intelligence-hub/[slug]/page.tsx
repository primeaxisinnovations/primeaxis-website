import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { allArticles } from '@/lib/placeholder-data'
import { formatDate } from '@/lib/utils'
import AnimatedSection from '@/components/ui/AnimatedSection'
import Tag from '@/components/ui/Tag'
import ArticleCard from '@/components/ui/ArticleCard'

// TODO: update with live domain before launch
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://primeaxis.africa'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return allArticles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = allArticles.find((a) => a.slug === slug)
  if (!article) return {}
  return {
    title: `${article.title} | PrimeAxis Maritime Intelligence`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featuredImage }],
    },
  }
}

// PLACEHOLDER: Category-keyed body paragraphs — replace with full article content from Nneoma.
// Each array maps to 4 paragraphs rendered below the lead excerpt.
function getPlaceholderBody(category: string): string[] {
  const bodies: Record<string, string[]> = {
    'Blue Economy': [
      `Africa's blue economy represents one of the continent's most underexploited strategic assets. Spanning fisheries, aquaculture, maritime transport, coastal tourism, and offshore energy, the sector is estimated to contribute over $300 billion annually to global GDP — yet African nations capture a fraction of the value generated from their own exclusive economic zones. The structural barriers are well-documented: fragmented regulatory environments, thin domestic shipping capacity, and chronic underinvestment in port and logistics infrastructure.`,
      `The financing landscape presents the most immediate constraint. Development finance institutions such as the African Development Bank and the International Finance Corporation have significantly expanded their blue economy portfolios in recent years, but project pipelines remain shallow. Private capital — particularly institutional investors with long-horizon mandates — has yet to engage meaningfully with blue economy assets in Africa. Risk perception, currency exposure, and the absence of bankable project structures are the primary deterrents.`,
      `Regional coordination offers the most promising near-term lever. The AU's 2050 Africa Integrated Maritime Strategy and the more recent Africa Blue Economy Strategy provide normative frameworks, but implementation remains uneven. Countries that have made genuine progress — Seychelles with its debt-for-nature swap, Mauritius with its Ocean Economy Roadmap — have benefited from strong institutional commitment and targeted technical assistance that most continental peers have yet to replicate.`,
      `The window for establishing Africa's position in the emerging global blue economy is not indefinite. As decarbonisation reshapes maritime trade routes and offshore energy investment accelerates, early movers will capture disproportionate long-term value. Policymakers, development financiers, and private sector actors all have a role to play — but coordination and urgency are equally essential to seizing this moment.`,
    ],
    'Maritime Policy': [
      `Maritime policy in Africa sits at the intersection of sovereign interest, regional integration imperatives, and international regulatory obligations — a space that requires sustained diplomatic and technical engagement that many African flag states have historically struggled to maintain. The resulting policy gaps have consequences extending well beyond the maritime sector, affecting trade competitiveness, national security, and blue economy ambitions.`,
      `The International Maritime Organization remains the primary venue for shaping the regulatory framework governing international shipping. African member states collectively account for a significant share of IMO membership, but their influence on key deliberations has historically been limited by capacity constraints and coordination challenges. A more strategic approach to bloc coordination is needed if African interests are to be meaningfully reflected in the global maritime regulatory architecture.`,
      `At the regional level, instruments such as the Abuja Convention and the Djibouti Code of Conduct reflect genuine political will to address maritime governance collectively. But translating these frameworks into credible enforcement — with adequate resource allocation and genuine inter-agency coordination — remains the central challenge. The most effective national maritime administrations on the continent share common features: consistent political support, dedicated funding, and systematically built technical capacity.`,
      `The policy environment facing African maritime stakeholders is also increasingly shaped by global decarbonisation mandates. IMO's revised GHG strategy, the Carbon Intensity Indicator regime, and the emerging FuelEU Maritime framework will all have material implications for African shipping operators. Proactive engagement with these regulatory developments — rather than reactive adaptation — is the only path to protecting African interests in a rapidly evolving policy landscape.`,
    ],
    'Ports & Infrastructure': [
      `Sub-Saharan Africa's port infrastructure deficit is both well-documented and chronically underestimated. World Bank Logistics Performance Index data consistently places African ports among the lowest-ranked globally on key metrics — vessel turnaround time, container dwell time, and cargo handling efficiency. The commercial consequences are severe: African shippers pay a significant premium relative to global benchmarks, a structural cost disadvantage that compounds across supply chains and reduces continental export competitiveness.`,
      `Investment in new port capacity is accelerating, driven by a combination of state-backed financing, sovereign wealth fund interest, and private terminal operators seeking exposure to high-growth markets. Lekki, Tema, Dar es Salaam, and Lamu all represent significant capacity additions. But infrastructure investment alone is insufficient. The operational ecosystem surrounding a port — customs administration, freight forwarding services, inland transport connectivity, and regulatory clarity — determines whether physical capacity translates into commercial throughput.`,
      `Hinterland connectivity is the most consistent constraint. Road and rail corridors linking port cities to major production and consumption centres remain inadequate in most coastal African countries. Investments in port infrastructure not accompanied by proportionate investment in inland logistics risk generating stranded assets — expensive facilities that cannot operate efficiently because the surrounding network cannot absorb their capacity.`,
      `The competitive dynamics between major African ports are intensifying. As new capacity comes online, the question of which ports emerge as true regional transhipment hubs — and which remain gateway ports serving their immediate hinterlands — will be determined by a combination of operational performance, regulatory environment, and carrier network decisions. Ports that demonstrate consistent, competitive service delivery will attract liner service upgrades; those that cannot will face a difficult structural position in an increasingly competitive market.`,
    ],
    'Shipping & Logistics': [
      `Africa's position in global shipping is defined by an asymmetry that has persisted for decades: the continent generates a significant and growing share of global maritime trade, yet African-owned and flagged vessels carry a minimal fraction of that cargo. The cabotage regimes that most coastal African states have enacted — intended to reserve coastal trade for domestically registered vessels — have produced mixed results, often hampered by thin domestic shipping capacity and inconsistent enforcement.`,
      `Freight rate dynamics have added complexity to the operating environment for African shippers. The post-COVID normalisation of global container rates was disrupted by Red Sea security challenges that forced significant rerouting via the Cape of Good Hope, adding transit time and cost to trade lanes serving the Middle East, South Asia, and Southeast Asia. For West African importers the net effect was manageable; for East African trade, the disruption was more pronounced.`,
      `The logistics sector supporting maritime trade is undergoing structural transformation across the continent. The growth of freight forwarding aggregators, digital customs platforms, and multimodal booking systems is gradually reducing the informational asymmetries that have historically made African trade more costly and opaque than comparable routes elsewhere. But adoption is uneven, and the benefits are accruing disproportionately to larger shippers with the capital to invest in digital logistics infrastructure.`,
      `Supply chain resilience has emerged as a strategic priority for African importers following the disruptions of recent years. For maritime stakeholders, this translates into renewed interest in regional cargo consolidation, bonded warehouse infrastructure, and alternative port access routes that reduce dependence on single transit points. The longer-term infrastructure investments required to deliver genuine supply chain resilience are substantial, but the business case is increasingly compelling.`,
    ],
    'Maritime Security': [
      `The Gulf of Guinea's piracy threat has evolved significantly over the past five years, defying simple characterisation. The period of peak incidence — between 2019 and 2021, when the region accounted for the majority of global maritime kidnapping events — reflected a particular operational model: armed attack, crew hostage-taking, and ransom payment as the primary revenue mechanism. The subsequent decline in reported incidents was partly attributable to improved naval patrolling and deterrence effects from privately contracted armed security personnel.`,
      `The threat has not been eliminated; it has shifted. Crew kidnappings from vessels at anchor in Nigerian anchorages, smaller-scale theft operations in the Niger Delta, and the increasing sophistication of armed groups operating in coastal waters all reflect adaptive criminal enterprises rather than a fundamentally weakened threat environment. Intelligence-sharing among regional maritime agencies remains inconsistent, limiting the effectiveness of coordinated response.`,
      `Naval capacity development is progressing across the region, though at varying speeds and with uneven institutional quality. Nigeria's maritime security architecture has received significant investment through the Deep Blue Project, introducing maritime patrol aircraft and interceptor vessels. Ghana, Côte d'Ivoire, and Cameroon have also increased their maritime security expenditure. But hardware investment without commensurate investment in maintenance, training, and operational doctrine delivers limited security outcomes.`,
      `The long-term trajectory of Gulf of Guinea maritime security will be determined as much by socio-economic and governance factors ashore as by naval capability developments at sea. Piracy in the region has historically been closely correlated with domestic instability, unemployment, and limited economic opportunity in coastal communities. Security sector investment not accompanied by genuine attention to these underlying drivers will produce temporary displacement rather than durable threat reduction.`,
    ],
    'Trade & Facilitation': [
      `The African Continental Free Trade Area represents the most ambitious integration project in the continent's history, with the potential to reshape intra-African trade flows fundamentally. For the maritime sector, genuine trade facilitation under AfCFTA would require not only tariff reduction and rules-of-origin harmonisation, but a wholesale rationalisation of the documentation, customs, and logistics systems that currently impose friction costs at every point in the supply chain.`,
      `The current state of intra-African trade facilitation presents a paradox. Africa's major ports are increasingly connected to global liner services, with direct calls from major shipping lines now the norm at hub ports. Yet intra-African maritime trade — particularly short-sea shipping between neighbouring coastal states — remains chronically underdeveloped. The barriers are partly infrastructural, partly regulatory, and partly commercial: small lot sizes, inconsistent demand, and port fees structured around large vessel calls all work against the economics of regional feeder services.`,
      `Customs harmonisation is the most complex and politically sensitive element of the facilitation agenda. The revenue implications of tariff liberalisation are significant for states that depend heavily on import duties, creating genuine implementation resistance. Single window systems, pre-arrival processing, and risk-based inspection regimes have been adopted with varying commitment across the continent, and the gap between best-practice implementation and laggard states is wide.`,
      `The digitisation of trade documentation offers the clearest near-term efficiency opportunity. Electronic bills of lading, digital certificates of origin, and interoperable customs data systems would significantly reduce dwell times and administrative costs across African trade corridors. Several regional economic communities are actively pursuing digital trade infrastructure frameworks, and the momentum — while slow relative to the opportunity — is genuine.`,
    ],
    'Industry Intelligence': [
      `The West Africa freight market entered 2026 with a degree of stability that would have seemed improbable eighteen months earlier. The rerouting of significant cargo volumes away from the Red Sea during the security disruptions of 2023–2024 had introduced structural congestion on Cape route services, temporarily inflating freight rates on North-South trade lanes. As security conditions in the Red Sea showed tentative signs of improvement, carriers faced complex network decisions about whether to restore Suez routing — with significant implications for Cape route capacity and West Africa rate trajectories.`,
      `Container import demand across the Gulf of Guinea remained relatively firm through the first half of 2026, driven by consumer goods, building materials, and automotive sector imports into Nigeria, Ghana, and Côte d'Ivoire. The agricultural export side presents a more mixed picture: cocoa, palm oil, and rubber exports face pricing headwinds from global commodity market dynamics, and currency depreciation across several West African economies has complicated export economics for commodity producers.`,
      `The structural composition of cargo in and out of the region is shifting in ways that have longer-term implications for port infrastructure and carrier network planning. The growth of LNG export capacity, the increasing volume of project cargo associated with renewable energy investment, and the gradual growth of manufactured goods exports — still a small share of total volume but growing from a low base — are all changing the freight mix that regional terminals and logistics providers need to handle.`,
      `Market intelligence for the West Africa freight market is improving, though it remains significantly less robust than equivalent data for Northern European or Asia-Pacific trade lanes. The expansion of industry data providers, the growing sophistication of freight index products covering African corridors, and the development of port authority statistical reporting capacity are all positive developments. Better, more timely market data is essential for the well-informed decisions cargo owners, charterers, and financial institutions need to make.`,
    ],
    'Executive Perspectives': [
      `The senior leadership of Africa's maritime sector faces a strategic environment that is more complex and more consequential than at any previous point in the sector's development. Decarbonisation mandates, digital disruption, evolving security threats, and the transformative potential of AfCFTA are all converging simultaneously — and the decisions being made now about investment, regulation, and institutional positioning will shape outcomes for decades.`,
      `The divergence between publicly stated strategic ambitions and operational realities on the ground remains one of the most persistent features of the African maritime leadership landscape. National maritime policies articulate compelling visions of blue economy development, domestic shipping growth, and world-class port performance. But the institutional systems, funding mechanisms, and sustained political will needed to translate those visions into outcomes are often absent or inconsistent.`,
      `Talent development is emerging as the most frequently cited medium-term concern among senior maritime executives on the continent. The technical and managerial skills required to operate modern port facilities, comply with increasingly complex regulatory requirements, and manage sophisticated maritime logistics operations are in genuinely short supply. Maritime academies across the continent are producing graduates, but the gap between formal qualification and operational readiness — particularly in specialist areas — is significant.`,
      `The executives who are most effectively navigating this environment share several characteristics: a clear, evidence-based understanding of their organisation's position within the broader maritime value chain; strong relationships with both domestic political stakeholders and the international maritime community; and a willingness to invest in organisational capacity even when short-term financial pressures argue for deferral. These qualities are not easily replicable through policy intervention, but cultivating them more systematically is essential to the sector's development.`,
    ],
    'Regulation & Governance': [
      `Port State Control remains the most consequential regulatory instrument applied to shipping in African waters, with direct implications for vessel owners, operators, flag administrations, and the commercial parties relying on maritime transport to move cargo. The Abuja MoU on Port State Control for West and Central Africa provides the institutional framework for coordinated inspection and enforcement across the region, but the gap between the framework's design and its operational implementation has historically been wide.`,
      `Detention rates provide the most direct proxy for fleet safety standards on routes calling at regional ports. The 2025 Abuja MoU annual report reveals persistent concentrations of deficiencies in specific categories: life-saving appliances, fire detection and suppression systems, and navigational equipment account for a disproportionate share of recorded deficiencies. These patterns concentrate in flag administrations with limited oversight capacity and among vessel owners operating older tonnage on cost-constrained schedules.`,
      `The commercial implications of Port State Control performance extend beyond the operational disruption of detention. P&I clubs and hull underwriters increasingly incorporate PSC records into their risk assessments, with premium implications for vessels and operators with poor compliance histories. Charterers in certain commodity sectors are also beginning to incorporate PSC performance criteria into vessel vetting requirements, creating a commercial incentive for compliance that complements regulatory enforcement.`,
      `Genuine improvement in Port State Control outcomes requires sustained investment in inspection capacity, training, and information systems — alongside credible political commitment to enforcement at the national level. The Abuja MoU's regional database and harmonised inspection procedures provide a sound technical foundation. What is needed is more consistent institutional follow-through from member state maritime administrations, and greater engagement from the flag states whose vessels account for the majority of serious deficiencies recorded in the region.`,
    ],
    'Strategic Commentary': [
      `Africa's maritime future is not predetermined. The continent sits at a genuine strategic inflection point — one at which the decisions taken by governments, port operators, shipping companies, financiers, and regulators over the next five to ten years will determine whether Africa's maritime sector captures the value embedded in the continent's extraordinary geographical and resource endowments, or continues to play a largely passive role in a global maritime economy shaped elsewhere.`,
      `The diagnosis is broadly agreed. Africa's maritime infrastructure deficit is real and consequential. Regulatory frameworks are fragmented and inconsistently enforced. Domestic shipping capacity is chronically thin. The talent pipeline for maritime technical and managerial roles is insufficient for the sector's ambitions. And the information architecture — the market data, intelligence products, and analytical capacity — needed to support well-informed decision-making is materially underdeveloped.`,
      `What is less agreed is the sequencing and prioritisation of interventions. The temptation in development circles and national maritime administrations is to pursue comprehensive reform programmes simultaneously, on the reasoning that the interlocking nature of maritime sector constraints means partial interventions will fail to generate systemic change. This reasoning is not wrong, but it consistently produces implementation paralysis. The most effective maritime development trajectories in comparable emerging markets have been characterised by concentrated effort on a small number of high-leverage interventions.`,
      `PrimeAxis's analytical perspective on African maritime development begins with this observation: the critical bottleneck is rarely technical. The technical knowledge required to build competitive ports, establish effective maritime administrations, and develop sustainable shipping capacity exists and is increasingly accessible. The binding constraints are political economy and institutional quality — the capacity to make difficult decisions consistently and to sustain implementation against the inevitable pressures for deviation.`,
    ],
  }
  return bodies[category] ?? bodies['Strategic Commentary']
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = allArticles.find((a) => a.slug === slug)
  if (!article) notFound()

  // Related: same-category articles first, filled with most-recent others to reach 3
  const sameCategory = allArticles.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  )
  const otherRecent = allArticles
    .filter((a) => a.slug !== article.slug && a.category !== article.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const related = [...sameCategory, ...otherRecent].slice(0, 3)

  const pageUrl = `${SITE_URL}/intelligence-hub/${article.slug}`
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(article.title)

  const bodyParagraphs = getPlaceholderBody(article.category)

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-border">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 py-3">
          <nav className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-muted flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors duration-150">Home</Link>
            <span>/</span>
            <Link href="/intelligence-hub" className="hover:text-gold transition-colors duration-150">Intelligence Hub</Link>
            <span>/</span>
            <span className="text-ink/50 line-clamp-1 max-w-[300px]">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 py-[60px] max-sm:py-10">

        {/* ── Article Header ─────────────────────────────────── */}
        <AnimatedSection>
          <div className="max-w-[720px] mx-auto mb-10">
            <Tag category={article.category} variant="filled" className="mb-5 inline-block" />
            <h1 className="font-display text-display-md font-bold text-deep leading-[1.1] mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted">
              <span>{article.author}</span>
              <span aria-hidden>·</span>
              <span>{formatDate(article.date)}</span>
              <span aria-hidden>·</span>
              <span>{article.readingTime}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Featured Image ─────────────────────────────────── */}
        <div className="relative w-full aspect-video rounded-sm2 overflow-hidden mb-[60px] max-sm:mb-10">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1240px"
          />
        </div>

        {/* ── Article Body ───────────────────────────────────── */}
        <AnimatedSection delay={100}>
          <div className="max-w-[680px] mx-auto">

            {/* Lead paragraph (excerpt) */}
            <p className="font-sans text-[18px] font-medium text-ink leading-[1.75] mb-7">
              {article.excerpt}
            </p>

            {/* PLACEHOLDER: body paragraphs — replace with full article text from Nneoma */}
            {bodyParagraphs.map((para, i) => (
              <p key={i} className="font-sans text-[16px] text-ink leading-[1.75] mb-6">
                {para}
              </p>
            ))}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-8 mt-8 border-t border-border">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 border border-border text-muted rounded-sm2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Share Row ────────────────────────────────────── */}
            <div className="flex items-center gap-3 pt-8 mt-8 border-t border-border">
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted mr-1">
                Share
              </span>

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
                href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
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

            {/* ── Author Bio ───────────────────────────────────── */}
            <div className="pt-8 mt-8 border-t border-border flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-teal/10 border border-teal/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-teal" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-[10.5px] tracking-[0.15em] uppercase text-gold mb-1">
                  {article.author}
                </p>
                <p className="font-sans text-[13.5px] text-muted leading-relaxed">
                  PrimeAxis Intelligence Desk delivers strategic analysis on Africa&apos;s maritime
                  and blue economy sectors — informing the decisions of executives, regulators,
                  and investors shaping the continent&apos;s maritime future.
                </p>
              </div>
            </div>

          </div>
        </AnimatedSection>

        {/* ── Related Articles ───────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-[80px] pt-[60px] border-t border-border max-sm:mt-14 max-sm:pt-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block w-6 h-0.5 bg-gold mb-3" />
                <h2 className="font-display text-[clamp(20px,2vw,28px)] font-semibold text-deep">
                  Related Intelligence
                </h2>
              </div>
              <Link
                href="/intelligence-hub"
                className="font-mono text-[10px] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors duration-150 hidden sm:block"
              >
                All Articles →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Newsletter CTA ─────────────────────────────────────── */}
      <section className="bg-deep py-[72px] max-sm:py-14">
        <div className="max-w-[600px] mx-auto px-11 max-sm:px-5 text-center">
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
          <div className="flex max-sm:flex-col">
            <input
              type="email"
              placeholder="Your professional email address"
              className="flex-1 font-sans text-[13.5px] px-[18px] py-[13px] border border-white/10 bg-white/5 text-white placeholder:text-white/30 outline-none focus:border-gold transition-colors duration-200"
            />
            <button
              type="submit"
              className="font-sans text-[13px] font-semibold tracking-[.04em] bg-gold text-deep px-6 py-[13px] whitespace-nowrap hover:bg-gold-light transition-colors duration-200"
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
