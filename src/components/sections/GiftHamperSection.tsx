"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Sparkles, Check, ShoppingBag, ArrowRight } from "lucide-react";
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

export default function GiftHamperSection() {
  const { addItem, openCart } = useCart();

  const handleOrderHamper = (hamper: HamperItem) => {
    addItem({
      id: hamper.id,
      title: hamper.title,
      price: hamper.price,
      priceText: `৳ ${hamper.price.toLocaleString()}`,
      image: hamper.image,
      unit: "১টি লাক্সারি বক্স",
    });
    openCart();
  };

  return (
    <section className="w-full py-16 bg-doibrand-light font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 text-doibrand-accent text-xs font-bold mb-3 border border-amber-200">
              <Gift className="w-4 h-4 text-doibrand-gold" />
              <span>উপহার ও উৎসব সম্ভার</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark tracking-tight">
              প্রিয়জনের মুখে হাসি ফোটাতে রাজকীয় উপহার
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xl">
              উৎসবের দিনগুলোতে মিষ্টিমুখ করান বগুড়ার সেরা দই ও মিষ্টান্নের প্রিমিয়াম গিফট হ্যাম্পারে।
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-doibrand-gold hover:text-doibrand-accent transition-colors self-start md:self-auto"
          >
            <span>সকল গিফট বক্স দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Hamper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HAMPERS.map((hamper) => (
            <div
              key={hamper.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-md hover:shadow-xl hover:border-doibrand-gold/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image with Badge */}
                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 mb-5">
                  <Image
                    src={hamper.image}
                    alt={hamper.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-doibrand-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {hamper.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-bold text-xl text-doibrand-dark group-hover:text-doibrand-gold transition-colors">
                  {hamper.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{hamper.subtitle}</p>

                {/* Price */}
                <div className="flex items-baseline gap-3 my-4 font-sans">
                  <span className="text-2xl font-black text-doibrand-accent">
                    ৳ {hamper.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ৳ {hamper.originalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    বক্সে যা যা থাকছে:
                  </p>
                  {hamper.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Hamper Button */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleOrderHamper(hamper)}
                  className="w-full bg-doibrand-dark hover:bg-doibrand-gold text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>উপহার বক্সটি অর্ডার করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate Custom Inquiries Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-doibrand-dark via-stone-900 to-doibrand-dark text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-bold">
              বিয়ে বা কর্পোরেট ইভেন্টের জন্য বিশেষ অর্ডার প্রয়োজন?
            </h4>
            <p className="text-xs sm:text-sm text-stone-300">
              ৫০টির বেশি অর্ডারে বিশেষ ছাড় এবং আপনার প্রতিষ্ঠানের লোগো সম্বলিত কাস্টম উপহার প্যাকেজিং।
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-doibrand-gold hover:bg-doibrand-accent text-white font-bold text-xs sm:text-sm transition-colors shrink-0 shadow-md"
          >
            কর্পোরেট যোগাযোগ করুন
          </Link>
        </div>

      </div>
    </section>
  );
}
