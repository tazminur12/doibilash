"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Gift,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Check,
  AlertCircle,
  UploadCloud,
  X,
  Crown,
  Eye,
  Percent,
  Layers,
  ShoppingBag,
  DollarSign,
  Tag,
  Star,
  Package,
} from "lucide-react";
import {
  StoredPackage,
  PackageOccasion,
  PackageStatus,
  PackageItemComponent,
  OCCASION_META,
  getStoredPackages,
  savePackage,
  getPackageById,
} from "@/lib/packageStorage";
import { getStoredProducts, StoredProduct } from "@/lib/productStorage";
import { toBnDigits } from "@/lib/bangla";

const PRESET_IMAGES = [
  { label: "দই ও লাড্ডু হ্যাম্পার", url: "/Product/doi.jpg" },
  { label: "ফেস্টিভ্যাল সেমাই বক্স", url: "/Product/laccha_semai.jpg" },
  { label: "রয়্যাল কাপ দই গিফট", url: "/Product/mini_doi.png" },
];

const PACKAGING_TYPES = [
  "রয়েল গোল্ডেন ফিতা ও সিল্ক গ্রিটিংস বক্স",
  "প্রিমিয়াম ফেস্টিভ্যাল গোল্ড কার্টন",
  "কাস্টম ব্র্যান্ডেড কাঠের লাক্সারি গিফট চেস্ট",
  "ঐতিহ্যবাহী নকশিকাঁথা মোটিফ হ্যান্ডমেড বক্স",
  "মাটির হাঁড়ি ও পিতলের কভার গিফট প্যাক",
];

const QUICK_DISCOUNT_PERCENTAGES = [5, 10, 12, 15, 20, 25];

