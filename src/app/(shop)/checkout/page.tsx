"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  ChevronRight,
  ShoppingBag,
  Banknote,
  Smartphone,
  CheckCircle2,
  Tag,
  Lock,
  User,
  Phone,
  MapPin,
  Home,
  Building2,
  Check,
  X,
  AlertCircle,
  Pencil,
  StickyNote,
  ShoppingCart,
  Award,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PROMO_CODES, evaluatePromo, isPromoExpired, type PromoCodeItem } from "@/data/promos";
import { toBnDigits } from "@/lib/bangla";

const DELIVERY_OPTIONS = {
  inside: { label: "ঢাকার ভেতরে", note: "২৪ ঘণ্টার মধ্যে ডেলিভারি", fee: 60, icon: Home },
  outside: { label: "ঢাকার বাইরে", note: "৪৮–৭২ ঘণ্টায় ডেলিভারি", fee: 120, icon: Building2 },
} as const;

const PAYMENT_OPTIONS = {
  cod: { label: "ক্যাশ অন ডেলিভারি", note: "পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন", icon: Banknote },
  online: { label: "বিকাশ / নগদ", note: "মোবাইল ব্যাংকিংয়ে নিরাপদ অগ্রিম পেমেন্ট", icon: Smartphone },
} as const;

type DeliveryArea = keyof typeof DELIVERY_OPTIONS;
type PaymentMethod = keyof typeof PAYMENT_OPTIONS;

const FREE_DELIVERY_THRESHOLD = 3000;

const BD_PHONE = /^(\+?88)?01[3-9]\d{8}$/;
const normalizePhone = (v: string) => v.replace(/[\s-]/g, "");

const formatTaka = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

const cardClass = "rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]";

const inputClass =
  "w-full rounded-xl bg-white pl-11 pr-4 py-3.5 text-sm text-doibrand-dark placeholder-stone-400 ring-1 ring-stone-200 outline-none transition focus:ring-2 focus:ring-doibrand-gold/60 focus:shadow-[0_0_0_4px_rgba(196,138,78,0.12)]";

const subscribeToMinuteClock = (callback: () => void) => {
  const id = setInterval(callback, 60_000);
  return () => clearInterval(id);
};

/** Current time rounded to the minute on the client; null during server render. */
function useNowMinute() {
  return useSyncExternalStore(
    subscribeToMinuteClock,
    () => Math.floor(Date.now() / 60_000) * 60_000,
    () => null
  );
}

