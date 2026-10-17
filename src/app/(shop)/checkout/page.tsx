"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Banknote,
  Smartphone,
  CheckCircle2,
  Tag,
  Lock,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [altPhoneNumber, setAltPhoneNumber] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Items fallback for demonstration when cart is empty
  const dummyItems = [
    {
      id: "dummy-1",
      title: "বগুড়ার স্পেশাল সরার দই (১ কেজি)",
      price: 500,
      image:
        "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=150&q=80",
      quantity: 1,
      unit: "১ কেজি সরা",
    },
    {
      id: "dummy-2",
      title: "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম)",
      price: 950,
      image:
        "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80",
      quantity: 1,
      unit: "৫০০ গ্রাম জার",
    },
  ];

  const checkoutItems = items.length > 0 ? items : dummyItems;
  const currentSubtotal =
    items.length > 0
      ? subtotal
      : checkoutItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  // Calculation
  const deliveryFee = deliveryArea === "inside" ? 60 : 120;
  const grandTotal = Math.max(0, currentSubtotal + deliveryFee - couponDiscount);

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const trimmed = couponCode.trim().toUpperCase();

    if (!trimmed) {
      setCouponError("দয়া করে একটি কুপন কোড লিখুন");
      return;
    }

    // Accept DOI10, DOI50, BILESH, or any custom coupon code
    const discountAmount = trimmed === "DOI50" ? 250 : 100;
    setCouponDiscount(discountAmount);
    setIsCouponApplied(true);
  };

  const handleRemoveCoupon = () => {
    setIsCouponApplied(false);
    setCouponDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Submit Order
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderId = `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    setTimeout(() => {
      if (clearCart && items.length > 0) {
        clearCart();
      }
      router.push(
        `/checkout/success?orderId=${generatedOrderId}&total=${grandTotal}&payment=${
          paymentMethod === "cod" ? "cod" : "online"
        }&name=${encodeURIComponent(fullName || "সম্মানিত গ্রাহক")}`
      );
    }, 900);
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-stone-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3.5">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/shop" className="hover:text-doibrand-gold transition-colors">
              মিষ্টির সম্ভার
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-doibrand-dark font-semibold">চেকআউট ও পেমেন্ট</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title & Secure Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark tracking-tight">
              চেকআউট ও অর্ডার কনফার্মেশন
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              নিরাপদ পেমেন্ট ও দ্রুত ডেলিভারির জন্য আপনার সঠিক তথ্য প্রদান করুন
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>২৫৬-বিট এনক্রিপ্টেড সিকিউর চেকআউট</span>
          </div>
        </div>

        {/* 2-Column Grid */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* ── Left Column (lg:col-span-7) - Billing & Payment ─────────── */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Section 1: 'ডেলিভারি ঠিকানা' (Delivery Address) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-doibrand-gold/15 text-doibrand-gold flex items-center justify-center font-bold text-sm">
                    ১
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-doibrand-dark">
                      ডেলিভারি ঠিকানা
                    </h2>
                    <p className="text-xs text-gray-500">
                      আপনার নাম ও সঠিক ডেলিভারি ঠিকানা প্রদান করুন
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Floating-label: Name */}
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder=" "
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="peer w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-xl p-4 pt-6 pb-2 text-sm text-doibrand-dark placeholder-transparent outline-none transition-all"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-2 text-xs font-semibold text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-doibrand-gold pointer-events-none"
                    >
                      আপনার নাম (Full Name) *
                    </label>
                  </div>

                  {/* Grid: Phone & Alternative Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Floating-label: Phone */}
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder=" "
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="peer w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-xl p-4 pt-6 pb-2 text-sm text-doibrand-dark font-sans placeholder-transparent outline-none transition-all"
                      />
                      <label
                        htmlFor="phone"
                        className="absolute left-4 top-2 text-xs font-semibold text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-doibrand-gold pointer-events-none"
                      >
                        ফোন নম্বর (Phone Number) *
                      </label>
                    </div>

                    {/* Floating-label: Alternative Phone */}
                    <div className="relative">
                      <input
                        id="altPhone"
                        type="tel"
                        placeholder=" "
                        value={altPhoneNumber}
                        onChange={(e) => setAltPhoneNumber(e.target.value)}
                        className="peer w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-xl p-4 pt-6 pb-2 text-sm text-doibrand-dark font-sans placeholder-transparent outline-none transition-all"
                      />
                      <label
                        htmlFor="altPhone"
                        className="absolute left-4 top-2 text-xs font-semibold text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-doibrand-gold pointer-events-none"
                      >
                        বিকল্প ফোন নম্বর (Alternative Phone - ঐচ্ছিক)
                      </label>
                    </div>
                  </div>

                  {/* Floating-label: Full Address */}
                  <div className="relative">
                    <textarea
                      id="address"
                      rows={3}
                      required
                      placeholder=" "
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      className="peer w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-xl p-4 pt-6 pb-2 text-sm text-doibrand-dark placeholder-transparent outline-none transition-all resize-none"
                    />
                    <label
                      htmlFor="address"
                      className="absolute left-4 top-2 text-xs font-semibold text-gray-500 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-doibrand-gold pointer-events-none"
                    >
                      সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/ফ্ল্যাট নং, রোড, এলাকা) *
                    </label>
                  </div>

                  {/* Delivery Area Selection */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-doibrand-dark mb-3">
                      ডেলিভারি এরিয়া নির্বাচন করুন
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div
                        onClick={() => setDeliveryArea("inside")}
                        className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          deliveryArea === "inside"
                            ? "border-doibrand-gold bg-doibrand-gold/5"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="deliveryArea"
                            checked={deliveryArea === "inside"}
                            onChange={() => setDeliveryArea("inside")}
                            className="text-doibrand-gold focus:ring-doibrand-gold cursor-pointer"
                          />
                          <div>
                            <p className="font-bold text-sm text-doibrand-dark">
                              ঢাকার ভেতরে
                            </p>
                            <p className="text-xs text-gray-500">
                              ২৪ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-doibrand-gold font-sans">
                          ৳ ৬০
                        </span>
                      </div>

                      <div
                        onClick={() => setDeliveryArea("outside")}
                        className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          deliveryArea === "outside"
                            ? "border-doibrand-gold bg-doibrand-gold/5"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="deliveryArea"
                            checked={deliveryArea === "outside"}
                            onChange={() => setDeliveryArea("outside")}
                            className="text-doibrand-gold focus:ring-doibrand-gold cursor-pointer"
                          />
                          <div>
                            <p className="font-bold text-sm text-doibrand-dark">
                              ঢাকার বাইরে
                            </p>
                            <p className="text-xs text-gray-500">
                              ২-৩ কার্যদিবসের মধ্যে ডেলিভারি
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-sm text-doibrand-gold font-sans">
                          ৳ ১২০
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Note */}
                  <div className="pt-2">
                    <input
                      type="text"
                      placeholder="অর্ডার সংক্রান্ত বিশেষ নির্দেশিকা (ঐচ্ছিক)"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-xl p-3.5 text-xs text-doibrand-dark placeholder-gray-400 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: 'পেমেন্ট মেথড' (Payment Method) */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-xl bg-doibrand-gold/15 text-doibrand-gold flex items-center justify-center font-bold text-sm">
                    ২
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-doibrand-dark">
                      পেমেন্ট মেথড
                    </h2>
                    <p className="text-xs text-gray-500">
                      আপনার সুবিধাজনক পেমেন্ট মাধ্যমটি বেছে নিন
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-doibrand-gold bg-doibrand-gold/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        id="payment-cod"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-doibrand-gold focus:ring-doibrand-gold cursor-pointer"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-doibrand-gold flex items-center justify-center shrink-0">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-doibrand-dark">
                            ক্যাশ অন ডেলিভারি (Cash on Delivery)
                          </p>
                          <p className="text-xs text-gray-500">
                            পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন
                          </p>
                        </div>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700">
                      জনপ্রিয়
                    </span>
                  </div>

                  {/* Option 2: Online Payment (bKash/Nagad) */}
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`border-2 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-doibrand-gold bg-doibrand-gold/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        id="payment-online"
                        name="paymentMethod"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="text-doibrand-gold focus:ring-doibrand-gold cursor-pointer"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-doibrand-dark">
                            অনলাইন পেমেন্ট (bKash / Nagad)
                          </p>
                          <p className="text-xs text-gray-500">
                            বিকাশ অথবা নগদ দিয়ে সম্পূর্ণ নিরাপদ পেমেন্ট
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Placeholder Icons for Payment Methods */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#D12053] text-white font-sans">
                        bKash
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#F7941D] text-white font-sans">
                        Nagad
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column (lg:col-span-5) - Order Summary & Coupon ──── */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 xl:p-8 top-24 lg:sticky">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                  <h3 className="font-bold text-lg text-doibrand-dark flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-doibrand-gold" />
                    <span>অর্ডার সারাংশ (Order Summary)</span>
                  </h3>
                  <span className="text-xs text-doibrand-accent bg-amber-50 px-2.5 py-0.5 rounded-full font-semibold">
                    {checkoutItems.length} টি পণ্য
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-3.5 max-h-[250px] overflow-y-auto pr-1">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-doibrand-dark truncate">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          পরিমাণ: {item.quantity} টি
                        </p>
                      </div>
                      <div className="text-xs font-bold text-doibrand-dark font-sans">
                        ৳ {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-doibrand-gold" />
                    <span>ডিসকাউন্ট কুপন</span>
                  </label>

                  <div className="flex">
                    <input
                      type="text"
                      disabled={isCouponApplied}
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      placeholder="কুপন কোড দিন"
                      className="w-full bg-gray-50 border border-gray-200 border-r-0 focus:bg-white focus:ring-1 focus:ring-doibrand-gold focus:border-doibrand-gold rounded-l-xl px-3.5 py-3 text-xs text-doibrand-dark uppercase tracking-wider outline-none transition-all placeholder:normal-case placeholder:tracking-normal disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={isCouponApplied}
                      onClick={handleApplyCoupon}
                      className="bg-gray-900 text-white px-6 rounded-r-xl hover:bg-doibrand-gold transition-colors text-xs font-bold shrink-0 cursor-pointer disabled:opacity-60"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Hidden / Dynamic Success & Error States */}
                  {isCouponApplied && (
                    <div className="mt-2.5 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Discount Applied! ৳ {couponDiscount} ছাড় প্রযোজ্য হয়েছে</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-red-500 font-bold ml-2 cursor-pointer"
                        title="কুপন বাদ দিন"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <p className="text-[11px] text-red-500 mt-1.5">{couponError}</p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>সাবটোটাল (Subtotal)</span>
                    <span className="font-semibold text-doibrand-dark font-sans">
                      ৳ {currentSubtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600">
                    <span>ডেলিভারি চার্জ (Delivery Charge)</span>
                    <span className="font-semibold text-doibrand-dark font-sans">
                      ৳ {deliveryFee}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 font-semibold">
                      <span>কুপন ছাড় (Discount)</span>
                      <span className="font-sans">- ৳ {couponDiscount}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-bold text-doibrand-dark">
                        সর্বমোট বিল (Grand Total)
                      </span>
                      <span className="text-[11px] text-gray-400 font-normal">
                        ভ্যাট অন্তর্ভুক্ত
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-doibrand-dark font-sans">
                      ৳ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Massive Glowing Action Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-doibrand-dark text-white text-lg font-bold w-full py-4 rounded-xl hover:bg-doibrand-gold shadow-[0_8px_20px_-6px_rgba(196,138,78,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>অর্ডার সম্পন্ন হচ্ছে...</span>
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>অর্ডার কনফার্ম করুন</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[11px] text-gray-500">
                  <div className="flex flex-col items-center">
                    <Truck className="w-4 h-4 text-doibrand-gold mb-1" />
                    <span>দ্রুত ডেলিভারি</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-4 h-4 text-doibrand-gold mb-1" />
                    <span>১০০% খাঁটি পণ্য</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <CreditCard className="w-4 h-4 text-doibrand-gold mb-1" />
                    <span>নিরাপদ পেমেন্ট</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
