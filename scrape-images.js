// Scrapes product images from publicitycentre.com and updates data/products.json
// Run with: node scrape-images.js

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

const BASE = 'https://www.publicitycentre.com';

// Category pages to scrape — one per product category in our data
const CATEGORY_PAGES = [
  { category: 'Pens & Writing', url: '/products/200-200-Plastic-Pens' },
  { category: 'Pens & Writing', url: '/products/190-190-Metal-Pens' },
  { category: 'Pens & Writing', url: '/products/230-230-Pencils' },
  { category: 'Drinkware', url: '/products/400-400-Travel-Mugs' },
  { category: 'Drinkware', url: '/products/420-420-Ceramic-Mugs' },
  { category: 'Drinkware', url: '/products/2610-2610-Drinking-Bottles' },
  { category: 'Bags & Totes', url: '/products/2850-2850-Bags-and-Cases' },
  { category: 'Bags & Totes', url: '/products/2240-2240-Bags' },
  { category: 'Technology & USB', url: '/products/1730-1730-USB-Products' },
  { category: 'Technology & USB', url: '/products/1170-1170-Computer-Accessories' },
  { category: 'Technology & USB', url: '/products/1620-1620-Telephone-Accessories' },
  { category: 'Clothing & Workwear', url: '/products/510-510-Polo-Shirts' },
  { category: 'Clothing & Workwear', url: '/products/590-590-High-Visibility-Wear' },
  { category: 'Clothing & Workwear', url: '/products/490-490-Hats-and-Caps' },
  { category: 'Eco & Sustainable', url: '/products/2230-2230-Pens-and-Writing-Instruments' },
  { category: 'Eco & Sustainable', url: '/products/2250-2250-Coasters-and-Mousemats' },
  { category: 'Eco & Sustainable', url: '/products/2270-2270-Notepads' },
  { category: 'Confectionery & Food', url: '/products/2170-2170-Confectionery' },
  { category: 'Confectionery & Food', url: '/products/2210-2210-Food-Gifts' },
  { category: 'Lanyards & Badges', url: '/products/870-870-Lanyards' },
  { category: 'Lanyards & Badges', url: '/products/2410-2410-Badges' },
  { category: 'Lanyards & Badges', url: '/products/2470-2470-Lanyards' },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function scrapeCategory(catUrl) {
  try {
    const res = await axios.get(BASE + catUrl, {
      timeout: 15000,
      httpsAgent: agent,
      headers: { 'User-Agent': 'Mozilla/5.0 (Publicity Centre Website Builder)' }
    });
    const $ = cheerio.load(res.data);
    const products = [];

    // Try to find product listings - common patterns on catalogue sites
    // Look for product images in various selectors
    $('img').each((i, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || $(el).attr('title') || '';

      // Filter for actual product images (not icons, logos, etc)
      if (src && !src.includes('gototop') && !src.includes('header') &&
          !src.includes('iso') && !src.includes('google') &&
          !src.includes('pixel') && !src.includes('spacer') &&
          (src.includes('/product') || src.includes('/uploads') ||
           src.includes('technologo') || src.includes('imageservice') ||
           src.includes('/image') || src.length > 20)) {

        let fullUrl = src;
        if (src.startsWith('/')) fullUrl = BASE + src;
        if (src.startsWith('//')) fullUrl = 'https:' + src;

        products.push({
          image: fullUrl,
          name: alt || `Product ${i}`,
        });
      }
    });

    // Also look for links to individual product pages
    const productLinks = [];
    $('a[href*="/product/"]').each((i, el) => {
      const href = $(el).attr('href') || '';
      if (href) {
        let fullHref = href;
        if (href.startsWith('/')) fullHref = BASE + href;
        productLinks.push(fullHref);
      }
    });

    console.log(`  Found ${products.length} images, ${productLinks.length} product links in ${catUrl}`);
    return { products, productLinks };
  } catch (err) {
    console.error(`  Error scraping ${catUrl}: ${err.message}`);
    return { products: [], productLinks: [] };
  }
}

async function scrapeProductPage(url) {
  try {
    const res = await axios.get(url, {
      timeout: 15000,
      httpsAgent: agent,
      headers: { 'User-Agent': 'Mozilla/5.0 (Publicity Centre Website Builder)' }
    });
    const $ = cheerio.load(res.data);
    const images = [];

    $('img').each((i, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || '';
      if (src && !src.includes('gototop') && !src.includes('header') &&
          !src.includes('iso') && !src.includes('google') &&
          (src.includes('/product') || src.includes('technologo') ||
           src.includes('imageservice') || src.includes('/image'))) {
        let fullUrl = src;
        if (src.startsWith('/')) fullUrl = BASE + src;
        if (src.startsWith('//')) fullUrl = 'https:' + src;
        images.push({ image: fullUrl, name: alt || 'Product' });
      }
    });

    return images;
  } catch (err) {
    return [];
  }
}

async function main() {
  console.log('Scraping product images from publicitycentre.com...\n');

  const allImages = {}; // category -> [{ image, name }]

  for (const cat of CATEGORY_PAGES) {
    console.log(`Scraping: ${cat.category} — ${cat.url}`);
    const { products, productLinks } = await scrapeCategory(cat.url);

    if (!allImages[cat.category]) allImages[cat.category] = [];
    allImages[cat.category].push(...products);

    // If we got product links, scrape first few for images
    for (const link of productLinks.slice(0, 3)) {
      await delay(300);
      const imgs = await scrapeProductPage(link);
      allImages[cat.category].push(...imgs);
    }

    await delay(500);
  }

  // Deduplicate images per category
  for (const cat of Object.keys(allImages)) {
    const seen = new Set();
    allImages[cat] = allImages[cat].filter(p => {
      if (seen.has(p.image)) return false;
      seen.add(p.image);
      return true;
    });
  }

  // Print summary
  console.log('\n=== SCRAPE RESULTS ===');
  let totalImages = 0;
  for (const [cat, imgs] of Object.entries(allImages)) {
    console.log(`${cat}: ${imgs.length} images`);
    totalImages += imgs.length;
    imgs.slice(0, 3).forEach(img => console.log(`  - ${img.image}`));
  }
  console.log(`\nTotal: ${totalImages} unique product images\n`);

  // Save scraped images
  fs.writeFileSync(
    path.join(__dirname, 'data', 'scraped-images.json'),
    JSON.stringify(allImages, null, 2)
  );
  console.log('Saved to data/scraped-images.json');

  // Now update products.json with real images
  const productsPath = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  let updated = 0;
  for (const product of products) {
    const catImages = allImages[product.category] || [];
    if (catImages.length > 0) {
      // Pick an image for this product (cycle through available images)
      const idx = updated % catImages.length;
      product.image = catImages[idx].image;
      updated++;
    }
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log(`Updated ${updated}/${products.length} products with real images`);

  // Also update shop-products.json
  const shopPath = path.join(__dirname, 'data', 'shop-products.json');
  const shopProducts = JSON.parse(fs.readFileSync(shopPath, 'utf8'));

  // Use confectionery and misc images for shop
  const confImages = allImages['Confectionery & Food'] || [];
  const allImagesFlat = Object.values(allImages).flat();

  for (let i = 0; i < shopProducts.length; i++) {
    if (confImages.length > 0 && shopProducts[i].category === 'Confectionery') {
      shopProducts[i].image = confImages[i % confImages.length].image;
    } else if (allImagesFlat.length > 0) {
      shopProducts[i].image = allImagesFlat[i % allImagesFlat.length].image;
    }
  }

  fs.writeFileSync(shopPath, JSON.stringify(shopProducts, null, 2));
  console.log(`Updated ${shopProducts.length} shop products with real images`);
}

main().catch(console.error);
