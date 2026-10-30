"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  Wallet,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  StoredOrder,
  OrderStatus,
  STATUS_META,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "@/lib/orderStorage";
import OrderInvoice from "@/components/admin/OrderInvoice";
import { toBnDigits } from "@/lib/bangla";

export default function OrderDetailView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [showInvoiceView, setShowInvoiceView] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = getOrderById(orderId);
    if (found) {
      setOrder(found);
    }
  }, [orderId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!order) {
    return (
      <div className="font-bengali p-12 text-center space-y-4">
        <p className="text-stone-500">অর্ডারটি খুঁজে পাওয়া যায়নি।</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-doibrand-dark text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>অর্ডার তালিকায় ফিরে যান</span>
        </Link>
      </div>
    );
  }

  const statusMeta = STATUS_META[order.status] || STATUS_META.Pending;

  const handleStatusChange = (newStatus: OrderStatus) => {
    const updated = updateOrderStatus(order.id, newStatus);
    const found = updated.find((o) => o.id === order.id);
    if (found) setOrder(found);
    showToast(`অর্ডার স্ট্যাটাস "${STATUS_META[newStatus].labelBn}" এ পরিবর্তন করা হয়েছে`);
  };

  const copyPhoneNumber = () => {
    navigator.clipboard.writeText(order.customerPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`আপনি কি "${order.id}" অর্ডারটি মুছে ফেলতে চান?`)) {
      deleteOrder(order.id);
      router.push("/admin/orders");
    }
  };

  // If viewing invoice
  if (showInvoiceView) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <OrderInvoice order={order} onClose={() => setShowInvoiceView(false)} />
      </div>
    );
  }

  // Stepper timeline calculation
  const STEPS: { key: OrderStatus; label: string; desc: string }[] = [
    { key: "Pending", label: "অর্ডার গৃহীত", desc: "গ্রাহক অর্ডার প্লেস করেছেন" },
    { key: "Processing", label: "প্রস্তুত হচ্ছে", desc: "প্যাকেজিং ও মিষ্টি তৈরি সম্পন্ন" },
    { key: "Shipped", label: "কুরিয়ারে হস্তান্তর", desc: "ডেলিভারি রাইডার পথে আছে" },
    { key: "Delivered", label: "সফল ডেলিভারি", desc: "গ্রাহক পণ্য গ্রহণ করেছেন" },
  ];

  const currentStepIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="font-bengali min-h-screen text-doibrand-dark pb-20">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-header-fade-up bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-doibrand-gold/40 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 -mx-6 -mt-6 p-6 mb-6 shadow-2xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/admin" className="hover:text-doibrand-gold transition-colors">
              অ্যাডমিন ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/orders" className="hover:text-doibrand-gold transition-colors">
              অর্ডারসমূহ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">অর্ডার #{order.id}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Link
                href="/admin/orders"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-doibrand-dark transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark font-sans">
                    #{order.id}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {statusMeta.labelBn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
                  অর্ডারের তারিখ: <strong className="text-stone-700">{order.createdAt}</strong> • ইনভয়েস নং:{" "}
                  <strong>{order.invoiceNo}</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {/* Print Invoice */}
              <button
                type="button"
                onClick={() => setShowInvoiceView(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs sm:text-sm hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>ইনভয়েস দেখুন ও প্রিন্ট</span>
              </button>

              {/* Edit Order */}
              <Link
                href={`/admin/orders/${order.id}/edit`}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-semibold text-xs sm:text-sm text-stone-700 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-4 h-4 text-doibrand-gold" />
                <span>অর্ডার এডিট</span>
              </Link>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                title="অর্ডার মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Order Tracking Stepper Timeline ─────────────────────────── */}
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs">
        <h3 className="text-sm font-bold text-stone-800 mb-6 flex items-center gap-2">
          <Truck className="w-4 h-4 text-doibrand-gold" />
          ডেলিভারি ট্র্যাকিং প্রগ্রেস
        </h3>

        {order.status === "Cancelled" ? (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-bold">
            <XCircle className="w-5 h-5 text-red-500" />
            <span>এই অর্ডারটি বাতিল (Cancelled) করা হয়েছে।</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {STEPS.map((st, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={st.key}
                  onClick={() => handleStatusChange(st.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "border-doibrand-accent bg-amber-50/60 shadow-xs ring-2 ring-doibrand-gold/30"
                      : isCompleted
                      ? "border-emerald-200 bg-emerald-50/40"
                      : "border-stone-200 bg-stone-50/50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-sans ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-stone-300 text-stone-600"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span className="text-xs font-bold text-stone-800">{st.label}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">{st.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 3. Split Two-Column Details ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Ordered Items & Calculations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Order Items Table Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                <Package className="w-5 h-5 text-doibrand-gold" />
                অর্ডারের পণ্যসমূহ ({order.items.length} টি আইটেম)
              </h3>
              <span className="text-xs text-stone-500 font-sans">
                আইডি: #{order.id}
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative bg-stone-100 border border-stone-200 shrink-0">
                      <Image
                        src={item.image || "/Product/doi.jpg"}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-800 truncate">{item.title}</h4>
                      <p className="text-xs text-stone-500 font-sans mt-0.5">
                        {item.unit || "১টি"} • একক মূল্য: ৳{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-doibrand-dark font-sans">
                      ৳{(item.price * item.quantity).toLocaleString("en-US")}
                    </p>
                    <span className="text-xs text-stone-500 font-sans">
                      পরিমাণ: {item.quantity} টি
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t-2 border-dashed border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>পণ্য উপমোট (Subtotal):</span>
                <span className="font-bold font-sans">৳{order.subtotal.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>ডেলিভারি চার্জ ({order.deliveryArea}):</span>
                <span className="font-bold font-sans">৳{order.deliveryFee.toLocaleString("en-US")}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>বিশেষ ছাড় (Discount):</span>
                  <span className="font-sans">- ৳{order.discount.toLocaleString("en-US")}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-stone-200 text-base font-bold text-doibrand-dark">
                <span>সর্বমোট প্রদেয় (Grand Total):</span>
                <span className="text-xl text-doibrand-accent font-sans">
                  ৳{order.totalAmount.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery & Notes Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-doibrand-gold" />
              ডেলিভারি সংক্রান্ত নির্দেশনা ও নোট
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              {order.notes || "গ্রাহক থেকে কোনো বিশেষ নির্দেশনা দেওয়া হয়নি।"}
            </p>
          </div>
        </div>

        {/* Right: Customer Profile & Quick Status Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-800 pb-3 border-b border-stone-100 uppercase tracking-wider">
              গ্রাহকের প্রোফাইল ও যোগাযোগ
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-stone-400 block">নাম:</span>
                <p className="text-sm font-bold text-doibrand-dark mt-0.5">{order.customerName}</p>
              </div>

              <div>
                <span className="text-[11px] text-stone-400 block">মোবাইল নাম্বার:</span>
                <div className="flex items-center justify-between mt-0.5">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="font-bold text-sm text-doibrand-accent hover:underline font-sans flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{order.customerPhone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copyPhoneNumber}
                    className="text-[11px] font-semibold text-stone-500 hover:text-doibrand-dark px-2 py-1 rounded bg-stone-100 cursor-pointer"
                  >
                    {copiedPhone ? "কপি হয়েছে!" : "কপি"}
                  </button>
                </div>
              </div>

              {order.customerEmail && (
                <div>
                  <span className="text-[11px] text-stone-400 block">ইমেইল:</span>
                  <a
                    href={`mailto:${order.customerEmail}`}
                    className="font-sans text-stone-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{order.customerEmail}</span>
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 block">সম্পূর্ণ ডেলিভারি ঠিকানা:</span>
                <p className="text-stone-700 mt-1 leading-relaxed">{order.shippingAddress}</p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-doibrand-accent border border-amber-200 text-[11px] font-semibold">
                  {order.deliveryArea}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-800 pb-3 border-b border-stone-100 uppercase tracking-wider">
              পেমেন্ট তথ্য
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">পেমেন্ট মেথড:</span>
                <strong className="text-doibrand-dark font-sans">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">পেমেন্ট অবস্থা:</span>
                <span
                  className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                    order.paymentStatus === "Paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus === "Paid" ? "পরিশোধিত (Paid)" : "বাকি (Unpaid)"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">মোট টাকা:</span>
                <strong className="text-base text-doibrand-accent font-sans">
                  ৳{order.totalAmount.toLocaleString("en-US")}
                </strong>
              </div>
            </div>
          </div>

          {/* Status Changer Actions */}
          <div className="bg-linear-to-br from-[#351C1B] to-[#512c2a] rounded-3xl p-6 text-white space-y-3">
            <h3 className="text-sm font-bold text-amber-200">দ্রুত স্ট্যাটাস পরিবর্তন</h3>
            <p className="text-xs text-stone-300">
              অর্ডারের অগ্রগতি অনুসারে এক ক্লিকে স্ট্যাটাস আপডেট করুন।
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleStatusChange("Processing")}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                প্রস্তুত হচ্ছে
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Shipped")}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                কুরিয়ারে হস্তান্তর
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Delivered")}
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                ডেলিভারি সম্পন্ন
              </button>
              <button
                type="button"
                onClick={() => handleStatusChange("Cancelled")}
                className="py-2 px-3 rounded-xl bg-red-500/80 hover:bg-red-600 text-xs font-bold text-center transition-colors cursor-pointer"
              >
                অর্ডার বাতিল
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
