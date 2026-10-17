"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircleQuestion } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "বগুড়ার স্পেশাল সরার দই কতদিন ভালো থাকে এবং কীভাবে সংরক্ষণ করতে হয়?",
    answer:
      "আমাদের দই ১০০% প্রাকৃতিক এবং কোনো রাসায়নিক প্রিজারভেটিভ নেই। সাধারণ ফ্রিজে (৪°-৭° সে.) রাখলে ৭ থেকে ১০ দিন পর্যন্ত এর স্বাদ ও সর একদম অক্ষত থাকে। ফ্রিজ থেকে বের করে খাওয়ার ২০ মিনিট আগে রুম টেম্পারেচারে আনলে সবচেয়ে সেরা মিষ্টতা ও সুবাস পাওয়া যায়।",
  },
  {
    id: 2,
    question: "ডেলিভারির সময় মাটির সরা ভেঙে যাওয়ার কোনো ঝুঁকি থাকে কি?",
    answer:
      "একদমই না! আমরা বিশেষ কুশনযুক্ত থার্মোকল ও এয়ার-বাবল র‍্যাপার ব্যবহার করে প্রতিটি মাটির সরা যত্নসহকারে প্যাকেজিং করি। তদুপরি, ডেলিভারির সময় যদি কোনো কারণে পাত্র ভেঙে যায়, আমরা তাৎক্ষণিক বিনামূল্যে সম্পূর্ণ নতুন একটি পাত্র পাঠাই অথবা সম্পূর্ণ অর্থ রিফান্ড করি।",
  },
  {
    id: 3,
    question: "ঢাকার ভেতরে ও বাইরে ডেলিভারি কত দ্রুত পাওয়া যায়?",
    answer:
      "ঢাকা সিটির ভেতরে অর্ডার করার ২৪ ঘণ্টার মধ্যেই ডেলিভারি পৌঁছে দেওয়া হয়। আর ঢাকার বাইরে (সমগ্র বাংলাদেশ) এয়ার-কুলড ফাস্ট কুরিয়ারের মাধ্যমে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিরাপদে পৌঁছে দেওয়া হয়।",
  },
  {
    id: 4,
    question: "ক্যাশ অন ডেলিভারি (COD) পেমেন্ট সুবিধা আছে কি?",
    answer:
      "হ্যাঁ, আমাদের সব পণ্যেই ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা রয়েছে। পণ্য হাতে পেয়ে চেক করে ডেলিভারিম্যানকে মূল্য পরিশোধ করতে পারবেন। এছাড়া বিকাশ বা নগদের মাধ্যমেও অগ্রিম নিরাপদ পেমেন্ট করার সুযোগ রয়েছে।",
  },
  {
    id: 5,
    question: "বিয়ে বা পারিবারিক অনুষ্ঠানে বাল্ক অর্ডারের নিয়ম কী?",
    answer:
      "পারিবারিক উৎসব, জন্মদিন কিংবা বিয়ের মতো বড় অনুষ্ঠানে আমরা বিশেষ ডিসকাউন্টে সরাসরি বগুড়ার কারখানা থেকে তাজা সরা সরবরাহ করি। ন্যূনতম ৫০টি সরার ক্ষেত্রে কাস্টম নেম-ট্যাগ ও প্রি-বুকিং সুবিধা উপভোগ করতে পারবেন।",
  },
];

export default function HomeFaqSection() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFaq = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full py-16 bg-white font-bengali border-t border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-doibrand-gold text-xs font-bold mb-3 border border-amber-200/60">
            <MessageCircleQuestion className="w-4 h-4 text-doibrand-gold" />
            <span>সচরাচর জিজ্ঞাসা ও উত্তর</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark tracking-tight">
            সাধারণ জিজ্ঞাসা (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            দই বিলাসের পণ্য ও সেবা সম্পর্কে গ্রাহকদের প্রায়শই জিজ্ঞাসিত প্রশ্নের উত্তর
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-amber-50/40 border-doibrand-gold/40 shadow-xs"
                    : "bg-stone-50/70 border-stone-200 hover:border-stone-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-doibrand-dark leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? "bg-doibrand-gold text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-amber-200/30 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
