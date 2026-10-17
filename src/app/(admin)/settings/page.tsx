"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  CheckCircle2,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Sparkles,
  Save,
  Check,
} from "lucide-react";

type SettingsTab = "general" | "payments" | "shipping";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Info State
  const [storeName, setStoreName] = useState("দই বিলাস - Doi Bilash");
  const [supportEmail, setSupportEmail] = useState("support@doibilash.com");
  const [phoneNumber, setPhoneNumber] = useState("+880 1712-345678");
  const [address, setAddress] = useState(
    "বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা - ১২০৫"
  );
  const [currencySymbol, setCurrencySymbol] = useState("৳ (BDT)");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Payment Methods State
  const [enableCod, setEnableCod] = useState(true);
  const [enableBkash, setEnableBkash] = useState(true);
  const [bkashMerchantNumber, setBkashMerchantNumber] = useState("01712345678");
  const [enableNagad, setEnableNagad] = useState(true);
  const [nagadMerchantNumber, setNagadMerchantNumber] = useState("01812345678");

  // Shipping State
  const [deliveryInsideDhaka, setDeliveryInsideDhaka] = useState("60");
  const [deliveryOutsideDhaka, setDeliveryOutsideDhaka] = useState("120");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("3000");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="p-6 font-bengali space-y-6">
      {/* ── 1. Layout & Tabs ───────────────────────────────────────────── */}
      <div>
        <h1 className="font-bengali text-3xl font-bold text-gray-800 mb-6 tracking-tight">
          সেটিংস
        </h1>

        {/* Horizontal Tab Navigation */}
        <div className="flex items-center gap-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`text-sm cursor-pointer transition-colors ${
              activeTab === "general"
                ? "border-b-2 border-doibrand-gold text-doibrand-gold font-bold pb-2"
                : "text-gray-500 hover:text-gray-800 pb-2 font-medium"
            }`}
          >
            General Info (সাধারণ তথ্য)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`text-sm cursor-pointer transition-colors ${
              activeTab === "payments"
                ? "border-b-2 border-doibrand-gold text-doibrand-gold font-bold pb-2"
                : "text-gray-500 hover:text-gray-800 pb-2 font-medium"
            }`}
          >
            Payment Methods (পেমেন্ট মেথড)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`text-sm cursor-pointer transition-colors ${
              activeTab === "shipping"
                ? "border-b-2 border-doibrand-gold text-doibrand-gold font-bold pb-2"
                : "text-gray-500 hover:text-gray-800 pb-2 font-medium"
            }`}
          >
            Shipping (ডেলিভারি চার্জ ও এরিয়া)
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="max-w-3xl p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2.5 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!</span>
        </div>
      )}

      {/* ── 2. Settings Form Card: General Info Tab ───────────────────── */}
      {activeTab === "general" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mt-6 animate-in fade-in duration-200">
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-doibrand-dark pb-2 border-b border-gray-100 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-doibrand-gold" />
                <span>স্টোর পরিচিতি ও যোগাযোগের বিবরণ</span>
              </h2>

              {/* Form Grid: grid-cols-1 md:grid-cols-2 gap-6 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    স্টোরের নাম (Store Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="দই বিলাস"
                    className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-bengali text-gray-800 outline-none transition-colors bg-white shadow-2xs"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    সাপোর্ট ইমেইল (Support Email) *
                  </label>
                  <input
                    type="email"
                    required
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@doibilash.com"
                    className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-sans text-gray-800 outline-none transition-colors bg-white shadow-2xs"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    ফোন নম্বর (Phone Number) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-sans text-gray-800 outline-none transition-colors bg-white shadow-2xs"
                  />
                </div>

                {/* Currency Symbol */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    মুদ্রা প্রতীক (Currency)
                  </label>
                  <input
                    type="text"
                    value={currencySymbol}
                    onChange={(e) => setCurrencySymbol(e.target.value)}
                    className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-bengali text-gray-800 outline-none transition-colors bg-white shadow-2xs"
                  />
                </div>

                {/* Address (Full Width in Grid) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    অফিস / স্টোর ঠিকানা (Address) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা এবং শহর"
                    className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-bengali text-gray-800 outline-none transition-colors bg-white resize-none shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload Section */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                ওয়েবসাইট ও ইনভয়েস লোগো (Store Logo)
              </label>

              <label
                htmlFor="logo-file-input"
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-doibrand-gold bg-gray-50 mt-2 transition-colors group"
              >
                <input
                  id="logo-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                {logoPreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-3">
                      <Image
                        src={logoPreview}
                        alt="Logo Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-doibrand-gold font-semibold group-hover:underline">
                      লোগো পরিবর্তন করতে ক্লিক করুন
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-100/70 text-doibrand-gold flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      লোগো আপলোড করুন
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG অথবা WEBP ফাইল (সর্বোচ্চ ২ মেগাবাইট)
                    </p>
                  </>
                )}
              </label>
            </div>

            {/* Action Area: 'Save Changes' (সেভ করুন) button */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                className="bg-doibrand-dark text-white font-bold px-8 py-3 rounded-xl hover:bg-doibrand-gold transition-colors ml-auto block cursor-pointer text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes (সেভ করুন)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 3. Settings Form Card: Payment Methods Tab ────────────────── */}
      {activeTab === "payments" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mt-6 animate-in fade-in duration-200">
          <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-lg font-bold text-doibrand-dark pb-2 border-b border-gray-100 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-doibrand-gold" />
              <span>অনলাইন ও অফলাইন পেমেন্ট গেটওয়ে কনফিগারেশন</span>
            </h2>

            {/* COD Toggle */}
            <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-gray-800">
                  ক্যাশ অন ডেলিভারি (Cash on Delivery)
                </p>
                <p className="text-xs text-gray-500">
                  গ্রাহক পণ্য হাতে পেয়ে ডেলিভারিম্যানকে মূল্য পরিশোধ করবেন
                </p>
              </div>
              <input
                type="checkbox"
                checked={enableCod}
                onChange={(e) => setEnableCod(e.target.checked)}
                className="w-5 h-5 accent-doibrand-gold cursor-pointer"
              />
            </div>

            {/* bKash Config */}
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D12053] text-white font-sans">
                      bKash
                    </span>
                    <span>বিকাশ মার্চেন্ট পেমেন্ট</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    গ্রাহকের বিকাশ ওয়ালেট থেকে সরাসরি ইনস্ট্যান্ট পেমেন্ট
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableBkash}
                  onChange={(e) => setEnableBkash(e.target.checked)}
                  className="w-5 h-5 accent-doibrand-gold cursor-pointer"
                />
              </div>

              {enableBkash && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    বিকাশ মার্চেন্ট নম্বর
                  </label>
                  <input
                    type="text"
                    value={bkashMerchantNumber}
                    onChange={(e) => setBkashMerchantNumber(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-sans text-gray-800"
                  />
                </div>
              )}
            </div>

            {/* Nagad Config */}
            <div className="p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F7941D] text-white font-sans">
                      Nagad
                    </span>
                    <span>নগদ পেমেন্ট গেটওয়ে</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    ডাক বিভাগের ডিজিটাল ফাইন্যান্সিয়াল সার্ভিস
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={enableNagad}
                  onChange={(e) => setEnableNagad(e.target.checked)}
                  className="w-5 h-5 accent-doibrand-gold cursor-pointer"
                />
              </div>

              {enableNagad && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    নগদ মার্চেন্ট নম্বর
                  </label>
                  <input
                    type="text"
                    value={nagadMerchantNumber}
                    onChange={(e) => setNagadMerchantNumber(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-sans text-gray-800"
                  />
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                className="bg-doibrand-dark text-white font-bold px-8 py-3 rounded-xl hover:bg-doibrand-gold transition-colors ml-auto block cursor-pointer text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes (সেভ করুন)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── 4. Settings Form Card: Shipping Tab ────────────────────────── */}
      {activeTab === "shipping" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl mt-6 animate-in fade-in duration-200">
          <form onSubmit={handleSave} className="space-y-6">
            <h2 className="text-lg font-bold text-doibrand-dark pb-2 border-b border-gray-100 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-doibrand-gold" />
              <span>ডেলিভারি চার্জ ও ফ্রি শিপিং নিয়মাবলী</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  ঢাকার ভেতরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  value={deliveryInsideDhaka}
                  onChange={(e) => setDeliveryInsideDhaka(e.target.value)}
                  className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-sans text-gray-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  ঢাকার বাইরে ডেলিভারি চার্জ (টাকা)
                </label>
                <input
                  type="number"
                  value={deliveryOutsideDhaka}
                  onChange={(e) => setDeliveryOutsideDhaka(e.target.value)}
                  className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-sans text-gray-800 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  ফ্রি ডেলিভারি মিনিমাম অর্ডার লিমিট (টাকা)
                </label>
                <input
                  type="number"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full border border-gray-200 focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold rounded-lg p-3 text-sm font-sans text-gray-800 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  এই পরিমাণের বেশি অর্ডারে গ্রাহক স্বয়ংক্রিয়ভাবে ফ্রি ডেলিভারি সুবিধা পাবেন
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end">
              <button
                type="submit"
                className="bg-doibrand-dark text-white font-bold px-8 py-3 rounded-xl hover:bg-doibrand-gold transition-colors ml-auto block cursor-pointer text-sm shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes (সেভ করুন)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
