"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  Copy,
  Check,
  Tag,
  Flame,
  ChevronRight,
  ShieldCheck,
  Percent,
  ShoppingBag,
  TicketPercent,
  ArrowDown,
  CalendarX2,
} from "lucide-react";
import ProductCard, { ProductItem } from "@/components/ui/ProductCard";
import { toBnDigits } from "@/lib/bangla";
import {
  StoredPromoCode,
  StoredFlashDeal,
  CampaignSettings,
  getStoredPromos,
  getStoredFlashDeals,
  getStoredCampaignSettings,
  DEFAULT_PROMOS,
  DEFAULT_FLASH_DEALS,
  DEFAULT_CAMPAIGN_SETTINGS,
  OFFERS_UPDATED_EVENT,
} from "@/lib/offerStorage";

const HOW_TO_STEPS = [
  { icon: Copy, title: "কোড কপি করুন", text: "পছন্দের প্রোমো কোডের পাশে কপি বাটনে চাপুন" },
  { icon: ShoppingBag, title: "কার্টে পণ্য যোগ করুন", text: "শর্ত অনুযায়ী পণ্য বেছে কার্টে যোগ করুন" },
  { icon: TicketPercent, title: "চেকআউটে কোড বসান", text: "পেমেন্টের আগে কোডটি বসিয়ে ছাড় নিন" },
];

const expiryTime = (promo: StoredPromoCode) => (promo.expiresAt ? new Date(promo.expiresAt).getTime() : null);

const subscribeToClock = (callback: () => void) => {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
};

/** Current time in whole seconds on the client; null during server render. */
function useNowSeconds() {
  return useSyncExternalStore(
    subscribeToClock,
    () => Math.floor(Date.now() / 1000),
    () => null
  );
}

const pad2 = (n: number) => toBnDigits(String(n).padStart(2, "0"));

