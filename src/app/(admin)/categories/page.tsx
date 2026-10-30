"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Search,
  FolderTree,
  ExternalLink,
  Package,
  Layers,
  CheckCircle2,
  Star,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import {
  StoredCategory,
  getStoredCategories,
  deleteCategory,
} from "@/lib/categoryStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<StoredCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from storage
  useEffect(() => {
    setCategories(getStoredCategories());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" ক্যাটাগরিটি মুছে ফেলতে চান?`)) {
      const updated = deleteCategory(id);
      setCategories(updated);
      showToast(`"${name}" ক্যাটাগরি সফলভাবে মুছে ফেলা হয়েছে`);
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.nameBn.includes(searchQuery) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProductsCount = categories.reduce((acc, c) => acc + (c.totalProducts || 0), 0);
  const featuredCount = categories.filter((c) => c.isFeatured).length;

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
              ক্যাটাগরি ব্যবস্থাপনা
            </h1>
            <span className="bg-amber-100 text-doibrand-dark text-xs font-bold px-2.5 py-0.5 rounded-full font-sans">
              {toBnDigits(categories.length)} টি ক্যাটাগরি
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            দই বিলাসের পণ্য ক্যাটাগরি তালিকা, প্রোডাক্ট সংখ্যা, ইমেজ ও লাইভ নিয়ন্ত্রণ।
          </p>
        </div>

        {/* Right: + নতুন ক্যাটাগরি Button (Now navigates to new page!) */}
        <Link
          href="/admin/categories/new"
          className="bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white px-5 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ক্যাটাগরি</span>
        </Link>
      </div>

      {/* ── 2. Top Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট ক্যাটাগরি</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-doibrand-dark mt-2 font-sans">
            {categories.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">সকল ক্যাটাগরি সক্রিয়</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট সংযুক্ত পণ্য</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-doibrand-accent flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-doibrand-dark mt-2 font-sans">
            {totalProductsCount}
          </p>
          <span className="text-[11px] text-stone-500">বিভিন্ন ক্যাটাগরিতে পণ্য</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">ফিচার্ড ক্যাটাগরি</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100/60 text-amber-700 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-doibrand-dark mt-2 font-sans">
            {featuredCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">হোমপেজে প্রদর্শিত</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">পাবলিক ভিউ</span>
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <Link
            href="/shop"
            target="_blank"
            className="text-xs font-bold text-doibrand-accent hover:underline flex items-center gap-1 mt-3"
          >
            <span>ওয়েবসাইট শপ ভিজিট করুন</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[10px] text-stone-400">লাইভ গ্রাহক দৃশ্যমানতা</span>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ক্যাটাগরির নাম বা স্লাগ দিয়ে খুঁজুন..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 self-end sm:self-auto">
          <span>
            ফিল্টারকৃত: <strong className="text-doibrand-dark font-sans">{filteredCategories.length}</strong> টি
          </span>
          <Link
            href="/admin/categories/new"
            className="text-xs font-bold text-doibrand-accent hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন ক্যাটাগরি তৈরি করুন</span>
          </Link>
        </div>
      </div>

      {/* ── 4. Desktop Categories Table ─────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-stone-600 font-bold text-xs py-4 px-6 border-b border-stone-200/80">
              <tr>
                <th className="py-4 px-6">ছবি / প্রিভিউ</th>
                <th className="py-4 px-6">ক্যাটাগরি নাম</th>
                <th className="py-4 px-6">URL Slug</th>
                <th className="py-4 px-6">মোট পণ্য সংখ্যা</th>
                <th className="py-4 px-6">স্ট্যাটাস</th>
                <th className="py-4 px-6 text-right">একশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-stone-400 text-sm">
                    কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    {/* Image Column */}
                    <td className="py-4 px-6">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-stone-100 border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform">
                        <Image
                          src={cat.image || "/Product/doi.jpg"}
                          alt={cat.nameBn}
                          fill
                          unoptimized={cat.image?.startsWith("data:") || cat.image?.startsWith("blob:")}
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Category Name Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-doibrand-dark text-base">
                          {cat.nameBn}
                        </span>
                        {cat.isFeatured && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-bold">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            ফিচার্ড
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-400 font-sans mt-0.5">
                        {cat.name}
                      </div>
                      {cat.subtitle && (
                        <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 max-w-xs">
                          {cat.subtitle}
                        </div>
                      )}
                    </td>

                    {/* Slug Column */}
                    <td className="py-4 px-6">
                      <Link
                        href={`/category/${cat.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-mono text-xs text-stone-600 bg-stone-100 hover:bg-amber-100 hover:text-doibrand-accent px-2.5 py-1 rounded-md border border-stone-200 transition-colors"
                        title="ওয়েবসাইটে ক্যাটাগরি দেখুন"
                      >
                        <span>/{cat.slug}</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </Link>
                    </td>

                    {/* Total Products Column */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-xs font-bold font-sans">
                        <Package className="w-3.5 h-3.5 text-doibrand-gold" />
                        {cat.totalProducts || 0} টি পণ্য
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      {cat.status === "draft" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          খসড়া
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          সক্রিয়
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit Button -> Navigates to the full new/edit page! */}
                        <Link
                          href={`/admin/categories/new?id=${cat.id}`}
                          title="সম্পাদনা করুন"
                          className="p-2 rounded-xl text-stone-500 hover:text-doibrand-gold hover:bg-amber-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.nameBn)}
                          title="মুছে ফেলুন"
                          className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Mobile View: Responsive Category Cards ──────────────────── */}
      <div className="block md:hidden grid grid-cols-1 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3.5"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden relative bg-stone-100 border border-stone-200 shrink-0">
                <Image
                  src={cat.image || "/Product/doi.jpg"}
                  alt={cat.nameBn}
                  fill
                  unoptimized={cat.image?.startsWith("data:") || cat.image?.startsWith("blob:")}
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-doibrand-dark truncate">
                    {cat.nameBn}
                  </h3>
                  {cat.isFeatured && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                      ফিচার্ড
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 font-sans">{cat.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full text-[11px] font-bold font-sans">
                    {cat.totalProducts || 0} টি পণ্য
                  </span>
                  <span className="text-[11px] font-mono text-stone-500">
                    /{cat.slug}
                  </span>
                </div>
              </div>
            </div>

            {cat.subtitle && (
              <p className="text-xs text-stone-600 line-clamp-1 pt-1 border-t border-stone-100">
                {cat.subtitle}
              </p>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <Link
                href={`/category/${cat.slug}`}
                target="_blank"
                className="text-xs text-doibrand-accent hover:underline flex items-center gap-1"
              >
                <span>স্টোরে দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/categories/new?id=${cat.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.nameBn)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ডিলিট</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
