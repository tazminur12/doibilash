"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Gift,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Filter,
  DollarSign,
  Package,
  Layers,
  Star,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  StoredPackage,
  PackageOccasion,
  PackageStatus,
  OCCASION_META,
} from "@/lib/packageStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<StoredPackage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState<PackageOccasion | "ALL">("ALL");
  const [packageToDelete, setPackageToDelete] = useState<StoredPackage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [sweetAlert, setSweetAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning";
    confirmButtonText?: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const json = await res.json();
        if (json.ok && Array.isArray(json.packages)) {
          setPackages(json.packages);
          return;
        }
      }
    } catch (err) {
      console.error("Failed to load packages from API:", err);
    }
    setPackages([]);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!sweetAlert.isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSweetAlert((prev) => ({ ...prev, isOpen: false }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sweetAlert.isOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleStatus = async (pkg: StoredPackage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/packages/${pkg.id}/status`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে");
      }
      await loadData();
      setSweetAlert({
        isOpen: true,
        type: "success",
        title: "স্ট্যাটাস পরিবর্তন সম্পন্ন!",
        message: data.message || `প্যাকেজ "${pkg.title}" এর স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
      });
    } catch (err: any) {
      setSweetAlert({
        isOpen: true,
        type: "error",
        title: "ত্রুটি",
        message: err.message || "স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।",
        confirmButtonText: "বুঝেছি",
      });
    }
  };

  const confirmDelete = async () => {
    if (!packageToDelete) return;
    try {
      const res = await fetch(`/api/admin/packages/${packageToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "মুছে ফেলা ব্যর্থ হয়েছে");
      }
      const title = packageToDelete.title;
      setPackageToDelete(null);
      await loadData();
      setSweetAlert({
        isOpen: true,
        type: "success",
        title: "প্যাকেজ মুছে ফেলা হয়েছে!",
        message: `উপহার প্যাকেজ "${title}" সফলভাবে তালিকা থেকে মুছে ফেলা হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
      });
    } catch (err: any) {
      setSweetAlert({
        isOpen: true,
        type: "error",
        title: "ত্রুটি",
        message: err.message || "প্যাকেজ মুছে ফেলা সম্ভব হয়নি।",
        confirmButtonText: "বুঝেছি",
      });
    }
  };

  // Filtered packages
  const filteredPackages = packages.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packagingType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOccasion = selectedOccasion === "ALL" || p.occasion === selectedOccasion;
    return matchesSearch && matchesOccasion;
  });

  // KPIs
  const totalCount = packages.length;
  const activeCount = packages.filter((p) => p.status === "Active").length;
  const festivalCount = packages.filter(
    (p) => p.occasion === "ঈদ উৎসব" || p.occasion === "পহেলা বৈশাখ"
  ).length;
  const totalStockCount = packages.reduce((sum, p) => sum + (p.availableStock || 0), 0);

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* SweetAlert Custom Modal */}
      {sweetAlert.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-bengali animate-in fade-in duration-200">
          <div
            onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-sweetalert-title"
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl ring-1 ring-black/5 animate-in zoom-in-95 duration-200"
          >
            <button
              type="button"
              onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
              aria-label="Close"
              className="absolute right-4 top-4 w-8 h-8 grid place-items-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {sweetAlert.type === "success" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-10 w-10 animate-bounce duration-700" />
              </div>
            )}
            {sweetAlert.type === "error" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 ring-8 ring-red-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}
            {sweetAlert.type === "warning" && (
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-8 ring-amber-50/60">
                <AlertCircle className="h-10 w-10 animate-pulse" />
              </div>
            )}

            <h3
              id="admin-sweetalert-title"
              className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight"
            >
              {sweetAlert.title}
            </h3>

            <p className="mt-2.5 text-sm sm:text-base text-stone-600 font-medium leading-relaxed">
              {sweetAlert.message}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setSweetAlert((prev) => ({ ...prev, isOpen: false }))}
                className="w-full inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] py-3 px-6 text-sm sm:text-base font-bold text-white shadow-lg shadow-black/10 hover:brightness-110 active:scale-98 transition cursor-pointer"
              >
                {sweetAlert.confirmButtonText || "ঠিক আছে"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {packageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-lg">প্যাকেজ মুছে ফেলার নিশ্চয়তা</h3>
                <p className="text-xs text-stone-500">এই অ্যাকশনটি ফেরত নেওয়া যাবে না</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি উপহার প্যাকেজ{" "}
              <strong className="text-stone-900">{packageToDelete.title}</strong>-কে তালিকা থেকে মুছে ফেলতে চান?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setPackageToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-medium"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-amber-100/50 via-rose-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <Gift className="w-4 h-4" />
              <span>উপহার ও উৎসব ক্যাটালগ পোর্টাল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#351C1B] tracking-tight">
              উপহার ও উৎসব সম্ভার প্যাকেজ
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              পবিত্র ঈদ, পহেলা বৈশাখ, বিয়ে ও পারিবারিক অনুষ্ঠানের জন্য প্রিমিয়াম উপহার বক্স ও কম্বো প্যাকেজ তৈরি ও পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/packages/new"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-sm shadow-lg shadow-[#351C1B]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus className="w-4 h-4 text-amber-200" />
              </div>
              <span>নতুন প্যাকেজ তৈরি করুন</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Executive KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C48A4E] flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">মোট গিফট প্যাকেজ</div>
            <div className="text-xl sm:text-2xl font-black text-[#351C1B]">
              {toBnDigits(totalCount)} <span className="text-xs font-normal text-stone-400">আইটেম</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">সক্রিয় লাইভ প্যাকেজ</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              {toBnDigits(activeCount)} <span className="text-xs font-normal text-stone-400">টি সচল</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">ঈদ ও বৈশাখ স্পেশাল</div>
            <div className="text-xl sm:text-2xl font-black text-rose-900">
              {toBnDigits(festivalCount)} <span className="text-xs font-normal text-stone-400">প্যাক</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">মোট মজুদ বক্স</div>
            <div className="text-xl sm:text-2xl font-black text-purple-900">
              {toBnDigits(totalStockCount)} <span className="text-xs font-normal text-stone-400">টি</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ───────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="প্যাকেজের নাম, অন্তর্ভুক্ত খাবার বা প্যাকেজিং দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
            />
          </div>
        </div>

        {/* Occasion Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> উৎসব ফিল্টার:
          </span>

          <button
            type="button"
            onClick={() => setSelectedOccasion("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedOccasion === "ALL"
                ? "bg-[#351C1B] text-amber-100 shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            সকল ({toBnDigits(packages.length)})
          </button>

          {(
            [
              "ঈদ উৎসব",
              "পহেলা বৈশাখ",
              "বিয়ে ও পারিবারিক",
              "কর্পোরেট উপহার",
              "পূজা ও উৎসব",
              "নিত্যদিনের উপহার",
            ] as PackageOccasion[]
          ).map((occ) => {
            const count = packages.filter((p) => p.occasion === occ).length;
            const meta = OCCASION_META[occ];
            const isSelected = selectedOccasion === occ;
            return (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#C48A4E] text-white shadow-xs"
                    : `${meta.bg} ${meta.color} border ${meta.border} hover:opacity-85`
                }`}
              >
                <span>{meta.labelBn}</span>
                <span className="opacity-75">({toBnDigits(count)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Packages Visual Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => {
          const meta = OCCASION_META[pkg.occasion] || OCCASION_META["ঈদ উৎসব"];
          return (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#C48A4E]/50 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-16/10 rounded-t-3xl overflow-hidden bg-stone-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {pkg.badge && (
                    <span className="absolute top-3 left-3 bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {pkg.badge}
                    </span>
                  )}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border} shadow-2xs`}
                  >
                    {meta.labelBn}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-black text-[#351C1B] text-lg leading-tight group-hover:text-[#C48A4E] transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="text-[11px] text-amber-900 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60 font-semibold">
                    🎁 {pkg.packagingType}
                  </div>

                  {/* Components summary */}
                  <div className="space-y-1 pt-1 text-xs text-stone-600">
                    <span className="font-bold text-stone-700 text-[11px] block">
                      অন্তর্ভুক্ত খাদ্যসামগ্রী:
                    </span>
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                    {pkg.features.length > 3 && (
                      <span className="text-[10px] text-stone-400 pl-4">
                        + আরো {toBnDigits(pkg.features.length - 3)} টি আইটেম
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Pricing & Action Controls */}
              <div className="p-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3 bg-[#FAF8F5]/60">
                <div>
                  <div className="text-xs text-stone-400 font-medium">বিক্রয় মূল্য</div>
                  <div className="text-lg font-black text-[#351C1B]">
                    ৳ {toBnDigits(pkg.price.toLocaleString("en-IN"))}
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                        ৳ {toBnDigits(pkg.originalPrice.toLocaleString("en-IN"))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleStatus(pkg, e)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      pkg.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                        : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                    }`}
                  >
                    {pkg.status === "Active" ? "সক্রিয়" : "খসড়া"}
                  </button>

                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 transition-colors"
                    title="প্যাকেজ এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setPackageToDelete(pkg)}
                    className="p-2 border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-xl transition-colors"
                    title="প্যাকেজ মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
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
