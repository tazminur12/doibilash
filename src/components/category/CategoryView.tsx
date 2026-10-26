"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Check,
  PackageSearch,
  Award,
  Snowflake,
  Wallet,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import PriceRangeFilter from "@/components/shop/PriceRangeFilter";
import FilterSheet from "@/components/shop/FilterSheet";
import { ALL_TAG, CATEGORY_LIST, CATEGORY_MAP, categoryPriceBounds } from "@/data/categories";
import { toBnDigits } from "@/lib/bangla";

const SORT_OPTIONS = [
  { value: "latest", label: "সর্বশেষ" },
  { value: "price-low", label: "মূল্য: কম থেকে বেশি" },
  { value: "price-high", label: "মূল্য: বেশি থেকে কম" },
];

const ASSURANCES = [
  { icon: Award, title: "শতভাগ খাঁটি", text: "কোনো ক্ষতিকর কেমিক্যাল বা কৃত্রিম উপাদান নেই" },
  { icon: Snowflake, title: "কোল্ড-চেইন ডেলিভারি", text: "শীতল ও অক্ষত অবস্থায় আপনার দোরগোড়ায়" },
  { icon: Wallet, title: "ক্যাশ অন ডেলিভারি", text: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন" },
];

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-doibrand-dark">
      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold" />
      {children}
    </h3>
  );
}

