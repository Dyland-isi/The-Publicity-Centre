"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

// SVG aspect ratio: 1105 × 777 → ~1.42 : 1
function Logo() {
  return (
    <span className="shrink-0 flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="The Publicity Centre"
        width={160}
        height={113}
        className="h-9 w-auto"
      />
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isLight =
    pathname?.startsWith("/catalogue") ||
    pathname?.startsWith("/shop") ||
    pathname?.startsWith("/virtual-catalogue");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const textColour = isLight ? "text-[#0a1a00]" : "text-white";
  const linkHover = "hover:text-[#93C63B]";

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? isLight
              ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.04]"
              : "bg-[rgba(10,26,0,0.8)] backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center" aria-label="The Publicity Centre home">
              <Logo />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`label-mono transition-colors ${
                    isActive(link.href) ? "text-[#93C63B]" : `${textColour} ${linkHover}`
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="label-mono bg-[#93C63B] text-[#0a1a00] px-5 py-3 hover:bg-white transition-colors"
              >
                Get a Quote
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] ${mobileOpen ? "bg-white" : isLight ? "bg-[#0a1a00]" : "bg-white"}`}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`block w-6 h-[2px] ${mobileOpen ? "bg-white" : isLight ? "bg-[#0a1a00]" : "bg-white"}`}
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`block w-6 h-[2px] ${mobileOpen ? "bg-white" : isLight ? "bg-[#0a1a00]" : "bg-white"}`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-[#0a1a00] flex flex-col md:hidden"
          >
            <div className="flex-1 flex flex-col items-start justify-center px-8 gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.08 + 0.08 * i, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`text-5xl font-extrabold tracking-tighter ${
                      isActive(link.href) ? "text-[#93C63B]" : "text-white hover:text-[#93C63B]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * (navLinks.length + 1), duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-block label-mono bg-[#93C63B] text-[#0a1a00] px-6 py-4 hover:bg-white transition-colors"
                >
                  Get a Quote →
                </Link>
              </motion.div>
            </div>

            <div className="px-8 pb-10 flex flex-col gap-2 border-t border-white/10 pt-8">
              <a href="tel:08007314715" className="text-white hover:text-[#93C63B] text-2xl font-light">
                0800 731 4715
              </a>
              <span className="label-mono text-white/50">London · Cardiff · Est. 1995</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
