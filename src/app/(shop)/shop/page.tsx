"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  RotateCcw,
  Store,
  Check,
  Wallet,
  Snowflake,
  PackageSearch,
  LayoutGrid,
} from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";
import PriceRangeFilter from "@/components/shop/PriceRangeFilter";
import FilterSheet from "@/components/shop/FilterSheet";
import { toBnDigits } from "@/lib/bangla";

interface CategoryOption {
  id: string;
  name: string;
  englishName: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "doi", name: "বগুড়ার দই", englishName: "Doi" },
  { id: "ghee", name: "গাওয়া ঘি", englishName: "Ghee" },
  { id: "honey", name: "খাঁটি মধু", englishName: "Honey" },
  { id: "sweets", name: "ঐতিহ্যবাহী মিষ্টি", englishName: "Sweets" },
  { id: "dates-nuts", name: "খেজুর ও বাদাম", englishName: "Dates & Nuts" },
];

type ShopProduct = ProductItem & { category: string; numericPrice: number; numericOriginal: number };

const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 1,
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার দই",
    price: "৳ 500",
    numericPrice: 500,
    originalPrice: "৳ 600",
    numericOriginal: 600,
    image: "/Product/doi.jpg",
    badge: "Hot Sale",
    unit: "১ কেজি সরা",
    category: "doi",
  },
  {
    id: 2,
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: "৳ 480",
    numericPrice: 480,
    originalPrice: "৳ 560",
    numericOriginal: 560,
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
    numericOriginal: 480,
    image: "/Product/mini_doi.png",
    badge: "জনপ্রিয়",
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
    numericOriginal: 650,
    image: "/Product/mango.jpg",
    badge: "স্পেশাল",
    unit: "১ কেজি সরা",
    category: "doi",
  },
  {
    id: 5,
    slug: "pure-ghee",
    title: "খাঁটি গাওয়া ঘি (দানাদার)",
    price: "৳ 1,450",
    numericPrice: 1450,
    originalPrice: "৳ 1,600",
    numericOriginal: 1600,
    image:
      "/Product/placeholder.svg",
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
    numericOriginal: 980,
    image:
      "/Product/placeholder.svg",
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
    numericOriginal: 480,
    image:
      "/Product/placeholder.svg",
    badge: "Discount",
    unit: "১ কেজি বক্স",
    category: "sweets",
  },
  {
    id: 8,
    slug: "ajwa-dates",
    title: "প্রিমিয়াম খোরমা খেজুর",
    price: "৳ 750",
    numericPrice: 750,
    originalPrice: "৳ 900",
    numericOriginal: 900,
    image:
      "/Product/placeholder.svg",
    badge: "Hot Sale",
    unit: "১ কেজি প্যাকেট",
    category: "dates-nuts",
  },
];

const PRICE_MIN = 300;
const PRICE_MAX = 2000;
const PAGE_SIZE = 9;

const PRICE_PRESETS = [
  { label: "৳৫০০ এর নিচে", min: PRICE_MIN, max: 500 },
  { label: "৳৫০০ – ৳১,০০০", min: 500, max: 1000 },
  { label: "৳১,০০০+", min: 1000, max: PRICE_MAX },
];

const SORT_OPTIONS = [
  { value: "latest", label: "সর্বশেষ" },
  { value: "price-low", label: "মূল্য: কম থেকে বেশি" },
  { value: "price-high", label: "মূল্য: বেশি থেকে কম" },
  { value: "discount", label: "সর্বোচ্চ ছাড়" },
];

const CATEGORY_COUNTS = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
  acc[cat.id] = SHOP_PRODUCTS.filter((p) => p.category === cat.id).length;
  return acc;
}, {});


const discountOf = (p: ShopProduct) => (p.numericOriginal - p.numericPrice) / p.numericOriginal;

interface FilterPanelProps {
  selectedCategories: string[];
  toggleCategory: (id: string) => void;
  minPrice: number;
  maxPrice: number;
  setMinPrice: (n: number) => void;
  setMaxPrice: (n: number) => void;
}

