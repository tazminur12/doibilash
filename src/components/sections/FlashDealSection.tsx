"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, CheckCircle2, Flame, ArrowRight, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface FlashProduct {
  id: string | number;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  stockLeft: number;
  stockTotal: number;
  unit: string;
}

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: "flash-1",
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই (১ কেজি)",
    price: 499,
    originalPrice: 620,
    discount: "-২০%",
    image: "/Product/doi.jpg",
    stockLeft: 4,
    stockTotal: 25,
    unit: "১ কেজি সরা",
  },
  {
    id: "flash-2",
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: 420,
    originalPrice: 520,
    discount: "-১৯%",
    image: "/Product/laccha_semai.jpg",
    stockLeft: 6,
    stockTotal: 30,
    unit: "৫০০ গ্রাম বক্স",
  },
  {
    id: "flash-3",
    slug: "mini-doi-cup",
    title: "স্পেশাল মাটির কাপ দই (৪ পিস ফ্যামিলি প্যাক)",
    price: 380,
    originalPrice: 460,
    discount: "-১৭%",
    image: "/Product/mini_doi.png",
    stockLeft: 8,
    stockTotal: 40,
    unit: "৪ কাপ কম্বো",
  },
];

export default function FlashDealSection() {
  const { addItem, openCart } = useCart();
  const [addedId, setAddedId] = useState<string | number | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (prod: FlashProduct) => {
    addItem({
      id: prod.id,
      title: prod.title,
      price: prod.price,
      priceText: `৳ ${prod.price}`,
      image: prod.image,
      unit: prod.unit,
    });
    setAddedId(prod.id);
    openCart();
    setTimeout(() => setAddedId(null), 2500);
  };

  const timeUnits = [
    { value: timeLeft.hours, label: "ঘণ্টা" },
    { value: timeLeft.minutes, label: "মিনিট" },
    { value: timeLeft.seconds, label: "সেকেন্ড" },
  ];

  return (
    <section className="w-full font-bengali px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#FBE6CF] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-30px_rgba(169,94,53,0.5)] p-5 sm:p-8 lg:p-10">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#F7D9B0]/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

        {/* Section Header with Countdown Timer */}
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-7 sm:mb-9">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white text-[11px] font-bold tracking-wide shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              সীমিত সময়ের অফার
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
              আজকের স্পেশাল{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                ফ্ল্যাশ ডিল
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
              দিনের সেরা মূল্যে খাঁটি বগুড়ার দই ও মিষ্টান্ন সংগ্রহ করুন
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Countdown Clock */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex flex-col text-[11px] leading-tight text-stone-500">
                <span className="font-semibold text-doibrand-dark">অফার শেষ হতে</span>
                বাকি আছে
              </span>
              <div className="flex items-center gap-1.5">
                {timeUnits.map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    {i > 0 && <span className="text-lg font-bold text-doibrand-gold/70 -mt-4">:</span>}
                    <div className="w-14 sm:w-16 rounded-2xl bg-white/90 ring-1 ring-doibrand-gold/25 shadow-[0_8px_20px_-14px_rgba(169,94,53,0.7)] py-2 text-center">
                      <span
                        className={`block font-sans text-xl sm:text-2xl font-black tabular-nums leading-none ${
                          i === 2
                            ? "bg-linear-to-b from-[#D9534F] to-doibrand-accent bg-clip-text text-transparent"
                            : "text-doibrand-dark"
                        }`}
                      >
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block text-[10px] text-stone-500">{unit.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <Link
              href="/offers"
              className="group hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-doibrand-accent hover:text-doibrand-dark transition-colors"
            >
              সব অফার দেখুন
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Product Cards: swipe on mobile, grid on desktop */}
        <div className="relative -mx-5 px-5 sm:mx-0 sm:px-0 flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory hide-scrollbar pb-2 md:pb-0">
          {FLASH_PRODUCTS.map((prod) => {
            const soldCount = prod.stockTotal - prod.stockLeft;
            const progressPercent = Math.round((soldCount / prod.stockTotal) * 100);
            const savings = prod.originalPrice - prod.price;
            const isAdded = addedId === prod.id;

            return (
              <article
                key={prod.id}
                className="group snap-start shrink-0 w-[82%] sm:w-[60%] md:w-auto flex flex-col rounded-2xl bg-white/95 p-3 ring-1 ring-stone-200/70 shadow-[0_10px_30px_-20px_rgba(53,28,27,0.35)] transition-all duration-300 hover:-translate-y-1 hover:ring-doibrand-gold/50 hover:shadow-[0_24px_44px_-24px_rgba(169,94,53,0.55)]"
              >
                {/* Image with Badges */}
                <Link
                  href={`/products/${prod.slug}`}
                  className="relative block w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-100"
                >
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    sizes="(max-width: 768px) 82vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/25 to-transparent" />

                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-[#D9534F] to-doibrand-accent px-2.5 py-1 text-[11px] font-extrabold text-white shadow-md">
                    <Zap className="w-3 h-3 fill-current" />
                    {prod.discount} ছাড়
                  </span>
                  <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-doibrand-dark shadow-sm">
                    {prod.unit}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1">
                  {/* Title */}
                  <Link href={`/products/${prod.slug}`}>
                    <h3 className="font-bold text-[15px] leading-snug text-doibrand-dark line-clamp-1 transition-colors group-hover:text-doibrand-accent">
                      {prod.title}
                    </h3>
                  </Link>

                  {/* Pricing */}
                  <div className="mt-2 flex items-center gap-2.5 font-sans">
                    <span className="text-2xl font-black text-doibrand-accent">৳ {prod.price}</span>
                    <span className="text-sm text-stone-400 line-through">৳ {prod.originalPrice}</span>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/70 font-bengali">
                      ৳{savings} সাশ্রয়
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-[11px]">
                      <span className="text-stone-500">
                        বিক্রি হয়েছে <strong className="font-sans text-doibrand-dark">{progressPercent}%</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#C0392B]">
                        <Flame className="w-3 h-3" />
                        মাত্র {prod.stockLeft}টি বাকি
                      </span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#F5E6D3]">
                      <div
                        className="relative h-full overflow-hidden rounded-full bg-linear-to-r from-doibrand-gold to-doibrand-accent"
                        style={{ width: `${progressPercent}%` }}
                      >
                        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent animate-header-shine" />
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className={`mt-5 w-full rounded-xl py-3 text-sm font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                      isAdded
                        ? "bg-emerald-600 shadow-[0_10px_24px_-12px_rgba(5,150,105,0.8)]"
                        : "bg-linear-to-r from-doibrand-accent to-doibrand-gold bg-[length:150%_100%] bg-left hover:bg-right shadow-[0_10px_24px_-12px_rgba(169,94,53,0.9)]"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        কার্টে যুক্ত হয়েছে!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        এখনই অর্ডার করুন
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <Link
          href="/offers"
          className="sm:hidden mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-doibrand-accent"
        >
          সব অফার দেখুন
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
