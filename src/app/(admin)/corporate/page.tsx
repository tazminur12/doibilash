"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
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
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  FileText,
  User,
  ShieldCheck,
} from "lucide-react";
import {
  CorporateOrder,
  CorporateOrderStatus,
  CORP_STATUS_META,
  getStoredCorporateOrders,
  deleteCorporateOrder,
  saveCorporateOrder,
} from "@/lib/corporateOrderStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminCorporateOrdersPage() {
  const [orders, setOrders] = useState<CorporateOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CorporateOrderStatus | "ALL">("ALL");
  const [orderToDelete, setOrderToDelete] = useState<CorporateOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setOrders(getStoredCorporateOrders());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (order: CorporateOrder, newStatus: CorporateOrderStatus) => {
    const updated = { ...order, status: newStatus };
    saveCorporateOrder(updated);
    loadData();
    showToast(`অর্ডার "${order.companyName}" এর স্ট্যাটাস "${CORP_STATUS_META[newStatus].labelBn}" এ আপডেট হয়েছে!`);
  };

  const confirmDelete = () => {
    if (!orderToDelete) return;
    deleteCorporateOrder(orderToDelete.id);
    loadData();
    showToast(`কর্পোরেট অর্ডার "${orderToDelete.companyName}" মুছে ফেলা হয়েছে।`);
    setOrderToDelete(null);
  };

  // Filtered
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.quotationNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "ALL" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // KPIs
  const totalPipelineValue = orders.reduce((sum, o) => sum + (o.totalBudget || 0), 0);
  const totalAdvanceCollected = orders.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
  const inProductionCount = orders.filter((o) => o.status === "In Production").length;
  const totalCompaniesCount = orders.length;

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-lg">অর্ডার মুছে ফেলার নিশ্চয়তা</h3>
                <p className="text-xs text-stone-500">এই অ্যাকশনটি ফেরত নেওয়া যাবে না</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি কর্পোরেট অর্ডার{" "}
              <strong className="text-stone-900">{orderToDelete.companyName}</strong> ({orderToDelete.quotationNo})-কে মুছে ফেলতে চান?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-medium"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Page Header ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-blue-100/50 via-amber-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <Building2 className="w-4 h-4" />
              <span>বিটুবি প্রাতিষ্ঠানিক ও বাল্ক অর্ডার পাইপলাইন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#351C1B] tracking-tight">
              কর্পোরেট ও বাল্ক অর্ডার (B2B Orders)
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              প্রতিষ্ঠান, ব্যাংক, কর্পোরেট উপহার ও পারিবারিক বড় অনুষ্ঠানের জন্য আনুষ্ঠানিক কোটেশন প্রদান, বাল্ক অর্ডার ট্র্যাকিং এবং পেমেন্ট পরিচালনা করুন।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/corporate/new"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-sm shadow-lg shadow-[#351C1B]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus className="w-4 h-4 text-amber-200" />
              </div>
              <span>নতুন কর্পোরেট কোটেশন / অর্ডার</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Executive KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#351C1B]/5 text-[#351C1B] flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 text-[#C48A4E]" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">মোট পাইপলাইন মূল্য</div>
            <div className="text-xl sm:text-2xl font-black text-[#351C1B]">
              ৳ {toBnDigits(totalPipelineValue.toLocaleString("en-IN"))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">কর্পোরেট ক্লায়েন্ট</div>
            <div className="text-xl sm:text-2xl font-black text-blue-900">
              {toBnDigits(totalCompaniesCount)} <span className="text-xs font-normal text-stone-400">প্রতিষ্ঠান</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">কারখানায় প্রস্তুত হচ্ছে</div>
            <div className="text-xl sm:text-2xl font-black text-orange-900">
              {toBnDigits(inProductionCount)} <span className="text-xs font-normal text-stone-400">অর্ডার</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">আদায়কৃত মোট অগ্রিম</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              ৳ {toBnDigits(totalAdvanceCollected.toLocaleString("en-IN"))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Search & Filter Bar ───────────────────────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="প্রতিষ্ঠানের নাম, কর্মকর্তা, ফোন অথবা কোটেশন নম্বর (QT-DB-...) দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
            />
          </div>
        </div>

        {/* Status Pipeline Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> স্ট্যাটাস পাইপলাইন:
          </span>

          <button
            type="button"
            onClick={() => setSelectedStatus("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === "ALL"
                ? "bg-[#351C1B] text-amber-100 shadow-xs"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            সকল ({toBnDigits(orders.length)})
          </button>

          {(
            [
              "New Lead",
              "Quotation Sent",
              "Confirmed",
              "In Production",
              "Delivered",
            ] as CorporateOrderStatus[]
          ).map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            const meta = CORP_STATUS_META[st];
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#C48A4E] text-white shadow-xs"
                    : `${meta.bg} ${meta.color} border ${meta.border} hover:opacity-85`
                }`}
              >
                <span>{meta.labelBn}</span>
                <span className="opacity-75">({toBnDigits(count)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Corporate Orders Table (Desktop) ───────────────────────────── */}
      <div className="hidden lg:block bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-600">
              <th className="py-4 px-6">প্রতিষ্ঠান ও যোগাযোগ</th>
              <th className="py-4 px-5">ইভেন্ট ও ডেলিভারি তারিখ</th>
              <th className="py-4 px-5">বাল্ক পরিমাণ ও আইটেম</th>
              <th className="py-4 px-5 text-right">বাজেট ও অগ্রিম</th>
              <th className="py-4 px-5">স্ট্যাটাস পাইপলাইন</th>
              <th className="py-4 px-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {filteredOrders.map((order) => {
              const meta = CORP_STATUS_META[order.status] || CORP_STATUS_META["New Lead"];
              return (
                <tr
                  key={order.id}
                  className="hover:bg-amber-50/20 transition-colors group cursor-pointer"
                  onClick={() => {
                    window.location.href = `/admin/corporate/${order.id}`;
                  }}
                >
                  {/* Company & Contact */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                        <Building2 className="w-5 h-5 text-amber-200" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 text-sm group-hover:text-[#C48A4E] transition-colors">
                          {order.companyName}
                        </div>
                        <div className="text-xs text-stone-500">
                          {order.contactPerson} ({order.designation})
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded">
                            {order.quotationNo}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {order.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Event & Date */}
                  <td className="py-4 px-5 text-xs">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[11px]">
                        {order.eventType}
                      </span>
                      <div className="text-stone-500 flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-[#C48A4E]" />
                        <span>ডেলিভারি: {order.deliveryDate}</span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity & Items */}
                  <td className="py-4 px-5 text-xs">
                    <div className="font-bold text-stone-800">
                      {order.approxQuantityText}
                    </div>
                    <div className="text-[11px] text-stone-400 truncate max-w-xs">
                      {order.items.map((i) => i.productTitle).join(", ")}
                    </div>
                  </td>

                  {/* Budget & Due */}
                  <td className="py-4 px-5 text-right text-xs">
                    <div className="font-extrabold text-stone-900 text-sm">
                      ৳ {toBnDigits(order.totalBudget.toLocaleString("en-IN"))}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">
                      অগ্রিম: ৳ {toBnDigits(order.advancePaid.toLocaleString("en-IN"))}
                    </div>
                    {order.dueAmount > 0 && (
                      <div className="text-[10px] text-red-600 font-semibold">
                        বকেয়া: ৳ {toBnDigits(order.dueAmount.toLocaleString("en-IN"))}
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    <select
                      value={order.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value as CorporateOrderStatus)
                      }
                      aria-label="অর্ডার স্ট্যাটাস পরিবর্তন"
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden ${meta.bg} ${meta.color} ${meta.border}`}
                    >
                      <option value="New Lead">নতুন ইনকোয়ারি</option>
                      <option value="Quotation Sent">কোটেশন পাঠানো হয়েছে</option>
                      <option value="Confirmed">অর্ডার নিশ্চিত</option>
                      <option value="In Production">কারখানায় প্রস্তুত হচ্ছে</option>
                      <option value="Delivered">ডেলিভারি সম্পন্ন</option>
                      <option value="Cancelled">বাতিল</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/admin/corporate/${order.id}`}
                        title="কোটেশন ও বিস্তারিত দেখুন"
                        className="p-2 text-stone-600 hover:text-[#351C1B] hover:bg-stone-100 rounded-xl transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </Link>

                      <Link
                        href={`/admin/corporate/new?edit=${order.id}`}
                        title="সম্পাদনা করুন"
                        className="p-2 text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setOrderToDelete(order)}
                        title="মুছে ফেলুন"
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── 5. Mobile Cards ─────────────────────────────────────────────── */}
      <div className="block lg:hidden space-y-4">
        {filteredOrders.map((order) => {
          const meta = CORP_STATUS_META[order.status] || CORP_STATUS_META["New Lead"];
          return (
            <div
              key={order.id}
              className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {order.companyName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {order.contactPerson} ({order.designation})
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${meta.bg} ${meta.color} ${meta.border}`}
                >
                  {meta.labelBn}
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1.5 text-stone-600">
                <div className="flex items-center justify-between font-mono">
                  <span>কোটেশন: {order.quotationNo}</span>
                  <a href={`tel:${order.phone}`} className="text-[#C48A4E] font-bold">
                    {order.phone}
                  </a>
                </div>
                <div className="text-[11px]">পরিমাণ: {order.approxQuantityText}</div>
                <div className="flex items-center justify-between font-bold text-stone-900 pt-1 border-t border-stone-200/60">
                  <span>বাজেট: ৳ {toBnDigits(order.totalBudget.toLocaleString("en-IN"))}</span>
                  <span className="text-emerald-700">
                    অগ্রিম: ৳ {toBnDigits(order.advancePaid.toLocaleString("en-IN"))}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
                <Link
                  href={`/admin/corporate/${order.id}`}
                  className="flex-1 py-2 bg-[#351C1B] hover:bg-[#4A2624] text-amber-100 rounded-xl font-bold text-center"
                >
                  কোটেশন ও চালান
                </Link>

                <Link
                  href={`/admin/corporate/new?edit=${order.id}`}
                  className="p-2 border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setOrderToDelete(order)}
                  className="p-2 border border-stone-200 hover:bg-red-50 text-red-500 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
