"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, RotateCcw } from "lucide-react";

const EVENT_TYPES = [
  "বিয়ে / গায়ে হলুদ",
  "কর্পোরেট গিফটিং",
  "অফিস ইভেন্ট / মিটিং",
  "ঈদ / পূজা / উৎসব",
  "জন্মদিন / পারিবারিক অনুষ্ঠান",
  "অন্যান্য",
];

const QUANTITY_RANGES = ["৫০ – ১০০ পিস", "১০০ – ৩০০ পিস", "৩০০ – ৫০০ পিস", "৫০০+ পিস"];

interface CorporateInquiryFormProps {
  whatsappNumber: string;
}

const inputClass =
  "w-full rounded-xl bg-white px-4 py-3 text-sm text-doibrand-dark placeholder-stone-400 ring-1 ring-stone-200 outline-none transition focus:ring-2 focus:ring-doibrand-gold/60 focus:shadow-[0_0_0_4px_rgba(196,138,78,0.12)]";

const labelClass = "mb-1.5 block text-xs font-semibold text-doibrand-dark";

export default function CorporateInquiryForm({ whatsappNumber }: CorporateInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const phone = get("phone").replace(/[\s-]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
      setError("সঠিক মোবাইল নম্বর দিন (যেমন: 01XXXXXXXXX)");
      return;
    }
    setError("");

    const lines = [
      "আসসালামু আলাইকুম, দই বিলাস টিম।",
      "আমি একটি কর্পোরেট / বাল্ক অর্ডার সম্পর্কে জানতে চাই।",
      "",
      `নাম: ${get("name")}`,
      get("company") && `প্রতিষ্ঠান: ${get("company")}`,
      `মোবাইল: ${phone}`,
      get("email") && `ইমেইল: ${get("email")}`,
      `অনুষ্ঠানের ধরন: ${get("eventType")}`,
      `আনুমানিক পরিমাণ: ${get("quantity")}`,
      get("date") && `ডেলিভারির তারিখ: ${get("date")}`,
      get("message") && `\nবিস্তারিত: ${get("message")}`,
    ].filter(Boolean);

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-14 px-6">
        <span className="w-16 h-16 grid place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="w-8 h-8" />
        </span>
        <h3 className="mt-5 text-xl font-bold text-doibrand-dark">আপনার অনুরোধ প্রস্তুত!</h3>
        <p className="mt-2 max-w-sm text-sm text-stone-500 leading-relaxed">
          WhatsApp-এ মেসেজটি পাঠিয়ে দিন। আমাদের কর্পোরেট টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FBF1E4] px-5 py-2.5 text-sm font-semibold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-doibrand-gold/15 transition"
        >
          <RotateCcw className="w-4 h-4" />
          নতুন অনুরোধ পাঠান
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          আপনার নাম <span className="text-doibrand-accent">*</span>
        </label>
        <input id="name" name="name" required placeholder="পূর্ণ নাম লিখুন" className={inputClass} />
      </div>
      <div>
        <label htmlFor="company" className={labelClass}>
          প্রতিষ্ঠানের নাম
        </label>
        <input id="company" name="company" placeholder="কোম্পানি / প্রতিষ্ঠান (ঐচ্ছিক)" className={inputClass} />
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          মোবাইল নম্বর <span className="text-doibrand-accent">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          inputMode="tel"
          placeholder="01XXXXXXXXX"
          aria-invalid={Boolean(error)}
          className={`${inputClass} font-sans ${error ? "ring-red-300" : ""}`}
        />
        {error && <p className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          ইমেইল
        </label>
        <input id="email" name="email" type="email" placeholder="you@company.com" className={`${inputClass} font-sans`} />
      </div>
      <div>
        <label htmlFor="eventType" className={labelClass}>
          অনুষ্ঠানের ধরন <span className="text-doibrand-accent">*</span>
        </label>
        <select id="eventType" name="eventType" required defaultValue="" className={`${inputClass} appearance-none`}>
          <option value="" disabled>
            নির্বাচন করুন
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className={labelClass}>
          আনুমানিক পরিমাণ <span className="text-doibrand-accent">*</span>
        </label>
        <select id="quantity" name="quantity" required defaultValue="" className={`${inputClass} appearance-none`}>
          <option value="" disabled>
            নির্বাচন করুন
          </option>
          {QUANTITY_RANGES.map((q) => (
            <option key={q}>{q}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="date" className={labelClass}>
          ডেলিভারির সম্ভাব্য তারিখ
        </label>
        <input id="date" name="date" type="date" className={`${inputClass} font-sans`} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          বিস্তারিত লিখুন
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="কোন কোন পণ্য চান, বাজেট, কাস্টম লোগো/প্যাকেজিং ইত্যাদি লিখুন..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-doibrand-accent to-doibrand-gold px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_26px_-12px_rgba(169,94,53,0.9)] hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          WhatsApp-এ অনুরোধ পাঠান
        </button>
        <p className="text-[11px] text-stone-500">
          ফর্মের তথ্যসহ WhatsApp খুলবে — শুধু সেন্ড চাপলেই হবে।
        </p>
      </div>
    </form>
  );
}
