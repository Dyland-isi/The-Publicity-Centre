import Link from "next/link";

const primaryLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/virtual-catalogue", label: "Virtual Catalogue" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a1a00] text-white border-t border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="The Publicity Centre"
              width={160}
              height={113}
              className="h-10 w-auto"
            />

            <p className="mt-6 text-white/50 font-light max-w-sm leading-relaxed">
              UK promotional merchandise, print and marketing. Thirty years of brand work from London & Cardiff.
            </p>

            <div className="mt-8 flex gap-3">
              <div className="flex items-center justify-center w-16 h-16 border border-[#93C63B]/30 label-mono text-[#93C63B] leading-none text-center">
                ISO<br />9001
              </div>
              <div className="flex items-center justify-center w-16 h-16 border border-[#93C63B]/30 label-mono text-[#93C63B] leading-none text-center">
                ISO<br />14001
              </div>
            </div>
          </div>

          <div>
            <p className="label-mono text-white/40 mb-5">[NAVIGATE]</p>
            <ul className="space-y-3">
              {primaryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-[#93C63B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-mono text-white/40 mb-5">[CONTACT]</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:08007314715"
                  className="text-white hover:text-[#93C63B] transition-colors"
                >
                  0800 731 4715
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@publicitycentre.com"
                  className="text-white/80 hover:text-[#93C63B] transition-colors break-all"
                >
                  info@publicitycentre.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="label-mono text-white/40 mb-5">[OFFICES]</p>
            <ul className="space-y-4 text-white/70 font-light text-sm leading-relaxed">
              <li>
                <span className="label-mono text-[#93C63B] block mb-1">LONDON</span>
                Central design, account & production
              </li>
              <li>
                <span className="label-mono text-[#93C63B] block mb-1">CARDIFF</span>
                Print, fulfilment & logistics
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="label-mono text-white/40">
            © THE PUBLICITY CENTRE 2025 — ALL RIGHTS RESERVED
          </p>
          <p className="label-mono text-white/40">
            MADE IN THE UK
          </p>
        </div>
      </div>
    </footer>
  );
}
