"use client";

import React from "react";
import {
  Scale,
  ShoppingBag,
  CreditCard,
  ShieldAlert,
  Copyright,
  Gavel,
  CheckCircle2,
  AlertCircle,
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import LegalPageLayout, { type LegalSection } from "@/components/ui/LegalPageLayout";


const SECTIONS: LegalSection[] = [
  { id: "eligibility", title: "১. সেবার যোগ্যতা ও অ্যাকাউন্ট", icon: UserCheck },
  { id: "product-pricing", title: "২. পণ্য, স্টক ও মূল্য নির্ধারণ", icon: ShoppingBag },
  { id: "orders-contract", title: "৩. অর্ডার গ্রহণ ও চুক্তি সম্পাদন", icon: CheckCircle2 },
  { id: "payment-terms", title: "৪. পেমেন্ট ও লেনদেন পদ্ধতি", icon: CreditCard },
  { id: "intellectual-property", title: "৫. মেধাস্বত্ব ও ট্রেডমার্ক সুরক্ষা", icon: Copyright },
  { id: "liability-limits", title: "৬. দায়বদ্ধতার সীমাবদ্ধতা", icon: ShieldAlert },
  { id: "governing-law", title: "৭. আইনি এখতিয়ার ও নিষ্পত্তি", icon: Gavel },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      breadcrumb="শর্তাবলী"
      badge="কার্যকর সংস্করণ: অক্টোবর ২০২৬ • সংস্করণ ২.৪"
      BadgeIcon={Scale}
      title="ব্যবহারের নিয়ম ও সেবার"
      highlight="সাধারণ শর্তাবলী"
      subtitle="দই বিলাসের ওয়েবসাইট ভিজিট বা আমাদের প্রিমিয়াম পণ্যসম্ভার অর্ডার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মতি প্রদান করছেন। গ্রাহক সন্তুষ্টি ও স্বচ্ছতার স্বার্থে নিয়মগুলো সংক্ষেপে তুলে ধরা হলো।"
      pills={[
        { icon: ShieldCheck, text: "ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯ অনুযায়ী পরিচালিত" },
        { icon: CheckCircle2, text: "নিশ্চিত মূল্য ও কোনো গোপন চার্জ নেই" },
        { icon: Scale, text: "ন্যায্য ব্যবসায়িক প্রতিশ্রুতি" },
      ]}
      sections={SECTIONS}
      tocTitle="শর্তাবলীর সূচিপত্র"
      support={{
        title: "আইনি সহায়তা ও জিজ্ঞাসা",
        text: "আমাদের নীতিমালা বা ক্রয়ের শর্তাবলী সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি লিগ্যাল টিমের সাথে যোগাযোগ করুন।",
        email: "legal@doibilash.com",
      }}
    >
      {/* Section 1: Eligibility & Account */}
      <section
        id="eligibility"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০১
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ১. সেবার যোগ্যতা ও অ্যাকাউন্ট পরিচালনা
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          দই বিলাস ওয়েবসাইটের মাধ্যমে পণ্য ক্রয় করতে হলে গ্রাহককে নিম্নলিখিত নিয়মাবলি মেনে চলতে হবে:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bengali text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1.5">
            <h4 className="font-bold text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              আইনি বয়স
            </h4>
            <p className="text-gray-600 leading-relaxed text-xs">
              গ্রাহককে বাংলাদেশের আইন অনুযায়ী কমপক্ষে ১৮ বছর অথবা অভিভাবকের সম্মতিক্রমে অর্ডার করতে হবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 space-y-1.5">
            <h4 className="font-bold text-doibrand-dark flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-doibrand-gold" />
              সঠিক তথ্যের নিশ্চয়তা
            </h4>
            <p className="text-gray-600 leading-relaxed text-xs">
              অর্ডার ফর্ম বা প্রোফাইলে প্রদত্ত মোবাইল নম্বর ও ডেলিভারি ঠিকানা সম্পূর্ণ সত্য ও নির্ভুল হতে হবে।
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Products & Pricing */}
      <section
        id="product-pricing"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০২
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ২. পণ্য, স্টক ও মূল্য নির্ধারণ
            </h2>
          </div>
        </div>

        {/* Price Freeze Guarantee Box */}
        <div className="bg-linear-to-r from-[#FFF3E3] to-[#FFFCF7] border-l-4 border-doibrand-gold p-4 rounded-r-2xl">
          <div className="flex items-center gap-2 text-doibrand-dark font-bengali font-bold text-sm mb-1">
            <CheckCircle2 className="w-4 h-4 text-doibrand-gold" />
            <span>মূল্য নিশ্চয়তা ও স্থায়িত্ব</span>
          </div>
          <p className="font-bengali text-xs text-gray-700 leading-relaxed">
            ওয়েবসাইটে প্রদর্শিত সকল পণ্যের মূল্য বাংলাদেশি টাকায় (BDT)। আপনি একবার অর্ডার কনফার্ম করলে পরবর্তীতে কোনো অবস্থাতেই পণ্যের দাম বাড়ানো হবে না।
          </p>
        </div>

        <ul className="space-y-2.5 font-bengali text-xs sm:text-sm text-gray-700 list-disc list-inside">
          <li>
            <strong>প্রাকৃতিক উপাদানের তারতম্য:</strong> যেহেতু আমাদের দই মাটির সরায় হস্তনির্মিত এবং কোনো কৃত্রিম উপাদানহীন, সেহেতু মৌসুমভেদে সামান্য ঘনত্বের প্রাকৃতিক তারতম্য দেখা যেতে পারে।
          </li>
          <li>
            <strong>সীমিত স্টক প্রাপ্যতা:</strong> কোনো কারণে স্টক শেষ হয়ে গেলে অর্ডার প্রক্রিয়াকরণের আগেই গ্রাহককে অবহিত করা হবে এবং অগ্রিম পরিশোধিত অর্থ পূর্ণ রিফান্ড করা হবে।
          </li>
          <li>
            <strong>প্রমোশনাল কুপন ও ডিসকাউন্ট:</strong> ভাউচার কোডগুলো নির্দিষ্ট ন্যূনতম ক্রয়সীমা ও সময়ের জন্য প্রযোজ্য হবে।
          </li>
        </ul>
      </section>

      {/* Section 3: Orders & Contract */}
      <section
        id="orders-contract"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০৩
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৩. অর্ডার গ্রহণ ও চুক্তি সম্পাদন
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          ওয়েবসাইটে অর্ডার প্লেস করার পর আমাদের স্বয়ংক্রিয় সিস্টেম থেকে একটি নিশ্চিতকরণ SMS পাঠানো হবে। অর্ডার সম্পর্কিত নিয়মাবলি:
        </p>

        <div className="space-y-3 font-bengali text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 flex items-start gap-3">
            <Clock className="w-4 h-4 text-doibrand-gold shrink-0 mt-0.5" />
            <p className="text-gray-700 leading-relaxed">
              <strong>বাতিল করার সময়সীমা:</strong> অর্ডার কনফার্মেশনের ১ ঘণ্টার মধ্যে অথবা রাইডারের কাছে পার্সেল হস্তান্তরের পূর্বে কাস্টমার কেয়ারে কল করে অর্ডার পরিবর্তন বা বাতিল করা যাবে।
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F1] ring-1 ring-doibrand-gold/15 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-gray-700 leading-relaxed">
              <strong>অর্ডার প্রত্যাখ্যানের অধিকার:</strong> ভুল বা অস্তিত্বহীন ফোন নম্বর, যোগাযোগের ব্যর্থতা অথবা অনৈতিক জালিয়াতির প্রমাণ পেলে দই বিলাস অর্ডার বাতিলের অধিকার রাখে।
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Payment Terms */}
      <section
        id="payment-terms"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০৪
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৪. পেমেন্ট ও লেনদেন পদ্ধতি
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          গ্রাহকের সুবিধার্থে আমরা একাধিক বিশ্বস্ত পেমেন্ট মাধ্যম সমর্থন করি:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-bengali text-xs sm:text-sm">
          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <h4 className="font-bold text-doibrand-dark">ক্যাশ অন ডেলিভারি (COD)</h4>
            <p className="text-gray-600 text-xs">
              পণ্য হাতে পেয়ে প্যাকেট অক্ষত দেখে মূল্য পরিশোধ করুন।
            </p>
          </div>

          <div className="p-4 rounded-2xl ring-1 ring-stone-200/70 bg-white space-y-1">
            <h4 className="font-bold text-doibrand-dark">ডিজিটাল ও মোবাইল ব্যাংকিং</h4>
            <p className="text-gray-600 text-xs">
              বিকাশ, নগদ, রকেট এবং ভিসা ও মাস্টারকার্ডের মাধ্যমে সম্পূর্ণ নিরাপদ ডিজিটাল পেমেন্ট।
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Intellectual Property */}
      <section
        id="intellectual-property"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <Copyright className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০৫
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৫. মেধাস্বত্ব ও ট্রেডমার্ক সুরক্ষা
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          ‘দই বিলাস’ লোগো, ট্রেডমার্ক, ব্র্যান্ড ডিজাইন, পণ্যের ফটোগ্রাফি ও ওয়েবসাইটের সকল টেক্সট কন্টেন্ট আমাদের নিজস্ব বুদ্ধিবৃত্তিক সম্পদ। আমাদের পূর্বানুমতি ছাড়া যেকোনো বাণিজ্যিক অনুলিপি বা প্রতারণামূলক ব্যবহার আইনত দণ্ডনীয়।
        </p>
      </section>

      {/* Section 6: Limitations of Liability */}
      <section
        id="liability-limits"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০৬
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৬. দায়বদ্ধতার সীমাবদ্ধতা
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          অনাকাঙ্ক্ষিত প্রাকৃতিক দুর্যোগ, রাজনৈতিক ধর্মঘট বা ট্রাফিক বাধার কারণে ডেলিভারি সাময়িক বিলম্বিত হতে পারে। যেকোনো ত্রুটিযুক্ত বা ক্ষতিগ্রস্ত পণ্যের ক্ষেত্রে দই বিলাসের সর্বোচ্চ আর্থিক দায়বদ্ধতা সংশ্লিষ্ট পণ্যের অর্ডারি মূল্যের সমপরিমাণ হবে।
        </p>
      </section>

      {/* Section 7: Governing Law & Contact */}
      <section
        id="governing-law"
        className="rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)] scroll-mt-36 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] flex items-center justify-center shrink-0">
            <Gavel className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-doibrand-gold uppercase tracking-[0.2em] font-bengali">
              অনুচ্ছেদ ০৭
            </span>
            <h2 className="font-bengali font-bold text-xl sm:text-2xl text-doibrand-dark">
              ৭. আইনি এখতিয়ার ও বিরোধ নিষ্পত্তি
            </h2>
          </div>
        </div>

        <p className="font-bengali text-xs sm:text-sm text-gray-700 leading-relaxed">
          এই ব্যবহারের শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত ও নিয়ন্ত্রিত হবে। যেকোনো অনাকাঙ্ক্ষিত বিরোধ দেখা দিলে তা প্রথমে উভয় পক্ষের সৌহার্দ্যপূর্ণ আলোচনার মাধ্যমে সমাধানের চেষ্টা করা হবে, অন্যথায় তা ঢাকার উপযুক্ত আদালতের এখতিয়ারাধীন থাকবে।
        </p>

        {/* Direct Legal Contact Information */}
        <div className="rounded-2xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-6 ring-1 ring-doibrand-gold/20 space-y-4">
          <h4 className="font-bengali font-bold text-base text-doibrand-dark">
            লিগ্যাল ও কমপ্লায়েন্স ডিপার্টমেন্ট
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-bengali text-xs">
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">ইমেইল:</span>
                <a href="mailto:legal@doibilash.com" className="font-semibold text-doibrand-dark hover:underline">
                  legal@doibilash.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">হটলাইন:</span>
                <a href="tel:+8801645460095" className="font-semibold text-doibrand-dark hover:underline">
                  01645-460095
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-doibrand-gold shrink-0" />
              <div>
                <span className="text-gray-500 block">কারখানা ও অফিস:</span>
                <span className="font-semibold text-doibrand-dark">শেরপুর রোড, বগুড়া</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LegalPageLayout>
  );
}