function SectionHeader({ step, title, subtitle }: { step: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pb-5 mb-6 border-b border-doibrand-gold/15">
      <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-linear-to-br from-doibrand-accent to-doibrand-gold text-sm font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(169,94,53,0.8)]">
        {step}
      </span>
      <div>
        <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        <p className="text-xs text-stone-500">{subtitle}</p>
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  note,
  aside,
  name,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ElementType;
  title: string;
  note: string;
  aside?: React.ReactNode;
  name: string;
}) {
  return (
    <label
      className={`relative flex items-center gap-3.5 rounded-2xl p-4 cursor-pointer transition ${
        selected
          ? "bg-[#FFF9F1] ring-2 ring-doibrand-gold shadow-[0_10px_24px_-16px_rgba(169,94,53,0.8)]"
          : "bg-white ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
      }`}
    >
      <input type="radio" name={name} checked={selected} onChange={onSelect} className="sr-only" />
      <span
        className={`w-5 h-5 shrink-0 grid place-items-center rounded-full transition ${
          selected ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white" : "ring-2 ring-stone-300"
        }`}
      >
        {selected && <Check className="w-3 h-3" strokeWidth={3.5} />}
      </span>
      <span
        className={`w-10 h-10 shrink-0 grid place-items-center rounded-xl ${
          selected ? "bg-white text-doibrand-accent ring-1 ring-doibrand-gold/30" : "bg-stone-50 text-stone-500"
        }`}
      >
        <Icon className="w-5 h-5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-[11px] text-stone-500">{note}</span>
      </span>
      {aside}
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, openCart } = useCart();
  const now = useNowMinute();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("inside");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeItem | null>(null);
  const [couponError, setCouponError] = useState("");

  const insideDhaka = deliveryArea === "inside";
  const promoCtx = { items, subtotal, insideDhaka, now: now ?? 0 };

  // Re-evaluate the applied promo on every render so cart or delivery changes keep the discount honest.
  const promoResult = appliedPromo ? evaluatePromo(appliedPromo.code, promoCtx) : null;
  const activePromo = promoResult?.ok ? promoResult : null;
  const promoInvalidated = appliedPromo !== null && promoResult !== null && !promoResult.ok;

  const baseDeliveryFee = DELIVERY_OPTIONS[deliveryArea].fee;
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const isDeliveryFree = qualifiesForFreeDelivery || Boolean(activePromo?.freeDelivery);
  const deliveryFee = isDeliveryFree ? 0 : baseDeliveryFee;
  const couponDiscount = activePromo?.discount ?? 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);
  const totalSavings = couponDiscount + (isDeliveryFree ? baseDeliveryFee : 0);
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const suggestedPromos = now === null ? [] : PROMO_CODES.filter((p) => !isPromoExpired(p, now)).slice(0, 4);

  const applyCoupon = (code: string) => {
    const result = evaluatePromo(code, promoCtx);
    if (result.ok) {
      setAppliedPromo(result.promo);
      setCouponCode(result.promo.code);
      setCouponError("");
    } else {
      setAppliedPromo(null);
      setCouponError(result.error);
    }
  };

  const removeCoupon = () => {
    setAppliedPromo(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!BD_PHONE.test(normalizePhone(phoneNumber))) {
      setPhoneError("সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)");
      document.getElementById("phone")?.focus();
      return;
    }
    setIsSubmitting(true);
    const orderId = `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      clearCart();
      const params = new URLSearchParams({
        orderId,
        total: String(grandTotal),
        payment: paymentMethod,
        name: fullName || "সম্মানিত গ্রাহক",
        area: deliveryArea,
      });
      router.push(`/checkout/success?${params.toString()}`);
    }, 900);
  };

  const steps = [
    { label: "কার্ট", done: true },
    { label: "তথ্য ও পেমেন্ট", active: true },
    { label: "কনফার্মেশন" },
  ];

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-[70vh] bg-doibrand-light text-doibrand-dark font-bengali px-4 py-16 grid place-items-center">
        <div className={`${cardClass} max-w-md w-full p-8 sm:p-10 text-center`}>
          <span className="mx-auto w-20 h-20 grid place-items-center rounded-full bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-8 ring-[#FBF1E4]">
            <ShoppingCart className="w-9 h-9" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold">আপনার কার্ট খালি</h1>
          <p className="mt-2 text-sm text-stone-500">চেকআউট করতে প্রথমে পছন্দের পণ্য কার্টে যোগ করুন।</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-6 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-12px_rgba(169,94,53,0.95)]"
          >
            <ShoppingBag className="w-4 h-4" />
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali pb-40 lg:pb-0">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -top-24 -right-16 w-80 h-80 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-doibrand-accent transition-colors">
              সকল পণ্য
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">চেকআউট</span>
          </nav>

          <div className="relative mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-3xl sm:text-[40px] font-extrabold leading-tight tracking-tight">
                নিরাপদ{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  চেকআউট
                </span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-stone-600">দ্রুত ডেলিভারির জন্য আপনার সঠিক তথ্য প্রদান করুন</p>
            </div>

            <ol className="flex items-center gap-2" aria-label="Checkout steps">
              {steps.map((step, i) => (
                <li key={step.label} className="flex items-center gap-2">
                  {i > 0 && <span className={`w-6 sm:w-10 h-0.5 rounded-full ${step.done || step.active ? "bg-doibrand-gold" : "bg-stone-300"}`} />}
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`w-7 h-7 grid place-items-center rounded-full text-[11px] font-bold ${
                        step.done
                          ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white"
                          : step.active
                          ? "bg-white text-doibrand-accent ring-2 ring-doibrand-gold"
                          : "bg-white/70 text-stone-400 ring-1 ring-stone-200"
                      }`}
                    >
                      {step.done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : toBnDigits(i + 1)}
                    </span>
                    <span className={`hidden sm:inline text-xs font-semibold ${step.done || step.active ? "text-doibrand-dark" : "text-stone-400"}`}>
                      {step.label}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Info */}
            <div className={`${cardClass} p-5 sm:p-7`}>
              <SectionHeader step="১" title="ডেলিভারি তথ্য" subtitle="আপনার নাম, মোবাইল নম্বর ও সঠিক ঠিকানা দিন" />

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold">
                    আপনার নাম <span className="text-doibrand-accent">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-doibrand-gold pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="পূর্ণ নাম লিখুন"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold">
                      মোবাইল নম্বর <span className="text-doibrand-accent">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-doibrand-gold pointer-events-none" />
                      <input
                        id="phone"
                        type="tel"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="01XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPhoneError("");
                        }}
                        aria-invalid={Boolean(phoneError)}
                        className={`${inputClass} font-sans ${phoneError ? "ring-red-300" : ""}`}
                      />
                    </div>
                    {phoneError && <p className="mt-1.5 text-[11px] font-medium text-red-600">{phoneError}</p>}
                  </div>
                  <div>
                    <label htmlFor="altPhone" className="mb-1.5 block text-xs font-semibold">
                      বিকল্প মোবাইল নম্বর <span className="text-stone-400 font-normal">(ঐচ্ছিক)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                      <input
                        id="altPhone"
                        type="tel"
                        inputMode="tel"
                        placeholder="01XXXXXXXXX"
                        value={altPhoneNumber}
                        onChange={(e) => setAltPhoneNumber(e.target.value)}
                        className={`${inputClass} font-sans`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="mb-1.5 block text-xs font-semibold">
                    সম্পূর্ণ ঠিকানা <span className="text-doibrand-accent">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-doibrand-gold pointer-events-none" />
                    <textarea
                      id="address"
                      rows={3}
                      required
                      autoComplete="street-address"
                      placeholder="বাসা/ফ্ল্যাট নং, রোড, এলাকা, থানা, জেলা"
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <fieldset className="pt-1">
                  <legend className="mb-3 text-xs font-semibold">ডেলিভারি এরিয়া</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(DELIVERY_OPTIONS) as DeliveryArea[]).map((key) => {
                      const opt = DELIVERY_OPTIONS[key];
                      return (
                        <OptionCard
                          key={key}
                          name="deliveryArea"
                          selected={deliveryArea === key}
                          onSelect={() => setDeliveryArea(key)}
                          icon={opt.icon}
                          title={opt.label}
                          note={opt.note}
                          aside={<span className="shrink-0 text-sm font-extrabold text-doibrand-accent font-sans">৳{opt.fee}</span>}
                        />
                      );
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="notes" className="mb-1.5 block text-xs font-semibold">
                    বিশেষ নির্দেশনা <span className="text-stone-400 font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <div className="relative">
                    <StickyNote className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                    <input
                      id="notes"
                      type="text"
                      placeholder="যেমন: বিকেল ৫টার পর ডেলিভারি দিন"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={`${cardClass} p-5 sm:p-7`}>
              <SectionHeader step="২" title="পেমেন্ট মেথড" subtitle="আপনার সুবিধাজনক পেমেন্ট মাধ্যম বেছে নিন" />
              <div className="space-y-3">
                <OptionCard
                  name="paymentMethod"
                  selected={paymentMethod === "cod"}
                  onSelect={() => setPaymentMethod("cod")}
                  icon={PAYMENT_OPTIONS.cod.icon}
                  title={PAYMENT_OPTIONS.cod.label}
                  note={PAYMENT_OPTIONS.cod.note}
                  aside={
                    <span className="hidden sm:inline rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/70">
                      জনপ্রিয়
                    </span>
                  }
                />
                <OptionCard
                  name="paymentMethod"
                  selected={paymentMethod === "online"}
                  onSelect={() => setPaymentMethod("online")}
                  icon={PAYMENT_OPTIONS.online.icon}
                  title={PAYMENT_OPTIONS.online.label}
                  note={PAYMENT_OPTIONS.online.note}
                  aside={
                    <span className="flex items-center gap-1 shrink-0">
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-black text-[#E2136E] ring-1 ring-stone-200 font-sans">bKash</span>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-black text-[#F7931E] ring-1 ring-stone-200 font-sans">Nagad</span>
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32">
            <div className={`${cardClass} overflow-hidden`}>
              <div className="flex items-center justify-between gap-3 bg-linear-to-r from-[#FFF3E3] to-[#FBEBD2] px-5 sm:px-6 py-4 border-b border-doibrand-gold/15">
                <h3 className="flex items-center gap-2 text-base font-bold">
                  <ShoppingBag className="w-5 h-5 text-doibrand-gold" />
                  অর্ডার সারাংশ
                </h3>
                <button
                  type="button"
                  onClick={openCart}
                  className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold text-doibrand-accent ring-1 ring-doibrand-gold/25 hover:bg-white transition cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  এডিট
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="relative w-14 h-14 shrink-0">
                        <span className="absolute inset-0 overflow-hidden rounded-xl bg-[#F5EDE3] ring-1 ring-stone-200/70">
                          <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                        </span>
                        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-doibrand-dark text-[10px] font-bold text-white ring-2 ring-white">
                          {toBnDigits(item.quantity)}
                        </span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        {item.unit && <p className="text-[11px] text-stone-500">{item.unit}</p>}
                      </div>
                      <span className="shrink-0 text-sm font-bold font-sans">{formatTaka(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                {/* Coupon */}
                <div className="mt-5 pt-5 border-t border-doibrand-gold/15">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
                    <Tag className="w-3.5 h-3.5 text-doibrand-gold" />
                    কুপন কোড
                  </p>
                  {appliedPromo && !promoInvalidated ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 ring-1 ring-emerald-200">
                      <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>
                          <span className="font-sans font-bold">{appliedPromo.code}</span> প্রয়োগ হয়েছে —{" "}
                          {activePromo?.freeDelivery ? "ফ্রি ডেলিভারি" : `৳${couponDiscount.toLocaleString("en-US")} ছাড়`}
                        </span>
                      </span>
                      <button type="button" onClick={removeCoupon} aria-label="Remove coupon" className="p-1 text-emerald-700/60 hover:text-red-500 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center rounded-xl bg-white p-1 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-doibrand-gold/50 transition">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            setCouponError("");
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              applyCoupon(couponCode);
                            }
                          }}
                          placeholder="কুপন কোড লিখুন"
                          aria-label="Coupon code"
                          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-sans uppercase tracking-wider outline-none placeholder:normal-case placeholder:tracking-normal placeholder:font-bengali"
                        />
                        <button
                          type="button"
                          onClick={() => applyCoupon(couponCode)}
                          className="shrink-0 rounded-lg bg-doibrand-dark px-4 py-2 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors cursor-pointer"
                        >
                          প্রয়োগ
                        </button>
                      </div>
                      {(couponError || promoInvalidated) && (
                        <p className="mt-2 flex items-start gap-1.5 text-[11px] text-red-600">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                          {couponError || (promoResult && !promoResult.ok ? promoResult.error : "")}
                        </p>
                      )}
                      {suggestedPromos.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {suggestedPromos.map((promo) => (
                            <button
                              key={promo.id}
                              type="button"
                              onClick={() => applyCoupon(promo.code)}
                              title={promo.condition}
                              className="rounded-lg border border-dashed border-doibrand-gold/50 bg-[#FFF9F1] px-2.5 py-1 text-[10px] font-bold text-doibrand-accent font-sans hover:border-doibrand-gold transition cursor-pointer"
                            >
                              {promo.code}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Totals */}
                <dl className="mt-5 pt-5 border-t border-doibrand-gold/15 space-y-2.5 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <dt>সাবটোটাল</dt>
                    <dd className="font-semibold text-doibrand-dark font-sans">{formatTaka(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <dt>ডেলিভারি চার্জ</dt>
                    <dd className="font-semibold text-doibrand-dark font-sans">
                      {isDeliveryFree ? (
                        <>
                          <span className="mr-1.5 text-stone-400 line-through">{formatTaka(baseDeliveryFee)}</span>
                          <span className="text-emerald-600">ফ্রি</span>
                        </>
                      ) : (
                        formatTaka(deliveryFee)
                      )}
                    </dd>
                  </div>
                  {amountToFreeDelivery > 0 && !activePromo?.freeDelivery && (
                    <p className="flex items-center gap-1.5 rounded-xl bg-[#FFF9F1] px-3 py-2 text-[11px] text-doibrand-accent ring-1 ring-doibrand-gold/20">
                      <Truck className="w-3.5 h-3.5 shrink-0" />
                      আর ৳{amountToFreeDelivery.toLocaleString("en-US")} কেনাকাটা করলেই ফ্রি ডেলিভারি!
                    </p>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between font-semibold text-emerald-600">
                      <dt>কুপন ছাড়</dt>
                      <dd className="font-sans">- {formatTaka(couponDiscount)}</dd>
                    </div>
                  )}
                  <div className="flex items-end justify-between pt-4 border-t border-dashed border-doibrand-gold/30">
                    <dt>
                      <span className="block font-bold">সর্বমোট</span>
                      {totalSavings > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-600">আপনি সাশ্রয় করছেন ৳{totalSavings.toLocaleString("en-US")}</span>
                      )}
                    </dt>
                    <dd className="text-3xl font-black bg-linear-to-br from-doibrand-dark via-doibrand-accent to-doibrand-gold bg-clip-text text-transparent font-sans">
                      {formatTaka(grandTotal)}
                    </dd>
                  </div>
                </dl>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="hidden lg:flex mt-6 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-4 text-base font-bold text-white shadow-[0_16px_32px_-14px_rgba(169,94,53,0.95)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-75 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  {isSubmitting ? "অর্ডার সম্পন্ন হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
                </button>

                <p className="mt-3 text-center text-[11px] text-stone-400">
                  অর্ডার কনফার্ম করে আপনি আমাদের{" "}
                  <Link href="/terms" className="font-semibold text-doibrand-accent hover:underline">
                    শর্তাবলী
                  </Link>{" "}
                  ও{" "}
                  <Link href="/return-policy" className="font-semibold text-doibrand-accent hover:underline">
                    রিটার্ন পলিসি
                  </Link>{" "}
                  মেনে নিচ্ছেন।
                </p>

                <div className="mt-5 pt-5 border-t border-doibrand-gold/15 grid grid-cols-3 gap-2 text-center">
                  {[
                    { icon: Truck, text: "দ্রুত ডেলিভারি" },
                    { icon: Award, text: "১০০% খাঁটি পণ্য" },
                    { icon: ShieldCheck, text: "নিরাপদ পেমেন্ট" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex flex-col items-center gap-1.5">
                      <span className="w-9 h-9 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-semibold text-stone-600">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Sticky Confirm Bar */}
        <div className="lg:hidden fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 px-3 pb-2">
          <div className="flex items-center gap-3 rounded-2xl bg-white/90 backdrop-blur-xl p-2 pl-4 ring-1 ring-doibrand-gold/25 shadow-[0_-10px_30px_-12px_rgba(53,28,27,0.35)]">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-stone-500">সর্বমোট</p>
              <p className="text-lg font-extrabold text-doibrand-accent font-sans leading-tight">{formatTaka(grandTotal)}</p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(169,94,53,0.95)] disabled:opacity-75"
            >
              {isSubmitting ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : <Lock className="w-4 h-4" />}
              অর্ডার কনফার্ম
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
