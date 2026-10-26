"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowUpRight, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  englishName: string;
  subtitle: string;
  href: string;
  image: string;
  badge: string;
  itemCount: string;
}

const FEATURED_CATEGORIES: Category[] = [
  {
    id: "premium-doi",
    name: "প্রিমিয়াম দই",
    englishName: "Premium Doi",
    subtitle: "বগুড়ার মাটির সরার দই",
    href: "/category/premium-doi",
    image: "/Product/doi.jpg",
    badge: "হট ফেভারিট",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "laddu",
    name: "শাহী লাড্ডু",
    englishName: "Shahi Laddu",
    subtitle: "খাঁটি ঘিয়ে ভাজা মতিচুর",
    href: "/category/laddu",
    image:
      "/Product/placeholder.svg",
    badge: "বেস্ট সেলার",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "laccha-semai",
    name: "লাচ্ছা সেমাই",
    englishName: "Laccha Semai",
    subtitle: "ঘিয়ে ভাজা শাহী লাচ্ছা",
    href: "/category/laccha-semai",
    image: "/Product/laccha_semai.jpg",
    badge: "উৎসব স্পেশাল",
    itemCount: "৮+ আইটেম",
  },
  {
    id: "ghee",
    name: "দানাদার গাওয়া ঘি",
    englishName: "Pure Ghee",
    subtitle: "গাভীর দুধের খাঁটি ননী",
    href: "/shop",
    image:
      "/Product/placeholder.svg",
    badge: "১০০% খাঁটি",
    itemCount: "৫+ আইটেম",
  },
  {
    id: "honey",
    name: "প্রাকৃতিক মধু",
    englishName: "Raw Honey",
    subtitle: "সুন্দরবনের চাকের মধু",
    href: "/shop",
    image:
      "/Product/placeholder.svg",
    badge: "ন্যাচারাল",
    itemCount: "৬+ আইটেম",
  },
  {
    id: "sweets",
    name: "ঐতিহ্যবাহী মিষ্টি",
    englishName: "Traditional Sweets",
    subtitle: "রসগোল্লা, চমচম ও সন্দেশ",
    href: "/shop",
    image:
      "/Product/placeholder.svg",
    badge: "টাটকা স্বাদ",
    itemCount: "১১+ আইটেম",
  },
];

function CategoryImage({ cat }: { cat: Category }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#FBEBD2] via-[#F3D7AE] to-[#E2B57C]">
        <span className="text-6xl font-bold text-white/80 drop-shadow-sm select-none">
          {Array.from(cat.name)[0]}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={cat.image}
      alt={cat.name}
      fill
      sizes="(max-width: 640px) 44vw, (max-width: 1024px) 30vw, 200px"
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
    />
  );
}

export default function FeaturedCategories() {
  return (
    <section className="w-full font-bengali py-4 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent shadow-[0_4px_12px_-8px_rgba(169,94,53,0.6)]">
              <Sparkles className="w-3.5 h-3.5 text-doibrand-gold" />
              বাছাইকৃত বিশেষ কালেকশন
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
              জনপ্রিয়{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                ক্যাটাগরিসমূহ
              </span>
            </h2>
            <p className="mt-1.5 max-w-lg text-xs sm:text-sm text-stone-500">
              বগুড়ার শতাব্দী প্রাচীন মাটির সরার দই, খাঁটি গাওয়া ঘি ও মুখরোচক মিষ্টান্নের সমাহার
            </p>
          </div>

          <Link
            href="/shop"
            className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
          >
            সকল ক্যাটাগরি
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Categories: swipe on mobile, grid on larger screens */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory hide-scrollbar pt-1 pb-3 sm:pb-0">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative snap-start shrink-0 w-[44%] sm:w-auto aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5E6D3] ring-1 ring-stone-200/70 shadow-[0_10px_28px_-20px_rgba(53,28,27,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:ring-2 hover:ring-doibrand-gold/60 hover:shadow-[0_24px_40px_-22px_rgba(169,94,53,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-doibrand-gold"
            >
              <CategoryImage cat={cat} />

              {/* Soft top fade for badge legibility */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-black/25 to-transparent" />

              {/* Badge */}
              <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-doibrand-accent shadow-sm">
                {cat.badge}
              </span>

              {/* Frosted info panel */}
              <div className="absolute inset-x-2 bottom-2 rounded-xl bg-white/85 backdrop-blur-md ring-1 ring-white/60 px-3 py-2.5 shadow-[0_8px_20px_-12px_rgba(53,28,27,0.5)] transition-colors duration-300 group-hover:bg-white/95">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-bold leading-tight text-doibrand-dark line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] sm:text-[11px] text-stone-500 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-white shadow-sm transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                  <div className="overflow-hidden">
                    <p className="pt-1.5 mt-1.5 border-t border-doibrand-gold/20 text-[10px] font-semibold text-doibrand-gold">
                      {cat.itemCount}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/shop"
          className="sm:hidden mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-doibrand-accent"
        >
          সকল ক্যাটাগরি দেখুন
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
