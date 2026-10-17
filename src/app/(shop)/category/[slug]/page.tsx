"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";

interface CategoryProduct extends ProductItem {
  numericPrice: number;
  tag?: string;
}

interface CategoryInfo {
  slug: string;
  name: string;
  englishName: string;
  subtitle: string;
  tags: string[];
  products: CategoryProduct[];
}

const CATEGORY_MAP: Record<string, CategoryInfo> = {
  "premium-doi": {
    slug: "premium-doi",
    name: "প্রিমিয়াম দই",
    englishName: "Premium Doi",
    subtitle: "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের মাটির সরার সেরা দই",
    tags: ["সকল", "মিষ্টি দই", "টক দই", "ক্ষীরসা দই", "চিনিমুক্ত"],
    products: [
      {
        id: "doi-1",
        slug: "bogra-special-doi",
        title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
        price: "৳ 500",
        numericPrice: 500,
        originalPrice: "৳ 600",
        unit: "১ কেজি মাটির সরা",
        badge: "Hot Sale",
        image: "/Product/doi.jpg",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-2",
        slug: "shahjadpur-tok-doi",
        title: "শাহজাদপুরের খাঁটি টক দই",
        price: "৳ 380",
        numericPrice: 380,
        originalPrice: "৳ 450",
        unit: "১ কেজি জার",
        badge: "Pure Dairy",
        image:
          "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=600&q=80",
        tag: "টক দই",
      },
      {
        id: "doi-3",
        slug: "nawabi-zafrani-kheer-doi",
        title: "নবাবী জাফরানি ক্ষীর দই",
        price: "৳ 650",
        numericPrice: 650,
        originalPrice: "৳ 750",
        unit: "১ কেজি সরা",
        badge: "Special",
        image:
          "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80",
        tag: "ক্ষীরসা দই",
      },
      {
        id: "doi-4",
        slug: "traditional-patkheer-doi",
        title: "ঐতিহ্যবাহী পাতক্ষীর দই",
        price: "৳ 580",
        numericPrice: 580,
        originalPrice: "৳ 680",
        unit: "৮০০ গ্রাম",
        badge: "Popular",
        image:
          "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-5",
        slug: "clay-pot-kheersha-doi",
        title: "মাটির হাঁড়ির খাঁটি ক্ষীরসা দই",
        price: "৳ 720",
        numericPrice: 720,
        originalPrice: "৳ 820",
        unit: "১.২ কেজি হাঁড়ি",
        badge: "Premium",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
        tag: "ক্ষীরসা দই",
      },
      {
        id: "doi-6",
        slug: "diabetic-friendly-doi",
        title: "চিনিমুক্ত স্বাস্থ্যকর ডায়াবেটিক দই",
        price: "৳ 420",
        numericPrice: 420,
        originalPrice: "৳ 480",
        unit: "১ কেজি জার",
        badge: "Healthy",
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
        tag: "চিনিমুক্ত",
      },
      {
        id: "doi-7",
        slug: "ghee-mini-cup-doi",
        title: "ঘি ভাজা সর মাটির কাপ দই (৪ পিস)",
        price: "৳ 450",
        numericPrice: 450,
        originalPrice: "৳ 520",
        unit: "৪টি কাপ বক্স",
        badge: "New",
        image: "/Product/mini_doi.png",
        tag: "মিষ্টি দই",
      },
      {
        id: "doi-8",
        slug: "mahasthangarh-shahi-red-doi",
        title: "মহাস্থানগড়ের শাহী লাল দই",
        price: "৳ 540",
        numericPrice: 540,
        originalPrice: "৳ 620",
        unit: "১ কেজি সরা",
        badge: "Heritage",
        image:
          "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80",
        tag: "মিষ্টি দই",
      },
    ],
  },
  "laddu": {
    slug: "laddu",
    name: "লাড্ডু",
    englishName: "Laddu",
    subtitle: "খাঁটি গাওয়া ঘি ও উন্নতমানের উপাদানে প্রস্তুত মুখরোচক লাড্ডুর সমাহার",
    tags: ["সকল", "গাওয়া ঘি", "মতিচুর", "ড্রাই ফ্রুটস", "ঐতিহ্যবাহী"],
    products: [
      {
        id: "laddu-1",
        slug: "shahi-ghee-motichoor-laddu",
        title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
        price: "৳ 680",
        numericPrice: 680,
        originalPrice: "৳ 780",
        unit: "১ কেজি প্রিমিয়াম বক্স",
        badge: "Best Seller",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "মতিচুর",
      },
      {
        id: "laddu-2",
        slug: "pure-besan-nut-laddu",
        title: "খাঁটি বেসন বাদাম লাড্ডু",
        price: "৳ 550",
        numericPrice: 550,
        originalPrice: "৳ 650",
        unit: "৮০০ গ্রাম বক্স",
        badge: "Popular",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "গাওয়া ঘি",
      },
      {
        id: "laddu-3",
        slug: "almond-cashew-dry-fruit-laddu",
        title: "আমন্ড ও কাজু ড্রাই ফ্রুট লাড্ডু",
        price: "৳ 950",
        numericPrice: 950,
        originalPrice: "৳ 1,100",
        unit: "১ কেজি গিফট বক্স",
        badge: "Premium",
        image:
          "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=600&q=80",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "laddu-4",
        slug: "traditional-coconut-laddu",
        title: "ঐতিহ্যবাহী খাঁটি নারকেল লাড্ডু",
        price: "৳ 450",
        numericPrice: 450,
        originalPrice: "৳ 520",
        unit: "১ কেজি প্যাক",
        badge: "Traditional",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "ঐতিহ্যবাহী",
      },
      {
        id: "laddu-5",
        slug: "zafrani-boondia-laddu",
        title: "জাফরানি বুন্দিয়া লাড্ডু",
        price: "৳ 520",
        numericPrice: 520,
        originalPrice: "৳ 600",
        unit: "১ কেজি বক্স",
        badge: "Hot Sale",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "মতিচুর",
      },
      {
        id: "laddu-6",
        slug: "sugarfree-date-oats-laddu",
        title: "সুগার ফ্রি খেজুর ও ওটস লাড্ডু",
        price: "৳ 780",
        numericPrice: 780,
        originalPrice: "৳ 880",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Healthy",
        image:
          "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "laddu-7",
        slug: "special-mawa-pista-laddu",
        title: "স্পেশাল মাওয়া পেস্তা লাড্ডু",
        price: "৳ 750",
        numericPrice: 750,
        originalPrice: "৳ 850",
        unit: "৮০০ গ্রাম বক্স",
        badge: "Special",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "গাওয়া ঘি",
      },
      {
        id: "laddu-8",
        slug: "til-gur-sesame-laddu",
        title: "তিল ও গুড়ের স্বাস্থ্যকর লাড্ডু",
        price: "৳ 420",
        numericPrice: 420,
        originalPrice: "৳ 490",
        unit: "১ কেজি প্যাক",
        badge: "Winter Special",
        image:
          "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
        tag: "ঐতিহ্যবাহী",
      },
    ],
  },
  "laccha-semai": {
    slug: "laccha-semai",
    name: "লাচ্ছা সেমাই",
    englishName: "Laccha Semai",
    subtitle: "উৎসব ও ঘরোয়া আয়োজনের সেরা পছন্দ, খাঁটি ঘিয়ে ভাজা মুচমুচে লাচ্ছা সেমাই",
    tags: ["সকল", "গাওয়া ঘি ভাজা", "জাফরানি", "ড্রাই ফ্রুটস", "ফ্যামিলি প্যাক"],
    products: [
      {
        id: "semai-1",
        slug: "special-ghee-roasted-laccha-semai",
        title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
        price: "৳ 480",
        numericPrice: 480,
        originalPrice: "৳ 560",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Hot Sale",
        image: "/Product/laccha_semai.jpg",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-2",
        slug: "shahi-zafrani-laccha-semai",
        title: "শাহী জাফরানি ড্রাই ফ্রুট লাচ্ছা সেমাই",
        price: "৳ 650",
        numericPrice: 650,
        originalPrice: "৳ 750",
        unit: "৫০০ গ্রাম গিফট টিন",
        badge: "Premium",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "জাফরানি",
      },
      {
        id: "semai-3",
        slug: "handcrafted-special-semai",
        title: "ঐতিহ্যবাহী হাতে তৈরি স্পেশাল সেমাই",
        price: "৳ 350",
        numericPrice: 350,
        originalPrice: "৳ 420",
        unit: "৪০০ গ্রাম প্যাক",
        badge: "Traditional",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-4",
        slug: "ghee-nut-raisin-mix-laccha",
        title: "ঘি ভাজা বাদাম-কিশমিশ মিক্স লাচ্ছা",
        price: "৳ 580",
        numericPrice: 580,
        originalPrice: "৳ 680",
        unit: "৫০০ গ্রাম বক্স",
        badge: "Popular",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "ড্রাই ফ্রুটস",
      },
      {
        id: "semai-5",
        slug: "royal-premium-butter-laccha",
        title: "রয়েল প্রিমিয়াম বাটার লাচ্ছা সেমাই",
        price: "৳ 520",
        numericPrice: 520,
        originalPrice: "৳ 600",
        unit: "৫০০ গ্রাম বক্স",
        badge: "New",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-6",
        slug: "whole-wheat-nutritional-semai",
        title: "লাল গমের পুষ্টিকর স্পেশাল সেমাই",
        price: "৳ 380",
        numericPrice: 380,
        originalPrice: "৳ 450",
        unit: "৪৫০ গ্রাম প্যাক",
        badge: "Healthy",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "গাওয়া ঘি ভাজা",
      },
      {
        id: "semai-7",
        slug: "eid-special-family-pack-laccha",
        title: "ঈদ স্পেশাল ফ্যামিলি প্যাক লাচ্ছা সেমাই",
        price: "৳ 890",
        numericPrice: 890,
        originalPrice: "৳ 1,050",
        unit: "১ কেজি মেগা বক্স",
        badge: "Value Pack",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "ফ্যামিলি প্যাক",
      },
      {
        id: "semai-8",
        slug: "milk-ghee-shahi-laccha-semai",
        title: "দুধ-ঘিয়ে প্রস্তুত শাহী লাচ্ছা সেমাই",
        price: "৳ 620",
        numericPrice: 620,
        originalPrice: "৳ 720",
        unit: "৬০০ গ্রাম স্পেশাল বক্স",
        badge: "Heritage",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
        tag: "জাফরানি",
      },
    ],
  },
};

