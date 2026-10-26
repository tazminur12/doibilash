"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Wallet,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Heart,
  Zap,
  PhoneCall,
  Sparkles,
  Package,
  Clock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ui/ProductCard";
import { CATEGORY_MAP, type CategoryProduct } from "@/data/categories";
import type { ProductDetail } from "@/data/products";
import { toBnDigits } from "@/lib/bangla";

const TABS = [
  { id: "description", label: "বিবরণ" },
  { id: "features", label: "বৈশিষ্ট্য" },
  { id: "delivery", label: "ডেলিভারি ও পেমেন্ট" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ASSURANCES = [
  { icon: Truck, title: "দ্রুত ডেলিভারি", text: "ঢাকায় ২৪ ঘণ্টায়" },
  { icon: ShieldCheck, title: "১০০% খাঁটি", text: "গুণমানের নিশ্চয়তা" },
  { icon: Wallet, title: "ক্যাশ অন ডেলিভারি", text: "হাতে পেয়ে মূল্য পরিশোধ" },
  { icon: RotateCcw, title: "সহজ রিটার্ন", text: "সমস্যা হলে সমাধান" },
];

const DELIVERY_INFO = [
  { icon: Clock, title: "ডেলিভারি সময়", text: "ঢাকা সিটিতে ২৪ ঘণ্টার মধ্যে, ঢাকার বাইরে ৪৮–৭২ ঘণ্টায় এয়ার-কুলড কুরিয়ারে।" },
  { icon: Wallet, title: "পেমেন্ট", text: "ক্যাশ অন ডেলিভারি, বিকাশ ও নগদের মাধ্যমে নিরাপদ অগ্রিম পেমেন্ট।" },
  { icon: Package, title: "নিরাপদ প্যাকেজিং", text: "কুশনযুক্ত প্যাকেজিং; পরিবহনে পাত্র ভাঙলে বিনামূল্যে নতুন পাঠানো বা সম্পূর্ণ রিফান্ড।" },
];

const formatTaka = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

function GalleryImage({
  src,
  alt,
  sizes,
  preload,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (failedSrc === src) {
    return (
      <span className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#FBEBD2] via-[#F3D7AE] to-[#E2B57C]">
        <span className="text-6xl font-bold text-white/85 select-none">{Array.from(alt)[0]}</span>
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
}

export default function ProductDetailView({
  product,
  related,
}: {
  product: ProductDetail;
  related: CategoryProduct[];
}) {
  const router = useRouter();
  const { addItem, openCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const category = product.categorySlug ? CATEGORY_MAP[product.categorySlug] : undefined;
  const images = product.images.length > 0 ? product.images : ["/Product/doi.jpg"];
  const currentImage = images[activeImageIndex] ?? images[0];
  const savings = Math.max(0, product.originalPrice - product.price);
  const discountPercent = product.originalPrice > 0 ? Math.round((savings / product.originalPrice) * 100) : 0;

  const cartItem = {
    id: product.slug,
    title: product.title,
    price: product.price,
    priceText: formatTaka(product.price),
    image: images[0],
    unit: product.unit,
  };

  const handleAddToCart = () => {
    addItem(cartItem, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
    openCart();
  };

  const handleBuyNow = () => {
    addItem(cartItem, quantity);
    router.push("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url });
        return;
      } catch {
        // fall through to copying the link when the share sheet is dismissed or unavailable
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing else to do
    }
  };

  const stepImage = (delta: number) =>
    setActiveImageIndex((i) => (i + delta + images.length) % images.length);

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali pb-40 md:pb-0">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-500 overflow-hidden">
          <Link href="/" className="shrink-0 hover:text-doibrand-accent transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          {category ? (
            <Link href={`/category/${category.slug}`} className="shrink-0 hover:text-doibrand-accent transition-colors">
              {category.name}
            </Link>
          ) : (
            <Link href="/shop" className="shrink-0 hover:text-doibrand-accent transition-colors">
              সকল পণ্য
            </Link>
          )}
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate font-semibold text-doibrand-accent">{product.title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 space-y-3">
            <div className="relative rounded-[28px] p-1.5 bg-linear-to-br from-[#F3DDB8] via-white to-[#EFCF9E] shadow-[0_30px_60px_-36px_rgba(169,94,53,0.7)]">
              <div className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-[#F5EDE3]">
                <GalleryImage
                  key={currentImage}
                  src={currentImage}
                  alt={product.title}
                  sizes="(max-width: 1024px) 100vw, 600px"
                  preload
                  className="transition-transform duration-700 ease-out group-hover:scale-105 animate-header-fade-up"
                />

                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-linear-to-r from-[#D9534F] to-doibrand-accent px-3 py-1.5 text-xs font-extrabold text-white shadow-lg">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {toBnDigits(discountPercent)}% ছাড়
                  </span>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted((v) => !v)}
                    aria-pressed={isWishlisted}
                    aria-label="Add to wishlist"
                    className={`w-10 h-10 grid place-items-center rounded-full bg-white/90 backdrop-blur shadow-md transition cursor-pointer ${
                      isWishlisted ? "text-red-500" : "text-stone-500 hover:text-red-500"
                    }`}
                  >
                    <Heart className={`w-[18px] h-[18px] ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share product"
                    className="relative w-10 h-10 grid place-items-center rounded-full bg-white/90 backdrop-blur text-stone-500 hover:text-doibrand-accent shadow-md transition cursor-pointer"
                  >
                    {shareCopied ? <Check className="w-[18px] h-[18px] text-emerald-600" /> : <Share2 className="w-[18px] h-[18px]" />}
                    {shareCopied && (
                      <span className="absolute right-12 whitespace-nowrap rounded-full bg-doibrand-dark px-2.5 py-1 text-[10px] font-semibold text-white">
                        লিংক কপি হয়েছে
                      </span>
                    )}
                  </button>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => stepImage(-1)}
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/85 backdrop-blur text-doibrand-dark shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => stepImage(1)}
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/85 backdrop-blur text-doibrand-dark shadow-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-4 right-4 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-white">
                      {toBnDigits(activeImageIndex + 1)} / {toBnDigits(images.length)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar">
                {images.map((img, index) => {
                  const isActive = activeImageIndex === index;
                  return (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative w-20 h-20 shrink-0 overflow-hidden rounded-2xl bg-[#F5EDE3] transition cursor-pointer ${
                        isActive
                          ? "ring-2 ring-doibrand-gold ring-offset-2 ring-offset-doibrand-light"
                          : "ring-1 ring-stone-200 opacity-70 hover:opacity-100 hover:ring-doibrand-gold/50"
                      }`}
                    >
                      <GalleryImage src={img} alt={`${product.title} ${index + 1}`} sizes="80px" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {product.inStock ? "স্টকে আছে" : "স্টক শেষ"}
                </span>
                {product.unit && (
                  <span className="rounded-full bg-[#FBF1E4] px-3 py-1 text-[11px] font-bold text-doibrand-accent ring-1 ring-doibrand-gold/25">
                    {product.unit}
                  </span>
                )}
                {category && (
                  <Link
                    href={`/category/${category.slug}`}
                    className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40 transition"
                  >
                    {category.name}
                  </Link>
                )}
              </div>

              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-doibrand-gold">
                {product.englishTitle}
              </p>
              <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-[40px] font-extrabold leading-tight tracking-tight">
                {product.title}
              </h1>

              {product.rating && (
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 fill-current ${i < Math.round(product.rating ?? 0) ? "text-doibrand-gold" : "text-stone-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{toBnDigits(product.rating.toFixed(1))}</span>
                  {product.reviewsCount && (
                    <span className="text-xs text-stone-500">({toBnDigits(product.reviewsCount)}টি রিভিউ)</span>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-5 sm:p-6 ring-1 ring-doibrand-gold/20 shadow-[0_18px_40px_-28px_rgba(169,94,53,0.6)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <span className="text-4xl sm:text-5xl font-black leading-none bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent font-sans">
                  {formatTaka(product.price)}
                </span>
                {savings > 0 && (
                  <>
                    <span className="pb-1 text-lg text-stone-400 line-through font-sans">{formatTaka(product.originalPrice)}</span>
                    <span className="mb-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white">
                      ৳{savings.toLocaleString("en-US")} সাশ্রয়
                    </span>
                  </>
                )}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-500">
                <Truck className="w-3.5 h-3.5 text-doibrand-gold" />
                ঢাকায় ২৪ ঘণ্টায় · সারাদেশে ৪৮–৭২ ঘণ্টায় হোম ডেলিভারি
              </p>
            </div>

            <p className="text-sm sm:text-[15px] leading-relaxed text-stone-600">{product.description}</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 rounded-xl bg-white/70 px-3 py-2.5 ring-1 ring-stone-200/70 text-[13px] text-stone-700">
                  <span className="mt-0.5 w-4 h-4 shrink-0 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-white">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  {feat}
                </li>
              ))}
            </ul>

            {/* Quantity + Actions */}
            <div className="rounded-3xl bg-white p-4 sm:p-5 ring-1 ring-stone-200/70 shadow-[0_14px_34px_-26px_rgba(53,28,27,0.45)] space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">পরিমাণ</span>
                  <div className="flex items-center rounded-full bg-[#FBF1E4] p-1 ring-1 ring-doibrand-gold/25">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-9 h-9 grid place-items-center rounded-full bg-white text-doibrand-accent shadow-sm disabled:opacity-40 transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-10 text-center text-base font-extrabold tabular-nums">{toBnDigits(quantity)}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-9 h-9 grid place-items-center rounded-full bg-white text-doibrand-accent shadow-sm transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-stone-500">মোট মূল্য</p>
                  <p className="text-xl font-extrabold text-doibrand-accent font-sans">{formatTaka(product.price * quantity)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 sm:py-4 text-sm sm:text-base font-bold transition active:scale-[0.98] cursor-pointer ${
                    justAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/40 hover:bg-[#F6E4CC]"
                  }`}
                >
                  {justAdded ? <CheckCircle2 className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  {justAdded ? "যুক্ত হয়েছে" : "কার্টে যোগ করুন"}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-[0_14px_28px_-14px_rgba(169,94,53,0.95)] hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  এখনই অর্ডার করুন
                </button>
              </div>

              <a
                href="tel:+8801645460095"
                className="flex items-center justify-center gap-2 rounded-xl bg-stone-50 py-2.5 text-xs text-stone-600 hover:text-doibrand-accent transition"
              >
                <PhoneCall className="w-3.5 h-3.5 text-doibrand-gold" />
                ফোনে অর্ডার করতে কল করুন <span className="font-bold font-sans">01645-460095</span>
              </a>
            </div>

            {/* Assurances */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ASSURANCES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex flex-col items-center text-center gap-1.5 rounded-2xl bg-white/70 p-3 ring-1 ring-stone-200/70">
                  <span className="w-9 h-9 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="text-[12px] font-bold leading-tight">{title}</span>
                  <span className="text-[10px] text-stone-500 leading-tight">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="mt-10 md:mt-14 rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] overflow-hidden">
          <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto hide-scrollbar border-b border-doibrand-gold/15 px-3 sm:px-5 pt-3">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 px-4 py-3 text-sm font-bold transition cursor-pointer ${
                    active ? "text-doibrand-accent" : "text-stone-500 hover:text-doibrand-dark"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} className="p-5 sm:p-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="w-4 h-4 text-doibrand-gold" />
                  পণ্যের বিবরণ
                </h2>
                <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-stone-600">{product.description}</p>
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-doibrand-gold" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <dl className="divide-y divide-doibrand-gold/15 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 text-sm">
                  {[
                    { label: "পরিমাণ", value: product.unit },
                    { label: "ক্যাটাগরি", value: category?.name ?? "দই বিলাস স্পেশাল" },
                    { label: "প্রিজারভেটিভ", value: "নেই" },
                    { label: "প্রাপ্যতা", value: product.inStock ? "স্টকে আছে" : "স্টক শেষ" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 px-4 py-3">
                      <dt className="text-stone-500">{row.label}</dt>
                      <dd className="font-semibold text-doibrand-dark text-right">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DELIVERY_INFO.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/15">
                    <span className="w-10 h-10 grid place-items-center rounded-xl bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <p className="mt-3 text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-500">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-10 md:mt-14 pb-12 md:pb-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-2xl sm:text-[30px] font-extrabold tracking-tight">
                আরও{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  পছন্দ হতে পারে
                </span>
              </h2>
              <Link
                href={category ? `/category/${category.slug}` : "/shop"}
                className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
              >
                সব দেখুন
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Buy Bar (sits above the bottom navigation) */}
      <div className="md:hidden fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 px-3 pb-2">
        <div className="flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-xl p-2 pl-4 ring-1 ring-doibrand-gold/25 shadow-[0_-10px_30px_-12px_rgba(53,28,27,0.35)]">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-stone-500">মোট ({toBnDigits(quantity)}টি)</p>
            <p className="text-lg font-extrabold text-doibrand-accent font-sans leading-tight">{formatTaka(product.price * quantity)}</p>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="w-12 h-12 grid place-items-center rounded-xl bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/40"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="h-12 px-5 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(169,94,53,0.95)]"
          >
            <Zap className="w-4 h-4 fill-current" />
            অর্ডার করুন
          </button>
        </div>
      </div>
    </main>
  );
}
