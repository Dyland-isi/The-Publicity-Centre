import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const geist = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.publicitycentre.com"),
  title: "The Publicity Centre — Promotional Merchandise, Print & Marketing",
  description:
    "UK supplier of promotional merchandise, branded products, print and marketing. London & Cardiff. ISO 9001 & ISO 14001. Call 0800 731 4715.",
  keywords: [
    "promotional merchandise",
    "branded products",
    "print services",
    "exhibition displays",
    "UK",
    "London",
    "Cardiff",
    "ISO 9001",
  ],
  openGraph: {
    title: "The Publicity Centre",
    description:
      "Promotional merchandise, print and marketing for UK businesses. Est. 1995.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-brand-dark text-white font-sans antialiased">
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </body>
    </html>
  );
}