function FilterPanel({
  selectedCategories,
  toggleCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      {/* Categories */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-doibrand-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold" />
          ক্যাটাগরি
        </h3>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-pressed={isChecked}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
                  isChecked ? "bg-[#FBF1E4] ring-1 ring-doibrand-gold/40" : "hover:bg-stone-50"
                }`}
              >
                <span
                  className={`w-5 h-5 shrink-0 grid place-items-center rounded-md transition ${
                    isChecked
                      ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white shadow-sm"
                      : "bg-white ring-1 ring-stone-300"
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm ${isChecked ? "font-bold text-doibrand-dark" : "text-stone-700"}`}>
                    {cat.name}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-sans">{cat.englishName}</span>
                </span>
                <span
                  className={`min-w-6 h-6 px-1.5 grid place-items-center rounded-full text-[11px] font-bold ${
                    isChecked ? "bg-white text-doibrand-accent" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  {toBnDigits(CATEGORY_COUNTS[cat.id])}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="pt-6 border-t border-doibrand-gold/15">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-doibrand-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold" />
          মূল্য সীমা
        </h3>

        <PriceRangeFilter
          bounds={{ min: PRICE_MIN, max: PRICE_MAX }}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinChange={setMinPrice}
          onMaxChange={setMaxPrice}
          presets={PRICE_PRESETS}
        />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  const toggleCategory = (catId: string) => {
    setCurrentPage(1);
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const updateMin = (n: number) => {
    setCurrentPage(1);
    setMinPrice(n);
  };
  const updateMax = (n: number) => {
    setCurrentPage(1);
    setMaxPrice(n);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
    setCurrentPage(1);
  };

  const isPriceFiltered = minPrice > PRICE_MIN || maxPrice < PRICE_MAX;
  const activeFilterCount = selectedCategories.length + (isPriceFiltered ? 1 : 0);

  const filteredProducts = useMemo(() => {
    return SHOP_PRODUCTS.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
      if (product.numericPrice < minPrice || product.numericPrice > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
      if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
      if (sortBy === "discount") return discountOf(b) - discountOf(a);
      return 0;
    });
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  const filterPanelProps: FilterPanelProps = {
    selectedCategories,
    toggleCategory,
    minPrice,
    maxPrice,
    setMinPrice: updateMin,
    setMaxPrice: updateMax,
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)] px-5 py-7 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
          <Store className="pointer-events-none absolute right-8 -bottom-6 hidden md:block w-44 h-44 text-doibrand-gold/10 -rotate-6" strokeWidth={1} />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">সকল পণ্য</span>
          </nav>

          <div className="relative mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-3xl sm:text-[40px] font-extrabold leading-tight tracking-tight">
                আমাদের সকল{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  পণ্য
                </span>
              </h1>
              <p className="mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-stone-600">
                বগুড়ার খাঁটি দই, গাওয়া ঘি, প্রাকৃতিক মধু ও ঐতিহ্যবাহী মিষ্টান্ন — এক জায়গায়, প্রিমিয়াম মানে।
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {[
                { icon: LayoutGrid, text: `${toBnDigits(SHOP_PRODUCTS.length)}টি পণ্য` },
                { icon: Wallet, text: "ক্যাশ অন ডেলিভারি" },
                { icon: Snowflake, text: "কোল্ড-চেইন ডেলিভারি" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-doibrand-dark ring-1 ring-doibrand-gold/25 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-doibrand-gold" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Category Quick Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto hide-scrollbar">
          <button
            type="button"
            onClick={() => {
              setSelectedCategories([]);
              setCurrentPage(1);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
              selectedCategories.length === 0
                ? "bg-doibrand-dark text-doibrand-light shadow-[0_8px_18px_-10px_rgba(53,28,27,0.8)]"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
            }`}
          >
            সব পণ্য
          </button>
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                aria-pressed={active}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                  active
                    ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-[0_8px_18px_-10px_rgba(169,94,53,0.9)]"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
                }`}
              >
                {cat.name}
                <span className={`text-[10px] ${active ? "text-white/80" : "text-stone-400"}`}>
                  {toBnDigits(CATEGORY_COUNTS[cat.id])}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block sticky top-32 rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_14px_36px_-26px_rgba(53,28,27,0.45)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold">
              <span className="w-8 h-8 grid place-items-center rounded-lg bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                <SlidersHorizontal className="w-4 h-4" />
              </span>
              ফিল্টার
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-[#FBF1E4] px-2.5 py-1 text-[11px] font-semibold text-doibrand-accent hover:bg-doibrand-gold/20 transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                রিসেট
              </button>
            )}
          </div>
          <FilterPanel {...filterPanelProps} />
        </aside>

        {/* Products */}
        <section className="min-w-0 space-y-5">
          {/* Toolbar */}
          <div className="rounded-2xl bg-white/80 backdrop-blur p-3 sm:p-4 ring-1 ring-stone-200/70 shadow-[0_10px_28px_-24px_rgba(53,28,27,0.45)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl bg-doibrand-dark px-3.5 py-2.5 text-xs font-bold text-doibrand-light cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                ফিল্টার
                {activeFilterCount > 0 && (
                  <span className="min-w-5 h-5 px-1 grid place-items-center rounded-full bg-doibrand-gold text-[10px] text-doibrand-dark">
                    {toBnDigits(activeFilterCount)}
                  </span>
                )}
              </button>
              <p className="text-xs sm:text-sm text-stone-500">
                <span className="font-bold text-doibrand-dark">{toBnDigits(filteredProducts.length)}</span>টি পণ্য পাওয়া গেছে
              </p>
            </div>

            <label className="relative flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-stone-500">সাজান:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl bg-[#FBF1E4] pl-3.5 pr-9 py-2.5 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/25 outline-none focus:ring-2 focus:ring-doibrand-gold/50 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 w-3.5 h-3.5 text-doibrand-accent" />
            </label>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="w-full flex flex-wrap items-center gap-2 pt-3 border-t border-doibrand-gold/15">
                {selectedCategories.map((id) => {
                  const cat = CATEGORIES.find((c) => c.id === id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCategory(id)}
                      className="inline-flex items-center gap-1 rounded-full bg-[#FBF1E4] px-2.5 py-1 text-[11px] font-semibold text-doibrand-accent ring-1 ring-doibrand-gold/25 hover:bg-doibrand-gold/20 transition cursor-pointer"
                    >
                      {cat?.name}
                      <X className="w-3 h-3" />
                    </button>
                  );
                })}
                {isPriceFiltered && (
                  <button
                    type="button"
                    onClick={() => {
                      updateMin(PRICE_MIN);
                      updateMax(PRICE_MAX);
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-[#FBF1E4] px-2.5 py-1 text-[11px] font-semibold text-doibrand-accent ring-1 ring-doibrand-gold/25 hover:bg-doibrand-gold/20 transition cursor-pointer font-sans"
                  >
                    ৳{minPrice} – ৳{maxPrice}
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-auto text-[11px] font-semibold text-stone-500 hover:text-doibrand-accent cursor-pointer"
                >
                  সব মুছুন
                </button>
              </div>
            )}
          </div>

          {/* Grid / Empty State */}
          {pagedProducts.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 sm:p-14 text-center ring-1 ring-stone-200/70">
              <span className="mx-auto w-16 h-16 grid place-items-center rounded-full bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-8 ring-[#FBF1E4]">
                <PackageSearch className="w-7 h-7" />
              </span>
              <h3 className="mt-5 text-lg font-bold">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="mt-1 text-xs text-stone-500">অনুগ্রহ করে ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-5 py-2.5 text-xs font-bold text-white shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                ফিল্টার মুছুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              {pagedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Pagination" className="pt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, page - 1))}
                disabled={page === 1}
                aria-label="Previous page"
                className="w-10 h-10 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 disabled:opacity-40 hover:bg-[#FBF1E4] transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentPage(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition cursor-pointer ${
                    n === page
                      ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white shadow-[0_8px_18px_-8px_rgba(169,94,53,0.8)]"
                      : "bg-white text-doibrand-dark ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
                  }`}
                >
                  {toBnDigits(n)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
                className="w-10 h-10 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 disabled:opacity-40 hover:bg-[#FBF1E4] transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </section>
      </div>

      <FilterSheet
        open={isMobileFilterOpen}
        onClose={closeMobileFilter}
        onReset={handleClearFilters}
        resultCount={filteredProducts.length}
      >
        <FilterPanel {...filterPanelProps} />
      </FilterSheet>
    </main>
  );
}
