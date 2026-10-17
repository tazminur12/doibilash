"use client";

import React from "react";
import { ShieldCheck, Sparkles, Award, Truck } from "lucide-react";

interface UspItem {
  icon: React.ElementType;
  titleBn: string;
  titleEn: string;
  description: string;
  badge: string;
}

const USP_LIST: UspItem[] = [
  {
    icon: Award,
    titleBn: "১০০% খাঁটি গরুর দুধ",
    titleEn: "100% Pure Dairy Milk",
    description: "কোনো গুঁড়ো দুধ বা কৃত্রিম উপাদান নেই, স্থানীয় খামারের টাটকা ঘন দুধ।",
    badge: "প্রাকৃতিক",
  },
  {
    icon: Sparkles,
    titleBn: "বগুড়ার পোড়ামাটির সরা",
    titleEn: "Heritage Clay Fermentation",
    description: "ঐতিহ্যবাহী পোড়ামাটির পাত্রে প্রাকৃতিক প্রক্রিয়ায় ঘন সরের আসল স্বাদ।",
    badge: "আসল বগুড়া",
  },
  {
    icon: ShieldCheck,
    titleBn: "প্রিজারভেটিভ ও কেমিক্যালমুক্ত",
    titleEn: "Zero Artificial Chemicals",
    description: "স্বাস্থ্যসম্মত উপায়ে তৈরি, শিশুর জন্য সম্পূর্ণ নিরাপদ ও পুষ্টিকর।",
    badge: "স্বাস্থ্যসম্মত",
  },
  {
    icon: Truck,
    titleBn: "কোল্ড-চেইন এক্সপ্রেস ডেলিভারি",
    titleEn: "Temperature Controlled Delivery",
    description: "মাটির সরা অক্ষত ও শীতল রেখে দ্রুততম সময়ে আপনার ঘরে পৌঁছে দেওয়া।",
    badge: "নিরাপদ প্যাকেজিং",
  },
];

export default function TrustUspStrip() {
  return (
    <section className="w-full bg-white border-y border-stone-200/80 py-8 font-bengali">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {USP_LIST.map((usp, idx) => {
            const Icon = usp.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/70 hover:bg-stone-50 border border-stone-100 hover:border-doibrand-gold/30 hover:shadow-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-doibrand-light text-doibrand-gold flex items-center justify-center shrink-0 border border-doibrand-gold/20 group-hover:scale-105 group-hover:bg-doibrand-gold group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-doibrand-dark text-base leading-tight">
                      {usp.titleBn}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    {usp.description}
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-doibrand-accent bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                    {usp.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