export default function SpecialOffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const nowSeconds = useNowSeconds();
  const now = nowSeconds === null ? null : nowSeconds * 1000;

  const [promos, setPromos] = useState<StoredPromoCode[]>(DEFAULT_PROMOS);
  const [flashDeals, setFlashDeals] = useState<StoredFlashDeal[]>(DEFAULT_FLASH_DEALS);
  const [campaign, setCampaign] = useState<CampaignSettings>(DEFAULT_CAMPAIGN_SETTINGS);

  useEffect(() => {
    const refresh = () => {
      setPromos(getStoredPromos());
      setFlashDeals(getStoredFlashDeals());
      setCampaign(getStoredCampaignSettings());
    };
    refresh();
    window.addEventListener(OFFERS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(OFFERS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const isExpired = (promo: StoredPromoCode) => {
    const t = expiryTime(promo);
    return now !== null && t !== null && t < now;
  };

  const activePromos = promos.filter((p) => p.isActive !== false && !isExpired(p));

  const campaignEnd = campaign.campaignEnd
    ? new Date(campaign.campaignEnd).getTime()
    : Math.max(...activePromos.map((p) => expiryTime(p) ?? 0), 0);

  const remainingMs = now === null || campaignEnd === 0 ? null : Math.max(0, campaignEnd - now);

  const countdown =
    remainingMs === null
      ? null
      : {
          days: Math.floor(remainingMs / 86_400_000),
          hours: Math.floor((remainingMs / 3_600_000) % 24),
          minutes: Math.floor((remainingMs / 60_000) % 60),
          seconds: Math.floor((remainingMs / 1000) % 60),
        };

  const campaignEndLabel =
    activePromos.find((p) => expiryTime(p) === campaignEnd)?.expiry ||
    (campaign.campaignEnd
      ? new Date(campaign.campaignEnd).toLocaleDateString("bn-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const timeUnits = [
    { label: "দিন", value: countdown?.days },
    { label: "ঘণ্টা", value: countdown?.hours },
    { label: "মিনিট", value: countdown?.minutes },
    { label: "সেকেন্ড", value: countdown?.seconds },
  ];

  const activeFlashDeals = flashDeals.filter((d) => d.isActive !== false);

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FBE3C4] via-[#FFF6EA] to-[#F3C89A] ring-1 ring-doibrand-gold/25 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.7)] px-5 py-8 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -top-24 -left-20 w-96 h-96 rounded-full bg-white/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-10 w-96 h-96 rounded-full bg-[#E9A874]/30 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/70 to-transparent" />
          <Percent className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block w-72 h-72 text-doibrand-accent/[0.07]" strokeWidth={1.25} />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">স্পেশাল অফার</span>
          </nav>

          <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] items-center gap-8">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {campaign.badge || "মেগা ডিসকাউন্ট উৎসব"}
              </span>
              <h1 className="mt-4 text-4xl sm:text-[52px] font-extrabold leading-[1.1] tracking-tight">
                {campaign.title || "স্পেশাল"}{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  {campaign.highlightText || "ধামাকা অফার"}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-stone-600">
                {campaign.description || "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ভাউচার কোড উপভোগ করুন।"}
              </p>

              {campaign.announcementText && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/70 border border-doibrand-gold/40 px-3.5 py-1.5 text-xs font-semibold text-doibrand-dark">
                  <Sparkles className="w-3.5 h-3.5 text-doibrand-accent shrink-0" />
                  <span>{campaign.announcementText}</span>
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#promo-codes"
                  className="inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-6 py-3 text-sm font-bold text-doibrand-light shadow-[0_12px_26px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  প্রোমো কোড দেখুন
                </a>
                <a
                  href="#flash-sale"
                  className="inline-flex items-center gap-2 rounded-full bg-white/85 px-6 py-3 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
                >
                  <Flame className="w-4 h-4" />
                  ফ্ল্যাশ সেল
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Countdown */}
            <div className="rounded-3xl bg-white/75 backdrop-blur-md p-5 sm:p-6 ring-1 ring-white shadow-[0_20px_44px_-28px_rgba(169,94,53,0.7)]">
              <p className="flex items-center gap-2 text-xs sm:text-sm font-bold text-doibrand-accent">
                <Clock className="w-4 h-4" />
                অফার শেষ হতে বাকি
              </p>
              <div className="mt-4 flex items-start gap-1.5 sm:gap-2">
                {timeUnits.map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    {i > 0 && <span className="pt-3 text-xl font-bold text-doibrand-gold/60">:</span>}
                    <div className="text-center">
                      <div className="w-14 sm:w-[68px] rounded-2xl bg-linear-to-b from-white to-[#FBF1E4] py-3 ring-1 ring-doibrand-gold/25 shadow-[0_8px_18px_-12px_rgba(169,94,53,0.7)]">
                        <span
                          className={`block text-2xl sm:text-[28px] font-black tabular-nums leading-none ${
                            i === 3
                              ? "bg-linear-to-b from-[#D9534F] to-doibrand-accent bg-clip-text text-transparent"
                              : "text-doibrand-dark"
                          }`}
                        >
                          {unit.value === undefined ? "--" : pad2(unit.value)}
                        </span>
                      </div>
                      <span className="mt-1.5 block text-[10px] font-medium text-stone-500">{unit.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {campaignEndLabel && (
                <p className="mt-4 pt-4 border-t border-doibrand-gold/15 text-[11px] text-stone-500">
                  মেগা অফার চলবে <span className="font-semibold text-doibrand-dark">{campaignEndLabel}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promo Codes */}
        <section id="promo-codes" className="scroll-mt-36 pt-12 md:pt-16">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent">
                <TicketPercent className="w-3.5 h-3.5 text-doibrand-gold" />
                ভাউচার কালেকশন
              </span>
              <h2 className="mt-3 text-2xl sm:text-[32px] font-extrabold tracking-tight leading-tight">
                অ্যাক্টিভ{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  প্রোমো কোড
                </span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
                চেকআউটের সময় কোডটি কপি করে বসিয়ে অতিরিক্ত ছাড় নিশ্চিত করুন
              </p>
            </div>
            <span className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {toBnDigits(activePromos.length)}টি ভাউচার সচল
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {promos
              .filter((p) => p.isActive !== false)
              .map((promo) => {
                const isCopied = copiedCode === promo.code;
                const expired = isExpired(promo);
                return (
                  <div
                    key={promo.id}
                    className={`group relative flex overflow-hidden rounded-2xl bg-white ring-1 transition-all duration-300 ${
                      expired
                        ? "ring-stone-200 opacity-60 grayscale"
                        : "ring-doibrand-gold/25 shadow-[0_12px_30px_-22px_rgba(169,94,53,0.6)] hover:-translate-y-1 hover:ring-doibrand-gold/50 hover:shadow-[0_22px_40px_-24px_rgba(169,94,53,0.65)]"
                    }`}
                  >
                    {/* Ticket Stub */}
                    <div className="relative w-28 sm:w-32 shrink-0 flex flex-col items-center justify-center gap-1 bg-linear-to-br from-doibrand-accent via-[#B9733F] to-doibrand-gold px-3 py-5 text-center text-white">
                      <Percent className="absolute top-2 left-2 w-10 h-10 text-white/10" />
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/75">অফার</span>
                      <span className="text-xl font-extrabold leading-tight">{promo.discount}</span>
                    </div>

                    {/* Perforation */}
                    <div className="relative w-0 border-l-2 border-dashed border-doibrand-gold/30">
                      <span className="absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-doibrand-light" />
                      <span className="absolute -bottom-2.5 -left-2.5 w-5 h-5 rounded-full bg-doibrand-light" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 p-4 flex flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-[#FBF1E4] px-2.5 py-0.5 text-[10px] font-bold text-doibrand-accent ring-1 ring-doibrand-gold/20">
                          {promo.tag}
                        </span>
                        {expired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
                            <CalendarX2 className="w-3 h-3" />
                            মেয়াদ শেষ
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 truncate">{promo.expiry}</span>
                        )}
                      </div>
                      <p className="mt-2.5 text-sm font-bold text-doibrand-dark leading-snug">{promo.description}</p>
                      <p className="mt-0.5 text-[11px] text-stone-500">{promo.condition}</p>

                      <div className="mt-auto pt-4 flex items-center gap-2">
                        <span className="flex-1 min-w-0 truncate rounded-lg border border-dashed border-doibrand-gold/50 bg-[#FFF9F1] px-3 py-2 text-center font-mono text-sm font-bold tracking-wider text-doibrand-accent select-all">
                          {promo.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(promo.code)}
                          disabled={expired}
                          aria-label={`Copy code ${promo.code}`}
                          className={`shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition cursor-pointer disabled:cursor-not-allowed ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-doibrand-dark text-doibrand-light hover:bg-doibrand-accent disabled:bg-stone-300"
                          }`}
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {isCopied ? "কপি হয়েছে" : "কপি"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* How To Use */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] p-4 sm:p-5 ring-1 ring-doibrand-gold/20">
            {HOW_TO_STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex items-start gap-3">
                <span className="relative shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 shadow-sm">
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-[10px] font-bold text-white">
                    {toBnDigits(i + 1)}
                  </span>
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-stone-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sale */}
        <section id="flash-sale" className="scroll-mt-36 pt-12 md:pt-16">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                স্টক সীমিত
              </span>
              <h2 className="mt-3 text-2xl sm:text-[32px] font-extrabold tracking-tight leading-tight">
                ফ্ল্যাশ{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  সেল ও বিশেষ রেট
                </span>
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-500">
                স্টক ফুরানোর আগেই অর্ডার করুন — প্রিমিয়াম আইটেমগুলিতে সর্বোচ্চ মূল্যছাড়
              </p>
            </div>
            <Link
              href="/shop"
              className="group hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-4 py-2 text-sm font-semibold text-doibrand-accent hover:bg-doibrand-dark hover:text-doibrand-light hover:border-doibrand-dark transition-all"
            >
              সব পণ্য দেখুন
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {activeFlashDeals.map((product) => {
              const soldPercentage = Math.round((product.soldCount / product.totalStock) * 100);
              const left = Math.max(0, product.totalStock - product.soldCount);
              const cardProduct: ProductItem = {
                id: product.id,
                slug: product.slug,
                title: product.title,
                price: `৳ ${product.price}`,
                originalPrice: `৳ ${product.originalPrice}`,
                unit: product.unit,
                badge: product.badge,
                image: product.image,
              };

              return (
                <div key={product.id} className="flex flex-col gap-2">
                  <ProductCard product={cardProduct} />
                  <div className="rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-stone-200/70">
                    <div className="mb-1.5 flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">
                        বিক্রি <span className="font-bold text-doibrand-dark">{toBnDigits(soldPercentage)}%</span>
                      </span>
                      <span className="inline-flex items-center gap-0.5 font-bold text-[#C0392B]">
                        <Flame className="w-3 h-3" />
                        {toBnDigits(left)}টি বাকি
                      </span>
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-[#F5E6D3]">
                      <div
                        className="relative h-full overflow-hidden rounded-full bg-linear-to-r from-doibrand-gold to-doibrand-accent"
                        style={{ width: `${Math.min(100, soldPercentage)}%` }}
                      >
                        <span className="absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent animate-header-shine" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Terms */}
        <section className="py-12 md:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#F6E2C3] via-[#FFF6EA] to-[#EFD2A6] ring-1 ring-doibrand-gold/25 p-5 sm:p-7 shadow-[0_14px_36px_-24px_rgba(169,94,53,0.55)]">
            <ShieldCheck className="pointer-events-none absolute -right-6 -bottom-8 w-40 h-40 text-doibrand-gold/15 rotate-12" strokeWidth={1.25} />
            <div className="relative flex flex-col md:flex-row items-center gap-5">
              <span className="shrink-0 w-14 h-14 grid place-items-center rounded-2xl bg-white/80 text-doibrand-accent ring-1 ring-doibrand-gold/30 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg sm:text-xl font-bold">অফারের শর্তাবলী ও খাঁটি পণ্যের অঙ্গীকার</h3>
                <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-stone-600">
                  ভাউচার কোডগুলো শুধুমাত্র নির্দিষ্ট মেয়াদে এবং নির্ধারিত ন্যূনতম ক্রয়ে কার্যকর হবে। স্টক থাকা সাপেক্ষে প্রতিটি অফার প্রযোজ্য। যেকোনো সহায়তার জন্য আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।
                </p>
              </div>
              <Link
                href="/shop"
                className="group shrink-0 inline-flex items-center gap-2 rounded-full bg-doibrand-dark px-6 py-3 text-sm font-bold text-doibrand-light shadow-[0_10px_24px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
              >
                শপিং শুরু করুন
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
