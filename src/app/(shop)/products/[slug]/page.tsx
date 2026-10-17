"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Share2,
  Heart,
  Zap,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductDetail {
  slug: string;
  title: string;
  englishTitle: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  unit: string;
  description: string;
  features: string[];
  images: string[];
}

const PRODUCTS_DATABASE: Record<string, ProductDetail> = {
  "bogra-special-doi": {
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই",
    englishTitle: "Bogra Special Shora Doi",
    price: 500,
    originalPrice: 600,
    rating: 5,
    reviewsCount: 120,
    inStock: true,
    unit: "১ কেজি মাটির সরা",
    description:
      "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের সরার দই। খাঁটি গাভীর ঘন দুধের সাথে সঠিক মাত্রায় জ্বাল দিয়ে বিশেষ মাটির সরায় প্রাকৃতিক উপায়ে প্রস্তুত করা হয়। এতে কোনো প্রকার ক্ষতিকর কৃত্রিম রঙ, ফ্লেভার বা প্রিজারভেটিভ ব্যবহার করা হয় না।",
    features: [
      "১০০% খাঁটি দেশি গাভীর ঘন দুধ থেকে তৈরি",
      "মাটির সরায় দীর্ঘক্ষণ প্রাকৃতিক প্রক্রিয়ায় জমানো",
      "কোনো কৃত্রিম চিনি বা ক্ষতিকর রাসায়নিক মুক্ত",
      "টাটকা ও স্বাস্থ্যকর প্যাকেজিংয়ে ডেলিভারি",
    ],
    images: [
      "/Product/doi.jpg",
      "/Product/mini_doi.png",
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "pure-ghee": {
    slug: "pure-ghee",
    title: "খাঁটি গাওয়া ঘি (দানাদার)",
    englishTitle: "Premium Cow Ghee",
    price: 1450,
    originalPrice: 1600,
    rating: 5,
    reviewsCount: 95,
    inStock: true,
    unit: "৯০০ গ্রাম জার",
    description:
      "সম্পূর্ণ প্রাকৃতিক উপায়ে তৈরি সুগন্ধি ও দানাদার খাঁটি গাওয়া ঘি। দেশি গাভীর ননী থেকে বিলোনী পদ্ধতিতে প্রস্তুত যা আপনার খাবারের স্বাদ বাড়াবে শতগুণ।",
    features: [
      "১০০% খাঁটি মাখন থেকে তৈরি",
      "আকর্ষণীয় ঘ্রাণ ও গোল্ডেন দানাদার টেক্সচার",
      "ভিটামিন এ, ডি ও ই সমৃদ্ধ",
    ],
    images: [
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "sundarban-honey": {
    slug: "sundarban-honey",
    title: "সুন্দরবনের প্রাকৃতিক মধু",
    englishTitle: "Sundarbans Raw Honey",
    price: 850,
    originalPrice: 980,
    rating: 5,
    reviewsCount: 140,
    inStock: true,
    unit: "৫০০ গ্রাম কাঁচের বোতল",
    description:
      "সুন্দরবনের গভীর অরণ্য থেকে মৌয়ালদের দ্বারা সংগৃহীত সম্পূর্ণ অপরিশোধিত প্রাকৃতিক মধু। খলিসা ও গরান ফুলের খাঁটি নির্যাস।",
    features: [
      "১০০% খাঁটি ও অপরিশোধিত কাঁচা মধু",
      "অ্যান্টিঅক্সিডেন্ট ও পুষ্টিগুণে ভরপুর",
      "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে সহায়ক",
    ],
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",
    ],
  },
  "special-ghee-roasted-laccha-semai": {
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    englishTitle: "Special Ghee Roasted Laccha Semai",
    price: 480,
    originalPrice: 560,
    rating: 5,
    reviewsCount: 88,
    inStock: true,
    unit: "৫০০ গ্রাম বক্স",
    description:
      "খাঁটি গাওয়া ঘিয়ে বাদামি করে ভাজা মুচমুচে প্রিমিয়াম লাচ্ছা সেমাই। কোনো কৃত্রিম উপাদান ছাড়াই নিখুঁত কারিগরি দক্ষতায় প্রস্তুত।",
    features: [
      "১০০% খাঁটি গাওয়া ঘি দিয়ে ভাজা",
      "ঝরঝরে ও অত্যন্ত সুস্বাদু",
      "পরিচ্ছন্ন ও এয়ারটাইট স্বাস্থ্যসম্মত প্যাকেজিং",
    ],
    images: ["/Product/laccha_semai.jpg", "/Product/doi.jpg"],
  },
  "mini-doi-cup": {
    slug: "mini-doi-cup",
    title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
    englishTitle: "Mini Doi Cup Set (4 pcs)",
    price: 450,
    originalPrice: 520,
    rating: 5,
    reviewsCount: 64,
    inStock: true,
    unit: "৪টি কাপ বক্স",
    description:
      "ব্যক্তিগত পরিবেশনের জন্য অত্যন্ত আকর্ষণীয় ছোট মাটির কাপের সুস্বাদু সরার দই। যেকোনো অনুষ্ঠানে অতিথি আপ্যায়নে দারুণ মানানসই।",
    features: [
      "ঐতিহ্যবাহী ছোট মাটির পাত্রে জমানো",
      "পুরু সর ও লোভনীয় ক্যারামেল স্বাদ",
      "আলাদা ৪টি সার্ভিং কাপ",
    ],
    images: ["/Product/mini_doi.png", "/Product/doi.jpg"],
  },
  "mango-special-doi": {
    slug: "mango-special-doi",
    title: "আমের স্পেশাল পাকা আম দই",
    englishTitle: "Mango Special Doi",
    price: 550,
    originalPrice: 650,
    rating: 5,
    reviewsCount: 72,
    inStock: true,
    unit: "১ কেজি মাটির সরা",
    description:
      "তাজা পাকা আমের খাঁটি পাল্প ও গাভীর ঘন দুধের অসাধারণ যুগলবন্দীতে তৈরি অনন্য স্বাদের পাকা আম দই।",
    features: [
      "প্রাকৃতিক পাকা আমের পাল্প সমৃদ্ধ",
      "কোনো কৃত্রিম ফ্লেভার বা কালার নেই",
      "বিশেষ মাটির সরায় জমানো",
    ],
    images: ["/Product/mango.jpg", "/Product/doi.jpg"],
  },
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = typeof params?.slug === "string" ? params.slug : "bogra-special-doi";

  // Match product or fallback to bogra-special-doi
  const product: ProductDetail = useMemo(() => {
    return (
      PRODUCTS_DATABASE[rawSlug] || {
        ...PRODUCTS_DATABASE["bogra-special-doi"],
        slug: rawSlug,
        title: rawSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "বগুড়ার স্পেশাল সরার দই",
      }
    );
  }, [rawSlug]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[activeImageIndex] || product.images[0],
        unit: product.unit,
      },
      quantity
    );
    openCart();
  };

  const handleBuyNow = () => {
    addItem(
      {
        id: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[activeImageIndex] || product.images[0],
        unit: product.unit,
      },
      quantity
    );
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark pb-24 md:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-stone-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
          <nav className="flex items-center gap-2 text-xs text-gray-500 font-bengali">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href="/shop"
              className="hover:text-doibrand-gold transition-colors"
            >
              সকল পণ্য
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-doibrand-dark font-medium truncate max-w-[200px] sm:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content (2-Column Grid) */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* 1. Left Column (Image Gallery - Sticky Container) */}
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Main Product Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-square object-cover rounded-2xl transition-transform duration-300 group-hover:scale-102"
              />

              {/* Wishlist / Share overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  className="p-2.5 rounded-full bg-white/90 text-stone-600 hover:text-red-500 hover:bg-white shadow-md transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2.5 rounded-full bg-white/90 text-stone-600 hover:text-doibrand-gold hover:bg-white shadow-md transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Row of 4 Thumbnails */}
            <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar">
              {product.images.slice(0, 4).map((img, index) => {
                const isActive = activeImageIndex === index;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden flex-shrink-0 bg-white border cursor-pointer transition-all ${
                      isActive
                        ? "ring-2 ring-doibrand-gold border-doibrand-gold scale-102 shadow-sm"
                        : "border-gray-200 hover:border-doibrand-gold/60 opacity-75 hover:opacity-100"
                    }`}
                    aria-label={`View thumbnail ${index + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumbnail ${index + 1}`}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Right Column (Product Information) */}
          <div className="space-y-6">
            <div>
              {/* Title & Badges */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium font-bengali">
                  ইন স্টক (In Stock)
                </span>
                {product.unit && (
                  <span className="bg-amber-50 text-doibrand-accent px-3 py-1 rounded-full text-xs font-medium font-bengali">
                    {product.unit}
                  </span>
                )}
              </div>

              <h1 className="font-bengali text-2xl sm:text-3xl lg:text-4xl font-bold text-doibrand-dark leading-snug">
                {product.title}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  ({product.reviewsCount} Reviews)
                </span>
                <span className="text-xs text-emerald-600 font-bengali font-semibold ml-2">
                  • ভেরিফাইড ক্রেতাদের পছন্দ
                </span>
              </div>
            </div>

            {/* Pricing Area */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs">
              <div className="flex items-baseline flex-wrap">
                <span className="text-doibrand-accent text-3xl sm:text-4xl font-bold">
                  ৳ {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-base sm:text-lg line-through ml-3 font-medium">
                    ৳ {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="ml-3 text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded">
                  ৳ {product.originalPrice - product.price} সাশ্রয়
                </span>
              </div>
              <p className="text-xs text-gray-500 font-bengali mt-1.5">
                ভ্যাট অন্তর্ভুক্ত | ঢাকায় ২৪-৪৮ ঘণ্টায় হোম ডেলিভারি
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bengali font-bold text-base text-doibrand-dark mb-1.5">
                পণ্যের বিবরণ
              </h3>
              <p className="text-gray-600 font-bengali leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {/* Key Features Bullet Points */}
              <div className="mt-4 space-y-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-bengali">
                    <CheckCircle2 className="w-4 h-4 text-doibrand-gold shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Area */}
            <div className="pt-4 border-t border-stone-200 space-y-4">
              {/* Sleek Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-doibrand-dark font-bengali uppercase tracking-wider">
                  পরিমাণ (Quantity):
                </span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 sm:px-3 sm:py-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-doibrand-dark min-w-10 text-center font-sans">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 sm:px-3 sm:py-2 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Two Large Side-by-Side Action Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 pt-2">
                {/* Secondary Button: Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-doibrand-light text-doibrand-dark border-2 border-doibrand-dark w-1/2 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 font-bengali cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                {/* Primary Button: Buy Now / অর্ডার করুন */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="bg-doibrand-dark text-white hover:bg-doibrand-gold transition-colors w-1/2 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-lg flex items-center justify-center gap-2 font-bengali cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>অর্ডার করুন (Buy Now)</span>
                </button>
              </div>
            </div>

            {/* Trust and Assurance Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200">
              <div className="bg-white p-3 rounded-xl border border-stone-100 text-center flex flex-col items-center">
                <Truck className="w-5 h-5 text-doibrand-gold mb-1" />
                <span className="text-[11px] font-bold font-bengali text-doibrand-dark">
                  দ্রুত ডেলিভারি
                </span>
                <span className="text-[10px] text-gray-400 font-bengali">
                  ২৪-৪৮ ঘণ্টায়
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-100 text-center flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-doibrand-gold mb-1" />
                <span className="text-[11px] font-bold font-bengali text-doibrand-dark">
                  ১০০% খাঁটি পণ্য
                </span>
                <span className="text-[10px] text-gray-400 font-bengali">
                  গুণমানের গ্যারান্টি
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-stone-100 text-center flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-doibrand-gold mb-1" />
                <span className="text-[11px] font-bold font-bengali text-doibrand-dark">
                  সহজ রিটার্ন
                </span>
                <span className="text-[10px] text-gray-400 font-bengali">
                  সমস্যা হলে ফেরত
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Mobile Sticky Bottom Bar (block md:hidden) */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 px-4 py-2.5 shadow-xl">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div>
            <div className="text-[10px] text-gray-500 font-bengali">মোট মূল্য:</div>
            <div className="text-lg font-bold text-doibrand-accent">
              ৳ {(product.price * quantity).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              className="p-3 rounded-lg border border-doibrand-dark bg-doibrand-light text-doibrand-dark hover:bg-stone-100 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 bg-doibrand-dark text-white font-bold py-3 px-4 rounded-lg hover:bg-doibrand-gold transition-colors text-sm font-bengali flex items-center justify-center gap-1.5 shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
