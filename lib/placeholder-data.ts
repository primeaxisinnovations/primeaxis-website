import type { Article, Conversation, Service } from '@/types'

// Base articles — 5 articles from the initial editorial set.
// allArticles below is the single source of truth used by the listing page and article templates.
export const articles: Article[] = [
  {
    slug: 'african-blue-economy-financing-gap',
    title: 'Closing the Financing Gap: How Africa Can Unlock Its Blue Economy Potential',
    excerpt:
      'Despite controlling over 38,000 kilometres of coastline and some of the world\'s most productive exclusive economic zones, African nations capture less than 2% of global maritime trade value. A new financing architecture is urgently needed.',
    category: 'Blue Economy',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-06-10',
    readingTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80&fit=crop',
    referenceCode: 'BE-2026-002',
    tags: ['Blue Economy', 'Finance', 'Policy', 'Africa'],
  },
  {
    slug: 'imo-carbon-levy-africa-implications',
    title: 'IMO\'s Carbon Levy: What It Means for African Shipping Operators',
    excerpt:
      'The International Maritime Organization\'s landmark decision to impose a carbon pricing mechanism on international shipping will have asymmetric consequences across the global fleet. African operators, often running older tonnage, face disproportionate compliance costs — and the policy window to address this disparity is closing.',
    category: 'Maritime Policy',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-05-28',
    readingTime: '10 min read',
    featuredImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80&fit=crop',
    referenceCode: 'MP-2026-001',
    tags: ['IMO', 'Carbon', 'Regulation', 'Decarbonisation'],
  },
  {
    slug: 'lekki-deep-sea-port-strategic-significance',
    title: 'Lekki Deep Sea Port: Redefining Nigeria\'s Position in West African Trade Flows',
    excerpt:
      'With its first vessel calls now complete and container throughput climbing ahead of projections, the Lekki Deep Sea Port is emerging as a genuine regional hub. But infrastructure alone does not make a port competitive. We assess the operational, regulatory, and logistics ecosystem challenges that will determine whether Lekki fulfils its promise.',
    category: 'Ports & Infrastructure',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-05-14',
    readingTime: '12 min read',
    featuredImage: 'https://images.unsplash.com/photo-1678182451047-196f22a4143e?w=800&q=80&fit=crop',
    referenceCode: 'PI-2026-001',
    tags: ['Ports', 'Nigeria', 'Infrastructure', 'West Africa'],
  },
  {
    slug: 'cabotage-reform-west-africa',
    title: 'Cabotage Reform Across West Africa: Progress, Pitfalls, and the Path Forward',
    excerpt:
      'Cabotage legislation — designed to reserve coastal trade for nationally flagged vessels — has long been a cornerstone of maritime development policy across West and Central Africa. Yet enforcement remains inconsistent, vessel ownership thin, and foreign operators adept at circumventing the rules. We examine what genuine reform would require.',
    category: 'Shipping & Logistics',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-04-22',
    readingTime: '9 min read',
    featuredImage: 'https://images.unsplash.com/photo-1590496793907-4d66e2994b4d?w=800&q=80&fit=crop',
    referenceCode: 'SL-2026-001',
    tags: ['Cabotage', 'Shipping', 'West Africa', 'Policy'],
  },
  {
    slug: 'port-state-control-abuja-mou-2025-review',
    title: 'Abuja MoU 2025 Annual Review: Detention Rates, Deficiency Trends, and the Road to Compliance',
    excerpt:
      'The Abuja Memorandum of Understanding on Port State Control for West and Central Africa released its 2025 annual report this month, revealing persistent compliance gaps among vessels calling at regional ports. We break down the data, identify the highest-risk flag states, and assess what the trends mean for charterers and P&I clubs operating in the region.',
    category: 'Regulation & Governance',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-04-05',
    readingTime: '11 min read',
    featuredImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80&fit=crop',
    referenceCode: 'RG-2026-001',
    tags: ['Abuja MoU', 'PSC', 'Compliance', 'Governance'],
  },
]

