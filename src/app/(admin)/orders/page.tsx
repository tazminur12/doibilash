"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  XCircle,
  ShoppingBag,
  Package,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  X,
  FileText,
} from "lucide-react";
import {
  StoredOrder,
  OrderStatus,
  STATUS_META,
  getStoredOrders,
  deleteOrder,
  updateOrderStatus,
} from "@/lib/orderStorage";
import OrderInvoice from "@/components/admin/OrderInvoice";
import { toBnDigits } from "@/lib/bangla";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<StoredOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getStoredOrders());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm(`আপনি কি "${id}" অর্ডারটি মুছে ফেলতে চান?`)) {
      const updated = deleteOrder(id);
      setOrders(updated);
      showToast(`অর্ডার #${id} সফলভাবে মুছে ফেলা হয়েছে`);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.shippingAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusTab === "all" || order.status === statusTab;
    const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Metrics
  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered" || o.paymentStatus === "Paid")
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="font-bengali text-doibrand-dark space-y-6 pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-header-fade-up bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-doibrand-gold/40 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Top Header & '+ ম্যানুয়াল অর্ডার তৈরি করুন' Button ─────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
              অর্ডারসমূহ ও ইনভয়েস পরিচালনা
            </h1>
            <span className="bg-amber-100 text-doibrand-dark text-xs font-bold px-2.5 py-0.5 rounded-full font-sans">
              {toBnDigits(orders.length)} টি অর্ডার
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            দই বিলাসের অনলাইন ও অফলাইন সকল অর্ডারের স্টক, ডেলিভারি ট্র্যাকিং ও ইনভয়েস প্রিন্ট।
          </p>
        </div>

        {/* Primary Manual Order Action Button */}
        <Link
          href="/admin/orders/new"
          className="bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white px-5 py-2.5 rounded-xl transition-all font-bold flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer self-start sm:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ ম্যানুয়াল নতুন অর্ডার তৈরি করুন</span>
        </Link>
      </div>

      {/* ── 2. Top Executive Metric Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">মোট অর্ডার</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-doibrand-gold flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-doibrand-dark mt-1.5 font-sans">{orders.length}</p>
          <span className="text-[10px] text-stone-400">সকল গ্রাহকের অর্ডার</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">অপেক্ষমান</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100/60 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-amber-700 mt-1.5 font-sans">{pendingCount}</p>
          <span className="text-[10px] text-amber-600 font-medium">নিশ্চিতকরণ বাকি</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">প্রস্তুত হচ্ছে</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-blue-700 mt-1.5 font-sans">{processingCount}</p>
          <span className="text-[10px] text-blue-600 font-medium">প্যাকেজিং প্রক্রিয়াধীন</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">সফল ডেলিভারি</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-700 mt-1.5 font-sans">{deliveredCount}</p>
          <span className="text-[10px] text-emerald-600 font-medium">গ্রাহক গ্রহণ করেছেন</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">পরিশোধিত আয়</span>
            <span className="text-xs font-bold text-doibrand-accent font-sans">৳</span>
          </div>
          <p className="text-xl font-bold text-doibrand-accent mt-1.5 font-sans">
            ৳{totalRevenue.toLocaleString("en-US")}
          </p>
          <span className="text-[10px] text-stone-400">মোট সংগৃহীত রেভিনিউ</span>
        </div>
      </div>

      {/* ── 3. Status Tabs & Filters ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/90 shadow-2xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {[
            { id: "all", label: "সকল অর্ডার", count: orders.length },
            { id: "Pending", label: "অপেক্ষমান", count: pendingCount },
            { id: "Processing", label: "প্রস্তুত হচ্ছে", count: processingCount },
            { id: "Shipped", label: "ডেলিভারিতে আছে", count: shippedCount },
            { id: "Delivered", label: "সম্পন্ন", count: deliveredCount },
          ].map((tab) => {
            const isActive = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-doibrand-dark text-white shadow-2xs"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-sans ${
                    isActive ? "bg-white/20 text-white" : "bg-stone-200/70 text-stone-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Payment Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার নং, নাম বা ফোন..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-2.5 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none"
          >
            <option value="all">পেমেন্ট মেথড</option>
            <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি</option>
            <option value="bKash">বিকাশ (bKash)</option>
            <option value="Nagad">নগদ (Nagad)</option>
          </select>
        </div>
      </div>

      {/* ── 4. Desktop Orders Table ─────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F5] text-stone-600 font-bold text-xs py-4 px-6 border-b border-stone-200/80">
              <tr>
                <th className="py-4 px-6">অর্ডার ও তারিখ</th>
                <th className="py-4 px-6">গ্রাহকের নাম ও ফোন</th>
                <th className="py-4 px-6">পণ্যের বিবরণ</th>
                <th className="py-4 px-6">মোট প্রদেয়</th>
                <th className="py-4 px-6">পেমেন্ট</th>
                <th className="py-4 px-6">অর্ডার স্ট্যাটাস</th>
                <th className="py-4 px-6 text-right">একশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-stone-400 text-sm">
                    কোনো অর্ডার খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = STATUS_META[order.status] || STATUS_META.Pending;
                  const firstItem = order.items[0];

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-bold text-doibrand-accent hover:underline font-sans text-sm flex items-center gap-1"
                        >
                          <span>#{order.id}</span>
                        </Link>
                        <p className="text-[11px] text-stone-400 font-sans mt-0.5">
                          {order.createdAt}
                        </p>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-doibrand-dark text-sm">{order.customerName}</p>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="text-xs text-stone-500 hover:text-doibrand-accent font-sans mt-0.5 block"
                        >
                          {order.customerPhone}
                        </a>
                      </td>

                      {/* Items Summary with thumbnails */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {firstItem && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden relative bg-stone-100 border border-stone-200 shrink-0">
                              <Image
                                src={firstItem.image || "/Product/doi.jpg"}
                                alt={firstItem.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-800 truncate max-w-44">
                              {firstItem?.title || "পণ্য"}
                            </p>
                            <p className="text-[11px] text-stone-500 font-sans">
                              {order.items.length > 1
                                ? `+ আরো ${order.items.length - 1}টি আইটেম`
                                : `${firstItem?.quantity} টি`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-6">
                        <span className="font-bold font-sans text-doibrand-accent text-base">
                          ৳{order.totalAmount.toLocaleString("en-US")}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          {order.deliveryArea}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            order.paymentStatus === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.paymentStatus === "Paid" ? "পরিশোধিত" : "ক্যাশ অন ডেলিভারি"}
                        </span>
                        <span className="block text-[10px] text-stone-400 font-sans mt-0.5">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {statusInfo.labelBn}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Detail Page */}
                          <Link
                            href={`/admin/orders/${order.id}`}
                            title="বিস্তারিত দেখুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-doibrand-dark hover:bg-stone-100 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Print Invoice */}
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceOrder(order)}
                            title="ইনভয়েস প্রিন্ট করুন"
                            className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Edit Order */}
                          <Link
                            href={`/admin/orders/${order.id}/edit`}
                            title="সম্পাদনা করুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-doibrand-gold hover:bg-amber-50 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(order.id)}
                            title="মুছে ফেলুন"
                            className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Mobile Orders View Cards ─────────────────────────────────── */}
      <div className="block md:hidden grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => {
          const statusInfo = STATUS_META[order.status] || STATUS_META.Pending;
          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-bold text-doibrand-accent text-sm font-sans hover:underline"
                  >
                    #{order.id}
                  </Link>
                  <p className="text-[11px] text-stone-400 font-sans">{order.createdAt}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {statusInfo.labelBn}
                </span>
              </div>

              {/* Customer */}
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-stone-800">{order.customerName}</p>
                <p className="text-stone-500 font-sans">{order.customerPhone}</p>
                <p className="text-[11px] text-stone-400 line-clamp-1">{order.shippingAddress}</p>
              </div>

              {/* Items & Amount */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-500 block">
                    মোট {order.items.length} টি পণ্য
                  </span>
                  <span className="text-base font-bold text-doibrand-accent font-sans">
                    ৳{order.totalAmount}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    order.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.paymentStatus === "Paid" ? "পরিশোধিত" : "ক্যাশ অন ডেলিভারি"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceOrder(order)}
                  className="px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 bg-amber-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>ইনভয়েস</span>
                </button>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>বিস্তারিত</span>
                </Link>

                <Link
                  href={`/admin/orders/${order.id}/edit`}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal: Quick Printable Invoice View ───────────────────────── */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-header-fade-up overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-4 print:hidden">
              <h3 className="font-bold text-base text-doibrand-dark">
                অর্ডার #{selectedInvoiceOrder.id} ইনভয়েস প্রিভিউ
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
