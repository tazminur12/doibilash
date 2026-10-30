"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  ExternalLink,
  CheckCircle2,
  Star,
  Eye,
  ArrowUpRight,
  Filter,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import {
  StoredProduct,
  getStoredProducts,
  deleteProduct,
} from "@/lib/productStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from storage
  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" পণ্যটি তালিকা থেকে মুছে ফেলতে চান?`)) {
      const updated = deleteProduct(id);
      setProducts(updated);
      showToast(`"${name}" পণ্য সফলভাবে মুছে ফেলা হয়েছে`);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesStock = stockFilter === "all" || p.stockStatus === stockFilter;
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));

  // Metrics
  const inStockCount = products.filter((p) => p.stockStatus === "In Stock").length;
  const outOfStockCount = products.filter((p) => p.stockStatus === "Out of Stock").length;
  const featuredCount = products.filter((p) => p.isFeatured).length;

  return (
    <div className="font-bengali text-doibrand-dark space-y-6 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-header-fade-up bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-doibrand-gold/40 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Header & Actions ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
              পণ্য তালিকা ব্যবস্থাপনা
            </h1>
            <span className="bg-amber-100 text-doibrand-dark text-xs font-bold px-2.5 py-0.5 rounded-full font-sans">
              {toBnDigits(products.length)} টি পণ্য
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            দই বিলাসের সকল পণ্যের স্টক, মূল্য, ছবি এবং বিবরণ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {/* Right: '+ নতুন পণ্য যুক্ত করুন' Button (Navigates to new page!) */}
        <Link
          href="/admin/products/new"
          className="bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white px-5 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন পণ্য যুক্ত করুন</span>
        </Link>
      </div>

      {/* ── 2. Top Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট পণ্য</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-doibrand-dark mt-2 font-sans">
            {products.length}
          </p>
          <span className="text-[11px] text-stone-500">ক্যাটালগভুক্ত সকল আইটেম</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">স্টকে উপলব্ধ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2 font-sans">
            {inStockCount}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">অর্ডারের জন্য প্রস্তুত</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">স্টক শেষ (Out of Stock)</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-2 font-sans">
            {outOfStockCount}
          </p>
          <span className="text-[11px] text-red-500 font-medium">পুনরায় স্টক প্রয়োজন</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">ফিচার্ড পণ্য</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-doibrand-dark mt-2 font-sans">
            {featuredCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">হোমপেজে হাইলাইটেড</span>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্যের নাম, ক্যাটাগরি বা স্লাগ খুঁজুন..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
          >
            <option value="all">সকল স্টক অবস্থা</option>
            <option value="In Stock">স্টকে আছে</option>
            <option value="Out of Stock">স্টক শেষ</option>
          </select>

          <span className="text-xs text-stone-500 pl-1 font-sans">
            ফিল্টার: <strong>{filteredProducts.length}</strong>
          </span>
        </div>
      </div>

      {/* ── 4. Desktop Products Table ───────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-stone-600 font-bold text-xs py-4 px-6 border-b border-stone-200/80">
              <tr>
                <th className="py-4 px-6">ছবি</th>
                <th className="py-4 px-6">পণ্যের নাম ও বিবরণ</th>
                <th className="py-4 px-6">ক্যাটাগরি</th>
                <th className="py-4 px-6">মূল্য</th>
                <th className="py-4 px-6">স্টক অবস্থা</th>
                <th className="py-4 px-6 text-right">একশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400 text-sm">
                    কোনো পণ্য খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isInStock = prod.stockStatus === "In Stock";
                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      {/* Image Column */}
                      <td className="py-4 px-6">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-stone-100 border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform">
                          <Image
                            src={prod.image || "/Product/doi.jpg"}
                            alt={prod.name}
                            fill
                            unoptimized={prod.image?.startsWith("data:") || prod.image?.startsWith("blob:")}
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* Name & Unit Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-doibrand-dark text-base">
                            {prod.name}
                          </span>
                          {prod.badge && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold font-sans">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 font-sans mt-0.5">
                          {prod.nameEn}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 font-sans">
                          {prod.unit}
                        </div>
                      </td>

                      {/* Category Column */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold">
                          {prod.category}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="py-4 px-6">
                        <div className="font-bold font-sans text-doibrand-accent text-base">
                          ৳ {prod.price.toLocaleString("en-US")}
                        </div>
                        {prod.originalPrice && (
                          <div className="text-xs text-stone-400 line-through font-sans">
                            ৳ {prod.originalPrice.toLocaleString("en-US")}
                          </div>
                        )}
                      </td>

                      {/* Stock Column */}
                      <td className="py-4 px-6">
                        {isInStock ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            স্টকে আছে
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            স্টক শেষ
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View in Store */}
                          <Link
                            href={`/products/${prod.slug}`}
                            target="_blank"
                            title="ওয়েবসাইটে দেখুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-doibrand-accent hover:bg-stone-100 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Edit Button -> Navigates to full new/edit page! */}
                          <Link
                            href={`/admin/products/new?id=${prod.id}`}
                            title="সম্পাদনা করুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-doibrand-gold hover:bg-amber-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(prod.id, prod.name)}
                            title="মুছে ফেলুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Mobile View: Responsive Product Cards ───────────────────── */}
      <div className="block md:hidden grid grid-cols-1 gap-4">
        {filteredProducts.map((prod) => {
          const isInStock = prod.stockStatus === "In Stock";
          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3.5"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative bg-stone-100 border border-stone-200 shrink-0">
                  <Image
                    src={prod.image || "/Product/doi.jpg"}
                    alt={prod.name}
                    fill
                    unoptimized={prod.image?.startsWith("data:") || prod.image?.startsWith("blob:")}
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-base text-doibrand-dark truncate">
                      {prod.name}
                    </h3>
                    {prod.badge && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0 font-sans">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400 font-sans">{prod.nameEn}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-doibrand-accent font-sans">
                      ৳ {prod.price}
                    </span>
                    <span className="text-[11px] text-stone-500">• {prod.unit}</span>
                  </div>
                </div>
              </div>

              {/* Status and category row */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-600 font-semibold">{prod.category}</span>
                {isInStock ? (
                  <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    স্টকে আছে
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                    স্টক শেষ
                  </span>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <Link
                  href={`/products/${prod.slug}`}
                  target="_blank"
                  className="text-xs text-doibrand-accent hover:underline flex items-center gap-1"
                >
                  <span>স্টোরে দেখুন</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/new?id=${prod.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(prod.id, prod.name)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলিট</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
