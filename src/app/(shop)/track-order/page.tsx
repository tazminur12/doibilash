"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Search,
  Package,
  Loader2,
  Clock,
  Truck,
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Phone,
  CalendarDays,
  AlertCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type StepStatus = "completed" | "active" | "upcoming";

interface TrackingStep {
  id: string;
  labelBn: string;
  label: string;
  icon: React.ElementType;
  timestamp?: string;
  description?: string;
}

interface DummyOrderData {
  id: string;
  phone: string;
  date: string;
  estimatedDelivery: string;
  activeStepIndex: number;
  deliveryAddress: string;
  items: { name: string; qty: number }[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const TRACKING_STEPS: TrackingStep[] = [
  {
    id: "placed",
    labelBn: "অর্ডার গ্রহণ",
    label: "Order Placed",
    icon: ShoppingBag,
    timestamp: "১৫ অক্টোবর, ৯:৩০ AM",
    description: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।",
  },
  {
    id: "processing",
    labelBn: "প্রস্তুত করা হচ্ছে",
    label: "Processing",
    icon: Package,
    timestamp: "১৫ অক্টোবর, ১১:০০ AM",
    description: "আপনার পণ্যটি প্যাক করা হচ্ছে।",
  },
  {
    id: "shipped",
    labelBn: "পাঠানো হয়েছে",
    label: "Shipped",
    icon: Truck,
    timestamp: "১৬ অক্টোবর, ২:০০ PM",
    description: "পণ্যটি ডেলিভারি টিমের কাছে হস্তান্তর করা হয়েছে।",
  },
  {
    id: "delivered",
    labelBn: "ডেলিভার হয়েছে",
    label: "Delivered",
    icon: CheckCircle2,
    timestamp: "",
    description: "আপনার পণ্যটি পৌঁছে যাবে শীঘ্রই।",
  },
];

// Dummy lookup map — in production this would be an API call
const DUMMY_ORDERS: Record<string, DummyOrderData> = {
  "DB-1029": {
    id: "#DB-1029",
    phone: "01700000000",
    date: "১৫ অক্টোবর, ২০২৬",
    estimatedDelivery: "১৭ অক্টোবর, ২০২৬",
    activeStepIndex: 2, // "Shipped" is the active step
    deliveryAddress: "বাড়ি #২২, রোড #৫, ধানমন্ডি, ঢাকা-১২০৫",
    items: [
      { name: "বগুড়ার স্পেশাল সরার দই", qty: 2 },
      { name: "খাঁটি গাওয়া ঘি", qty: 1 },
    ],
  },
  "DB-1024": {
    id: "#DB-1024",
    phone: "01700000000",
    date: "১০ অক্টোবর, ২০২৬",
    estimatedDelivery: "১২ অক্টোবর, ২০২৬",
    activeStepIndex: 3, // "Delivered"
    deliveryAddress: "বাড়ি #৮, সেক্টর #৪, উত্তরা, ঢাকা-১২৩০",
    items: [
      { name: "সুন্দরবনের প্রাকৃতিক মধু", qty: 1 },
      { name: "প্রিমিয়াম খোরমা খেজুর", qty: 2 },
    ],
  },
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function getStepStatus(stepIndex: number, activeIndex: number): StepStatus {
  if (stepIndex < activeIndex) return "completed";
  if (stepIndex === activeIndex) return "active";
  return "upcoming";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TimelineNodeProps {
  step: TrackingStep;
  status: StepStatus;
  isLast: boolean;
}

function TimelineNode({ step, status, isLast }: TimelineNodeProps) {
  const Icon = step.icon;

  const nodeClasses =
    status === "completed"
      ? "bg-doibrand-gold text-white shadow-md shadow-doibrand-gold/30"
      : status === "active"
      ? "border-4 border-doibrand-gold bg-white text-doibrand-gold shadow-md shadow-doibrand-gold/20"
      : "bg-gray-200 text-gray-400";

  const labelClasses =
    status === "completed"
      ? "text-doibrand-dark font-semibold"
      : status === "active"
      ? "text-doibrand-gold font-bold"
      : "text-gray-400";

  const connectorClasses =
    status === "completed"
      ? "bg-doibrand-gold"
      : "bg-gray-200";

  return (
    <div className="flex flex-col items-center flex-1 relative">
      {/* Connecting line (right side, skip for last item) */}
      {!isLast && (
        <div
          className={`absolute top-5 left-1/2 w-full h-1 ${connectorClasses} transition-colors duration-500 z-0`}
          aria-hidden="true"
        />
      )}

      {/* Circular node */}
      <div
        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${nodeClasses}`}
      >
        {status === "completed" ? (
          <Check className="w-5 h-5 stroke-[2.5]" />
        ) : (
          <Icon className="w-4.5 h-4.5" />
        )}

        {/* Active pulse ring */}
        {status === "active" && (
          <span className="absolute inset-0 rounded-full animate-ping border-2 border-doibrand-gold/40 pointer-events-none" />
        )}
      </div>

      {/* Label + timestamp */}
      <div className="mt-3 text-center px-1">
        <p className={`text-[11px] font-bengali leading-snug ${labelClasses}`}>
          {step.labelBn}
        </p>
        <p className="text-[9px] text-gray-400 font-sans mt-0.5 leading-tight">
          {step.label}
        </p>
        {step.timestamp && status !== "upcoming" && (
          <p className="text-[9px] text-gray-400 font-bengali mt-1 leading-tight">
            {step.timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<DummyOrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
      const normalizedId = orderId.trim().toUpperCase().replace(/^#?DB-?/i, "DB-");
      const found = DUMMY_ORDERS[normalizedId];

      if (found && found.phone === phone.trim()) {
        setOrderData(found);
        setError(null);
      } else if (found) {
        setError("ফোন নম্বরটি এই অর্ডারের সাথে মেলেনি। পুনরায় চেষ্টা করুন।");
      } else {
        setError("অর্ডারটি খুঁজে পাওয়া যায়নি। অর্ডার আইডি যাচাই করুন।");
      }

      setIsLoading(false);
      setHasSearched(true);
    }, 1200);
  };

  const activeStep = orderData ? TRACKING_STEPS[orderData.activeStepIndex] : null;

  return (
    <main className="min-h-[80vh] flex flex-col items-center py-12 px-4 bg-doibrand-light text-doibrand-dark">

      {/* Breadcrumb */}
      <div className="w-full max-w-2xl mb-6">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-bengali">
          <Link href="/" className="hover:text-doibrand-gold transition-colors">
            হোম
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-doibrand-dark font-semibold">অর্ডার ট্র্যাক</span>
        </nav>
      </div>

      {/* ── Main Card ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-md p-8 border border-gray-100 text-center">

        {/* Card Header Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-doibrand-light mx-auto mb-5 shadow-sm">
          <Truck className="w-8 h-8 text-doibrand-gold" />
        </div>

        {/* Title */}
        <h1 className="font-bengali text-3xl font-bold text-doibrand-dark mb-2">
          অর্ডার ট্র্যাক করুন
        </h1>
        <p className="text-sm text-gray-400 font-bengali mb-8">
          আপনার অর্ডার আইডি ও ফোন নম্বর দিয়ে ট্র্যাক করুন
        </p>

        {/* ── Tracking Form ──────────────────────────────────────────── */}
        <form onSubmit={handleTrack} noValidate>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            {/* Order ID */}
            <div className="flex-1 relative">
              <label
                htmlFor="order-id-input"
                className="sr-only"
              >
                অর্ডার আইডি
              </label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="order-id-input"
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError(null);
                }}
                placeholder="অর্ডার আইডি (যেমন: DB-1029)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-doibrand-gold focus:border-doibrand-gold text-sm font-bengali text-doibrand-dark placeholder-gray-400 transition-all duration-200 shadow-xs"
              />
            </div>

            {/* Phone */}
            <div className="flex-1 relative">
              <label htmlFor="phone-input" className="sr-only">
                ফোন নম্বর
              </label>
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError(null);
                }}
                placeholder="ফোন নম্বর (01700000000)"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-doibrand-gold focus:border-doibrand-gold text-sm font-bengali text-doibrand-dark placeholder-gray-400 transition-all duration-200 shadow-xs"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bengali bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            id="track-order-btn"
            type="submit"
            disabled={isLoading}
            className="bg-doibrand-dark text-white w-full py-3 rounded-xl hover:bg-doibrand-gold transition-colors font-bold font-bengali text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>খোঁজা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>ট্র্যাক করুন (Track Now)</span>
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        {!hasSearched && (
          <p className="mt-4 text-[11px] text-gray-400 font-bengali">
            ডেমো: অর্ডার আইডি{" "}
            <button
              type="button"
              onClick={() => { setOrderId("DB-1029"); setPhone("01700000000"); }}
              className="text-doibrand-gold underline cursor-pointer hover:text-doibrand-accent"
            >
              DB-1029
            </button>{" "}
            এবং ফোন{" "}
            <button
              type="button"
              onClick={() => { setOrderId("DB-1029"); setPhone("01700000000"); }}
              className="text-doibrand-gold underline cursor-pointer hover:text-doibrand-accent"
            >
              01700000000
            </button>{" "}
            দিয়ে চেষ্টা করুন
          </p>
        )}

        {/* ── Tracking Result ────────────────────────────────────────── */}
        {orderData && (
          <div className="mt-8 pt-8 border-t border-gray-100 text-left">

            {/* Order Meta */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
              <div>
                <p className="text-xs text-gray-400 font-bengali mb-0.5">অর্ডার আইডি</p>
                <p className="font-bold text-doibrand-dark text-lg font-sans tracking-tight">
                  {orderData.id}
                </p>
              </div>
              {/* Active step badge */}
              {activeStep && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-doibrand-light text-doibrand-gold border border-doibrand-gold/30 font-bengali">
                  <Clock className="w-3.5 h-3.5" />
                  {activeStep.labelBn}
                </span>
              )}
            </div>

            {/* ── Horizontal Timeline ─────────────────────────────────── */}
            <div
              className="relative flex items-start justify-between w-full mb-8 px-2"
              role="list"
              aria-label="অর্ডার ট্র্যাকিং স্টেপস"
            >
              {TRACKING_STEPS.map((step, idx) => (
                <TimelineNode
                  key={step.id}
                  step={step}
                  status={getStepStatus(idx, orderData.activeStepIndex)}
                  isLast={idx === TRACKING_STEPS.length - 1}
                />
              ))}
            </div>

            {/* Active step description banner */}
            {activeStep && (
              <div className="flex items-start gap-3 bg-doibrand-light border border-doibrand-gold/20 rounded-xl px-4 py-3.5 mb-6">
                <div className="w-8 h-8 rounded-full bg-doibrand-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <activeStep.icon className="w-4 h-4 text-doibrand-gold" />
                </div>
                <div>
                  <p className="text-sm font-bold font-bengali text-doibrand-dark">
                    {activeStep.labelBn}
                  </p>
                  <p className="text-xs text-gray-500 font-bengali mt-0.5">
                    {activeStep.description}
                  </p>
                </div>
              </div>
            )}

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Estimated Delivery */}
              <div className="bg-stone-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarDays className="w-4 h-4 text-doibrand-gold" />
                  <p className="text-[11px] text-gray-400 font-bengali uppercase tracking-wide">
                    প্রত্যাশিত ডেলিভারি
                  </p>
                </div>
                <p className="text-sm font-bold text-doibrand-dark font-bengali">
                  {orderData.estimatedDelivery}
                </p>
              </div>

              {/* Delivery Address */}
              <div className="bg-stone-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1.5">
                  <MapPin className="w-4 h-4 text-doibrand-gold" />
                  <p className="text-[11px] text-gray-400 font-bengali uppercase tracking-wide">
                    ডেলিভারি ঠিকানা
                  </p>
                </div>
                <p className="text-sm font-bold text-doibrand-dark font-bengali leading-snug">
                  {orderData.deliveryAddress}
                </p>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mt-4 bg-stone-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="w-4 h-4 text-doibrand-gold" />
                <p className="text-[11px] text-gray-400 font-bengali uppercase tracking-wide">
                  অর্ডারকৃত পণ্য
                </p>
              </div>
              <ul className="space-y-2">
                {orderData.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm font-bengali text-doibrand-dark"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-doibrand-gold shrink-0" />
                      {item.name}
                    </span>
                    <span className="text-xs text-gray-400">× {item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Track another order */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setOrderData(null);
                  setOrderId("");
                  setPhone("");
                  setHasSearched(false);
                  setError(null);
                }}
                className="text-xs font-semibold text-doibrand-gold hover:underline font-bengali cursor-pointer"
              >
                ← অন্য অর্ডার ট্র্যাক করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {!orderData && (
        <p className="mt-8 text-xs text-gray-400 font-bengali text-center">
          সমস্যা হচ্ছে?{" "}
          <Link href="/" className="text-doibrand-gold hover:underline font-semibold">
            আমাদের সাথে যোগাযোগ করুন
          </Link>
        </p>
      )}
    </main>
  );
}
