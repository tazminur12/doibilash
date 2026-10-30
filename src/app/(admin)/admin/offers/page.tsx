"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Tag,
  TicketPercent,
  Percent,
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
  Calendar,
  Clock,
  Copy,
  Check,
  Power,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Zap,
  ShoppingBag,
  TrendingUp,
  SlidersHorizontal,
  X,
  HelpCircle,
} from "lucide-react";
import {
  StoredPromoCode,
  StoredFlashDeal,
  CampaignSettings,
  getStoredPromos,
  savePromo,
  deletePromo,
  togglePromoActive,
  getStoredFlashDeals,
  saveFlashDeal,
  deleteFlashDeal,
  toggleFlashDealActive,
  getStoredCampaignSettings,
  saveCampaignSettings,
} from "@/lib/offerStorage";
import { getStoredProducts, StoredProduct } from "@/lib/productStorage";
import { toBnDigits } from "@/lib/bangla";

const PRESET_FLASH_IMAGES = [
  { label: "বগুড়ার স্পেশাল সরার দই", url: "/Product/doi.jpg" },
  { label: "প্রিমিয়াম লাচ্ছা সেমাই", url: "/Product/laccha_semai.jpg" },
  { label: "মাটির কাপ দই সেট", url: "/Product/mini_doi.png" },
  { label: "আমের দই স্পেশাল", url: "/Product/mango.jpg" },
  { label: "সাধারণ আইটেম", url: "/Product/placeholder.svg" },
];

const PRESET_TAGS = [
  "নতুন গ্রাহক",
  "মেগা সেভার",
  "হট ডিল",
  "স্পেশাল",
  "জনপ্রিয়",
  "ডেলিভারি অফার",
  "উৎসব স্পেশাল",
];

