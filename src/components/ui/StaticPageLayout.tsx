import React from "react";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

export interface StaticPageLayoutProps {
  /** Breadcrumb label shown after "হোম >" */
  breadcrumb: string;
  /** Large hero title (Bengali or mixed) */
  title: string;
  /** Optional trailing part of the title rendered in the brand gradient */
  highlight?: string;
  /** Optional badge / eye-catch above the title */
  badge?: string;
  /** Short subtitle / description under the title */
  subtitle?: string;
  /** Optional Lucide icon rendered in the hero */
  Icon?: LucideIcon;
  /** Optional chips rendered under the subtitle */
  pills?: { icon: LucideIcon; text: string }[];
  /** Main page content */
  children: React.ReactNode;
}

/**
 * Reusable premium shell for static pages (FAQ, delivery, return policy …).
 */
export default function StaticPageLayout({
  breadcrumb,
  title,
  highlight,
  badge,
  subtitle,
  Icon,
  pills,
  children,
}: StaticPageLayoutProps) {
  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali pb-14 md:pb-20">
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_24px_60px_-34px_rgba(169,94,53,0.6)] px-5 py-9 sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
          {Icon && (
            <Icon className="pointer-events-none absolute -right-6 -bottom-10 hidden md:block w-64 h-64 text-doibrand-gold/10" strokeWidth={1} />
          )}

          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/" className="hover:text-doibrand-accent transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">{breadcrumb}</span>
          </nav>

          <div className="relative mt-5 max-w-3xl">
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-3 py-1 text-[11px] font-bold text-white shadow-[0_6px_16px_-8px_rgba(169,94,53,0.8)]">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {badge}
              </span>
            )}
            <h1 className="mt-4 text-3xl sm:text-[44px] font-extrabold leading-tight tracking-tight">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </>
              )}
            </h1>
            {subtitle && <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-stone-600">{subtitle}</p>}
            {pills && pills.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {pills.map(({ icon: PillIcon, text }) => (
                  <li
                    key={text}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold ring-1 ring-doibrand-gold/25 shadow-sm"
                  >
                    <PillIcon className="w-3.5 h-3.5 text-doibrand-gold" />
                    {text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">{children}</div>
    </main>
  );
}

/** Premium white card with an icon heading, used to structure policy content. */
export function PolicyCard({
  icon: CardIcon,
  eyebrow,
  title,
  children,
  id,
}: {
  icon: LucideIcon;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-36 rounded-3xl bg-white p-6 sm:p-8 ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]"
    >
      <div className="flex items-center gap-3 mb-5">
        <span className="w-11 h-11 shrink-0 grid place-items-center rounded-2xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white shadow-[0_6px_14px_-8px_rgba(169,94,53,0.6)]">
          <CardIcon className="w-5 h-5" />
        </span>
        <div>
          {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-doibrand-gold">{eyebrow}</p>}
          <h2 className="text-lg sm:text-xl font-bold">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ─── Prose wrapper helper ────────────────────────────────────────────────────
 * Use <ProseContent> for rich text blocks. The prose-* modifiers are
 * pre-configured with doibrand brand tokens in globals.css.
 * ──────────────────────────────────────────────────────────────────────────── */
export function ProseContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "prose max-w-none text-stone-600",
        "prose-headings:text-doibrand-dark prose-headings:font-bengali prose-headings:font-bold",
        "prose-a:text-doibrand-accent prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-doibrand-dark",
        "prose-li:marker:text-doibrand-gold",
        "prose-blockquote:border-l-doibrand-gold prose-blockquote:bg-[#FFF9F1] prose-blockquote:rounded-r-2xl prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-doibrand-dark",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