const ALL_CATEGORY_LINKS = [
  { slug: "premium-doi", name: "প্রিমিয়াম দই", englishName: "Premium Doi" },
  { slug: "laddu", name: "লাড্ডু", englishName: "Laddu" },
  { slug: "laccha-semai", name: "লাচ্ছা সেমাই", englishName: "Laccha Semai" },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "premium-doi";

  const category = CATEGORY_MAP[slug] || CATEGORY_MAP["premium-doi"];

  // Filters state
  const [selectedTag, setSelectedTag] = useState<string>("সকল");
  const [minPrice, setMinPrice] = useState<number>(300);
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleClearFilters = () => {
    setSelectedTag("সকল");
    setMinPrice(300);
    setMaxPrice(1200);
    setSortBy("latest");
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return category.products
      .filter((product) => {
        // Tag filter
        if (selectedTag !== "সকল" && product.tag !== selectedTag) {
          return false;
        }
        // Price filter
        if (product.numericPrice < minPrice || product.numericPrice > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
        if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
        return 0; // latest/default
      });
  }, [category.products, selectedTag, minPrice, maxPrice, sortBy]);

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark pb-16">
      {/* 1. Category Header Banner (Full-bleed edge-to-edge) */}
      <section className="w-full bg-doibrand-dark text-white relative overflow-hidden py-12 sm:py-16 border-b border-stone-800">
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C48A4E_1.5px,transparent_1.5px)] [background-size:20px_20px]"
          aria-hidden="true"
        />
        {/* Dark radial vignette overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 flex flex-col items-center text-center">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-stone-300 font-bengali mb-4">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/shop" className="hover:text-doibrand-gold transition-colors">
              ক্যাটাগরি
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-doibrand-gold font-medium">{category.name}</span>
          </nav>

          {/* Category Title */}
          <h1 className="text-white font-bengali text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            {category.name}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-200/90 text-sm sm:text-base font-bengali font-light max-w-lg">
            {category.subtitle}
          </p>
        </div>
      </section>

      {/* 2. Main 2-Column Layout (ShopPage Pattern) */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar (Filters) */}
        <aside className="w-full lg:w-1/4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between shadow-xs font-bengali text-sm font-semibold text-doibrand-dark cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-doibrand-gold" />
                ফিল্টার করুন (Filters)
              </span>
              <span className="text-xs bg-amber-50 text-doibrand-accent px-2.5 py-1 rounded-full font-sans font-medium">
                {selectedTag !== "সকল" ? selectedTag : "সকল পণ্য"}
              </span>
            </button>
          </div>

          {/* Desktop Filter Panel */}
          <div className="hidden lg:block sticky top-24 bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-bold text-base text-doibrand-dark font-bengali flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-doibrand-gold" />
                <span>ফিল্টার অপশন</span>
              </h2>

              {(selectedTag !== "সকল" || minPrice > 300 || maxPrice < 1200) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-doibrand-accent hover:text-doibrand-dark font-bengali flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Other Categories Navigation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-doibrand-dark font-bengali mb-3">
                ক্যাটাগরিসমূহ
              </h3>
              <div className="space-y-1.5">
                {ALL_CATEGORY_LINKS.map((item) => {
                  const isActive = item.slug === category.slug;
                  return (
                    <Link
                      key={item.slug}
                      href={`/category/${item.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bengali transition-colors ${
                        isActive
                          ? "bg-amber-50/80 text-doibrand-dark font-bold border-l-4 border-doibrand-gold"
                          : "text-stone-600 hover:bg-stone-50 hover:text-doibrand-dark"
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-doibrand-gold" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tag / Sub-type Filter */}
            {category.tags.length > 0 && (
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-doibrand-dark font-bengali mb-3">
                  ধরণ (Types)
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.tags.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`text-xs font-bengali px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? "bg-doibrand-dark text-white font-semibold shadow-xs"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Filter Slider & Inputs */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-doibrand-dark font-bengali mb-3">
                মূল্য সীমা (Price Filter)
              </h3>

              {/* Slider */}
              <input
                type="range"
                min="300"
                max="1200"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-doibrand-gold cursor-pointer"
              />

              {/* Min/Max input fields */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bengali block mb-1">
                    সর্বনিম্ন (Min)
                  </label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs text-doibrand-dark focus:outline-none focus:border-doibrand-gold shadow-2xs"
                  />
                </div>
                <span className="text-gray-400 mt-4">-</span>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bengali block mb-1">
                    সর্বোচ্চ (Max)
                  </label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs text-doibrand-dark focus:outline-none focus:border-doibrand-gold shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white p-5 shadow-2xl overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-bold text-base text-doibrand-dark font-bengali">
                    ফিল্টার অপশন
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-doibrand-dark font-bengali mb-3">
                    অন্যান্য ক্যাটাগরি
                  </h4>
                  <div className="space-y-1.5">
                    {ALL_CATEGORY_LINKS.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/category/${item.slug}`}
                        onClick={() => setIsMobileFilterOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm font-bengali ${
                          item.slug === category.slug
                            ? "bg-amber-50 text-doibrand-dark font-bold border-l-4 border-doibrand-gold"
                            : "text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Mobile Tags */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-doibrand-dark font-bengali mb-3">
                    ধরণ (Types)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(tag)}
                        className={`text-xs font-bengali px-3 py-1.5 rounded-full ${
                          selectedTag === tag
                            ? "bg-doibrand-dark text-white font-semibold"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="pt-4 border-t border-stone-200">
                  <h4 className="text-xs font-semibold uppercase text-doibrand-dark font-bengali mb-3">
                    সর্বোচ্চ মূল্য (Max Price)
                  </h4>
                  <input
                    type="range"
                    min="300"
                    max="1200"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-doibrand-gold"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2 font-sans">
                    <span>৳ {minPrice}</span>
                    <span>৳ {maxPrice}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 flex gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 py-2.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-600 font-bengali cursor-pointer"
                >
                  রিসেট
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-doibrand-gold text-white text-xs font-bold font-bengali shadow-sm cursor-pointer"
                >
                  প্রয়োগ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Content Area (Product Grid) */}
        <section className="w-full lg:w-3/4 space-y-6">
          {/* Top Bar with Count & Sort */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500 font-bengali flex items-center gap-2">
              <span>
                মোট <span className="font-semibold text-doibrand-dark">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
              </span>
              {selectedTag !== "সকল" && (
                <span className="text-xs bg-amber-50 text-doibrand-accent px-2 py-0.5 rounded-full font-medium">
                  {selectedTag}
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sort-select" className="text-xs text-gray-500 font-bengali whitespace-nowrap">
                সাজান:
              </label>
              <div className="relative flex-1 sm:flex-initial">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg px-3 py-2 pr-8 text-xs font-medium text-doibrand-dark focus:outline-none focus:ring-1 focus:ring-doibrand-gold focus:border-doibrand-gold cursor-pointer transition-colors shadow-2xs font-bengali"
                >
                  <option value="latest">সর্বশেষ (Latest)</option>
                  <option value="price-low">মূল্য: কম থেকে বেশি (Price: Low to High)</option>
                  <option value="price-high">মূল্য: বেশি থেকে কম (Price: High to Low)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-bengali font-bold text-lg text-doibrand-dark">
                কোনো পণ্য পাওয়া যায়নি
              </h3>
              <p className="text-xs text-gray-500 font-bengali">
                অনুগ্রহ করে আপনার ফিল্টার শর্ত পরিবর্তন করে পুনরায় চেষ্টা করুন
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-2 px-5 py-2 rounded-lg bg-doibrand-gold text-white font-bengali text-xs font-semibold shadow-xs cursor-pointer"
              >
                ফিল্টার মুছুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Bottom Category Highlights / Info Box */}
          <div className="mt-8 bg-white border border-stone-200/70 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-bengali font-bold text-base text-doibrand-dark mb-1">
                শতভাগ খাঁটি ও স্বাস্থ্যসম্মত নিশ্চয়তা
              </h4>
              <p className="font-bengali text-xs sm:text-sm text-gray-600 leading-relaxed">
                দই বিলাসের প্রতিটি পণ্য নিজস্ব তত্ত্বাবধানে প্রাকৃতিক উপাদান দিয়ে স্বাস্থ্যসম্মত পরিবেশে তৈরি করা হয়। কোনো ধরনের ক্ষতিকর কেমিক্যাল বা কৃত্রিম উপাদান ব্যবহার করা হয় না।
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
