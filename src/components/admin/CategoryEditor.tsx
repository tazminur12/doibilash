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
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Info,
  X,
  ImageIcon,
  FileImage,
  RefreshCw,
} from "lucide-react";
import {
  ALL_AVAILABLE_PRODUCTS,
  AvailableProduct,
  StoredCategory,
  getStoredCategories,
  saveCategory,
  getCategoryByIdOrSlug,
} from "@/lib/categoryStorage";
import { toBnDigits } from "@/lib/bangla";

const PRESET_IMAGES = [
  { label: "বগুড়ার সরার দই", url: "/Product/doi.jpg" },
  { label: "লাচ্ছা সেমাই", url: "/Product/laccha_semai.jpg" },
  { label: "মাটির কাপ দই", url: "/Product/mini_doi.png" },
  { label: "আমের মিষ্টি দই", url: "/Product/mango.jpg" },
  { label: "ঘি ও লাড্ডু প্লেসহোল্ডার", url: "/Product/placeholder.svg" },
];

const SUGGESTED_HIGHLIGHTS = [
  "মাটির সরায় তৈরি",
  "১০০% খাঁটি গরুর দুধ",
  "প্রিজারভেটিভমুক্ত",
  "খাঁটি গাওয়া ঘিয়ে ভাজা",
  "বগুড়ার ঐতিহ্যবাহী স্বাদ",
  "দৈনিক ফ্রেশ তৈরি",
  "স্বাস্থ্যকর ও পুষ্টিকর",
];

const SUGGESTED_TAGS = [
  "মিষ্টি দই",
  "টক দই",
  "ক্ষীরসা দই",
  "চিনিমুক্ত",
  "মতিচুর",
  "ড্রাই ফ্রুটস",
  "ঈদ স্পেশাল",
  "গিফট বক্স",
];