// PLACEHOLDER: articles 6–10 added for layout testing — remove and replace with CMS data when available.
// Temporary featured images — replace with real article photography once received from Nneoma.
export const allArticles: Article[] = [
  ...articles,
  {
    slug: 'gulf-of-guinea-piracy-threat-2025',
    title: 'Gulf of Guinea Piracy in 2025: A Shifted Threat Landscape',
    excerpt:
      'Reported piracy incidents in the Gulf of Guinea declined markedly in 2025, but security analysts caution against premature confidence. The threat has shifted geographically and operationally — and regional navies are still playing catch-up.',
    category: 'Maritime Security',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-06-03',
    readingTime: '7 min read',
    featuredImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80&fit=crop',
    referenceCode: 'MS-2026-001',
    tags: ['Piracy', 'Gulf of Guinea', 'Maritime Security', 'West Africa'],
  },
  {
    slug: 'african-maritime-executives-decarbonisation',
    title: "Decarbonisation or Development? How Africa's Maritime Leaders Are Navigating the Green Transition",
    excerpt:
      'We surveyed 30 senior maritime executives across 12 African countries. The consensus: decarbonisation targets set in Geneva or Brussels do not map cleanly onto the infrastructure realities of Lomé, Lagos, or Luanda.',
    category: 'Executive Perspectives',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-05-20',
    readingTime: '9 min read',
    featuredImage: 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?w=800&q=80&fit=crop',
    referenceCode: 'EP-2026-001',
    tags: ['Decarbonisation', 'Leadership', 'Green Shipping', 'Africa'],
  },
  {
    slug: 'afcfta-maritime-corridor-trade-facilitation',
    title: 'The AfCFTA Maritime Corridor: Trade Facilitation Gaps That Could Stall the Dividend',
    excerpt:
      'The African Continental Free Trade Area holds transformational promise for intra-African maritime trade. But customs harmonisation, port documentation standards, and intermodal connectivity remain unresolved friction points.',
    category: 'Trade & Facilitation',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-05-07',
    readingTime: '8 min read',
    featuredImage: 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?w=800&q=80&fit=crop',
    referenceCode: 'TF-2026-001',
    tags: ['AfCFTA', 'Trade', 'Facilitation', 'Intra-Africa'],
  },
  {
    slug: 'west-africa-freight-market-q2-2026',
    title: 'West Africa Freight Market: Q2 2026 Intelligence Brief',
    excerpt:
      'Freight rates on key West Africa trade lanes stabilised in Q2 2026 following Red Sea-driven volatility, but underlying demand patterns reveal structural shifts in cargo composition that operators ignore at their peril.',
    category: 'Industry Intelligence',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-04-15',
    readingTime: '6 min read',
    featuredImage: 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?w=800&q=80&fit=crop',
    referenceCode: 'II-2026-001',
    tags: ['Freight Rates', 'West Africa', 'Market Intelligence', 'Logistics'],
  },
  {
    slug: 'aquaculture-blue-economy-nigeria-ghana',
    title: 'Aquaculture as a Blue Economy Anchor: Nigeria and Ghana Chart Different Paths',
    excerpt:
      'Nigeria and Ghana have both placed aquaculture at the centre of their respective blue economy strategies. A comparative analysis reveals divergent trajectories — and lessons each country can learn from the other.',
    category: 'Blue Economy',
    author: 'PrimeAxis Intelligence Desk',
    date: '2026-03-28',
    readingTime: '10 min read',
    featuredImage: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80&fit=crop',
    referenceCode: 'BE-2026-001',
    tags: ['Aquaculture', 'Blue Economy', 'Nigeria', 'Ghana'],
  },
]

