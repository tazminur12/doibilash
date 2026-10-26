"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Search,
  Package,
  Loader2,
  Truck,
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Phone,
  PhoneCall,
  CalendarDays,
  AlertCircle,
  Hash,
  RotateCcw,
  Wallet,
  Clock,
  Headset,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toBnDigits } from "@/lib/bangla";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "active" | "upcoming";

interface TrackingStepDef {
  id: string;
  labelBn: string;
  label: string;
  icon: React.ElementType;
}

interface StepUpdate {
  timestamp?: string;
  description: string;
}

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface DummyOrderData {
  id: string;
  phone: string;
  date: string;
  estimatedDelivery: string;
  activeStepIndex: number;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryCharge: number;
  items: OrderItem[];
  updates: StepUpdate[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TRACKING_STEPS: TrackingStepDef[] = [
  { id: "placed", labelBn: "অর্ডার গ্রহণ", label: "Order Placed", icon: ShoppingBag },
  { id: "processing", labelBn: "প্রস্তুত করা হচ্ছে", label: "Processing", icon: Package },
  { id: "shipped", labelBn: "পাঠানো হয়েছে", label: "Shipped", icon: Truck },
  { id: "delivered", labelBn: "ডেলিভার হয়েছে", label: "Delivered", icon: CheckCircle2 },
];

const UPCOMING_DESCRIPTIONS = [
  "অর্ডার নিশ্চিত হওয়ার অপেক্ষায়।",
  "পণ্যটি যত্নসহকারে প্যাক করা হবে।",
  "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হবে।",
  "আপনার পণ্যটি শীঘ্রই পৌঁছে যাবে।",
];

// Dummy lookup map — in production this would be an API call
const DUMMY_ORDERS: Record<string, DummyOrderData> = {
  "DB-1029": {
    id: "#DB-1029",
    phone: "01700000000",
    date: "১৫ অক্টোবর, ২০২৬",
    estimatedDelivery: "১৭ অক্টোবর, ২০২৬",
    activeStepIndex: 2,
    deliveryAddress: "বাড়ি #২২, রোড #৫, ধানমন্ডি, ঢাকা-১২০৫",
    paymentMethod: "ক্যাশ অন ডেলিভারি",
    deliveryCharge: 60,
    items: [
      { name: "বগুড়ার স্পেশাল সরার দই", qty: 2, price: 500 },
      { name: "খাঁটি গাওয়া ঘি", qty: 1, price: 1450 },
    ],
    updates: [
      { timestamp: "১৫ অক্টোবর, ৯:৩০ AM", description: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।" },
      { timestamp: "১৫ অক্টোবর, ১১:০০ AM", description: "আপনার পণ্যটি কোল্ড-চেইন প্যাকেজিংয়ে প্যাক করা হয়েছে।" },
      { timestamp: "১৬ অক্টোবর, ২:০০ PM", description: "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হয়েছে, পথে রয়েছে।" },
    ],
  },
  "DB-1024": {
    id: "#DB-1024",
    phone: "01700000000",
    date: "১০ অক্টোবর, ২০২৬",
    estimatedDelivery: "১২ অক্টোবর, ২০২৬",
    activeStepIndex: 3,
    deliveryAddress: "বাড়ি #৮, সেক্টর #৪, উত্তরা, ঢাকা-১২৩০",
    paymentMethod: "বিকাশ (পরিশোধিত)",
    deliveryCharge: 60,
    items: [
      { name: "সুন্দরবনের প্রাকৃতিক মধু", qty: 1, price: 850 },
      { name: "প্রিমিয়াম খোরমা খেজুর", qty: 2, price: 750 },
    ],
    updates: [
      { timestamp: "১০ অক্টোবর, ১০:১৫ AM", description: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।" },
      { timestamp: "১০ অক্টোবর, ১:৪০ PM", description: "আপনার পণ্যটি প্যাক করা হয়েছে।" },
      { timestamp: "১১ অক্টোবর, ৯:০০ AM", description: "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হয়েছে।" },
      { timestamp: "১২ অক্টোবর, ১১:৩০ AM", description: "আপনার পণ্যটি সফলভাবে পৌঁছে দেওয়া হয়েছে। ধন্যবাদ!" },
    ],
  },
};

const DEMO = { orderId: "DB-1029", phone: "01700000000" };

const HIGHLIGHTS = [
  { icon: Clock, text: "প্রতিটি ধাপের রিয়েল-টাইম আপডেট" },
  { icon: Truck, text: "ঢাকায় ২৪ ঘণ্টায় ডেলিভারি" },
  { icon: Headset, text: "যেকোনো সমস্যায় হেল্পলাইন" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStepStatus(stepIndex: number, activeIndex: number, isDelivered: boolean): StepStatus {
  if (stepIndex < activeIndex || (isDelivered && stepIndex === activeIndex)) return "completed";
  if (stepIndex === activeIndex) return "active";
  return "upcoming";
}

const normalizeOrderId = (raw: string) => {
  const digits = raw.trim().toUpperCase().replace(/^#?\s*(DB)?\s*-?\s*/, "");
  return digits ? `DB-${digits}` : "";
};

const normalizePhone = (raw: string) => raw.replace(/[\s-]/g, "").replace(/^(\+?88)/, "");

const formatTaka = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<DummyOrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError("অনুগ্রহ করে অর্ডার আইডি এবং ফোন নম্বর দিন।");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrderData(null);

    // Simulate network delay
    setTimeout(() => {
      const found = DUMMY_ORDERS[normalizeOrderId(orderId)];

      if (found && found.phone === normalizePhone(phone)) {
        setOrderData(found);
      } else if (found) {
        setError("ফোন নম্বরটি এই অর্ডারের সাথে মেলেনি। পুনরায় চেষ্টা করুন।");
      } else {
        setError("অর্ডারটি খুঁজে পাওয়া যায়নি। অর্ডার আইডি যাচাই করুন।");
      }
      setIsLoading(false);
    }, 900);
  };

  const resetSearch = () => {
    setOrderData(null);
    setOrderId("");
    setPhone("");
    setError(null);
  };

  const isDelivered = orderData ? orderData.activeStepIndex === TRACKING_STEPS.length - 1 : false;
  const progressPercent = orderData
    ? isDelivered
      ? 100
      : Math.round(((orderData.activeStepIndex + 0.5) / (TRACKING_STEPS.length - 1)) * 100)
    : 0;
  const subtotal = orderData ? orderData.items.reduce((sum, i) => sum + i.qty * i.price, 0) : 0;

  const inputClass =
    "w-full rounded-xl bg-white pl-11 pr-4 py-3.5 text-sm text-doibrand-dark placeholder-stone-400 ring-1 ring-stone-200 outline-none transition focus:ring-2 focus:ring-doibrand-gold/60 focus:shadow-[0_0_0_4px_rgba(196,138,78,0.12)]";

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Hero + Form */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)] px-5 py-8 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-[#F7D9B0]/50 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
          <Truck className="pointer-events-none absolute left-1/3 -bottom-10 hidden lg:block w-56 h-56 text-doibrand-gold/10 -rotate-6" strokeWidth={1} />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">অর্ডার ট্র্যাক</span>
          </nav>

          <div className="relative mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] items-center gap-8 lg:gap-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
                <Sparkles className="w-3.5 h-3.5" />
                লাইভ অর্ডার স্ট্যাটাস
              </span>
              <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                অর্ডার{" "}
                <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                  ট্র্যাক করুন
                </span>
              </h1>
              <p className="mt-3 max-w-md text-sm sm:text-base leading-relaxed text-stone-600">
                অর্ডার আইডি ও ফোন নম্বর দিয়ে আপনার প্রিয় দই ও মিষ্টান্ন এখন কোথায় আছে জেনে নিন।
              </p>
              <ul className="mt-6 space-y-2.5">
                {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-stone-700">
                    <span className="w-8 h-8 grid place-items-center rounded-lg bg-white/80 text-doibrand-accent ring-1 ring-doibrand-gold/25 shadow-sm">
                      <Icon className="w-4 h-4" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form Card */}
            <div className="rounded-3xl bg-white/85 backdrop-blur-md p-5 sm:p-7 ring-1 ring-white shadow-[0_24px_50px_-30px_rgba(169,94,53,0.7)]">
              <h2 className="text-lg font-bold">আপনার অর্ডার খুঁজুন</h2>
              <p className="mt-1 mb-5 text-xs text-stone-500">অর্ডার কনফার্মেশনে দেওয়া আইডি ব্যবহার করুন</p>

              <form onSubmit={handleTrack} noValidate className="space-y-4">
                <div>
                  <label htmlFor="order-id-input" className="mb-1.5 block text-xs font-semibold">
                    অর্ডার আইডি
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-doibrand-gold pointer-events-none" />
                    <input
                      id="order-id-input"
                      type="text"
                      value={orderId}
                      onChange={(e) => {
                        setOrderId(e.target.value);
                        setError(null);
                      }}
                      placeholder="যেমন: DB-1029"
                      autoComplete="off"
                      className={`${inputClass} font-sans uppercase placeholder:normal-case`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone-input" className="mb-1.5 block text-xs font-semibold">
                    মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-doibrand-gold pointer-events-none" />
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setError(null);
                      }}
                      placeholder="01XXXXXXXXX"
                      autoComplete="tel"
                      className={`${inputClass} font-sans`}
                    />
                  </div>
                </div>

                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600 ring-1 ring-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                    {error}
                  </div>
                )}

                <button
                  id="track-order-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-14px_rgba(169,94,53,0.95)] hover:brightness-110 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {isLoading ? "খোঁজা হচ্ছে..." : "ট্র্যাক করুন"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setOrderId(DEMO.orderId);
                  setPhone(DEMO.phone);
                  setError(null);
                }}
                className="mt-4 w-full rounded-xl bg-[#FFF9F1] px-4 py-2.5 text-[11px] text-stone-500 border border-dashed border-doibrand-gold/40 hover:border-doibrand-gold/70 transition cursor-pointer"
              >
                ডেমো দেখতে চাপুন: <span className="font-sans font-bold text-doibrand-accent">{DEMO.orderId}</span> ·{" "}
                <span className="font-sans font-bold text-doibrand-accent">{DEMO.phone}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Result */}
      {orderData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 animate-header-fade-up">
          {/* Summary + Progress */}
          <div className="rounded-3xl bg-white p-5 sm:p-7 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[11px] text-stone-500">অর্ডার আইডি</p>
                <p className="mt-0.5 text-2xl font-extrabold font-sans tracking-tight">{orderData.id}</p>
                <p className="mt-1 text-xs text-stone-500">অর্ডারের তারিখ: {orderData.date}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ring-1 ${
                    isDelivered
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-[#FBF1E4] text-doibrand-accent ring-doibrand-gold/30"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isDelivered ? "bg-emerald-500" : "bg-doibrand-gold animate-pulse"}`} />
                  {TRACKING_STEPS[orderData.activeStepIndex].labelBn}
                </span>
                <p className="flex items-center gap-1.5 text-xs text-stone-500">
                  <CalendarDays className="w-3.5 h-3.5 text-doibrand-gold" />
                  {isDelivered ? "ডেলিভারি সম্পন্ন" : "প্রত্যাশিত ডেলিভারি"}:{" "}
                  <span className="font-bold text-doibrand-dark">{orderData.estimatedDelivery}</span>
                </p>
              </div>
            </div>

            {/* Horizontal Progress */}
            <div className="relative mt-8 px-2 sm:px-6">
              <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1.5 rounded-full bg-[#F5E6D3]" />
              <div
                className="absolute left-[12.5%] top-5 h-1.5 rounded-full bg-linear-to-r from-doibrand-gold to-doibrand-accent transition-[width] duration-1000"
                style={{ width: `${progressPercent * 0.75}%` }}
              />
              <ol className="relative grid grid-cols-4" aria-label="অর্ডার ট্র্যাকিং স্টেপস">
                {TRACKING_STEPS.map((step, idx) => {
                  const status = getStepStatus(idx, orderData.activeStepIndex, isDelivered);
                  const Icon = step.icon;
                  return (
                    <li key={step.id} className="flex flex-col items-center text-center">
                      <span
                        className={`relative w-11 h-11 grid place-items-center rounded-full transition ${
                          status === "completed"
                            ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white shadow-[0_8px_18px_-8px_rgba(169,94,53,0.8)]"
                            : status === "active"
                            ? "bg-white text-doibrand-accent ring-4 ring-doibrand-gold/40 shadow-lg"
                            : "bg-white text-stone-300 ring-1 ring-stone-200"
                        }`}
                      >
                        {status === "completed" ? <Check className="w-5 h-5" strokeWidth={3} /> : <Icon className="w-5 h-5" />}
                        {status === "active" && (
                          <span className="absolute inset-0 rounded-full ring-2 ring-doibrand-gold/40 animate-ping" />
                        )}
                      </span>
                      <span
                        className={`mt-3 text-[11px] sm:text-xs font-bold leading-tight ${
                          status === "upcoming" ? "text-stone-400" : "text-doibrand-dark"
                        }`}
                      >
                        {step.labelBn}
                      </span>
                      <span className="mt-0.5 hidden sm:block text-[10px] text-stone-400 font-sans">{step.label}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5 pb-12 md:pb-16">
            {/* Detailed Timeline */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-5 sm:p-7 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <Clock className="w-5 h-5 text-doibrand-gold" />
                অর্ডারের আপডেট
              </h3>
              <ol className="mt-6">
                {TRACKING_STEPS.map((step, idx) => {
                  const status = getStepStatus(idx, orderData.activeStepIndex, isDelivered);
                  const update = orderData.updates[idx];
                  const Icon = step.icon;
                  const isLast = idx === TRACKING_STEPS.length - 1;
                  return (
                    <li key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
                      {!isLast && (
                        <span
                          className={`absolute left-[19px] top-11 bottom-1 w-0.5 rounded-full ${
                            status === "completed" ? "bg-linear-to-b from-doibrand-gold to-doibrand-accent" : "bg-stone-200"
                          }`}
                        />
                      )}
                      <span
                        className={`relative shrink-0 w-10 h-10 grid place-items-center rounded-full ${
                          status === "completed"
                            ? "bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white"
                            : status === "active"
                            ? "bg-[#FBF1E4] text-doibrand-accent ring-2 ring-doibrand-gold/50"
                            : "bg-stone-100 text-stone-300"
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <div className={`flex-1 min-w-0 pt-1 ${status === "active" ? "rounded-2xl bg-[#FFF9F1] -mt-1 p-3 ring-1 ring-doibrand-gold/20" : ""}`}>
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                          <p className={`text-sm font-bold ${status === "upcoming" ? "text-stone-400" : "text-doibrand-dark"}`}>
                            {step.labelBn}
                            {status === "active" && (
                              <span className="ml-2 rounded-full bg-doibrand-gold/15 px-2 py-0.5 text-[10px] font-bold text-doibrand-accent">
                                বর্তমান
                              </span>
                            )}
                          </p>
                          {update?.timestamp && status !== "upcoming" && (
                            <span className="text-[11px] text-stone-400">{update.timestamp}</span>
                          )}
                        </div>
                        <p className={`mt-1 text-xs leading-relaxed ${status === "upcoming" ? "text-stone-400" : "text-stone-600"}`}>
                          {status === "upcoming" ? UPCOMING_DESCRIPTIONS[idx] : update?.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Side Cards */}
            <div className="space-y-5">
              <div className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <MapPin className="w-4 h-4 text-doibrand-gold" />
                  ডেলিভারি ঠিকানা
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{orderData.deliveryAddress}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-500">
                  <Wallet className="w-3.5 h-3.5 text-doibrand-gold" />
                  পেমেন্ট: <span className="font-semibold text-doibrand-dark">{orderData.paymentMethod}</span>
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <ShoppingBag className="w-4 h-4 text-doibrand-gold" />
                  অর্ডারকৃত পণ্য
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {orderData.items.map((item) => (
                    <li key={item.name} className="flex items-start justify-between gap-3 text-sm">
                      <span className="min-w-0">
                        <span className="block font-medium text-doibrand-dark">{item.name}</span>
                        <span className="text-[11px] text-stone-400">
                          {toBnDigits(item.qty)} × <span className="font-sans">{formatTaka(item.price)}</span>
                        </span>
                      </span>
                      <span className="shrink-0 font-bold font-sans">{formatTaka(item.qty * item.price)}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-1.5 border-t border-dashed border-doibrand-gold/30 pt-3 text-xs">
                  <div className="flex justify-between text-stone-500">
                    <dt>সাবটোটাল</dt>
                    <dd className="font-sans">{formatTaka(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <dt>ডেলিভারি চার্জ</dt>
                    <dd className="font-sans">{formatTaka(orderData.deliveryCharge)}</dd>
                  </div>
                  <div className="flex justify-between pt-1.5 text-sm font-extrabold text-doibrand-dark">
                    <dt>সর্বমোট</dt>
                    <dd className="font-sans text-doibrand-accent">{formatTaka(subtotal + orderData.deliveryCharge)}</dd>
                  </div>
                </dl>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-5 ring-1 ring-doibrand-gold/20">
                <h3 className="flex items-center gap-2 text-sm font-bold">
                  <Headset className="w-4 h-4 text-doibrand-gold" />
                  সাহায্য প্রয়োজন?
                </h3>
                <p className="mt-1 text-xs text-stone-500">অর্ডার নিয়ে যেকোনো প্রশ্নে আমাদের টিম পাশে আছে।</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href="tel:+8801645460095"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-doibrand-dark py-2.5 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    কল করুন
                  </a>
                  <a
                    href={`https://wa.me/8801645460095?text=${encodeURIComponent(`আমার অর্ডার ${orderData.id} সম্পর্কে জানতে চাই।`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-[#FBF1E4] transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={resetSearch}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-white py-3 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-[#FBF1E4] transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                অন্য অর্ডার ট্র্যাক করুন
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Help Strip (before a result is shown) */}
      {!orderData && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Hash, title: "অর্ডার আইডি দিন", text: "অর্ডার কনফার্মেশনে পাওয়া আইডিটি লিখুন" },
              { icon: Phone, title: "মোবাইল নম্বর দিন", text: "অর্ডারের সময় দেওয়া নম্বরটি ব্যবহার করুন" },
              { icon: Truck, title: "লাইভ স্ট্যাটাস দেখুন", text: "আপনার পার্সেল কোন ধাপে আছে জেনে নিন" },
            ].map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70 shadow-[0_10px_28px_-22px_rgba(53,28,27,0.4)]">
                <span className="relative shrink-0 w-11 h-11 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                  <Icon className="w-5 h-5" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-[10px] font-bold text-white">
                    {toBnDigits(i + 1)}
                  </span>
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-xs text-stone-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-stone-500">
            সমস্যা হচ্ছে?{" "}
            <Link href="/contact" className="font-semibold text-doibrand-accent hover:underline">
              আমাদের সাথে যোগাযোগ করুন
            </Link>
          </p>
        </section>
      )}
    </main>
  );
}
