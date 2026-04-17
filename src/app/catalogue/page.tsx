"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import products from "@/../data/products.json";
import { useQuoteStore } from "@/store/quoteStore";
import QuoteDrawer from "@/components/QuoteDrawer";

const COLOUR_MAP: Record<string, string> = {
  Black: "#000000",
  Blue: "#2563eb",
  Red: "#dc2626",
  White: "#ffffff",
  Silver: "#c0c0c0",
  Navy: "#1e3a5f",
  Green: "#16a34a",
  Natural: "#d4b896",
  Grey: "#6b7280",
  Yellow: "#eab308",
  Orange: "#f97316",
  Pink: "#ec4899",
  Clear: "#e0f2fe",
  "Royal Blue": "#1d4ed8",
  "Bottle Green": "#006a4e",
};

type Product = (typeof products)[number];

export default function CataloguePage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [colourFilter, setColourFilter] = useState("All");
  const [leadTimeFilter, setLeadTimeFilter] = useState("All");

  const { addItem, openDrawer, items } = useQuoteStore();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    []
  );
  const colours = useMemo(
    () =>
      [
        "All",
        ...Array.from(new Set(products.flatMap((p) => p.colours || []))),
      ].slice(0, 16),
    []
  );
  const leadTimes = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.leadTime)))],
    []
  );

  const filtered = products.filter((p: Product) => {
    if (categoryFilter !== "All" && p.category !== categoryFilter) return false;
    if (colourFilter !== "All" && !(p.colours || []).includes(colourFilter))
      return false;
    if (leadTimeFilter !== "All" && p.leadTime !== leadTimeFilter) return false;
    return true;
  });

  return (
    <div className="bg-white text-[#0a1a00] min-h-screen">
      {/* Hero strip */}
      <section className="pt-[140px] pb-14 border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <p className="label-mono text-[#0a1a00]/60 mb-5">[CATALOGUE]</p>
          <h1 className="display text-[clamp(2.5rem,9vw,9rem)]">
            Promotional
            <br />
            <span className="text-[#93C63B]">catalogue.</span>
          </h1>
          <p className="mt-6 text-[#0a1a00]/60 max-w-xl font-light">
            {products.length} products, every one brandable. Add to your quote basket — we&apos;ll confirm stock, print costs and lead times within one working day.
          </p>
        </div>
      </section>

      {/* Sticky filter bar */}
      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex flex-wrap gap-3 items-center">
          <Filter
            label="Category"
            value={categoryFilter}
            options={categories}
            onChange={setCategoryFilter}
          />
          <Filter
            label="Colour"
            value={colourFilter}
            options={colours}
            onChange={setColourFilter}
          />
          <Filter
            label="Lead time"
            value={leadTimeFilter}
            options={leadTimes}
            onChange={setLeadTimeFilter}
          />
          <div className="flex-1" />
          <p className="label-mono text-[#0a1a00]/50 hidden sm:block">
            {filtered.length} MATCHES
          </p>
          <button
            onClick={openDrawer}
            className="label-mono bg-[#0a1a00] text-white px-5 py-3 hover:bg-[#93C63B] hover:text-[#0a1a00] transition-colors"
          >
            QUOTE BASKET ({items.length})
          </button>
        </div>
      </div>

      {/* Product grid */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAdd={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  productCode: product.productCode,
                  category: product.category,
                  image: product.image,
                })
              }
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="label-mono text-[#0a1a00]/50 text-center py-32">
            [NO MATCHES — TRY A WIDER FILTER]
          </p>
        )}
      </section>

      <QuoteDrawer />
    </div>
  );
}

/* ---------------- sub-components ---------------- */

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 border border-black/15 bg-white pr-1">
      <span className="label-mono text-[#0a1a00]/50 pl-3">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="label-mono bg-transparent py-2 pr-2 focus:outline-none text-[#0a1a00]"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function ProductCard({
  product,
  index,
  onAdd,
}: {
  product: Product;
  index: number;
  onAdd: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.03, 0.4),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group border border-black/10 hover:border-[#93C63B] transition-colors bg-white flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-[#fafafa] overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#0a1a00]/30 label-mono">
            [NO IMAGE]
          </div>
        )}
        <span className="absolute top-3 left-3 label-mono bg-[#93C63B] text-[#0a1a00] px-2 py-1">
          {product.category}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold tracking-tight leading-tight">{product.name}</h3>
          <span className="label-mono text-[#0a1a00]/50 shrink-0">
            {product.productCode}
          </span>
        </div>
        <p className="label-mono text-[#0a1a00]/50 mt-2">
          ⏱ {product.leadTime}
        </p>

        {/* Colour swatches */}
        {product.colours && product.colours.length > 0 && (
          <div className="mt-4 flex gap-1.5">
            {product.colours.slice(0, 5).map((c: string) => (
              <span
                key={c}
                title={c}
                className="w-4 h-4 rounded-full border border-black/10"
                style={{ background: COLOUR_MAP[c] || "#cccccc" }}
              />
            ))}
            {product.colours.length > 5 && (
              <span className="label-mono text-[#0a1a00]/40 ml-1">
                +{product.colours.length - 5}
              </span>
            )}
          </div>
        )}

        <button
          onClick={onAdd}
          className={`mt-auto pt-5 label-mono flex items-center justify-between border-t border-black/10 mt-5 transition-colors ${
            hover ? "text-[#93C63B]" : "text-[#0a1a00]"
          }`}
        >
          ADD TO QUOTE
          <span>+</span>
        </button>
      </div>
    </motion.article>
  );
}
