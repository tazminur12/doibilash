"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  Star,
  MapPin,
  TrendingUp,
  Filter,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import {
  StoredCustomer,
  CustomerTier,
  CustomerStatus,
  TIER_META,
  getStoredCustomers,
  deleteCustomer,
  saveCustomer,
} from "@/lib/customerStorage";
import { toBnDigits } from "@/lib/bangla";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<StoredCustomer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<CustomerTier | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<CustomerStatus | "ALL">("ALL");
  const [selectedCity, setSelectedCity] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<StoredCustomer | null>(null);

  const loadData = () => {
    setCustomers(getStoredCustomers());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyPhone = (id: string, phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`ফোন নম্বর কপি করা হয়েছে: ${phone}`);
  };

  const handleToggleStatus = (cust: StoredCustomer, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedStatus: CustomerStatus = cust.status === "Active" ? "Inactive" : "Active";
    const updatedCust: StoredCustomer = { ...cust, status: updatedStatus };
    saveCustomer(updatedCust);
    loadData();
    showToast(
      `${cust.name} কে ${updatedStatus === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে`
    );
  };

  const confirmDelete = () => {
    if (!customerToDelete) return;
    deleteCustomer(customerToDelete.id);
    loadData();
    showToast(`গ্রাহক "${customerToDelete.name}" মুছে ফেলা হয়েছে`);
    setCustomerToDelete(null);
  };

  // Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const vipOrGoldCustomers = customers.filter(
    (c) => c.tier === "VIP" || c.tier === "Gold"
  ).length;
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  // Filtered List
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === "ALL" || c.tier === selectedTier;
    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    const matchesCity = selectedCity === "ALL" || c.city === selectedCity;

    return matchesSearch && matchesTier && matchesStatus && matchesCity;
  });

  return (
    <div className="space-y-8 font-bengali pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#351C1B] text-amber-100 px-5 py-3 rounded-xl shadow-2xl border border-amber-600/30 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-lg">গ্রাহক মুছে ফেলার নিশ্চয়তা</h3>
                <p className="text-xs text-stone-500">এই অ্যাকশনটি ফেরত নেওয়া যাবে না</p>
              </div>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              আপনি কি নিশ্চিত যে আপনি গ্রাহক{" "}
              <strong className="text-stone-900">{customerToDelete.name}</strong>{" "}
              ({customerToDelete.phone})-কে তালিকা থেকে মুছে ফেলতে চান?
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setCustomerToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-medium transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C48A4E] mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>গ্রাহক সম্পর্ক ব্যবস্থাপনা (CRM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#351C1B] tracking-tight">
            গ্রাহকবৃন্দ ও লয়ালটি প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            দই বিলাসের সম্মানিত গ্রাহকদের ডাটাবেজ, অর্ডার হিস্ট্রি এবং নতুন প্রোফাইল তৈরি করুন।
          </p>
        </div>

        {/* Action Button: Manually Add Customer */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers/new"
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-sm shadow-lg shadow-[#351C1B]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all group"
          >
            <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="w-4 h-4 text-amber-200" />
            </div>
            <span>ম্যানুয়ালি নতুন গ্রাহক যুক্ত করুন</span>
          </Link>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#C48A4E]/30 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#351C1B]/5 text-[#351C1B] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">মোট নিবন্ধিত গ্রাহক</div>
            <div className="text-xl sm:text-2xl font-black text-[#351C1B]">
              {toBnDigits(totalCustomers)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300/40 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">সক্রিয় গ্রাহক</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-800">
              {toBnDigits(activeCustomers)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-amber-300/50 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">ভিআইপি ও গোল্ড</div>
            <div className="text-xl sm:text-2xl font-black text-amber-900">
              {toBnDigits(vipOrGoldCustomers)} <span className="text-xs font-normal text-stone-400">জন</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#C48A4E]/30 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#C48A4E] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-medium text-stone-500">লাইফটাইম সেলস (LTV)</div>
            <div className="text-xl sm:text-2xl font-black text-[#351C1B]">
              ৳ {toBnDigits(totalRevenue.toLocaleString("en-IN"))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="নাম, ফোন নম্বর (০১৭১...), ইমেইল বা এলাকা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-stone-200 hover:bg-stone-300 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="এলাকা নির্বাচন করুন"
              className="px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
            >
              <option value="ALL">সকল এলাকা</option>
              <option value="ঢাকা সিটি">ঢাকা সিটি</option>
              <option value="ঢাকার বাইরে">ঢাকার বাইরে</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as CustomerStatus | "ALL")}
              aria-label="স্ট্যাটাস নির্বাচন করুন"
              className="px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
            >
              <option value="ALL">সকল স্ট্যাটাস</option>
              <option value="Active">সক্রিয়</option>
              <option value="Inactive">নিষ্ক্রিয়</option>
            </select>
          </div>
        </div>

        {/* Tier Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-100">
          <span className="text-xs font-semibold text-stone-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> টিয়ার ফিল্টার:
          </span>

          <button
            type="button"
            onClick={() => setSelectedTier("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTier === "ALL"
                ? "bg-[#351C1B] text-amber-100 shadow-sm"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            সকল ({toBnDigits(customers.length)})
          </button>

          {(["VIP", "Gold", "Regular", "New", "Wholesale"] as CustomerTier[]).map((t) => {
            const count = customers.filter((c) => c.tier === t).length;
            const meta = TIER_META[t];
            const isSelected = selectedTier === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTier(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#C48A4E] text-white shadow-sm"
                    : `${meta.bg} ${meta.color} border ${meta.border} hover:opacity-80`
                }`}
              >
                <span>{meta.labelBn}</span>
                <span className="opacity-75">({toBnDigits(count)})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Count / Status Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1">
        <div>
          দেখানো হচ্ছে:{" "}
          <strong className="text-stone-800 font-bold">
            {toBnDigits(filteredCustomers.length)}
          </strong>{" "}
          জন গ্রাহক (মোট {toBnDigits(customers.length)} জনের মধ্যে)
        </div>
        {(searchQuery ||
          selectedTier !== "ALL" ||
          selectedStatus !== "ALL" ||
          selectedCity !== "ALL") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTier("ALL");
              setSelectedStatus("ALL");
              setSelectedCity("ALL");
            }}
            className="text-[#C48A4E] hover:underline font-semibold"
          >
            সব ফিল্টার রিসেট করুন
          </button>
        )}
      </div>

      {/* Customer Table (Desktop) */}
      <div className="hidden lg:block bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-600">
              <th className="py-4 px-6">গ্রাহকের নাম ও আইডি</th>
              <th className="py-4 px-5">যোগাযোগ ও ঠিকানা</th>
              <th className="py-4 px-5">টিয়ার ও স্ট্যাটাস</th>
              <th className="py-4 px-5 text-center">মোট অর্ডার</th>
              <th className="py-4 px-5 text-right">মোট খরচ (LTV)</th>
              <th className="py-4 px-6 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <User className="w-10 h-10 stroke-[1.2] text-stone-300" />
                    <p className="font-medium text-stone-600">কোনো গ্রাহক খুঁজে পাওয়া যায়নি</p>
                    <p className="text-xs text-stone-400">
                      অনুসন্ধান শব্দটি যাচাই করুন অথবা নতুন গ্রাহক যোগ করুন।
                    </p>
                    <Link
                      href="/admin/customers/new"
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#351C1B] text-amber-100 rounded-xl text-xs font-bold hover:bg-[#4A2624]"
                    >
                      <Plus className="w-3.5 h-3.5" /> নতুন গ্রাহক তৈরি করুন
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const tierMeta = TIER_META[cust.tier] || TIER_META.Regular;
                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-amber-50/20 transition-colors group cursor-pointer"
                    onClick={() => {
                      window.location.href = `/admin/customers/${cust.id}`;
                    }}
                  >
                    {/* Customer Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {cust.avatarInitials || cust.name.slice(0, 2)}
                        </div>
                        <div>
                          <Link
                            href={`/admin/customers/${cust.id}`}
                            className="font-bold text-stone-900 group-hover:text-[#C48A4E] transition-colors flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{cust.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                              {cust.id}
                            </span>
                            <span className="text-[11px] text-stone-400">
                              যোগদান: {cust.joinedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Address */}
                    <td className="py-4 px-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${cust.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="font-medium text-stone-800 hover:text-[#C48A4E] flex items-center gap-1 text-xs"
                          >
                            <Phone className="w-3 h-3 text-[#C48A4E]" />
                            <span>{cust.phone}</span>
                          </a>
                          <button
                            type="button"
                            onClick={(e) => handleCopyPhone(cust.id, cust.phone, e)}
                            title="কপি করুন"
                            className="text-stone-300 hover:text-stone-600 transition-colors"
                          >
                            {copiedId === cust.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-start gap-1 line-clamp-1 max-w-xs">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                          <span className="truncate">{cust.address}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tier & Status */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${tierMeta.bg} ${tierMeta.color} ${tierMeta.border}`}
                        >
                          <Star className="w-3 h-3 fill-current opacity-80" />
                          <span>{tierMeta.labelBn}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(cust, e)}
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                            cust.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                          }`}
                          title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              cust.status === "Active" ? "bg-emerald-500" : "bg-stone-400"
                            }`}
                          />
                          <span>{cust.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}</span>
                        </button>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 rounded-lg font-bold text-xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
                        <span>{toBnDigits(cust.totalOrders)} টি</span>
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="py-4 px-5 text-right">
                      <div className="font-extrabold text-stone-900 text-sm">
                        ৳ {toBnDigits(cust.totalSpent.toLocaleString("en-IN"))}
                      </div>
                      <div className="text-[10px] text-stone-400 font-medium">লাইফটাইম স্পেন্ড</div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View Details Page */}
                        <Link
                          href={`/admin/customers/${cust.id}`}
                          title="ডিটেইলস পেজ দেখুন"
                          className="p-2 text-stone-600 hover:text-[#351C1B] hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Create Order for this customer */}
                        <Link
                          href={`/admin/orders/new?phone=${cust.phone}&name=${encodeURIComponent(cust.name)}`}
                          title="এই গ্রাহকের জন্য নতুন অর্ডার তৈরি করুন"
                          className="p-2 text-[#C48A4E] hover:text-[#351C1B] hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </Link>

                        {/* Edit Page */}
                        <Link
                          href={`/admin/customers/${cust.id}/edit`}
                          title="গ্রাহক তথ্য সম্পাদনা করুন"
                          className="p-2 text-stone-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(cust)}
                          title="গ্রাহক মুছে ফেলুন"
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Mobile Card List (Sm/Md screens) */}
      <div className="block lg:hidden space-y-3.5">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center text-stone-400 space-y-3">
            <User className="w-10 h-10 mx-auto text-stone-300" />
            <p className="font-bold text-stone-700">কোনো গ্রাহক পাওয়া যায়নি</p>
            <Link
              href="/admin/customers/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#351C1B] text-amber-100 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন গ্রাহক তৈরি করুন
            </Link>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const tierMeta = TIER_META[cust.tier] || TIER_META.Regular;
            return (
              <div
                key={cust.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {cust.avatarInitials || cust.name.slice(0, 2)}
                    </div>
                    <div>
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="font-bold text-stone-900 hover:text-[#C48A4E] text-base"
                      >
                        {cust.name}
                      </Link>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                        <span className="font-mono bg-stone-100 px-1 py-0.2 rounded">
                          {cust.id}
                        </span>
                        <span>•</span>
                        <span>{cust.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tier */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${tierMeta.bg} ${tierMeta.color} ${tierMeta.border}`}
                  >
                    <Star className="w-3 h-3 fill-current opacity-80" />
                    <span>{tierMeta.labelBn}</span>
                  </span>
                </div>

                {/* Contact & Address */}
                <div className="bg-stone-50 p-2.5 rounded-xl text-xs space-y-1 text-stone-600">
                  <div className="flex items-center justify-between">
                    <a
                      href={`tel:${cust.phone}`}
                      className="font-medium text-stone-800 hover:text-[#C48A4E] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#C48A4E]" />
                      <span>{cust.phone}</span>
                    </a>
                    {cust.email && (
                      <span className="text-stone-400 text-[11px] truncate max-w-[150px]">
                        {cust.email}
                      </span>
                    )}
                  </div>
                  <div className="flex items-start gap-1 text-[11px] text-stone-500">
                    <MapPin className="w-3 h-3 text-stone-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{cust.address}</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-center py-1 border-t border-stone-100">
                  <div className="bg-stone-50/70 p-2 rounded-lg">
                    <div className="text-[10px] text-stone-400">মোট অর্ডার</div>
                    <div className="font-bold text-stone-800 text-xs">
                      {toBnDigits(cust.totalOrders)} টি
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-2 rounded-lg">
                    <div className="text-[10px] text-amber-700/80">মোট খরচ (LTV)</div>
                    <div className="font-bold text-[#351C1B] text-xs">
                      ৳ {toBnDigits(cust.totalSpent.toLocaleString("en-IN"))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                  <Link
                    href={`/admin/customers/${cust.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-[#351C1B] hover:bg-[#4A2624] text-amber-100 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>ডিটেইলস প্রোফাইল</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/admin/customers/${cust.id}/edit`}
                    className="p-2 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <Link
                    href={`/admin/orders/new?phone=${cust.phone}&name=${encodeURIComponent(cust.name)}`}
                    className="p-2 border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-[#C48A4E] rounded-xl transition-colors"
                    title="নতুন অর্ডার তৈরি করুন"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setCustomerToDelete(cust)}
                    className="p-2 border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-xl transition-colors"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
