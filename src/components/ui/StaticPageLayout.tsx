import React from "react";
import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";

export interface StaticPageLayoutProps {
  /** Breadcrumb label shown after "হোম >" */
  breadcrumb: string;
  /** Large hero title (Bengali or mixed) */
  title: string;
  /** Optional badge / eye-catch above the title */
  badge?: string;
  /** Short subtitle / description under the title */
  subtitle?: string;
  /** Optional Lucide icon rendered in the hero */
  Icon?: LucideIcon;
  /** Main page content */
  children: React.ReactNode;
}

/**
 * StaticPageLayout
 * ─────────────────
 * Reusable shell for FAQ, About Us, Privacy Policy and any other
 * static marketing page in the Doi Bilash shop.
 *
 * Usage:
 *   <StaticPageLayout title="সচরাচর জিজ্ঞাসিত প্রশ্ন" breadcrumb="FAQ" Icon={HelpCircle}>
 *     <YourContent />
 *   </StaticPageLayout>
 */
export default function StaticPageLayout({
  breadcrumb,
  title,
  badge,
  subtitle,
  Icon,
  children,
}: StaticPageLayoutProps) {
  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark">

      {/* ── Hero / Header ─────────────────────────────────────────────── */}
      <section className="bg-doibrand-light py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">

          {/* Breadcrumb */}
          <nav
            aria-label="breadcrumb"
            className="flex items-center justify-center gap-2 text-xs text-gray-500 font-bengali mb-6"
          >
            <Link href="/" className="hover:text-doibrand-gold transition-colors">
              হোম
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-doibrand-dark font-semibold">{breadcrumb}</span>
          </nav>

          {/* Optional icon orb */}
          {Icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5">
              <Icon className="w-8 h-8 text-doibrand-gold" />
            </div>
          )}

          {/* Optional badge */}
          {badge && (
            <span className="inline-block text-xs font-semibold font-bengali uppercase tracking-widest text-doibrand-gold bg-doibrand-gold/10 border border-doibrand-gold/20 px-4 py-1.5 rounded-full mb-4">
              {badge}
            </span>
          )}

          {/* Title */}
          <h1 className="font-bengali text-4xl font-bold text-doibrand-dark leading-tight mb-3">
            {title}
          </h1>

          {/* Divider accent */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-12 h-0.5 bg-doibrand-gold/30 rounded-full" />
            <span className="w-2.5 h-2.5 rounded-full bg-doibrand-gold" />
            <span className="w-12 h-0.5 bg-doibrand-gold/30 rounded-full" />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm md:text-base text-gray-500 font-bengali max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {children}
      </div>
    </main>
  );
}

/* ─── Prose wrapper helper ────────────────────────────────────────────────────
 * Use <ProseContent> for rich text pages (About Us, Privacy Policy, Terms).
 * The prose-* modifiers are pre-configured with doibrand brand tokens in
 * globals.css, so headings / links / bullets all match the palette.
 * ──────────────────────────────────────────────────────────────────────────── */
export function ProseContent({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "prose prose-lg max-w-none",
        "text-gray-700",
        "prose-headings:text-doibrand-dark",
        "prose-headings:font-bengali",
        "prose-headings:font-bold",
        "prose-a:text-doibrand-gold prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-doibrand-dark",
        "prose-li:marker:text-doibrand-gold",
        "prose-blockquote:border-l-doibrand-gold prose-blockquote:text-doibrand-dark",
        "prose-hr:border-gray-200",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
