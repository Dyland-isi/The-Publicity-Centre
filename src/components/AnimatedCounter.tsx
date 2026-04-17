"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface Props {
  end: number;
  suffix?: string;
  label: string;
  prefix?: string;
}

export default function AnimatedCounter({ end, suffix = "", prefix = "", label }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    if (isInView && !fired.current) {
      fired.current = true;
      const controls = animate(0, end, {
        duration: 2.2,
        ease: [0.25, 0.1, 0.25, 1],
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="display text-[clamp(3.5rem,10vw,9rem)] text-[#93C63B] tabular-nums leading-none">
        {prefix}
        {display.toLocaleString()}
        {suffix}
      </div>
      <div className="label-mono text-white/60">{label}</div>
    </div>
  );
}
