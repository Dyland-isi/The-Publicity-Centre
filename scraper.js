/**
 * scraper.js
 * Scrapes https://www.publicitycentre.com/catalogue for product data.
 *
 * Usage: node scraper.js
 * Output: data/products.json
 *
 * Dependencies: node-fetch, cheerio (already in node_modules via Next.js build)
 * If missing: npm install node-fetch cheerio
 */

const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

// ─── Config ──────────────────────────────────────────────────────────────────

const BASE_URL = "https://www.publicitycentre.com";
const CATALOGUE_URL = `${BASE_URL}/catalogue`;
const OUT_PATH = path.join(__dirname, "data", "products.json");
const DELAY_MS = 500;

const SLUG_CATEGORY_MAP = {
  "pens-pencils": "Pens & Writing",
  "pens-writing": "Pens & Writing",
  writing: "Pens & Writing",
  drinkware: "Ceramics & Mugs",
  mugs: "Ceramics & Mugs",
  "travel-mugs": "Ceramics & Mugs",
  "bags-totes": "Clothing & Textiles",
  bags: "Clothing & Textiles",
  clothing: "Clothing & Textiles",
  workwear: "Clothing & Textiles",
  "tech-usb": "Tech & USB",
  technology: "Tech & USB",
  usb: "Tech & USB",
  eco: "Eco & Recycled",
  "eco-sustainable": "Eco & Recycled",
  sustainable: "Eco & Recycled",
  "conference-exhibition": "Conference & Exhibition",
  conference: "Conference & Exhibition",
  exhibition: "Conference & Exhibition",
  "food-drink": "Food & Drink",
  confectionery: "Food & Drink",
  food: "Food & Drink",
  "executive-gifts": "Executive Gifts",
  executive: "Executive Gifts",
  gifts: "Executive Gifts",
  lanyards: "Conference & Exhibition",
  badges: "Conference & Exhibition",
};
const DEFAULT_CATEGORY = "Branded Merchandise";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function slugToCategory(urlPath) {
  const parts = urlPath.toLowerCase().split(/[-/]/);
  for (const part of parts) {
    if (SLUG_CATEGORY_MAP[part]) return SLUG_CATEGORY_MAP[part];
  }
  for (let i = 0; i < parts.length - 1; i++) {
    const combo = `${parts[i]}-${parts[i + 1]}`;
    if (SLUG_CATEGORY_MAP[combo]) return SLUG_CATEGORY_MAP[combo];
  }
  return DEFAULT_CATEGORY;
}

function toSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; ProductScraper/1.0)",
      Accept: "text/html,application/xhtml+xml",
    },
    timeout: 15000,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ─── Step 1: Collect product hrefs from catalogue ───────────────────────────

async function collectProductLinks() {
  console.log(`[fetch] ${CATALOGUE_URL}`);
  const html = await fetchHtml(CATALOGUE_URL);
  const $ = cheerio.load(html);
  const hrefs = new Set();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    if (href.includes("/products/") || href.includes("/product/")) {
      const full = href.startsWith("http")
        ? href
        : `${BASE_URL}${href.startsWith("/") ? "" : "/"}${href}`;
      hrefs.add(full);
    }
  });

  console.log(`[found] ${hrefs.size} product URLs`);
  return Array.from(hrefs);
}

// ─── Step 2: Scrape individual product page ──────────────────────────────────

async function scrapeProduct(url) {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const name =
    $("h1").first().text().trim() ||
    $(".product-title, .product-name").first().text().trim() ||
    $("title").text().replace(/\|.*$/, "").trim();

  if (!name) return null;

  const description =
    $(".product-description, .description").first().text().trim() ||
    $("meta[name='description']").attr("content") ||
    "";

  const productCodeText =
    $("[class*='product-code'], [class*='sku']").first().text() || "";
  const productCodeMatch = productCodeText.match(/[A-Z0-9][-A-Z0-9]{2,}/i);
  const productCode = productCodeMatch
    ? productCodeMatch[0].toUpperCase()
    : url.split("/").filter(Boolean).pop()?.toUpperCase().slice(0, 12) || "N/A";

  const colours = [];
  $("[class*='colour'], [class*='color'], .swatch").each((_, el) => {
    const title =
      $(el).attr("title") || $(el).attr("data-colour") || $(el).text().trim();
    if (title && title.length < 30) colours.push(title);
  });
  if (!colours.length) {
    $("select[name*='colour'] option, select[name*='color'] option").each(
      (_, el) => {
        const val = $(el).text().trim();
        if (val && val.toLowerCase() !== "select" && val.length < 30)
          colours.push(val);
      }
    );
  }

  const dimText =
    $("[class*='dimension'], [class*='size']").first().text().trim() || "";
  const dimensions = dimText.replace(/\s+/g, " ").slice(0, 80) || "See product details";

  const leadText =
    $("[class*='lead-time'], [class*='leadtime'], [class*='delivery']")
      .first()
      .text()
      .trim() || "";
  const leadMatch = leadText.match(/\d+[-–]\d+\s*(?:working\s+)?days?/i);
  const leadTime = leadMatch ? leadMatch[0] : "7-10 working days";

  const imgSrc =
    $(".product-image img, [class*='product-img'] img, .main-image img")
      .first()
      .attr("src") ||
    $("img[class*='product']").first().attr("src") ||
    "";
  const image = imgSrc
    ? imgSrc.startsWith("http")
      ? imgSrc
      : `${BASE_URL}${imgSrc.startsWith("/") ? "" : "/"}${imgSrc}`
    : "";

  const urlPath = new URL(url).pathname;
  const slug = toSlug(name);
  const category = slugToCategory(urlPath);
  const id = `prod-${toSlug(name).slice(0, 20)}-${Date.now().toString(36)}`;

  return {
    id,
    name,
    slug,
    category,
    description: description.slice(0, 500),
    colours: [...new Set(colours)].slice(0, 8),
    dimensions,
    leadTime,
    productCode,
    priceOnRequest: true,
    image,
    sourceUrl: url,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════╗");
  console.log("║  The Publicity Centre — Scraper  ║");
  console.log("╚══════════════════════════════════╝\n");

  let productLinks;
  try {
    productLinks = await collectProductLinks();
  } catch (err) {
    console.error(`[fatal] Could not fetch catalogue page: ${err.message}`);
    process.exit(1);
  }

  if (!productLinks.length) {
    console.warn(
      "[warn] No product links found — site structure may have changed.\n" +
        "       Update the href selectors in collectProductLinks()."
    );
    process.exit(0);
  }

  const results = [];
  let scraped = 0;
  let failed = 0;

  for (let i = 0; i < productLinks.length; i++) {
    const url = productLinks[i];
    process.stdout.write(`[${i + 1}/${productLinks.length}] ${url} … `);
    try {
      await sleep(DELAY_MS);
      const product = await scrapeProduct(url);
      if (product) {
        results.push(product);
        scraped++;
        console.log(`[scraped] ${product.name}`);
      } else {
        failed++;
        console.log("[skip] no name found");
      }
    } catch (err) {
      failed++;
      console.log(`[failed] ${err.message}`);
    }
  }

  // Deduplicate by slug
  const seen = new Set();
  const unique = results.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(unique, null, 2));

  console.log(`\n✓ Complete`);
  console.log(`  Scraped : ${scraped}`);
  console.log(`  Failed  : ${failed}`);
  console.log(`  Unique  : ${unique.length}`);
  console.log(`  Output  : ${OUT_PATH}\n`);
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
