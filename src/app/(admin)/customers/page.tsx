"use client";

import React, { useState } from "react";
import {
  Search,
  User,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  X,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  avatarInitials: string;
}

const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: "CUST-001",
    name: "রহিম উদ্দিন",
    email: "rahim.uddin@example.com",
    phone: "01712-345678",
    address: "সেক্টর ৪, উত্তরা, ঢাকা",
    totalOrders: 12,
    totalSpent: "৳ ১৮,৪৫০",
    status: "Active",
    joinedDate: "১২ জানুয়ারি, ২০২৬",
    avatarInitials: "রউ",
  },
  {
    id: "CUST-002",
    name: "তানভীর আহমেদ",
    email: "tanvir.ahmed@example.com",
    phone: "01823-456789",
    address: "ধানমন্ডি ২৭, ঢাকা",
    totalOrders: 8,
    totalSpent: "৳ ১২,২০০",
    status: "Active",
    joinedDate: "০৫ মার্চ, ২০২৬",
    avatarInitials: "তা",
  },
  {
    id: "CUST-003",
    name: "শাহরিয়ার কবীর",
    email: "shahriar.kabir@example.com",
    phone: "01934-567890",
    address: "গুলশান-২, ঢাকা",
    totalOrders: 5,
    totalSpent: "৳ ৭,৯৫০",
    status: "Active",
    joinedDate: "১৮ মে, ২০২৬",
    avatarInitials: "শাক",
  },
  {
    id: "CUST-004",
    name: "ফারহানা ইয়াসমিন",
    email: "farhana.yasmin@example.com",
    phone: "01545-678901",
    address: "বনানী রোড ১১, ঢাকা",
    totalOrders: 3,
    totalSpent: "৳ ৪,৬০০",
    status: "Inactive",
    joinedDate: "২২ জুলাই, ২০২৬",
    avatarInitials: "ফায়া",
  },
  {
    id: "CUST-005",
    name: "মাহমুদুল হাসান",
    email: "mahmudul.h@example.com",
    phone: "01656-789012",
    address: "মিরপুর-১০, ঢাকা",
    totalOrders: 9,
    totalSpent: "৳ ১৩,৭০০",
    status: "Active",
    joinedDate: "০৯ আগস্ট, ২০২৬",
    avatarInitials: "মাহা",
  },
  {
    id: "CUST-006",
    name: "নুসরাত জাহান",
    email: "nusrat.jahan@example.com",
    phone: "01767-890123",
    address: "বগুড়া সদর, বগুড়া",
    totalOrders: 1,
    totalSpent: "৳ ১,২৫০",
    status: "Inactive",
    joinedDate: "১৪ সেপ্টেম্বর, ২০২৬",
    avatarInitials: "নুজা",
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newStatus = c.status === "Active" ? "Inactive" : "Active";
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  return (
    <div className="p-6 font-bengali space-y-6">
      {/* ── 1. Header Area ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-bengali text-3xl font-bold text-gray-800 tracking-tight">
            গ্রাহকবৃন্দ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            দই বিলাসের সকল নিবন্ধিত গ্রাহকের তথ্য, মোট অর্ডার ও খরচের বিবরণ
          </p>
        </div>

        {/* Right: Search Input with left-aligned Search icon */}
        <div className="relative self-start sm:self-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গ্রাহক খুঁজুন..."
            className="border border-gray-200 focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-full pl-10 pr-4 py-2 w-64 md:w-80 shadow-sm text-xs sm:text-sm font-bengali text-gray-800 placeholder-gray-400 outline-none transition-all bg-white"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Customer Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500">মোট গ্রাহক সংখ্যা</span>
          <p className="text-xl font-bold text-doibrand-dark mt-0.5 font-sans">
            {customers.length} জন
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-xs text-emerald-600 font-semibold">সক্রিয় গ্রাহক (Active)</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5 font-sans">
            {customers.filter((c) => c.status === "Active").length} জন
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500">নিষ্ক্রিয় গ্রাহক (Inactive)</span>
          <p className="text-xl font-bold text-gray-600 mt-0.5 font-sans">
            {customers.filter((c) => c.status === "Inactive").length} জন
          </p>
        </div>
      </div>

      {/* ── 2. Customers Data Table (Desktop View) ──────────────────────── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            {/* Table Header */}
            <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Phone/Email</th>
                <th className="py-4 px-6 text-center">Total Orders</th>
                <th className="py-4 px-6 text-left">Total Spent</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => {
                  const isActive = cust.status === "Active";

                  return (
                    <tr
                      key={cust.id}
                      className="hover:bg-stone-50/70 transition-colors group"
                    >
                      {/* Customer Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                            {cust.avatarInitials}
                          </div>
                          <div className="ml-3">
                            <span className="font-semibold text-gray-800 block">
                              {cust.name}
                            </span>
                            <span className="text-[11px] text-gray-400 font-sans block">
                              {cust.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone/Email Column */}
                      <td className="py-4 px-6 text-xs text-gray-600 space-y-0.5 font-sans">
                        <div className="flex items-center gap-1.5 text-gray-800">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{cust.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{cust.email}</span>
                        </div>
                      </td>

                      {/* Total Orders Column */}
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-gray-700 font-sans">
                          {cust.totalOrders} টি
                        </span>
                      </td>

                      {/* Total Spent Column */}
                      <td className="py-4 px-6 font-sans">
                        <span className="text-doibrand-accent font-bold text-base">
                          {cust.totalSpent}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 'View Profile' icon button (Lucide User) */}
                          <button
                            type="button"
                            onClick={() => setSelectedCustomer(cust)}
                            title="প্রোফাইল দেখুন"
                            className="p-2 rounded-lg text-gray-500 hover:text-doibrand-gold hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4" />
                          </button>

                          {/* 'Block/Unblock' toggle icon */}
                          <button
                            type="button"
                            onClick={() => toggleStatus(cust.id)}
                            title={isActive ? "গ্রাহক ব্লক/নিষ্ক্রিয় করুন" : "গ্রাহক সক্রিয় করুন"}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              isActive
                                ? "text-gray-400 hover:text-red-500 hover:bg-red-50"
                                : "text-emerald-500 hover:text-emerald-600 hover:bg-green-50"
                            }`}
                          >
                            {isActive ? (
                              <Ban className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    <User className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <span>কোনো গ্রাহক পাওয়া যায়নি</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile View: Cards Grid (block md:hidden) ─────────────────── */}
      <div className="block md:hidden space-y-4 mt-6">
        {filteredCustomers.map((cust) => {
          const isActive = cust.status === "Active";

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600 shrink-0">
                    {cust.avatarInitials}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {cust.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-sans">{cust.id}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {cust.status}
                </span>
              </div>

              <div className="text-xs text-gray-600 space-y-1 font-sans pt-2 border-t border-gray-50">
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cust.phone}</span>
                </p>
                <p className="flex items-center gap-1.5 text-gray-400">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cust.email}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 block text-[11px]">মোট খরচ</span>
                  <span className="text-doibrand-accent font-bold text-base font-sans">
                    {cust.totalSpent}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCustomer(cust)}
                    className="p-2 rounded-lg text-gray-600 hover:text-doibrand-gold bg-stone-50"
                    title="প্রোফাইল দেখুন"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(cust.id)}
                    className={`p-2 rounded-lg ${
                      isActive
                        ? "text-red-500 bg-red-50"
                        : "text-emerald-600 bg-green-50"
                    }`}
                    title="স্ট্যাটাস পরিবর্তন"
                  >
                    {isActive ? <Ban className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal: Customer Profile Details ────────────────────────────── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-700">
                  {selectedCustomer.avatarInitials}
                </div>
                <div>
                  <h3 className="font-bold text-base text-doibrand-dark">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans">{selectedCustomer.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                <span className="text-gray-500 font-medium">অ্যাকাউন্ট স্ট্যাটাস:</span>
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    selectedCustomer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {selectedCustomer.status}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">মোবাইল:</span>
                  <span className="font-semibold text-gray-800 font-sans">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ইমেইল:</span>
                  <span className="font-semibold text-gray-800 font-sans">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ঠিকানা:</span>
                  <span className="font-semibold text-gray-800 text-right">{selectedCustomer.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">নিবন্ধনের তারিখ:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.joinedDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                  <span className="text-gray-500 block text-[11px]">মোট অর্ডার</span>
                  <strong className="text-base text-doibrand-dark font-sans">{selectedCustomer.totalOrders} টি</strong>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                  <span className="text-gray-500 block text-[11px]">মোট কেনাকাটা</span>
                  <strong className="text-base text-doibrand-accent font-sans">{selectedCustomer.totalSpent}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
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
