"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
  Plus,
  Clock,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  User,
  Heart,
  Tag,
} from "lucide-react";
import {
  StoredCustomer,
  TIER_META,
  getCustomerById,
  deleteCustomer,
} from "@/lib/customerStorage";
import { StoredOrder, getStoredOrders, STATUS_META } from "@/lib/orderStorage";
import OrderInvoice from "@/components/admin/OrderInvoice";
import { toBnDigits } from "@/lib/bangla";

export default function CustomerDetailView({ customerId }: { customerId: string }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<StoredCustomer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<StoredOrder[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<StoredOrder | null>(null);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const found = getCustomerById(customerId);
    if (found) {
      setCustomer(found);
      // Load orders matching customer phone or name
      const allOrders = getStoredOrders();
      const matched = allOrders.filter(
        (o) =>
          o.customerPhone === found.phone ||
          o.customerName.toLowerCase() === found.name.toLowerCase()
      );
      setCustomerOrders(matched);
    }
  }, [customerId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!customer) {
    return (
      <div className="font-bengali p-12 text-center space-y-4">
        <p className="text-stone-500">গ্রাহকের তথ্য খুঁজে পাওয়া যায়নি।</p>
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-doibrand-dark text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>গ্রাহক তালিকায় ফিরে যান</span>
        </Link>
      </div>
    );
  }

  const tierInfo = TIER_META[customer.tier] || TIER_META.Regular;

  const copyPhone = () => {
    navigator.clipboard.writeText(customer.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`আপনি কি "${customer.name}" গ্রাহকের প্রোফাইল মুছে ফেলতে চান?`)) {
      deleteCustomer(customer.id);
      router.push("/admin/customers");
    }
  };

  // Average Order Value
  const aov = customer.totalOrders > 0 ? Math.round(customer.totalSpent / customer.totalOrders) : 0;

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
            <Link href="/admin/customers" className="hover:text-doibrand-gold transition-colors">
              গ্রাহকবৃন্দ
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">{customer.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Link
                href="/admin/customers"
                className="w-10 h-10 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-doibrand-dark transition-colors shadow-2xs"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
                    {customer.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierInfo.bg} ${tierInfo.color} ${tierInfo.border}`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {tierInfo.labelBn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-sans">
                  গ্রাহক আইডি: <strong className="text-stone-700">{customer.id}</strong> • যোগদান:{" "}
                  <strong>{customer.joinedDate}</strong>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
              {/* Create Manual Order for this Customer */}
              <Link
                href={`/admin/orders/new`}
                className="px-4 py-2.5 rounded-xl bg-doibrand-dark text-white font-bold text-xs sm:text-sm hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4 text-doibrand-gold" />
                <span>+ এই গ্রাহকের জন্য নতুন অর্ডার</span>
              </Link>

              {/* Edit */}
              <Link
                href={`/admin/customers/${customer.id}/edit`}
                className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 font-semibold text-xs sm:text-sm text-stone-700 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-4 h-4 text-doibrand-gold" />
                <span>প্রোফাইল এডিট</span>
              </Link>

              {/* Delete */}
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                title="গ্রাহক মুছুন"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Top Summary KPI Cards ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-doibrand-dark flex items-center justify-center font-bold text-lg shrink-0">
            <ShoppingBag className="w-6 h-6 text-doibrand-accent" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold">মোট অর্ডার সংখ্যা</span>
            <p className="text-2xl font-bold text-doibrand-dark font-sans mt-0.5">
              {customer.totalOrders} টি
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            <span className="text-xl font-bold font-sans">৳</span>
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold">লাইফটাইম খরচ (Total Spent)</span>
            <p className="text-2xl font-bold text-emerald-700 font-sans mt-0.5">
              ৳{customer.totalSpent.toLocaleString("en-US")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg shrink-0">
            <Star className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold">গড় অর্ডার মূল্য (AOV)</span>
            <p className="text-2xl font-bold text-purple-800 font-sans mt-0.5">
              ৳{aov.toLocaleString("en-US")}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Split Two-Column Layout ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer Profile & Preferences (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Identity & Contact Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#F3DDB8] to-[#E2B57C] text-doibrand-dark flex items-center justify-center font-extrabold text-xl shadow-xs shrink-0">
                {customer.avatarInitials || customer.name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-doibrand-dark truncate">{customer.name}</h3>
                <p className="text-xs text-stone-400 font-sans">আইডি: {customer.id}</p>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    customer.status === "Active"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {customer.status === "Active" ? "সক্রিয় গ্রাহক" : "নিষ্ক্রিয় গ্রাহক"}
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-stone-400 block">মোবাইল নাম্বার:</span>
                <div className="flex items-center justify-between mt-0.5">
                  <a
                    href={`tel:${customer.phone}`}
                    className="font-bold text-sm text-doibrand-accent hover:underline font-sans flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{customer.phone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copyPhone}
                    className="text-[11px] font-semibold text-stone-500 hover:text-doibrand-dark px-2 py-1 rounded bg-stone-100 cursor-pointer"
                  >
                    {copiedPhone ? "কপি হয়েছে!" : "কপি"}
                  </button>
                </div>
              </div>

              {customer.email && (
                <div>
                  <span className="text-[11px] text-stone-400 block">ইমেইল:</span>
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-sans text-stone-700 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{customer.email}</span>
                  </a>
                </div>
              )}

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] text-stone-400 block">ডেলিভারি ঠিকানা:</span>
                <p className="text-stone-700 mt-1 leading-relaxed">{customer.address}</p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-doibrand-accent border border-amber-200 text-[11px] font-semibold">
                  {customer.city}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Preferences & Notes Card */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-800 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-doibrand-accent" />
              পছন্দসমূহ ও বিশেষ নোট
            </h3>

            {customer.preferences && customer.preferences.length > 0 && (
              <div>
                <span className="text-[11px] text-stone-400 block mb-1.5">প্রিয় পণ্য ও স্বাদ:</span>
                <div className="flex flex-wrap gap-1.5">
                  {customer.preferences.map((pref, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-xs font-semibold text-doibrand-dark"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[11px] text-stone-400 block mb-1">অ্যাডমিন ইন্টারনাল নোট:</span>
              <p className="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100 leading-relaxed">
                {customer.notes || "কোনো বিশেষ নোট যোগ করা হয়নি।"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Order History (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-doibrand-dark flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-doibrand-gold" />
                অর্ডার হিস্ট্রি ({customerOrders.length} টি অর্ডার পাওয়া গেছে)
              </h3>
              <Link
                href="/admin/orders/new"
                className="text-xs font-bold text-doibrand-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন অর্ডার</span>
              </Link>
            </div>

            {customerOrders.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-2xl space-y-2">
                <p className="text-xs text-stone-500">
                  এই গ্রাহকের কোনো অর্ডার ডাটাবেজে রেকর্ড করা নেই।
                </p>
                <Link
                  href="/admin/orders/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-doibrand-gold" />
                  <span>এখনই ম্যানুয়াল অর্ডার তৈরি করুন</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map((ord) => {
                  const statusInfo = STATUS_META[ord.status] || STATUS_META.Pending;
                  return (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-stone-200/90 bg-stone-50/50 hover:bg-amber-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="font-bold text-sm text-doibrand-accent hover:underline font-sans"
                          >
                            #{ord.id}
                          </Link>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {statusInfo.labelBn}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-sans mt-1">
                          তারিখ: {ord.createdAt} • {ord.items.length} টি আইটেম ({ord.items[0]?.title})
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/70">
                        <span className="font-bold font-sans text-sm text-doibrand-dark">
                          ৳{ord.totalAmount.toLocaleString("en-US")}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="p-2 rounded-xl border border-stone-200 hover:bg-white text-amber-700 cursor-pointer"
                            title="ইনভয়েস দেখুন"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/admin/orders/${ord.id}`}
                            className="p-2 rounded-xl border border-stone-200 hover:bg-white text-stone-600"
                            title="অর্ডার ডিটেইলস"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal: Quick Printable Invoice View ───────────────────────── */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-header-fade-up overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <OrderInvoice
              order={selectedInvoiceOrder}
              onClose={() => setSelectedInvoiceOrder(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
