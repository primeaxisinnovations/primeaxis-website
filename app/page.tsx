"use client";

import { useEffect, useRef, useState } from "react";

function ArrowRight({ size = 14, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ── Hero carousel slides (preloaded — all rendered in DOM) ─────
// TODO slide 3: replace with direct lh3.googleusercontent.com URL from share.google/yunlHzabLTsWq9QmO
// TODO slide 4: replace with "/imcremex-2024.jpg" once that file is saved to /public/
const CAROUSEL_SLIDES = [
  "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1678182451047-196f22a4143e?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1920&q=85&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=85&fit=crop&auto=format",
];

// ── Intelligence card data ─────────────────────────────────────
const INTEL_CARDS = [
  {
    img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80&fit=crop&auto=format",
    beat: "Blue Economy",
    title: "The African Blue Economy Imperative: Why Strategic Communications Must Lead the Conversation",
    excerpt: "With the AU Blue Economy Strategy gaining momentum, the institutions and executives who shape the public discourse now will define Africa's maritime trajectory for decades.",
    meta: ["5 min read", "6 Jun 2025"],
    delay: "0.08s",
  },
  {
    img: "https://images.unsplash.com/photo-1678182451047-196f22a4143e?w=800&q=80&fit=crop&auto=format",
    beat: "Ports & Infrastructure",
    title: "Apapa to Lekki: How Port Competition Is Reshaping Nigeria's Maritime Logistics Landscape",
    excerpt: "The commissioning of Lekki Deep Sea Port introduces a new competitive dynamic. We examine market positioning, throughput projections, and what it means for cargo owners.",
    meta: ["7 min read", "28 May 2025"],
    delay: "0.16s",
  },
  {
    img: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80&fit=crop&auto=format",
    beat: "Maritime Finance",
    title: "Unlocking Capital for African Shipping: The Investment Gap, DFI Appetite, and What Owners Need to Know",
    excerpt: "Development Finance Institutions are showing renewed appetite for African maritime investment. The conditions, the barriers, and the window that may not stay open.",
    meta: ["9 min read", "20 May 2025"],
    delay: "0.08s",
  },
  {
    img: "https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?w=800&q=80&fit=crop&auto=format",
    beat: "Executive Perspective",
    title: "The NIMASA Leadership Question: What the Industry Needs from the Next DG as the Regulatory Landscape Shifts",
    excerpt: "As maritime stakeholders call for a more commercially aware regulator, PrimeAxis examines what leadership qualities the industry needs at Nigeria's apex maritime authority.",
    meta: ["6 min read", "14 May 2025"],
    delay: "0.16s",
  },
];

export default function Home() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Nav background: transparent → frosted glass on scroll
  // Position stays top-9 (38px) at all times — breaking bar is fixed above it
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Hero carousel: auto-advance every 5 s unconditionally (no pause on hover)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "Intelligence",   href: "#intelligence"  },
    { label: "Conversations",  href: "#conversations" },
    { label: "Media Hub",      href: "#media"         },
    { label: "Services",       href: "#services"      },
    { label: "About",          href: "#about"         },
  ];

  return (
    <>
      {/* ── BREAKING BAR — fixed at top-0 always ─────────────── */}
      <div
        id="breaking-bar"
        className="fixed top-0 left-0 right-0 z-[300] bg-gold py-[9px] overflow-hidden"
      >
        <div className="max-w-[1440px] mx-auto px-11 max-sm:px-5">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[.18em] uppercase bg-deep text-gold px-[10px] py-[3px] whitespace-nowrap flex-shrink-0">
              Latest
            </span>
            <div className="animate-ticker text-[12.5px] font-medium text-deep tracking-[.02em] whitespace-nowrap">
              Nigeria's new National Transport Policy sets bold maritime targets for 2030 &nbsp;·&nbsp; NIMASA launches West African Maritime Security Dialogue &nbsp;·&nbsp; Lekki Deep Sea Port records 1 million TEU milestone in first operational year &nbsp;·&nbsp; African Blue Economy Strategy 2063 gains momentum as AU member states align &nbsp;·&nbsp; Nigeria's new National Transport Policy sets bold maritime targets for 2030 &nbsp;·&nbsp; NIMASA launches West African Maritime Security Dialogue &nbsp;·&nbsp; Lekki Deep Sea Port records 1 million TEU milestone in first operational year &nbsp;·&nbsp;
            </div>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION — always at top-9 (38 px, below breaking bar) */}
      <nav className="fixed top-9 left-0 right-0 z-[200]">
        <div
          className={`transition-all duration-[350ms] ${
            scrolled ? "py-[14px] shadow-[0_1px_0_rgba(191,159,102,.18)]" : "py-5"
          }`}
          style={scrolled ? { background: "rgba(0,32,43,.96)", backdropFilter: "blur(14px)" } : {}}
        >
          <div className="max-w-[1440px] mx-auto px-11 max-sm:px-5">
            <div className="flex items-center justify-between gap-10">
              {/* Logo */}
              <a href="#" className="flex flex-col gap-[1px] flex-shrink-0">
                <span className="font-display text-[21px] font-bold text-white tracking-[.03em] leading-none">
                  PrimeAxis
                </span>
                <span className="font-mono text-[8.5px] tracking-[.2em] uppercase text-[rgba(191,159,102,.65)]">
                  Africa's Maritime Intelligence
                </span>
              </a>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
                {navLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="relative group text-[12.5px] font-medium tracking-[.03em] text-white/65 hover:text-white transition-colors duration-200 pb-[2px]"
                  >
                    {label}
                    <span className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-[220ms] origin-left" />
                  </a>
                ))}
              </div>

              {/* Desktop CTA buttons */}
              <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                <a
                  href="#newsletter"
                  className="text-[12.5px] font-semibold tracking-[.05em] text-deep bg-gold px-5 py-[9px] hover:bg-gold-l hover:-translate-y-[1px] transition-all duration-200"
                >
                  Subscribe
                </a>
                <a
                  href="#work-with"
                  className="text-[12.5px] font-semibold tracking-[.05em] text-gold border border-gold px-5 py-[9px] hover:bg-gold/10 transition-all duration-200"
                >
                  Work With Us
                </a>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex flex-col gap-[4.5px] p-1 flex-shrink-0"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <span className={`block w-5 h-[1.5px] bg-white transition-transform duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-white transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block w-5 h-[1.5px] bg-white transition-transform duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile overlay menu */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-[-1] flex flex-col items-center justify-center gap-2"
            style={{ background: "rgba(0,32,43,.97)", backdropFilter: "blur(16px)" }}
          >
            {[...navLinks, { label: "Work With Us", href: "#work-with" }].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="font-display text-[28px] font-semibold text-white/80 py-3 hover:text-gold transition-colors duration-200"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO — full-screen fade carousel ──────────────────── */}
      <section
        className="min-h-screen grid grid-rows-[1fr_auto] bg-deep relative overflow-hidden"
      >
        {/* ── Carousel slides: <img> ensures all 3 images preload on mount */}
        {CAROUSEL_SLIDES.map((url, i) => (
          <div
            key={url}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{ opacity: i === activeSlide ? 1 : 0, transitionDuration: "1500ms" }}
          >
            <img
              src={url}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 40%", opacity: 0.65 }}
            />
          </div>
        ))}

        {/* Directional gradient overlay (stays constant) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(21,28,46,.75) 28%, rgba(21,28,46,.18) 100%), linear-gradient(to top, rgba(21,28,46,.68) 0%, transparent 45%)",
          }}
        />
        {/* Atmospheric radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 65% 40%, rgba(0,77,99,.55) 0%, transparent 65%), radial-gradient(ellipse 50% 60% at 5% 90%, rgba(0,40,56,.7) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 90% 10%, rgba(191,159,102,.04) 0%, transparent 50%)",
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

        {/* Main hero content — pt accounts for fixed breaking bar + fixed nav */}
        <div className="relative z-[2] flex items-center pt-[200px] pb-20 max-sm:pt-[150px] max-sm:pb-12">
          <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-20 items-center">

              {/* Left: editorial statement */}
              <div>
                <h1 className="hero-headline-anim font-display text-[clamp(38px,4.8vw,68px)] font-bold leading-[1.06] text-white mb-[22px]">
                  The Platform That
                  <br />
                  Shapes <em className="text-gold italic">Africa's Maritime</em>
                  <br />
                  Industry Narrative
                </h1>

                <p className="hero-standfirst-anim text-[16.5px] font-light leading-[1.7] text-white/60 max-w-[520px] mb-11">
                  PrimeAxis is Africa's maritime intelligence and strategic communications platform — where executives engage, narratives are shaped, and industry authority is built. Insight that informs. Media that matters.
                </p>

                <div className="hero-actions-anim flex gap-3 flex-wrap">
                  <a
                    href="#intelligence"
                    className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.06em] text-deep bg-gold px-7 py-[13px] hover:bg-gold-l hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(191,159,102,.28)] transition-all duration-200"
                  >
                    Read the Intelligence
                    <ArrowRight strokeWidth={2.5} />
                  </a>
                  <a
                    href="#work-with"
                    className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[.04em] text-white/75 border border-white/20 px-7 py-[13px] hover:border-gold hover:text-gold hover:-translate-y-[2px] transition-all duration-200"
                  >
                    Work With Us
                    <ArrowRight />
                  </a>
                </div>
              </div>

              {/* Right: featured analysis card */}
              <div
                className="hero-card-anim hidden lg:block relative p-9"
                style={{
                  background: "rgba(10,20,35,0.48)",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "linear-gradient(90deg, #BF9F66, transparent)" }}
                />
                <div className="font-mono text-[10px] tracking-[.18em] uppercase text-gold mb-[18px] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot flex-shrink-0" />
                  Featured Analysis
                </div>
                <h2 className="font-display text-[clamp(18px,1.8vw,24px)] font-semibold text-white leading-[1.3] mb-[14px]">
                  Nigeria's Cabotage Regime at a Crossroads: The 2025 Amendment and What It Means for Indigenous Shipping
                </h2>
                <p className="text-[13.5px] leading-[1.7] font-light text-white/50 mb-6">
                  The latest regulatory amendments present both historic opportunity and significant risk for Nigerian shipowners navigating a shifting compliance environment.
                </p>
                <div className="flex items-center justify-between pt-5 border-t" style={{ borderColor: "rgba(255,255,255,.07)" }}>
                  <span className="text-[12px] text-white/35 font-light">
                    By <strong className="text-white/60 font-medium">PrimeAxis Editorial</strong> · 12 min read
                  </span>
                  <a href="#" className="font-mono text-[10.5px] tracking-[.12em] uppercase text-gold flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200">
                    Read <ArrowRight size={10} strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel navigation dots — centred above the stats bar */}
        <div className="absolute bottom-24 left-0 right-0 z-[3] flex justify-center items-center gap-2 max-sm:hidden">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-[5px] transition-all duration-300 ${
                i === activeSlide
                  ? "w-6 bg-gold"
                  : "w-[5px] rounded-full bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Stats bar */}
        <div className="hero-stats-anim relative z-[2] border-t py-6" style={{ borderColor: "rgba(191,159,102,.12)" }}>
          <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
            <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start max-sm:gap-4">
              <div className="flex max-sm:flex-col max-sm:gap-4">
                {[
                  { num: "38",   label: "Coastal African Nations" },
                  { num: "90%",  label: "Africa's Trade by Sea" },
                  { num: "$1T+", label: "Blue Economy Potential" },
                  { num: "2063", label: "African Maritime Vision" },
                ].map(({ num, label }, i) => (
                  <div
                    key={num}
                    className={`flex flex-col gap-1 px-10 max-sm:px-0 ${i > 0 ? "border-l border-gold/15 max-sm:border-l-0 max-sm:border-b max-sm:border-gold/15 max-sm:pb-4" : ""} ${i === 0 ? "pl-0" : ""}`}
                  >
                    <span className="font-display text-[26px] font-bold text-white leading-none">{num}</span>
                    <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-gold/60">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[10px] font-mono text-[10px] tracking-[.14em] uppercase text-white/25 max-sm:hidden">
                <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: "rgba(191,159,102,.25)" }}>
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gold animate-scroll-down" />
                </div>
                <span className="writing-vertical text-[9.5px] tracking-[.18em] uppercase">Scroll</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST INTELLIGENCE STRIP ─────────────────────────── */}
      <div className="bg-teal border-t-2 border-gold">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-stretch min-h-[58px]">
            <div
              className="flex-shrink-0 flex items-center gap-2 px-6 font-mono text-[10px] tracking-[.2em] uppercase text-gold border-r"
              style={{ background: "var(--color-deep)", borderColor: "rgba(191,159,102,.2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
              Live
            </div>
            <div className="flex items-center overflow-hidden flex-1 px-7">
              {[
                { tag: "Policy",      text: "NIMASA concludes stakeholder review of 2025 Cabotage Enforcement Guidelines" },
                { tag: "Ports",       text: "Lekki Deep Sea Port targets 2 million TEU capacity by Q4 2026" },
                { tag: "Blue Economy",text: "AU Commission launches framework for African Ocean Governance Strategy" },
                { tag: "Shipping",    text: "West African freight rates stabilise following Red Sea rerouting pressure" },
              ].map(({ tag, text }) => (
                <span
                  key={tag + text}
                  className="text-[13px] font-normal text-white/75 whitespace-nowrap px-7 border-r border-white/10 last:border-r-0 flex-shrink-0 hover:text-gold transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-mono text-[9px] tracking-[.12em] uppercase text-gold mr-2">{tag}</span>
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BEATS / TOPIC NAVIGATION ──────────────────────────── */}
      <div className="bg-white border-t-2 border-brd border-b-2" id="topics">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-stretch overflow-x-auto scrollbar-none">
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>, label: "Maritime\nPolicy" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: "Ports &\nLogistics" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Shipping\nIndustry" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Regulation\n& Law" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, label: "Blue\nEconomy" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, label: "Finance &\nInvestment" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>, label: "Executive\nConversations" },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="w-3.5 h-3.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>, label: "Events\nCoverage" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center justify-center gap-[7px] py-[22px] px-8 border-r border-brd flex-shrink-0 cursor-pointer hover:bg-cream transition-colors duration-200 relative"
              >
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-gold transition-colors duration-200" />
                <div className="w-8 h-8 border flex items-center justify-center transition-colors duration-200 group-hover:border-gold text-teal group-hover:text-gold" style={{ borderColor: "rgba(0,56,71,.12)" }}>
                  {icon}
                </div>
                <span className="font-mono text-[9.5px] tracking-[.14em] uppercase text-muted group-hover:text-ink text-center leading-[1.3] transition-colors duration-200 whitespace-pre-line">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INTELLIGENCE GRID ─────────────────────────────────── */}
      <section className="py-[88px] bg-cream max-sm:py-14 scroll-mt-[100px]" id="intelligence">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          {/* Section header */}
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
            <a href="#" className="font-mono text-[10.5px] tracking-[.14em] uppercase text-teal flex items-center gap-[7px] pb-1 whitespace-nowrap hover:gap-[13px] hover:text-gold transition-all duration-200">
              All Intelligence <ArrowRight size={14} />
            </a>
          </div>

          {/* Grid */}
          <div
            className="grid gap-[2px] max-sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.65fr_1fr_1fr]"
            style={{ background: "var(--color-brd)" }}
          >
            {/* ── Hero story — 240 px image, spans 2 rows ───────── */}
            <div className="fade-in group bg-white flex flex-col relative overflow-hidden cursor-pointer transition-transform duration-[280ms] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,32,43,.12)] hover:z-[1] lg:row-span-2">
              {/* Gold bottom accent on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream-d group-hover:bg-gold transition-colors duration-[250ms] z-[1]" />

              {/* Image */}
              <div className="relative overflow-hidden h-[240px] flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1590496793907-4d66e2994b4d?w=800&q=80&fit=crop&auto=format"
                  alt="Nigeria cabotage shipping policy"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-14 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
              </div>

              {/* Content */}
              <div className="p-11 flex flex-col flex-1 max-sm:p-6">
                <span className="font-mono text-[9.5px] tracking-[.16em] uppercase text-gold mb-[14px] flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full bg-gold flex-shrink-0" />
                  Policy & Regulation
                </span>
                <h3 className="font-display text-[clamp(19px,1.9vw,26px)] font-bold text-ink leading-[1.22] mb-5">
                  Nigeria's Cabotage Regime at a Crossroads: What the 2025 Amendments Mean for Indigenous Shipping and the Future of Local Capacity
                </h3>

                {/* IMCREMEX 2024 — Nigerian Defence Ministry source */}
                <div className="relative -mx-11 max-sm:-mx-6 mb-5 overflow-hidden flex-shrink-0">
                  <img
                    src="https://defence.gov.ng/wp-content/uploads/2023/05/IMG-20230520-WA0093-1024x683.jpg"
                    alt="5th International Maritime Conference IMCREMEX 2024"
                    loading="lazy"
                    className="w-full h-[195px] object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
                </div>

                <p className="text-[14px] leading-[1.72] font-light text-muted mb-6">
                  The latest amendments to the Coastal and Inland Shipping Act present both historic opportunity and significant operational risk for Nigerian shipowners. We examine the full regulatory landscape, stakeholder reactions from NIMASA and industry groups, and the strategic implications for indigenous fleet operators now navigating an evolving compliance environment.
                </p>
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-cream-d">
                  <div className="flex items-center gap-[14px]">
                    <span className="font-mono text-[10px] tracking-[.08em] text-muted-l">PrimeAxis Editorial</span>
                    <span className="text-cream-d">·</span>
                    <span className="font-mono text-[10px] tracking-[.08em] text-muted-l">14 min read</span>
                    <span className="text-cream-d">·</span>
                    <span className="font-mono text-[10px] tracking-[.08em] text-muted-l">12 Jun 2025</span>
                  </div>
                  <div className="w-[30px] h-[30px] border border-cream-d flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:border-gold group-hover:bg-gold">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-3 h-3 stroke-muted-l group-hover:stroke-deep transition-colors duration-200">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Regular cards — 180 px image ─────────────────── */}
            {INTEL_CARDS.map(({ img, beat, title, excerpt, meta, delay }) => (
              <div
                key={title}
                className="fade-in group bg-white flex flex-col relative overflow-hidden cursor-pointer transition-transform duration-[280ms] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,32,43,.12)] hover:z-[1]"
                style={{ transitionDelay: delay }}
              >
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream-d group-hover:bg-gold transition-colors duration-[250ms] z-[1]" />

                {/* Image */}
                <div className="relative overflow-hidden h-[180px] flex-shrink-0">
                  <img
                    src={img}
                    alt={beat}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, white)" }} />
                </div>

                {/* Content */}
                <div className="p-9 flex flex-col flex-1 max-sm:p-6">
                  <span className="font-mono text-[9.5px] tracking-[.16em] uppercase text-gold mb-[14px] flex items-center gap-2">
                    <span className="w-[5px] h-[5px] rounded-full bg-gold flex-shrink-0" />
                    {beat}
                  </span>
                  <h3 className="font-display text-[clamp(15px,1.2vw,17.5px)] font-semibold text-ink leading-[1.22] mb-[14px] flex-1">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[1.72] font-light text-muted mb-6">{excerpt}</p>
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-cream-d">
                    <div className="flex items-center gap-[14px]">
                      {meta.map((m, i) => (
                        <span key={m}>
                          {i > 0 && <span className="text-cream-d mr-[14px]">·</span>}
                          <span className="font-mono text-[10px] tracking-[.08em] text-muted-l">{m}</span>
                        </span>
                      ))}
                    </div>
                    <div className="w-[30px] h-[30px] border border-cream-d flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:border-gold group-hover:bg-gold">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="w-3 h-3 stroke-muted-l group-hover:stroke-deep transition-colors duration-200">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTIVE CONVERSATIONS ───────────────────────────── */}
      <section
        className="bg-deep py-[88px] relative overflow-hidden max-sm:py-14 scroll-mt-[100px]"
        id="conversations"
      >
        {/* Atmospheric background — 8% opacity */}
        <img
          src="https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?w=1920&q=70&fit=crop&auto=format"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.20 }}
        />

        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-[72px] items-center max-sm:gap-12">

            {/* Left: quote + speaker */}
            <div className="fade-in">
              <div className="flex items-center gap-[14px] mb-8">
                <span className="block w-7 h-[1px] bg-gold" />
                <span className="font-mono text-[10px] tracking-[.2em] uppercase text-gold">
                  The PrimeAxis Conversations — Episode 01
                </span>
              </div>

              <blockquote className="font-display text-[clamp(21px,2.1vw,29px)] font-normal italic leading-[1.48] text-white mb-8 pl-5 border-l-2 border-gold">
                "Africa cannot continue to be a passive participant in the global maritime economy. We have the coastline, the trade volumes, and the talent. What we need now is the institutional will and the communications infrastructure to lead."
              </blockquote>

              <div
                className="flex items-center gap-4 p-[18px_20px] mb-8 border"
                style={{ borderColor: "rgba(191,159,102,.12)", background: "rgba(255,255,255,.03)" }}
              >
                <div
                  className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #485778, #5E719A)" }}
                >
                  <span className="font-display text-[16px] font-bold text-[rgba(191,159,102,.5)]">OA</span>
                </div>
                <div>
                  <div className="font-display text-[16px] font-semibold text-white mb-[2px]">Olawale Adeyemi</div>
                  <div className="text-[12.5px] text-white/40 font-light">
                    Maritime Consultant
                  </div>
                </div>
              </div>

              <p className="text-[14.5px] leading-[1.72] font-light text-white/50 mb-9">
                In this inaugural conversation, we speak with a senior maritime administrator about Nigeria's strategic positioning, the challenges of indigenous capacity development, and what Africa's largest economy must do to claim its rightful place in global shipping over the next decade.
              </p>

              <div className="flex items-center gap-[14px] flex-wrap">
                <a
                  href="#"
                  className="inline-flex items-center gap-[9px] text-[12.5px] font-semibold tracking-[.06em] text-gold border border-gold px-[26px] py-3 hover:bg-gold hover:text-deep hover:-translate-y-[2px] transition-all duration-200"
                >
                  Watch the Conversation <ArrowRight size={13} />
                </a>
                <a href="#" className="font-mono text-[10px] tracking-[.15em] uppercase text-white/30 flex items-center gap-1.5 hover:text-white/65 transition-colors duration-200">
                  All Conversations <ArrowRight size={10} />
                </a>
              </div>
            </div>

            {/* Right: video mockup + episode list */}
            <div className="fade-in" style={{ transitionDelay: "0.2s" }}>
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "4/5" }}
              >
                {/* TODO: replace src below with the direct lh3.googleusercontent.com URL from share.google/EYyGCRQUOcYtLzLwJ */}
                <img
                  src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80&fit=crop&auto=format"
                  alt="Executive Conversations — podcast panel discussion"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center top" }}
                />
                {/* Dark gradient overlay — transparent top → brand-dark bottom */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 0%, rgba(10,20,35,0.75) 100%)" }}
                />
                <div
                  className="absolute top-[22px] left-[22px] px-[13px] py-[7px] border"
                  style={{ background: "rgba(0,32,43,.85)", backdropFilter: "blur(8px)", borderColor: "rgba(191,159,102,.25)" }}
                >
                  <span className="font-mono text-[9.5px] tracking-[.16em] uppercase text-gold">Executive Conversations</span>
                </div>
                <button
                  className="absolute bottom-6 left-6 w-[52px] h-[52px] rounded-full bg-gold flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,.4)] hover:scale-110 hover:shadow-[0_8px_28px_rgba(191,159,102,.45)] transition-all duration-200"
                  aria-label="Play episode"
                >
                  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-deep ml-[3px]">
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                </button>
                <span className="absolute bottom-6 right-6 font-display text-[56px] font-bold text-white/[.06] leading-none pointer-events-none">01</span>
              </div>

              <div className="mt-[2px] border border-t-0" style={{ background: "rgba(255,255,255,.03)", borderColor: "rgba(191,159,102,.1)" }}>
                {[
                  { num: "EP 02", title: "On the Future of West African Regional Maritime Cooperation" },
                  { num: "EP 03", title: "Port Competition and the Lekki Deep Sea Port Era" },
                  { num: "EP 04", title: "Decarbonisation and African Shipping's Strategic Choices" },
                ].map(({ num, title }) => (
                  <div
                    key={num}
                    className="flex items-center gap-[14px] px-5 py-[14px] border-b last:border-b-0 cursor-pointer hover:bg-[rgba(191,159,102,.05)] transition-colors duration-200"
                    style={{ borderColor: "rgba(255,255,255,.05)" }}
                  >
                    <span className="font-mono text-[10px] text-gold tracking-[.1em] w-7 flex-shrink-0">{num}</span>
                    <span className="text-[12.5px] text-white/55 flex-1 font-light">{title}</span>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-[18px] h-[18px] stroke-[rgba(191,159,102,.4)] flex-shrink-0">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AFRICA CONTEXT STRIP ──────────────────────────────── */}
      <div className="bg-teal py-14 relative overflow-hidden scroll-mt-[100px]" id="about">
        {/* Atmospheric ocean background — 10% opacity */}
        <img
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=70&fit=crop&auto=format"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none animate-water-drift"
          style={{ opacity: 0.25, transformOrigin: "center center" }}
        />

        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <div className="fade-in flex items-center gap-20 max-sm:flex-col max-sm:gap-10">
            <div className="flex-1">
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold block mb-3">
                The Opportunity We Cover
              </span>
              <h3 className="font-display text-[clamp(20px,2vw,27px)] font-semibold text-white leading-[1.35] mb-3">
                Africa's maritime economy is one of the world's{" "}
                <em className="italic text-gold">most underreported</em> strategic opportunities
              </h3>
              <p className="text-[14px] font-light leading-[1.7] text-white/55 max-w-[480px]">
                With 38 coastal nations, 90% of its trade moving by sea, and a blue economy valued at over $1 trillion, Africa's maritime sector demands intelligence, strategic communications, and authoritative media that match its scale. PrimeAxis exists to fill that gap.
              </p>
            </div>

            <div className="flex gap-10 flex-shrink-0 max-sm:justify-start">
              {[
                { val: "38",   label: "Coastal African\nNations" },
                { val: "90%",  label: "Trade Volume\nby Sea" },
                { val: "$1T+", label: "Blue Economy\nPotential" },
                { val: "54",   label: "African Nations\nin the AU" },
              ].map(({ val, label }) => (
                <div key={val} className="flex flex-col gap-[5px] border-l pl-6" style={{ borderColor: "rgba(191,159,102,.25)" }}>
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
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <div className="fade-in flex items-end justify-between mb-0 max-sm:flex-col max-sm:items-start max-sm:gap-4">
            <div>
              <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold">What We Offer</span>
              <h2 className="font-display text-[clamp(24px,2.6vw,36px)] font-semibold text-deep leading-[1.15] mt-2.5">
                Strategic Services for<br />the Maritime Sector
              </h2>
            </div>
            <a href="#" className="font-mono text-[10.5px] tracking-[.14em] uppercase text-teal flex items-center gap-[7px] pb-1 whitespace-nowrap hover:gap-[13px] hover:text-gold transition-all duration-200">
              View All Services <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] mt-12" style={{ background: "var(--color-brd)" }}>
            {[
              { n: "01", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[26px] h-[26px] stroke-teal"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, name: "Strategic Communications", desc: "Narrative strategy, messaging development, and communications advisory for maritime organisations navigating complex stakeholder environments.", delay: "0s" },
              { n: "02", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[26px] h-[26px] stroke-teal"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>, name: "Media Production & Coverage", desc: "Professional production of executive interviews, event coverage, documentary features, and multimedia content for maritime organisations.", delay: "0.08s" },
              { n: "03", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[26px] h-[26px] stroke-teal"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>, name: "Executive Visibility", desc: "Positioning programmes for maritime executives seeking to build industry authority, expand stakeholder relationships, and elevate their professional profile.", delay: "0.16s" },
              { n: "04", icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[26px] h-[26px] stroke-teal"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, name: "Sponsored Features & Partnerships", desc: "Premium branded content, sponsored editorial series, and strategic partnership programmes for organisations seeking visibility within the African maritime community.", delay: "0.24s" },
            ].map(({ icon, name, desc, delay }) => (
              <div key={name} className="fade-in group bg-white p-10 px-8 relative overflow-hidden transition-transform duration-[280ms] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,32,43,.1)] hover:z-[1]" style={{ transitionDelay: delay }}>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream-d group-hover:bg-gold transition-colors duration-[250ms]" />
                <div className="mb-[18px] mt-2">{icon}</div>
                <div className="font-display text-[17.5px] font-semibold text-ink mb-[10px] leading-[1.2]">{name}</div>
                <p className="text-[13px] leading-[1.7] text-muted font-light">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-11 pt-11 border-t border-brd flex flex-col items-center gap-[14px] text-center">
            <p className="text-[15px] text-muted font-light">
              Ready to elevate your position in Africa's maritime sector?{" "}
              <strong className="text-ink font-medium">Let's build something significant together.</strong>
            </p>
            <a href="#work-with" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.05em] text-white bg-teal px-7 py-3 hover:bg-deep hover:-translate-y-[2px] transition-all duration-200">
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
        {/* Atmospheric background — 8% opacity */}
        <img
          src="https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1920&q=70&fit=crop&auto=format"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.20 }}
        />

        <div className="relative max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-20 items-center max-sm:gap-12">

            {/* Left: heading + CTAs */}
            <div className="fade-in">
              <span className="block w-8 h-0.5 bg-gold mb-[14px]" />
              <span className="font-mono text-[10.5px] tracking-[.18em] uppercase text-gold">Work With PrimeAxis</span>
              <h2 className="font-display text-[clamp(24px,2.8vw,38px)] font-semibold leading-[1.3] text-white mt-[14px]">
                We partner with maritime organisations, executives, and industry stakeholders to{" "}
                <em className="italic text-gold">build visibility, shape narratives,</em> and drive lasting strategic impact.
              </h2>
              <p className="text-[14.5px] leading-[1.72] font-light text-white/50 mt-[18px] mb-8 max-w-[480px]">
                Whether you are an organisation seeking strategic communications support, an executive building industry authority, or a partner exploring collaboration — PrimeAxis creates the platform for meaningful, long-term engagement across Africa's maritime ecosystem.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="#" className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-[.06em] text-deep bg-gold px-7 py-[13px] hover:bg-gold-l hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(191,159,102,.28)] transition-all duration-200">
                  Start a Conversation <ArrowRight strokeWidth={2.5} />
                </a>
                <a href="#services" className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[.04em] text-white/75 border border-white/20 px-7 py-[13px] hover:border-gold hover:text-gold hover:-translate-y-[2px] transition-all duration-200">
                  View All Services
                </a>
              </div>
            </div>

            {/* Right: opportunity list */}
            <div className="fade-in flex flex-col gap-[10px]" style={{ transitionDelay: "0.2s" }}>
              {[
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[15px] h-[15px] stroke-gold"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>, name: "Sponsored Features & Editorial", desc: "Premium branded content produced to full editorial standard" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[15px] h-[15px] stroke-gold"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>, name: "Event & Media Coverage", desc: "Professional coverage packages for maritime events and conferences" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[15px] h-[15px] stroke-gold"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>, name: "Strategic Partnerships", desc: "Co-production, collaboration, and cross-platform opportunities" },
                { icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" className="w-[15px] h-[15px] stroke-gold"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, name: "Executive Visibility Programmes", desc: "Structured positioning packages for industry leaders" },
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
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="bg-cream py-20 max-sm:py-14 scroll-mt-[100px]" id="newsletter">
        <div className="max-w-[620px] mx-auto px-11 text-center max-sm:px-5">
          <div className="fade-in">
            <h2 className="font-display text-[clamp(22px,2.5vw,32px)] font-semibold text-deep mb-[14px] leading-[1.2]">
              Stay Ahead of Africa's Maritime Intelligence
            </h2>

            <p className="text-[14.5px] leading-[1.7] text-muted font-light mb-9">
              Join maritime executives, policy professionals, and industry decision-makers who receive curated intelligence, executive insights, and strategic perspectives on Africa's maritime and blue economy sector — direct to their inbox.
            </p>

            <form className="flex max-w-[460px] mx-auto mb-[14px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your professional email address"
                className="flex-1 font-body text-[13.5px] px-[18px] py-[13px] border border-cream-d border-r-0 bg-white text-ink outline-none focus:border-gold placeholder:text-muted-l transition-colors duration-200"
              />
              <button type="submit" className="font-body text-[13px] font-semibold tracking-[.04em] bg-deep text-white px-6 py-[13px] whitespace-nowrap hover:bg-teal transition-colors duration-200">
                Subscribe Free
              </button>
            </form>

            <p className="font-mono text-[9.5px] tracking-[.1em] text-muted-l">
              No noise. Only intelligence. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-deep pt-[60px] pb-9">
        <div className="max-w-[1240px] mx-auto px-11 max-sm:px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-14 pb-12 mb-9 border-b border-white/[.06]">
            {/* Brand */}
            <div>
              <div className="font-display text-[22px] font-bold text-white tracking-[.03em] mb-[5px]">PrimeAxis</div>
              <div className="font-mono text-[8.5px] tracking-[.2em] uppercase text-gold/55 mb-4">Africa's Maritime Intelligence</div>
              <p className="text-[13px] leading-[1.7] font-light text-white/35 max-w-[240px] mb-6">
                Africa's maritime intelligence and strategic communications platform — where industry leaders engage, narratives are shaped, and strategic authority is built.
              </p>
              <div className="flex gap-2">
                {[
                  { label: "LinkedIn", d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
                  { label: "X / Twitter", x: true },
                  { label: "YouTube", d: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.96-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" },
                  { label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                ].map(({ label, d, x }) => (
                  <a key={label} href="#" aria-label={label} className="group w-8 h-8 border border-white/10 flex items-center justify-center hover:border-gold hover:bg-gold/8 transition-all duration-200">
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-[13px] h-[13px] stroke-white/40 group-hover:stroke-gold transition-colors duration-200">
                      {x ? (<><line x1="4" y1="4" x2="20" y2="20" /><line x1="4" y1="20" x2="20" y2="4" /></>) : (<path d={d} />)}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-mono text-[9.5px] tracking-[.18em] uppercase text-gold/60 mb-4">Platform</h5>
              <ul className="flex flex-col gap-[9px]">
                {["About PrimeAxis", "Intelligence", "Executive Conversations", "Media Hub", "Events Coverage"].map((item) => (
                  <li key={item}><a href="#" className="text-[13px] font-light text-white/38 hover:text-white/75 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[9.5px] tracking-[.18em] uppercase text-gold/60 mb-4">Services</h5>
              <ul className="flex flex-col gap-[9px]">
                {["Strategic Communications", "Media Production", "Executive Visibility", "Sponsored Features", "Event Coverage"].map((item) => (
                  <li key={item}><a href="#" className="text-[13px] font-light text-white/38 hover:text-white/75 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-[9.5px] tracking-[.18em] uppercase text-gold/60 mb-4">Engage</h5>
              <ul className="flex flex-col gap-[9px]">
                {["Work With Us", "Partnerships", "Newsletter", "Contact"].map((item) => (
                  <li key={item}><a href="#" className="text-[13px] font-light text-white/38 hover:text-white/75 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-2 max-sm:text-center">
            <span className="font-mono text-[9.5px] tracking-[.1em] text-white/18">© 2025 PrimeAxis. All rights reserved.</span>
            <span className="font-mono text-[9.5px] tracking-[.12em] text-gold/25">04°N · 006°E — Lagos, Nigeria · Africa's Maritime Intelligence Platform</span>
          </div>
        </div>
      </footer>
    </>
  );
}
