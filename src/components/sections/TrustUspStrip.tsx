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
    description: "কোনো গুঁড়ো দুধ বা কৃত্রিম উপাদান নেই, স্থানীয় খামারের টাটকা ঘন দুধ।",
    badge: "প্রাকৃতিক",
  },
  {
    icon: Sparkles,
    titleBn: "বগুড়ার পোড়ামাটির সরা",
    titleEn: "Heritage Clay Fermentation",
    description: "ঐতিহ্যবাহী পোড়ামাটির পাত্রে প্রাকৃতিক প্রক্রিয়ায় ঘন সরের আসল স্বাদ।",
    badge: "আসল বগুড়া",
  },
  {
    icon: ShieldCheck,
    titleBn: "প্রিজারভেটিভ ও কেমিক্যালমুক্ত",
    titleEn: "Zero Artificial Chemicals",
    description: "স্বাস্থ্যসম্মত উপায়ে তৈরি, শিশুর জন্য সম্পূর্ণ নিরাপদ ও পুষ্টিকর।",
    badge: "স্বাস্থ্যসম্মত",
  },
  {
    icon: Truck,
    titleBn: "কোল্ড-চেইন এক্সপ্রেস ডেলিভারি",
    titleEn: "Temperature Controlled Delivery",
    description: "মাটির সরা অক্ষত ও শীতল রেখে দ্রুততম সময়ে আপনার ঘরে পৌঁছে দেওয়া।",
    badge: "নিরাপদ প্যাকেজিং",
  },
];

export default function TrustUspStrip() {
  return (
    <section className="w-full font-bengali px-4 sm:px-6 lg:px-8 pt-5 md:pt-0 pb-10 md:pb-12">
      <div className="relative max-w-7xl mx-auto overflow-hidden rounded-2xl bg-linear-to-br from-[#FFF6E9] via-[#FFFDF9] to-[#F8E7CF] ring-1 ring-doibrand-gold/20 shadow-[0_14px_36px_-22px_rgba(169,94,53,0.45)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
        <div className="pointer-events-none absolute -top-16 right-1/4 w-64 h-32 rounded-full bg-[#F3D7AE]/40 blur-3xl" />

        <div className="relative grid grid-cols-2 lg:grid-cols-4">
          {USP_LIST.map((usp, idx) => {
            const Icon = usp.icon;
            const borders = [
              idx % 2 === 0 ? "border-r" : "",
              idx < 2 ? "border-b lg:border-b-0" : "",
              idx === 1 ? "lg:border-r" : "",
              idx === 2 ? "lg:border-r" : "",
            ].join(" ");
            return (
              <div
                key={usp.titleEn}
                title={usp.titleEn}
                className={`group relative flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4 lg:px-5 border-doibrand-gold/15 transition-colors duration-300 hover:bg-white/60 ${borders}`}
              >
                <span className="shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] sm:text-sm font-bold leading-snug text-doibrand-dark">
                    {usp.titleBn}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs leading-relaxed text-stone-500 line-clamp-2">
                    {usp.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
