"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Upload,
  CloudUpload,
  Check,
  CheckCircle2,
  Package,
  Layers,
  Tag,
  Eye,
  Plus,
  Trash2,
  Search,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Info,
  X,
  ImageIcon,
  Zap,
  ShoppingBag,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import {
  StoredProduct,
  getStoredProducts,
  saveProduct,
  getProductByIdOrSlug,
} from "@/lib/productStorage";
import { getStoredCategories } from "@/lib/categoryStorage";
import { toBnDigits } from "@/lib/bangla";

const PRESET_PRODUCT_IMAGES = [
  { label: "বগুড়ার সরার দই", url: "/Product/doi.jpg" },
  { label: "মাটির কাপ দই", url: "/Product/mini_doi.png" },
  { label: "লাচ্ছা সেমাই", url: "/Product/laccha_semai.jpg" },
  { label: "আমের মিষ্টি দই", url: "/Product/mango.jpg" },
  { label: "ঘি ও লাড্ডু প্লেসহোল্ডার", url: "/Product/placeholder.svg" },
];

const PRESET_UNITS = [
  "১ কেজি মাটির সরা",
  "১.২ কেজি হাঁড়ি",
  "৮০০ গ্রাম সরা",
  "৫০০ গ্রাম হাঁড়ি",
  "৪টি কাপ বক্স",
  "১ কেজি প্রিমিয়াম বক্স",
  "৮০০ গ্রাম বক্স",
  "৫০০ গ্রাম জার",
  "৯০০ গ্রাম জার",
  "৫০০ গ্রাম প্যাকেট",
  "১ কেজি মেগা বক্স",
  "৫০০ গ্রাম কাঁচের বোতল",
];

const SUGGESTED_FEATURES = [
  "১০০% খাঁটি দেশি গাভীর ঘন দুধ থেকে তৈরি",
  "মাটির সরায় দীর্ঘক্ষণ প্রাকৃতিক প্রক্রিয়ায় জমানো",
  "কোনো কৃত্রিম চিনি বা ক্ষতিকর রাসায়নিক মুক্ত",
  "টাটকা ও স্বাস্থ্যকর মাটির পাত্রে ডেলিভারি",
  "খাঁটি গাওয়া ঘিয়ে ভাজা",
  "সুগন্ধি ও প্রিমিয়াম গোল্ডেন দানাদার টেক্সচার",
  "দৈনিক ফ্রেশ তৈরি",
];

const PRESET_BADGES = [
  "Hot Sale",
  "Best Seller",
  "Popular",
  "New",
  "Special",
  "Premium",
  "Traditional",
  "Healthy",
  "Organic",
];

