"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import StaticPageLayout from "@/components/ui/StaticPageLayout";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    category: "অর্ডার",
    question: "আমি কীভাবে অর্ডার করব?",
    answer:
      "আমাদের ওয়েবসাইটে আপনার পছন্দের পণ্য বেছে নিন, কার্টে যোগ করুন এবং চেকআউট পেজে আপনার ঠিকানা ও ফোন নম্বর দিয়ে অর্ডার কনফার্ম করুন। অর্ডার কনফার্মেশনের পর আপনি একটি SMS পাবেন। ডেলিভারি সম্পন্ন হলে ক্যাশ অন ডেলিভারি (COD) পেমেন্ট করা যাবে।",
  },
  {
    id: "faq-2",
    category: "ডেলিভারি",
    question: "ডেলিভারি কত দিনের মধ্যে পাওয়া যাবে?",
    answer:
      "ঢাকার মধ্যে সাধারণত ১–২ কার্যদিবসের মধ্যে ডেলিভারি দেওয়া হয়। ঢাকার বাইরে সারা বাংলাদেশে ৩–৫ কার্যদিবস সময় লাগতে পারে। বিশেষ পরিস্থিতিতে (ঈদ, পূজা, বন্যা) ডেলিভারিতে অতিরিক্ত সময় লাগতে পারে — সেক্ষেত্রে আপনাকে আগেই জানানো হবে।",
  },
  {
    id: "faq-3",
    category: "পণ্যের মান",
    question: "পণ্যের গুণমান ও তাজাত্ব নিশ্চিত হয় কীভাবে?",
    answer:
      "দই বিলাসের সব পণ্য প্রতিদিন তাজাভাবে তৈরি করা হয়। বগুড়ার বিখ্যাত সরার দই, খাঁটি গাওয়া ঘি ও মধু সরাসরি উৎস থেকে সংগ্রহ করা হয়। প্রতিটি ব্যাচ প্যাকেজিংয়ের আগে গুণমান নিরীক্ষা করা হয়। যদি আপনি পণ্যের মান নিয়ে সন্তুষ্ট না হন, আমরা সম্পূর্ণ রিফান্ড বা প্রতিস্থাপন নিশ্চিত করি।",
  },
  {
    id: "faq-4",
    category: "পেমেন্ট",
    question: "কোন কোন পেমেন্ট পদ্ধতি গ্রহণ করা হয়?",
    answer:
      "আমরা বর্তমানে ক্যাশ অন ডেলিভারি (COD) গ্রহণ করি। এছাড়াও বিকাশ, নগদ, রকেট এবং ব্যাংক ট্রান্সফারের মাধ্যমে আগাম পেমেন্ট করা যাবে। আগাম পেমেন্টে ৫% ছাড় পাওয়া যায়। অনলাইন কার্ড পেমেন্ট শীঘ্রই চালু হবে।",
  },
  {
    id: "faq-5",
    category: "রিটার্ন",
    question: "পণ্য ফেরত বা রিফান্ড পলিসি কী?",
    answer:
      "পণ্য ডেলিভারির ২৪ ঘণ্টার মধ্যে যদি কোনো সমস্যা থাকে (ক্ষতিগ্রস্ত প্যাকেজ, ভুল পণ্য, মানহীন পণ্য) তাহলে আমাদের হোয়াটসঅ্যাপে ছবিসহ জানান। আমরা দ্রুত প্রতিস্থাপন বা সম্পূর্ণ রিফান্ড দিয়ে দেব। তাজা খাদ্যপণ্যের প্রকৃতির কারণে শুধুমাত্র উপরোক্ত ক্ষেত্রে রিটার্ন গ্রহণযোগ্য।",
  },
  {
    id: "faq-6",
    category: "অর্ডার",
    question: "অর্ডার বাতিল বা পরিবর্তন করা যাবে কি?",
    answer:
      "অর্ডার কনফার্মেশনের ২ ঘণ্টার মধ্যে আপনি অর্ডার বাতিল বা পরিবর্তন করতে পারবেন। এর পর একবার প্যাকেজিং শুরু হলে পরিবর্তন সম্ভব নাও হতে পারে। বাতিলের জন্য আমাদের সাথে যত দ্রুত সম্ভব যোগাযোগ করুন।",
  },
  {
    id: "faq-7",
    category: "ডেলিভারি",
    question: "ঢাকার বাইরে ডেলিভারি চার্জ কত?",
    answer:
      "ঢাকার মধ্যে ডেলিভারি চার্জ ৬০ টাকা। ঢাকার বাইরে জেলা সদরে ১০০–১৩০ টাকা এবং উপজেলা পর্যায়ে ১৩০–১৬০ টাকা। ৩,০০০ টাকার উপরে অর্ডারে সারা দেশে ফ্রি ডেলিভারি প্রযোজ্য।",
  },
];

