"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Copy,
  Check,
  Tag,
  Flame,
  ChevronRight,
  Info,
  Gift,
  ShieldCheck,
  Percent,
} from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";

interface PromoCodeItem {
  id: string;
  code: string;
  discount: string;
  condition: string;
  expiry: string;
  description: string;
  tag: string;
}

const PROMO_CODES: PromoCodeItem[] = [
  {
    id: "doi100",
    code: "DOI100",
    discount: "৳ ১০০ ছাড়",
    condition: "ন্যূনতম ১০০০ টাকার অর্ডারে",
    expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
    description: "প্রথম অর্ডারে স্পেশাল ছাড়",
    tag: "নতুন গ্রাহক",
  },
  {
    id: "ghee15",
    code: "GHEE15",
    discount: "১৫% ছাড়",
    condition: "ন্যূনতম ১৫০০ টাকার গাওয়া ঘি অর্ডারে",
    expiry: "২৫ অক্টোবর ২০২৬ পর্যন্ত",
    description: "গাওয়া ঘি ক্যাটাগরির সকল পণ্যে",
    tag: "স্পেশাল",
  },
  {
    id: "festive250",
    code: "FESTIVE250",
    discount: "৳ ২৫০ ছাড়",
    condition: "ন্যূনতম ২৫০০ টাকার কম্বো অর্ডারে",
    expiry: "৫ নভেম্বর ২০২৬ পর্যন্ত",
    description: "দই, লাড্ডু ও সেমাই কম্বো প্যাকেজে",
    tag: "মেগা সেভার",
  },
  {
    id: "laddu50",
    code: "LADDU50",
    discount: "৳ ৫০ ছাড়",
    condition: "যেকোনো লাড্ডু বক্স ক্রয়ে",
    expiry: "২৮ অক্টোবর ২০২৬ পর্যন্ত",
    description: "শাহী মতিচুর ও বেসন লাড্ডুতে প্রযোজ্য",
    tag: "জনপ্রিয়",
  },
  {
    id: "freedel",
    code: "FREEDEL",
    discount: "ফ্রি ডেলিভারি",
    condition: "ন্যূনতম ১২০০ টাকার অর্ডারে",
    expiry: "সীমিত সময়ের জন্য",
    description: "ঢাকা ও বগুড়া সিটিতে সম্পূর্ণ ফ্রি ডেলিভারি",
    tag: "ডেলিভারি অফার",
  },
  {
    id: "doi20",
    code: "DOI20",
    discount: "২০% ছাড়",
    condition: "২ কেজি বা তদূর্ধ্ব মাটির সরার দইয়ে",
    expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
    description: "ঐতিহ্যবাহী বগুড়ার স্পেশাল সরার দইয়ে",
    tag: "হট ডিল",
  },
];

interface FlashSaleProduct extends ProductItem {
  discountPercent: string;
  soldCount: number;
  totalStock: number;
}

const FLASH_SALE_PRODUCTS: FlashSaleProduct[] = [
  {
    id: "flash-1",
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
    price: "৳ 400",
    originalPrice: "৳ 500",
    unit: "১ কেজি মাটির সরা",
    badge: "",
    image: "/Product/doi.jpg",
    discountPercent: "-২০% ছাড়",
    soldCount: 42,
    totalStock: 50,
  },
  {
    id: "flash-2",
    slug: "shahi-ghee-motichoor-laddu",
    title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
    price: "৳ 510",
    originalPrice: "৳ 680",
    unit: "১ কেজি প্রিমিয়াম বক্স",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
    discountPercent: "-২৫% ছাড়",
    soldCount: 35,
    totalStock: 40,
  },
  {
    id: "flash-3",
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: "৳ 360",
    originalPrice: "৳ 480",
    unit: "৫০০ গ্রাম বক্স",
    badge: "",
    image: "/Product/laccha_semai.jpg",
    discountPercent: "-২৫% ছাড়",
    soldCount: 28,
    totalStock: 30,
  },
  {
    id: "flash-4",
    slug: "sundarban-honey",
    title: "সুন্দরবনের প্রাকৃতিক খাঁটি মধু",
    price: "৳ 680",
    originalPrice: "৳ 850",
    unit: "৫০০ গ্রাম কাঁচের জার",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    discountPercent: "-২০% ছাড়",
    soldCount: 19,
    totalStock: 25,
  },
  {
    id: "flash-5",
    slug: "pure-ghee",
    title: "খাঁটি দানাদার গাওয়া ঘি",
    price: "৳ 1,085",
    originalPrice: "৳ 1,450",
    unit: "৯০০ গ্রাম জার",
    badge: "",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    discountPercent: "-২৫% ছাড়",
    soldCount: 15,
    totalStock: 20,
  },
];