export default function AdminOffersPage() {
  const [activeTab, setActiveTab] = useState<"promos" | "flash" | "campaign">("promos");

  // Data states
  const [promos, setPromos] = useState<StoredPromoCode[]>([]);
  const [flashDeals, setFlashDeals] = useState<StoredFlashDeal[]>([]);
  const [campaign, setCampaign] = useState<CampaignSettings | null>(null);
  const [products, setProducts] = useState<StoredProduct[]>([]);

  // Search & Filters
  const [promoSearch, setPromoSearch] = useState("");
  const [promoStatusFilter, setPromoStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "EXPIRED">("ALL");
  const [promoTypeFilter, setPromoTypeFilter] = useState<"ALL" | "flat" | "percent" | "freeDelivery">("ALL");

  const [flashSearch, setFlashSearch] = useState("");
  const [flashStatusFilter, setFlashStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Toast & Copied States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal states
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<StoredPromoCode | null>(null);

  const [isFlashModalOpen, setIsFlashModalOpen] = useState(false);
  const [editingFlashDeal, setEditingFlashDeal] = useState<StoredFlashDeal | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "promo" | "flash";
    id: string;
    title: string;
  } | null>(null);

  // Promo Form Fields
  const [pCode, setPCode] = useState("");
  const [pRuleType, setPRuleType] = useState<"flat" | "percent" | "freeDelivery">("flat");
  const [pFlatAmount, setPFlatAmount] = useState<number>(100);
  const [pPercent, setPPercent] = useState<number>(15);
  const [pKeyword, setPKeyword] = useState<string>("");
  const [pInsideDhakaOnly, setPInsideDhakaOnly] = useState<boolean>(true);
  const [pDiscountText, setPDiscountText] = useState("");
  const [pCondition, setPCondition] = useState("");
  const [pExpiryText, setPExpiryText] = useState("");
  const [pExpiresAt, setPExpiresAt] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pTag, setPTag] = useState("স্পেশাল");
  const [pMinOrder, setPMinOrder] = useState<number>(0);
  const [pIsActive, setPIsActive] = useState<boolean>(true);

  // Flash Form Fields
  const [fSelectedProdId, setFSelectedProdId] = useState("");
  const [fTitle, setFTitle] = useState("");
  const [fSlug, setFSlug] = useState("");
  const [fPrice, setFPrice] = useState<number>(450); // Flash Rate
  const [fOriginalPrice, setFOriginalPrice] = useState<number>(550);
  const [fUnit, setFUnit] = useState("১ কেজি মাটির সরা");
  const [fBadge, setFBadge] = useState("ফ্ল্যাশ সেল");
  const [fImage, setFImage] = useState("/Product/doi.jpg");
  const [fTotalStock, setFTotalStock] = useState<number>(50);
  const [fSoldCount, setFSoldCount] = useState<number>(20);
  const [fIsActive, setFIsActive] = useState<boolean>(true);

  // Campaign Form Fields
  const [campBadge, setCampBadge] = useState("");
  const [campTitle, setCampTitle] = useState("");
  const [campHighlight, setCampHighlight] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campEnd, setCampEnd] = useState("");
  const [campBannerActive, setCampBannerActive] = useState(true);
  const [campAnnouncement, setCampAnnouncement] = useState("");

  const loadData = () => {
    setPromos(getStoredPromos());
    setFlashDeals(getStoredFlashDeals());
    const c = getStoredCampaignSettings();
    setCampaign(c);
    setCampBadge(c.badge);
    setCampTitle(c.title);
    setCampHighlight(c.highlightText);
    setCampDesc(c.description);
    setCampEnd(c.campaignEnd ? c.campaignEnd.slice(0, 16) : "");
    setCampBannerActive(c.bannerActive);
    setCampAnnouncement(c.announcementText || "");
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // fallback
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (item: StoredPromoCode) => {
    if (!item.expiresAt) return false;
    return new Date(item.expiresAt).getTime() < Date.now();
  };

  // ── TOGGLE STATUS ───────────────────────────────────────────────────────
  const handleTogglePromo = (id: string, code: string, currentStatus: boolean) => {
    togglePromoActive(id);
    loadData();
    showToast(
      currentStatus
        ? `প্রোমো কোড "${code}" নিষ্ক্রিয় করা হয়েছে।`
        : `প্রোমো কোড "${code}" সক্রিয় (Activate) করা হয়েছে!`
    );
  };

  const handleToggleFlash = (id: string, title: string, currentStatus: boolean) => {
    toggleFlashDealActive(id);
    loadData();
    showToast(
      currentStatus
        ? `ফ্ল্যাশ অফার "${title}" স্থগিত করা হয়েছে।`
        : `ফ্ল্যাশ অফার "${title}" সক্রিয় করা হয়েছে!`
    );
  };

  // ── PROMO MODAL HANDLERS ────────────────────────────────────────────────
  const openNewPromoModal = () => {
    setEditingPromo(null);
    setPCode("");
    setPRuleType("flat");
    setPFlatAmount(100);
    setPPercent(15);
    setPKeyword("");
    setPInsideDhakaOnly(true);
    setPDiscountText("৳ ১০০ ছাড়");
    setPCondition("ন্যূনতম ১০০০ টাকার অর্ডারে");
    setPExpiryText("১৫ নভেম্বর ২০২৬ পর্যন্ত");
    setPExpiresAt(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 16));
    setPDescription("বিশেষ অর্ডারে আকর্ষণীয় ছাড়");
    setPTag("স্পেশাল");
    setPMinOrder(1000);
    setPIsActive(true);
    setIsPromoModalOpen(true);
  };

  const openEditPromoModal = (promo: StoredPromoCode) => {
    setEditingPromo(promo);
    setPCode(promo.code);
    setPRuleType(promo.rule.type);
    if (promo.rule.type === "flat") {
      setPFlatAmount(promo.rule.amount);
    } else if (promo.rule.type === "percent") {
      setPPercent(promo.rule.percent);
      setPKeyword(promo.rule.appliesToKeyword || "");
    } else if (promo.rule.type === "freeDelivery") {
      setPInsideDhakaOnly(Boolean(promo.rule.insideDhakaOnly));
    }
    setPDiscountText(promo.discount);
    setPCondition(promo.condition);
    setPExpiryText(promo.expiry);
    setPExpiresAt(promo.expiresAt ? promo.expiresAt.slice(0, 16) : "");
    setPDescription(promo.description);
    setPTag(promo.tag);
    setPMinOrder(promo.minOrder || 0);
    setPIsActive(promo.isActive !== false);
    setIsPromoModalOpen(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pCode.trim()) {
      alert("দয়া করে প্রোমো কোড দিন।");
      return;
    }

    let rule: StoredPromoCode["rule"];
    if (pRuleType === "flat") {
      rule = { type: "flat", amount: Number(pFlatAmount) || 0 };
    } else if (pRuleType === "percent") {
      rule = {
        type: "percent",
        percent: Number(pPercent) || 0,
        appliesToKeyword: pKeyword.trim() ? pKeyword.trim() : undefined,
      };
    } else {
      rule = {
        type: "freeDelivery",
        insideDhakaOnly: pInsideDhakaOnly,
      };
    }

    const newOrUpdatedPromo: StoredPromoCode = {
      id: editingPromo ? editingPromo.id : `promo-${Date.now()}`,
      code: pCode.trim().toUpperCase(),
      discount: pDiscountText || (pRuleType === "flat" ? `৳ ${pFlatAmount} ছাড়` : `${pPercent}% ছাড়`),
      condition: pCondition || (pMinOrder > 0 ? `ন্যূনতম ${pMinOrder} টাকার অর্ডারে` : "যেকোনো অর্ডারে"),
      expiry: pExpiryText || "সীমিত সময়ের জন্য",
      expiresAt: pExpiresAt ? new Date(pExpiresAt).toISOString() : undefined,
      description: pDescription || "বিশেষ কুপন ছাড়",
      tag: pTag || "স্পেশাল",
      rule,
      minOrder: pMinOrder > 0 ? Number(pMinOrder) : undefined,
      isActive: pIsActive,
      usageCount: editingPromo ? editingPromo.usageCount : 0,
      createdAt: editingPromo ? editingPromo.createdAt : new Date().toISOString().split("T")[0],
    };

    savePromo(newOrUpdatedPromo);
    loadData();
    setIsPromoModalOpen(false);
    showToast(
      editingPromo
        ? `প্রোমো কোড "${newOrUpdatedPromo.code}" সফলভাবে আপডেট হয়েছে!`
        : `নতুন প্রোমো কোড "${newOrUpdatedPromo.code}" তৈরি হয়েছে!`
    );
  };

  // ── FLASH MODAL HANDLERS ────────────────────────────────────────────────
  const openNewFlashModal = () => {
    setEditingFlashDeal(null);
    setFSelectedProdId("");
    setFTitle("");
    setFSlug("");
    setFPrice(420);
    setFOriginalPrice(550);
    setFUnit("১ কেজি মাটির সরা");
    setFBadge("ফ্ল্যাশ সেল");
    setFImage("/Product/doi.jpg");
    setFTotalStock(40);
    setFSoldCount(12);
    setFIsActive(true);
    setIsFlashModalOpen(true);
  };

  const openEditFlashModal = (deal: StoredFlashDeal) => {
    setEditingFlashDeal(deal);
    setFSelectedProdId("");
    setFTitle(deal.title);
    setFSlug(deal.slug);
    setFPrice(deal.price);
    setFOriginalPrice(deal.originalPrice);
    setFUnit(deal.unit);
    setFBadge(deal.badge);
    setFImage(deal.image);
    setFTotalStock(deal.totalStock);
    setFSoldCount(deal.soldCount);
    setFIsActive(deal.isActive !== false);
    setIsFlashModalOpen(true);
  };

  const handleProductSelect = (prodId: string) => {
    setFSelectedProdId(prodId);
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setFTitle(found.name);
      setFSlug(found.slug);
      setFOriginalPrice(found.price);
      setFPrice(Math.round(found.price * 0.85)); // 15% off by default
      setFUnit(found.unit);
      setFImage(found.image || "/Product/doi.jpg");
    }
  };

  const handleSaveFlashDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fTitle.trim() || !fSlug.trim()) {
      alert("দয়া করে পণ্যের নাম ও স্লাগ দিন।");
      return;
    }

    const newOrUpdatedDeal: StoredFlashDeal = {
      id: editingFlashDeal ? editingFlashDeal.id : `flash-${Date.now()}`,
      title: fTitle.trim(),
      slug: fSlug.trim(),
      price: Number(fPrice) || 0,
      originalPrice: Number(fOriginalPrice) || 0,
      unit: fUnit.trim() || "১ প্যাক",
      badge: fBadge.trim() || "ফ্ল্যাশ সেল",
      image: fImage || "/Product/doi.jpg",
      soldCount: Number(fSoldCount) || 0,
      totalStock: Number(fTotalStock) || 10,
      isActive: fIsActive,
      createdAt: editingFlashDeal ? editingFlashDeal.createdAt : new Date().toISOString().split("T")[0],
    };

    saveFlashDeal(newOrUpdatedDeal);
    loadData();
    setIsFlashModalOpen(false);
    showToast(
      editingFlashDeal
        ? `ফ্ল্যাশ অফার "${newOrUpdatedDeal.title}" আপডেট হয়েছে!`
        : `নতুন ফ্ল্যাশ অফার "${newOrUpdatedDeal.title}" যুক্ত হয়েছে!`
    );
  };

  // ── DELETE HANDLER ──────────────────────────────────────────────────────
  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "promo") {
      deletePromo(deleteTarget.id);
      showToast(`প্রোমো কোড "${deleteTarget.title}" মুছে ফেলা হয়েছে।`);
    } else {
      deleteFlashDeal(deleteTarget.id);
      showToast(`ফ্ল্যাশ ডিল "${deleteTarget.title}" মুছে ফেলা হয়েছে।`);
    }
    loadData();
    setDeleteTarget(null);
  };

  // ── CAMPAIGN SAVE HANDLER ───────────────────────────────────────────────
  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: CampaignSettings = {
      badge: campBadge || "মেগা ডিসকাউন্ট উৎসব",
      title: campTitle || "স্পেশাল",
      highlightText: campHighlight || "ধামাকা অফার",
      description: campDesc || "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য।",
      campaignEnd: campEnd ? new Date(campEnd).toISOString() : "2026-11-15T23:59:59+06:00",
      bannerActive: campBannerActive,
      announcementText: campAnnouncement,
    };
    saveCampaignSettings(updated);
    loadData();
    showToast("ক্যাম্পেইন ও কাউন্টডাউন টাইমার সেটিংস সংরক্ষিত হয়েছে!");
  };

  // ── FILTERED DATA ───────────────────────────────────────────────────────
  const filteredPromos = promos.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(promoSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(promoSearch.toLowerCase()) ||
      p.tag.toLowerCase().includes(promoSearch.toLowerCase()) ||
      p.condition.toLowerCase().includes(promoSearch.toLowerCase());

    const expired = isExpired(p);
    let matchesStatus = true;
    if (promoStatusFilter === "ACTIVE") matchesStatus = p.isActive && !expired;
    if (promoStatusFilter === "INACTIVE") matchesStatus = !p.isActive;
    if (promoStatusFilter === "EXPIRED") matchesStatus = expired;

    const matchesType = promoTypeFilter === "ALL" || p.rule.type === promoTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredFlashDeals = flashDeals.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(flashSearch.toLowerCase()) ||
      d.badge.toLowerCase().includes(flashSearch.toLowerCase()) ||
      d.unit.toLowerCase().includes(flashSearch.toLowerCase());

    let matchesStatus = true;
    if (flashStatusFilter === "ACTIVE") matchesStatus = d.isActive;
    if (flashStatusFilter === "INACTIVE") matchesStatus = !d.isActive;

    return matchesSearch && matchesStatus;
  });

  // KPIs
  const activePromoCount = promos.filter((p) => p.isActive && !isExpired(p)).length;
  const activeFlashCount = flashDeals.filter((d) => d.isActive).length;
  const totalClaims = promos.reduce((sum, p) => sum + (p.usageCount || 0), 0);
  const maxDiscountRate = flashDeals.reduce((max, d) => {
    if (d.originalPrice > d.price) {
      const pct = Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100);
      return Math.max(max, pct);
    }
    return max;
  }, 0);

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Page Header ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#200F0E] via-[#351C1B] to-[#1F0E0D] border border-amber-900/30 p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#C48A4E]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -top-10 w-72 h-72 rounded-full bg-[#A95E35]/15 blur-3xl" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C48A4E]/20 border border-[#C48A4E]/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>মার্কেটিং ও সেলস প্রোমোশন কন্ট্রোল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              অফার ও প্রোমো কোড{" "}
              <span className="bg-linear-to-r from-amber-200 via-[#E4B07B] to-amber-300 bg-clip-text text-transparent">
                ম্যানেজমেন্ট
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              পাবলিক পেজের স্পেশাল অফার ব্যানার, অ্যাক্টিভ প্রোমো কোড ভাউচার ও ফ্ল্যাশ রেট তৈরি,
              সক্রিয়করণ এবং সময়সীমা পরিচালনা করুন।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/offers"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-stone-200 text-xs sm:text-sm font-semibold transition border border-white/10"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>পাবলিক অফার পেজ</span>
            </Link>

            <button
              type="button"
              onClick={openNewPromoModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] hover:from-[#d1965a] hover:to-[#b8673a] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#C48A4E]/25 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্রোমো কোড</span>
            </button>

            <button
              type="button"
              onClick={openNewFlashModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/25 transition active:scale-[0.98]"
            >
              <Flame className="w-4 h-4" />
              <span>নতুন ফ্ল্যাশ ডিল</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Stats Strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">সক্রিয় প্রোমো কোড</p>
            <p className="text-xl sm:text-2xl font-black text-doibrand-dark mt-1">
              {toBnDigits(activePromoCount)}{" "}
              <span className="text-xs font-normal text-stone-400">টি সচল</span>
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {toBnDigits(promos.length)} টির মধ্যে লাইভ
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C48A4E] flex items-center justify-center ring-1 ring-[#C48A4E]/20">
            <TicketPercent className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">লাইভ ফ্ল্যাশ সেল ডিল</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
              {toBnDigits(activeFlashCount)}{" "}
              <span className="text-xs font-normal text-stone-400">টি পণ্য</span>
            </p>
            <span className="text-[10px] text-stone-500 mt-1 block">হোম ও অফার পেজে প্রদর্শন</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center ring-1 ring-rose-200">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">মোট কুপন প্রয়োগ (Claims)</p>
            <p className="text-xl sm:text-2xl font-black text-[#A95E35] mt-1">
              {toBnDigits(totalClaims)}{" "}
              <span className="text-xs font-normal text-stone-400">বার</span>
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
              +১২% গত সপ্তাহে বৃদ্ধি
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 ring-1 ring-stone-200/70 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">সর্বোচ্চ ফ্ল্যাশ রেট ছাড়</p>
            <p className="text-xl sm:text-2xl font-black text-doibrand-accent mt-1">
              {toBnDigits(maxDiscountRate)}%{" "}
              <span className="text-xs font-normal text-stone-400">ছাড়</span>
            </p>
            <span className="text-[10px] text-stone-500 mt-1 block">গ্রাহকের সর্বোচ্চ সাশ্রয়</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C48A4E] flex items-center justify-center ring-1 ring-[#C48A4E]/20">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── 3. Tabs Navigation ────────────────────────────────────────── */}
      <div className="flex border-b border-stone-200 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("promos")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "promos"
              ? "border-[#C48A4E] text-[#A95E35]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <TicketPercent className="w-4 h-4" />
          <span>প্রোমো কোড ও ভাউচার ({toBnDigits(promos.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("flash")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "flash"
              ? "border-[#C48A4E] text-[#A95E35]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          <span>ফ্ল্যাশ সেল ও বিশেষ রেট ({toBnDigits(flashDeals.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("campaign")}
          className={`flex items-center gap-2 pb-3 px-3 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "campaign"
              ? "border-[#C48A4E] text-[#A95E35]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>ক্যাম্পেইন ব্যানার ও কাউন্টডাউন টাইমার</span>
        </button>
      </div>

      {/* ── 4. TAB 1: PROMO CODES ────────────────────────────────────── */}
      {activeTab === "promos" && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="প্রোমো কোড, ট্যাগ বা শর্ত দিয়ে খুঁজুন..."
                value={promoSearch}
                onChange={(e) => setPromoSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPromoStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    promoStatusFilter === "ALL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                  }`}
                >
                  সকল
                </button>
                <button
                  type="button"
                  onClick={() => setPromoStatusFilter("ACTIVE")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    promoStatusFilter === "ACTIVE" ? "bg-emerald-600 text-white shadow-xs" : "text-stone-500"
                  }`}
                >
                  সক্রিয় ({toBnDigits(activePromoCount)})
                </button>
                <button
                  type="button"
                  onClick={() => setPromoStatusFilter("INACTIVE")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    promoStatusFilter === "INACTIVE" ? "bg-stone-700 text-white shadow-xs" : "text-stone-500"
                  }`}
                >
                  নিষ্ক্রিয়
                </button>
                <button
                  type="button"
                  onClick={() => setPromoStatusFilter("EXPIRED")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    promoStatusFilter === "EXPIRED" ? "bg-red-600 text-white shadow-xs" : "text-stone-500"
                  }`}
                >
                  মেয়াদ শেষ
                </button>
              </div>

              {/* Type Filter */}
              <select
                value={promoTypeFilter}
                onChange={(e) => setPromoTypeFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700 focus:outline-none"
              >
                <option value="ALL">সকল ধরন</option>
                <option value="flat">টাকায় ফ্ল্যাট ছাড়</option>
                <option value="percent">শতকরা % ছাড়</option>
                <option value="freeDelivery">ফ্রি ডেলিভারি</option>
              </select>
            </div>
          </div>

          {/* Promo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPromos.map((promo) => {
              const expired = isExpired(promo);
              const isActive = promo.isActive && !expired;
              const isCopied = copiedCode === promo.code;

              return (
                <div
                  key={promo.id}
                  className={`relative flex flex-col overflow-hidden rounded-2xl bg-white border transition-all duration-300 ${
                    !promo.isActive
                      ? "border-stone-300 bg-stone-50/60 opacity-80"
                      : expired
                      ? "border-red-200 opacity-75"
                      : "border-amber-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-amber-300"
                  }`}
                >
                  {/* Top Bar with Badge & Instant Toggle Switch */}
                  <div className="p-4 pb-3 flex items-center justify-between border-b border-stone-100 bg-[#FFFDF9]">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-[#A95E35] border border-amber-200">
                        {promo.tag}
                      </span>
                      {promo.rule.type === "freeDelivery" && (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                          ফ্রি ডেলিভারি
                        </span>
                      )}
                    </div>

                    {/* Quick "Activate Promo Code" Switch */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-stone-500">
                        {promo.isActive ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            সক্রিয়
                          </span>
                        ) : (
                          <span className="text-stone-400">নিষ্ক্রিয়</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTogglePromo(promo.id, promo.code, promo.isActive)}
                        title={promo.isActive ? "নিষ্ক্রিয় করতে ক্লিক করুন" : "সক্রিয় করতে ক্লিক করুন"}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          promo.isActive ? "bg-emerald-600" : "bg-stone-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            promo.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Ticket Body with Luxury Styling */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Discount Headline */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-[#A95E35]">
                          {promo.discount}
                        </span>
                        {expired ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <AlertCircle className="w-3 h-3" />
                            মেয়াদ শেষ
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C48A4E]" />
                            {promo.expiry}
                          </span>
                        )}
                      </div>

                      {/* Description & condition */}
                      <h3 className="mt-2 text-sm font-bold text-stone-800 line-clamp-1">
                        {promo.description}
                      </h3>
                      <p className="mt-1 text-xs text-stone-500 leading-snug">
                        {promo.condition}
                      </p>
                    </div>

                    {/* Promo Code Box */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0 truncate rounded-xl border border-dashed border-[#C48A4E]/60 bg-[#FFF9F1] px-3 py-2 text-center font-mono text-sm font-bold tracking-wider text-[#A95E35]">
                          {promo.code}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(promo.code)}
                          title="কোড কপি করুন"
                          className={`p-2 rounded-xl border transition ${
                            isCopied
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : "bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Stats & Actions Row */}
                      <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                        <span className="text-[11px]">
                          ব্যবহার: <strong className="text-stone-800">{toBnDigits(promo.usageCount || 0)} বার</strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditPromoModal(promo)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#A95E35] hover:bg-amber-50 transition"
                            title="এডিট করুন"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                type: "promo",
                                id: promo.id,
                                title: promo.code,
                              })
                            }
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPromos.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center border border-dashed border-stone-300">
              <TicketPercent className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-base font-bold text-stone-700">কোনো প্রোমো কোড পাওয়া যায়নি</p>
              <p className="text-xs text-stone-500 mt-1">
                আপনার সার্চ বা ফিল্টার শর্ত পরিবর্তন করুন অথবা নতুন প্রোমো কোড তৈরি করুন।
              </p>
              <button
                type="button"
                onClick={openNewPromoModal}
                className="mt-4 px-4 py-2 rounded-xl bg-[#C48A4E] text-white text-xs font-bold shadow-sm"
              >
                নতুন কোড যুক্ত করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 5. TAB 2: FLASH DEALS & FLASH RATES ──────────────────────── */}
      {activeTab === "flash" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="পণ্যের নাম বা ব্যাজ দিয়ে খুঁজুন..."
                value={flashSearch}
                onChange={(e) => setFlashSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E]"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFlashStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    flashStatusFilter === "ALL" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                  }`}
                >
                  সকল ({toBnDigits(flashDeals.length)})
                </button>
                <button
                  type="button"
                  onClick={() => setFlashStatusFilter("ACTIVE")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    flashStatusFilter === "ACTIVE" ? "bg-rose-600 text-white shadow-xs" : "text-stone-500"
                  }`}
                >
                  সক্রিয় ({toBnDigits(activeFlashCount)})
                </button>
                <button
                  type="button"
                  onClick={() => setFlashStatusFilter("INACTIVE")}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    flashStatusFilter === "INACTIVE" ? "bg-stone-700 text-white shadow-xs" : "text-stone-500"
                  }`}
                >
                  স্থগিত / নিষ্ক্রিয়
                </button>
              </div>

              <button
                type="button"
                onClick={openNewFlashModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ফ্ল্যাশ পণ্য</span>
              </button>
            </div>
          </div>

          {/* Flash Deals Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFlashDeals.map((deal) => {
              const discountPct = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
              const savings = deal.originalPrice - deal.price;
              const soldPercentage = Math.round((deal.soldCount / deal.totalStock) * 100);
              const remainingStock = Math.max(0, deal.totalStock - deal.soldCount);

              return (
                <div
                  key={deal.id}
                  className={`flex flex-col rounded-2xl bg-white border overflow-hidden transition-all duration-300 ${
                    !deal.isActive
                      ? "border-stone-300 opacity-75 bg-stone-50/50"
                      : "border-amber-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-amber-300"
                  }`}
                >
                  {/* Top Image Preview & Badges */}
                  <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden">
                    <Image
                      src={deal.image || "/Product/placeholder.svg"}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent" />

                    {/* Discount badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black shadow-md">
                      <Zap className="w-3 h-3 fill-current" />
                      -{toBnDigits(discountPct)}% ফ্ল্যাশ রেট
                    </span>

                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10px] font-bold text-stone-800">
                      {deal.unit}
                    </span>

                    <div className="absolute bottom-2.5 left-3 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
                        {deal.badge}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-base text-stone-900 leading-snug line-clamp-1">
                          {deal.title}
                        </h3>

                        {/* Active Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleFlash(deal.id, deal.title, deal.isActive)}
                          title={deal.isActive ? "নিষ্ক্রিয় করতে ক্লিক করুন" : "সক্রিয় করতে ক্লিক করুন"}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            deal.isActive ? "bg-emerald-600" : "bg-stone-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              deal.isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="mt-3 flex items-center justify-between bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                        <div>
                          <p className="text-[10px] text-stone-500 font-medium">ফ্ল্যাশ রেট (Flash Rate)</p>
                          <p className="text-xl font-black text-rose-600">
                            ৳ {toBnDigits(deal.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-stone-500 line-through">
                            নিয়মিত: ৳ {toBnDigits(deal.originalPrice)}
                          </p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            সাশ্রয় ৳ {toBnDigits(savings)}
                          </span>
                        </div>
                      </div>

                      {/* Stock Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-stone-500">
                            বিক্রি: <strong className="text-stone-800">{toBnDigits(soldPercentage)}%</strong> ({toBnDigits(deal.soldCount)}/{toBnDigits(deal.totalStock)})
                          </span>
                          <span className="font-bold text-rose-600 flex items-center gap-0.5">
                            <Flame className="w-3 h-3" />
                            {toBnDigits(remainingStock)}টি বাকি
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-amber-500 to-rose-600 rounded-full"
                            style={{ width: `${Math.min(100, soldPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400">
                        স্লাগ: <code className="font-mono text-stone-600">{deal.slug}</code>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditFlashModal(deal)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-[#A95E35] hover:bg-amber-50 transition"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "flash",
                              id: deal.id,
                              title: deal.title,
                            })
                          }
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFlashDeals.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center border border-dashed border-stone-300">
              <Flame className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-base font-bold text-stone-700">কোনো ফ্ল্যাশ অফার পাওয়া যায়নি</p>
              <button
                type="button"
                onClick={openNewFlashModal}
                className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm"
              >
                নতুন ফ্ল্যাশ পণ্য যোগ করুন
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── 6. TAB 3: CAMPAIGN & COUNTDOWN SETTINGS ───────────────────── */}
      {activeTab === "campaign" && (
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-stone-200/80 shadow-md">
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                অফার পেজ ক্যাম্পেইন ও কাউন্টডাউন টাইমার
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                পাবলিক অফার পেজের মূল ব্যানার শিরোনাম ও কাউন্টডাউন টাইমার পরিচালনা করুন
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-600">ব্যানার স্ট্যাটাস:</span>
              <button
                type="button"
                onClick={() => setCampBannerActive(!campBannerActive)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  campBannerActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {campBannerActive ? "সক্রিয় (Active)" : "লুকানো (Hidden)"}
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveCampaign} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Badge */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ক্যাম্পেইন ব্যাজ লেবেল
                </label>
                <input
                  type="text"
                  value={campBadge}
                  onChange={(e) => setCampBadge(e.target.value)}
                  placeholder="যেমন: মেগা ডিসকাউন্ট উৎসব"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
              </div>

              {/* Countdown Target Date */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  কাউন্টডাউন শেষ হওয়ার তারিখ ও সময় (Countdown End)
                </label>
                <input
                  type="datetime-local"
                  value={campEnd}
                  onChange={(e) => setCampEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  এই সময়ের সাথে মিল রেখে পাবলিক পেজের দিন, ঘণ্টা, মিনিট ও সেকেন্ড চলবে।
                </p>
              </div>

              {/* Title 1 */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  মূল শিরোনাম (Headline Start)
                </label>
                <input
                  type="text"
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="যেমন: স্পেশাল"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
              </div>

              {/* Highlight text */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  হাইলাইট গোল্ডেন টেক্সট (Gradient Highlight)
                </label>
                <input
                  type="text"
                  value={campHighlight}
                  onChange={(e) => setCampHighlight(e.target.value)}
                  placeholder="যেমন: ধামাকা অফার"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                ক্যাম্পেইন বিবরণী
              </label>
              <textarea
                rows={2}
                value={campDesc}
                onChange={(e) => setCampDesc(e.target.value)}
                placeholder="অফারের বিস্তারিত বার্তা..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
              />
            </div>

            {/* Announcement note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                বিশেষ ঘোষণা বা শর্ত টিকার (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={campAnnouncement}
                onChange={(e) => setCampAnnouncement(e.target.value)}
                placeholder="যেমন: অফার চলাকালীন যেকোনো ২টি মিষ্টি আইটেমে বিশেষ উপহার!"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
              />
            </div>

            {/* Preview Card */}
            <div className="rounded-2xl bg-linear-to-br from-[#FBE3C4] via-[#FFF6EA] to-[#F3C89A] p-6 border border-amber-300">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2 block">
                পাবলিক অফার পেজ ব্যানার প্রিভিউ
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-[#A95E35] to-[#C48A4E] px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                {campBadge || "মেগা ডিসকাউন্ট উৎসব"}
              </span>
              <h3 className="mt-3 text-3xl font-extrabold text-stone-900">
                {campTitle || "স্পেশাল"}{" "}
                <span className="bg-linear-to-r from-[#A95E35] via-[#C48A4E] to-[#A95E35] bg-clip-text text-transparent">
                  {campHighlight || "ধামাকা অফার"}
                </span>
              </h3>
              <p className="mt-2 text-sm text-stone-600 max-w-xl">
                {campDesc || "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য।"}
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white font-bold text-sm shadow-md hover:shadow-lg transition active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>ক্যাম্পেইন সেটিংস সংরক্ষণ করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 7. PROMO CODE MODAL (CREATE / EDIT) ────────────────────────── */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 rounded-3xl bg-white border border-amber-900/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 bg-[#241312] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C48A4E] text-[#241312] flex items-center justify-center font-bold">
                  <TicketPercent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingPromo ? "প্রোমো কোড এডিট করুন" : "নতুন প্রোমো কোড তৈরি করুন"}
                  </h3>
                  <p className="text-xs text-stone-300">
                    ভাউচার কোড, ডিসকাউন্টের নিয়ম ও শর্তাবলী নির্ধারণ করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSavePromo} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Promo Code & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    প্রোমো কোড (Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pCode}
                    onChange={(e) => setPCode(e.target.value.toUpperCase())}
                    placeholder="যেমন: DOI100, SUMMER20"
                    className="w-full font-mono uppercase tracking-wider px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-[#A95E35] focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ট্যাগ লেবেল (Badge Tag)
                  </label>
                  <input
                    type="text"
                    value={pTag}
                    onChange={(e) => setPTag(e.target.value)}
                    placeholder="যেমন: নতুন গ্রাহক, হট ডিল"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>
              </div>

              {/* Rule Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ছাড়ের ধরন (Discount Rule Type)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPRuleType("flat");
                      setPDiscountText(`৳ ${pFlatAmount} ছাড়`);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      pRuleType === "flat"
                        ? "bg-[#C48A4E] text-white border-[#C48A4E] shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    টাকায় ফ্ল্যাট ছাড়
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPRuleType("percent");
                      setPDiscountText(`${pPercent}% ছাড়`);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      pRuleType === "percent"
                        ? "bg-[#C48A4E] text-white border-[#C48A4E] shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    শতকরা (%) ছাড়
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPRuleType("freeDelivery");
                      setPDiscountText("ফ্রি ডেলিভারি");
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition ${
                      pRuleType === "freeDelivery"
                        ? "bg-[#C48A4E] text-white border-[#C48A4E] shadow-xs"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    ফ্রি ডেলিভারি
                  </button>
                </div>
              </div>

              {/* Conditional Rule Inputs */}
              {pRuleType === "flat" && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ছাড়ের পরিমাণ (৳ টাকা)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pFlatAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPFlatAmount(val);
                      setPDiscountText(`৳ ${val} ছাড়`);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>
              )}

              {pRuleType === "percent" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ছাড়ের শতকরা হার (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pPercent}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setPPercent(val);
                        setPDiscountText(`${val}% ছাড়`);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      নির্দিষ্ট ক্যাটাগরি কিওয়ার্ড (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={pKeyword}
                      onChange={(e) => setPKeyword(e.target.value)}
                      placeholder="যেমন: ঘি, দই, লাড্ডু"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                    />
                  </div>
                </div>
              )}

              {pRuleType === "freeDelivery" && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-blue-900">শুধুমাত্র ঢাকার ভেতরে প্রযোজ্য?</p>
                    <p className="text-[11px] text-blue-700">ঢাকার বাইরের অর্ডারে ডেলিভারি চার্জ বহাল থাকবে</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pInsideDhakaOnly}
                    onChange={(e) => setPInsideDhakaOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Discount Text & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ডিসকাউন্ট ডিসপ্লে টেক্সট
                  </label>
                  <input
                    type="text"
                    value={pDiscountText}
                    onChange={(e) => setPDiscountText(e.target.value)}
                    placeholder="যেমন: ৳ ১০০ ছাড়"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ন্যূনতম অর্ডার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pMinOrder}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPMinOrder(val);
                      if (val > 0) setPCondition(`ন্যূনতম ${val} টাকার অর্ডারে`);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  শর্তাবলী বাক্য (Condition Text)
                </label>
                <input
                  type="text"
                  value={pCondition}
                  onChange={(e) => setPCondition(e.target.value)}
                  placeholder="যেমন: ন্যূনতম ১০০০ টাকার অর্ডারে"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <input
                  type="text"
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="যেমন: প্রথম অর্ডারে স্পেশাল ছাড়"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                />
              </div>

              {/* Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    মেয়াদ শেষ হওয়ার তারিখ ও সময়
                  </label>
                  <input
                    type="datetime-local"
                    value={pExpiresAt}
                    onChange={(e) => setPExpiresAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    মেয়াদ টেক্সট লেবেল
                  </label>
                  <input
                    type="text"
                    value={pExpiryText}
                    onChange={(e) => setPExpiryText(e.target.value)}
                    placeholder="যেমন: ৩১ অক্টোবর ২০২৬ পর্যন্ত"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  />
                </div>
              </div>

              {/* Active Toggle (Activate Promo Code) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    প্রোমো কোডটি এখনই সক্রিয় করুন (Activate Promo Code)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    সক্রিয় রাখলে তাৎক্ষণিকভাবে পাবলিক অফার পেজ ও চেকআউটে প্রযোজ্য হবে
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPIsActive(!pIsActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    pIsActive ? "bg-emerald-600" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      pIsActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white text-xs font-bold shadow-md hover:shadow-lg transition"
                >
                  {editingPromo ? "আপডেট সংরক্ষণ করুন" : "প্রোমো কোড তৈরি করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 8. FLASH DEAL MODAL (CREATE / EDIT) ────────────────────────── */}
      {isFlashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl my-8 rounded-3xl bg-white border border-rose-900/20 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 bg-[#200F0E] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {editingFlashDeal ? "ফ্ল্যাশ অফার ও রেট এডিট করুন" : "নতুন ফ্ল্যাশ ডিল তৈরি করুন"}
                  </h3>
                  <p className="text-xs text-stone-300">
                    বিশেষ ফ্ল্যাশ রেট (Flash Rate) ও স্টক সীমা নির্ধারণ করুন
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFlashModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFlashDeal} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Optional: Load from existing products */}
              {!editingFlashDeal && products.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বিদ্যমান পণ্য থেকে নির্বাচন করুন (ঐচ্ছিক)
                  </label>
                  <select
                    value={fSelectedProdId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
                  >
                    <option value="">-- যেকোনো পণ্য বেছে নিন --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (রেগুলার: ৳{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    পণ্যের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={fTitle}
                    onChange={(e) => setFTitle(e.target.value)}
                    placeholder="যেমন: বগুড়ার স্পেশাল সরার দই"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ইউআরএল স্লাগ (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fSlug}
                    onChange={(e) => setFSlug(e.target.value)}
                    placeholder="যেমন: bogra-special-doi"
                    className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Pricing: Original vs Flash Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">
                    নিয়মিত মূল্য (Original Price ৳)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fOriginalPrice}
                    onChange={(e) => setFOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-bold bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-rose-700 mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-rose-600 fill-current" />
                    ফ্ল্যাশ রেট (Flash Rate ৳) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fPrice}
                    onChange={(e) => setFPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-rose-400 text-sm font-black text-rose-600 bg-white focus:outline-none"
                  />
                </div>

                {fOriginalPrice > fPrice && (
                  <div className="col-span-full pt-1 text-xs font-bold text-emerald-700 flex items-center justify-between">
                    <span>
                      ছাড়: {toBnDigits(Math.round(((fOriginalPrice - fPrice) / fOriginalPrice) * 100))}%
                    </span>
                    <span>
                      প্রতি ইউনিটে সাশ্রয়: ৳ {toBnDigits(fOriginalPrice - fPrice)}
                    </span>
                  </div>
                )}
              </div>

              {/* Unit & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    প্যাকেজিং / ইউনিট
                  </label>
                  <input
                    type="text"
                    value={fUnit}
                    onChange={(e) => setFUnit(e.target.value)}
                    placeholder="যেমন: ১ কেজি মাটির সরা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    ব্যাজ টেক্সট
                  </label>
                  <input
                    type="text"
                    value={fBadge}
                    onChange={(e) => setFBadge(e.target.value)}
                    placeholder="যেমন: ফ্ল্যাশ সেল, হট ডিল"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Total Stock & Sold Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    মোট স্টক লিমিট (Total Stock)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={fTotalStock}
                    onChange={(e) => setFTotalStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বিক্রি হওয়া সংখ্যা (Sold Count)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={fSoldCount}
                    onChange={(e) => setFSoldCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Image Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পণ্যের ছবি নির্বাচন করুন
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_FLASH_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFImage(img.url)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                        fImage === img.url
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={fImage}
                  onChange={(e) => setFImage(e.target.value)}
                  placeholder="/Product/doi.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono focus:outline-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-900 block">
                    ফ্ল্যাশ ডিল লাইভ রাখুন (Active Deal)
                  </span>
                  <span className="text-[11px] text-stone-500">
                    সক্রিয় থাকলে অফার পেজ ও হোম পেজের ফ্ল্যাশ সেকশনে পণ্যটি প্রদর্শিত হবে
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFIsActive(!fIsActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    fIsActive ? "bg-rose-600" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      fIsActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsFlashModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-amber-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition"
                >
                  {editingFlashDeal ? "আপডেট সংরক্ষণ করুন" : "ফ্ল্যাশ ডিল যুক্ত করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 9. DELETE CONFIRMATION MODAL ─────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-stone-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">মুছে ফেলতে চান?</h3>
              <p className="text-xs text-stone-500 mt-1">
                আপনি কি নিশ্চিত যে &ldquo;{deleteTarget.title}&rdquo; স্থায়ীভাবে মুছে ফেলতে চান?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
