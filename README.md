# The Publicity Centre

Next.js 14 website for The Publicity Centre — UK promotional merchandise, print and marketing. London & Cardiff. ISO 9001 & ISO 14001. Est. 1995.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| 3D | Three.js (dynamic import, SSR-off) |
| State | Zustand (persisted to localStorage) |
| Email | Resend |
| Payments | Stripe Checkout |
| Fonts | Geist + Geist Mono (local) |

---

## Project Structure

```
src/
  app/
    page.tsx                  # Homepage (server shell)
    layout.tsx                # Root layout, fonts, metadata
    globals.css               # Design system, animations
    catalogue/page.tsx        # Product catalogue + quote basket
    shop/
      page.tsx                # Stripe shop
      success/page.tsx        # Post-checkout confirmation
    services/page.tsx         # Services — scroll-reveal sections
    about/page.tsx            # Company story, counters, ISO
    contact/page.tsx          # Contact form → Resend
    virtual-catalogue/page.tsx # Embedded MerchBook iframe
    api/
      quote/route.ts          # Quote basket → Resend email
      contact/route.ts        # Contact form → Resend email
      checkout/route.ts       # Stripe Checkout session
  components/
    Navbar.tsx                # Sticky, blur-on-scroll, mobile overlay
    Footer.tsx                # Dark footer, ISO badges
    PageTransition.tsx        # AnimatePresence slide/fade transitions
    HomeClient.tsx            # Homepage sections (client)
    HeroSphere.tsx            # Three.js dotted sphere
    QuoteDrawer.tsx           # Slide-in quote basket
    AnimatedCounter.tsx       # Scroll-triggered count-up
  store/
    quoteStore.ts             # Zustand — quote items + drawer state
    cartStore.ts              # Zustand — shop cart (persisted)
  lib/
    resend.ts                 # Resend singleton
    stripe.ts                 # Stripe server + client helpers
data/
  products.json               # Catalogue products (seed or scraped)
  shop-products.json          # Shop items (6 seed products)
scraper.js                    # Node.js product scraper
```

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd the-publicity-centre
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page |
| `NEXT_PUBLIC_BASE_URL` | Your site URL (or `http://localhost:3000`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional — Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Resend — email setup

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your sending domain (e.g. `publicitycentre.com`).
3. Generate an API key and paste it into `.env.local`.
4. The `from` addresses in the API routes are set to `noreply@publicitycentre.com`. Update them if your verified domain differs.
5. Quote requests go to `quotes@publicitycentre.com`. Contact forms go to `info@publicitycentre.com`. Update both in `src/app/api/quote/route.ts` and `src/app/api/contact/route.ts`.

---

## Stripe — connecting the client's account

1. Have the client log in to [dashboard.stripe.com](https://dashboard.stripe.com).
2. Go to **Developers → API Keys**.
3. Copy the **Publishable key** (starts `pk_live_...`) and **Secret key** (starts `sk_live_...`).
4. Set them in the environment:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
5. In **Stripe → Settings → Customer portal**, enable the portal if you want customers to manage subscriptions.
6. Stripe uses GBP by default in the checkout route. Amounts are in pence (e.g. £4.50 = `450`).

> During development use `sk_test_...` / `pk_test_...` keys. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

---

## Product scraper

The scraper fetches product listings from [publicitycentre.com/catalogue](https://www.publicitycentre.com/catalogue) and writes to `data/products.json`.

```bash
node scraper.js
```

Output:
- `data/products.json` — array of product objects

Each product object:
```json
{
  "id": "prod-...",
  "name": "Classic Ballpoint Pen",
  "slug": "classic-ballpoint-pen",
  "category": "Pens & Writing",
  "description": "...",
  "colours": ["Black", "Blue", "Red"],
  "dimensions": "140mm x 10mm",
  "leadTime": "5-7 working days",
  "productCode": "PEN-001",
  "priceOnRequest": true,
  "image": "https://...",
  "sourceUrl": "https://www.publicitycentre.com/products/..."
}
```

The scraper throttles at 500 ms between requests and deduplicates by slug. If the site structure changes, update the CSS selectors in `collectProductLinks()` and `scrapeProduct()`.

---

## Vercel deployment

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Vercel auto-detects Next.js — no build config needed.
4. Under **Settings → Environment Variables**, add all variables from `.env.example`.
5. Set `NEXT_PUBLIC_BASE_URL` to your Vercel production URL (e.g. `https://publicitycentre.vercel.app`).
6. Deploy. Done.

### Custom domain

In Vercel → **Settings → Domains**, add `www.publicitycentre.com` and follow the DNS instructions. Update `NEXT_PUBLIC_BASE_URL` to match.

---

## Colour palette

| Token | Hex | Usage |
|---|---|---|
| Brand dark | `#0a1a00` | Primary background |
| Brand card | `#1a2e0a` | Card / section break |
| Brand green | `#93C63B` | Accent, CTAs, particles |
| Brand orange | `#FE6C05` | Logo wordmark, one CTA variant |
| White | `#ffffff` | Body text on dark; bg on light pages |

---

## Pages at a glance

| Route | Theme | Notes |
|---|---|---|
| `/` | Dark | Hero sphere, sticky services, category grid |
| `/catalogue` | Light | Filter bar, product grid, quote drawer |
| `/shop` | Light | Stripe checkout, cart drawer |
| `/shop/success` | Light | Post-purchase confirmation |
| `/services` | Dark | Scroll-reveal service sections |
| `/about` | Dark | Animated counters, ISO cards, studio grid |
| `/contact` | Dark | Form → Resend, pre-fills `?service=` param |
| `/virtual-catalogue` | Light | Full-height MerchBook iframe |

---

## License

Private — all rights reserved. © The Publicity Centre 2025.