export default function CategoryEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") || searchParams.get("edit");

  // Form State
  const [nameBn, setNameBn] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/Product/doi.jpg");
  const [selectedProductSlugs, setSelectedProductSlugs] = useState<string[]>([]);
  const [manualCountOverride, setManualCountOverride] = useState<string>("");
  const [isManualCount, setIsManualCount] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([
    "মাটির সরায় তৈরি",
    "১০০% খাঁটি গরুর দুধ",
    "প্রিজারভেটিভমুক্ত",
  ]);
  const [newHighlight, setNewHighlight] = useState("");
  const [tags, setTags] = useState<string[]>(["মিষ্টি দই", "ক্ষীরসা"]);
  const [newTag, setNewTag] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<"active" | "draft">("active");

  // Image Upload & Source State (Ready for Cloudinary Backend)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageSourceTab, setImageSourceTab] = useState<"upload" | "presets" | "url">("upload");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileSize, setUploadedFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Filter & Search Products
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"general" | "products" | "features">("general");

  // Load existing data if editing
  useEffect(() => {
    if (editId) {
      const existing = getCategoryByIdOrSlug(editId);
      if (existing) {
        setNameBn(existing.nameBn);
        setNameEn(existing.name);
        setSlug(existing.slug);
        setSubtitle(existing.subtitle || "");
        setDescription(existing.description || "");
        setImage(existing.image || "/Product/doi.jpg");
        setSelectedProductSlugs(existing.productSlugs || []);
        setHighlights(existing.highlights && existing.highlights.length > 0 ? existing.highlights : []);
        setTags(existing.tags && existing.tags.length > 0 ? existing.tags : []);
        setIsFeatured(Boolean(existing.isFeatured));
        setStatus(existing.status || "active");
        if (existing.totalProducts !== existing.productSlugs?.length) {
          setIsManualCount(true);
          setManualCountOverride(String(existing.totalProducts));
        }
      }
    }
  }, [editId]);

  // Image File Processing (Front-end preview + Cloudinary integration ready)
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

    // Read image locally for instantaneous front-end preview & state binding
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
     * পরবর্তীতে ব্যাকএন্ড যুক্ত করার সময় নিচের লজিকটি সচল করুন:
     *
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
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveUploadedImage = () => {
    setImage("/Product/doi.jpg");
    setUploadedFileName("");
    setUploadedFileSize("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto-generate slug from English or Bengali name
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
    setNameBn(val);
    if (!nameEn && !editId) {
      const fallback = val.trim().replace(/\s+/g, "-");
      if (!slug) setSlug(fallback);
    }
  };

  // Toggle Product Selection
  const toggleProduct = (prodSlug: string) => {
    setSelectedProductSlugs((prev) =>
      prev.includes(prodSlug) ? prev.filter((s) => s !== prodSlug) : [...prev, prodSlug]
    );
  };

  // Select all / Deselect all
  const selectAllProducts = () => {
    const allFiltered = filteredProducts.map((p) => p.slug);
    setSelectedProductSlugs((prev) => Array.from(new Set([...prev, ...allFiltered])));
  };

  const clearAllSelectedProducts = () => {
    setSelectedProductSlugs([]);
  };

  // Computed total products count
  const calculatedCount = selectedProductSlugs.length;
  const effectiveTotalProducts = isManualCount && manualCountOverride !== ""
    ? Math.max(0, parseInt(manualCountOverride, 10) || 0)
    : calculatedCount;

  // Filtered available products
  const filteredProducts = useMemo(() => {
    return ALL_AVAILABLE_PRODUCTS.filter((prod) => {
      const matchesSearch =
        prod.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        prod.englishTitle.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCategory =
        productCategoryFilter === "all" || prod.categorySlug === productCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [productSearch, productCategoryFilter]);

  // Selected product details for preview
  const selectedProductItems = useMemo(() => {
    return ALL_AVAILABLE_PRODUCTS.filter((p) => selectedProductSlugs.includes(p.slug));
  }, [selectedProductSlugs]);

  // Highlights handlers
  const addHighlight = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !highlights.includes(trimmed)) {
      setHighlights((prev) => [...prev, trimmed]);
      setNewHighlight("");
    }
  };

  const removeHighlight = (text: string) => {
    setHighlights((prev) => prev.filter((h) => h !== text));
  };

  // Tags handlers
  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setNewTag("");
    }
  };

  const removeTag = (text: string) => {
    setTags((prev) => prev.filter((t) => t !== text));
  };

  // Save Category Action
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: Record<string, string> = {};

    if (!nameBn.trim()) {
      errors.nameBn = "ক্যাটাগরির বাংলা নাম প্রদান করুন";
    }
    if (!slug.trim()) {
      errors.slug = "ক্যাটাগরির URL Slug প্রদান করুন";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const categoryToSave: StoredCategory = {
      id: editId || `cat-${Date.now()}`,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      name: nameEn.trim() || nameBn.trim(),
      nameBn: nameBn.trim(),
      subtitle: subtitle.trim() || "ঐতিহ্যবাহী সেরা মানের পণ্য সম্ভার",
      description: description.trim() || `${nameBn.trim()} সম্পর্কিত সকল সেরা পণ্য।`,
      image: image.trim() || "/Product/doi.jpg",
      totalProducts: effectiveTotalProducts,
      highlights: highlights,
      tags: tags,
      productSlugs: selectedProductSlugs,
      isFeatured: isFeatured,
      status: status,
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveCategory(categoryToSave);

    setToastMessage(editId ? "ক্যাটাগরি সফলভাবে আপডেট হয়েছে!" : "নতুন ক্যাটাগরি সফলভাবে তৈরি হয়েছে!");
    setShowToast(true);

    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/categories");
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
            <p className="text-xs text-gray-400">ক্যাটাগরি তালিকায় রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        </div>
      )}

      {/* ── 1. Top Breadcrumbs & Page Header ───────────────────────────── */}
      <div className="bg-white border-b border-gray-100 -mx-6 -mt-6 p-6 mb-6 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/admin" className="hover:text-doibrand-gold transition-colors">
              অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/categories" className="hover:text-doibrand-gold transition-colors">
              ক্যাটাগরি তালিকা
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">
              {editId ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি তৈরি"}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Link
                href="/admin/categories"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-doibrand-dark transition-colors shadow-2xs"
                title="তালিকায় ফিরে যান"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
                    {editId ? "ক্যাটাগরি তথ্য পরিবর্তন করুন" : "নতুন ক্যাটাগরি যুক্ত করুন"}
                  </h1>
                  {status === "active" ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      সক্রিয়
                    </span>
                  ) : (
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                      খসড়া (Draft)
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  পাবলিক স্টোরের লুক ও ফিল বজায় রেখে নাম, ছবি, সংযুক্ত পণ্য এবং পণ্যের সংখ্যা নির্ধারণ করুন।
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/admin/categories"
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
                <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট সংরক্ষণ করুন" : "ক্যাটাগরি প্রকাশ করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Main Two-Column Split Grid ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT: Live Customer View Preview (5 Cols) ─────────────────── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 order-2 lg:order-1">
          {/* Card Frame */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-md">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-doibrand-dark uppercase tracking-wider">
                  গ্রাহক দর্শন প্রিভিউ (Live Preview)
                </h3>
              </div>
              <span className="text-[11px] text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full font-sans">
                পাবলিক স্টোর ভিউ
              </span>
            </div>

            {/* Golden luxury container inspired by ProductDetailView */}
            <div className="relative rounded-[28px] p-1.5 bg-linear-to-br from-[#F3DDB8] via-white to-[#EFCF9E] shadow-[0_20px_50px_-25px_rgba(169,94,53,0.5)]">
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-[24px] bg-[#F5EDE3]">
                <Image
                  src={image || "/Product/doi.jpg"}
                  alt={nameBn || "ক্যাটাগরি ছবি"}
                  fill
                  unoptimized={image?.startsWith("data:") || image?.startsWith("blob:")}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {isFeatured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-doibrand-accent px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      ফিচার্ড ক্যাটাগরি
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-1 text-[10px] font-medium text-white">
                    <Package className="w-3 h-3 text-doibrand-gold" />
                    {toBnDigits(effectiveTotalProducts)} টি পণ্য উপলব্ধ
                  </span>
                </div>

                {/* Bottom Gradient overlay with Title */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                  <h2 className="text-xl sm:text-2xl font-bold font-bengali leading-tight drop-shadow-sm">
                    {nameBn || "ক্যাটাগরির নাম"}
                  </h2>
                  <p className="text-xs text-amber-200/90 font-sans mt-0.5">
                    {nameEn || "Category Name English"}
                  </p>
                </div>
              </div>
            </div>

            {/* Subtitle & Description in Preview */}
            <div className="mt-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-2">
              <p className="text-xs font-semibold text-doibrand-accent">
                {subtitle || "ঐতিহ্যবাহী বগুড়ার আদি ও খাঁটি স্বাদের মাটির সরার সেরা দই"}
              </p>
              <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                {description || "এখানে ক্যাটাগরির বিস্তারিত বিবরণ প্রদর্শিত হবে যা গ্রাহকরা দেখতে পাবেন।"}
              </p>
            </div>

            {/* Assurances / Highlights Row */}
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              {highlights.slice(0, 4).map((h, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px] text-stone-700 font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-doibrand-gold shrink-0" />
                  <span className="truncate">{h}</span>
                </div>
              ))}
            </div>

            {/* Mini Product Gallery for Selected Products */}
            <div className="mt-5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-doibrand-dark flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-doibrand-accent" />
                  সংযুক্ত পণ্য তালিকা ({toBnDigits(selectedProductItems.length)} টি)
                </span>
                <span className="text-[10px] text-stone-500 font-sans">
                  /{slug || "category-slug"}
                </span>
              </div>

              {selectedProductItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-stone-200 text-center text-xs text-stone-400">
                  এখনো কোনো পণ্য নির্বাচিত হয়নি। ডানের প্যানেল থেকে পণ্য সিলেক্ট করুন।
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {selectedProductItems.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white border border-stone-200/80 shadow-2xs hover:border-doibrand-gold transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-stone-100 shrink-0">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          unoptimized={prod.image?.startsWith("data:") || prod.image?.startsWith("blob:")}
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-stone-800 truncate">{prod.title}</p>
                        <p className="text-[10px] font-semibold text-doibrand-accent font-sans">
                          ৳ {prod.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form Fields & Configuration (7 Cols) ──────────────── */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          {/* Navigation Tabs for Easy Section Browsing */}
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
              <span>১. মূল তথ্য ও ছবি</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "products"
                  ? "bg-white text-doibrand-dark shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Package className="w-4 h-4 text-doibrand-gold" />
              <span>২. পণ্য নির্বাচন ({toBnDigits(selectedProductSlugs.length)})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("features")}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "features"
                  ? "bg-white text-doibrand-dark shadow-sm"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Tag className="w-4 h-4 text-doibrand-gold" />
              <span>৩. বৈশিষ্ট্য ও সেটিংস</span>
            </button>
          </div>

          {/* ── TAB 1: General Info & Image ────────────────────────────── */}
          {activeTab === "general" && (
            <div className="space-y-6 animate-header-fade-up">
              {/* Category Name Section */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3">
                  <h2 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-100 text-doibrand-dark font-sans flex items-center justify-center text-xs font-bold">
                      A
                    </span>
                    ক্যাটাগরির নাম ও পরিচিতি
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    বাংলা এবং ইংরেজি নাম প্রবেশ করান, যা মেনুবার ও হেডারে প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category Name (Bangla) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      ক্যাটাগরির নাম (বাংলা) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nameBn}
                      onChange={(e) => handleNameBnChange(e.target.value)}
                      placeholder="যেমন: প্রিমিয়াম দই, ঐতিহ্যবাহী লাড্ডু"
                      className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-bengali ${
                        formErrors.nameBn ? "border-red-400 bg-red-50/20" : "border-stone-200 bg-white"
                      }`}
                    />
                    {formErrors.nameBn && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.nameBn}
                      </p>
                    )}
                  </div>

                  {/* Category Name (English) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      Category Name (English)
                    </label>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => handleNameEnChange(e.target.value)}
                      placeholder="e.g. Premium Doi, Traditional Sweets"
                      className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Slug & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      URL Slug (ওয়েব লিংক) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:ring-2 focus-within:ring-doibrand-gold/40">
                      <span className="px-3 text-xs text-stone-400 font-mono select-none">/category/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                        placeholder="premium-doi"
                        className="w-full p-2.5 text-xs font-mono bg-transparent focus:outline-none text-stone-800"
                      />
                    </div>
                    {formErrors.slug && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.slug}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1.5">
                      সাবটাইটেল / স্লোগান
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="যেমন: খাঁটি উপাদানে প্রস্তুত সেরা স্বাদের সম্ভার"
                      className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-bengali"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800">
                      ক্যাটাগরির বিবরণ (Description)
                    </label>
                    <span className="text-[10px] text-stone-400 font-sans">
                      {description.length} অক্ষর
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ক্যাটাগরিটি সম্পর্কে সংক্ষিপ্ত বর্ণনা দিন যা গ্রাহকদের আগ্রহী করবে..."
                    className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 transition-all font-bengali leading-relaxed"
                  />
                </div>
              </div>

              {/* ── Category Image Section with Upload, Presets & URL ─── */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
                <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-100 text-doibrand-dark font-sans flex items-center justify-center text-xs font-bold">
                        B
                      </span>
                      ক্যাটাগরি ছবি (Category Image)
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      ডিভাইস থেকে আপলোড করুন, প্রস্তুত প্রিসেট ছবি ব্যবহার করুন অথবা ইমেজ লিঙ্ক দিন।
                    </p>
                  </div>

                  {/* Cloudinary Ready Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold self-start sm:self-auto font-sans">
                    <CloudUpload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cloudinary Ready</span>
                  </div>
                </div>

                {/* Sub-tab selection for Image Source */}
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

                {/* ── Sub-tab 1: Device Upload (Drag & Drop + File Selector) ── */}
                {imageSourceTab === "upload" && (
                  <div className="space-y-4">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
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
                            ক্লিক করে ছবি নির্বাচন করুন অথবা ফাইল টেনে এনে ড্রপ করুন
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5">
                            PNG, JPG, WebP ফরম্যাট সমর্থিত (সর্বোচ্চ ৫ মেগাবাইট)
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-200/70 text-[10px] font-semibold text-stone-700 font-sans mt-1">
                          ফ্রন্টএন্ডে তাত্ক্ষণিক প্রিভিউ + পরবর্তীতে Cloudinary কানেক্টেড
                        </span>
                      </div>
                    </div>

                    {/* Uploaded File Info Card (if a file was selected) */}
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
                            <p className="text-xs font-bold text-stone-800 truncate">
                              {uploadedFileName}
                            </p>
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
                            onClick={handleRemoveUploadedImage}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            title="ছবি সরান"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Sub-tab 2: Presets Selection ────────────────────────── */}
                {imageSourceTab === "presets" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-stone-700">
                      দই বিলাসের রেডিমেড হাই-কোয়ালিটি প্রিসেট ছবি:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {PRESET_IMAGES.map((preset, index) => {
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

                {/* ── Sub-tab 3: Direct URL Input ─────────────────────────── */}
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
                    <p className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-stone-400" /> পরবর্তীতে আপনার Cloudinary আপলোড থেকে পাওয়া ডাইরেক্ট লিঙ্কও এখানে পেস্ট করতে পারবেন।
                    </p>
                  </div>
                )}
              </div>

              {/* Next step button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("products")}
                  className="px-6 py-2.5 rounded-xl bg-doibrand-dark text-white font-bold text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span>পরবর্তী: পণ্য নির্বাচন করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 2: Product Assignment & Total Products ────────────── */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-header-fade-up">
              {/* Total Products Summary Bar */}
              <div className="bg-linear-to-br from-[#351C1B] to-[#512c2a] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold">
                      পণ্য সংখ্যা ও পরিমাপ
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">
                      মোট সংযুক্ত পণ্য: <span className="text-doibrand-gold">{toBnDigits(effectiveTotalProducts)}</span> টি
                    </h3>
                    <p className="text-xs text-stone-300 mt-1">
                      নিচের তালিকা থেকে পণ্যগুলো টিক দিন। নির্বাচিত পণ্যের সংখ্যা স্বয়ংক্রিয়ভাবে হিসাব করা হবে।
                    </p>
                  </div>

                  {/* Manual count override switch */}
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 flex items-center gap-3">
                    <label className="text-xs font-semibold text-stone-200 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isManualCount}
                        onChange={(e) => setIsManualCount(e.target.checked)}
                        className="rounded accent-doibrand-gold w-4 h-4"
                      />
                      <span>কাস্টম সংখ্যা বসান</span>
                    </label>

                    {isManualCount && (
                      <input
                        type="number"
                        min="0"
                        value={manualCountOverride}
                        onChange={(e) => setManualCountOverride(e.target.value)}
                        placeholder="সংখ্যা"
                        className="w-20 bg-white text-stone-900 rounded-lg px-2.5 py-1 text-xs font-bold font-sans text-center focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Product Catalog Selector Card */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                      <Package className="w-5 h-5 text-doibrand-gold" />
                      দই বিলাস ক্যাটালগ থেকে পণ্য নির্বাচন
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      যে পণ্যগুলো এই ক্যাটাগরির ভেতরে থাকবে সেগুলোতে টিক চিহ্ন দিন।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={selectAllProducts}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      সব নির্বাচন
                    </button>
                    <button
                      type="button"
                      onClick={clearAllSelectedProducts}
                      className="px-3 py-1.5 rounded-lg border border-red-100 text-xs font-bold text-red-600 bg-red-50/50 hover:bg-red-50 cursor-pointer"
                    >
                      রিসেট
                    </button>
                  </div>
                </div>

                {/* Search & Filter within products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="পণ্য খুঁজুন (নাম বা টাইটেল)..."
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
                  >
                    <option value="all">সকল পণ্য টাইপ</option>
                    <option value="premium-doi">দই সংক্রান্ত পণ্য</option>
                    <option value="laddu">লাড্ডু সংক্রান্ত পণ্য</option>
                    <option value="laccha-semai">লাচ্ছা সেমাই সংক্রান্ত পণ্য</option>
                    <option value="pure-ghee">ঘি সংক্রান্ত পণ্য</option>
                    <option value="traditional-sweets">ঐতিহ্যবাহী মিষ্টি</option>
                  </select>
                </div>

                {/* Product List */}
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 pt-2">
                  {filteredProducts.map((prod) => {
                    const isSelected = selectedProductSlugs.includes(prod.slug);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => toggleProduct(prod.slug)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-doibrand-gold bg-amber-50/50 shadow-2xs"
                            : "border-stone-200/80 bg-white hover:border-stone-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-doibrand-dark border-doibrand-dark text-white"
                                : "border-stone-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>

                          {/* Thumbnail */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-stone-100 shrink-0 border border-stone-200/60">
                            <Image
                              src={prod.image}
                              alt={prod.title}
                              fill
                              unoptimized={prod.image?.startsWith("data:") || prod.image?.startsWith("blob:")}
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate">
                                {prod.title}
                              </h4>
                              {prod.badge && (
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 font-sans">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                              {prod.englishTitle} • {prod.unit}
                            </p>
                          </div>
                        </div>

                        {/* Price & Stock */}
                        <div className="text-right shrink-0">
                          <p className="text-xs sm:text-sm font-bold text-doibrand-accent font-sans">
                            ৳ {prod.price}
                          </p>
                          {prod.originalPrice && (
                            <p className="text-[10px] text-stone-400 line-through font-sans">
                              ৳ {prod.originalPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Back & Next */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  ← মূল তথ্যে ফিরুন
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("features")}
                  className="px-6 py-2.5 rounded-xl bg-doibrand-dark text-white font-bold text-xs flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span>পরবর্তী: বৈশিষ্ট্য ও সেটিংস</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: Features, Tags & Publishing Settings ──────────── */}
          {activeTab === "features" && (
            <div className="space-y-6 animate-header-fade-up">
              {/* Highlights & Features Section */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-doibrand-gold" />
                    প্রধান বৈশিষ্ট্যসমূহ (Highlights)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    পণ্য বিবরণী পেজের মতো ক্যাটাগরির মূল গুণাবলি যোগ করুন (যেমন: ১০০% খাঁটি, মাটির সরায় তৈরি)।
                  </p>
                </div>

                {/* Current Highlights Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {highlights.map((h, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-doibrand-dark shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-doibrand-gold" />
                      <span>{h}</span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(h)}
                        className="text-stone-400 hover:text-red-500 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Highlight Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addHighlight(newHighlight);
                      }
                    }}
                    placeholder="নতুন বৈশিষ্ট্য লিখুন (যেমন: ১০০% খাঁটি মাখন)..."
                    className="flex-1 rounded-xl border border-stone-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                  />
                  <button
                    type="button"
                    onClick={() => addHighlight(newHighlight)}
                    className="px-4 py-2.5 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
                  >
                    যোগ করুন
                  </button>
                </div>

                {/* Suggestions */}
                <div className="pt-2">
                  <span className="text-[11px] text-stone-400 block mb-1.5 font-semibold">
                    সাজেস্টেড বৈশিষ্ট্যসমূহ (ক্লিক করে যোগ করুন):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_HIGHLIGHTS.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => addHighlight(sug)}
                        className="px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 text-[11px] text-stone-600 hover:bg-amber-50 hover:text-doibrand-dark transition-colors cursor-pointer"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <div className="border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                    <Tag className="w-5 h-5 text-doibrand-gold" />
                    ফিল্টারিং ট্যাগসমূহ (Tags)
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    স্টোরের ফিল্টার মেনুতে গ্রাহকরা যে ট্যাগগুলো ক্লিক করতে পারবেন।
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs font-semibold text-stone-700"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-stone-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(newTag);
                      }
                    }}
                    placeholder="ট্যাগ নাম লিখুন..."
                    className="flex-1 rounded-xl border border-stone-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newTag)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                  >
                    ট্যাগ যোগ
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTED_TAGS.map((st, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addTag(st)}
                      className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-[10px] text-stone-500 hover:text-stone-800"
                    >
                      +{st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status & Featured Toggle */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-doibrand-dark pb-2 border-b border-stone-100">
                  পাবলিশ ও প্রদর্শন সেটিংস
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        হোমপেজ ফিচার্ড ক্যাটাগরি (Featured Category)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        হোমপেজের টপ সেকশনে গোল্ডেন ব্যাজ সহ প্রদর্শন করুন।
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

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        ক্যাটাগরি স্ট্যাটাস (Status)
                      </span>
                      <span className="text-[11px] text-stone-500">
                        সক্রিয় থাকলে ওয়েবসাইটে তৎক্ষণাৎ দৃশ্যমান হবে।
                      </span>
                    </div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "active" | "draft")}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl border border-stone-200 bg-white focus:outline-none"
                    >
                      <option value="active">সক্রিয় (Active)</option>
                      <option value="draft">খসড়া (Draft)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Link
                  href="/admin/categories"
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
                  <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : editId ? "আপডেট সংরক্ষণ করুন" : "ক্যাটাগরি সংরক্ষণ করুন"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
