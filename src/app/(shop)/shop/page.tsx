"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";

interface CategoryOption {
  id: string;
  name: string;
  englishName: string;
  count: number;
}

const CATEGORIES: CategoryOption[] = [
  { id: "doi", name: "বগুড়ার দই", englishName: "Doi", count: 8 },
  { id: "ghee", name: "গাওয়া ঘি", englishName: "Ghee", count: 5 },
  { id: "honey", name: "খাঁটি মধু", englishName: "Honey", count: 6 },
  { id: "sweets", name: "ঐতিহ্যবাহী মিষ্টি", englishName: "Sweets", count: 11 },
  { id: "dates-nuts", name: "খেজুর ও বাদাম", englishName: "Dates & Nuts", count: 6 },
];

const SHOP_PRODUCTS: (ProductItem & { category: string; numericPrice: number })[] = [
  {
    id: 1,
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই",
    price: "৳ 500",
    numericPrice: 500,
    originalPrice: "৳ 600",
    image: "/Product/doi.jpg",
    badge: "Hot Sale",
    unit: "১ কেজি সরা",
    category: "doi",
  },
  {
    id: 2,
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: "৳ 480",
    numericPrice: 480,
    originalPrice: "৳ 560",
    image: "/Product/laccha_semai.jpg",
    badge: "হট ডিল",
    unit: "৫০০ গ্রাম বক্স",
    category: "sweets",
  },
  {
    id: 3,
    slug: "mini-doi-cup",
    title: "স্পেশাল মাটির কাপ দই (৪ পিস)",
    price: "৳ 420",
    numericPrice: 420,
    originalPrice: "৳ 480",
    image: "/Product/mini_doi.png",
    badge: "জনপ্রিয়",
    unit: "৪ কাপ বক্স",
    category: "doi",
  },
  {
    id: 4,
    slug: "mango-special-doi",
    title: "আমের স্পেশাল শাহী মিষ্টি দই",
    price: "৳ 550",
    numericPrice: 550,
    originalPrice: "৳ 650",
    image: "/Product/mango.jpg",
    badge: "স্পেশাল",
    unit: "১ কেজি সরা",
    category: "doi",
  },
  {
    id: 5,
    slug: "pure-ghee",
    title: "খাঁটি গাওয়া ঘি (দানাদার)",
    price: "৳ 1,450",
    numericPrice: 1450,
    originalPrice: "৳ 1,600",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80",
    badge: "Discount",
    unit: "৯০০ গ্রাম জার",
    category: "ghee",
  },
  {
    id: 6,
    slug: "sundarban-honey",
    title: "সুন্দরবনের প্রাকৃতিক মধু",
    price: "৳ 850",
    numericPrice: 850,
    originalPrice: "৳ 980",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80",
    badge: "Hot Sale",
    unit: "৫০০ গ্রাম বোতল",
    category: "honey",
  },
  {
    id: 7,
    slug: "sponge-rosogolla",
    title: "ঐতিহ্যবাহী স্পঞ্জ রসগোল্লা",
    price: "৳ 420",
    numericPrice: 420,
    originalPrice: "৳ 480",
    image:
      "https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80",
    badge: "Discount",
    unit: "১ কেজি বক্স",
    category: "sweets",
  },
  {
    id: 8,
    slug: "ajwa-dates",
    title: "প্রিমিয়াম খোরমা খেজুর",
    price: "৳ 750",
    numericPrice: 750,
    originalPrice: "৳ 900",
    image:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80",
    badge: "Hot Sale",
    unit: "১ কেজি প্যাকেট",
    category: "dates-nuts",
  },
];

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(300);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(300);
    setMaxPrice(2000);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.category)
      ) {
        return false;
      }
      // Price filter
      if (product.numericPrice < minPrice || product.numericPrice > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
      if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
      return 0; // latest/default
    });
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

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
            <span className="text-doibrand-dark font-semibold">সকল পণ্য (Shop)</span>
          </nav>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* 1. Left Sidebar (Filter Panel) - Desktop Sticky */}
        <aside className="w-full lg:w-1/4">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-4">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="w-full bg-white border border-stone-200 rounded-xl p-3 flex items-center justify-between shadow-xs font-bengali text-sm font-semibold text-doibrand-dark"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-doibrand-gold" />
                ফিল্টার করুন (Filters)
              </span>
              <span className="text-xs bg-amber-50 text-doibrand-accent px-2 py-0.5 rounded-full">
                {selectedCategories.length > 0 ? `${selectedCategories.length} নির্বাচিত` : "সব"}
              </span>
            </button>
          </div>

          {/* Desktop Filter Panel */}
          <div className="hidden lg:block sticky top-24 bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-bold text-base text-doibrand-dark font-bengali flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-doibrand-gold" />
                <span>ফিল্টার অপশন (Filters)</span>
              </h2>

              {(selectedCategories.length > 0 || minPrice > 300 || maxPrice < 2000) && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-doibrand-accent hover:text-doibrand-dark font-bengali flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-doibrand-dark font-bengali mb-3">
                ক্যাটাগরি (Categories)
              </h3>
              <div className="space-y-2.5">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className="flex items-center justify-between text-sm text-stone-700 hover:text-doibrand-dark cursor-pointer font-bengali select-none group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat.id)}
                          className="w-4 h-4 rounded border-gray-300 accent-doibrand-gold cursor-pointer"
                        />
                        <span className={`transition-colors ${isChecked ? "font-bold text-doibrand-dark" : ""}`}>
                          {cat.name} ({cat.englishName})
                        </span>
                      </div>
                      <span className="text-xs text-stone-400 group-hover:text-stone-500 font-sans">
                        {cat.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-4 border-t border-stone-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-doibrand-dark font-bengali mb-3">
                মূল্য সীমা (Price Filter)
              </h3>

              {/* Slider */}
              <input
                type="range"
                min="300"
                max="2000"
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
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs text-doibrand-dark focus:outline-none focus:border-doibrand-gold shadow-xs"
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
                    className="w-full border border-gray-200 rounded-lg p-2 text-xs text-doibrand-dark focus:outline-none focus:border-doibrand-gold shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer Modal */}
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
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Categories */}
                <div>
                  <h4 className="text-xs font-semibold uppercase text-doibrand-dark font-bengali mb-3">
                    ক্যাটাগরি
                  </h4>
                  <div className="space-y-3">
                    {CATEGORIES.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between text-sm text-stone-700 font-bengali cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(cat.id)}
                            onChange={() => toggleCategory(cat.id)}
                            className="w-4 h-4 rounded border-gray-300 accent-doibrand-gold"
                          />
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-xs text-stone-400">({cat.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-semibold uppercase text-doibrand-dark font-bengali mb-3">
                    মূল্য সীমা
                  </h4>
                  <input
                    type="range"
                    min="300"
                    max="2000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-doibrand-gold"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>৳ {minPrice}</span>
                    <span>৳ {maxPrice}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 flex gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="flex-1 py-2.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-600 font-bengali"
                >
                  রিসেট
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-lg bg-doibrand-gold text-white text-xs font-bold font-bengali shadow-sm"
                >
                  প্রয়োগ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Right Content Area (Product Grid) */}
        <section className="w-full lg:w-3/4 space-y-6">
          {/* Top Bar */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-sm text-gray-500 font-bengali">
              Showing <span className="font-semibold text-doibrand-dark">1-{filteredProducts.length}</span> of <span className="font-semibold text-doibrand-dark">36</span> results
              {selectedCategories.length > 0 && (
                <span className="ml-2 text-xs text-doibrand-accent">
                  (ফিল্টার সক্রিয়)
                </span>
              )}
            </div>

            {/* Sort By Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label htmlFor="sort-select" className="text-xs text-gray-500 font-bengali whitespace-nowrap">
                Sort By:
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
                  <option value="popular">সর্বাধিক বিক্রিত (Best Selling)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid (Responsive: 2 cols on mobile, 3 on tablet/desktop) */}
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
                className="mt-2 px-5 py-2 rounded-lg bg-doibrand-gold text-white font-bengali text-xs font-semibold shadow-xs"
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

          {/* Pagination */}
          <div className="pt-4 flex items-center justify-center gap-2 font-sans">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-stone-200 bg-white text-doibrand-dark hover:bg-doibrand-light disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {[1, 2, 3].map((page) => {
              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-doibrand-gold text-white shadow-sm"
                      : "bg-white border border-stone-200 text-doibrand-dark hover:bg-doibrand-light"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              disabled={currentPage === 3}
              className="p-2 sm:px-3 sm:py-2 rounded-lg border border-stone-200 bg-white text-doibrand-dark hover:bg-doibrand-light disabled:opacity-40 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