export default function SpecialOffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 5,
    minutes: 30,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const formatDigits = (num: number) => String(num).padStart(2, "0");

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark">
      {/* Breadcrumb Header */}
      <div className="border-b border-stone-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-bengali">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-doibrand-dark font-semibold">অফার (Special Offers)</span>
          </nav>
        </div>
      </div>

      {/* 1. Hero Promotional Banner (Full-bleed edge-to-edge) */}
      <section className="w-full bg-doibrand-dark text-white relative overflow-hidden py-12 sm:py-16 border-b border-stone-800">
        {/* Subtle background glow & texture */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 bg-doibrand-gold/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-doibrand-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#C48A4E_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side: Title & Subtitle */}
          <div className="max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-doibrand-gold/20 border border-doibrand-gold/40 text-doibrand-gold px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 font-bengali">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>মেগা ডিসকাউন্ট উৎসব</span>
            </div>

            <h1 className="font-bengali text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
              স্পেশাল ধামাকা অফার
            </h1>

            <p className="text-stone-300 font-bengali text-base sm:text-lg font-light leading-relaxed">
              সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ফ্রি ভাউচার কোড উপভোগ করুন।
            </p>
          </div>

          {/* Right Side: Prominent Countdown Timer */}
          <div className="flex flex-col items-center md:items-end w-full md:w-auto">
            <div className="flex items-center gap-2 text-doibrand-gold font-bengali text-xs sm:text-sm font-semibold mb-3">
              <Clock className="w-4 h-4" />
              <span>অফারের সময় বাকি আছে:</span>
            </div>

            {/* Timer Blocks */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="bg-white text-doibrand-dark p-3 lg:p-4 rounded-xl font-mono font-bold text-xl lg:text-2xl shadow-inner flex items-center justify-center min-w-[58px] sm:min-w-[68px]">
                  {formatDigits(timeLeft.days)}
                </div>
                <span className="text-[11px] font-bengali text-stone-300 mt-1.5">দিন (Days)</span>
              </div>

              <span className="text-xl lg:text-2xl font-bold text-doibrand-gold mb-5">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="bg-white text-doibrand-dark p-3 lg:p-4 rounded-xl font-mono font-bold text-xl lg:text-2xl shadow-inner flex items-center justify-center min-w-[58px] sm:min-w-[68px]">
                  {formatDigits(timeLeft.hours)}
                </div>
                <span className="text-[11px] font-bengali text-stone-300 mt-1.5">ঘন্টা (Hrs)</span>
              </div>

              <span className="text-xl lg:text-2xl font-bold text-doibrand-gold mb-5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="bg-white text-doibrand-dark p-3 lg:p-4 rounded-xl font-mono font-bold text-xl lg:text-2xl shadow-inner flex items-center justify-center min-w-[58px] sm:min-w-[68px]">
                  {formatDigits(timeLeft.minutes)}
                </div>
                <span className="text-[11px] font-bengali text-stone-300 mt-1.5">মিনিট (Mins)</span>
              </div>

              <span className="text-xl lg:text-2xl font-bold text-doibrand-gold mb-5">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="bg-white text-doibrand-dark p-3 lg:p-4 rounded-xl font-mono font-bold text-xl lg:text-2xl shadow-inner flex items-center justify-center min-w-[58px] sm:min-w-[68px]">
                  {formatDigits(timeLeft.seconds)}
                </div>
                <span className="text-[11px] font-bengali text-stone-300 mt-1.5">সেকেন্ড (Sec)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* 2. Active Promo Codes (Voucher Section) */}
        <div className="mt-12 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bengali text-2xl font-bold text-doibrand-dark flex items-center gap-2">
              <Tag className="w-6 h-6 text-doibrand-gold" />
              <span>অ্যাক্টিভ প্রোমো কোড</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-bengali mt-1">
              চেকআউটের সময় কোডটি কপি করে বসিয়ে অতিরিক্ত ছাড় নিশ্চিত করুন
            </p>
          </div>
          <span className="text-xs bg-amber-100/70 text-doibrand-dark font-bengali px-3 py-1.5 rounded-full font-semibold self-start sm:self-auto">
            মোট ৬টি ভাউচার সচল
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROMO_CODES.map((promo) => {
            const isCopied = copiedCode === promo.code;
            return (
              <div
                key={promo.id}
                className="border-2 border-dashed border-doibrand-gold bg-doibrand-gold/5 rounded-xl p-6 flex flex-col justify-between gap-4 relative transition-all duration-200 hover:shadow-md hover:bg-doibrand-gold/10 group"
              >
                {/* Decorative Ticket Side Cutouts */}
                <div
                  className="w-4 h-4 rounded-full bg-doibrand-light border-r-2 border-dashed border-doibrand-gold absolute -left-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="w-4 h-4 rounded-full bg-doibrand-light border-l-2 border-dashed border-doibrand-gold absolute -right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Badge & Discount Amount */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold bg-amber-100 text-doibrand-dark px-2.5 py-0.5 rounded-full font-bengali">
                      {promo.tag}
                    </span>
                    <span className="text-[11px] text-gray-500 font-bengali">
                      {promo.expiry}
                    </span>
                  </div>

                  {/* Large Discount Amount */}
                  <h3 className="text-2xl font-bold text-doibrand-dark font-bengali tracking-tight">
                    {promo.discount}
                  </h3>

                  {/* Minimum Spend Condition */}
                  <p className="text-xs text-gray-600 font-bengali font-medium mt-1">
                    {promo.condition}
                  </p>
                  <p className="text-[11px] text-gray-500 font-bengali mt-0.5">
                    {promo.description}
                  </p>
                </div>

                {/* Coupon Code Box and Copy Button */}
                <div className="pt-3 border-t border-dashed border-doibrand-gold/30 flex items-center justify-between gap-3">
                  <div className="bg-white border border-gray-200 px-4 py-2 rounded-md font-mono font-bold text-doibrand-accent inline-block text-center text-sm shadow-2xs select-all">
                    {promo.code}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(promo.code)}
                    className="flex-1 bg-doibrand-dark text-white text-sm py-2 px-3 rounded-md hover:bg-doibrand-gold transition-colors flex items-center justify-center gap-1.5 font-bengali font-semibold shadow-xs cursor-pointer active:scale-98"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Flash Sale Products Grid */}
        <div className="mt-16 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bengali text-2xl font-bold text-doibrand-dark flex items-center gap-2">
              <Flame className="w-6 h-6 text-doibrand-accent" />
              <span>ফ্ল্যাশ সেল - স্টক ফুরানোর আগেই অর্ডার করুন</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-bengali mt-1">
              সীমিত সময়ের বিশেষ অফার, খাঁটি স্বাদের প্রিমিয়াম আইটেমগুলিতে সর্বোচ্চ মূল্যছাড়
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-semibold text-doibrand-accent hover:text-doibrand-dark font-bengali flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            <span>সব পণ্য দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* CSS Grid (grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {FLASH_SALE_PRODUCTS.map((product) => {
            const soldPercentage = Math.round(
              (product.soldCount / product.totalStock) * 100
            );
            return (
              <div key={product.id} className="relative flex flex-col justify-between">
                {/* Prominent Discount Badge (top-0 left-0) */}
                <span className="bg-doibrand-accent text-white px-3 py-1 rounded-br-lg absolute top-0 left-0 text-sm font-bold z-10 font-bengali shadow-sm pointer-events-none">
                  {product.discountPercent}
                </span>

                {/* Product Card Component */}
                <ProductCard product={product} />

                {/* Stock Progress Bar */}
                <div className="mt-2 px-1">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-bengali mb-1">
                    <span>বিক্রি হয়েছে: {product.soldCount}টি</span>
                    <span className="font-sans font-semibold text-doibrand-accent">
                      {soldPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-doibrand-gold h-full rounded-full transition-all duration-500"
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Offer Terms & Guarantee */}
        <div className="mt-16 bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bengali font-bold text-base sm:text-lg text-doibrand-dark">
                অফারের শর্তাবলী ও খাঁটি পণ্যের অঙ্গীকার
              </h3>
              <p className="font-bengali text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
                ভাউচার কোডগুলো শুধুমাত্র নির্দিষ্ট মেয়াদে এবং নির্ধারিত ন্যূনতম ক্রয়ে কার্যকর হবে। স্টক থাকা সাপেক্ষে প্রতিটি অফার প্রযোজ্য। যেকোনো সহায়তার জন্য আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।
              </p>
            </div>
          </div>

          <Link
            href="/shop"
            className="w-full md:w-auto text-center px-6 py-3 rounded-xl bg-doibrand-dark text-white font-bengali text-sm font-bold hover:bg-doibrand-gold transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            শপিং শুরু করুন
          </Link>
        </div>
      </div>
    </main>
  );
}
