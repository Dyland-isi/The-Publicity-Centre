"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function AboutPage() {
  return (
    <div className="bg-[#0a1a00] text-white">
      {/* Hero */}
      <section className="pt-[160px] pb-24">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <p className="label-mono text-[#93C63B] mb-6">[ABOUT]</p>
          <h1 className="display text-[clamp(3rem,11vw,12rem)] max-w-[14ch]">
            Thirty years of
            <br />
            <span className="text-[#93C63B]">brand in hand.</span>
          </h1>
        </div>
      </section>

      {/* Stat counters */}
      <section className="border-y border-white/10 py-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          <AnimatedCounter end={30} suffix="+" label="[YEARS IN BUSINESS]" />
          <AnimatedCounter end={10000} suffix="+" label="[PRODUCTS SOURCED]" />
          <AnimatedCounter end={2} label="[UK OFFICES — LONDON & CARDIFF]" />
        </div>
      </section>

      {/* Story */}
      <section className="py-28">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid md:grid-cols-[1fr_2fr] gap-10 md:gap-20">
          <p className="label-mono text-[#93C63B]">[OUR STORY]</p>
          <div className="space-y-6 text-lg font-light text-white/80 leading-relaxed max-w-2xl">
            <p>
              The Publicity Centre opened its doors in 1995 with a single principle — do the
              work, do it well, keep the phone open. Three decades on that&apos;s still the
              brief.
            </p>
            <p>
              We&apos;re a UK-owned studio split across London and Cardiff, trusted by
              universities, car dealerships, public-sector buyers and fast-growing brands.
              Everything we do — graphic design, digital print, exhibition kit, branded
              merchandise — is handled by our own team.
            </p>
            <p>
              No outsourcing of the thinking, no mystery markup, no compromise on the
              materials. Just thirty years of knowing what works when your logo lands in
              someone&apos;s hand.
            </p>
          </div>
        </div>
      </section>

      {/* ISO + studio cards */}
      <section className="border-t border-white/10 py-28">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-6">
          <ISOCard
            code="ISO 9001"
            title="Quality Management"
            body="Independently audited quality systems across proofing, print and despatch — so repeat orders stay exactly on-brand, every time."
          />
          <ISOCard
            code="ISO 14001"
            title="Environmental Management"
            body="Certified environmental management. We source recycled stock, eco inks, carbon-balanced delivery and a growing eco product range."
          />
        </div>
      </section>

      {/* Studio */}
      <section className="border-t border-white/10 py-28">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 grid md:grid-cols-[2fr_1fr] gap-16 items-start">
          <div>
            <p className="label-mono text-[#93C63B] mb-6">[IN-HOUSE STUDIO]</p>
            <h2 className="display text-[clamp(2.5rem,7vw,6rem)] max-w-[16ch]">
              We&apos;re a studio first. A supplier second.
            </h2>
            <p className="mt-8 text-white/60 font-light max-w-xl leading-relaxed">
              Every job passes through our own designers, artworkers and production team.
              Your account manager sits two metres from the press. That&apos;s why our
              proofs turn round in hours, not days — and why rebrands don&apos;t stall at
              sign-off.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/services"
                className="label-mono bg-[#93C63B] text-[#0a1a00] px-7 py-4 hover:bg-white transition-colors"
              >
                View services →
              </Link>
              <Link
                href="/contact"
                className="label-mono border border-white/30 px-7 py-4 hover:bg-white hover:text-[#0a1a00] transition-colors"
              >
                Talk to us
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["design", "print", "merch", "events"].map((k) => (
              <div
                key={k}
                className="aspect-square bg-cover bg-center border border-white/10"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/studio-${k}/500/500)`,
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ISOCard({
  code,
  title,
  body,
}: {
  code: string;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="bg-[#1a2e0a] border border-white/10 p-10"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label-mono text-[#93C63B]">[{code}]</p>
          <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)] mt-3">{title}</h3>
        </div>
        <div className="w-20 h-20 border border-[#93C63B]/40 flex items-center justify-center label-mono text-[#93C63B] leading-tight text-center">
          {code.split(" ").join("\n")}
        </div>
      </div>
      <p className="mt-8 text-white/60 font-light leading-relaxed">{body}</p>
    </motion.div>
  );
}
