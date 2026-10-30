"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  Sparkles,
  DollarSign,
  Truck,
  Star,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Check,
  Percent,
  FolderTree,
  Building2,
  Gift,
} from "lucide-react";
import { getStoredOrders, StoredOrder, STATUS_META } from "@/lib/orderStorage";
import { getStoredProducts, StoredProduct } from "@/lib/productStorage";
import { getStoredCustomers, StoredCustomer } from "@/lib/customerStorage";
import {
  getStoredCorporateOrders,
  CorporateOrder,
  CORP_STATUS_META,
} from "@/lib/corporateOrderStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [products, setProducts] = useState<StoredProduct[]>([]);
  const [customers, setCustomers] = useState<StoredCustomer[]>([]);
  const [corporateOrders, setCorporateOrders] = useState<CorporateOrder[]>([]);

  useEffect(() => {
    setOrders(getStoredOrders());
    setProducts(getStoredProducts());
    setCustomers(getStoredCustomers());
    setCorporateOrders(getStoredCorporateOrders());
  }, []);

  // Aggregated KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCorporatePipeline = corporateOrders.reduce((sum, c) => sum + (c.totalBudget || 0), 0);
  const corporateInProduction = corporateOrders.filter((c) => c.status === "In Production").length;
  const totalOrdersCount = orders.length;
  const pendingOrProcessingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Processing"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const totalCustomersCount = customers.length;
  const vipCustomersCount = customers.filter(
    (c) => c.tier === "VIP" || c.tier === "Gold"
  ).length;
  const totalProductsCount = products.length;
  const inStockProducts = products.filter((p) => p.stockStatus === "In Stock").length;

  // Average Order Value (AOV)
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Weekly Activity Data (Mocked realistic curve with today highlighted)
  const WEEK_DAYS = [
    { day: "শনি", full: "শনিবার", amount: 18450, orders: 12, height: 60 },
    { day: "রবি", full: "রবিবার", amount: 24200, orders: 15, height: 78 },
    { day: "সোম", full: "সোমবার", amount: 16800, orders: 10, height: 52 },
    { day: "মঙ্গল", full: "মঙ্গলবার", amount: 28900, orders: 19, height: 92 },
    { day: "বুধ", full: "বুধবার", amount: 21500, orders: 14, height: 70 },
    { day: "বৃহঃ", full: "বৃহস্পতিবার", amount: 31200, orders: 21, height: 98 },
    { day: "শুক্র", full: "শুক্রবার (আজ)", amount: 26400, orders: 18, height: 85, isToday: true },
  ];

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* ── 1. Welcome & Store Pulse Banner ─────────────────────────────── */}
      <div className="bg-linear-to-r from-[#2A1413] via-[#351C1B] to-[#4A2624] rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl border border-amber-900/40 relative overflow-hidden">
        {/* Warm Ambient Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#C48A4E]/25 via-amber-900/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-linear-to-tr from-[#A95E35]/20 to-transparent rounded-full blur-2xl pointer-events-none -mb-20" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>দই বিলাস এক্সিকিউটিভ ড্যাশবোর্ড</span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-white/80 font-normal">বগুড়ার খাঁটি ঐতিহ্য</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              শুভ দিন, সুপার অ্যাডমিন 👑
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-medium">
              আজকের সামগ্রিক বিক্রয়, নতুন অর্ডার প্রবাহ এবং গ্রাহক লয়ালটি এক নজরে পর্যালোচনা করুন।
              সকল স্টোর ডাটাবেজ সরাসরি সিংকড রয়েছে।
            </p>

            <div className="flex items-center gap-3 pt-1 text-[11px] text-amber-200/70 font-sans">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bengali text-emerald-300 font-semibold">লাইভ স্টোর অনলাইন</span>
              </span>
              <span>•</span>
              <span className="font-bengali">
                {new Date().toLocaleDateString("bn-BD", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/admin/orders/new"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white font-bold text-xs sm:text-sm shadow-lg shadow-black/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
                <Plus className="w-3.5 h-3.5 text-white" />
              </div>
              <span>ম্যানুয়াল নতুন অর্ডার</span>
            </Link>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 font-bold text-xs sm:text-sm border border-white/15 transition-all"
            >
              <Package className="w-4 h-4 text-amber-300" />
              <span>নতুন পণ্য যোগ</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 border border-white/15 transition-all"
              title="ওয়েবসাইট লাইভ ভিউ"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Top 4 Executive KPI Cards ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:border-[#C48A4E]/40 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              মোট আয় / বিক্রয় (Revenue)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#351C1B]/5 text-[#351C1B] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <TrendingUp className="w-5 h-5 text-[#C48A4E]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#351C1B] tracking-tight">
            ৳ {toBnDigits(totalRevenue.toLocaleString("en-IN"))}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="text-emerald-500">↑</span> +১৮.২% বৃদ্ধি
            </span>
            <span className="text-stone-400 font-medium">
              AOV: ৳ {toBnDigits(aov.toLocaleString("en-IN"))}
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:border-blue-300/50 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              মোট অর্ডার (Orders)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {toBnDigits(totalOrdersCount)}{" "}
            <span className="text-sm font-normal text-stone-400">টি</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 text-xs">
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
              {toBnDigits(pendingOrProcessingOrders)} টি প্রসেসিং
            </span>
            <span className="text-emerald-600 font-bold">
              {toBnDigits(deliveredOrders)} সম্পন্ন
            </span>
          </div>
        </div>

        {/* Card 3: Registered Customers */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:border-amber-300/60 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              নিবন্ধিত গ্রাহক (Customers)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Users className="w-5 h-5 text-[#C48A4E]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {toBnDigits(totalCustomersCount)}{" "}
            <span className="text-sm font-normal text-stone-400">জন</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 text-xs">
            <span className="text-amber-800 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{toBnDigits(vipCustomersCount)} জন VIP/গোল্ড</span>
            </span>
            <span className="text-stone-400 font-medium">লয়ালটি মেম্বার</span>
          </div>
        </div>

        {/* Card 4: Catalog Products */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:border-emerald-300/50 hover:shadow-md transition-all group relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              ক্যাটালগ পণ্য (Inventory)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {toBnDigits(totalProductsCount)}{" "}
            <span className="text-sm font-normal text-stone-400">আইটেম</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 text-xs">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{toBnDigits(inStockProducts)} টি স্টকে সচল</span>
            </span>
            <span className="text-stone-400 font-medium">সরাসরি প্রস্তুত</span>
          </div>
        </div>
      </div>

      {/* ── 3. Visual Analytics & Order Status Breakdown ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Weekly Sales Bar Analytics */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>সাপ্তাহিক সেলস ট্র্যাকার</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#351C1B]">
                গত ৭ দিনের বিক্রয় পারফরম্যান্স
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                মোট সপ্তাহ: ৳ {toBnDigits((167450).toLocaleString("en-IN"))}
              </span>
            </div>
          </div>

          {/* Visual CSS Bar Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-stone-200/60 pb-3">
              {WEEK_DAYS.map((w, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#351C1B] text-amber-100 text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none shadow-lg whitespace-nowrap mb-1">
                    ৳ {toBnDigits(w.amount.toLocaleString("en-IN"))} ({toBnDigits(w.orders)} অর্ডার)
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-stone-100 rounded-t-xl overflow-hidden relative flex items-end justify-center">
                    <div
                      style={{ height: `${w.height}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        w.isToday
                          ? "bg-linear-to-t from-[#351C1B] via-[#4A2624] to-[#C48A4E] shadow-md shadow-[#C48A4E]/30"
                          : "bg-linear-to-t from-stone-200 to-amber-200/80 group-hover:from-[#C48A4E]/60 group-hover:to-[#C48A4E]"
                      }`}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`text-xs font-bold mt-1 ${
                      w.isToday ? "text-[#C48A4E]" : "text-stone-500 group-hover:text-stone-800"
                    }`}
                  >
                    {w.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400 pt-3 px-2">
              <span>সর্বনিম্ন: ৳ {toBnDigits((16800).toLocaleString("en-IN"))}</span>
              <span className="flex items-center gap-1.5 text-stone-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-sm bg-linear-to-r from-[#351C1B] to-[#C48A4E]"></span>
                <span>আজকের বিক্রয় ভলিউম</span>
              </span>
              <span>সর্বোচ্চ: ৳ {toBnDigits((31200).toLocaleString("en-IN"))}</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Order Status & Quick Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-[#351C1B] text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C48A4E]" />
                <span>অর্ডার স্ট্যাটাস বিন্যাস</span>
              </h3>
              <Link href="/admin/orders" className="text-xs text-[#C48A4E] hover:underline font-bold">
                সব দেখুন
              </Link>
            </div>

            {/* Status Breakdown Bars */}
            <div className="space-y-4 pt-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>ডেলিভারি সম্পন্ন (Delivered)</span>
                  </span>
                  <span>{toBnDigits(deliveredOrders)} টি</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${totalOrdersCount > 0 ? (deliveredOrders / totalOrdersCount) * 100 : 60}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>প্রসেসিং ও কিচেনে (Processing)</span>
                  </span>
                  <span>{toBnDigits(pendingOrProcessingOrders)} টি</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${totalOrdersCount > 0 ? (pendingOrProcessingOrders / totalOrdersCount) * 100 : 30}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>শিপমেন্টে আছে (Shipped)</span>
                  </span>
                  <span>
                    {toBnDigits(orders.filter((o) => o.status === "Shipped").length || 1)} টি
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction Card */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-2 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>গ্রাহক সন্তুষ্টি হার</span>
              </span>
              <span className="text-sm font-black text-amber-950">৯৮.৫%</span>
            </div>
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              বগুড়ার খাঁটি সরার দই এবং গাওয়া ঘিয়ের গুণগত মানে ৯৮% গ্রাহক ৫-স্টার রিভিউ দিয়েছেন।
            </p>
          </div>
        </div>
      </div>

      {/* ── 4. Recent Orders Table ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-7 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <Clock className="w-3.5 h-3.5" />
              <span>রিয়েল-টাইম অর্ডার কার্যকলাপ</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#351C1B]">
              সাম্প্রতিক অর্ডারসমূহ
            </h2>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
          >
            <span>সকল অর্ডার তালিকা দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                <th className="py-4 px-6">অর্ডার আইডি</th>
                <th className="py-4 px-6">গ্রাহকের নাম ও ফোন</th>
                <th className="py-4 px-6">আইটেম বিবরণ</th>
                <th className="py-4 px-5">পেমেন্ট মেথড</th>
                <th className="py-4 px-5 text-right">মূল্য</th>
                <th className="py-4 px-6">স্ট্যাটাস</th>
                <th className="py-4 px-6 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => {
                const statusMeta = STATUS_META[order.status] || STATUS_META.Pending;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-amber-50/20 transition-colors group cursor-pointer"
                    onClick={() => {
                      window.location.href = `/admin/orders/${order.id}`;
                    }}
                  >
                    <td className="py-4 px-6 font-bold font-mono text-stone-900 group-hover:text-[#C48A4E] transition-colors">
                      {order.id}
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-stone-900 text-sm">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {order.customerPhone}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-stone-600 max-w-xs truncate">
                      {order.items.map((i) => `${i.title} (${toBnDigits(i.quantity)})`).join(", ")}
                    </td>

                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                        {order.paymentMethod === "bKash"
                          ? "বিকাশ"
                          : order.paymentMethod === "Nagad"
                          ? "নগদ"
                          : "ক্যাশ অন ডেলিভারি"}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right font-extrabold text-stone-900 text-sm">
                      ৳ {toBnDigits(order.totalAmount.toLocaleString("en-IN"))}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                        <span>{statusMeta.labelBn}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 text-stone-500 hover:text-[#351C1B] hover:bg-stone-100 rounded-lg inline-flex items-center justify-center transition-colors"
                        title="বিস্তারিত দেখুন"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Popular Products & Quick Restock Shelf ─────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <Package className="w-3.5 h-3.5" />
              <span>ইনভেন্টরি হাইলাইটস</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#351C1B]">
              জনপ্রিয় খাদ্যপণ্য ও ইনভেন্টরি স্টেটাস
            </h2>
          </div>

          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#C48A4E] hover:underline flex items-center gap-1"
          >
            <span>সকল পণ্য ম্যানেজ করুন</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((prod) => (
            <div
              key={prod.id}
              className="bg-stone-50/50 hover:bg-white rounded-2xl p-4 border border-stone-200/80 hover:border-amber-300/60 hover:shadow-md transition-all group space-y-3"
            >
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {prod.category}
                </span>
                {prod.badge && (
                  <span className="absolute top-2 right-2 bg-[#C48A4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                    {prod.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-[#C48A4E] transition-colors">
                  {prod.name}
                </h4>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-sm font-extrabold text-[#351C1B]">
                    ৳ {toBnDigits(prod.price)}
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                        ৳ {toBnDigits(prod.originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {prod.stockStatus === "In Stock" ? "স্টকে আছে" : "স্টক শেষ"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Corporate & Bulk B2B Orders Section ──────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Building2 className="w-3.5 h-3.5" />
              <span>বিটুবি প্রাতিষ্ঠানিক ও বাল্ক অর্ডার</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#351C1B]">
              কর্পোরেট অর্ডার পাইপলাইন ও কোটেশন
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              মোট পাইপলাইন মূল্য: <strong className="text-blue-900 font-bold">৳ {toBnDigits(totalCorporatePipeline.toLocaleString("en-IN"))}</strong> • কারখানায় প্রস্তুত হচ্ছে: <strong className="text-orange-700 font-bold">{toBnDigits(corporateInProduction)} টি অর্ডার</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/corporate/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন কর্পোরেট কোটেশন</span>
            </Link>

            <Link
              href="/admin/corporate"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
            >
              <span>সকল কোটেশন ({toBnDigits(corporateOrders.length)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Corporate Orders Mini Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {corporateOrders.slice(0, 3).map((corp) => {
            const cMeta = CORP_STATUS_META[corp.status] || CORP_STATUS_META["New Lead"];
            return (
              <Link
                key={corp.id}
                href={`/admin/corporate/${corp.id}`}
                className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-blue-700 transition-colors line-clamp-1">
                        {corp.companyName}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {corp.contactPerson} • {corp.eventType}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-white p-2.5 rounded-xl border border-stone-200/60">
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>পরিমাণ:</span>
                    <span className="font-bold text-stone-800">{corp.approxQuantityText}</span>
                  </div>
                  <div className="flex justify-between font-black text-xs text-[#351C1B]">
                    <span>বাজেট:</span>
                    <span>৳ {toBnDigits(corp.totalBudget.toLocaleString("en-IN"))}</span>
                  </div>
                  {corp.advancePaid > 0 && (
                    <div className="flex justify-between text-[11px] text-emerald-700 font-bold">
                      <span>অগ্রিম জমা:</span>
                      <span>৳ {toBnDigits(corp.advancePaid.toLocaleString("en-IN"))}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full font-bold border ${cMeta.bg} ${cMeta.color} ${cMeta.border}`}
                  >
                    {cMeta.labelBn}
                  </span>
                  <span className="text-stone-400 flex items-center gap-1 group-hover:text-blue-600 font-medium">
                    <span>কোটেশন দেখুন</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── 7. Admin Fast Shortcuts Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/admin/orders/new"
          className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-[#C48A4E] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C48A4E] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#C48A4E] transition-colors">
              ম্যানুয়াল অর্ডার তৈরি
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">নতুন অর্ডার প্লেস করুন</p>
          </div>
        </Link>

        <Link
          href="/admin/corporate"
          className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-blue-700 transition-colors">
              কর্পোরেট ও বাল্ক অর্ডার
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">বিটুবি কোটেশন ও চুক্তি</p>
          </div>
        </Link>

        <Link
          href="/admin/packages"
          className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-rose-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-rose-700 transition-colors">
              উপহার ও উৎসব সম্ভার
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">গিফট হ্যাম্পার প্যাকেজ</p>
          </div>
        </Link>

        <Link
          href="/admin/customers"
          className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-[#C48A4E] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#C48A4E] transition-colors">
              গ্রাহক ডাটাবেজ
            </h4>
            <p className="text-[11px] text-stone-500 mt-0.5">ভিআইপি লয়ালটি মেম্বার</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
