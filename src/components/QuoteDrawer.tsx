"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteStore } from "@/store/quoteStore";

export default function QuoteDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateItem, clearItems } =
    useQuoteStore();
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    targetDate: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          deliveryDate: form.targetDate,
          items: items.map((i) => ({
            name: i.name,
            productCode: i.productCode,
            quantity: i.quantity,
            colour: i.colour,
            notes: i.notes,
            logoFileName: i.logoFileName,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send");
      }

      setStatus("sent");
      clearItems();
      setForm({ name: "", company: "", email: "", phone: "", targetDate: "" });
      setTimeout(() => {
        setStatus("idle");
        closeDrawer();
      }, 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] z-[80] bg-white text-[#0a1a00] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div>
                <p className="label-mono text-[#0a1a00]/60">[QUOTE BASKET]</p>
                <h2 className="text-2xl font-extrabold tracking-tighter mt-1">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close"
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="p-10 text-center text-[#0a1a00]/50">
                  <p className="label-mono mb-4">[EMPTY]</p>
                  <p className="text-sm">Add products from the catalogue to begin your quote.</p>
                </div>
              ) : (
                <ul className="divide-y divide-black/10">
                  {items.map((item) => (
                    <li key={item.id} className="p-5">
                      <div className="flex gap-4">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover bg-black/5 shrink-0"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-[#93C63B]/10 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-tight">{item.name}</p>
                          {item.productCode && (
                            <p className="label-mono text-[#0a1a00]/50 mt-1">
                              {item.productCode}
                            </p>
                          )}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="mt-2 label-mono text-[#0a1a00]/50 hover:text-red-600"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="label-mono text-[#0a1a00]/50">QTY</span>
                          <div className="mt-1 flex items-center border border-black/15">
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(item.id, {
                                  quantity: Math.max(1, item.quantity - 10),
                                })
                              }
                              className="px-3 py-2 text-sm hover:bg-black/5"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(item.id, {
                                  quantity: Math.max(1, parseInt(e.target.value) || 1),
                                })
                              }
                              className="flex-1 text-center py-2 bg-transparent focus:outline-none text-sm"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                updateItem(item.id, { quantity: item.quantity + 10 })
                              }
                              className="px-3 py-2 text-sm hover:bg-black/5"
                            >
                              +
                            </button>
                          </div>
                        </label>

                        <label className="block">
                          <span className="label-mono text-[#0a1a00]/50">COLOUR</span>
                          <input
                            type="text"
                            placeholder="e.g. Navy"
                            value={item.colour}
                            onChange={(e) =>
                              updateItem(item.id, { colour: e.target.value })
                            }
                            className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                          />
                        </label>
                      </div>

                      <label className="block mt-3">
                        <span className="label-mono text-[#0a1a00]/50">NOTES</span>
                        <textarea
                          rows={2}
                          placeholder="Print method, positioning, etc."
                          value={item.notes}
                          onChange={(e) =>
                            updateItem(item.id, { notes: e.target.value })
                          }
                          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B] resize-none"
                        />
                      </label>

                      <label className="block mt-3">
                        <span className="label-mono text-[#0a1a00]/50">
                          LOGO (PNG / SVG / PDF)
                        </span>
                        <input
                          type="file"
                          accept=".png,.svg,.pdf,image/png,image/svg+xml,application/pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            updateItem(item.id, { logoFileName: f?.name });
                          }}
                          className="mt-1 block w-full text-xs text-[#0a1a00]/70 file:mr-3 file:py-2 file:px-3 file:border-0 file:bg-[#0a1a00] file:text-white file:label-mono file:cursor-pointer"
                        />
                        {item.logoFileName && (
                          <p className="label-mono text-[#93C63B] mt-1">
                            ✓ {item.logoFileName}
                          </p>
                        )}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <form
                onSubmit={handleSubmit}
                className="border-t border-black/10 p-5 space-y-3 bg-[#fafafa]"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                  />
                  <input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                  />
                </div>
                <input
                  required
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                  />
                  <input
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                    className="border border-black/15 px-3 py-2 text-sm focus:outline-none focus:border-[#93C63B]"
                  />
                </div>

                {status === "error" && (
                  <p className="label-mono text-red-600">
                    {errorMsg || "Something went wrong."}
                  </p>
                )}
                {status === "sent" && (
                  <p className="label-mono text-[#93C63B]">
                    ✓ QUOTE SENT. WE&apos;LL BE IN TOUCH.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full bg-[#93C63B] text-[#0a1a00] label-mono py-4 hover:bg-[#0a1a00] hover:text-white transition-colors disabled:opacity-60"
                >
                  {status === "sending" ? "SENDING..." : "SUBMIT QUOTE"}
                </button>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
