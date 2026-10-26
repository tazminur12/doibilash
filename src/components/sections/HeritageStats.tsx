"use client";

import React, { useEffect, useRef, useState } from "react";
import { Hourglass, HeartHandshake, Milk, Star } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
}

const STATS: StatItem[] = [
  { icon: Hourglass, value: 25, suffix: "+", label: "বছরের ঐতিহ্যবাহী কারিগরি" },
  { icon: HeartHandshake, value: 50000, suffix: "+", label: "তৃপ্ত পরিবারে সফল ডেলিভারি" },
  { icon: Milk, value: 100, suffix: "%", label: "খাঁটি গরুর দুধের নিশ্চয়তা" },
  { icon: Star, value: 4.9, decimals: 1, suffix: " / ৫", label: "গড় কাস্টমার রেটিং রিভিউ" },
];

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

const formatBn = (value: number, decimals = 0) =>
  value
    .toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const COUNT_DURATION_MS = 1600;

export default function HeritageStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setProgress(1);
          return;
        }

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / COUNT_DURATION_MS);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative mt-12 overflow-hidden rounded-2xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] ring-1 ring-doibrand-gold/20 shadow-[0_14px_36px_-22px_rgba(169,94,53,0.45)]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 w-72 h-32 rounded-full bg-[#F3D7AE]/40 blur-3xl" />

      <div className="relative grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          const current = stat.value * progress;
          const borders = [
            idx % 2 === 0 ? "border-r" : "",
            idx < 2 ? "border-b md:border-b-0" : "",
            idx === 1 || idx === 2 ? "md:border-r" : "",
          ].join(" ");

          return (
            <div
              key={stat.label}
              className={`group flex flex-col items-center text-center gap-2 px-3 py-6 sm:py-7 border-doibrand-gold/15 ${borders}`}
            >
              <span className="w-11 h-11 grid place-items-center rounded-full bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-4 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                <Icon className={`w-5 h-5 ${stat.icon === Star ? "fill-current" : ""}`} strokeWidth={2} />
              </span>
              <span className="mt-1 text-3xl sm:text-4xl font-extrabold tabular-nums leading-none tracking-tight bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent">
                {formatBn(stat.decimals ? current : Math.round(current), stat.decimals)}
                {stat.suffix}
              </span>
              <p className="text-[11px] sm:text-xs font-medium text-stone-500">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