export default function CategoryView({ slug }: { slug: string }) {
  const category = CATEGORY_MAP[slug];
  const bounds = useMemo(() => categoryPriceBounds(category), [category]);

  const [selectedTag, setSelectedTag] = useState<string>(ALL_TAG);
  const [minPrice, setMinPrice] = useState<number>(bounds.min);
  const [maxPrice, setMaxPrice] = useState<number>(bounds.max);
  const [sortBy, setSortBy] = useState<string>("latest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const closeMobileFilter = useCallback(() => setIsMobileFilterOpen(false), []);

  const isPriceFiltered = minPrice > bounds.min || maxPrice < bounds.max;
  const activeFilterCount = (selectedTag !== ALL_TAG ? 1 : 0) + (isPriceFiltered ? 1 : 0);

  const handleClearFilters = () => {
    setSelectedTag(ALL_TAG);
    setMinPrice(bounds.min);
    setMaxPrice(bounds.max);
    setSortBy("latest");
  };

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { [ALL_TAG]: category.products.length };
    category.products.forEach((p) => {
      if (p.tag) counts[p.tag] = (counts[p.tag] ?? 0) + 1;
    });
    return counts;
  }, [category.products]);

  const filteredProducts = useMemo(() => {
    return category.products
      .filter((product) => {
        if (selectedTag !== ALL_TAG && product.tag !== selectedTag) return false;
        if (product.numericPrice < minPrice || product.numericPrice > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.numericPrice - b.numericPrice;
        if (sortBy === "price-high") return b.numericPrice - a.numericPrice;
        return 0;
      });
  }, [category.products, selectedTag, minPrice, maxPrice, sortBy]);

  const lowestPrice = Math.min(...category.products.map((p) => p.numericPrice));

  const categoryLinks = (
    <div className="space-y-1.5">
      {CATEGORY_LIST.map((item) => {
        const isActive = item.slug === category.slug;
        return (
          <Link
            key={item.slug}
            href={`/category/${item.slug}`}
            onClick={closeMobileFilter}
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl p-2 transition ${
              isActive ? "bg-[#FBF1E4] ring-1 ring-doibrand-gold/40" : "hover:bg-stone-50"
            }`}
          >
            <span className="relative w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-[#F5EDE3]">
              <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
            </span>
            <span className="flex-1 min-w-0">
              <span className={`block text-sm ${isActive ? "font-bold text-doibrand-dark" : "text-stone-700"}`}>
                {item.name}
              </span>
              <span className="block text-[10px] text-stone-400 font-sans">{item.englishName}</span>
            </span>
            {isActive ? (
              <span className="w-2 h-2 rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold" />
            ) : (
              <ChevronRight className="w-4 h-4 text-stone-300" />
            )}
          </Link>
        );
      })}
    </div>
  );

  const priceFilter = (
    <PriceRangeFilter
      bounds={bounds}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onMinChange={setMinPrice}
      onMaxChange={setMaxPrice}
    />
  );

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)] px-5 py-7 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/4 w-80 h-80 rounded-full bg-[#F7D9B0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] items-center gap-8">
            <div>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500">
                <Link href="/" className="hover:text-doibrand-accent transition-colors">
                  হোম
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/category" className="hover:text-doibrand-accent transition-colors">
                  ক্যাটাগরি
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold text-doibrand-accent">{category.name}</span>
              </nav>

              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-doibrand-gold">
                {category.englishName}
              </p>
              <h1 className="mt-1.5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                <span className="bg-linear-to-r from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent">
                  {category.name}
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-sm sm:text-base leading-relaxed text-stone-600">{category.subtitle}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {category.highlights.map((text) => (
                  <li
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-doibrand-dark ring-1 ring-doibrand-gold/25 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 text-doibrand-gold" strokeWidth={3} />
                    {text}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-extrabold text-doibrand-dark">{toBnDigits(category.products.length)}টি</p>
                  <p className="text-[11px] text-stone-500">পণ্য</p>
                </div>
                <span className="w-px h-9 bg-doibrand-gold/25" />
                <div>
                  <p className="text-2xl font-extrabold text-doibrand-accent font-sans">৳{lowestPrice}</p>
                  <p className="text-[11px] text-stone-500">থেকে শুরু</p>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative w-60 h-60 lg:w-72 lg:h-72 rounded-full p-1.5 bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_30px_60px_-30px_rgba(169,94,53,0.8)]">
                <div className="relative w-full h-full overflow-hidden rounded-full ring-8 ring-white/70">
                  <Image src={category.image} alt={category.name} fill sizes="288px" preload className="object-cover" />
                </div>
              </div>
              <span className="absolute -bottom-1 left-2 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 shadow-lg">
                <LayoutGrid className="w-3.5 h-3.5" />
                {toBnDigits(category.products.length)}+ আইটেম
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-32 space-y-5">
          <div className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_14px_36px_-26px_rgba(53,28,27,0.45)]">
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
            <SidebarHeading>ক্যাটাগরিসমূহ</SidebarHeading>
            {categoryLinks}
            <div className="mt-6 pt-6 border-t border-doibrand-gold/15">
              <SidebarHeading>মূল্য সীমা</SidebarHeading>
              {priceFilter}
            </div>
          </div>
        </aside>

        {/* Products */}
        <section className="min-w-0 space-y-5">
          {/* Type Pills */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto hide-scrollbar">
            {category.tags.map((tag) => {
              const active = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  aria-pressed={active}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                    active
                      ? tag === ALL_TAG
                        ? "bg-doibrand-dark text-doibrand-light shadow-[0_8px_18px_-10px_rgba(53,28,27,0.8)]"
                        : "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-[0_8px_18px_-10px_rgba(169,94,53,0.9)]"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
                  }`}
                >
                  {tag}
                  <span className={`text-[10px] ${active ? "text-white/75" : "text-stone-400"}`}>
                    {toBnDigits(tagCounts[tag] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>

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
          </div>

          {/* Grid / Empty State */}
          {filteredProducts.length === 0 ? (
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
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Assurance Band */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] ring-1 ring-doibrand-gold/20 shadow-[0_14px_36px_-22px_rgba(169,94,53,0.45)] p-5 sm:p-7">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
            <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ASSURANCES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)]">
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-doibrand-dark">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-stone-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-5 pt-5 border-t border-doibrand-gold/15 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-stone-600">আরও পণ্য খুঁজছেন? আমাদের সম্পূর্ণ কালেকশন দেখুন।</p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 rounded-full bg-doibrand-dark px-5 py-2.5 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors"
              >
                সব পণ্য দেখুন
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <FilterSheet
        open={isMobileFilterOpen}
        onClose={closeMobileFilter}
        onReset={handleClearFilters}
        resultCount={filteredProducts.length}
      >
        <div className="space-y-7">
          <div>
            <SidebarHeading>ক্যাটাগরিসমূহ</SidebarHeading>
            {categoryLinks}
          </div>
          <div className="pt-6 border-t border-doibrand-gold/15">
            <SidebarHeading>মূল্য সীমা</SidebarHeading>
            {priceFilter}
          </div>
        </div>
      </FilterSheet>
    </main>
  );
}
