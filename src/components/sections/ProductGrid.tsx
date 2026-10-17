import React from "react";
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
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    badge: "Discount",
    unit: "৯০০ গ্রাম জার",
  },
];

export default function ProductGrid() {
  return (
    <section className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-6 text-center">
          <h2 className="text-2xl font-bold text-doibrand-dark text-center font-bengali">
            Top Selling Products
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-doibrand-accent font-medium mt-1">
            জনপ্রিয় ও সর্বাধিক বিক্রিত পণ্যসমূহ
          </p>
          <div className="w-12 h-0.5 bg-doibrand-gold mt-2 rounded-full" />
        </div>

        {/* Product CSS Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {TOP_SELLING_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