// ─── Category badge colors ────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "অর্ডার": "bg-blue-50 text-blue-600 border-blue-100",
  "ডেলিভারি": "bg-amber-50 text-amber-700 border-amber-100",
  "পণ্যের মান": "bg-green-50 text-green-700 border-green-100",
  "পেমেন্ট": "bg-purple-50 text-purple-700 border-purple-100",
  "রিটার্ন": "bg-red-50 text-red-600 border-red-100",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-gray-50 text-gray-600 border-gray-200";
}

// ─── Accordion Item ───────────────────────────────────────────────────────────

interface AccordionItemProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function AccordionItem({ item, isOpen, onToggle, index }: AccordionItemProps) {
  return (
    <div
      className={`bg-white border rounded-xl mb-4 shadow-sm overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-doibrand-gold shadow-doibrand-gold/10 shadow-md"
          : "border-gray-200 hover:border-doibrand-gold/50"
      }`}
    >
      {/* Accordion Header */}
      <button
        id={`faq-btn-${item.id}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${item.id}`}
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-doibrand-gold focus-visible:ring-inset"
      >
        {/* Index number */}
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-sans transition-colors duration-200 ${
            isOpen
              ? "bg-doibrand-gold text-white"
              : "bg-doibrand-light text-doibrand-gold"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Question text */}
        <span className="flex-1 font-bengali text-base font-semibold text-doibrand-dark leading-snug group-hover:text-doibrand-accent transition-colors duration-150">
          {item.question}
        </span>

        {/* Category badge (hidden on small screens) */}
        <span
          className={`hidden sm:inline-block text-[10px] font-semibold font-bengali border px-2.5 py-1 rounded-full shrink-0 ${getCategoryColor(item.category)}`}
        >
          {item.category}
        </span>

        {/* Chevron */}
        <span
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-doibrand-gold text-white rotate-0"
              : "bg-gray-100 text-gray-500 group-hover:bg-doibrand-light group-hover:text-doibrand-gold"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Accordion Body — CSS-driven smooth slide */}
      <div
        id={`faq-panel-${item.id}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5">
            <div className="border-t border-gray-100 pt-4 mt-0">
              <p className="text-gray-600 font-bengali leading-relaxed text-sm md:text-base">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Contact CTA block ────────────────────────────────────────────────────────

function ContactCTA() {
  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-doibrand-dark to-doibrand-accent px-8 py-6 text-white text-center">
        <MessageCircle className="w-8 h-8 mx-auto mb-3 opacity-90" />
        <h2 className="font-bengali text-xl font-bold mb-1">
          আরও প্রশ্ন আছে?
        </h2>
        <p className="text-sm text-white/80 font-bengali">
          আমাদের সাপোর্ট টিম সাহায্য করতে সদা প্রস্তুত
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100">
        <Link
          href="tel:+8801700000000"
          className="flex flex-col items-center gap-2 bg-white px-6 py-6 hover:bg-doibrand-light transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-doibrand-light flex items-center justify-center group-hover:bg-doibrand-gold/20 transition-colors">
            <Phone className="w-5 h-5 text-doibrand-gold" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bengali">ফোন করুন</p>
            <p className="text-sm font-bold text-doibrand-dark font-sans">
              +880 17XX-XXXXXX
            </p>
          </div>
        </Link>
        <Link
          href="mailto:support@doibilash.com"
          className="flex flex-col items-center gap-2 bg-white px-6 py-6 hover:bg-doibrand-light transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-doibrand-light flex items-center justify-center group-hover:bg-doibrand-gold/20 transition-colors">
            <Mail className="w-5 h-5 text-doibrand-gold" />
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 font-bengali">ইমেইল করুন</p>
            <p className="text-sm font-bold text-doibrand-dark font-sans">
              support@doibilash.com
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// ─── Main FAQ Page ────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <StaticPageLayout
      breadcrumb="FAQ"
      title="সচরাচর জিজ্ঞাসিত প্রশ্ন"
      badge="সহায়তা কেন্দ্র"
      subtitle="দই বিলাস সম্পর্কে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের উত্তর এখানে পাবেন। আপনার প্রশ্ন এখানে না থাকলে সরাসরি আমাদের সাথে যোগাযোগ করুন।"
      Icon={HelpCircle}
    >
      {/* Category legend */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs text-gray-400 font-bengali mr-1">বিষয়:</span>
        {Object.entries(CATEGORY_COLORS).map(([cat, cls]) => (
          <span
            key={cat}
            className={`text-[11px] font-semibold font-bengali border px-2.5 py-1 rounded-full ${cls}`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Accordion list */}
      <div role="list" aria-label="সচরাচর জিজ্ঞাসিত প্রশ্ন তালিকা">
        {FAQ_ITEMS.map((item, idx) => (
          <AccordionItem
            key={item.id}
            item={item}
            index={idx}
            isOpen={openId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </div>

      {/* Contact CTA */}
      <ContactCTA />
    </StaticPageLayout>
  );
}
