"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  CreditCard,
  Cookie,
  FileText,
  Mail,
  CheckCircle2,
  PhoneCall,
  MapPin,
} from "lucide-react";
import LegalPageLayout, { type LegalSection } from "@/components/ui/LegalPageLayout";


const SECTIONS: LegalSection[] = [
  { id: "info-collection", title: "১. যেসব তথ্য আমরা সংগ্রহ করি", icon: UserCheck },
  { id: "info-usage", title: "২. তথ্য ব্যবহারের সুনির্দিষ্ট উদ্দেশ্য", icon: FileText },
  { id: "info-sharing", title: "৩. তথ্য ভাগাভাগি ও গোপনীয়তা", icon: EyeOff },
  { id: "payment-security", title: "৪. পেমেন্ট ও লেনদেন নিরাপত্তা", icon: CreditCard },
  { id: "cookie-policy", title: "৫. কুকি ও ট্র্যাকিং নীতি", icon: Cookie },
  { id: "user-rights", title: "৬. আপনার অধিকার ও নিয়ন্ত্রণ", icon: Lock },
  { id: "policy-updates", title: "৭. নীতিমালার হালনাগাদ ও যোগাযোগ", icon: Mail },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      breadcrumb="গোপনীয়তা নীতি"
      badge="সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬ • সংস্করণ ৩.২"
      BadgeIcon={ShieldCheck}
      title="গোপনীয়তা ও"
      highlight="ব্যক্তিগত তথ্য সুরক্ষা নীতি"
      subtitle="দই বিলাসে আপনার বিশ্বাস আমাদের সবচেয়ে বড় মূলধন। আপনার ব্যক্তিগত তথ্যের সুরক্ষা, স্বচ্ছতা এবং নির্ভরযোগ্যতা নিশ্চিত করতে আমরা কীভাবে কাজ করি তা নিচে বিস্তারিত তুলে ধরা হলো।"
      pills={[
        { icon: Lock, text: "নিরাপদ তথ্য সংরক্ষণ" },
        { icon: EyeOff, text: "তথ্য বিক্রয় না করার শতভাগ নিশ্চয়তা" },
        { icon: CheckCircle2, text: "স্বচ্ছ ও নিরাপদ অর্ডার ম্যানেজমেন্ট" },
      ]}
      sections={SECTIONS}
      tocTitle="সূচিপত্র"
      support={{
        title: "কোনো প্রশ্ন বা জিজ্ঞাসা?",
        text: "আপনার তথ্যের গোপনীয়তা বা প্রোফাইল ডেটা বিষয়ে কোনো সংশয় থাকলে সরাসরি আমাদের ডেটা প্রটেকশন টিমের সাথে কথা বলুন।",
        email: "privacy@doibilash.com",
      }}
    >
      {/* Section 1: Information Collection */}
      <section
        id="info-collection"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০১
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ১. যেসব তথ্য আমরা সংগ্রহ করি
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          দই বিলাস প্ল্যাটফর্মের মাধ্যমে প্রিমিয়াম সরার দই, মিষ্টি বা অন্যান্য পণ্য অর্ডার করার সময় এবং আমাদের ওয়েবসাইট ব্রাউজ করার সময় আমরা প্রয়োজনীয় কিছু মৌলিক তথ্য সংগ্রহ করে থাকি:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1">
            <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              ব্যক্তিগত পরিচিতি
            </h4>
            <p className="font-bengali text-xs text-gray-600 leading-relaxed">
              আপনার পূর্ণ নাম, যোগাযোগের মোবাইল ফোন নম্বর এবং ইমেইল অ্যাড্রেস (অ্যাকাউন্ট ভেরিফিকেশন ও আপডেটের জন্য)।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1">
            <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              ডেলিভারি ঠিকানা
            </h4>
            <p className="font-bengali text-xs text-gray-600 leading-relaxed">
              বাসা/অফিস নম্বর, রোড, এরিয়া, থানা ও জেলা যাতে আমাদের রাইডার দ্রুত আপনার দোরগোড়ায় পৌঁছাতে পারেন।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1">
            <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              অর্ডার ও লেনদেনের রেকর্ড
            </h4>
            <p className="font-bengali text-xs text-gray-600 leading-relaxed">
              ক্রয়কৃত আইটেম, চালানের পরিমাণ, পেমেন্ট মেথড (ক্যাশ অন ডেলিভারি বা অনলাইন গেটওয়ে) এবং ইনভয়েস হিস্ট্রি।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1">
            <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              ডিভাইস ও ব্রাউজিং ডেটা
            </h4>
            <p className="font-bengali text-xs text-gray-600 leading-relaxed">
              আইপি অ্যাড্রেস, ব্রাউজারের ধরণ, এবং ভিজিটিং পেজসমূহ — যা ওয়েবসাইট সিকিউরিটি ও ইউজার এক্সপেরিয়েন্সের কাজে লাগে।
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Usage of Information */}
      <section
        id="info-usage"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০২
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ২. তথ্য ব্যবহারের সুনির্দিষ্ট উদ্দেশ্য
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          আপনার দেওয়া প্রতিটি তথ্য অত্যন্ত সতর্কতার সাথে শুধুমাত্র সেবা পরিচালনার প্রয়োজনে ব্যবহৃত হয়। প্রধান উদ্দেশ্যগুলো হলো:
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-bengali text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>অর্ডার প্রসেসিং ও নিরাপদ ডেলিভারি:</strong> কাঁচা দুধ ও তাজা মিষ্টান্ন দ্রুততম সময়ে আপনার নির্দিষ্ট গন্তব্যে পৌঁছানো নিশ্চিত করা।
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-bengali text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>রিয়েল-টাইম SMS ও স্ট্যাটাস আপডেট:</strong> অর্ডার গ্রহণ, প্রস্তুতি, রাইডারের যাত্রা ও ডেলিভারি সফলতার নোটিফিকেশন প্রদান।
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-bengali text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>গ্রাহক সেবা ও রিফান্ড ম্যানেজমেন্ট:</strong> কোনো পণ্য বা টেস্ট সংক্রান্ত মতামত ও অভিযোগ দ্রুত সমাধান করা।
            </p>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-bengali text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>স্পেশাল ধামাকা ভাউচার ও অফার:</strong> শুধুমাত্র আপনার সম্মতি সাপেক্ষে উৎসবকালীন ডিসকাউন্ট কোড পাঠানো।
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Information Sharing & Non-Disclosure */}
      <section
        id="info-sharing"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০৩
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৩. তথ্য ভাগাভাগি ও গোপনীয়তা
            </h2>
          </div>
        </div>

        {/* Bold Guarantee Callout */}
        <div className="bg-amber-50/70 border-l-4 border-doibrand-gold p-4 rounded-r-xl">
          <div className="flex items-center gap-2 text-doibrand-dark font-bengali font-bold text-sm mb-1">
            <ShieldCheck className="w-4 h-4 text-doibrand-gold" />
            <span>আমাদের জিরো-সেল গ্যারান্টি (Zero Data Sale)</span>
          </div>
          <p className="font-bengali text-xs text-gray-700 leading-relaxed">
            দই বিলাস কখনোই কোনো তৃতীয় পক্ষ, অ্যাডভার্টাইজিং নেটওয়ার্ক বা ডেটা ব্রোকারের কাছে আপনার ব্যক্তিগত ফোন নম্বর, নাম বা ডেটা বিক্রি অথবা লিজ দেয় না।
          </p>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          শুধুমাত্র সেবা সম্পাদনের স্বার্থে নিম্নলিখিত অত্যন্ত সীমিত ক্ষেত্রে ডেটা আদান-প্রদান করা হয়:
        </p>

        <ul className="space-y-2 font-bengali text-xs sm:text-sm text-gray-700 list-disc list-inside">
          <li>
            <strong>অনুমোদিত ডেলিভারি পার্টনার:</strong> পার্সেল হস্তান্তরের জন্য শুধুমাত্র প্রাপকের নাম, ফোন নম্বর ও পূর্ণ ঠিকানা ডেলিভারি রাইডারের সাথে শেয়ার করা হয়।
          </li>
          <li>
            <strong>আইনি বাধ্যবাধকতা:</strong> কেবল গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের আদালত বা বৈধ আইন প্রয়োগকারী সংস্থার লিখিত আনুষ্ঠানিক আদেশের প্রেক্ষিতে।
          </li>
        </ul>
      </section>

      {/* Section 4: Payment Security */}
      <section
        id="payment-security"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০৪
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৪. পেমেন্ট ও লেনদেন নিরাপত্তা
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          অনলাইন পেমেন্ট সম্পন্ন করতে আমরা বাংলাদেশ ব্যাংক অনুমোদিত শীর্ষস্থানীয় পেমেন্ট গেটওয়ে পার্টনারদের সাথে কাজ করি:
        </p>

        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2 text-doibrand-dark font-bengali font-bold text-sm">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>কোনো কার্ডের পিন বা সিভিভি আমাদের সার্ভারে সংরক্ষিত হয় না</span>
          </div>
          <p className="font-bengali text-xs text-gray-600 leading-relaxed">
            আপনার বিকাশ, নগদ, রকেট কিংবা ভিসা/মাস্টারকার্ডের তথ্য সরাসরি PCI-DSS সার্টিফায়েড গেটওয়ের মাধ্যমে এনক্রিপ্ট হয়ে ব্যাংকে পৌঁছায়। দই বিলাস সার্ভার কখনো আপনার গোপন পিন বা পাসওয়ার্ড দেখতে বা সংরক্ষণ করতে পারে না।
          </p>
        </div>
      </section>

      {/* Section 5: Cookies & Tracking Policy */}
      <section
        id="cookie-policy"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০৫
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৫. কুকি ও ট্র্যাকিং নীতি
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          আমাদের ওয়েবসাইটে কুকি ব্যবহারের মূল উদ্দেশ্য হলো আপনার ব্রাউজিং অভিজ্ঞতা সহজ ও ঝামেলামুক্ত রাখা:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-bengali text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-bold text-doibrand-dark block mb-1">প্রয়োজনীয় কুকি:</span>
            <p className="text-gray-600">আপনার কার্টে সংরক্ষিত মিষ্টান্ন ও দইয়ের তালিকা মনে রাখা।</p>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
            <span className="font-bold text-doibrand-dark block mb-1">অ্যানালিটিক্স কুকি:</span>
            <p className="text-gray-600">কোন কোন পেজ সবচেয়ে বেশি পঠিত হচ্ছে তা বুঝে ওয়েবসাইটের গতি বাড়ানো।</p>
          </div>
        </div>
      </section>

      {/* Section 6: User Rights & Control */}
      <section
        id="user-rights"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০৬
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৬. আপনার অধিকার ও নিয়ন্ত্রণ
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          একজন সম্মানিত গ্রাহক হিসেবে আপনার তথ্যের ওপর পূর্ণ নিয়ন্ত্রণ আপনার নিজের। আপনার অধিকারসমূহ:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <div className="text-doibrand-gold font-bold text-sm font-bengali">১. তথ্য সংশোধন</div>
            <p className="text-xs text-gray-600 font-bengali">
              আপনার প্রোফাইল থেকে যেকোনো সময় ভুল ঠিকানা বা ফোন নম্বর পরিবর্তন করতে পারবেন।
            </p>
          </div>

          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <div className="text-doibrand-gold font-bold text-sm font-bengali">২. নোটিফিকেশন বন্ধ</div>
            <p className="text-xs text-gray-600 font-bengali">
              প্রমোশনাল মেসেজ বা এসএমএস পেতে না চাইলে যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন।
            </p>
          </div>

          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <div className="text-doibrand-gold font-bold text-sm font-bengali">৩. ডেটা মুছে ফেলা</div>
            <p className="text-xs text-gray-600 font-bengali">
              অনুরোধ জানালে আপনার অ্যাকাউন্ট ও পূর্বতন সব ডেটা আমাদের ডাটাবেস থেকে মুছে দেওয়া হবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <div className="text-doibrand-gold font-bold text-sm font-bengali">৪. ডেটা কপি চাওয়া</div>
            <p className="text-xs text-gray-600 font-bengali">
              আমাদের কাছে আপনার সংরক্ষিত তথ্যের একটি ডিজিটাল কপি যেকোনো সময় চেয়ে নিতে পারবেন।
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Updates & Contact */}
      <section
        id="policy-updates"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অধ্যায় ০৭
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৭. নীতিমালার হালনাগাদ ও যোগাযোগ
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          আইনগত বা সেবামূলক পরিবর্তনের সাথে মিল রেখে আমরা সময়ে সময়ে এই গোপনীয়তা নীতি হালনাগাদ করতে পারি। যেকোনো বড় ধরনের পরিবর্তনে ওয়েবসাইটের নোটিশ বা এসএমএসের মাধ্যমে গ্রাহকদের অবগত করা হবে।
        </p>

        {/* Direct Contact Box */}
        <div className="rounded-2xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-6 ring-1 ring-doibrand-gold/20 space-y-4">
          <h4 className="font-bengali font-bold text-base text-doibrand-dark">
            ডেটা প্রটেকশন অফিসার (DPO) এর সাথে যোগাযোগ
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bengali text-xs">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">ইমেইল:</span>
                <a href="mailto:privacy@doibilash.com" className="font-semibold text-doibrand-dark hover:underline">
                  privacy@doibilash.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">সরাসরি ফোন:</span>
                <a href="tel:+8801645460095" className="font-semibold text-doibrand-dark hover:underline">
                  01645-460095
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">প্রধান কার্যালয়:</span>
                <span className="font-semibold text-doibrand-dark">বগুড়া সদর, বগুড়া</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