export default function ProductEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") || searchParams.get("edit");

  // Form State
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("প্রিমিয়াম দই");
  const [price, setPrice] = useState<string>("500");
  const [originalPrice, setOriginalPrice] = useState<string>("600");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountPercentInput, setDiscountPercentInput] = useState<string>("17");
  const [unit, setUnit] = useState("১ কেজি মাটির সরা");
  const [stockStatus, setStockStatus] = useState<"In Stock" | "Out of Stock">("In Stock");
  const [stockQuantity, setStockQuantity] = useState<string>("50");
  const [badge, setBadge] = useState("Hot Sale");
  const [isFeatured, setIsFeatured] = useState(true);
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "১০০% খাঁটি দেশি গাভীর ঘন দুধ থেকে তৈরি",
    "মাটির সরায় দীর্ঘক্ষণ প্রাকৃতিক প্রক্রিয়ায় জমানো",
    "কোনো কৃত্রিম চিনি বা ক্ষতিকর রাসায়নিক মুক্ত",
  ]);
  const [newFeature, setNewFeature] = useState("");

  // Categories list for dropdown
  const [availableCategories, setAvailableCategories] = useState<{ id: string; nameBn: string; slug: string }[]>([]);

  // Image Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState("/Product/doi.jpg");
  const [imageSourceTab, setImageSourceTab] = useState<"upload" | "presets" | "url">("upload");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"general" | "images" | "details">("general");

  // Load categories and existing product (if editing)
  useEffect(() => {
    const cats = getStoredCategories();
    setAvailableCategories(cats.map((c) => ({ id: c.id, nameBn: c.nameBn, slug: c.slug })));

    if (editId) {
      const existing = getProductByIdOrSlug(editId);
      if (existing) {
        setName(existing.name);
        setNameEn(existing.nameEn);
        setSlug(existing.slug);
        setCategory(existing.category || "প্রিমিয়াম দই");
        setPrice(String(existing.price || ""));
        const origStr = existing.originalPrice ? String(existing.originalPrice) : "";
        setOriginalPrice(origStr);
        if (existing.originalPrice && existing.price && existing.originalPrice > existing.price) {
          const calculatedPct = Math.round(((existing.originalPrice - existing.price) / existing.originalPrice) * 100);
          setDiscountPercentInput(String(calculatedPct));
        } else {
          setDiscountPercentInput("0");
        }
        setUnit(existing.unit || "১ কেজি মাটির সরা");
        setStockStatus(existing.stockStatus || "In Stock");
        setImage(existing.image || "/Product/doi.jpg");
        setBadge(existing.badge || "Hot Sale");
        setIsFeatured(Boolean(existing.isFeatured));
        setDescription(existing.description || "");
        setFeatures(existing.features && existing.features.length > 0 ? existing.features : []);
      }
    }
  }, [editId]);

  // Calculations
  const numericPrice = parseFloat(price) || 0;
  const numericOriginal = parseFloat(originalPrice) || 0;
  const savings = Math.max(0, numericOriginal - numericPrice);
  const discountPercent = numericOriginal > numericPrice && numericOriginal > 0
    ? Math.round((savings / numericOriginal) * 100)
    : 0;

  // Reactive price & discount handlers
  const handleOriginalPriceChange = (val: string) => {
    setOriginalPrice(val);
    const numOrig = parseFloat(val) || 0;
    if (numOrig > 0 && discountType === "percentage") {
      const pct = parseFloat(discountPercentInput) || 0;
      if (pct > 0) {
        const newPrice = Math.round(numOrig * (1 - pct / 100));
        setPrice(String(newPrice));
      }
    } else if (numOrig > 0 && discountType === "fixed") {
      const numPrice = parseFloat(price) || 0;
      if (numOrig > numPrice && numPrice > 0) {
        const pct = Math.round(((numOrig - numPrice) / numOrig) * 100);
        setDiscountPercentInput(String(pct));
      }
    }
  };

  const handlePriceChange = (val: string) => {
    setPrice(val);
    const numPrice = parseFloat(val) || 0;
    const numOrig = parseFloat(originalPrice) || 0;
    if (numOrig > numPrice && numOrig > 0 && numPrice > 0) {
      const pct = Math.round(((numOrig - numPrice) / numOrig) * 100);
      setDiscountPercentInput(String(pct));
    } else {
      setDiscountPercentInput("0");
    }
  };

  const handleDiscountPercentChange = (val: string) => {
    setDiscountPercentInput(val);
    const pct = parseFloat(val) || 0;
    const numOrig = parseFloat(originalPrice) || 0;
    if (numOrig > 0) {
      if (pct > 0) {
        const newPrice = Math.round(numOrig * (1 - pct / 100));
        setPrice(String(newPrice));
      } else {
        setPrice(String(numOrig));
      }
    }
  };

  const applyQuickDiscount = (pct: number) => {
    setDiscountPercentInput(String(pct));
    setDiscountType("percentage");
    const numOrig = parseFloat(originalPrice) || 0;
    if (numOrig > 0) {
      const newPrice = Math.round(numOrig * (1 - pct / 100));
      setPrice(String(newPrice));
    }
  };

  // Auto-generate slug
  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    if (!editId) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      setSlug(generated);
    }
  };

  const handleNameBnChange = (val: string) => {
    setName(val);
    if (!nameEn && !editId && !slug) {
      setSlug(val.trim().replace(/\s+/g, "-"));
    }
  };

  // Image file handler
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("অনুগ্রহ করে একটি ছবি ফাইল নির্বাচন করুন (JPG, PNG, WebP)");
      return;
    }
    const sizeKb = Math.round(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    setUploadedFileName(file.name);
    setUploadedFileSize(sizeStr);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);

    /*
     * ── CLOUDINARY INTEGRATION HOOK ──────────────────────────────────
     * পরবর্তীতে ব্যাকএন্ড তৈরি করার সময় এই লজিকটি সক্রিয় করতে পারেন:
     * const formData = new FormData();
     * formData.append("file", file);
     * formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "doibilash_preset");
     * const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
     *   method: "POST",
     *   body: formData,
     * });
     * const data = await res.json();
     * setImage(data.secure_url);
     * ────────────────────────────────────────────────────────────────
     */
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // Features
  const addFeature = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setNewFeature("");
    }
  };

  const removeFeature = (text: string) => {
    setFeatures((prev) => prev.filter((f) => f !== text));
  };

  // Save product
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "পণ্যের বাংলা নাম প্রদান করুন";
    if (!price || numericPrice <= 0) errors.price = "পণ্যের সঠিক মূল্য প্রদান করুন";
    if (!slug.trim()) errors.slug = "পণ্যের URL Slug প্রদান করুন";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const productToSave: StoredProduct = {
      id: editId || `PROD-${Date.now().toString().slice(-4)}`,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      category: category,
      price: numericPrice,
      originalPrice: numericOriginal > 0 ? numericOriginal : undefined,
      unit: unit.trim() || "১ কেজি মাটির সরা",
      stockStatus: stockStatus,
      image: image || "/Product/doi.jpg",
      description: description.trim() || `${name.trim()} - বগুড়ার আদি ও খাঁটি স্বাদের সেরা পণ্য।`,
      features: features,
      badge: badge || undefined,
      isFeatured: isFeatured,
      rating: 5,
      reviewsCount: 120,
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveProduct(productToSave);

    setToastMessage(editId ? "পণ্যটি সফলভাবে আপডেট হয়েছে!" : "নতুন পণ্য সফলভাবে তালিকাভুক্ত হয়েছে!");
    setShowToast(true);

    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/products");
    }, 1200);
  };

  return (
    <div className="font-bengali min-h-screen text-doibrand-dark pb-20">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-header-fade-up bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-doibrand-gold/40">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">{toastMessage}</p>
            <p className="text-xs text-gray-400">পণ্য তালিকায় রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        </div>
      )}

      {/* ── 1. Breadcrumbs & Top Header ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 -mx-6 -mt-6 p-6 mb-6 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/admin" className="hover:text-doibrand-gold transition-colors">
              অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/products" className="hover:text-doibrand-gold transition-colors">
              পণ্য তালিকা
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">
              {editId ? "পণ্য সম্পাদনা" : "নতুন পণ্য যুক্তকরণ"}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Link
                href="/admin/products"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-doibrand-dark transition-colors shadow-2xs"
                title="পণ্য তালিকায় ফিরুন"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
                    {editId ? "পণ্য তথ্য পরিবর্তন করুন" : "নতুন পণ্য যুক্ত করুন"}
                  </h1>
                  {stockStatus === "In Stock" ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      ইন স্টক
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      স্টক শেষ
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  পাবলিক স্টোর ও Product Details পেজের সাথে সামঞ্জস্য রেখে পণ্যের ছবি, মূল্য ও বৈশিষ্ট্য নির্ধারণ করুন।
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/admin/products"
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 text-stone-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                বাতিল
              </Link>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-doibrand-gold" />
                <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট সংরক্ষণ করুন" : "পণ্য প্রকাশ করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Split Two-Column Grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT: Live Customer Product Detail Preview (5 Cols) ────────── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-doibrand-dark uppercase tracking-wider">
                  গ্রাহক দর্শন প্রিভিউ (Product Live Preview)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full font-sans">
                পণ্য পেজ ভিউ
              </span>
            </div>

            {/* Golden luxury container inspired by ProductDetailView */}
            <div className="relative rounded-[28px] p-1.5 bg-linear-to-br from-[#F3DDB8] via-white to-[#EFCF9E] shadow-[0_20px_50px_-25px_rgba(169,94,53,0.5)]">
              <div className="relative aspect-square w-full overflow-hidden rounded-[24px] bg-[#F5EDE3]">
                <Image
                  src={image || "/Product/doi.jpg"}
                  alt={name || "পণ্য ছবি"}
                  fill
                  unoptimized={image.startsWith("data:") || image.startsWith("blob:")}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-[#D9534F] to-doibrand-accent px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {toBnDigits(discountPercent)}% ছাড়
                  </span>
                )}

                {/* Custom Badge or Stock Badge */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                  {badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-white shadow-sm font-sans">
                      <Star className="w-3 h-3 fill-current" />
                      {badge}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                      stockStatus === "In Stock"
                        ? "bg-emerald-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {stockStatus === "In Stock" ? "স্টকে আছে" : "স্টক শেষ"}
                  </span>
                </div>

                {/* Bottom Overlay Pill with Unit */}
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-xs font-semibold text-white">
                    <Package className="w-3.5 h-3.5 text-doibrand-gold" />
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Meta Section in Preview */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-500 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 font-semibold text-doibrand-accent">
                  {category}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-[11px] text-stone-400 font-sans ml-1">(১২০)</span>
                </div>
              </div>

              <h2 className="text-xl font-bold font-bengali text-doibrand-dark leading-tight">
                {name || "বগুড়ার স্পেশাল সরার মিষ্টি দই"}
              </h2>
              <p className="text-xs text-stone-400 font-sans">
                {nameEn || "Special Bogura Shorar Doi"}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-2.5 pt-1">
                <span className="text-2xl font-bold text-doibrand-accent font-sans">
                  ৳ {numericPrice.toLocaleString("en-US")}
                </span>
                {numericOriginal > numericPrice && (
                  <span className="text-sm text-stone-400 line-through font-sans">
                    ৳ {numericOriginal.toLocaleString("en-US")}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    ৳ {savings} সাশ্রয়
                  </span>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed pt-1 border-t border-stone-100">
                {description || "এখানে পণ্যের বিবরণ প্রদর্শিত হবে। বগুড়ার খাঁটি দুধ থেকে তৈরি সেরা স্বাদের দই।"}
              </p>

              {/* Features List Preview */}
              <div className="pt-2 space-y-1.5">
                {features.slice(0, 3).map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Mock Buy Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100">
                <div className="py-2.5 rounded-xl border border-doibrand-gold text-doibrand-dark text-xs font-bold text-center flex items-center justify-center gap-1 bg-amber-50/50">
                  <ShoppingCart className="w-3.5 h-3.5 text-doibrand-gold" />
                  <span>ব্যাগে যোগ করুন</span>
                </div>
                <div className="py-2.5 rounded-xl bg-doibrand-dark text-white text-xs font-bold text-center flex items-center justify-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>অর্ডার করুন</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Fields & Settings (7 Cols) ───────────────────── */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-stone-100/80 p-1.5 rounded-2xl border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "general"
                  ? "bg-white text-doibrand-dark shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Layers className="w-4 h-4 text-doibrand-gold" />
              <span>১. পরিচিতি ও মূল্য</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("images")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "images"
                  ? "bg-white text-doibrand-dark shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Upload className="w-4 h-4 text-doibrand-gold" />
              <span>২. ছবি আপলোড</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "details"
                  ? "bg-white text-doibrand-dark shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Tag className="w-4 h-4 text-doibrand-gold" />
              <span>৩. বৈশিষ্ট্য ও প্রকাশ</span>
            </button>
          </div>

          {/* ── TAB 1: General Info & Pricing ──────────────────────────── */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-header-fade-up">
              {/* Basic Information Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-doibrand-dark font-sans flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    পণ্যের নাম ও পরিচিতি
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    বাংলা ও ইংরেজি নাম প্রদান করুন যা ক্যাটালগে প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Bangla */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      পণ্যের নাম (বাংলা) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameBnChange(e.target.value)}
                      placeholder="যেমন: বগুড়ার স্পেশাল সরার মিষ্টি দই"
                      className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-bengali ${
                        formErrors.name ? "border-red-400 bg-red-50/20" : "border-stone-200 bg-white"
                      }`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Name English */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Product Name (English)
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => handleNameEnChange(e.target.value)}
                      placeholder="e.g. Special Bogura Shorar Doi"
                      className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Category & Unit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      ক্যাটাগরি নির্বাচন করুন
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
                    >
                      {availableCategories.length > 0 ? (
                        availableCategories.map((c) => (
                          <option key={c.id} value={c.nameBn}>
                            {c.nameBn}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="প্রিমিয়াম দই">প্রিমিয়াম দই</option>
                          <option value="খাঁটি গাওয়া ঘি">খাঁটি গাওয়া ঘি</option>
                          <option value="লাড্ডু">লাড্ডু</option>
                          <option value="লাচ্ছা সেমাই">লাচ্ছা সেমাই</option>
                          <option value="ঐতিহ্যবাহী মিষ্টি">ঐতিহ্যবাহী মিষ্টি</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      প্যাকেজের পরিমাপ / Unit
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="যেমন: ১ কেজি মাটির সরা"
                        className="flex-1 rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
                      />
                    </div>
                  </div>
                </div>

                {/* Slug */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    URL Slug (পণ্য লিংক) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-doibrand-gold/40">
                    <span className="px-3 text-xs text-stone-400 font-mono select-none">/products/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      placeholder="bogra-special-doi"
                      className="w-full p-2.5 text-xs font-mono bg-transparent focus:outline-none text-stone-800"
                    />
                  </div>
                  {formErrors.slug && (
                    <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.slug}
                    </p>
                  )}
                </div>
              </div>

              {/* Pricing & Stock Management Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-doibrand-dark font-sans flex items-center justify-center text-xs font-bold">
                        B
                      </span>
                      মূল্য ও অফার ডিসকাউন্ট (% বা নির্দিষ্ট টাকা)
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      নিয়মিত মূল্য, ম্যানুয়াল অফার মূল্য অথবা শতকরা (%) ছাড় নির্বাচন করুন।
                    </p>
                  </div>

                  {discountPercent > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-linear-to-r from-red-500 to-amber-600 text-white text-[11px] font-extrabold shadow-sm font-sans self-start sm:self-auto">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      {discountPercent}% অফার সক্রিয়
                    </span>
                  )}
                </div>

                {/* Regular Price & Discount Method */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Regular / Original Price */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      নিয়মিত মূল্য (Regular Price / MRP) (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">৳</span>
                      <input
                        type="number"
                        min="0"
                        value={originalPrice}
                        onChange={(e) => handleOriginalPriceChange(e.target.value)}
                        placeholder="যেমন: 600"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 text-sm font-bold font-sans text-stone-800 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1">
                      পণ্য পেজে এই মূল্যের ওপর কাটা দাগ (strikethrough) দেখানো হবে।
                    </p>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      ছাড়ের ধরন (Discount Method)
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                      <button
                        type="button"
                        onClick={() => setDiscountType("percentage")}
                        className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          discountType === "percentage"
                            ? "bg-white text-doibrand-dark shadow-xs border border-stone-200/60"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        <span>শতাংশে ছাড় (%)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType("fixed")}
                        className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          discountType === "fixed"
                            ? "bg-white text-doibrand-dark shadow-xs border border-stone-200/60"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        <span>ম্যানুয়াল বিক্রয় মূল্য (৳)</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {discountType === "percentage"
                        ? "শতাংশ (%) দিলে বিক্রয় মূল্য সাথে সাথে তৈরি হবে।"
                        : "ম্যানুয়ালি নির্দিষ্ট বিক্রয় মূল্য (৳) টাইপ করুন।"}
                    </p>
                  </div>
                </div>

                {/* Interactive Offer Inputs & Quick Chips */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Percentage Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          ছাড়ের শতকরা হার (% Discount)
                        </label>
                        {discountType === "percentage" && (
                          <span className="text-[10px] font-bold text-doibrand-accent bg-amber-100 px-2 py-0.5 rounded-full">
                            সক্রিয় মোড
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={discountPercentInput}
                          onChange={(e) => handleDiscountPercentChange(e.target.value)}
                          placeholder="যেমন: 10 বা 20"
                          className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-200 bg-white text-sm font-bold font-sans text-stone-800 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                        />
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">%</span>
                      </div>
                    </div>

                    {/* Final Selling Price Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-stone-800">
                          চূড়ান্ত বিক্রয় মূল্য (Final Selling Price) (৳) <span className="text-red-500">*</span>
                        </label>
                        {discountType === "fixed" && (
                          <span className="text-[10px] font-bold text-doibrand-accent bg-amber-100 px-2 py-0.5 rounded-full">
                            সক্রিয় মোড
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">৳</span>
                        <input
                          type="number"
                          min="0"
                          value={price}
                          onChange={(e) => handlePriceChange(e.target.value)}
                          placeholder="যেমন: 500"
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm font-bold font-sans text-doibrand-accent focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quick Percentage Preset Buttons */}
                  <div>
                    <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                      এক ক্লিকে দ্রুত শতাংশ (%) অফার দিন:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => {
                        const isActive = parseFloat(discountPercentInput) === pct;
                        return (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => applyQuickDiscount(pct)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
                              isActive
                                ? "bg-doibrand-accent text-white shadow-xs scale-105"
                                : "bg-white text-stone-700 border border-stone-200 hover:border-doibrand-gold hover:bg-amber-100/50"
                            }`}
                          >
                            {pct}% ছাড়
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          setDiscountPercentInput("0");
                          setPrice(originalPrice);
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-500 hover:bg-stone-100 cursor-pointer"
                      >
                        অফার বাতিল (0%)
                      </button>
                    </div>
                  </div>

                  {/* Live Calculation Summary Breakdown */}
                  {numericOriginal > 0 && (
                    <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-stone-600">
                          নিয়মিত: <strong className="font-sans text-stone-800">৳{numericOriginal}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-stone-600">
                          ছাড়: <strong className="font-sans text-amber-800">{discountPercent}%</strong>
                        </span>
                        <span>•</span>
                        <span className="text-stone-600">
                          সাশ্রয়: <strong className="font-sans text-emerald-700">৳{savings}</strong>
                        </span>
                      </div>
                      <div className="bg-emerald-100/90 text-emerald-800 px-3 py-1 rounded-full font-bold">
                        গ্রাহক মূল্য: ৳{numericPrice.toLocaleString("en-US")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Status & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      স্টক স্ট্যাটাস (Stock Status)
                    </label>
                    <select
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value as "In Stock" | "Out of Stock")}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-semibold"
                    >
                      <option value="In Stock">স্টকে আছে (In Stock)</option>
                      <option value="Out of Stock">স্টক শেষ (Out of Stock)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      স্টক পরিমাণ (Quantity)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="50"
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                    />
                  </div>
                </div>
              </div>

              {/* Next step button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("images")}
                  className="px-6 py-2.5 rounded-xl bg-doibrand-dark text-white font-bold text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span>পরবর্তী: ছবি আপলোড</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 2: Images & Upload ──────────────────────────────────── */}
          {activeTab === "images" && (
            <div className="space-y-6 animate-header-fade-up">
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                      <Upload className="w-5 h-5 text-doibrand-gold" />
                      পণ্য ছবি (Product Image & Media)
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      ডিভাইস থেকে ছবি আপলোড করুন, প্রস্তুত প্রিসেট ছবি ব্যবহার করুন অথবা ইমেজ লিঙ্ক দিন।
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold self-start sm:self-auto font-sans">
                    <CloudUpload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cloudinary Ready</span>
                  </div>
                </div>

                {/* Sub-tab selection */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80">
                  <button
                    type="button"
                    onClick={() => setImageSourceTab("upload")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageSourceTab === "upload"
                        ? "bg-white text-doibrand-dark shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-doibrand-gold" />
                    <span>ছবি আপলোড (Upload)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab("presets")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageSourceTab === "presets"
                        ? "bg-white text-doibrand-dark shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-doibrand-gold" />
                    <span>প্রিসেট ছবি (Presets)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab("url")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      imageSourceTab === "url"
                        ? "bg-white text-doibrand-dark shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-doibrand-gold" />
                    <span>ইমেজ লিংক (URL)</span>
                  </button>
                </div>

                {/* Sub-tab 1: Device Upload (Drag & Drop) */}
                {imageSourceTab === "upload" && (
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                        isDragging
                          ? "border-doibrand-accent bg-amber-50/70 scale-101"
                          : "border-stone-300 hover:border-doibrand-gold bg-stone-50/50 hover:bg-amber-50/30"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-doibrand-dark flex items-center justify-center shadow-2xs">
                          <CloudUpload className="w-6 h-6 text-doibrand-accent" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-doibrand-dark">
                            ক্লিক করে পণ্যের ছবি আপলোড করুন অথবা ফাইল টেনে এনে ড্রপ করুন
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            PNG, JPG, WebP সমর্থিত (সর্বোচ্চ ৫ মেগাবাইট)
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-200/70 text-[10px] font-semibold text-stone-700 font-sans mt-1">
                          ফ্রন্টএন্ডে রিয়েল-টাইম প্রিভিউ + পরবর্তীতে Cloudinary কানেক্টেড
                        </span>
                      </div>
                    </div>

                    {uploadedFileName && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-center justify-between gap-3 animate-header-fade-up">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-stone-100 shrink-0 border border-stone-200">
                            <Image
                              src={image}
                              alt="Uploaded preview"
                              fill
                              unoptimized={image.startsWith("data:") || image.startsWith("blob:")}
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-800 truncate">{uploadedFileName}</p>
                            <div className="flex items-center gap-2 text-[10px] text-stone-500 font-sans mt-0.5">
                              <span>{uploadedFileSize}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Check className="w-3 h-3" /> ফ্রন্টএন্ডে প্রস্তুত
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-700 hover:bg-white transition-colors cursor-pointer"
                          >
                            পরিবর্তন
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImage("/Product/doi.jpg");
                              setUploadedFileName("");
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-tab 2: Presets */}
                {imageSourceTab === "presets" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-700">
                      দই বিলাসের রেডিমেড হাই-কোয়ালিটি পণ্য ছবি:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {PRESET_PRODUCT_IMAGES.map((preset, index) => {
                        const isSelected = image === preset.url;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setImage(preset.url);
                              setUploadedFileName("");
                            }}
                            className={`relative rounded-xl overflow-hidden border-2 p-1 text-left transition-all cursor-pointer ${
                              isSelected
                                ? "border-doibrand-accent ring-2 ring-doibrand-gold/40 scale-102 bg-amber-50/40"
                                : "border-stone-200 hover:border-stone-400 bg-white"
                            }`}
                          >
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100">
                              <Image
                                src={preset.url}
                                alt={preset.label}
                                fill
                                className="object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-doibrand-accent/20 flex items-center justify-center">
                                  <span className="w-5 h-5 rounded-full bg-doibrand-accent text-white flex items-center justify-center shadow-md">
                                    <Check className="w-3 h-3" />
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] font-semibold text-stone-700 text-center mt-1 truncate">
                              {preset.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: URL Input */}
                {imageSourceTab === "url" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-800">
                      ইমেজ লিংক (Cloudinary URL বা ওয়েব পাথ)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => {
                          setImage(e.target.value);
                          setUploadedFileName("");
                        }}
                        placeholder="https://res.cloudinary.com/... অথবা /Product/doi.jpg"
                        className="flex-1 rounded-xl border border-stone-200 p-3 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                      />
                      <button
                        type="button"
                        onClick={() => setImage("/Product/doi.jpg")}
                        className="px-3.5 py-3 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                      >
                        রিসেট
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Back & Next */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  ← সাধারণ তথ্যে ফিরুন
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="px-6 py-2.5 rounded-xl bg-doibrand-dark text-white font-bold text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span>পরবর্তী: বৈশিষ্ট্য ও প্রকাশ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: Features & Publishing Settings ──────────────────── */}
          {activeTab === "details" && (
            <div className="space-y-6 animate-header-fade-up">
              {/* Product Features / Highlights */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-doibrand-gold" />
                    প্রধান গুণাবলি ও বৈশিষ্ট্য (Product Highlights)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Product Details পেজের মতো পণ্যের বিশেষ গুণাবলি বুলেট পয়েন্ট আকারে যোগ করুন।
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {features.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-doibrand-dark shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(feat)}
                        className="text-stone-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Feature */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature(newFeature);
                      }
                    }}
                    placeholder="যেমন: ১০০% খাঁটি দেশি গাভীর ঘন দুধ..."
                    className="flex-1 rounded-xl border border-stone-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                  />
                  <button
                    type="button"
                    onClick={() => addFeature(newFeature)}
                    className="px-4 py-2.5 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>

                {/* Suggested features */}
                <div className="pt-2">
                  <span className="text-[11px] text-stone-400 block mb-1.5 font-semibold">
                    সাজেস্টেড বৈশিষ্ট্য (ক্লিক করে যোগ করুন):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_FEATURES.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addFeature(sug)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-[11px] text-stone-600 hover:bg-amber-50 hover:text-doibrand-dark transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h3 className="text-base font-bold text-doibrand-dark">
                    পণ্যের বিস্তারিত বিবরণ (Full Description)
                  </h3>
                  <span className="text-[10px] text-stone-400 font-sans">
                    {description.length} অক্ষর
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="পণ্যটি তৈরির প্রক্রিয়া, উপকরণ ও বিশেষত্ব সম্পর্কে বিস্তারিত লিখুন..."
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali leading-relaxed"
                />
              </div>

              {/* Badges & Featured Toggle */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-doibrand-dark pb-2 border-b border-stone-100">
                  ব্যাজ ও হোমপেজ প্রদর্শন
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Badge */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      পণ্যের স্পেশাল ব্যাজ
                    </label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white font-sans font-semibold focus:outline-none"
                    >
                      <option value="">কোনো ব্যাজ নেই</option>
                      {PRESET_BADGES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        হোমপেজ ফিচার্ড পণ্য
                      </span>
                      <span className="text-[11px] text-stone-500">
                        টপ সেকশনে হাইলাইট করুন
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-doibrand-accent"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Link
                  href="/admin/products"
                  className="px-5 py-3 rounded-xl border border-stone-200 font-semibold text-xs text-stone-600 hover:bg-stone-50"
                >
                  বাতিল করুন
                </Link>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-doibrand-gold" />
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট সংরক্ষণ করুন" : "পণ্য সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
