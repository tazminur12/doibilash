"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ShoppingBag, CheckCircle2, Flame } from "lucide-react";
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
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
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
          return { ...prev, minutes: 59, seconds: 59 };
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

  return (
    <section className="w-full py-14 font-bengali relative overflow-hidden bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-stone-200/80 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold mb-3 border border-red-200 shadow-2xs">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>সীমিত সময়ের অফার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-doibrand-dark tracking-tight">
              আজকের স্পেশাল ফ্ল্যাশ ডিল
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              দিনের সেরা মূল্যে খাঁটি বগুড়ার দই ও মিষ্টান্ন সংগ্রহ করুন
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-2.5 sm:gap-3 bg-stone-50 border border-stone-200/90 p-2.5 sm:p-3 rounded-2xl shadow-2xs self-start md:self-auto">
            <Clock className="w-5 h-5 text-doibrand-gold hidden sm:block" />
            <div className="flex items-center gap-2 text-center font-sans">
              <div className="bg-white border border-stone-200 px-3 py-1.5 rounded-xl min-w-[50px] shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-doibrand-dark">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-gray-500 font-bengali">ঘণ্টা</span>
              </div>
              <span className="text-xl font-bold text-doibrand-gold">:</span>
              <div className="bg-white border border-stone-200 px-3 py-1.5 rounded-xl min-w-[50px] shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-doibrand-dark">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-gray-500 font-bengali">মিনিট</span>
              </div>
              <span className="text-xl font-bold text-doibrand-gold">:</span>
              <div className="bg-white border border-stone-200 px-3 py-1.5 rounded-xl min-w-[50px] shadow-2xs">
                <span className="block text-xl sm:text-2xl font-black text-red-600">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-gray-500 font-bengali">সেকেন্ড</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLASH_PRODUCTS.map((prod) => {
            const soldCount = prod.stockTotal - prod.stockLeft;
            const progressPercent = Math.round((soldCount / prod.stockTotal) * 100);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 border border-stone-200/90 hover:border-doibrand-gold/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-stone-50 border border-stone-100 mb-4">
                    <Image
                      src={prod.image}
                      alt={prod.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Discount badge */}
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md">
                      {prod.discount}
                    </span>
                    <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                      {prod.unit}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/products/${prod.slug}`} className="block">
                    <h3 className="font-bold text-base text-doibrand-dark group-hover:text-doibrand-gold transition-colors line-clamp-1">
                      {prod.title}
                    </h3>
                  </Link>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3 mt-2 font-sans">
                    <span className="text-2xl font-black text-doibrand-accent">
                      ৳ {prod.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ৳ {prod.originalPrice}
                    </span>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-600 font-bengali">
                        বুকিং সম্পন্ন: <strong className="text-doibrand-dark font-sans">{progressPercent}%</strong>
                      </span>
                      <span className="text-red-600 font-semibold font-bengali">
                        আর মাত্র {prod.stockLeft} টি বাকি!
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-100 border border-stone-200/60 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-doibrand-gold to-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add to Cart CTA */}
                <div className="mt-5 pt-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="w-full bg-doibrand-dark hover:bg-doibrand-gold text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] text-sm"
                  >
                    {addedId === prod.id ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-white" />
                        <span>কার্টে যুক্ত হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>এখনই অর্ডার করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