// PLACEHOLDER PHOTOS: Replace with real executive portraits from Nneoma's asset folder
// once photography is available per the agreed naming convention.
// PLACEHOLDER Q&A: The five Q&A pairs per executive below are editorial placeholders only.
// Replace with verbatim interview transcripts once Nneoma conducts and provides the real conversations.
export const conversations: Conversation[] = [
  {
    slug: 'dr-pius-akutah-nigerian-shippers-council',
    executiveName: 'Dr. Pius Akutah, MON',
    title: "Building the Shipper's Voice in a Fragmented Market",
    position: 'Executive Secretary/CEO',
    organisation: "Nigerian Shippers' Council",
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80&fit=crop',
    initials: 'PA',
    excerpt:
      'Dr. Pius Akutah on cargo clearance efficiency, cabotage enforcement, freight rate transparency, and why the shipper must occupy a more central position in shaping Nigeria\'s maritime trade policy.',
    date: '2026-06-01',
    transcriptRef: 'EC-2026-003',
    qa: [
      {
        question: 'Cargo clearance times at Nigerian ports remain a competitive disadvantage for shippers. What concrete progress has the Council made, and where does the work remain unfinished?',
        answer: 'We have seen measurable improvement in container dwell times at Apapa in recent periods, driven primarily by the electronic call-up system and improved pre-arrival documentation protocols the Council has been instrumental in advancing. Where we are today, however, is still not a competitive position — leading ports in Asia clear cargo in a fraction of the time — and Nigerian traders absorb that differential across every import and export transaction. Our current focus is advancing pre-arrival documentation filing as standard practice — targeting submission well ahead of vessel arrival — so that customs assessment begins before cargo reaches the terminal. The coordination required between the Council, Nigeria Customs Service, and the Nigerian Ports Authority to deliver this consistently remains our primary implementation bottleneck.',
      },
      {
        question: 'The Coastal and Inland Shipping (Cabotage) Act has been in place for over two decades with limited impact on domestic vessel ownership. What amendments does the Council consider most critical?',
        answer: "The Act's waivers mechanism has effectively become the instrument through which its intent is systematically circumvented — foreign vessels routinely secure waivers to trade on cabotage routes because qualifying Nigerian tonnage simply does not exist to fill the gap. Breaking this cycle requires simultaneous action on two fronts: tightening waiver criteria and deploying the Cabotage Vessel Financing Fund at meaningful scale to enable Nigerian operators to actually acquire compliant vessels. The CVFF has been collected but not disbursed at the volumes the sector requires, and that is the central structural failure. The amendments we are advocating introduce mandatory CVFF deployment timelines and sunset provisions on waivers that create genuine commercial incentives for domestic shipowners rather than perpetual foreign substitution.",
      },
      {
        question: 'There has been longstanding discussion about the coordination dynamic between the Nigerian Shippers\' Council and NIMASA. How would you characterise the current working relationship?',
        answer: 'The challenge is institutional rather than personal — both agencies have legitimate mandates that intersect at specific points in the maritime value chain, and we have not historically had the formal protocols to manage those intersections efficiently. When one agency issues a levy circular without consulting the other, the shipper is the one absorbing the cost of that misalignment. We are working through the Federal Ministry of Marine and Blue Economy to establish a structured inter-agency coordination framework with defined consultation requirements before policy decisions affecting cargo owners are implemented. Progress is real, but converting framework goodwill into operational protocols takes sustained effort on both sides.',
      },
      {
        question: 'The shipper has historically been a less powerful policy voice relative to shipping lines and terminal operators. How is that changing?',
        answer: "The shipper is the originating economic actor in the maritime chain — without cargo owners, there are no ships, no terminals, no freight forwarders — yet shippers have historically held policy influence disproportionately low relative to that role. The Council's function is to aggregate a diffuse constituency and give it a coherent, evidence-based voice at every forum where maritime policy is made. A significant part of our current advocacy focuses on freight rate transparency — pushing for shipping lines calling Nigerian ports to make their rate structures accessible to cargo owners, a basic information right that has historically been denied to African shippers. We are also extending our advocacy into demurrage dispute resolution, where the structural information asymmetry between global shipping lines and Nigerian importers produces significant and largely hidden costs.",
      },
      {
        question: 'Where do you want to see the Nigerian Shippers\' Council in five years, and what would that success look like?',
        answer: "I want the Council to be Africa's leading model for cargo owner advocacy — resolving freight disputes in days rather than months, publishing real-time maritime intelligence that genuinely informs commercial decisions, and demonstrably reducing the freight cost premium Nigerian shippers pay relative to comparable markets. That premium is real, measurable, and significant, and closing it would be the most direct contribution any maritime institution could make to Nigerian export competitiveness right now. Achieving it will require deeper technical capacity, better data systems, and — frankly — a willingness to take positions that challenge well-resourced commercial interests when the evidence demands it.",
      },
    ],
  },
  {
    slug: 'captain-sunday-umoren-abuja-mou',
    executiveName: 'Capt. Sunday M. Umoren',
    title: 'Port State Control as a Tool for Regional Maritime Development',
    position: 'Secretary-General',
    organisation: 'Abuja MoU on Port State Control for West and Central Africa',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop',
    initials: 'SU',
    excerpt:
      'Captain Umoren on harmonising port state control inspection standards across West and Central Africa, engaging sub-standard flag states, and what genuine regional PSC cooperation must look like in practice.',
    date: '2026-05-15',
    transcriptRef: 'EC-2026-002',
    qa: [
      {
        question: 'The Abuja MoU covers 22 member states with widely varying maritime administration capacity. How do you maintain consistent inspection standards across that diversity?',
        answer: 'Harmonisation through capacity investment is the only approach that produces results — mandating consistent standards without supporting the capacity to deliver them generates the appearance of compliance, not its substance. We have put significant numbers of port state control officers through the secretariat\'s training programme in recent years, and our shared regional database now gives any member state instant access to a vessel\'s full inspection history before it enters their waters. The variance in inspection quality across member states remains significant, and I will not pretend otherwise. But the states that received the most concentrated technical assistance in earlier cycles now consistently produce some of our strongest inspection outcomes, which tells us the investment model works.',
      },
      {
        question: 'Detention rates in the region remain elevated relative to other MoU regions. What deficiency patterns concern you most, and what do they reveal about the fleet trading in African waters?',
        answer: 'Life-saving appliances, fire protection systems, and navigational equipment consistently account for the majority of serious deficiencies across our reporting cycles, and the persistence of this pattern is diagnostic. It tells us the fleet trading in African waters is disproportionately older tonnage operating on constrained margins, flagged under administrations that may not be conducting meaningful periodic surveys. We engage flag states with persistently high deficiency rates through targeted concentrated inspection campaigns and direct diplomatic communications from the secretariat. The commercial pressure available to us is increasingly useful: P&I clubs and informed charterers monitor PSC records closely, and the reputational cost of frequent detentions is beginning to register with vessel operators in ways that enforcement alone cannot achieve.',
      },
      {
        question: "Mauritania's accession expanded the MoU's reach. How are you thinking about the organisation's future geographic footprint?",
        answer: "Mauritania's accession was significant for what it signals about the MoU's relevance beyond the Gulf of Guinea core, and we are in active dialogue with North African maritime administrations about coordination at the boundary between our mandate and the Mediterranean MoU's. My honest position on further geographic expansion, however, is that quality must precede coverage in our sequencing — I would rather consolidate the rigour of inspection and enforcement across our existing membership than extend the footprint faster than our secretariat capacity and training infrastructure can actually support. A credible regional PSC body with 22 committed member states outweighs a nominal one with 30.",
      },
      {
        question: 'How does the MoU\'s enforcement work connect to the broader maritime safety and environmental protection agenda in the region?',
        answer: 'PSC is the last enforcement line in a safety architecture that should also include robust flag state oversight, credible classification society surveys, and informed commercial pressure from charterers — and its power is amplified when it functions as part of a coherent system rather than as a substitute for those other mechanisms. We incorporated MARPOL compliance into our inspection protocols with significantly greater rigour over the last two reporting years, and we are seeing genuine improvement in pollution prevention equipment compliance as a result. This suggests that consistent, focused inspection does translate into fleet behaviour change when it is sustained across multiple reporting periods and multiple ports.',
      },
      {
        question: 'What would you most want the international maritime community to understand about the Abuja MoU\'s work and its significance?',
        answer: 'That the work being done here is technically serious, not ceremonial — we inspect thousands of vessels each reporting cycle, have detained vessels that posed genuine threats to seafarer safety, and are building a regional fleet intelligence picture that did not previously exist. What we lack is the resource base to match the growing volume of vessel calls into our member state ports: inspection capacity has not kept pace with trade growth. The case for closing that gap through investment from member states, the international community, and the IMO\'s technical cooperation programmes is straightforward — safer shipping in African waters is not a regional interest, it is a global one.',
      },
    ],
  },
  {
    slug: 'dr-kevin-okonna-maritime-academy-nigeria',
    executiveName: 'Dr. Kevin Okonna',
    title: 'Reengineering Maritime Education for the Blue Economy Era',
    position: 'Acting Rector',
    organisation: 'Maritime Academy of Nigeria (MAN), Oron',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&fit=crop',
    initials: 'KO',
    excerpt:
      'Dr. Okonna on transforming seafarer training curricula for STCW compliance, closing the gap between academic qualification and operational readiness, and positioning Nigerian seafarers as first-choice crew in global maritime markets.',
    date: '2026-04-28',
    transcriptRef: 'EC-2026-001',
    qa: [
      {
        question: 'The Maritime Academy of Nigeria has trained thousands of seafarers over its history. What is the most honest assessment of the gap between your graduates\' qualifications and what the global crewing market actually demands?',
        answer: 'The formal qualification gap is manageable — our STCW certification process satisfies the letter of international requirements. The practical competency gap is more significant and harder to close: our simulators are dated relative to the equipment our graduates will encounter on a modern vessel, our training vessels are not representative of the contemporary fleet, and some instructors have not maintained recent operational sea time. The consequence is graduates who can pass certification exams but who need more time than they should to develop full operational confidence — and in a competitive crewing market, that transition gap has direct commercial consequences for the candidates and for Nigeria\'s reputation as a crewing source.',
      },
      {
        question: 'STCW sets the regulatory floor for seafarer certification. How does the Academy position itself above that minimum standard?',
        answer: 'STCW was designed as a floor, and institutions that train only to that floor produce seafarers whose competitiveness ceiling is structurally limited from the start. Quality above the baseline means simulation training that places cadets under realistic operational stress before their first vessel assignment; maritime English and communication training at the level international ship managers actually expect from officers rather than ratings; and leadership development that explicitly prepares graduates for the senior officer track rather than entry-level positions only. We are working with NIMASA to secure the infrastructure investment that makes this level of training deliverable — the intent is clear and the roadmap is documented, but the constraint is capital.',
      },
      {
        question: 'What international academic partnerships is the Academy developing, and what do you want those partnerships to actually deliver for your graduates?',
        answer: 'We have an existing relationship with the World Maritime University through the IMO\'s technical cooperation framework, and we are exploring closer engagement that would benefit qualifying MAN graduates seeking advanced maritime education internationally. Beyond WMU, we are in dialogue with a range of international maritime education providers about specialist short courses and advanced programming for our graduates. The principle underlying all of these is the same: MAN qualifications should function as a credible foundation for further international study, not as a terminal credential that closes opportunities — and meeting that standard requires our academic outputs to be genuinely comparable with international peers.',
      },
      {
        question: 'Nigerian seafarers have a strong reputation in certain market segments. What would it take to elevate that reputation to first-choice crew status across the board?',
        answer: 'Reputation in the crewing market compounds through three mechanisms: consistent performance, documentation integrity, and the network effects of satisfied ship managers recommending your seafarers to peers. Nigerian seafarers have demonstrated genuine competence — particularly on offshore support vessels and certain bulk carrier operations — and that has created pockets of real commercial demand. Converting those pockets into a sector-spanning preference requires, first, that our certification systems are credible and internationally trusted (NIMASA has made material improvements here), and second, that our graduates perform well enough in their initial positions that the ship manager wants to hire another MAN-trained seafarer. That word-of-mouth dynamic scales faster than any formal marketing effort once the baseline quality is consistently established.',
      },
      {
        question: 'The Academy\'s physical infrastructure requires significant capital investment. What scale of investment is needed, and how are you approaching the funding challenge?',
        answer: 'Our capital investment framework identifies a substantial multi-year programme of priority infrastructure upgrades — accommodation facilities, simulation equipment, training vessels, and laboratory systems that reflect the maritime industry we are training people to serve rather than the one that existed when much of this infrastructure was originally commissioned. The funding pathway is three-part: federal budgetary allocations, which we are actively advocating for through the Ministry; NIMASA\'s statutory maritime fund allocation; and industry partnership arrangements that offer sponsors access to a pipeline of trained seafarers in exchange for facility capital support. Several Nigerian and international maritime companies have expressed serious interest in that last category, and we are working through the governance framework to make those arrangements operational. An Academy that cannot modernise its infrastructure will produce graduates who are not competitive — and that is a failure not just of this institution but of the sector\'s capacity development ambitions as a whole.',
      },
    ],
  },
]

