"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const HeroSphere = dynamic(() => import("./HeroSphere"), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const HERO_LINES = ["Promotional", "Merchandise.", "Reimagined."];

const MARQUEE = [
  "ISO 9001",
  "ISO 14001",
  "30 Years",
  "London & Cardiff",
  "UK-Wide Delivery",
  "Branded Merchandise",
  "Exhibition Displays",
  "Digital Print",
  "Graphic Design",
];

const SERVICES = [
  {
    id: "01",
    name: "Graphic Design",
    description:
      "Bespoke artwork, brand systems and print-ready files prepared by our in-house studio.",
  },
  {
    id: "02",
    name: "Digital Print",
    description:
      "Fast-turnaround, high-resolution litho and digital printing for every scale of run.",
  },
  {
    id: "03",
    name: "Exhibition Displays",
    description:
      "Stands, roller banners, pop-ups and complete event kit — designed, produced, delivered.",
  },
  {
    id: "04",
    name: "Branded Merchandise",
    description:
      "Thousands of products, branded to spec. From pens to polos, sourced and decorated in the UK.",
  },
];

const CATEGORIES = [
  { name: "Clothing & Textiles", slug: "clothing-textiles", tone: "bg-[#1a2e0a]" },
  { name: "Pens & Writing", slug: "pens-writing", tone: "bg-[#0a1a00]" },
  { name: "Ceramics & Mugs", slug: "ceramics-mugs", tone: "bg-[#1a2e0a]" },
  { name: "Tech & USB", slug: "tech-usb", tone: "bg-[#0a1a00]" },
  { name: "Eco & Recycled", slug: "eco-recycled", tone: "bg-[#0a1a00]" },
  { name: "Conference & Exhibition", slug: "conference-exhibition", tone: "bg-[#1a2e0a]" },
  { name: "Food & Drink", slug: "food-drink", tone: "bg-[#1a2e0a]" },
  { name: "Executive Gifts", slug: "executive-gifts", tone: "bg-[#0a1a00]" },
];

/* ------------------------------------------------------------------ */
/*  Homepage                                                           */
/* ------------------------------------------------------------------ */

