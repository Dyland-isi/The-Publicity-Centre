"use client";

import { Suspense, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import products from "@/../data/shop-products.json";

function ShopInner() {
  const { items, addItem, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const checkout = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="bg-white text-[#0a1a00] min-h-screen">
      <section className="pt-[140px] pb-14 border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <p className="label-mono text-[#0a1a00]/60 mb-5">[SHOP]</p>
          <h1 className="display text-[clamp(2.5rem,9vw,9rem)]">
            Off-the-shelf.
            <br />
            <span className="text-[#93C63B]">Branded.</span>
          </h1>
          <p className="mt-6 text-[#0a1a00]/60 max-w-xl font-light">
            Ready-stock items, shipped UK-wide. For bespoke branding, quantity breaks or any custom print — use the full catalogue.
          </p>
        </div>
      </section>

      <div className="sticky top-[72px] z-30 bg-white/90 backdrop-blur-xl border-b border-black/10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
          <p className="label-mono text-[#0a1a00]/50">{products.length} PRODUCTS</p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="label-mono bg-[#0a1a00] text-white px-5 py-3 hover:bg-[#93C63B] hover:text-[#0a1a00] transition-colors"
          >
            CART ({itemCount})
          </button>
        </div>
      </div>

      <section className="max-w-[1600px] mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group border border-black/10 hover:border-[#93C63B] transition-colors"
            >
              <div className="aspect-square bg-[#fafafa] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold tracking-tight">{p.name}</h3>
                  <p className="font-semibold tabular-nums">£{p.price.toFixed(2)}</p>
                </div>
                <p className="mt-2 text-sm text-[#0a1a00]/60 font-light leading-relaxed">
                  {p.description}
                </p>
                <button
                  onClick={() =>
                    addItem({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      quantity: 1,
                      image: p.image,
                    })
                  }
                  className="mt-5 w-full label-mono border-t border-black/10 pt-5 flex items-center justify-between hover:text-[#93C63B] transition-colors"
                >
                  ADD TO CART
                  <span>+</span>
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Cart drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 right-0 h-full w-full sm:w-[440px] z-[80] bg-white text-[#0a1a00] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <div>
                  <p className="label-mono text-[#0a1a00]/60">[CART]</p>
                  <h2 className="text-2xl font-extrabold tracking-tighter mt-1">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </h2>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close"
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-10 text-center text-[#0a1a00]/50">
                    <p className="label-mono mb-3">[EMPTY]</p>
                    <p className="text-sm">Your cart is empty.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-black/10">
                    {items.map((item) => (
                      <li key={item.id} className="p-5 flex gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover bg-black/5"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="label-mono text-[#0a1a00]/50 mt-1">
                            £{item.price.toFixed(2)} EA
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 border border-black/15 flex items-center justify-center hover:bg-black/5"
                            >
                              −
                            </button>
                            <span className="tabular-nums">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 border border-black/15 flex items-center justify-center hover:bg-black/5"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto label-mono text-[#0a1a00]/50 hover:text-red-600"
                            >
                              REMOVE
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-black/10 p-5 space-y-4 bg-[#fafafa]">
                  <div className="flex items-center justify-between">
                    <span className="label-mono text-[#0a1a00]/60">TOTAL</span>
                    <span className="text-2xl font-extrabold tabular-nums">
                      £{total().toFixed(2)}
                    </span>
                  </div>
                  {err && <p className="label-mono text-red-600">{err}</p>}
                  <button
                    onClick={checkout}
                    disabled={loading}
                    className="w-full bg-[#93C63B] text-[#0a1a00] label-mono py-4 hover:bg-[#0a1a00] hover:text-white transition-colors disabled:opacity-60"
                  >
                    {loading ? "REDIRECTING..." : "CHECKOUT →"}
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full label-mono text-[#0a1a00]/50 hover:text-[#0a1a00]"
                  >
                    CLEAR CART
                  </button>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopInner />
    </Suspense>
  );
}
