"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  Search,
  CheckCircle2,
  Package,
  Layers,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  Clock,
  Wallet,
  AlertCircle,
  Truck,
  Check,
  X,
  FileText,
} from "lucide-react";
import {
  StoredOrder,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  getStoredOrders,
  saveOrder,
  getOrderById,
} from "@/lib/orderStorage";
import { ALL_AVAILABLE_PRODUCTS } from "@/lib/categoryStorage";
import { toBnDigits } from "@/lib/bangla";

export default function OrderEditor({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromParam = orderId || searchParams.get("id") || searchParams.get("edit");

  // Customer Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"ঢাকা সিটি" | "ঢাকার বাইরে">("ঢাকা সিটি");
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState("সকাল ১০টা - দুপুর ২টা");
  const [notes, setNotes] = useState("");

  // Order Items State
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: "item-init",
      productId: "bogra-special-doi",
      title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
      price: 500,
      quantity: 1,
      unit: "১ কেজি মাটির সরা",
      image: "/Product/doi.jpg",
    },
  ]);

  // Financial & Payment State
  const [deliveryFee, setDeliveryFee] = useState<number>(60);
  const [discount, setDiscount] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Unpaid");
  const [status, setStatus] = useState<OrderStatus>("Processing");

  // Product Picker Modal / Drawer State
  const [productSearch, setProductSearch] = useState("");
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load existing order if editing
  useEffect(() => {
    if (idFromParam) {
      const existing = getOrderById(idFromParam);
      if (existing) {
        setCustomerName(existing.customerName);
        setCustomerPhone(existing.customerPhone);
        setCustomerEmail(existing.customerEmail || "");
        setShippingAddress(existing.shippingAddress);
        setDeliveryArea(existing.deliveryArea);
        setDeliveryTimeSlot(existing.deliveryTimeSlot || "সকাল ১০টা - দুপুর ২টা");
        setNotes(existing.notes || "");
        setItems(existing.items || []);
        setDeliveryFee(existing.deliveryFee);
        setDiscount(String(existing.discount || 0));
        setPaymentMethod(existing.paymentMethod);
        setPaymentStatus(existing.paymentStatus);
        setStatus(existing.status);
      }
    }
  }, [idFromParam]);

  // Adjust delivery fee automatically when delivery area changes
  const handleAreaChange = (area: "ঢাকা সিটি" | "ঢাকার বাইরে") => {
    setDeliveryArea(area);
    setDeliveryFee(area === "ঢাকা সিটি" ? 60 : 120);
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  }, [items]);

  const numericDiscount = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, subtotal + deliveryFee - numericDiscount);

  // Items manipulation
  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const addProductToOrder = (prod: (typeof ALL_AVAILABLE_PRODUCTS)[0]) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((it) => it.productId === prod.slug);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: prod.slug,
          title: prod.title,
          price: prod.price,
          quantity: 1,
          unit: prod.unit,
          image: prod.image,
        },
      ];
    });
    setIsProductPickerOpen(false);
  };

  // Save action
  const handleSaveOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: Record<string, string> = {};

    if (!customerName.trim()) errors.customerName = "গ্রাহকের নাম প্রদান করুন";
    if (!customerPhone.trim()) errors.customerPhone = "গ্রাহকের মোবাইল নাম্বার প্রদান করুন";
    if (!shippingAddress.trim()) errors.shippingAddress = "ডেলিভারি ঠিকানা প্রদান করুন";
    if (items.length === 0) errors.items = "অর্ডারে অন্তত একটি পণ্য যুক্ত করুন";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const orderIdToSave = idFromParam || `DB-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderToSave: StoredOrder = {
      id: orderIdToSave,
      invoiceNo: `INV-2026-${orderIdToSave.replace("DB-", "")}`,
      createdAt: new Date().toISOString().split("T")[0],
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      shippingAddress: shippingAddress.trim(),
      deliveryArea: deliveryArea,
      deliveryTimeSlot: deliveryTimeSlot,
      notes: notes.trim() || undefined,
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      discount: numericDiscount,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      status: status,
    };

    saveOrder(orderToSave);

    setToastMessage(idFromParam ? "অর্ডারটি সফলভাবে আপডেট হয়েছে!" : "ম্যানুয়াল অর্ডার সফলভাবে তৈরি হয়েছে!");
    setShowToast(true);

    setTimeout(() => {
      setIsSaving(false);
      router.push(`/admin/orders/${orderIdToSave}`);
    }, 1200);
  };

  // Filtered catalogue products
  const filteredCatalogue = useMemo(() => {
    return ALL_AVAILABLE_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.englishTitle.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch]);

  return (
    <div className="font-bengali min-h-screen text-doibrand-dark pb-20">
      {/* Toast Feedback */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-header-fade-up bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-doibrand-gold/40">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">{toastMessage}</p>
            <p className="text-xs text-gray-400">অর্ডার ডিটেইলসে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
        </div>
      )}

      {/* ── 1. Breadcrumbs & Top Header ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 -mx-6 -mt-6 p-6 mb-6 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/admin" className="hover:text-doibrand-gold transition-colors">
              অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/orders" className="hover:text-doibrand-gold transition-colors">
              অর্ডার তালিকা
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">
              {idFromParam ? `অর্ডার #${idFromParam} সম্পাদনা` : "ম্যানুয়াল অর্ডার তৈরি"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Link
                href="/admin/orders"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-doibrand-dark transition-colors shadow-2xs"
                title="অর্ডার তালিকায় ফিরুন"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
                  {idFromParam ? "অর্ডার তথ্য সম্পাদনা করুন" : "ম্যানুয়ালি নতুন অর্ডার তৈরি করুন"}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  ফোন কল, হোয়াটসঅ্যাপ অথবা সরাসরি আসা কাস্টমারের অর্ডার এন্ট্রি করুন এবং অটো ইনভয়েস জেনারেট করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/admin/orders"
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 text-stone-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                বাতিল
              </Link>
              <button
                type="button"
                onClick={() => handleSaveOrder()}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-doibrand-gold" />
                <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : idFromParam ? "আপডেট সংরক্ষণ করুন" : "অর্ডার নিশ্চিত করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Split Two-Column Grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT: Live Order & Invoice Preview (5 Cols) ────────────────── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-doibrand-dark uppercase tracking-wider">
                  লাইভ অর্ডার সামারি ও ইনভয়েস প্রিভিউ
                </h3>
              </div>
              <span className="text-[11px] font-sans font-bold bg-amber-100 text-doibrand-dark px-2.5 py-0.5 rounded-full">
                {items.length} টি আইটেম
              </span>
            </div>

            {/* Golden Frame Receipt Container */}
            <div className="relative rounded-[24px] p-1 bg-linear-to-br from-[#F3DDB8] via-white to-[#EFCF9E] shadow-[0_15px_40px_-20px_rgba(169,94,53,0.4)]">
              <div className="bg-stone-50 rounded-[22px] p-5 space-y-4">
                {/* Brand Header */}
                <div className="flex justify-between items-center pb-3 border-b border-stone-200/80">
                  <div>
                    <h4 className="text-lg font-bold text-doibrand-dark">দই বিলাস</h4>
                    <p className="text-[11px] text-stone-500 font-sans">Bogura / Dhaka, Bangladesh</p>
                  </div>
                  <span className="text-xs font-bold text-doibrand-accent font-sans bg-amber-50 px-2 py-1 rounded border border-amber-200/80">
                    MANUAL ORDER
                  </span>
                </div>

                {/* Customer summary */}
                <div className="text-xs space-y-1 text-stone-700">
                  <p>
                    গ্রাহক: <strong className="text-doibrand-dark">{customerName || "নাম প্রবেশ করুন"}</strong>
                  </p>
                  <p className="font-sans">
                    ফোন: <strong>{customerPhone || "01XXX-XXXXXX"}</strong>
                  </p>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    ঠিকানা: {shippingAddress || "সম্পূর্ণ ঠিকানা প্রবেশ করান"}
                  </p>
                </div>

                {/* Items summary */}
                <div className="divide-y divide-stone-200/60 pt-2 border-t border-stone-200/80 max-h-48 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-stone-800 truncate">{it.title}</p>
                        <p className="text-[10px] text-stone-400 font-sans">
                          ৳{it.price} x {it.quantity} {it.unit}
                        </p>
                      </div>
                      <span className="font-bold text-doibrand-dark font-sans">
                        ৳{it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="pt-3 border-t-2 border-dashed border-stone-300 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>উপমোট (Subtotal):</span>
                    <span className="font-bold font-sans">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>ডেলিভারি চার্জ ({deliveryArea}):</span>
                    <span className="font-bold font-sans">৳{deliveryFee}</span>
                  </div>
                  {numericDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>অফার ছাড়:</span>
                      <span className="font-sans">- ৳{numericDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-doibrand-dark">
                    <span>সর্বমোট প্রদেয়:</span>
                    <span className="text-base text-doibrand-accent font-sans">
                      ৳{totalAmount.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>

                {/* Payment Badge */}
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500 font-sans">পেমেন্ট: {paymentMethod}</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {paymentStatus === "Paid" ? "পরিশোধিত" : "ক্যাশ অন ডেলিভারি (বাকি)"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Order Input Form (7 Cols) ─────────────────────────── */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          {/* Card 1: Customer Information */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-doibrand-dark flex items-center justify-center">
                <User className="w-4 h-4 text-doibrand-accent" />
              </div>
              <div>
                <h3 className="text-base font-bold text-doibrand-dark">গ্রাহকের তথ্য (Customer Details)</h3>
                <p className="text-xs text-stone-500">গ্রাহকের নাম, মোবাইল নাম্বার এবং ডেলিভারি ঠিকানা দিন।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  গ্রাহকের পুরো নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali ${
                    formErrors.customerName ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {formErrors.customerName && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.customerName}</p>
                )}
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="যেমন: 01712-345678"
                  className={`w-full rounded-xl border p-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 ${
                    formErrors.customerPhone ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {formErrors.customerPhone && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.customerPhone}</p>
                )}
              </div>
            </div>

            {/* Email & Delivery Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  ডেলিভারি এরিয়া (Delivery Area)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAreaChange("ঢাকা সিটি")}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      deliveryArea === "ঢাকা সিটি"
                        ? "bg-amber-100 text-doibrand-dark border-doibrand-gold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    ঢাকা সিটি (৬০৳)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAreaChange("ঢাকার বাইরে")}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      deliveryArea === "ঢাকার বাইরে"
                        ? "bg-amber-100 text-doibrand-dark border-doibrand-gold"
                        : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    ঢাকার বাইরে (১২০৳)
                  </button>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="বাড়ি নং, রোড নং, এলাকা, থানা ও জেলা..."
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali ${
                  formErrors.shippingAddress ? "border-red-400 bg-red-50/20" : "border-stone-200"
                }`}
              />
              {formErrors.shippingAddress && (
                <p className="text-red-500 text-[11px] mt-1">{formErrors.shippingAddress}</p>
              )}
            </div>
          </div>

          {/* Card 2: Products Picker & Quantity */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-doibrand-accent flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-doibrand-dark">অর্ডারের পণ্যসমূহ (Order Items)</h3>
                  <p className="text-xs text-stone-500">পণ্য নির্বাচন করুন এবং পরিমাণ বাড়ান বা কমান।</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProductPickerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-doibrand-gold" />
                <span>+ ক্যাটালগ থেকে পণ্য যোগ করুন</span>
              </button>
            </div>

            {/* Items List in Editor */}
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200/90 bg-stone-50/60 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-stone-200 shrink-0 border border-stone-200">
                      <Image
                        src={it.image || "/Product/doi.jpg"}
                        alt={it.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate">{it.title}</h4>
                      <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                        {it.unit} • একক মূল্য: ৳{it.price}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-2 py-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-6 h-6 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-sans">{it.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-6 h-6 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold font-sans text-sm text-doibrand-accent min-w-16 text-right">
                      ৳{it.price * it.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="p-6 rounded-2xl border-2 border-dashed border-stone-200 text-center text-xs text-stone-400">
                  অর্ডারে কোনো পণ্য নেই। উপরে বাটনে ক্লিক করে পণ্য যুক্ত করুন।
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Financials, Payment & Status */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-doibrand-dark">পেমেন্ট, অফার ও অর্ডার স্ট্যাটাস</h3>
                <p className="text-xs text-stone-500">ডেলিভারি চার্জ, ডিসকাউন্ট এবং পেমেন্ট মেথড ঠিক করুন।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Delivery Fee */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">ডেলিভারি চার্জ (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">বিশেষ ছাড় (৳)</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans font-bold focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                />
              </div>

              {/* Payment Status */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">পেমেন্ট অবস্থা</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-bold bg-white focus:outline-none"
                >
                  <option value="Unpaid">বাকি (Unpaid / COD)</option>
                  <option value="Paid">পরিশোধিত (Paid)</option>
                  <option value="Partial">আংশিক পরিশোধ</option>
                </select>
              </div>
            </div>

            {/* Payment Method & Order Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">পেমেন্ট মেথড</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-bold bg-white focus:outline-none"
                >
                  <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি (Cash on Delivery)</option>
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Bank Transfer">ব্যাংক ট্রান্সফার</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">অর্ডার স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-bold bg-white focus:outline-none"
                >
                  <option value="Pending">অপেক্ষমান (Pending)</option>
                  <option value="Processing">প্রস্তুত হচ্ছে (Processing)</option>
                  <option value="Shipped">ডেলিভারিতে আছে (Shipped)</option>
                  <option value="Delivered">সম্পন্ন (Delivered)</option>
                  <option value="Cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-800 mb-1.5">বিশেষ নোট (Customer / Admin Note)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="যেমন: ফ্রেশ সরা দিবেন, কল দিয়ে ডেলিভারি করবেন..."
                className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/orders"
              className="px-5 py-3 rounded-xl border border-stone-200 font-semibold text-xs text-stone-600 hover:bg-stone-50"
            >
              বাতিল
            </Link>
            <button
              type="button"
              onClick={() => handleSaveOrder()}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-doibrand-gold" />
              <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : idFromParam ? "আপডেট সংরক্ষণ করুন" : "অর্ডার নিশ্চিত করুন"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Modal: Product Catalogue Selector ──────────────────────────── */}
      {isProductPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-header-fade-up">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-base text-doibrand-dark flex items-center gap-2">
                <Package className="w-5 h-5 text-doibrand-gold" />
                দই বিলাস ক্যাটালগ থেকে পণ্য নির্বাচন
              </h3>
              <button
                type="button"
                onClick={() => setIsProductPickerOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search within catalogue */}
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="পণ্য খুঁজুন (নাম দিয়ে)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {filteredCatalogue.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => addProductToOrder(prod)}
                  className="p-2.5 rounded-xl border border-stone-200/90 hover:border-doibrand-gold hover:bg-amber-50/40 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative bg-stone-100 shrink-0 border border-stone-200">
                      <Image
                        src={prod.image}
                        alt={prod.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-800 truncate">{prod.title}</h4>
                      <p className="text-[10px] text-stone-400 font-sans">{prod.unit}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-doibrand-accent font-sans">
                      ৳{prod.price}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">+ যোগ করুন</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
