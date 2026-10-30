"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Printer,
  Calendar,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  FileText,
  Clock,
  ShieldCheck,
  User,
  AlertCircle,
} from "lucide-react";
import {
  CorporateOrder,
  CorporateOrderItem,
  CorporateEventType,
  CorporateOrderStatus,
  CORP_STATUS_META,
  getStoredCorporateOrders,
  saveCorporateOrder,
  getCorporateOrderById,
} from "@/lib/corporateOrderStorage";
import { getStoredProducts, StoredProduct } from "@/lib/productStorage";
import { toBnDigits } from "@/lib/bangla";

const EVENT_TYPES: CorporateEventType[] = [
  "ঈদ ও উৎসব উপহার",
  "বার্ষিক সাধারণ সভা (AGM)",
  "কর্পোরেট গিফটিং",
  "বিয়ে ও পারিবারিক অনুষ্ঠান",
  "অফিস ইভেন্ট ও মিটিং",
  "অন্যান্য",
];

export default function CorporateOrderEditor({ orderId }: { orderId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromParam = orderId || searchParams.get("id") || searchParams.get("edit");

  // Client Details
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState<CorporateEventType>("ঈদ ও উৎসব উপহার");
  const [deliveryDate, setDeliveryDate] = useState("২০২৬-০৩-২৫");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [approxQuantityText, setApproxQuantityText] = useState("১০০ বক্স");

  // Items
  const [items, setItems] = useState<CorporateOrderItem[]>([
    {
      productTitle: "বগুড়ার স্পেশাল সরার মিষ্টি দই (১ কেজি)",
      quantity: 100,
      unitPrice: 500,
      totalPrice: 50000,
      packagingCustomization: "কাস্টম ব্র্যান্ডের লোগো ও সিল্ক রিবন ফিতা",
    },
    {
      productTitle: "খাঁটি দানাদার গাওয়া ঘি (৫০০ গ্রাম জার)",
      quantity: 100,
      unitPrice: 950,
      totalPrice: 95000,
    },
  ]);

  // Financials
  const [customBrandingFee, setCustomBrandingFee] = useState<number>(5000);
  const [advancePaid, setAdvancePaid] = useState<number>(50000);
  const [paymentTerms, setPaymentTerms] = useState(
    "৫০% অ্যাডভান্স ব্যাংক বিএফটিএন + ডেলিভারির দিনে অবশিষ্ট চেক"
  );
  const [status, setStatus] = useState<CorporateOrderStatus>("New Lead");
  const [assignedManager, setAssignedManager] = useState("তাজমিনুর রহমান (সুপার অ্যাডমিন)");
  const [customLogoBranding, setCustomLogoBranding] = useState(true);
  const [notes, setNotes] = useState("");

  const [productsCatalogue, setProductsCatalogue] = useState<StoredProduct[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const totalBudget = subtotal + Number(customBrandingFee || 0);
  const dueAmount = Math.max(0, totalBudget - Number(advancePaid || 0));

  useEffect(() => {
    setProductsCatalogue(getStoredProducts());

    if (idFromParam) {
      const existing = getCorporateOrderById(idFromParam);
      if (existing) {
        setEditingId(existing.id);
        setCompanyName(existing.companyName);
        setContactPerson(existing.contactPerson);
        setDesignation(existing.designation);
        setPhone(existing.phone);
        setEmail(existing.email);
        setEventType(existing.eventType);
        setDeliveryDate(existing.deliveryDate);
        setDeliveryAddress(existing.deliveryAddress);
        setApproxQuantityText(existing.approxQuantityText);
        setItems(existing.items);
        setCustomBrandingFee(existing.customBrandingFee || 0);
        setAdvancePaid(existing.advancePaid || 0);
        setPaymentTerms(existing.paymentTerms);
        setStatus(existing.status);
        setAssignedManager(existing.assignedManager);
        setCustomLogoBranding(existing.customLogoBranding ?? true);
        setNotes(existing.notes || "");
      }
    }
  }, [idFromParam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Item helpers
  const handleItemChange = (idx: number, field: keyof CorporateOrderItem, val: any) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[idx], [field]: val };
      if (field === "quantity" || field === "unitPrice") {
        item.totalPrice = Number(item.quantity || 0) * Number(item.unitPrice || 0);
      }
      updated[idx] = item;
      return updated;
    });
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productTitle: "",
        quantity: 50,
        unitPrice: 500,
        totalPrice: 25000,
      },
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuickAddProduct = (prod: StoredProduct) => {
    setItems((prev) => [
      ...prev,
      {
        productTitle: prod.name,
        quantity: 100,
        unitPrice: prod.price,
        totalPrice: prod.price * 100,
      },
    ]);
    showToast(`"${prod.name}" কোটেশনে যুক্ত হয়েছে!`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !phone.trim()) {
      alert("দয়া করে প্রতিষ্ঠানের নাম, যোগাযোগকারী ও ফোন নম্বর প্রদান করুন।");
      return;
    }

    setIsSaving(true);
    const finalId = editingId || `CORP-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
    const quotationNo = `QT-DB-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: CorporateOrder = {
      id: finalId,
      quotationNo: editingId ? (getCorporateOrderById(editingId)?.quotationNo || quotationNo) : quotationNo,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      designation: designation.trim(),
      phone: phone.trim(),
      email: email.trim(),
      eventType,
      deliveryDate,
      deliveryAddress,
      approxQuantityText,
      items,
      subtotal,
      vatOrTaxPercent: 0,
      vatOrTaxAmount: 0,
      customBrandingFee: Number(customBrandingFee) || 0,
      totalBudget,
      advancePaid: Number(advancePaid) || 0,
      dueAmount,
      paymentTerms,
      status,
      assignedManager,
      customLogoBranding,
      notes,
      createdAt: editingId ? (getCorporateOrderById(editingId)?.createdAt || "২০২৬-০১-২০") : "আজকের তারিখ",
    };

    setTimeout(() => {
      saveCorporateOrder(newOrder);
      setIsSaving(false);
      showToast(editingId ? "কর্পোরেট অর্ডার তথ্য আপডেট হয়েছে!" : "নতুন কর্পোরেট অর্ডার/কোটেশন সংরক্ষিত হয়েছে!");
      setTimeout(() => {
        router.push("/admin/corporate");
      }, 700);
    }, 400);
  };

  return (
    <div className="font-bengali pb-28 text-stone-900 max-w-7xl mx-auto space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#351C1B] text-amber-100 px-6 py-3.5 rounded-2xl shadow-2xl border border-amber-600/40 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/admin" className="hover:text-[#C48A4E]">
              ড্যাশবোর্ড
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/admin/corporate" className="hover:text-[#C48A4E]">
              কর্পোরেট ও বাল্ক অর্ডার
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#351C1B] font-bold">
              {editingId ? "কর্পোরেট অর্ডার সম্পাদনা" : "নতুন কোটেশন / বিটুবি অর্ডার"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/corporate"
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 flex items-center justify-center text-stone-600 hover:text-[#351C1B] shadow-2xs transition-colors shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#351C1B] tracking-tight">
                {editingId ? "কর্পোরেট অর্ডার ও কোটেশন আপডেট" : "কর্পোরেট ও বাল্ক অর্ডার তৈরি (B2B Lead)"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                প্রতিষ্ঠান, ব্যাংক বা বড় আয়োজনের জন্য আনুষ্ঠানিক কোটেশন, ডেলিভারি প্ল্যান এবং পেমেন্ট ট্র্যাকিং।
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/corporate"
            className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 font-bold text-xs sm:text-sm transition-colors"
          >
            বাতিল করুন
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-50 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4 text-amber-200" />
                <span>{editingId ? "অর্ডার আপডেট করুন" : "কোটেশন ও অর্ডার সংরক্ষণ করুন"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (2 Cols) + Live Quotation Sheet Right (1 Col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          {/* Card 1: Client & Company Information */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <Building2 className="w-5 h-5 text-[#C48A4E]" />
              <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                প্রতিষ্ঠান ও ক্লায়েন্টের বিবরণ
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  প্রতিষ্ঠানের নাম (Company / Organization) *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="যেমন: গ্রামীণফোন লিমিটেড / ব্র্যাক ব্যাংক পিএলসি"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold text-[#351C1B] focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  যোগাযোগকারী কর্মকর্তার নাম (Contact Person) *
                </label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="যেমন: রেজোয়ানুল হক"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পদবি ও বিভাগ (Designation)
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="যেমন: হেড অফ প্রকিউরমেন্ট / এইচআর"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  মোবাইল নম্বর (Phone) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01711-XXXXXX"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono text-stone-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  অফিসিয়াল ইমেইল (Email)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corporate@company.com"
                  className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ইভেন্ট / অনুষ্ঠানের ধরন
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as CorporateEventType)}
                  aria-label="ইভেন্টের ধরন"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-hidden"
                >
                  {EVENT_TYPES.map((type, i) => (
                    <option key={i} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ডেলিভারির কাঙ্ক্ষিত তারিখ
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-sans text-stone-800 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ডেলিভারি ঠিকানা ও ভেন্যু
                </label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="অফিসের ঠিকানা বা ইভেন্ট কনভেনশন হলের পূর্ণ বিবরণ..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-hidden resize-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Bulk Items & Quotation Line Items */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#C48A4E]" />
                <div>
                  <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                    বাল্ক পণ্য ও কোটেশন আইটেমস
                  </h2>
                  <p className="text-xs text-stone-500">
                    খাদ্যসামগ্রীর পরিমাণ, ইউনিট মূল্য ও কাস্টম প্যাকেজিং নির্ধারণ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-[#C48A4E] rounded-xl text-xs font-bold transition-colors border border-amber-200"
              >
                <Plus className="w-3.5 h-3.5" /> আইটেম যোগ করুন
              </button>
            </div>

            {/* Quick prefill from catalog */}
            {productsCatalogue.length > 0 && (
              <div className="bg-stone-50/70 p-3 rounded-2xl border border-stone-200/60 space-y-1.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  ক্যাটালগ থেকে বাল্ক যোগ করুন:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {productsCatalogue.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleQuickAddProduct(prod)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-50 text-stone-800 hover:text-[#C48A4E] rounded-lg text-xs font-semibold border border-stone-200 shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-[#C48A4E]" />
                      <span>{prod.name} (৳ {toBnDigits(prod.price)})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Line Items Table */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/40 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      value={item.productTitle}
                      onChange={(e) => handleItemChange(idx, "productTitle", e.target.value)}
                      placeholder="পণ্যের বিবরণ (যেমন: বগুড়ার সরার দই - ১ কেজি)"
                      className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
                    />

                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          placeholder="পরিমাণ"
                          className="w-full px-2 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold text-center"
                        />
                      </div>

                      <div className="w-28 relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 text-xs">
                          ৳
                        </span>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                          placeholder="দর"
                          className="w-full pl-5 pr-2 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>

                      <div className="w-32 text-right font-black text-stone-900 text-xs px-2">
                        ৳ {toBnDigits((item.totalPrice || 0).toLocaleString("en-IN"))}
                      </div>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.packagingCustomization || ""}
                    onChange={(e) =>
                      handleItemChange(idx, "packagingCustomization", e.target.value)
                    }
                    placeholder="কাস্টমাইজড ব্র্যান্ডিং / প্যাকিং নোট (যেমন: কোম্পানির লোগো প্রিন্টেড স্টিকার)"
                    className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-[11px] text-stone-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Financials, Advance & Payment Terms */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <h2 className="font-extrabold text-[#351C1B] text-base sm:text-lg">
                আর্থিক হিসাব, অগ্রিম পেমেন্ট ও চুক্তি শর্তাবলী
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  কাস্টম ব্র্যান্ডিং ফি (টাকা)
                </label>
                <input
                  type="number"
                  value={customBrandingFee}
                  onChange={(e) => setCustomBrandingFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  গৃহীত অগ্রিম জমা (Advance Paid ৳)
                </label>
                <input
                  type="number"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  মোট বাজেট ও বকেয়া
                </label>
                <div className="p-2 bg-amber-50/70 rounded-xl border border-amber-200 text-xs">
                  <div className="font-black text-[#351C1B]">
                    মোট: ৳ {toBnDigits(totalBudget.toLocaleString("en-IN"))}
                  </div>
                  <div className="text-red-700 font-bold text-[11px]">
                    বকেয়া: ৳ {toBnDigits(dueAmount.toLocaleString("en-IN"))}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  পেমেন্ট শর্তাবলী (Payment Terms)
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="যেমন: ৫০% অগ্রিম + ডেলিভারির দিনে অবশিষ্ট চেক"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  দায়িত্বপ্রাপ্ত অ্যাকাউন্ট ম্যানেজার
                </label>
                <input
                  type="text"
                  value={assignedManager}
                  onChange={(e) => setAssignedManager(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  অর্ডার স্ট্যাটাস পাইপলাইন
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CorporateOrderStatus)}
                  aria-label="অর্ডার স্ট্যাটাস পাইপলাইন"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900"
                >
                  <option value="New Lead">নতুন ইনকোয়ারি (New Lead)</option>
                  <option value="Quotation Sent">কোটেশন পাঠানো হয়েছে (Quotation Sent)</option>
                  <option value="Confirmed">অর্ডার নিশ্চিত ও চুক্তি সম্পন্ন (Confirmed)</option>
                  <option value="In Production">কারখানায় প্রস্তুত হচ্ছে (In Production)</option>
                  <option value="Delivered">সফলভাবে ডেলিভারি সম্পন্ন (Delivered)</option>
                  <option value="Cancelled">বাতিল (Cancelled)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  কারখানা ও ইন্টারনাল নোটস
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="প্যাকেজিং নির্দেশনা, লোগো ড্রাইভ লিংক অথবা বিশেষ ডেলিভারি প্রটোকল..."
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 resize-none"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Col: Live Printable Formal Quotation Sheet */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 px-1">
            <span className="flex items-center gap-1.5 text-[#C48A4E]">
              <Printer className="w-3.5 h-3.5" />
              <span>ফরমাল কোটেশন লাইভ প্রিভিউ</span>
            </span>
            <span className="font-mono text-[10px] uppercase bg-stone-100 px-2 py-0.5 rounded text-stone-600">
              A4 Sheet
            </span>
          </div>

          {/* Quotation Paper */}
          <div className="bg-white rounded-3xl p-6 border border-stone-300 shadow-xl space-y-5 text-xs text-stone-800 relative overflow-hidden font-sans">
            {/* Header with Letterhead */}
            <div className="border-b-2 border-[#351C1B] pb-4 flex items-start justify-between">
              <div>
                <h3 className="font-black text-[#351C1B] text-lg font-bengali">দই বিলাস</h3>
                <p className="text-[10px] text-stone-500 font-bengali">
                  বগুড়ার খাঁটি ঐতিহ্যবাহী দই ও মিষ্টান্ন
                </p>
                <div className="text-[9px] text-stone-400 mt-1 leading-tight">
                  বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা • 01712-345678
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-white text-[10px] font-bold font-mono">
                  QUOTATION
                </span>
                <div className="font-mono text-[10px] text-stone-500 mt-1">
                  NO: QT-DB-901
                </div>
                <div className="text-[10px] text-stone-400">
                  তারিখ: {new Date().toLocaleDateString("bn-BD")}
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 space-y-1 text-[11px] font-bengali">
              <div>
                গ্রহীতা: <strong className="text-stone-900">{companyName || "প্রতিষ্ঠানের নাম"}</strong>
              </div>
              <div>
                মনোযোগ: {contactPerson || "কর্মকর্তার নাম"} ({designation || "পদবি"})
              </div>
              <div>মোবাইল: {phone || "০১৭XXXXXXXX"}</div>
              <div>ভেন্যু: {deliveryAddress || "ডেলিভারি ঠিকানা"}</div>
            </div>

            {/* Items Table Mock */}
            <table className="w-full text-left border-collapse text-[11px] font-bengali">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-[10px] uppercase font-bold">
                  <th className="py-1">পণ্য</th>
                  <th className="py-1 text-center">পরিমাণ</th>
                  <th className="py-1 text-right">মোট (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-1.5 pr-2 truncate max-w-[140px] font-medium">
                      {it.productTitle || "পণ্য বিবরণ"}
                    </td>
                    <td className="py-1.5 text-center font-mono">{it.quantity}</td>
                    <td className="py-1.5 text-right font-mono font-bold">
                      {it.totalPrice?.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total breakdown */}
            <div className="border-t border-stone-200 pt-2 space-y-1 text-[11px] font-bengali">
              <div className="flex justify-between text-stone-600">
                <span>উপ-মোট (Subtotal):</span>
                <span className="font-mono font-bold">৳ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              {customBrandingFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>কাস্টম ব্র্যান্ডিং ও প্যাকিং ফি:</span>
                  <span className="font-mono font-bold">৳ {customBrandingFee.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm text-[#351C1B] pt-1 border-t border-stone-200">
                <span>সর্বমোট বাজেট:</span>
                <span className="font-mono">৳ {totalBudget.toLocaleString("en-IN")}</span>
              </div>
              {advancePaid > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold text-[10px]">
                  <span>পরিশোধিত অগ্রিম:</span>
                  <span className="font-mono">৳ {advancePaid.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-red-700 font-bold text-[10px]">
                <span>পরিশোধযোগ্য বকেয়া:</span>
                <span className="font-mono">৳ {dueAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Signature line */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-bengali">
              <div>
                <div className="w-24 border-b border-stone-300 pb-1 text-center">
                  অনুমোদনকারী
                </div>
              </div>
              <div className="text-right">
                <div className="w-24 border-b border-stone-300 pb-1 text-center">
                  দই বিলাস কর্তৃপক্ষ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
