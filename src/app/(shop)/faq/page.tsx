"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { HelpCircle, Plus, MessageCircle, PhoneCall, Mail, Search, X, SearchX, Headset } from "lucide-react";
import StaticPageLayout from "@/components/ui/StaticPageLayout";
import { FAQS, FAQ_CATEGORIES, type FaqCategory } from "@/data/faqs";
import { toBnDigits } from "@/lib/bangla";

type Filter = "all" | FaqCategory;

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const visibleFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (filter === "all" || f.category === filter) &&
        (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
    );
  }, [filter, query]);

  const countFor = (cat: Filter) => (cat === "all" ? FAQS.length : FAQS.filter((f) => f.category === cat).length);

  return (
    <StaticPageLayout
      breadcrumb="সাধারণ জিজ্ঞাসা"
      title="সচরাচর জিজ্ঞাসিত"
      highlight="প্রশ্ন"
      badge="সহায়তা কেন্দ্র"
      subtitle="দই বিলাস সম্পর্কে সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের উত্তর এখানে পাবেন। আপনার প্রশ্ন এখানে না থাকলে সরাসরি আমাদের সাথে যোগাযোগ করুন।"
      Icon={HelpCircle}
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-doibrand-gold pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="প্রশ্ন খুঁজুন… (যেমন: ডেলিভারি, রিফান্ড)"
          aria-label="Search questions"
          className="w-full rounded-2xl bg-white pl-14 pr-12 py-4 text-sm ring-1 ring-stone-200 shadow-[0_14px_34px_-26px_rgba(53,28,27,0.45)] outline-none transition focus:ring-2 focus:ring-doibrand-gold/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-doibrand-dark hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 mt-4 flex gap-2 overflow-x-auto hide-scrollbar">
        {(["all", ...FAQ_CATEGORIES] as Filter[]).map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
                active
                  ? cat === "all"
                    ? "bg-doibrand-dark text-doibrand-light shadow-[0_8px_18px_-10px_rgba(53,28,27,0.8)]"
                    : "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-[0_8px_18px_-10px_rgba(169,94,53,0.9)]"
                  : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
              }`}
            >
              {cat === "all" ? "সকল প্রশ্ন" : cat}
              <span className={`text-[10px] ${active ? "text-white/75" : "text-stone-400"}`}>{toBnDigits(countFor(cat))}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion */}
      <div className="mt-6 space-y-3">
        {visibleFaqs.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200/70">
            <span className="mx-auto w-14 h-14 grid place-items-center rounded-full bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-8 ring-[#FBF1E4]">
              <SearchX className="w-6 h-6" />
            </span>
            <p className="mt-5 text-base font-bold">কোনো প্রশ্ন পাওয়া যায়নি</p>
            <p className="mt-1 text-xs text-stone-500">অন্য শব্দ দিয়ে খুঁজুন অথবা সরাসরি আমাদের জিজ্ঞাসা করুন।</p>
          </div>
        ) : (
          visibleFaqs.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isOpen
                    ? "bg-white ring-1 ring-doibrand-gold/40 shadow-[0_18px_40px_-26px_rgba(169,94,53,0.6)]"
                    : "bg-white/70 ring-1 ring-stone-200/70 hover:bg-white hover:ring-doibrand-gold/30"
                }`}
              >
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-doibrand-gold to-doibrand-accent transition-opacity ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />
                <button
                  id={`faq-btn-${item.id}`}
                  type="button"
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  className="w-full flex items-center gap-4 p-4 sm:p-5 text-left cursor-pointer"
                >
                  <span className={`shrink-0 text-sm font-extrabold tabular-nums ${isOpen ? "text-doibrand-gold" : "text-stone-300"}`}>
                    {toBnDigits(String(idx + 1).padStart(2, "0"))}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm sm:text-[15px] font-bold leading-snug">{item.question}</span>
                    <span className="mt-1 inline-block rounded-full bg-[#FBF1E4] px-2 py-0.5 text-[10px] font-semibold text-doibrand-accent">
                      {item.category}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 grid place-items-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-linear-to-br from-doibrand-accent to-doibrand-gold text-white"
                        : "bg-[#FBF1E4] text-doibrand-accent ring-1 ring-doibrand-gold/25"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <div
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${item.id}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pl-[3.25rem] sm:pl-[3.75rem] pr-5 sm:pr-16 pb-5 text-sm leading-relaxed text-stone-600">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Contact CTA */}
      <div className="relative mt-10 overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-6 sm:p-8 ring-1 ring-doibrand-gold/20">
        <Headset className="pointer-events-none absolute -right-6 -bottom-8 w-40 h-40 text-doibrand-gold/10" strokeWidth={1.25} />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold">
              আরও প্রশ্ন{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                আছে?
              </span>
            </h2>
            <p className="mt-1 text-sm text-stone-600">আমাদের সাপোর্ট টিম সাহায্য করতে সদা প্রস্তুত।</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:w-[520px]">
            {[
              { icon: PhoneCall, label: "কল করুন", value: "01645-460095", href: "tel:+8801645460095" },
              { icon: MessageCircle, label: "WhatsApp", value: "মেসেজ করুন", href: "https://wa.me/8801645460095", external: true },
              { icon: Mail, label: "ইমেইল", value: "support@doibilash.com", href: "mailto:support@doibilash.com" },
            ].map(({ icon: Icon, label, value, href, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-3 rounded-2xl bg-white/85 p-3 ring-1 ring-white shadow-sm hover:bg-white transition"
              >
                <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] text-stone-500">{label}</span>
                  <span className="block truncate text-xs font-bold font-sans group-hover:text-doibrand-accent">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <p className="relative mt-5 text-xs text-stone-500">
          কর্পোরেট বা বাল্ক অর্ডারের জন্য{" "}
          <Link href="/contact" className="font-semibold text-doibrand-accent hover:underline">
            কর্পোরেট যোগাযোগ পেজ
          </Link>{" "}
          দেখুন।
        </p>
      </div>
    </StaticPageLayout>
  );
}
