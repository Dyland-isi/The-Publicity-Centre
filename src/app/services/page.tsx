"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SERVICES = [
  {
    id: "01",
    name: "Graphic Design",
    slug: "graphic-design",
    description:
      "Our in-house studio handles logo refreshes, brand guidelines, campaign artwork and print-ready files. Thirty years of craft, briefed and turned around from one building.",
    tag: "BRAND · ARTWORK · GUIDELINES",
    // Vivid neon poster design / creative studio workspace
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=1200&fit=crop&q=80",
    accentLabel: "IN-HOUSE STUDIO",
  },
  {
    id: "02",
    name: "Digital Print",
    slug: "digital-print",
    description:
      "Short-run and large-format digital printing — letterheads, brochures, posters, banners, POS. Proofed, printed and delivered UK-wide.",
    tag: "LITHO · DIGITAL · LARGE-FORMAT",
    // CMYK / vibrant large-format print output
    image: "https://images.unsplash.com/photo-1598618253325-c8bf3cde04c0?w=900&h=1200&fit=crop&q=80",
    accentLabel: "UK-WIDE DELIVERY",
  },
  {
    id: "03",
    name: "Exhibition Displays",
    slug: "exhibition-displays",
    description:
      "Event stands, pop-ups, roller banners and full trade-show kit. We design, produce, store and ship — so your team just shows up and sets up.",
    tag: "STANDS · BANNERS · SIGNAGE",
    // Exhibition hall with dramatic lighting
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=1200&fit=crop&q=80",
    accentLabel: "DESIGN → DELIVER",
  },
  {
    id: "04",
    name: "Car Dealerships",
    slug: "car-dealerships",
    description:
      "A specialist service for the motor trade: forecourt graphics, sales literature, showroom signage and branded customer gifts — all on one account.",
    tag: "FORECOURT · SHOWROOM · HANDOVER",
    // Sleek car showroom / luxury automotive
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&h=1200&fit=crop&q=80",
    accentLabel: "MOTOR TRADE SPECIALISTS",
  },
  {
    id: "05",
    name: "University & College",
    slug: "university-college",
    description:
      "Open-day collateral, student merch, freshers' packs, faculty signage and branded apparel. Framework-friendly, ISO-certified.",
    tag: "CAMPUS · MERCH · SIGNAGE",
    // Modern campus architecture / students
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=1200&fit=crop&q=80",
    accentLabel: "ISO CERTIFIED",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#0a1a00] text-white">
      {/* Hero */}
      <section className="pt-[130px] sm:pt-[160px] pb-16 sm:pb-24">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10">
          <p className="label-mono text-[#93C63B] mb-5 sm:mb-6">[SERVICES]</p>
          <h1 className="display text-[clamp(2.8rem,9vw,11rem)] max-w-[12ch]">
            One studio.
            <br />
            <span className="text-[#93C63B]">Five disciplines.</span>
          </h1>
          <p className="mt-6 sm:mt-8 text-white/60 max-w-xl font-light text-sm sm:text-base">
            Design, print, merchandise and event kit — handled in-house by one team. Scroll to see what we do.
          </p>

          {/* Service index pills */}
          <div className="mt-10 sm:mt-14 flex flex-wrap gap-2 sm:gap-3">
            {SERVICES.map((s) => (
              <a
                key={s.id}
                href={`#service-${s.slug}`}
                className="label-mono border border-white/20 text-white/60 hover:border-[#93C63B] hover:text-[#93C63B] px-4 py-2 transition-colors text-[9px] sm:text-[11px]"
              >
                [{s.id}] {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Service sections */}
      <div>
        {SERVICES.map((s, i) => (
          <ServiceSection key={s.id} service={s} reverse={i % 2 === 1} />
        ))}
      </div>

      {/* CTA */}
      <section className="py-20 sm:py-32 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 text-center">
          <p className="label-mono text-[#FE6C05] mb-5 sm:mb-6">[READY WHEN YOU ARE]</p>
          <h2 className="display text-[clamp(2.2rem,6vw,6rem)]">
            Let&apos;s build the brief.
          </h2>
          <p className="mt-5 text-white/50 max-w-md mx-auto font-light text-sm sm:text-base">
            One conversation, one team, one invoice. Start a project with us today.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 mt-8 sm:mt-10 bg-[#93C63B] text-[#0a1a00] px-7 sm:px-8 py-4 sm:py-5 label-mono hover:bg-white transition-colors"
          >
            Get a Quote →
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceSection({
  service,
  reverse,
}: {
  service: (typeof SERVICES)[number];
  reverse: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      id={`service-${service.slug}`}
      ref={ref}
      className="min-h-screen flex items-center border-t border-white/10 py-16 sm:py-20"
    >
      <div
        className={`max-w-[1600px] w-full mx-auto px-5 sm:px-8 lg:px-10 grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center ${
          reverse ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <p className="label-mono text-[#93C63B]">[{service.id}]</p>
            <span className="h-px flex-1 max-w-[60px] bg-white/10" />
            <p className="label-mono text-white/30 text-[9px] sm:text-[11px]">{service.accentLabel}</p>
          </div>
          <h2 className="display text-[clamp(2.4rem,6vw,8rem)] leading-[0.88]">
            {service.name}
          </h2>
          <p className="mt-6 sm:mt-8 text-white/60 max-w-lg font-light leading-relaxed text-sm sm:text-lg">
            {service.description}
          </p>
          <p className="label-mono text-white/30 mt-5 sm:mt-6 text-[9px] sm:text-[11px]">{service.tag}</p>

          <Link
            href={`/contact?service=${service.slug}`}
            className="inline-flex items-center gap-3 mt-8 sm:mt-10 border border-white/30 px-6 sm:px-7 py-3 sm:py-4 label-mono hover:bg-[#93C63B] hover:text-[#0a1a00] hover:border-[#93C63B] transition-colors text-[10px] sm:text-[11px]"
          >
            Get a Quote
            <span>→</span>
          </Link>
        </motion.div>

        {/* Futuristic image panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.15 }}
          className="scanlines group relative aspect-[3/4] sm:aspect-[4/5] bg-[#0c1f02] overflow-hidden border border-[#93C63B]/15 cursor-default"
        >
          {/* Background photograph */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 transition-opacity duration-700 scale-105 group-hover:scale-100 transition-transform duration-700"
            style={{ backgroundImage: `url(${service.image})` }}
          />

          {/* Duotone green wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a00]/80 via-[#0a1a00]/30 to-[#93C63B]/10" />

          {/* Horizontal data lines */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(147,198,59,0.6) 0px, rgba(147,198,59,0.6) 1px, transparent 1px, transparent 40px)",
            }}
          />

          {/* Corner brackets */}
          <div className="absolute top-5 left-5 w-7 h-7 border-t-2 border-l-2 border-[#93C63B]/50" />
          <div className="absolute top-5 right-5 w-7 h-7 border-t-2 border-r-2 border-[#93C63B]/50" />
          <div className="absolute bottom-5 left-5 w-7 h-7 border-b-2 border-l-2 border-[#93C63B]/50" />
          <div className="absolute bottom-5 right-5 w-7 h-7 border-b-2 border-r-2 border-[#93C63B]/50" />

          {/* Top sys label */}
          <div className="absolute top-5 left-0 right-0 flex justify-center pointer-events-none">
            <p className="label-mono text-[#93C63B]/50 text-[8px] sm:text-[9px] tracking-widest">
              SYS/{service.id} · ACTIVE
            </p>
          </div>

          {/* Bottom readout bar */}
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 py-4 bg-gradient-to-t from-[#0a1a00] to-transparent flex items-end justify-between">
            <div>
              <p className="label-mono text-[#93C63B] text-[9px] sm:text-[11px]">
                {String(parseInt(service.id)).padStart(2, "0")} / 05
              </p>
              <p className="label-mono text-white/30 text-[8px] mt-0.5 hidden sm:block">
                THE PUBLICITY CENTRE · {service.accentLabel}
              </p>
            </div>
            <div className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#93C63B] animate-pulse" />
              <p className="label-mono text-[#93C63B]/60 text-[8px]">LIVE</p>
            </div>
          </div>

          {/* Glitch accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-[38%] left-0 right-0 h-px bg-[#93C63B]/20 origin-left"
          />
        </motion.div>
      </div>
    </section>
  );
}
