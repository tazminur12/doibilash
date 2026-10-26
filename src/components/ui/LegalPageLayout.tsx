"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, FileText, Mail, type LucideIcon } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LegalPageLayoutProps {
  breadcrumb: string;
  badge: string;
  BadgeIcon: LucideIcon;
  title: string;
  highlight: string;
  subtitle: string;
  pills: { icon: LucideIcon; text: string }[];
  sections: LegalSection[];
  tocTitle: string;
  support: { title: string; text: string; email: string };
  children: React.ReactNode;
}

const SCROLL_OFFSET_PX = 140;

export default function LegalPageLayout({
  breadcrumb,
  badge,
  BadgeIcon,
  title,
  highlight,
  subtitle,
  pills,
  sections,
  tocTitle,
  support,
  children,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: `-${SCROLL_OFFSET_PX}px 0px -55% 0px` }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET_PX + 20, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali pb-14 md:pb-20">
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)] px-5 py-9 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
          <BadgeIcon className="pointer-events-none absolute -right-6 -bottom-10 hidden md:block w-64 h-64 text-doibrand-gold/10" strokeWidth={1} />

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">{breadcrumb}</span>
          </nav>

          <div className="relative mt-5 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
              <BadgeIcon className="w-3.5 h-3.5" />
              {badge}
            </span>
            <h1 className="mt-4 text-3xl sm:text-[44px] font-extrabold leading-tight tracking-tight">
              {title}{" "}
              <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                {highlight}
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-stone-600">{subtitle}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {pills.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-doibrand-gold/25 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-doibrand-gold" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Mobile TOC */}
      <nav aria-label={tocTitle} className="lg:hidden sticky top-[7.25rem] z-30 mt-4 bg-doibrand-light/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex gap-2 overflow-x-auto hide-scrollbar">
          {sections.map((sec) => {
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => scrollTo(sec.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                  active
                    ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-sm"
                    : "bg-white text-stone-600 ring-1 ring-stone-200"
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
        {/* Desktop TOC */}
        <aside className="hidden lg:block sticky top-32 space-y-4">
          <nav aria-label={tocTitle} className="rounded-3xl bg-white p-4 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]">
            <h2 className="flex items-center gap-2 px-2 pb-3 mb-2 border-b border-doibrand-gold/15 text-sm font-bold">
              <FileText className="w-4 h-4 text-doibrand-gold" />
              {tocTitle}
            </h2>
            <ul className="space-y-1">
              {sections.map((sec) => {
                const Icon = sec.icon;
                const active = activeSection === sec.id;
                return (
                  <li key={sec.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(sec.id)}
                      aria-current={active ? "location" : undefined}
                      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-[13px] transition cursor-pointer ${
                        active
                          ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white font-bold shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)]"
                          : "text-stone-600 hover:bg-[#FBF1E4] hover:text-doibrand-dark"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-doibrand-gold"}`} />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] p-5 ring-1 ring-doibrand-gold/20">
            <p className="text-sm font-bold">{support.title}</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-stone-500">{support.text}</p>
            <a
              href={`mailto:${support.email}`}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-doibrand-dark py-2.5 text-xs font-bold text-doibrand-light hover:bg-doibrand-accent transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="font-sans">{support.email}</span>
            </a>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">{children}</div>
      </div>
    </main>
  );
}
