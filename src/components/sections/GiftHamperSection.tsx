"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Check, ShoppingBag, ChevronRight, Crown, Building2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface HamperItem {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  badge: string;
  image: string;
  features: string[];
  featured?: boolean;
}

const HAMPERS: HamperItem[] = [
  {
    id: "hamper-1",
    title: "শাহী সরা উপহার প্যাকেজ",
    subtitle: "বিয়ে, জন্মদিন ও পারিবারিক অনুষ্ঠানের জন্য",
    price: 1850,
    originalPrice: 2150,
    badge: "সবচেয়ে জনপ্রিয়",
    image: "/Product/doi.jpg",
    featured: true,
    features: [
      "১ কেজি বগুড়ার স্পেশাল সরার দই",
      "৫০০ গ্রাম খাঁটি দানাদার গাওয়া ঘি",
      "২৫০ গ্রাম সুন্দরবনের প্রাকৃতিক মধু",
      "রয়েল গোল্ডেন ফিতা ও গ্রিটিংস কার্ড",
    ],
  },
  {
    id: "hamper-2",
    title: "আনন্দ মিষ্টিমুখ কম্বো বক্স",
    subtitle: "পারিবারিক অতিথি আপ্যায়নে আদর্শ",
    price: 1450,
    originalPrice: 1680,
    badge: "উৎসব স্পেশাল",
    image: "/Product/laccha_semai.jpg",
    features: [
      "১ কেজি ঐতিহ্যবাহী মাটির হাঁড়ির মিষ্টি দই",
      "১ কেজি নরম স্পঞ্জ রসগোল্লা",
      "৫০০ গ্রাম ঘিয়ে ভাজা লাচ্ছা সেমাই",
      "প্রিমিয়াম ফেস্টিভ্যাল গিফট বক্স",
    ],
  },
  {
    id: "hamper-3",
    title: "কর্পোরেট রয়্যাল গিফট হ্যাম্পার",
    subtitle: "ব্যবসায়িক ক্লায়েন্ট ও কর্মীদের বিশেষ উপহার",
    price: 2450,
    originalPrice: 2800,
    badge: "কর্পোরেট চয়েস",
    image: "/Product/mini_doi.png",
    features: [
      "২টি মাটির স্পেশাল কাপ দই সেট",
      "১ কেজি মতিচুর স্পেশাল লাড্ডু",
      "৫০০ গ্রাম প্রিমিয়াম দানাদার ঘি",
      "কাস্টম ব্র্যান্ডেড কাঠের লাক্সারি বক্স",
    ],
  },
];

const formatTaka = (amount: number) => `৳ ${amount.toLocaleString("en-US")}`;