export default function HomeClient() {
  return (
    <>
      <Hero />
      <Marquee />
      <StickyServices />
      <CategoryGrid />
      <CTABand />
    </>
  );
}

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#0a1a00]">
      {/* Sphere — fills full hero on mobile (faded), right half on desktop */}
      <div className="absolute inset-0 md:left-[48%] pointer-events-none">
        {/* Radial fade on mobile so sphere doesn't fight text */}
        <div className="absolute inset-0 z-10 md:hidden bg-radial-fade" />
        <HeroSphere />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 pt-[120px] sm:pt-[160px] md:pt-[200px] pb-16 md:pb-32">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="label-mono text-[#93C63B] mb-6 sm:mb-8 flex items-center gap-3 text-[10px] sm:text-[11px]"
        >
          <span className="inline-block w-6 sm:w-8 h-px bg-[#93C63B]" />
          [EST. 1995] — LONDON · CARDIFF
        </motion.p>

        {/* Hero headline — clamped so it never breaks mid-word on mobile */}
        <h1 className="display text-[clamp(2.6rem,10vw,13rem)] text-white leading-[0.88] max-w-[10ch]">
          {HERO_LINES.map((line, lineIdx) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.4 + lineIdx * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="inline-block"
              >
                {line.split("").map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + lineIdx * 0.12 + i * 0.015,
                    }}
                    className="hero-char"
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                ))}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-6 sm:mt-10 label-mono text-white/60 max-w-xs sm:max-w-md text-[10px] sm:text-[11px]"
        >
          A UK STUDIO FOR BRANDED PRODUCTS, PRINT & MARKETING — THIRTY YEARS, ONE OBSESSION.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-7 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center justify-center sm:justify-start gap-3 bg-[#93C63B] text-[#0a1a00] px-7 py-4 label-mono hover:bg-white transition-colors"
          >
            Browse Catalogue
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center sm:justify-start gap-3 border border-white/40 text-white px-7 py-4 label-mono hover:bg-white hover:text-[#0a1a00] transition-colors"
          >
            Get a Quote
          </Link>
        </motion.div>

        {/* Stats strip — mobile friendly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 sm:mt-16 flex gap-8 sm:gap-12"
        >
          {[["30+", "Years"], ["10K+", "Products"], ["ISO", "9001 & 14001"]].map(([val, label]) => (
            <div key={label}>
              <p className="display text-[1.6rem] sm:text-[2rem] text-white">{val}</p>
              <p className="label-mono text-white/40 mt-1 text-[9px] sm:text-[11px]">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator — hidden on very small screens */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="hidden sm:flex absolute bottom-10 left-5 sm:left-10 label-mono text-white/40 items-center gap-3 text-[10px]"
      >
        <span className="inline-block w-px h-10 bg-white/30" />
        SCROLL
      </motion.div>
    </section>
  );
}

/* --------------------------- Marquee --------------------------- */

function Marquee() {
  return (
    <section className="bg-[#1a2e0a] border-y border-white/10 py-5 sm:py-8 overflow-hidden">
      <div className="relative flex">
        <div className="flex marquee-track shrink-0 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 sm:gap-8 px-4 sm:px-6 label-mono text-white/80 text-[10px] sm:text-[11px]"
            >
              {item}
              <span className="text-[#93C63B]">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------ Sticky services ---------------------- */

function StickyServices() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={wrapRef}
      className="relative bg-[#0a1a00]"
      style={{ height: `${SERVICES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-[1600px] w-full mx-auto px-5 sm:px-8 lg:px-10 grid md:grid-cols-[1fr_2fr] gap-6 md:gap-16 items-start md:items-center">
          <div className="flex flex-col gap-4 sm:gap-6 pt-6 md:pt-0">
            <p className="label-mono text-[#93C63B] text-[10px] sm:text-[11px]">[SERVICES]</p>
            <p className="text-white/50 font-light max-w-xs leading-relaxed text-sm sm:text-base">
              Everything you need from one UK studio. Design through to delivery, handled in-house.
            </p>
            <Link
              href="/services"
              className="label-mono text-white hover:text-[#93C63B] flex items-center gap-2 mt-1 text-[10px] sm:text-[11px]"
            >
              All services →
            </Link>
          </div>

          <div className="relative h-[45vw] sm:h-[40vw] md:h-[60vh]">
            {SERVICES.map((service, i) => (
              <StickyServiceCard
                key={service.id}
                service={service}
                index={i}
                progress={scrollYProgress}
                total={SERVICES.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StickyServiceCard({
  service,
  index,
  progress,
  total,
}: {
  service: (typeof SERVICES)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  total: number;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const fadeIn = Math.max(0, start - 0.05);
  const fadeOut = Math.min(1, end + 0.05);
  const opacity = useTransform(
    progress,
    [fadeIn, start, end, fadeOut],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], [30, -30]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <p className="label-mono text-[#93C63B] mb-4 sm:mb-6 text-[10px] sm:text-[11px]">[{service.id}]</p>
      <h3 className="display text-white text-[clamp(2rem,7vw,7rem)]">
        {service.name}
      </h3>
      <p className="mt-4 sm:mt-8 text-white/60 max-w-xl font-light leading-relaxed text-sm sm:text-base">
        {service.description}
      </p>
    </motion.div>
  );
}

/* ------------------------ Category grid ------------------------ */

function CategoryGrid() {
  return (
    <section className="bg-white text-[#0a1a00] py-16 sm:py-24 md:py-40">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid md:grid-cols-[1fr_2fr] gap-6 md:gap-16 mb-10 sm:mb-16">
          <p className="label-mono text-[#0a1a00]/60 text-[10px] sm:text-[11px]">[CATALOGUE]</p>
          <div>
            <h2 className="display text-[clamp(2rem,6vw,6rem)]">
              Every category.
              <br />
              <span className="text-[#93C63B]">Every brand ready.</span>
            </h2>
            <p className="mt-6 sm:mt-8 text-[#0a1a00]/60 max-w-xl font-light text-sm sm:text-base">
              Thousands of promotional products, each customisable with your brand. Clothing, drinkware, tech, eco, event kit and beyond.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  index,
}: {
  cat: (typeof CATEGORIES)[number];
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        ref={ref}
        href={`/catalogue?category=${cat.slug}`}
        className={`group block aspect-[3/4] sm:aspect-[4/5] ${cat.tone} text-white p-4 sm:p-6 relative overflow-hidden`}
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `url(https://picsum.photos/seed/${cat.slug}/600/800)`,
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-between group-hover:[transform:rotateX(4deg)_rotateY(-4deg)] transition-transform duration-500">
          <div className="flex items-start justify-between">
            <span className="label-mono text-[#93C63B] text-[9px] sm:text-[11px]">
              [{String(index + 1).padStart(2, "0")}]
            </span>
            <span className="label-mono opacity-60 group-hover:opacity-100 group-hover:text-[#93C63B] transition-all text-[11px]">
              →
            </span>
          </div>
          <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tighter leading-[0.95] max-w-[10ch]">
            {cat.name}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

/* --------------------------- CTA band -------------------------- */

function CTABand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <section ref={ref} className="bg-[#0a1a00] text-white py-16 sm:py-24 md:py-40">
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label-mono text-[#FE6C05] mb-6 sm:mb-8 text-[10px] sm:text-[11px]"
        >
          [START A PROJECT]
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="display text-[clamp(2rem,7vw,8rem)] max-w-[14ch]"
        >
          Every brief is different.
          <br />
          <span className="text-[#93C63B]">Every quote is free.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 bg-[#93C63B] text-[#0a1a00] px-7 sm:px-8 py-4 sm:py-5 label-mono hover:bg-white transition-colors w-full sm:w-auto justify-center sm:justify-start"
          >
            Start Your Quote
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <a
            href="tel:08007314715"
            className="label-mono text-white/60 hover:text-white transition-colors text-[10px] sm:text-[11px] text-center sm:text-left"
          >
            OR CALL 0800 731 4715
          </a>
        </motion.div>
      </div>
    </section>
  );
}
