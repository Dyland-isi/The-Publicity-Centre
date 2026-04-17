import Link from "next/link";

export const metadata = {
  title: "Virtual Catalogue 2025 | The Publicity Centre",
  description:
    "Browse The Publicity Centre's complete promotional merchandise catalogue online. Flip through pages to find your next branded product.",
};

export default function VirtualCataloguePage() {
  return (
    <div className="bg-white text-[#0a1a00] min-h-screen">
      <section className="pt-[140px] pb-10 border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <p className="label-mono text-[#0a1a00]/60 mb-5">[VIRTUAL CATALOGUE]</p>
          <h1 className="display text-[clamp(2.5rem,9vw,9rem)]">
            Flip through
            <br />
            <span className="text-[#93C63B]">2025.</span>
          </h1>
          <p className="mt-6 text-[#0a1a00]/60 max-w-xl font-light">
            Our full promotional merchandise range in one browsable catalogue. Spot something you like — add it to a quote and we&apos;ll confirm pricing and lead time within one working day.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalogue"
              className="label-mono bg-[#0a1a00] text-white px-6 py-3 hover:bg-[#93C63B] hover:text-[#0a1a00] transition-colors"
            >
              Full Digital Catalogue →
            </Link>
            <Link
              href="/contact?service=catalogue-request"
              className="label-mono border border-[#0a1a00]/30 px-6 py-3 hover:bg-[#0a1a00] hover:text-white transition-colors"
            >
              Request a Printed Copy
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full" style={{ height: "calc(100vh - 72px)" }}>
        <iframe
          src="https://view.merchbook.co.uk/Catalogue/Promotional%20Merchandise%202025/?coverId=Publicity%20Centre"
          className="w-full h-full border-none"
          title="The Publicity Centre — Promotional Merchandise Catalogue 2025"
          allow="fullscreen"
        />
      </section>
    </div>
  );
}
