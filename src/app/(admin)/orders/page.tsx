"use client";

import React, { useState } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

interface OrderRecord {
  id: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  items: string;
  amount: string;
  status: OrderStatus;
}

const DUMMY_ORDERS: OrderRecord[] = [
  {
    id: "#DB-98421",
    date: "১৬ অক্টোবর, ২০২৬",
    customer: "তানভীর আহমেদ",
    phone: "01712-345678",
    address: "সেক্টর ৪, উত্তরা, ঢাকা",
    items: "বগুড়ার স্পেশাল সরার দই (২টি)",
    amount: "৳ ১,৫০০",
    status: "Processing",
  },
  {
    id: "#DB-98420",
    date: "১৬ অক্টোবর, ২০২৬",
    customer: "শাহরিয়ার কবীর",
    phone: "01823-456789",
    address: "রোড ২৭, ধানমন্ডি, ঢাকা",
    items: "খাঁটি দানাদার গাওয়া ঘি (১টি)",
    amount: "৳ ৯৫০",
    status: "Pending",
  },
  {
    id: "#DB-98419",
    date: "১৫ অক্টোবর, ২০২৬",
    customer: "ফারহানা ইয়াসমিন",
    phone: "01934-567890",
    address: "রোড ৭১, গুলশান-২, ঢাকা",
    items: "ঐতিহ্যবাহী রসগোল্লা (৩টি)",
    amount: "৳ ১,৬৫০",
    status: "Delivered",
  },
  {
    id: "#DB-98418",
    date: "১৫ অক্টোবর, ২০২৬",
    customer: "মাহমুদুল হাসান",
    phone: "01545-678901",
    address: "ব্লক সি, মিরপুর-১০, ঢাকা",
    items: "স্পেশাল চমচম (২টি)",
    amount: "৳ ৮৮০",
    status: "Delivered",
  },
  {
    id: "#DB-98417",
    date: "১৪ অক্টোবর, ২০২৬",
    customer: "নাজমুল সাকিব",
    phone: "01656-789012",
    address: "রোড ১১, বনানী, ঢাকা",
    items: "মাটির হাঁড়ির মিষ্টি দই (১টি)",
    amount: "৳ ৪২০",
    status: "Cancelled",
  },
  {
    id: "#DB-98416",
    date: "১৪ অক্টোবর, ২০২৬",
    customer: "আব্দুল্লাহ আল মামুন",
    phone: "01767-890123",
    address: "জেলখানা মোড়, বগুড়া সদর, বগুড়া",
    items: "প্রিমিয়াম লাচ্ছা সেমাই (৪টি)",
    amount: "৳ ২,২০০",
    status: "Processing",
  },
];

const STATUS_BADGES: Record<
  OrderStatus,
  { labelBn: string; classes: string }
