"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  CreditCard,
  Cookie,
  FileText,
  Mail,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

interface SectionItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionItem[] = [
  { id: "info-collection", title: "১. যেসব তথ্য আমরা সংগ্রহ করি", icon: UserCheck },
  { id: "info-usage", title: "২. তথ্য ব্যবহারের সুনির্দিষ্ট উদ্দেশ্য", icon: FileText },
  { id: "info-sharing", title: "৩. তথ্য ভাগাভাগি ও গোপনীয়তা", icon: EyeOff },
  { id: "payment-security", title: "৪. পেমেন্ট ও লেনদেন নিরাপত্তা", icon: CreditCard },
  { id: "cookie-policy", title: "৫. কুকি ও ট্র্যাকিং নীতি", icon: Cookie },
  { id: "user-rights", title: "৬. আপনার অধিকার ও নিয়ন্ত্রণ", icon: Lock },
  { id: "policy-updates", title: "৭. নীতিমালার হালনাগাদ ও যোগাযোগ", icon: Mail },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("info-collection");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark pb-20">
      {/* ── 1. Hero Banner (Full-bleed edge-to-edge) ─────────────── */}
      <section className="w-full bg-doibrand-dark text-white relative overflow-hidden py-14 sm:py-20 border-b border-stone-800">
        {/* Ambient Lighting & Texture */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 bg-doibrand-gold/20 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-doibrand-accent/20 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C48A4E_1.5px,transparent_1.5px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-stone-300 font-bengali mb-4">
              <Link href="/" className="hover:text-doibrand-gold transition-colors">
                হোম
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-doibrand-gold font-medium">গোপনীয়তা নীতি</span>
            </nav>

            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 bg-doibrand-gold/20 border border-doibrand-gold/40 text-doibrand-gold px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 font-bengali">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬ • সংস্করণ ৩.২</span>
            </div>

            {/* Main Title */}
            <h1 className="font-bengali text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              গোপনীয়তা ও ব্যক্তিগত তথ্য সুরক্ষা নীতি
            </h1>

            {/* Subtitle */}
            <p className="font-bengali text-stone-200 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              দই বিলাসে আপনার বিশ্বাস আমাদের সবচেয়ে বড় মূলধন। আপনার ব্যক্তিগত তথ্যের সুরক্ষা, স্বচ্ছতা এবং নির্ভরযোগ্যতা নিশ্চিত করতে আমরা কীভাবে কাজ করি তা নিচে বিস্তারিত তুলে ধরা হলো।
            </p>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 pt-6 border-t border-stone-700/60 font-bengali text-xs text-stone-300">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Lock className="w-3.5 h-3.5 text-doibrand-gold" />
                <span>২৫৬-বিট SSL এনক্রিপ্টেড</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <EyeOff className="w-3.5 h-3.5 text-doibrand-gold" />
                <span>তথ্য বিক্রয় না করার শতভাগ নিশ্চয়তা</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-doibrand-gold" />
                <span>স্বচ্ছ ও নিরাপদ অর্ডার ম্যানেজমেন্ট</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Main Content (2 Columns: Sticky TOC + Detail Cards) ── */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Sticky Table of Contents */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
              <h2 className="font-bengali font-bold text-sm uppercase tracking-wider text-doibrand-dark flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                <FileText className="w-4 h-4 text-doibrand-gold" />
                <span>সূচিপত্র (Table of Contents)</span>
              </h2>

              <nav className="space-y-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bengali text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-50 text-doibrand-dark font-bold border-l-4 border-doibrand-gold shadow-2xs"
                          : "text-stone-600 hover:bg-stone-50 hover:text-doibrand-dark"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-doibrand-gold" : "text-stone-400"}`} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Privacy Support Callout */}
            <div className="bg-doibrand-dark text-white rounded-2xl p-5 shadow-sm border border-stone-800">
              <div className="flex items-center gap-2 text-doibrand-gold font-bengali text-xs font-semibold mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>কোনো প্রশ্ন বা জিজ্ঞাসা?</span>
              </div>
              <p className="font-bengali text-xs text-stone-300 leading-relaxed mb-4">
                আপনার তথ্যের গোপনীয়তা বা প্রোফাইল ডেটা বিষয়ে কোনো সংশয় থাকলে সরাসরি আমাদের ডেটা প্রটেকশন টিমের সাথে কথা বলুন।
              </p>
              <a
                href="mailto:privacy@doibilash.com"
                className="w-full inline-flex items-center justify-center gap-2 bg-doibrand-gold hover:bg-doibrand-accent text-white font-bengali text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>privacy@doibilash.com</span>
              </a>
            </div>
          </aside>

          {/* Right Column: Detailed Structured Policy Cards */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Section 1: Information Collection */}
            <section
              id="info-collection"
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
                    ব্যক্তিগত পরিচিতি
                  </h4>
                  <p className="font-bengali text-xs text-gray-600 leading-relaxed">
                    আপনার পূর্ণ নাম, যোগাযোগের মোবাইল ফোন নম্বর এবং ইমেইল অ্যাড্রেস (অ্যাকাউন্ট ভেরিফিকেশন ও আপডেটের জন্য)।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
                    ডেলিভারি ঠিকানা
                  </h4>
                  <p className="font-bengali text-xs text-gray-600 leading-relaxed">
                    বাসা/অফিস নম্বর, রোড, এরিয়া, থানা ও জেলা যাতে আমাদের রাইডার দ্রুত আপনার দোরগোড়ায় পৌঁছাতে পারেন।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <h4 className="font-bengali font-bold text-sm text-doibrand-dark flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
                    অর্ডার ও লেনদেনের রেকর্ড
                  </h4>
                  <p className="font-bengali text-xs text-gray-600 leading-relaxed">
                    ক্রয়কৃত আইটেম, চালানের পরিমাণ, পেমেন্ট মেথড (ক্যাশ অন ডেলিভারি বা অনলাইন গেটওয়ে) এবং ইনভয়েস হিস্ট্রি।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <Cookie className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-doibrand-gold font-bold text-sm font-bengali">১. তথ্য সংশোধন</div>
                  <p className="text-xs text-gray-600 font-bengali">
                    আপনার প্রোফাইল থেকে যেকোনো সময় ভুল ঠিকানা বা ফোন নম্বর পরিবর্তন করতে পারবেন।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-doibrand-gold font-bold text-sm font-bengali">২. নোটিফিকেশন বন্ধ</div>
                  <p className="text-xs text-gray-600 font-bengali">
                    প্রমোশনাল মেসেজ বা এসএমএস পেতে না চাইলে যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs space-y-1">
                  <div className="text-doibrand-gold font-bold text-sm font-bengali">৩. ডেটা মুছে ফেলা</div>
                  <p className="text-xs text-gray-600 font-bengali">
                    অনুরোধ জানালে আপনার অ্যাকাউন্ট ও পূর্বতন সব ডেটা আমাদের ডাটাবেস থেকে মুছে দেওয়া হবে।
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/80 bg-white shadow-2xs space-y-1">
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
              className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs scroll-mt-24 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-doibrand-gold flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-doibrand-accent uppercase tracking-wider font-bengali">
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
              <div className="bg-doibrand-light rounded-2xl p-6 border border-stone-200/90 space-y-4">
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
                      <a href="tel:+8801700000000" className="font-semibold text-doibrand-dark hover:underline">
                        +৮৮০ ১৭০০-০০০০০০
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
          </div>
        </div>
      </div>
    </main>
  );
}
