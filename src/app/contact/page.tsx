"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const SERVICES = [
  "Branded Merchandise",
  "Graphic Design",
  "Digital Print",
  "Exhibition Displays",
  "Car Dealerships",
  "University & College",
  "General Enquiry",
];

function ContactForm() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get("service") || "";

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: preselect
      ? SERVICES.find((s) =>
          s.toLowerCase().replace(/\s+/g, "-") === preselect
        ) || "General Enquiry"
      : "General Enquiry",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          serviceInterest: form.service,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Send failed");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Name *"
          value={form.name}
          required
          onChange={(v) => update("name", v)}
        />
        <Field
          label="Company"
          value={form.company}
          onChange={(v) => update("company", v)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Email *"
          type="email"
          value={form.email}
          required
          onChange={(v) => update("email", v)}
        />
        <Field
          label="Phone"
          type="tel"
          value={form.phone}
          onChange={(v) => update("phone", v)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="label-mono text-white/50">Service interest</label>
        <select
          value={form.service}
          onChange={(e) => update("service", e.target.value)}
          className="bg-[#1a2e0a] border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#93C63B] label-mono"
        >
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="label-mono text-white/50">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your project, deadline, quantities…"
          className="bg-[#1a2e0a] border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#93C63B] resize-none placeholder-white/30"
        />
      </div>

      {status === "error" && (
        <p className="label-mono text-red-400">{errMsg || "Something went wrong."}</p>
      )}
      {status === "sent" ? (
        <div className="bg-[#93C63B]/10 border border-[#93C63B]/40 p-5">
          <p className="label-mono text-[#93C63B]">
            ✓ MESSAGE SENT. WE&apos;LL COME BACK TO YOU WITHIN ONE WORKING DAY.
          </p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full bg-[#93C63B] text-[#0a1a00] label-mono py-5 hover:bg-white transition-colors disabled:opacity-60 mt-2"
        >
          {status === "sending" ? "SENDING…" : "SEND MESSAGE →"}
        </button>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="label-mono text-white/50">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#1a2e0a] border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#93C63B] placeholder-white/30"
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="bg-[#0a1a00] text-white min-h-screen">
      <section className="pt-[160px] pb-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-16 lg:gap-28">
            {/* Left */}
            <div>
              <p className="label-mono text-[#93C63B] mb-6">[CONTACT]</p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="display text-[clamp(3rem,8vw,8rem)] leading-[0.9]"
              >
                Let&apos;s make
                <br />
                <span className="text-[#93C63B]">something.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-12 space-y-8"
              >
                <div>
                  <p className="label-mono text-white/40 mb-2">[PHONE]</p>
                  <a
                    href="tel:08007314715"
                    className="text-3xl font-light hover:text-[#93C63B] transition-colors"
                  >
                    0800 731 4715
                  </a>
                  <p className="label-mono text-white/40 mt-1">FREE FROM UK MOBILES & LANDLINES</p>
                </div>

                <div>
                  <p className="label-mono text-white/40 mb-2">[EMAIL]</p>
                  <a
                    href="mailto:info@publicitycentre.com"
                    className="text-xl font-light hover:text-[#93C63B] transition-colors"
                  >
                    info@publicitycentre.com
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <OfficeCard
                    city="London"
                    desc="Design, accounts & creative direction"
                  />
                  <OfficeCard
                    city="Cardiff"
                    desc="Print, production & fulfilment"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Suspense fallback={<p className="label-mono text-white/40">Loading…</p>}>
                <ContactForm />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OfficeCard({ city, desc }: { city: string; desc: string }) {
  return (
    <div className="bg-[#1a2e0a] border border-white/10 p-6">
      <p className="label-mono text-[#93C63B] mb-2">[{city.toUpperCase()}]</p>
      <p className="text-white/60 font-light text-sm">{desc}</p>
    </div>
  );
}