export default function PackageEditor({ packageId }: { packageId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromParam = packageId || searchParams.get("id") || searchParams.get("edit");

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [occasion, setOccasion] = useState<PackageOccasion>("ঈদ উৎসব");
  const [packagingType, setPackagingType] = useState(PACKAGING_TYPES[0]);
  const [price, setPrice] = useState<number>(1850);
  const [originalPrice, setOriginalPrice] = useState<number>(2150);
  const [badge, setBadge] = useState("উৎসব স্পেশাল");
  const [image, setImage] = useState("/Product/doi.jpg");
  const [availableStock, setAvailableStock] = useState<number>(50);
  const [isFeatured, setIsFeatured] = useState(true);
  const [status, setStatus] = useState<PackageStatus>("Active");
  const [customGreetingAllowed, setCustomGreetingAllowed] = useState(true);

  // Components / Included items
  const [components, setComponents] = useState<PackageItemComponent[]>([
    { name: "১ কেজি বগুড়ার স্পেশাল সরার দই", quantity: "১ কেজি" },
    { name: "৫০০ গ্রাম খাঁটি দানাদার গাওয়া ঘি", quantity: "৫০০ গ্রাম" },
    { name: "রয়েল গোল্ডেন ফিতা ও গ্রিটিংস কার্ড", quantity: "১ পিস" },
  ]);

  const [productsCatalogue, setProductsCatalogue] = useState<StoredProduct[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Discount Percentage Calculation
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleApplyDiscountPercent = (pct: number) => {
    if (originalPrice > 0) {
      const discounted = Math.round(originalPrice * (1 - pct / 100));
      setPrice(discounted);
    }
  };

  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    if (newPrice > originalPrice) {
      setOriginalPrice(newPrice);
    }
  };

  useEffect(() => {
    setProductsCatalogue(getStoredProducts());

    if (idFromParam) {
      const existing = getPackageById(idFromParam);
      if (existing) {
        setEditingId(existing.id);
        setTitle(existing.title);
        setSubtitle(existing.subtitle);
        setOccasion(existing.occasion);
        setPackagingType(existing.packagingType);
        setPrice(existing.price);
        setOriginalPrice(existing.originalPrice || existing.price);
        setBadge(existing.badge || "উৎসব স্পেশাল");
        setImage(existing.image || "/Product/doi.jpg");
        setAvailableStock(existing.availableStock || 50);
        setIsFeatured(existing.isFeatured ?? true);
        setStatus(existing.status || "Active");
        setCustomGreetingAllowed(existing.customGreetingAllowed ?? true);
        if (existing.components && existing.components.length > 0) {
          setComponents(existing.components);
        } else if (existing.features && existing.features.length > 0) {
          setComponents(existing.features.map((f) => ({ name: f, quantity: "১টি" })));
        }
      }
    }
  }, [idFromParam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("ছবির সাইজ ৩ মেগাবাইটের কম হতে হবে।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        showToast("ছবি আপলোড সফল হয়েছে!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Components manipulation
  const handleAddComponent = () => {
    setComponents((prev) => [...prev, { name: "", quantity: "১টি" }]);
  };

  const handleRemoveComponent = (idx: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleComponentChange = (idx: number, field: keyof PackageItemComponent, val: string) => {
    setComponents((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleQuickAddProduct = (prod: StoredProduct) => {
    setComponents((prev) => [
      ...prev,
      {
        productId: prod.id,
        name: prod.name,
        quantity: prod.unit || "১টি",
      },
    ]);
    showToast(`প্যাকেজে "${prod.name}" যুক্ত হয়েছে!`);
  };

  // Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("দয়া করে প্যাকেজের নাম লিখুন।");
      return;
    }

    setIsSaving(true);

    const featuresList = components
      .filter((c) => c.name.trim().length > 0)
      .map((c) => (c.quantity ? `${c.name} (${c.quantity})` : c.name));

    const finalId = editingId || `PKG-${Date.now().toString().slice(-4)}`;

    const newPackage: StoredPackage = {
      id: finalId,
      title: title.trim(),
      subtitle: subtitle.trim(),
      occasion,
      packagingType,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent,
      badge: badge.trim() || "উৎসব স্পেশাল",
      image,
      features: featuresList.length > 0 ? featuresList : ["প্রিমিয়াম গিফট প্যাকিং"],
      components: components.filter((c) => c.name.trim().length > 0),
      isFeatured,
      status,
      availableStock: Number(availableStock) || 0,
      customGreetingAllowed,
      createdAt: editingId ? (getPackageById(editingId)?.createdAt || "২০২৬-০১-১৫") : "আজকের তারিখ",
    };

    setTimeout(() => {
      savePackage(newPackage);
      setIsSaving(false);
      showToast(editingId ? "প্যাকেজ সফলভাবে আপডেট হয়েছে!" : "নতুন উপহার প্যাকেজ তৈরি হয়েছে!");
      setTimeout(() => {
        router.push("/admin/packages");
      }, 700);
    }, 400);
  };

  return (
    <div className="font-bengali pb-28 text-stone-900 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/admin" className="hover:text-[#C48A4E]">
              ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/packages" className="hover:text-[#C48A4E]">
              উপহার ও উৎসব সম্ভার
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#351C1B] font-bold">
              {editingId ? "প্যাকেজ সম্পাদনা" : "নতুন প্যাকেজ তৈরি"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/packages"
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-[#351C1B] shadow-2xs transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#351C1B] tracking-tight">
                {editingId ? "উপহার প্যাকেজ সম্পাদনা" : "উপহার ও উৎসব সম্ভার প্যাকেজ তৈরি"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                ঈদ, বৈশাখ, বিয়ে ও কর্পোরেট উপহারের জন্য বিশেষ কম্বো প্যাক ও লাক্সারি বক্স কনফিগার করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/packages"
            className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold text-xs sm:text-sm transition-colors"
          >
            বাতিল করুন
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{editingId ? "প্যাকেজ আপডেট করুন" : "প্যাকেজ প্রকাশ করুন"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (2 Cols) + Live Hamper Preview Right (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Card 1: Package Basic Information */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Gift className="w-5 h-5 text-[#C48A4E]" />
              <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                প্যাকেজের মূল পরিচিতি ও উৎসব বিবরণ
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  প্যাকেজের রাজকীয় নাম (Package Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: শাহী সরা উপহার প্যাকেজ"
                  className="w-full px-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm font-bold text-[#351C1B] focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  উপশিরোনাম / উৎসব বার্তা (Subtitle)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="যেমন: বিয়ে, জন্মদিন ও পারিবারিক অনুষ্ঠানের জন্য রাজকীয় উপহার"
                  className="w-full px-4 py-2 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Occasion */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    উপলক্ষ / উৎসব (Festival / Occasion) *
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value as PackageOccasion)}
                    aria-label="উৎসব বা উপলক্ষ"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                  >
                    <option value="ঈদ উৎসব">ঈদ উৎসব (Eid Special)</option>
                    <option value="পহেলা বৈশাখ">পহেলা বৈশাখ (Boishakhi)</option>
                    <option value="বিয়ে ও পারিবারিক">বিয়ে ও পারিবারিক অনুষ্ঠান</option>
                    <option value="কর্পোরেট উপহার">কর্পোরেট উপহার (Corporate)</option>
                    <option value="পূজা ও উৎসব">পূজা ও উৎসব</option>
                    <option value="নিত্যদিনের উপহার">নিত্যদিনের উপহার</option>
                  </select>
                </div>

                {/* Badge text */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    হাইলাইট ব্যাজ (Badge Text)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="যেমন: সবচেয়ে জনপ্রিয় / উৎসব স্পেশাল"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Packaging Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  বক্স ও প্যাকেজিং ধরন (Packaging Style)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    aria-label="প্যাকেজিং ধরন"
                    className="w-full sm:w-1/2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden"
                  >
                    {PACKAGING_TYPES.map((type, i) => (
                      <option key={i} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    placeholder="অথবা কাস্টম প্যাকেজিং লিখুন..."
                    className="w-full sm:w-1/2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Pricing, Discount & Stock */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                মূল্য নির্ধারণ, অফার ছাড় ও ইনভেন্টরি
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  প্যাকেজ বিক্রয় মূল্য (টাকা) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-black text-[#351C1B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  আসল রেগুলার মূল্য (টাকা)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-500 line-through"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  মজুদ প্যাকেজ সংখ্যা (Stock)
                </label>
                <input
                  type="number"
                  value={availableStock}
                  onChange={(e) => setAvailableStock(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-stone-800"
                />
              </div>
            </div>

            {/* Quick Discount Percentages */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[#C48A4E]" /> দ্রুত ছাড় প্রয়োগ:
              </span>
              {QUICK_DISCOUNT_PERCENTAGES.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleApplyDiscountPercent(pct)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    discountPercent === pct
                      ? "bg-[#C48A4E] text-white shadow-xs"
                      : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {toBnDigits(pct)}% ছাড়
                </button>
              ))}
              {discountPercent > 0 && (
                <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  গ্রাহকের সাশ্রয়: ৳ {toBnDigits(originalPrice - price)} ({toBnDigits(discountPercent)}%)
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Included Products & Items Builder */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[#C48A4E]" />
                <div>
                  <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                    প্যাকেজে অন্তর্ভুক্ত আইটেমসমূহ
                  </h2>
                  <p className="text-xs text-stone-500">
                    বক্সের ভেতর কী কী খাবার বা উপহার সামগ্রী থাকবে তা নির্ধারণ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddComponent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#C48A4E] rounded-xl text-xs font-bold transition-colors border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" /> আইটেম যোগ করুন
              </button>
            </div>

            {/* Quick Catalog Picker */}
            {productsCatalogue.length > 0 && (
              <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  ক্যাটালগ থেকে এক ক্লিকে যুক্ত করুন:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {productsCatalogue.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleQuickAddProduct(prod)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-50 text-stone-800 hover:text-[#C48A4E] rounded-lg text-xs font-semibold border border-stone-200 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-[#C48A4E]" />
                      <span>{prod.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Components dynamic rows */}
            <div className="space-y-3">
              {components.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center text-xs font-bold shrink-0">
                    {toBnDigits(idx + 1)}
                  </div>

                  <input
                    type="text"
                    required
                    value={comp.name}
                    onChange={(e) => handleComponentChange(idx, "name", e.target.value)}
                    placeholder="আইটেমের নাম (যেমন: ১ কেজি বগুড়ার স্পেশাল সরার মিষ্টি দই)"
                    className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden"
                  />

                  <input
                    type="text"
                    value={comp.quantity}
                    onChange={(e) => handleComponentChange(idx, "quantity", e.target.value)}
                    placeholder="পরিমাণ"
                    className="w-24 sm:w-28 px-2 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden"
                  />

                  {components.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(idx)}
                      className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Additional Options */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#351C1B] text-base border-b border-stone-100 pb-2">
              অতিরিক্ত সেটিংস ও প্রদর্শন অপশন
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl border border-stone-200/80 bg-stone-50 cursor-pointer">
                <div>
                  <span className="font-bold text-stone-900 block">
                    হোমপেজের 'উপহার ও উৎসব সম্ভার' সেকশনে ফিচার্ড রাখুন
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    গ্রাহকরা সরাসরি ওয়েবসাইটের প্রচ্ছদে এই উপহারটি দেখতে পাবেন
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 accent-[#C48A4E]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-stone-200/80 bg-stone-50 cursor-pointer">
                <div>
                  <span className="font-bold text-stone-900 block">
                    গ্রিটিংস কার্ডে শুভেচ্ছা বার্তা লেখার সুবিধা চালু রাখুন
                  </span>
                  <span className="text-stone-500 text-[11px]">
                    অর্ডার দেওয়ার সময় গ্রাহক উপহারের সাথে প্রাপকের নাম ও শুভেচ্ছা লিখতে পারবেন
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={customGreetingAllowed}
                  onChange={(e) => setCustomGreetingAllowed(e.target.checked)}
                  className="w-5 h-5 accent-[#C48A4E]"
                />
              </label>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-bold text-stone-800">প্যাকেজ স্ট্যাটাস</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PackageStatus)}
                  aria-label="প্যাকেজ স্ট্যাটাস"
                  className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Draft">খসড়া (Draft)</option>
                  <option value="Sold Out">স্টক শেষ (Sold Out)</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Right Col: Image Upload & Live Customer Perspective Hamper Card Preview */}
        <div className="space-y-6">
          {/* Image Upload Box */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-4 h-4 text-[#C48A4E]" />
              <span>প্যাকেজ ফটো আপলোড</span>
            </h3>

            <div className="relative border-2 border-dashed border-stone-300 hover:border-[#C48A4E] rounded-2xl p-6 text-center bg-stone-50/50 hover:bg-amber-50/20 transition-all cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-[#C48A4E] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-stone-800">
                  গিফট বক্স ছবি আপলোড করুন
                </p>
                <p className="text-[11px] text-stone-400">
                  JPG, PNG অথবা WEBP (সর্বোচ্চ ৩ MB)
                </p>
                <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-[#C48A4E] text-[10px] font-bold rounded-full mt-1 border border-amber-200">
                  Cloudinary Ready
                </span>
              </div>
            </div>

            {/* Preset Images */}
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                বা প্রিসেট গিফট ছবি সিলেক্ট করুন:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_IMAGES.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                      image === preset.url
                        ? "border-[#C48A4E] shadow-sm scale-105"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Storefront Customer Hamper Card Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
              <span className="flex items-center gap-1.5 text-[#C48A4E]">
                <Eye className="w-3.5 h-3.5" />
                <span>গ্রাহক দৃষ্টিভঙ্গি (Storefront Live Preview)</span>
              </span>
              <span className="font-mono text-[10px] uppercase bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                Hamper Card
              </span>
            </div>

            {/* Exact replication of the luxury storefront card */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden space-y-4 p-5 hover:border-[#C48A4E]/60 transition-all">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100">
                <img
                  src={image}
                  alt={title || "উপহার প্যাকেজ"}
                  className="w-full h-full object-cover"
                />
                {badge && (
                  <span className="absolute top-3 left-3 bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {badge}
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {occasion}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-[#351C1B] text-lg leading-snug">
                  {title || "শাহী সরা উপহার প্যাকেজ"}
                </h3>
                <p className="text-xs text-stone-500 line-clamp-2">
                  {subtitle || "বিয়ে, জন্মদিন ও পারিবারিক অনুষ্ঠানের জন্য রাজকীয় উপহার"}
                </p>
                <div className="text-[11px] text-[#C48A4E] font-semibold bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                  🎁 {packagingType}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                <span className="font-bold text-stone-700 text-[11px]">প্যাকেজের ভেতরে যা থাকছে:</span>
                {components.slice(0, 4).map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-stone-600 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {c.name} {c.quantity ? `(${c.quantity})` : ""}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price & Mock Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400">অফার মূল্য</div>
                  <div className="text-xl font-black text-[#351C1B]">
                    ৳ {toBnDigits(price.toLocaleString("en-IN"))}
                    {originalPrice > price && (
                      <span className="text-xs text-stone-400 line-through ml-2 font-normal">
                        ৳ {toBnDigits(originalPrice.toLocaleString("en-IN"))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-white font-bold text-xs shadow-md">
                  অর্ডার করুন
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
