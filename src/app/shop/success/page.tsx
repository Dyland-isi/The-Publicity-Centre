"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { motion } from "framer-motion";

export default function ShopSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="bg-white text-[#0a1a00] min-h-screen flex items-center">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-32 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label-mono text-[#93C63B] mb-8"
        >
          [ORDER CONFIRMED]
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="display text-[clamp(2.5rem,8vw,7rem)]"
        >
          Thank you.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-[#0a1a00]/60 max-w-lg mx-auto font-light"
        >
          Your order is in. A confirmation email with tracking details is on its way. If you branded an item with a custom logo, our studio will be in touch to approve artwork.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/shop"
            className="label-mono bg-[#0a1a00] text-white px-7 py-4 hover:bg-[#93C63B] hover:text-[#0a1a00] transition-colors"
          >
            ← BACK TO SHOP
          </Link>
          <Link
            href="/"
            className="label-mono border border-[#0a1a00]/30 px-7 py-4 hover:bg-[#0a1a00] hover:text-white transition-colors"
          >
            HOME
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