> = {
  Pending: {
    labelBn: "Pending",
    classes: "bg-yellow-100 text-yellow-700",
  },
  Processing: {
    labelBn: "Processing",
    classes: "bg-blue-100 text-blue-700",
  },
  Delivered: {
    labelBn: "Delivered",
    classes: "bg-green-100 text-green-700",
  },
  Cancelled: {
    labelBn: "Cancelled",
    classes: "bg-red-100 text-red-700",
  },
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Filter orders
  const filteredOrders = DUMMY_ORDERS.filter((order) => {
    if (statusFilter === "All") return true;
    return order.status === statusFilter;
  });

  return (
    <div className="p-6 font-bengali space-y-6">
      {/* ── 1. Header & Filters ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-bengali text-3xl font-bold text-gray-800 tracking-tight">
            অর্ডারসমূহ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            দই বিলাসের চলমান ও পূর্ববর্তী সকল অর্ডারের তালিকা পর্যবেক্ষণ ও পরিচালনা করুন
          </p>
        </div>

        {/* Dropdown Filter for Order Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-200 focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bengali bg-white text-gray-700 shadow-xs outline-none cursor-pointer"
          >
            <option value="All">সকল অর্ডার (All)</option>
            <option value="Pending">অপেক্ষমান (Pending)</option>
            <option value="Processing">প্রসেসিং (Processing)</option>
            <option value="Delivered">ডেলিভারড (Delivered)</option>
            <option value="Cancelled">বাতিলকৃত (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* ── 2. Desktop Orders Data Table (Hidden on Mobile) ───────────── */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead className="bg-gray-50 text-gray-600 font-semibold text-sm border-b border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left">Order ID</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Amount</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const badge = STATUS_BADGES[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/70 transition-colors group"
                    >
                      <td className="py-4 px-6 font-bold font-sans text-doibrand-dark">
                        {order.id}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-xs">
                        {order.date}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          {order.customer}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate max-w-[200px]">
                          {order.items}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold font-sans text-doibrand-accent">
                        {order.amount}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badge.classes}`}
                        >
                          {badge.labelBn}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          title="অর্ডার বিস্তারিত দেখুন"
                          className="hover:bg-gray-100 text-gray-500 hover:text-doibrand-gold transition-colors p-2 rounded-full cursor-pointer inline-flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <span>কোনো অর্ডার পাওয়া যায়নি</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Mobile Responsiveness: Stacked Cards (block md:hidden) ─── */}
      <div className="block md:hidden space-y-4 mt-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const badge = STATUS_BADGES[order.status];
            return (
              <div
                key={order.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3"
              >
                {/* Top Row: Order ID & Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-bold font-sans text-base text-doibrand-dark">
                    {order.id}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold ${badge.classes}`}
                  >
                    {badge.labelBn}
                  </span>
                </div>

                {/* Middle Row: Customer Name & Items */}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.items}</p>
                </div>

                {/* Bottom Row: Date, Amount & View Button */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-400 block">{order.date}</span>
                    <span className="font-bold font-sans text-base text-doibrand-accent">
                      {order.amount}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-doibrand-gold text-doibrand-gold text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>বিস্তারিত</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <span>কোনো অর্ডার নেই</span>
          </div>
        )}
      </div>

      {/* ── 3. Pagination ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          সর্বমোট <strong className="font-bold text-gray-800">{filteredOrders.length}</strong> টি অর্ডারের মধ্যে{" "}
          <strong className="font-bold text-gray-800">১-৬</strong> দেখানো হচ্ছে
        </p>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {/* Page Numbers */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              currentPage === 1
                ? "bg-doibrand-dark text-white rounded-md"
                : "text-gray-600 hover:bg-gray-100 rounded-md"
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              currentPage === 2
                ? "bg-doibrand-dark text-white rounded-md"
                : "text-gray-600 hover:bg-gray-100 rounded-md"
            }`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              currentPage === 3
                ? "bg-doibrand-dark text-white rounded-md"
                : "text-gray-600 hover:bg-gray-100 rounded-md"
            }`}
          >
            3
          </button>

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage === 3}
            onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Order Details Modal ────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-doibrand-dark">
                  অর্ডার বিস্তারিত: {selectedOrder.id}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {selectedOrder.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-gray-600 font-medium">অর্ডার স্ট্যাটাস:</span>
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    STATUS_BADGES[selectedOrder.status].classes
                  }`}
                >
                  {STATUS_BADGES[selectedOrder.status].labelBn}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-gray-500">গ্রাহকের নাম:</span>
                  <span className="text-gray-900 font-bold">{selectedOrder.customer}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span className="text-gray-500">মোবাইল নম্বর:</span>
                  <span className="text-gray-900 font-sans">{selectedOrder.phone}</span>
                </div>
                <div className="flex items-start justify-between font-medium">
                  <span className="text-gray-500">ঠিকানা:</span>
                  <span className="text-gray-900 text-right">{selectedOrder.address}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-gray-500">অর্ডারকৃত পণ্য:</span>
                  <span className="text-gray-900 font-semibold">{selectedOrder.items}</span>
                </div>
                <div className="flex items-center justify-between font-medium pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">মোট মূল্য:</span>
                  <span className="text-base font-bold text-doibrand-accent font-sans">
                    {selectedOrder.amount}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-doibrand-dark text-white rounded-xl text-xs font-semibold hover:bg-stone-900 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
