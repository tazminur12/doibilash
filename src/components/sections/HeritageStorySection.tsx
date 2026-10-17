"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Award, Heart, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";

interface StepItem {
  id: number;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  image: string;
}

const STEPS: StepItem[] = [
  {
    id: 1,
    stepNumber: "০১",
    title: "খাঁটি গাভির ঘন দুধ সংগ্রহ",
    subtitle: "সরাসরি স্থানীয় বিশ্বস্ত খামার থেকে",
    description:
      "প্রতিদিন ভোরে বগুড়ার প্রত্যন্ত চরাঞ্চলের দেশি গাভির খাঁটি, নির্ভেজাল দুধ সংগ্রহ করা হয়। কোনো প্রিজারভেটিভ বা গুঁড়ো দুধের মিশ্রণ নেই—শতভাগ খাঁটি ননীযুক্ত তরল দুধ।",
    highlight: "১০০% প্রাকৃতিক ও নির্ভেজাল",
    image:
      "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    stepNumber: "০২",
    title: "কাঠের মৃদু আঁচে ঘন জ্বাল",
    subtitle: "ঘণ্টার পর ঘণ্টা ঐতিহ্যবাহী ক্যারামেলাইজেশন",
    description:
      "বড় লোহার কড়াইয়ে দেশি কাঠের চুলায় মৃদু আঁচে জ্বাল দিয়ে দুধের পরিমাণ এক-তৃতীয়াংশে নামিয়ে আনা হয়। এতে তৈরি হয় সোনালী লালচে রঙ আর অতুলনীয় প্রাকৃতিক ক্যারামেল সুবাস।",
    highlight: "ঘন ক্ষীরসার আসল ঘ্রাণ",
    image:
      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    stepNumber: "০৩",
    title: "পোড়ামাটির পাত্রে দই পাতার শিল্প",
    subtitle: "প্রাকৃতিক ফারমেন্টেশন ও পুরু সরের সৃষ্টি",
    description:
      "বগুড়ার ঐতিহ্যবাহী লাল পোড়ামাটির সরা বা হাঁড়িতে ঢেলে বিশেষ তাপমাত্রায় সারারাত ঢেকে রাখা হয়। মাটির পাত্র অতিরিক্ত জলীয় অংশ শুষে নিয়ে দইকে করে অসম্ভব ঘন, আঠালো ও সরযুক্ত।",
    highlight: "নিখুঁত জমাট বাঁধা ঘন সর",
    image: "/Product/doi.jpg",
  },
  {
    id: 4,
    stepNumber: "০৪",
    title: "হিমশীতল নিখুঁত পরিবেশন",
    subtitle: "সরাসরি আপনার খাবার টেবিলে",
    description:
      "পরিপূর্ণভাবে জমে যাওয়ার পর নিয়ন্ত্রিত শীতল তাপমাত্রায় মাটির পাত্র অক্ষত রেখে দ্রুততম সময়ে ডেলিভারি করা হয়। প্রথম চামচ মুখে দিতেই অনুভূত হয় আসল বগুড়ার রাজকীয় স্বাদ।",
    highlight: "তৃপ্তিদায়ক রাজকীয় স্বাদ",
    image: "/Product/mini_doi.png",
  },
];

export default function HeritageStorySection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="w-full py-16 bg-white font-bengali border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-doibrand-gold text-xs font-bold mb-3 border border-amber-200/60">
            <Sparkles className="w-4 h-4 text-doibrand-gold" />
            <span>ঐতিহ্যের স্বাদ ও তৈরির গল্প</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark tracking-tight">
            যেভাবে তৈরি হয় বগুড়ার আসল রাজকীয় দই
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
            দই বিলাসের প্রতিটি পাত্র কেবল একটি মিষ্টান্ন নয়—এটি শতাব্দী প্রাচীন বগুড়ার ঐতিহ্য, নিবেদিত কারিগরি এবং খাঁটি উপাদানের অপূর্ব মেলবন্ধন।
          </p>
        </div>

        {/* Interactive Steps Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                activeStep === idx
                  ? "bg-doibrand-dark text-white border-doibrand-dark shadow-md"
                  : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200/80"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-bold font-sans px-2 py-0.5 rounded-md ${
                    activeStep === idx
                      ? "bg-doibrand-gold text-white"
                      : "bg-stone-200 text-stone-600"
                  }`}
                >
                  ধাপ {step.stepNumber}
                </span>
                {activeStep === idx && (
                  <CheckCircle2 className="w-4 h-4 text-doibrand-gold" />
                )}
              </div>
              <h4 className="font-bold text-xs sm:text-sm line-clamp-1">
                {step.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Selected Step Feature Box */}
        <div className="bg-stone-50/80 rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left Column: Visual Image */}
          <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-stone-200 shrink-0">
            <Image
              src={STEPS[activeStep].image}
              alt={STEPS[activeStep].title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-doibrand-dark/85 backdrop-blur-xs text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20">
              {STEPS[activeStep].highlight}
            </div>
          </div>

          {/* Right Column: Step Narrative */}
          <div className="w-full lg:w-1/2 space-y-4 text-left">
            <span className="text-doibrand-gold font-bold text-xs uppercase tracking-wider block font-sans">
              STEP {STEPS[activeStep].stepNumber} • {STEPS[activeStep].subtitle}
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-doibrand-dark">
              {STEPS[activeStep].title}
            </h3>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {STEPS[activeStep].description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-doibrand-dark text-white font-bold text-sm hover:bg-doibrand-gold transition-colors shadow-sm"
              >
                <span>আসল স্বাদের স্বাদ নিন</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="text-xs sm:text-sm font-semibold text-doibrand-accent hover:underline"
              >
                আমাদের সম্পর্কে আরও জানুন →
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Stats Counter Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-stone-200/80 text-center">
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark font-sans">
              ২৫+
            </div>
            <p className="text-xs text-gray-500 mt-1">বছরের ঐতিহ্যবাহী কারিগরি</p>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-doibrand-gold font-sans">
              ৫০,০০০+
            </div>
            <p className="text-xs text-gray-500 mt-1">তৃপ্ত পরিবারে সফল ডেলিভারি</p>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-doibrand-dark font-sans">
              ১০০%
            </div>
            <p className="text-xs text-gray-500 mt-1">খাঁটি গরুর দুধের নিশ্চয়তা</p>
          </div>
          <div className="p-3">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-sans">
              ৪.৯ / ৫
            </div>
            <p className="text-xs text-gray-500 mt-1">গড় কাস্টমার রেটিং রিভিউ</p>
          </div>
        </div>

      </div>
    </section>
  );
}
