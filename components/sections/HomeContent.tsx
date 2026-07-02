"use client";

import { useEffect, useRef, useState, ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import ArticleCard from "@/components/ui/ArticleCard";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { CATEGORIES, categoryToSlug } from "@/lib/categories";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { services } from "@/lib/placeholder-data";
import type { Article, Conversation } from "@/types";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

function ArrowRight({ size = 14, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

const CAROUSEL_SLIDES = [
  "/images/Hero-1.png",
  "/images/Hero-1.2.png",
  "/images/Hero-3.png",
];

const FEATURED_BEAT_NAMES = new Set([
  "Maritime Policy",
  "Blue Economy",
  "Ports & Infrastructure",
  "Shipping & Logistics",
  "Maritime Security",
  "Executive Perspectives",
]);
const FEATURED_BEATS = CATEGORIES.filter((c) => FEATURED_BEAT_NAMES.has(c));

const SERVICE_ICONS: Record<string, ReactElement> = {
  megaphone: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  lightbulb: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z"/>
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  handshake: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[26px] h-[26px] stroke-teal">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
    </svg>
  ),
}

interface HomeContentProps {
  featuredArticles: Article[];
  featuredConversation: Conversation | undefined;
  otherConversations: Conversation[];
}

export default function HomeContent({
  featuredArticles,
  featuredConversation,
  otherConversations,
}: HomeContentProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Intersection-observer fade-ins
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".fade-in").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Hero carousel: auto-advance every 5 s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <>
      {/* ── HERO — full-screen fade carousel ──────────────────── */}
      <section
        className="hero-section hero-carousel min-h-screen grid grid-rows-[1fr_auto] bg-deep relative overflow-hidden -mt-[102px]"
      >
        {/* Carousel slides */}
        {CAROUSEL_SLIDES.map((url, i) => (
          <div
            key={url}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{ opacity: i === activeSlide ? 1 : 0, transitionDuration: "1500ms" }}
          >
            {i === 1 ? (
              <>
                {/* Desktop version - slide 2 */}
                <Image
                  src="/images/Hero-1.2.png"
                  alt="PrimeAxis Maritime Intelligence"
                  fill
                  quality={85}
                  sizes="100vw"
                  className="hidden md:block"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  loading="lazy"
                />
                {/* Mobile version - slide 2 */}
                <Image
                  src="/images/hero-1.2-mobile.png"
                  alt="PrimeAxis Maritime Intelligence"
                  fill
                  quality={85}
                  sizes="100vw"
                  className="block md:hidden"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  loading="lazy"
                />
              </>
            ) : (
              <Image
                src={url}
                alt="PrimeAxis Maritime Intelligence"
                fill
                quality={85}
                sizes="100vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
                {...(i === 0 ? { priority: true } : { loading: "lazy" as const })}
              />
            )}
          </div>
        ))}

        {/* Directional gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(21,28,46,.83) 28%, rgba(21,28,46,.20) 100%), linear-gradient(to top, rgba(21,28,46,.75) 0%, transparent 45%)",
          }}
        />

        {/* Decorative SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="1150" cy="450" rx="540" ry="380" stroke="rgba(191,159,102,0.18)" strokeWidth="1" />
          <ellipse cx="1150" cy="450" rx="380" ry="270" stroke="rgba(191,159,102,0.12)" strokeWidth="1" />
          <ellipse cx="1150" cy="450" rx="220" ry="155" stroke="rgba(191,159,102,0.08)" strokeWidth="1" />
          <circle cx="288" cy="225" r="3.5" fill="rgba(191,159,102,0.4)" />
          <circle cx="576" cy="450" r="2.5" fill="rgba(191,159,102,0.25)" />
          <circle cx="288" cy="675" r="2" fill="rgba(191,159,102,0.2)" />
          <g transform="translate(1360,80)" opacity="0.2">
            <circle cx="0" cy="0" r="22" stroke="rgba(191,159,102,1)" strokeWidth="0.8" fill="none" />
            <circle cx="0" cy="0" r="8" stroke="rgba(191,159,102,1)" strokeWidth="0.8" fill="none" />
          </g>
          <path d="M 0 620 Q 360 480 720 520 T 1440 440" stroke="rgba(191,159,102,0.07)" strokeWidth="1.2" fill="none" strokeDasharray="8 6" />
          <path d="M 0 680 Q 480 540 960 580 T 1440 500" stroke="rgba(191,159,102,0.05)" strokeWidth="1" fill="none" strokeDasharray="6 8" />
        </svg>

        {/* Main hero content — pt accounts for breaking bar (38px) + header (64px) */}
        <div className="relative z-[2] flex items-center pt-[200px] pb-20 max-sm:pt-[150px] max-sm:pb-12">
          <div className="max-w-[1240px] mx-auto px-11 max-md:px-5 w-full">
            <div className="max-w-[720px] mx-auto">
              <h1 className="hero-headline-anim font-display text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.18] text-white mb-5 text-center max-w-[780px] mx-auto">
                The Platform Shaping{" "}
                <br />
                <span style={{ color: "#c8a96e" }}>Africa&apos;s Maritime Narrative</span>
              </h1>

              <p className="hero-standfirst-anim text-[16.5px] font-light leading-[1.7] text-white/60 max-w-[520px] mx-auto mb-11 text-center">
                PrimeAxis is Africa&apos;s maritime intelligence and strategic communications platform — where executives engage, narratives are shaped, and industry authority is built. Insight that informs. Media that matters.
              </p>

              <div className="hero-actions-anim flex gap-3 flex-wrap justify-center">
                <Link
                  href="/intelligence-hub"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.06em] text-deep bg-gold px-7 py-[13px] hover:bg-gold-l hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(191,159,102,.28)] transition-all duration-200"
                >
                  Explore Insights
                  <ArrowRight strokeWidth={2.5} />
                </Link>
                <Link
                  href="/executive-conversations"
                  className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[.04em] text-white/75 border border-white/20 px-7 py-[13px] hover:border-gold hover:text-gold hover:-translate-y-[2px] transition-all duration-200"
                >
                  Join the Conversation
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel navigation dots */}
        <div className="absolute bottom-24 left-0 right-0 z-[3] flex justify-center items-center gap-2 max-sm:hidden">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`btn-bare h-[5px] transition-all duration-300 ${
                i === activeSlide
                  ? "w-6 bg-gold"
                  : "w-[5px] rounded-full bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

      </section>

      {/* ── BEATS / TOPIC NAVIGATION ──────────────────────────── */}
      {/* Solid dark-card treatment on the 6 regular tiles — no real
          photography here, so the earlier glass-effect test never had
          anything genuine to blur. Flat bg-teal (not a teal→deep diagonal
          gradient) on purpose: 6 small adjacent tiles each running their
          own diagonal gradient created a busy repeating-sawtooth look at
          this scale — the gradient reads better on the larger Vision &
          Mission / Services cards. "All Categories" 7th tile keeps its
          existing gold treatment, completely untouched. No blur, no
          transparency, no texture. */}
      <div className="bg-white border-t-2 border-brd border-b-2" id="topics">

        {/* Mobile / Tablet — horizontal scroll with right-edge fade + chevron */}
        <div className="relative lg:hidden">
          <div className="flex items-stretch overflow-x-auto scrollbar-none">
            {FEATURED_BEATS.map((category) => (
              <Link
                key={category}
                href={`/intelligence-hub?category=${categoryToSlug(category)}`}
                className="group flex flex-col items-center justify-center gap-[7px] py-[22px] px-8 border-r border-white/10 bg-teal hover:border-gold/40 flex-shrink-0 cursor-pointer transition-colors duration-200 relative"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gold transition-colors duration-200" />
                <div className="w-8 h-8 border border-white/15 flex items-center justify-center transition-colors duration-200 group-hover:border-gold text-gold">
                  {CATEGORY_ICONS[category]}
                </div>
                <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-white/70 group-hover:text-white text-center leading-[1.3] transition-colors duration-200">
                  {category}
                </span>
              </Link>
            ))}
            {/* All Categories — mobile */}
            <Link
              href="/intelligence-hub"
              className="group flex flex-col items-center justify-center gap-[7px] py-[22px] px-8 flex-shrink-0 cursor-pointer bg-gold/10 border-l-2 border-gold/40 hover:bg-gold/20 transition-colors duration-200 relative"
            >
              <div className="w-8 h-8 border border-gold/50 flex items-center justify-center text-gold transition-colors duration-200 group-hover:border-gold">
                <LayoutGrid size={14} />
              </div>
              <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-gold font-medium text-center leading-[1.3] transition-colors duration-200 whitespace-nowrap">
                All Categories
              </span>
            </Link>
          </div>
          {/* Scroll indicator — fade + pulsing chevron */}
          <div className="absolute right-0 top-0 bottom-0 w-[60px] pointer-events-none bg-gradient-to-l from-white to-transparent flex items-center justify-end pr-3">
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="text-gold animate-pulse"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {/* Desktop — 7 tiles in a single row, no scroll */}
        <div className="hidden lg:flex items-stretch max-w-[1440px] mx-auto">
          {FEATURED_BEATS.map((category) => (
            <Link
              key={category}
              href={`/intelligence-hub?category=${categoryToSlug(category)}`}
              className="group flex-1 flex flex-col items-center justify-center gap-[7px] py-[22px] px-4 border-r border-white/10 bg-teal hover:border-gold/40 cursor-pointer transition-colors duration-200 relative"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gold transition-colors duration-200" />
              <div className="w-7 h-7 border border-white/15 flex items-center justify-center transition-colors duration-200 group-hover:border-gold text-gold">
                {CATEGORY_ICONS[category]}
              </div>
              <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-white/70 group-hover:text-white text-center leading-[1.3] transition-colors duration-200 whitespace-nowrap">
                {category}
              </span>
            </Link>
          ))}
          {/* All Categories — desktop */}
          <Link
            href="/intelligence-hub"
            className="group flex-1 flex flex-col items-center justify-center gap-[7px] py-[22px] px-4 bg-gold/10 border-l-2 border-gold/40 hover:bg-gold/20 transition-colors duration-200 relative"
          >
            <div className="w-7 h-7 border border-gold/50 flex items-center justify-center text-gold transition-colors duration-200 group-hover:border-gold">
              <LayoutGrid size={13} />
            </div>
            <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-gold font-medium text-center leading-[1.3] transition-colors duration-200 whitespace-nowrap">
              All Categories
            </span>
          </Link>
        </div>

      </div>

      {/* ── INTELLIGENCE GRID ─────────────────────────────────── */}
      <section className="py-[88px] bg-cream max-sm:py-14 scroll-mt-[100px]" id="intelligence">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <div className="fade-in flex items-end justify-between mb-12 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold">Featured Intelligence</span>
              <h2 className="font-display text-[clamp(24px,2.6vw,36px)] font-semibold text-deep leading-[1.15] mt-2.5">
                Analysis & Insight for
                <br />
                the Industry That Moves Africa
              </h2>
            </div>
            <Link href="/intelligence-hub" className="font-mono text-[10.5px] tracking-[.14em] uppercase text-teal flex items-center gap-[7px] pb-1 whitespace-nowrap hover:gap-[13px] hover:text-gold transition-all duration-200">
              All Intelligence <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="standard" className="fade-in" />
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE CONVERSATIONS ───────────────────────────── */}
      {/* Never pads with fake content — if there's no real published
          conversation at all, the section doesn't render. */}
      {featuredConversation && (
        <section
          className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[600px] scroll-mt-[100px]"
          id="conversations"
          style={{ background: "#0d1b2a" }}
        >
          {/* LEFT ─ editorial copy */}
          <div className="fade-in flex flex-col justify-between p-[64px_56px] max-md:p-[48px_28px]">
            <div>
              <div className="flex items-center gap-[14px] mb-8">
                <span className="block w-7 h-[1px] bg-gold" />
                <span className="font-mono text-[10px] tracking-[.2em] uppercase text-gold">
                  Featured Conversation
                </span>
              </div>

              <blockquote className="font-display text-[clamp(20px,2.2vw,28px)] font-normal italic text-white leading-[1.55] mb-10">
                &ldquo;{featuredConversation.pullQuote?.trim() || truncateText(featuredConversation.excerpt, 220)}&rdquo;
              </blockquote>
            </div>

            <div>
              {/* Same frosted-glass-over-dark-scrim recipe as the hero
                  card and the corner badge — one consistent device
                  across all photo-backed surfaces. */}
              <div
                className="flex items-center gap-4 p-[18px_20px] mb-8 border border-white/20 backdrop-blur-md"
                style={{
                  background:
                    "linear-gradient(rgba(255,255,255,0.10), rgba(255,255,255,0.10)), linear-gradient(135deg, rgba(10,20,35,0.58) 0%, rgba(10,20,35,0.34) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
                }}
              >
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0 bg-teal">
                  <span className="font-display text-[16px] font-bold text-[rgba(191,159,102,.5)]">
                    {featuredConversation.initials}
                  </span>
                </div>
                <div>
                  <div className="font-display text-[16px] font-semibold text-white mb-[2px]">
                    {featuredConversation.executiveName}
                  </div>
                  <div className="text-[12.5px] text-white/40 font-light">
                    {featuredConversation.position}, {featuredConversation.organisation}
                  </div>
                </div>
              </div>

              <p className="text-[14.5px] leading-[1.72] font-light text-white/50 mb-9">
                {featuredConversation.excerpt}
              </p>

              <div className="flex items-center gap-[14px] flex-wrap">
                <Link
                  href={`/executive-conversations/${featuredConversation.slug}`}
                  className="inline-flex items-center gap-[9px] text-[12.5px] font-semibold tracking-[.06em] text-gold border border-gold px-[26px] py-3 hover:bg-gold hover:text-deep hover:-translate-y-[2px] transition-all duration-200"
                >
                  Read the Conversation <ArrowRight size={13} />
                </Link>
                <Link
                  href="/executive-conversations"
                  className="font-mono text-[10px] tracking-[.15em] uppercase text-white/30 flex items-center gap-1.5 hover:text-white/65 transition-colors duration-200"
                >
                  All Conversations <ArrowRight size={10} />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT ─ full-bleed executive photo */}
          <div
            className="fade-in relative overflow-hidden h-full min-h-[580px] max-md:min-h-[440px]"
            style={{ transitionDelay: "0.2s" }}
          >
            {/* Real photo takes priority, falling back to the initials
                gradient only when no photo is set — same conditional
                pattern as ConversationCard and the conversation page. */}
            {featuredConversation.photo ? (
              <Image
                src={featuredConversation.photo}
                alt={featuredConversation.executiveName}
                fill
                quality={80}
                className="object-cover"
                style={{ objectPosition: "center top" }}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-teal">
                <span className="font-display text-[72px] font-semibold text-white/85 tracking-wider">
                  {featuredConversation.initials}
                </span>
              </div>
            )}

            {/* Corner badge — same frosted-glass recipe, smaller blur. */}
            <div
              className="absolute top-[22px] left-[22px] px-[13px] py-[7px] border border-white/20 backdrop-blur-md"
              style={{
                background:
                  "linear-gradient(rgba(255,255,255,0.10), rgba(255,255,255,0.10)), linear-gradient(135deg, rgba(10,20,35,0.58) 0%, rgba(10,20,35,0.34) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)",
              }}
            >
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-stamp">
                Executive Conversations
              </span>
            </div>

            {otherConversations.length > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 pt-16"
                style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,20,35,0.92) 55%)" }}
              >
                {otherConversations.slice(0, 2).map((conversation) => (
                  <Link
                    key={conversation.slug}
                    href={`/executive-conversations/${conversation.slug}`}
                    className="flex items-center gap-[14px] px-6 py-[14px] border-t transition-colors duration-200 hover:bg-[rgba(191,159,102,.08)]"
                    style={{ borderColor: "rgba(255,255,255,.08)" }}
                  >
                    <span className="font-mono text-[10px] text-stamp tracking-[.05em] flex-shrink-0 whitespace-nowrap">
                      {conversation.transcriptRef}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[12.5px] text-white/80 font-medium truncate">
                        {conversation.executiveName}
                      </span>
                      <span className="block text-[11px] text-white/45 font-light truncate">
                        {conversation.title}
                      </span>
                    </span>
                    <ArrowRight size={16} strokeWidth={1.5} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── AFRICA CONTEXT STRIP ──────────────────────────────── */}
      <div className="bg-teal py-14 relative overflow-hidden scroll-mt-[100px]" id="about">
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=70&fit=crop&auto=format"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none animate-water-drift"
          style={{ opacity: 0.25, transformOrigin: "center center" }}
        />

        <div className="relative max-w-[1240px] mx-auto px-11 max-md:px-5">
          <div className="fade-in flex flex-col items-center text-center">
            <div className="w-full flex flex-col items-center">
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold block mb-3 text-center">
                The Opportunity We Cover
              </span>
              <h3 className="font-display text-[clamp(20px,2vw,27px)] font-semibold text-white leading-[1.35] mb-3 text-center max-w-3xl mx-auto">
                Africa&apos;s maritime economy is one of the world&apos;s{" "}
                <em className="italic text-gold">most underreported</em> strategic opportunities
              </h3>
              <p className="text-[14px] font-light leading-[1.7] text-white/55 max-w-3xl mx-auto text-center">
                With 38 coastal nations, 90% of its trade moving by sea, and a blue economy valued at over $1 trillion, Africa&apos;s maritime sector demands intelligence, strategic communications, and authoritative media that match its scale. PrimeAxis exists to fill that gap.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-12 mt-12 w-full">
              {[
                { val: "38",   label: "Coastal African\nNations" },
                { val: "90%",  label: "Trade Volume\nby Sea" },
                { val: "$1T+", label: "Blue Economy\nPotential" },
                { val: "54",   label: "African Nations\nin the AU" },
              ].map(({ val, label }) => (
                <div key={val} className="flex flex-col items-center gap-[5px] border-l pl-6 text-center" style={{ borderColor: "rgba(191,159,102,.25)" }}>
                  <span className="font-display text-[32px] font-bold text-white leading-none">{val}</span>
                  <span className="font-mono text-[9px] tracking-[.16em] uppercase text-gold/60 whitespace-pre-line leading-[1.4]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SERVICES ──────────────────────────────────────────── */}
      <section className="py-[88px] bg-white max-sm:py-14 scroll-mt-[100px]" id="services">
        <div className="max-w-[1240px] mx-auto px-11 max-md:px-5">
          <div className="fade-in flex items-end justify-between mb-0 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold">What We Offer</span>
              <h2 className="font-display text-[clamp(24px,2.6vw,36px)] font-semibold text-deep leading-[1.15] mt-2.5">
                Strategic Services for<br />the Maritime Sector
              </h2>
            </div>
            <a href="/services" className="font-mono text-[10.5px] tracking-[.14em] uppercase text-teal flex items-center gap-[7px] pb-1 whitespace-nowrap hover:gap-[13px] hover:text-gold transition-all duration-200">
              View All Services <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] mt-12" style={{ background: "var(--color-brd)" }}>
            {services.map(({ icon, title, description }, i) => (
              <div
                key={title}
                className="fade-in group bg-white p-10 px-8 relative overflow-hidden transition-transform duration-[280ms] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,32,43,.1)] hover:z-[1]"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream-d group-hover:bg-gold transition-colors duration-[250ms]" />
                <div className="mb-[18px] mt-2">{SERVICE_ICONS[icon]}</div>
                <div className="font-display text-[17.5px] font-semibold text-ink mb-[10px] leading-[1.2]">{title}</div>
                <p className="text-[13px] leading-[1.7] text-muted font-light">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-11 pt-11 border-t border-brd flex flex-col items-center gap-[14px] text-center">
            <p className="text-[15px] text-muted font-light">
              Ready to elevate your position in Africa&apos;s maritime sector?{" "}
              <strong className="text-ink font-medium">Let&apos;s build something significant together.</strong>
            </p>
            <a href="/work-with-us" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.05em] text-white bg-teal px-7 py-3 hover:bg-deep hover:-translate-y-[2px] transition-all duration-200">
              Start a Conversation <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── WORK WITH US ──────────────────────────────────────── */}
      <section
        className="bg-deep py-20 relative overflow-hidden max-sm:py-14 scroll-mt-[100px]"
        id="work-with"
      >
        <img
          src="https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1920&q=70&fit=crop&auto=format"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.20 }}
        />

        <div className="relative max-w-[1240px] mx-auto px-11 max-md:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-20 items-center max-sm:gap-12">

            <div className="fade-in">
              <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold">Work With PrimeAxis</span>
              <h2 className="font-display text-[clamp(24px,2.8vw,38px)] font-semibold leading-[1.3] text-white mt-[14px]">
                We partner with maritime organisations, executives, and industry stakeholders to{" "}
                <em className="italic text-gold">build visibility, shape narratives,</em> and drive lasting strategic impact.
              </h2>
              <p className="text-[14.5px] leading-[1.72] font-light text-white/50 mt-[18px] mb-8 max-w-[480px]">
                Whether you are an organisation seeking strategic communications support, an executive building industry authority, or a partner exploring collaboration — PrimeAxis creates the platform for meaningful, long-term engagement across Africa&apos;s maritime ecosystem.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="/work-with-us" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.06em] text-deep bg-gold px-7 py-[13px] hover:bg-gold-l hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(191,159,102,.28)] transition-all duration-200">
                  Start a Conversation <ArrowRight strokeWidth={2.5} />
                </a>
                <a href="/services" className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[.04em] text-white/75 border border-white/20 px-7 py-[13px] hover:border-gold hover:text-gold hover:-translate-y-[2px] transition-all duration-200">
                  View All Services
                </a>
              </div>
            </div>

            <div className="fade-in flex flex-col gap-[10px]" style={{ transitionDelay: "0.2s" }}>
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] stroke-gold"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, name: "Explore Collaboration Opportunities", desc: "Joint initiatives and content partnerships across the maritime ecosystem" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] stroke-gold"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>, name: "Submit a Partnership Enquiry", desc: "Sponsorship, branded content, and event partnerships with PrimeAxis" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] stroke-gold"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, name: "Contribute an Article", desc: "Guest perspectives from credible voices across the maritime sector" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] stroke-gold"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, name: "Request Strategic Communication Support", desc: "Advisory and thought-leadership support for executives and institutions" },
              ].map(({ icon, name, desc }) => (
                <div
                  key={name}
                  className="group flex items-center gap-4 px-5 py-4 border cursor-default transition-all duration-200 hover:translate-x-[5px]"
                  style={{ borderColor: "rgba(191,159,102,.18)", background: "rgba(21,28,46,.72)", backdropFilter: "blur(10px)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(191,159,102,.45)"; e.currentTarget.style.background = "rgba(21,28,46,.88)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(191,159,102,.18)"; e.currentTarget.style.background = "rgba(21,28,46,.72)"; }}
                >
                  <div className="w-[34px] h-[34px] flex-shrink-0 border flex items-center justify-center transition-colors duration-200 group-hover:border-gold/60" style={{ borderColor: "rgba(191,159,102,.25)" }}>
                    {icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-white/75 mb-[2px]">{name}</div>
                    <div className="text-[11.5px] text-white/35 font-light">{desc}</div>
                  </div>
                </div>
              ))}
              <Link
                href="/work-with-us"
                className="mt-1 font-mono text-[10px] tracking-[.15em] uppercase text-white/30 flex items-center gap-1.5 hover:text-white/65 transition-colors duration-200"
              >
                View All Ways to Work With Us <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="bg-cream py-[56px] max-sm:py-14 scroll-mt-[100px]" id="newsletter">
        <div className="max-w-[620px] mx-auto px-11 text-center max-sm:px-5">
          <div className="fade-in">
            <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-semibold text-deep mb-[14px] leading-[1.2]">
              Stay Ahead of Africa&apos;s Maritime Intelligence
            </h2>

            <p className="text-[14.5px] leading-[1.7] text-muted font-light mb-9">
              Join maritime executives, policy professionals, and industry decision-makers who receive curated intelligence, executive insights, and strategic perspectives on Africa&apos;s maritime and blue economy sector — direct to their inbox.
            </p>

            <NewsletterForm variant="light" />

            <p className="font-mono text-[9.5px] tracking-[.1em] text-muted">
              No noise. Only intelligence. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
