"use client";

import React from "react";
import Link from "next/link";
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
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "আজকের মোট বিক্রি",
      titleEn: "Today's Sales",
      value: "৳ ২৪,৫০০",
      change: "+১২.৫%",
      isPositive: true,
      icon: TrendingUp,
      color: "amber",
    },
    {
      title: "নতুন অর্ডারসমূহ",
      titleEn: "New Orders",
      value: "২৮ টি",
      change: "+৫ টি নতুন",
      isPositive: true,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      title: "মোট মজুদ পণ্য",
      titleEn: "Total Products",
      value: "৩৬ টি",
      change: "৪ টি স্টক শেষের পথে",
      isPositive: false,
      icon: Package,
      color: "emerald",
    },
    {
      title: "নিবন্ধিত গ্রাহক",
      titleEn: "Active Customers",
      value: "৮২০ জন",
      change: "+১৮ জন চলতি সপ্তাহে",
      isPositive: true,
      icon: Users,
      color: "purple",
    },
  ];

  const recentOrders = [
    {
      id: "#DB-1035",
      customer: "তানভীর আহমেদ",
      items: "বগুড়ার স্পেশাল সরার দই (২টি)",
      total: "৳ ১,৫০০",
      status: "Processing",
      statusBn: "প্রসেসিং হচ্ছে",
      time: "১০ মিনিট আগে",
    },
    {
      id: "#DB-1034",
      customer: "শাহরিয়ার কবীর",
      items: "খাঁটি দানাদার গাওয়া ঘি (১টি)",
      total: "৳ ৯৫০",
      status: "Shipped",
      statusBn: "শিপমেন্টে আছে",
      time: "৪৫ মিনিট আগে",
    },
    {
      id: "#DB-1033",
      customer: "নুসরাত জাহান",
      items: "ঐতিহ্যবাহী রসগোল্লা (৩টি)",
      total: "৳ ১,৬৫০",
      status: "Delivered",
      statusBn: "ডেলিভারি সম্পন্ন",
      time: "২ ঘণ্টা আগে",
    },
    {
      id: "#DB-1032",
      customer: "মাহমুদুল হাসান",
      items: "স্পেশাল চমচম (২টি)",
      total: "৳ ৮৮০",
      status: "Delivered",
      statusBn: "ডেলিভারি সম্পন্ন",
      time: "৩ ঘণ্টা আগে",
    },
  ];

  return (
    <div className="space-y-8 font-bengali">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-doibrand-dark">
            ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            দই বিলাসের আজকের সামগ্রিক বিক্রয় ও কার্যক্রমের সারসংক্ষেপ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-doibrand-dark text-white text-xs sm:text-sm font-semibold hover:bg-doibrand-gold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-500">
                  {stat.title}
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-doibrand-dark font-sans">
                {stat.value}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <span
                  className={`font-semibold flex items-center gap-0.5 ${
                    stat.isPositive ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-400 font-sans text-[11px]">
                  ({stat.titleEn})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-doibrand-dark">
              সাম্প্রতিক অর্ডারসমূহ
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              সর্বশেষ প্রাপ্ত অর্ডারের বর্তমান অবস্থা ও বিবরণ
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-doibrand-gold hover:underline flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">অর্ডার আইডি</th>
                <th className="py-3.5 px-6">গ্রাহকের নাম</th>
                <th className="py-3.5 px-6">পণ্য বিবরণ</th>
                <th className="py-3.5 px-6">মূল্য</th>
                <th className="py-3.5 px-6">স্ট্যাটাস</th>
                <th className="py-3.5 px-6 text-right">সময়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-doibrand-dark">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold font-sans text-doibrand-dark">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 font-medium">{order.customer}</td>
                  <td className="py-4 px-6 text-gray-600">{order.items}</td>
                  <td className="py-4 px-6 font-bold font-sans text-doibrand-accent">
                    {order.total}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        order.status === "Processing"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : order.status === "Shipped"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {order.statusBn}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-400">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
