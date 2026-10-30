"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Heart,
  Tag,
} from "lucide-react";
import {
  StoredCustomer,
  CustomerTier,
  CustomerStatus,
  TIER_META,
  getStoredCustomers,
  saveCustomer,
  getCustomerById,
} from "@/lib/customerStorage";

const SUGGESTED_PREFERENCES = [
  "বগুড়ার সরার দই",
  "মাটির কাপ দই",
  "কম মিষ্টি পছন্দ",
  "খাঁটি দানাদার ঘি",
  "মতিচুর লাড্ডু",
  "লাচ্ছা সেমাই",
  "রসগোল্লা",
  "গিফট বক্স প্যাকিং",
  "দ্রুত ডেলিভারি প্রয়োজন",
];

export default function CustomerEditor({ customerId }: { customerId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromParam = customerId || searchParams.get("id") || searchParams.get("edit");

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState<"ঢাকা সিটি" | "ঢাকার বাইরে">("ঢাকা সিটি");
  const [tier, setTier] = useState<CustomerTier>("Regular");
  const [status, setStatus] = useState<CustomerStatus>("Active");
  const [notes, setNotes] = useState("");
  const [preferences, setPreferences] = useState<string[]>([
    "বগুড়ার সরার দই",
    "কম মিষ্টি পছন্দ",
  ]);
  const [newPreference, setNewPreference] = useState("");

  // UI State
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load existing data if editing
  useEffect(() => {
    if (idFromParam) {
      const existing = getCustomerById(idFromParam);
      if (existing) {
        setName(existing.name);
        setPhone(existing.phone);
        setEmail(existing.email || "");
        setAddress(existing.address);
        setCity(existing.city || "ঢাকা সিটি");
        setTier(existing.tier || "Regular");
        setStatus(existing.status || "Active");
        setNotes(existing.notes || "");
        setPreferences(existing.preferences || []);
      }
    }
  }, [idFromParam]);

  const tierInfo = TIER_META[tier] || TIER_META.Regular;

  // Preferences handlers
  const addPreference = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !preferences.includes(trimmed)) {
      setPreferences((prev) => [...prev, trimmed]);
      setNewPreference("");
    }
  };

  const removePreference = (text: string) => {
    setPreferences((prev) => prev.filter((p) => p !== text));
  };

  // Save handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = "গ্রাহকের নাম প্রদান করুন";
    if (!phone.trim()) errors.phone = "গ্রাহকের মোবাইল নাম্বার প্রদান করুন";
    if (!address.trim()) errors.address = "ডেলিভারি ঠিকানা প্রদান করুন";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFormErrors({});
    setIsSaving(true);

    const customerIdToSave = idFromParam || `CUST-${Math.floor(100 + Math.random() * 900)}`;

    const customerToSave: StoredCustomer = {
      id: customerIdToSave,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      city: city,
      totalOrders: idFromParam ? getCustomerById(idFromParam)?.totalOrders || 0 : 0,
      totalSpent: idFromParam ? getCustomerById(idFromParam)?.totalSpent || 0 : 0,
      tier: tier,
      status: status,
      joinedDate: idFromParam
        ? getCustomerById(idFromParam)?.joinedDate || "আজ"
        : new Date().toLocaleDateString("bn-BD"),
      notes: notes.trim() || undefined,
      preferences: preferences,
      avatarInitials: name.trim().slice(0, 2),
    };

    saveCustomer(customerToSave);

    setToastMessage(idFromParam ? "গ্রাহক তথ্য সফলভাবে আপডেট হয়েছে!" : "নতুন গ্রাহক সফলভাবে যুক্ত হয়েছে!");
    setShowToast(true);

    setTimeout(() => {
      setIsSaving(false);
      router.push(`/admin/customers/${customerIdToSave}`);
    }, 1200);
  };

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
            <p className="text-xs text-gray-400">গ্রাহক প্রোফাইলে রিডাইরেক্ট করা হচ্ছে...</p>
          </div>
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
            <span className="font-semibold text-doibrand-accent">
              {idFromParam ? "গ্রাহক তথ্য পরিবর্তন" : "ম্যানুয়াল নতুন গ্রাহক নিবন্ধন"}
            </span>
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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-doibrand-dark">
                  {idFromParam ? "গ্রাহক তথ্য সম্পাদনা করুন" : "ম্যানুয়ালি নতুন গ্রাহক যুক্ত করুন"}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  ফোন বা সরাসরি পরিচিত গ্রাহকের তথ্য যুক্ত করুন, যাতে যেকোনো সময় অর্ডার তৈরি করা যায়।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href="/admin/customers"
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-stone-50 text-stone-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                বাতিল
              </Link>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-doibrand-gold" />
                <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : idFromParam ? "আপডেট সংরক্ষণ করুন" : "গ্রাহক সংরক্ষণ করুন"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Split Two-Column Grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT: Live Customer Profile Card Preview (5 Cols) ─────────── */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold text-doibrand-dark uppercase tracking-wider">
                  গ্রাহক প্রোফাইল প্রিভিউ (Live Card)
                </h3>
              </div>
              <span className="text-[11px] font-sans font-bold bg-amber-100 text-doibrand-dark px-2.5 py-0.5 rounded-full">
                PROFILE PREVIEW
              </span>
            </div>

            {/* Golden luxury profile card container */}
            <div className="relative rounded-[24px] p-1 bg-linear-to-br from-[#F3DDB8] via-white to-[#EFCF9E] shadow-[0_15px_40px_-20px_rgba(169,94,53,0.4)]">
              <div className="bg-stone-50 rounded-[22px] p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#F3DDB8] to-[#E2B57C] text-doibrand-dark flex items-center justify-center font-extrabold text-xl shadow-xs shrink-0">
                    {name ? name.trim().slice(0, 2) : "গ্রা"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-doibrand-dark truncate">
                      {name || "গ্রাহকের নাম"}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${tierInfo.bg} ${tierInfo.color} ${tierInfo.border}`}
                    >
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {tierInfo.labelBn}
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-3 border-t border-stone-200/70 text-stone-700">
                  <p className="font-sans flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-doibrand-gold" />
                    <strong>{phone || "01XXX-XXXXXX"}</strong>
                  </p>
                  {email && (
                    <p className="font-sans text-stone-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{email}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-stone-600 flex items-start gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{address || "ডেলিভারি ঠিকানা প্রদান করুন"}</span>
                  </p>
                </div>

                {/* Preference chips in live preview */}
                {preferences.length > 0 && (
                  <div className="pt-3 border-t border-stone-200/70">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                      পছন্দসমূহ (Preferences):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {preferences.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-[10px] font-semibold text-doibrand-dark"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Customer Input Form (7 Cols) ──────────────────────── */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
          {/* Card 1: Identity & Contact Info */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-5">
            <div className="border-b border-stone-100 pb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-doibrand-dark flex items-center justify-center">
                <User className="w-4 h-4 text-doibrand-accent" />
              </div>
              <div>
                <h3 className="text-base font-bold text-doibrand-dark">সাধারণ তথ্য ও যোগাযোগ</h3>
                <p className="text-xs text-stone-500">গ্রাহকের নাম, সক্রিয় ফোন নাম্বার ও ঠিকানা প্রদান করুন।</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  গ্রাহকের পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali ${
                    formErrors.name ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01712-345678"
                  className={`w-full rounded-xl border p-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 ${
                    formErrors.phone ? "border-red-400 bg-red-50/20" : "border-stone-200"
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-[11px] mt-1">{formErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">ইমেইল ঠিকানা (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">ডেলিভারি এরিয়া</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as "ঢাকা সিটি" | "ঢাকার বাইরে")}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white focus:outline-none font-bold"
                >
                  <option value="ঢাকা সিটি">ঢাকা সিটি (Dhaka City)</option>
                  <option value="ঢাকার বাইরে">ঢাকার বাইরে (Outside Dhaka)</option>
                </select>
              </div>
            </div>

            <div className="pt-1">
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাড়ি নং, রোড নং, সেক্টর/এলাকা, থানা ও জেলা..."
                className={`w-full rounded-xl border p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali ${
                  formErrors.address ? "border-red-400 bg-red-50/20" : "border-stone-200"
                }`}
              />
              {formErrors.address && (
                <p className="text-red-500 text-[11px] mt-1">{formErrors.address}</p>
              )}
            </div>
          </div>

          {/* Card 2: Tier & Status */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-doibrand-dark pb-2 border-b border-stone-100">
              গ্রাহক শ্রেণি ও স্ট্যাটাস
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">
                  কাস্টমার টায়ার (Customer Tier)
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as CustomerTier)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white font-bold focus:outline-none"
                >
                  <option value="Regular">নিয়মিত গ্রাহক (Regular)</option>
                  <option value="VIP">ভিআইপি গ্রাহক (VIP)</option>
                  <option value="Gold">গোল্ড লয়াল (Gold)</option>
                  <option value="New">নতুন গ্রাহক (New)</option>
                  <option value="Wholesale">পাইকারি / করপোরেট (Wholesale)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1.5">গ্রাহক স্ট্যাটাস</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CustomerStatus)}
                  className="w-full rounded-xl border border-stone-200 p-3 text-xs bg-white font-bold focus:outline-none"
                >
                  <option value="Active">সক্রিয় (Active)</option>
                  <option value="Inactive">নিষ্ক্রিয় (Inactive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Preferences & Admin Notes */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-doibrand-dark pb-2 border-b border-stone-100 flex items-center gap-2">
              <Heart className="w-4 h-4 text-doibrand-accent" />
              পছন্দসমূহ ও বিশেষ নোট
            </h3>

            {/* Current Preferences */}
            <div className="flex flex-wrap gap-2">
              {preferences.map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-doibrand-dark"
                >
                  <span>{p}</span>
                  <button
                    type="button"
                    onClick={() => removePreference(p)}
                    className="text-stone-400 hover:text-red-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Preference input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPreference(newPreference);
                  }
                }}
                placeholder="নতুন পছন্দ লিখুন (যেমন: কম মিষ্টি)..."
                className="flex-1 rounded-xl border border-stone-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40"
              />
              <button
                type="button"
                onClick={() => addPreference(newPreference)}
                className="px-4 py-2.5 rounded-xl bg-doibrand-dark text-white text-xs font-bold hover:bg-stone-800 cursor-pointer"
              >
                যোগ করুন
              </button>
            </div>

            {/* Suggested preferences */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SUGGESTED_PREFERENCES.map((sp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => addPreference(sp)}
                  className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-[10px] text-stone-600 hover:bg-amber-50 cursor-pointer"
                >
                  +{sp}
                </button>
              ))}
            </div>

            {/* Internal notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                অ্যাডমিন ইন্টারনাল নোট (Internal Notes)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="গ্রাহকের বিশেষ নির্দেশনা বা অতীত অর্ডারের কোনো অভিজ্ঞতা থাকলে লিখে রাখুন..."
                className="w-full rounded-xl border border-stone-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-doibrand-gold/40 font-bengali"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/admin/customers"
              className="px-5 py-3 rounded-xl border border-stone-200 font-semibold text-xs text-stone-600 hover:bg-stone-50"
            >
              বাতিল
            </Link>
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl bg-linear-to-r from-doibrand-dark via-[#432322] to-doibrand-accent hover:from-doibrand-accent hover:to-doibrand-gold text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-doibrand-gold" />
              <span>{isSaving ? "সংরক্ষণ হচ্ছে..." : idFromParam ? "আপডেট সংরক্ষণ করুন" : "গ্রাহক সংরক্ষণ করুন"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
