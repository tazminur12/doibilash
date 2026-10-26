"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, MessageCircleQuestion, Headset, ArrowRight, ChevronRight } from "lucide-react";
import { FAQS } from "@/data/faqs";

const HOME_FAQS = FAQS.filter((f) => f.featured);

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBnNumber = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export default function HomeFaqSection() {
  const [openId, setOpenId] = useState<string | null>(HOME_FAQS[0]?.id ?? null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full font-bengali pb-14 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
        {/* Intro Panel */}
        <div className="lg:sticky lg:top-40">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-doibrand-gold/30 bg-white/70 px-3 py-1 text-[11px] font-semibold text-doibrand-accent shadow-[0_4px_12px_-8px_rgba(169,94,53,0.6)]">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-doibrand-gold" />
            সচরাচর জিজ্ঞাসা ও উত্তর
          </span>
          <h2 className="mt-3 text-2xl sm:text-[34px] font-extrabold tracking-tight leading-tight text-doibrand-dark">
            সাধারণ{" "}
            <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
              জিজ্ঞাসা
            </span>{" "}
            <span className="text-doibrand-dark/40">(FAQ)</span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed">
            দই বিলাসের পণ্য ও সেবা সম্পর্কে গ্রাহকদের প্রায়শই জিজ্ঞাসিত প্রশ্নের উত্তর
          </p>

          {/* Help Card */}
          <div className="relative mt-6 overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_18px_44px_-28px_rgba(169,94,53,0.55)] p-5 sm:p-6">
            <div className="pointer-events-none absolute -top-16 -right-12 w-48 h-48 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
            <div className="relative flex items-start gap-3.5">
              <span className="shrink-0 w-12 h-12 grid place-items-center rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)]">
                <Headset className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-doibrand-dark">আরও প্রশ্ন আছে?</h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-500">
                  আপনার উত্তর খুঁজে না পেলে সরাসরি আমাদের টিমের সাথে যোগাযোগ করুন।
                </p>
              </div>
            </div>
            <div className="relative mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 rounded-full bg-doibrand-dark px-4 py-2.5 text-xs font-bold text-doibrand-light shadow-[0_10px_22px_-12px_rgba(53,28,27,0.8)] hover:bg-doibrand-accent transition-colors"
              >
                যোগাযোগ করুন
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-4 py-2.5 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-white transition"
              >
                সব প্রশ্ন দেখুন
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div
                key={faq.id}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "bg-white ring-1 ring-doibrand-gold/40 shadow-[0_18px_40px_-26px_rgba(169,94,53,0.6)]"
                    : "bg-white/60 ring-1 ring-stone-200/70 hover:bg-white hover:ring-doibrand-gold/30"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-doibrand-gold to-doibrand-accent transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                <button
                  type="button"
                  id={buttonId}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span
                    className={`shrink-0 text-sm font-extrabold tabular-nums transition-colors ${
                      isOpen ? "text-doibrand-gold" : "text-stone-300"
                    }`}
                  >
                    {toBnNumber(idx + 1)}
                  </span>
                  <span className="flex-1 text-sm sm:text-[15px] font-bold leading-snug text-doibrand-dark">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 grid place-items-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white shadow-[0_6px_14px_-6px_rgba(169,94,53,0.8)]"
                        : "bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/25"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-[3.25rem] sm:pl-[3.75rem] pr-5 sm:pr-16 pb-5 text-xs sm:text-sm leading-relaxed text-stone-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