export default function GiftHamperSection() {
  const { addItem, openCart } = useCart();

  const handleOrderHamper = (hamper: HamperItem) => {
    addItem({
      id: hamper.id,
      title: hamper.title,
      price: hamper.price,
      priceText: formatTaka(hamper.price),
      image: hamper.image,
      unit: "১টি লাক্সারি বক্স",
    });
    openCart();
  };

  return (
    <section className="w-full font-bengali pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent shadow-[0_4px_12px_-8px_rgba(169,94,53,0.6)]">
              <Gift className="w-3.5 h-3.5 text-doibrand-gold" />
              উপহার ও উৎসব সম্ভার
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
              প্রিয়জনের মুখে হাসি ফোটাতে{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                রাজকীয় উপহার
              </span>
            </h2>
            <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-stone-500">
              উৎসবের দিনগুলোতে মিষ্টিমুখ করান বগুড়ার সেরা দই ও মিষ্টান্নের প্রিমিয়াম গিফট হ্যাম্পারে।
            </p>
          </div>

          <Link
            href="/shop"
            className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
          >
            সকল গিফট বক্স
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Hamper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {HAMPERS.map((hamper) => {
            const savings = hamper.originalPrice - hamper.price;
            return (
              <div
                key={hamper.id}
                className={`group rounded-3xl p-px transition-all duration-300 hover:-translate-y-1 ${
                  hamper.featured
                    ? "bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_24px_48px_-26px_rgba(169,94,53,0.7)]"
                    : "bg-stone-200/70 hover:bg-doibrand-gold/50 shadow-[0_12px_30px_-22px_rgba(53,28,27,0.45)] hover:shadow-[0_24px_44px_-24px_rgba(169,94,53,0.55)]"
                }`}
              >
                <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-2.5 sm:p-3">
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F5EDE3]">
                    <Image
                      src={hamper.image}
                      alt={hamper.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/10" />
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md ${
                        hamper.featured
                          ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white"
                          : "bg-white/90 backdrop-blur text-doibrand-accent"
                      }`}
                    >
                      {hamper.featured && <Crown className="w-3 h-3 fill-current" />}
                      {hamper.badge}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600/90 backdrop-blur px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                      ৳{savings.toLocaleString("en-US")} সাশ্রয়
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col px-1.5 sm:px-2 pt-4 pb-1">
                    {/* Title, Subtitle & Price */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-snug text-doibrand-dark transition-colors group-hover:text-doibrand-accent">
                          {hamper.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-stone-500">{hamper.subtitle}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="block text-xl font-black text-doibrand-accent leading-tight">
                          {formatTaka(hamper.price)}
                        </span>
                        <span className="text-xs text-stone-400 line-through">
                          {formatTaka(hamper.originalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Box Contents */}
                    <div className="mt-4 rounded-2xl bg-linear-to-br from-[#FFF7EC] to-[#FBEEDC] ring-1 ring-doibrand-gold/15 p-3.5">
                      <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold text-doibrand-accent">
                        <Gift className="w-3.5 h-3.5" />
                        বক্সে যা যা থাকছে
                      </p>
                      <ul className="space-y-2">
                        {hamper.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-xs text-stone-700">
                            <span className="mt-px w-4 h-4 shrink-0 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-white">
                              <Check className="w-2.5 h-2.5" strokeWidth={3} />
                            </span>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order Button */}
                    <button
                      type="button"
                      onClick={() => handleOrderHamper(hamper)}
                      className={`mt-4 w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                        hamper.featured
                          ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-[0_10px_24px_-12px_rgba(169,94,53,0.9)] hover:brightness-110"
                          : "bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-linear-to-r hover:from-doibrand-accent hover:to-doibrand-gold hover:text-white hover:ring-transparent"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      উপহার বক্সটি অর্ডার করুন
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate Custom Inquiries Banner */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] ring-1 ring-doibrand-gold/25 p-5 sm:p-7 shadow-[0_14px_36px_-24px_rgba(169,94,53,0.55)]">
          <Gift className="pointer-events-none absolute -right-6 -bottom-8 w-40 h-40 text-doibrand-gold/15 rotate-12" strokeWidth={1.25} />
          <div className="relative flex flex-col sm:flex-row items-center gap-5">
            <span className="shrink-0 w-14 h-14 grid place-items-center rounded-2xl bg-white/80 text-doibrand-accent ring-1 ring-doibrand-gold/30 shadow-sm">
              <Building2 className="w-6 h-6" />
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-lg sm:text-xl font-bold text-doibrand-dark">
                বিয়ে বা কর্পোরেট ইভেন্টের জন্য বিশেষ অর্ডার প্রয়োজন?
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-stone-600">
                ৫০টির বেশি অর্ডারে বিশেষ ছাড় এবং আপনার প্রতিষ্ঠানের লোগো সম্বলিত কাস্টম উপহার প্যাকেজিং।
              </p>
            </div>
            <Link
              href="/contact"
              className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-5 py-3 text-sm font-bold text-doibrand-light shadow-[0_10px_24px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
            >
              কর্পোরেট যোগাযোগ করুন
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/shop"
          className="sm:hidden mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-doibrand-accent"
        >
          সকল গিফট বক্স দেখুন
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
