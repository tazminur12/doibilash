"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Sparkles,
  Save,
  Check,
  CheckCircle2,
  UploadCloud,
  X,
  Megaphone,
  Sliders,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  Globe,
  Bell,
  Lock,
  Smartphone,
  Eye,
  Store,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  StoreSettings,
  DEFAULT_SETTINGS,
  getStoreSettings,
  saveStoreSettings,
} from "@/lib/settingsStorage";
import { toBnDigits } from "@/lib/bangla";

type SettingsTab = "general" | "payments" | "shipping" | "marketing" | "operations";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = getStoreSettings();
    setSettings(loaded);
    if (loaded.logoUrl) {
      setLogoPreview(loaded.logoUrl);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFieldChange = <K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ফাইলের সাইজ সর্বোচ্চ ২ মেগাবাইট হতে হবে।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLogoPreview(base64);
        handleFieldChange("logoUrl", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    handleFieldChange("logoUrl", "");
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      saveStoreSettings(settings);
      setIsSaving(false);
      showToast("দই বিলাসের সমস্ত সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
    }, 400);
  };

  const handleResetDefaults = () => {
    if (confirm("আপনি কি নিশ্চিত যে সমস্ত সেটিংস ডিফল্ট মানে রিসেট করতে চান?")) {
      setSettings(DEFAULT_SETTINGS);
      setLogoPreview(DEFAULT_SETTINGS.logoUrl);
      saveStoreSettings(DEFAULT_SETTINGS);
      showToast("সেটিংস সফলভাবে ডিফল্ট মানে রিসেট করা হয়েছে।");
    }
  };

  return (
    <div className="space-y-8 font-bengali pb-24 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Page Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-amber-100/50 via-stone-50/20 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C48A4E]">
              <Sliders className="w-4 h-4" />
              <span>সিস্টেম কনফিগারেশন প্যানেল</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#351C1B] tracking-tight">
              স্টোর সেটিংস ও কনফিগারেশন
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              দই বিলাসের ব্র্যান্ড আইডেন্টিটি, পেমেন্ট চ্যানেল, ডেলিভারি রেট, প্রমোশন নোটিশ এবং সিস্টেম সিকিউরিটি এক জায়গা থেকেই নিখুঁতভাবে পরিচালনা করুন।
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold text-xs transition-colors flex items-center gap-1.5"
              title="ডিফল্ট কনফিগারেশন রিস্টোর করুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট ডিফল্ট</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-sm shadow-lg shadow-[#351C1B]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-200" />
                  <span>পরিবর্তনগুলো সেভ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── 2. Navigation Tabs Bar ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pt-6 mt-6 border-t border-stone-100 scrollbar-none">
          {[
            { id: "general", label: "ব্র্যান্ড ও সাধারণ তথ্য", icon: Building2 },
            { id: "payments", label: "পেমেন্ট গেটওয়ে", icon: CreditCard },
            { id: "shipping", label: "শিপিং ও ডেলিভারি", icon: Truck },
            { id: "marketing", label: "মার্কেটিং ও ব্যানার", icon: Megaphone },
            { id: "operations", label: "সিস্টেম ও সিকিউরিটি", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#351C1B] text-amber-100 shadow-md shadow-[#351C1B]/15"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#C48A4E]" : "text-stone-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Tab Content Area ─────────────────────────────────────────── */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* ════ TAB 1: GENERAL INFO & BRANDING ════ */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Store Identity Card */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#C48A4E] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                        স্টোর পরিচিতি ও শিরোনাম
                      </h2>
                      <p className="text-xs text-stone-500">
                        ওয়েবসাইট ও বিলিং ইনভয়েসে প্রদর্শিত মৌলিক পরিচিতি
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      স্টোরের নাম (Store Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.storeName}
                      onChange={(e) => handleFieldChange("storeName", e.target.value)}
                      placeholder="দই বিলাস - Doi Bilash"
                      className="w-full px-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm font-bold text-[#351C1B] focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      ট্যাগলাইন / স্লোগান (Tagline)
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => handleFieldChange("tagline", e.target.value)}
                      placeholder="বগুড়ার ঐতিহ্যবাহী খাঁটি সরার দই"
                      className="w-full px-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      মুদ্রা প্রতীক (Currency Symbol)
                    </label>
                    <input
                      type="text"
                      value={settings.currencySymbol}
                      onChange={(e) => handleFieldChange("currencySymbol", e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm font-mono text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      মুদ্রা কোড (ISO Code)
                    </label>
                    <input
                      type="text"
                      value={settings.currencyCode}
                      onChange={(e) => handleFieldChange("currencyCode", e.target.value)}
                      className="w-full px-4 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-sm font-mono text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Physical Addresses */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                        যোগাযোগের মাধ্যম ও ঠিকানা
                      </h2>
                      <p className="text-xs text-stone-500">
                        কাস্টমার কেয়ার হেল্পলাইন ও ডেলিভারি অফিস ঠিকানা
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      প্রধান হেল্পলাইন / ফোন *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={settings.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      সাপোর্ট ইমেইল *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={settings.supportEmail}
                        onChange={(e) => handleFieldChange("supportEmail", e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      হোয়াটসঅ্যাপ অর্ডার নম্বর
                    </label>
                    <div className="relative">
                      <Smartphone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      হেড অফিস / আউটলেট ঠিকানা (ঢাকা)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.address}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      placeholder="বাড়ি নং, রোড নং, এলাকা এবং শহর"
                      className="w-full p-3 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] resize-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      ঐতিহ্যবাহী কারখানা ও হাব ঠিকানা (বগুড়া)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.factoryAddress}
                      onChange={(e) => handleFieldChange("factoryAddress", e.target.value)}
                      placeholder="কারখানা বা সেন্ট্রাল প্রসেসিং হাবের ঠিকানা"
                      className="w-full p-3 bg-stone-50/70 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 focus:border-[#C48A4E] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Meta Information */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                  <Globe className="w-4 h-4 text-[#C48A4E]" />
                  <h2 className="font-extrabold text-[#351C1B] text-base">
                    এসইও ও মেটা বিবরণ (Search Engines)
                  </h2>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    সার্চ ইঞ্জিন মেটা টাইটেল
                  </label>
                  <input
                    type="text"
                    value={settings.metaTitle}
                    onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    সার্চ ইঞ্জিন মেটা ডেসক্রিপশন
                  </label>
                  <textarea
                    rows={2}
                    value={settings.metaDescription}
                    onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Logo Upload & Live Storefront Preview */}
            <div className="space-y-6">
              {/* Logo Upload Box */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C48A4E]" />
                    <span>ব্র্যান্ড লোগো আপলোড</span>
                  </h3>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> রিমুভ
                    </button>
                  )}
                </div>

                <div className="relative border-2 border-dashed border-stone-300 hover:border-[#C48A4E] rounded-2xl p-6 text-center bg-stone-50/50 hover:bg-amber-50/20 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {logoPreview ? (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="relative w-28 h-20 bg-stone-900/5 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                        <img
                          src={logoPreview}
                          alt="Store Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-[#C48A4E] group-hover:underline">
                        লোগো পরিবর্তন করতে ক্লিক করুন
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-[#C48A4E] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-stone-800">
                        লোগো আপলোড করতে ক্লিক করুন
                      </p>
                      <p className="text-[11px] text-stone-400">
                        PNG, JPG অথবা WEBP (সর্বোচ্চ ২ MB)
                      </p>
                      <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-[#C48A4E] text-[10px] font-bold rounded-full mt-1 border border-amber-200">
                        Cloudinary Ready
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-linear-to-b from-[#351C1B] to-[#241312] p-6 rounded-3xl text-amber-50 shadow-xl border border-amber-900/30 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span>লাইভ ব্র্যান্ড কার্ড প্রিভিউ</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-amber-200">
                    Storefront
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center font-bold text-amber-300 text-lg overflow-hidden shrink-0">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
                      ) : (
                        "দবি"
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base leading-snug">
                        {settings.storeName || "দই বিলাস"}
                      </h4>
                      <p className="text-xs text-amber-200/80 line-clamp-1">
                        {settings.tagline || "বগুড়ার ঐতিহ্যবাহী খাঁটি সরার দই"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-xs space-y-1.5 text-stone-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-mono text-white">{settings.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-stone-300">{settings.supportEmail}</span>
                    </div>
                    <div className="flex items-start gap-2 pt-1 border-t border-white/5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-stone-300 line-clamp-2">
                        {settings.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 2: PAYMENT GATEWAYS ════ */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C48A4E] flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#351C1B] text-lg">
                      পেমেন্ট গেটওয়ে ও ব্যাংক হিসাব কনফিগারেশন
                    </h2>
                    <p className="text-xs text-stone-500">
                      চেকআউটে গ্রাহকের জন্য সক্রিয় পেমেন্ট মেথড এবং অ্যাকাউন্টের বিবরণ
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-4">
                {/* 1. Cash on Delivery */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-amber-300/60 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          ক্যাশ অন ডেলিভারি (Cash on Delivery)
                        </h4>
                        <p className="text-xs text-stone-500">
                          পণ্য গ্রাহকের হাতে পৌঁছানোর পর ডেলিভারিম্যান নগদ মূল্য বুঝে নেবেন
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableCod}
                        onChange={(e) => handleFieldChange("enableCod", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#351C1B]"></div>
                    </label>
                  </div>

                  {settings.enableCod && (
                    <div className="pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          সর্বোচ্চ COD অর্ডার সীমা (টাকা)
                        </label>
                        <input
                          type="number"
                          value={settings.codMaxLimit}
                          onChange={(e) => handleFieldChange("codMaxLimit", Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          গ্রাহকের জন্য নির্দেশনা
                        </label>
                        <input
                          type="text"
                          value={settings.codInstructions}
                          onChange={(e) => handleFieldChange("codInstructions", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. bKash Merchant */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-[#D12053]/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#D12053] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans shadow-xs">
                        bKash
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">
                            বিকাশ ইনস্ট্যান্ট পেমেন্ট গেটওয়ে
                          </h4>
                          <span className="text-[10px] bg-[#D12053]/10 text-[#D12053] font-bold px-2 py-0.5 rounded-full">
                            অটো কনফার্ম
                          </span>
                        </div>
                        <p className="text-xs text-stone-500">
                          বিকাশ মার্চেন্ট অথবা পার্সোনাল ওয়ালেট থেকে সরাসরি পেমেন্ট
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableBkash}
                        onChange={(e) => handleFieldChange("enableBkash", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D12053]"></div>
                    </label>
                  </div>

                  {settings.enableBkash && (
                    <div className="pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          বিকাশ অ্যাকাউন্ট নম্বর
                        </label>
                        <input
                          type="text"
                          value={settings.bkashMerchantNumber}
                          onChange={(e) => handleFieldChange("bkashMerchantNumber", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          অ্যাকাউন্টের ধরন
                        </label>
                        <select
                          value={settings.bkashAccountType}
                          onChange={(e) =>
                            handleFieldChange("bkashAccountType", e.target.value as "Merchant" | "Personal")
                          }
                          aria-label="বিকাশ অ্যাকাউন্টের ধরন"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
                        >
                          <option value="Merchant">মার্চেন্ট (Merchant Payment)</option>
                          <option value="Personal">পার্সোনাল সেন্ড মানি (Personal)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Nagad Gateway */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-[#F7941D]/40 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F7941D] text-white flex items-center justify-center font-bold text-xs shrink-0 font-sans shadow-xs">
                        Nagad
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          নগদ পেমেন্ট গেটওয়ে
                        </h4>
                        <p className="text-xs text-stone-500">
                          ডাক বিভাগের ডিজিটাল ওয়ালেট নগদ থেকে অগ্রিম পেমেন্ট
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableNagad}
                        onChange={(e) => handleFieldChange("enableNagad", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F7941D]"></div>
                    </label>
                  </div>

                  {settings.enableNagad && (
                    <div className="pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          নগদ মার্চেন্ট নম্বর
                        </label>
                        <input
                          type="text"
                          value={settings.nagadMerchantNumber}
                          onChange={(e) => handleFieldChange("nagadMerchantNumber", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          অ্যাকাউন্টের ধরন
                        </label>
                        <select
                          value={settings.nagadAccountType}
                          onChange={(e) =>
                            handleFieldChange("nagadAccountType", e.target.value as "Merchant" | "Personal")
                          }
                          aria-label="নগদ অ্যাকাউন্টের ধরন"
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
                        >
                          <option value="Merchant">মার্চেন্ট (Merchant)</option>
                          <option value="Personal">পার্সোনাল (Personal)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Bank Transfer / Corporate */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-white hover:border-[#351C1B]/30 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">
                          করপোরেট ব্যাংক ট্রান্সফার (Bank Transfer / BFTN)
                        </h4>
                        <p className="text-xs text-stone-500">
                          পাইকারি ও বৃহৎ অর্ডারের জন্য সরাসরি ব্যাংক ট্রান্সফার
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableBankTransfer}
                        onChange={(e) => handleFieldChange("enableBankTransfer", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#351C1B]"></div>
                    </label>
                  </div>

                  {settings.enableBankTransfer && (
                    <div className="pt-3 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          অ্যাকাউন্টের নাম
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccountName}
                          onChange={(e) => handleFieldChange("bankAccountName", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          ব্যাংকের নাম ও শাখা
                        </label>
                        <input
                          type="text"
                          value={settings.bankName}
                          onChange={(e) => handleFieldChange("bankName", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">
                          অ্যাকাউন্ট নম্বর
                        </label>
                        <input
                          type="text"
                          value={settings.bankAccountNumber}
                          onChange={(e) => handleFieldChange("bankAccountNumber", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 3: SHIPPING & DELIVERY ════ */}
        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#351C1B] text-lg">
                      ডেলিভারি চার্জ ও এরিয়া কনফিগারেশন
                    </h2>
                    <p className="text-xs text-stone-500">
                      ঢাকা সিটি ও সারাদেশের কোল্ড-চেইন ডেলিভারি ফি এবং ফ্রি শিপিং নিয়ম
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Zone Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Dhaka Inside */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <MapPin className="w-4 h-4 text-[#C48A4E]" />
                    <span>ঢাকার ভেতরে (Inside Dhaka)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ডেলিভারি ফি (টাকা)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={settings.deliveryInsideDhaka}
                        onChange={(e) => handleFieldChange("deliveryInsideDhaka", Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      আনুমানিক সময় নোট
                    </label>
                    <input
                      type="text"
                      value={settings.deliveryTimeInsideDhaka}
                      onChange={(e) => handleFieldChange("deliveryTimeInsideDhaka", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>
                </div>

                {/* Dhaka Outside */}
                <div className="p-5 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Truck className="w-4 h-4 text-[#C48A4E]" />
                    <span>ঢাকার বাইরে (Outside Dhaka)</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ডেলিভারি ফি (টাকা)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={settings.deliveryOutsideDhaka}
                        onChange={(e) => handleFieldChange("deliveryOutsideDhaka", Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-sm font-bold text-stone-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      আনুমানিক সময় নোট
                    </label>
                    <input
                      type="text"
                      value={settings.deliveryTimeOutsideDhaka}
                      onChange={(e) => handleFieldChange("deliveryTimeOutsideDhaka", e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Free Shipping & Express Options */}
              <div className="space-y-4 pt-2">
                {/* Free Shipping Threshold */}
                <div className="p-5 rounded-2xl border border-stone-200 bg-amber-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                      <Sparkles className="w-4 h-4 text-[#C48A4E]" />
                      <span>ফ্রি ডেলিভারি অফার সুবিধা (Free Shipping Threshold)</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      নির্ধারিত পরিমাণের বেশি অর্ডারে গ্রাহক স্বয়ংক্রিয়ভাবে ফ্রি হোম ডেলিভারি পাবেন
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-36">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-xs">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) =>
                          handleFieldChange("freeShippingThreshold", Number(e.target.value))
                        }
                        className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
                      />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.enableFreeShipping}
                        onChange={(e) => handleFieldChange("enableFreeShipping", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#351C1B]"></div>
                    </label>
                  </div>
                </div>

                {/* Fragile Packaging Note */}
                <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 text-xs space-y-1.5">
                  <div className="font-bold text-stone-800 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>বিশেষ মাটির হাঁড়ি ও কাচের জার প্যাকেজিং নোট</span>
                  </div>
                  <input
                    type="text"
                    value={settings.fragilePackagingNote}
                    onChange={(e) => handleFieldChange("fragilePackagingNote", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 4: MARKETING & ANNOUNCEMENT ════ */}
        {activeTab === "marketing" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C48A4E] flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#351C1B] text-lg">
                      ওয়েবসাইট ব্যানার ও সোশ্যাল চ্যানেল
                    </h2>
                    <p className="text-xs text-stone-500">
                      টপ হেডার এনাউন্সমেন্ট নোটিশ ও অফিসিয়াল সোশ্যাল মিডিয়া লিংক
                    </p>
                  </div>
                </div>
              </div>

              {/* Announcement Bar Toggle & Text */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-amber-50/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      টপ হেডার এনাউন্সমেন্ট বার (Header Announcement Marquee)
                    </h4>
                    <p className="text-xs text-stone-500">
                      ওয়েবসাইটের একদম উপরে বিশেষ অফার বা উৎসবের বার্তা প্রদর্শন করুন
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableAnnouncement}
                      onChange={(e) => handleFieldChange("enableAnnouncement", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#351C1B]"></div>
                  </label>
                </div>

                {settings.enableAnnouncement && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ব্যানার টেক্সট বার্তা
                      </label>
                      <input
                        type="text"
                        value={settings.announcementText}
                        onChange={(e) => handleFieldChange("announcementText", e.target.value)}
                        placeholder="🎉 বৈশাখী অফার! ৩,০০০ টাকার অর্ডারে ফ্রি ডেলিভারি..."
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-medium text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        ক্লিক করলে যে পেজে যাবে (লিংক)
                      </label>
                      <input
                        type="text"
                        value={settings.announcementLink}
                        onChange={(e) => handleFieldChange("announcementLink", e.target.value)}
                        placeholder="/offers"
                        className="w-full px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono text-stone-700"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Social Channels Links */}
              <div className="space-y-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C48A4E]" />
                  <span>অফিসিয়াল সোশ্যাল মিডিয়া লিংকসমূহ</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ফেসবুক পেজ (Facebook Page URL)
                    </label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) => handleFieldChange("facebookUrl", e.target.value)}
                      placeholder="https://facebook.com/..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ইনস্টাগ্রাম প্রোফাইল (Instagram URL)
                    </label>
                    <input
                      type="url"
                      value={settings.instagramUrl}
                      onChange={(e) => handleFieldChange("instagramUrl", e.target.value)}
                      placeholder="https://instagram.com/..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      ইউটিউব চ্যানেল (YouTube Channel)
                    </label>
                    <input
                      type="url"
                      value={settings.youtubeUrl}
                      onChange={(e) => handleFieldChange("youtubeUrl", e.target.value)}
                      placeholder="https://youtube.com/@..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      হোয়াটসঅ্যাপ ডিরেক্ট চ্যাট লিংক
                    </label>
                    <input
                      type="url"
                      value={settings.whatsappLink}
                      onChange={(e) => handleFieldChange("whatsappLink", e.target.value)}
                      placeholder="https://wa.me/..."
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB 5: OPERATIONS & SECURITY ════ */}
        {activeTab === "operations" && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#351C1B] text-lg">
                      অপারেশন, অ্যালার্ট ও সিস্টেম মেইনটেনেন্স
                    </h2>
                    <p className="text-xs text-stone-500">
                      স্বয়ংক্রিয় নোটিফিকেশন, ইনভেন্টরি সতর্কবার্তা ও সাইট স্ট্যাটাস
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#C48A4E]" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        অর্ডার কনফার্মেশন অটো এস/এম/এস (SMS)
                      </h4>
                      <p className="text-xs text-stone-500">
                        নতুন অর্ডার প্লেস হলে কাস্টমারের মোবাইলে ট্র্যাকিং নম্বর সহ মেসেজ পাঠানো
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.orderAutoConfirmationSms}
                      onChange={(e) =>
                        handleFieldChange("orderAutoConfirmationSms", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#351C1B]"></div>
                  </label>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      অ্যাডমিন নোটিফিকেশন ইমেইল
                    </h4>
                    <p className="text-xs text-stone-500">
                      প্রতিটি নতুন অর্ডারের সাথে সাথে এই ইমেইলে কপি পাঠানো হবে
                    </p>
                  </div>
                  <input
                    type="email"
                    value={settings.adminAlertEmail}
                    onChange={(e) => handleFieldChange("adminAlertEmail", e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      লো-স্টক ইনভেন্টরি অ্যালার্ট সীমা (ইউনিট)
                    </h4>
                    <p className="text-xs text-stone-500">
                      কোনো পণ্যের স্টক এই পরিমাণের নিচে নামলে ড্যাশবোর্ডে লাল ওয়ার্নিং দেখাবে
                    </p>
                  </div>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleFieldChange("lowStockThreshold", Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold font-mono text-stone-800"
                  />
                </div>

                {/* Maintenance Mode Emergency Card */}
                <div className="p-5 rounded-2xl border border-red-200 bg-red-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-red-900 text-sm">
                          মেইনটেনেন্স মোড (Maintenance Mode)
                        </h4>
                        <p className="text-xs text-red-600/80">
                          জরুরি সার্ভার আপগ্রেডের সময় সাধারণ ভিজিটরদের জন্য সাইট সাময়িক বন্ধ রাখতে
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleFieldChange("maintenanceMode", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  {settings.maintenanceMode && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-red-800 mb-1">
                        গ্রাহকদের প্রদর্শিত মেইনটেনেন্স বার্তা
                      </label>
                      <textarea
                        rows={2}
                        value={settings.maintenanceMessage}
                        onChange={(e) => handleFieldChange("maintenanceMessage", e.target.value)}
                        className="w-full p-3 bg-white border border-red-200 rounded-xl text-xs text-stone-800 focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 4. Bottom Fixed / Sticky Save Bar ─────────────────────────────────────────── */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Info className="w-4 h-4 text-[#C48A4E] shrink-0" />
            <span>
              পরিবর্তনগুলো সেভ করার সাথে সাথে সমগ্র সাইটে স্বয়ংক্রিয়ভাবে কার্যকর হয়ে যাবে।
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-bold transition-colors"
            >
              রিসেট
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-amber-200" />
                  <span>সেভ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