export const services: Service[] = [
  {
    title: 'Strategic Communications',
    description:
      'We develop and execute communications strategies that position maritime organisations, regulators, and blue economy institutions as authoritative voices in their sectors — shaping how stakeholders, investors, and policymakers perceive and engage with them.',
    icon: 'megaphone',
    outcomes: [
      'Defined institutional positioning and messaging architecture',
      'Coordinated multi-channel communication programmes',
      'Crisis communications protocols and rapid response frameworks',
      'Stakeholder-mapped engagement calendars',
    ],
  },
  {
    title: 'Thought Leadership Development',
    description:
      'We help executives and institutions build sustained intellectual authority through high-quality publications, commentary, and speaking engagements — moving organisations from reactive responders to proactive shapers of industry discourse.',
    icon: 'lightbulb',
    outcomes: [
      'Executive positioning strategy and voice development',
      'Long-form intelligence reports and white papers',
      'Op-ed and commentary placement in maritime publications',
      'Conference speech writing and presentation coaching',
    ],
  },
  {
    title: 'Maritime Research & Intelligence',
    description:
      'We produce original research on African maritime markets, trade flows, regulatory environments, and blue economy opportunities — providing the evidence base that informs strategic decisions at the institutional and executive level.',
    icon: 'chart',
    outcomes: [
      'Custom market intelligence reports and sector analyses',
      'Regulatory landscape mapping across African jurisdictions',
      'Trade route and cargo flow analysis',
      'Policy impact assessments and scenario modelling',
    ],
  },
  {
    title: 'Stakeholder Engagement',
    description:
      'We design and manage structured engagement programmes that build the multi-sector relationships maritime organisations need to advance policy, secure partnerships, and achieve strategic objectives.',
    icon: 'handshake',
    outcomes: [
      'Stakeholder mapping and influence analysis',
      'Structured dialogue and roundtable facilitation',
      'Government and regulatory engagement programmes',
      'Industry coalition building and coordination',
    ],
  },
  {
    title: 'Event Communications',
    description:
      'We provide end-to-end communications support for maritime conferences, summits, and industry gatherings — from pre-event content strategy and media coordination to post-event knowledge capture and dissemination.',
    icon: 'calendar',
    outcomes: [
      'Event narrative and content strategy',
      'Speaker and programme communications',
      'Media accreditation and press management',
      'Post-event reporting and follow-through communications',
    ],
  },
  {
    title: 'Content & Media Advisory',
    description:
      'We advise maritime institutions on building the editorial capabilities, content systems, and media relationships needed to sustain long-term communications impact without dependence on external agencies for every output.',
    icon: 'pen',
    outcomes: [
      'Editorial strategy and content calendar development',
      'In-house communications team capacity building',
      'Media relationship development and placement strategy',
      'Digital content architecture and channel strategy',
    ],
  },
]
