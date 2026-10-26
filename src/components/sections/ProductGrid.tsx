import React from "react";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";

const TOP_SELLING_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই",
    price: "৳ 500",
    originalPrice: "৳ 600",
    image: "/Product/doi.jpg",
    badge: "Hot Sale",
    unit: "১ কেজি সরা",
  },
  {
    id: 2,
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: "৳ 480",
    originalPrice: "৳ 560",
    image: "/Product/laccha_semai.jpg",
    badge: "হট ডিল",
    unit: "৫০০ গ্রাম বক্স",
  },
  {
    id: 3,
    slug: "mini-doi-cup",
    title: "স্পেশাল মাটির কাপ দই (৪ পিস)",
    price: "৳ 420",
    originalPrice: "৳ 480",
    image: "/Product/mini_doi.png",
    badge: "জনপ্রিয়",
    unit: "৪ কাপ বক্স",
  },
  {
    id: 4,
    slug: "mango-special-doi",
    title: "আমের স্পেশাল শাহী মিষ্টি দই",
    price: "৳ 550",
    originalPrice: "৳ 650",
    image: "/Product/mango.jpg",
    badge: "স্পেশাল",
    unit: "১ কেজি সরা",
  },
  {
    id: 5,
    slug: "pure-ghee",
    title: "খাঁটি গাওয়া ঘি (দানাদার)",
    price: "৳ 1,450",
    originalPrice: "৳ 1,600",
    image:
      "/Product/placeholder.svg",
    badge: "Discount",
    unit: "৯০০ গ্রাম জার",
  },
];

export default function ProductGrid() {
  return (
    <section className="w-full font-bengali pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent shadow-[0_4px_12px_-8px_rgba(169,94,53,0.6)]">
              <TrendingUp className="w-3.5 h-3.5 text-doibrand-gold" />
              বেস্ট সেলার
            </span>
            <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
              Top Selling{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
              জনপ্রিয় ও সর্বাধিক বিক্রিত পণ্যসমূহ
            </p>
          </div>

          <Link
            href="/shop"
            className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
          >
            সব পণ্য দেখুন
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Product CSS Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {TOP_SELLING_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/shop"
          className="sm:hidden mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-doibrand-accent"
        >
          সব পণ্য দেখুন
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
