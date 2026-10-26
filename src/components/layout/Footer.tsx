"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Send,
  ChevronRight,
  Award,
  Wallet,
  Snowflake,
  ShieldCheck,
  BellRing,
} from "lucide-react";

const PAYMENT_LOGO_DIR = "/Payment%20Gateway_Bank-LOGO";

const PAYMENT_LOGOS = [
  { name: "bKash", src: `${PAYMENT_LOGO_DIR}/BKash-bKash-Logo.svg` },
  { name: "Nagad", src: `${PAYMENT_LOGO_DIR}/Nagad-Logo.wine.svg` },
  { name: "Visa", src: `${PAYMENT_LOGO_DIR}/Visa_Inc.-Logo.wine.svg` },
  { name: "Mastercard", src: `${PAYMENT_LOGO_DIR}/Mastercard-Logo.wine.svg` },
  { name: "American Express", src: `${PAYMENT_LOGO_DIR}/American_Express-Logo.wine.svg` },
];

const QUICK_LINKS = [
  { name: "আমাদের সম্পর্কে", englishName: "About Us", href: "/about" },
  { name: "সকল পণ্য", englishName: "All Products", href: "/shop" },
  { name: "স্পেশাল অফার", englishName: "Special Offers", href: "/offers" },
  { name: "গোপনীয়তা নীতি", englishName: "Privacy Policy", href: "/privacy-policy" },
  { name: "শর্তাবলী", englishName: "Terms & Conditions", href: "/terms" },
];

const SERVICE_LINKS = [
  { name: "অর্ডার ট্র্যাক করুন", englishName: "Track Order", href: "/track-order" },
  { name: "রিটার্ন পলিসি", englishName: "Return Policy", href: "/return-policy" },
  { name: "সাধারণ জিজ্ঞাসা", englishName: "FAQ", href: "/faq" },
  { name: "যোগাযোগ", englishName: "Contact Us", href: "/contact" },
  { name: "ডেলিভারি তথ্য", englishName: "Delivery Info", href: "/delivery" },
];

const PROMISES = [
  { icon: Award, title: "১০০% খাঁটি উপাদান", text: "প্রিজারভেটিভ ও কেমিক্যালমুক্ত" },
  { icon: Wallet, title: "ক্যাশ অন ডেলিভারি", text: "পণ্য হাতে পেয়ে মূল্য পরিশোধ" },
  { icon: Snowflake, title: "কোল্ড-চেইন ডেলিভারি", text: "শীতল ও অক্ষত অবস্থায় পৌঁছে দেওয়া" },
  { icon: ShieldCheck, title: "নিরাপদ পেমেন্ট", text: "বিকাশ, নগদ ও কার্ড পেমেন্ট" },
];

const CONTACT_ITEMS = [
  { icon: MapPin, text: "বনানী, ঢাকা - ১২১৩, বাংলাদেশ" },
  { icon: Phone, text: "01645-460095", href: "tel:+8801645460095", sans: true },
  { icon: Mail, text: "support@doibilash.com", href: "mailto:support@doibilash.com", sans: true },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61565074421968",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/doibilash",
    icon: (
      <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-bengali text-base font-bold text-doibrand-dark flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold" />
      {children}
    </h3>
  );
}

function FooterLinks({ links }: { links: typeof QUICK_LINKS }) {
  return (
    <ul className="mt-5 space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="group inline-flex items-center gap-1.5 font-bengali text-sm text-stone-600 transition-colors hover:text-doibrand-accent">
            <ChevronRight className="w-3.5 h-3.5 -ml-1 text-doibrand-gold opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0" />
            <span className="-ml-2.5 transition-transform duration-200 group-hover:translate-x-2.5">
              {link.name}
              <span className="ml-1.5 text-[11px] text-stone-400 font-sans">{link.englishName}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname === "/orders" ||
    pathname === "/categories" ||
    pathname === "/customers" ||
    pathname === "/products" ||
    pathname === "/settings";
  if (isAdminRoute) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="w-full mt-auto font-bengali">
      {/* Top Section */}
      <div className="relative bg-[#fcfbf9] border-t border-stone-200/70 text-stone-700">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
          {/* Newsletter Card */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_20px_50px_-32px_rgba(169,94,53,0.6)] p-5 sm:p-8">
            <div className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-[#F2C9A0]/40 blur-3xl" />
            <BellRing className="pointer-events-none absolute -left-6 -bottom-8 w-36 h-36 text-doibrand-gold/10 -rotate-12" strokeWidth={1.25} />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-10">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-doibrand-dark">
                  অফারের{" "}
                  <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
                    আপডেট পান
                  </span>
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-stone-500 leading-relaxed max-w-lg">
                  নতুন মিষ্টান্ন, আকর্ষণীয় ডিসকাউন্ট এবং এক্সক্লুসিভ অফারের খবর সবার আগে পেতে সাবস্ক্রাইব করুন।
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="w-full lg:w-[440px]">
                <div className="flex items-center rounded-full bg-white p-1.5 ring-1 ring-doibrand-gold/25 shadow-[0_10px_26px_-18px_rgba(169,94,53,0.7)] transition focus-within:ring-2 focus-within:ring-doibrand-gold/60">
                  <Mail className="ml-3 w-4 h-4 shrink-0 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল দিন"
                    aria-label="Email address"
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-doibrand-dark placeholder-stone-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_8px_18px_-10px_rgba(169,94,53,0.9)] hover:brightness-110 active:scale-95 transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    সাবস্ক্রাইব
                  </button>
                </div>
                {subscribed && (
                  <p className="mt-2.5 ml-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700 animate-header-fade-up">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Main Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 py-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <span className="relative shrink-0 rounded-full p-[1.5px] bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_4px_14px_-4px_rgba(196,138,78,0.6)] transition-transform duration-500 group-hover:rotate-[8deg]">
                  <span className="relative block w-12 h-12 rounded-full bg-white">
                    <Image src="/Logo/logo.png" alt="দই বিলাস লোগো" fill sizes="48px" className="object-contain p-1" />
                  </span>
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-[26px] font-bold tracking-tight text-doibrand-dark">দই বিলাস</span>
                  <span className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-doibrand-gold">
                    <span className="w-3 h-px bg-doibrand-gold/60" />
                    Heritage Sweets
                  </span>
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-relaxed text-stone-600">
                ঐতিহ্যবাহী বগুড়ার আসল স্বাদ ও স্বাস্থ্যসম্মত খাঁটি মিষ্টান্ন সরাসরি আপনার দোরগোড়ায়। শতভাগ বিশুদ্ধতা ও প্রিমিয়াম কোয়ালিটির নিশ্চয়তা।
              </p>

              <ul className="mt-5 space-y-2.5">
                {CONTACT_ITEMS.map(({ icon: Icon, text, href, sans }) => {
                  const inner = (
                    <>
                      <span className="shrink-0 w-8 h-8 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 shadow-sm transition-colors group-hover:bg-doibrand-gold group-hover:text-white">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className={`text-[13px] text-stone-600 transition-colors group-hover:text-doibrand-accent ${sans ? "font-sans" : ""}`}>
                        {text}
                      </span>
                    </>
                  );
                  return (
                    <li key={text}>
                      {href ? (
                        <a href={href} className="group inline-flex items-center gap-3">
                          {inner}
                        </a>
                      ) : (
                        <span className="group inline-flex items-center gap-3">{inner}</span>
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex items-center gap-2.5">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 grid place-items-center rounded-full bg-white text-doibrand-accent ring-1 ring-doibrand-gold/25 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-linear-to-br hover:from-doibrand-accent hover:to-doibrand-gold hover:text-white hover:ring-transparent hover:shadow-[0_8px_18px_-8px_rgba(169,94,53,0.8)]"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1 lg:col-span-2">
              <FooterHeading>গুরুত্বপূর্ণ লিংক</FooterHeading>
              <FooterLinks links={QUICK_LINKS} />
            </div>

            {/* Customer Service */}
            <div className="col-span-1 lg:col-span-3 lg:pl-4">
              <FooterHeading>কাস্টমার সার্ভিস</FooterHeading>
              <FooterLinks links={SERVICE_LINKS} />
            </div>

            {/* Promises */}
            <div className="col-span-2 lg:col-span-3">
              <FooterHeading>আমাদের প্রতিশ্রুতি</FooterHeading>
              <ul className="mt-5 grid grid-cols-2 lg:grid-cols-1 gap-3">
                {PROMISES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3 rounded-2xl bg-white/70 p-3 ring-1 ring-stone-200/70">
                    <span className="shrink-0 w-9 h-9 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent ring-1 ring-white">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-bold text-doibrand-dark leading-tight">{title}</span>
                      <span className="mt-0.5 block text-[11px] text-stone-500 leading-snug">{text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Copyright & Payments) */}
      <div className="relative w-full bg-doibrand-dark text-white/80 pt-5 pb-[calc(1.25rem+4rem+env(safe-area-inset-bottom))] md:pb-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-stone-300">
              © <span className="font-sans">2026</span> <span className="font-semibold text-doibrand-gold">দই বিলাস</span>। সর্বস্বত্ব সংরক্ষিত।
            </p>
            <span className="hidden sm:block w-px h-3.5 bg-white/15" />
            <div className="flex items-center gap-4 text-xs text-stone-400">
              <Link href="/privacy-policy" className="hover:text-doibrand-gold transition-colors">
                গোপনীয়তা নীতি
              </Link>
              <Link href="/terms" className="hover:text-doibrand-gold transition-colors">
                শর্তাবলী
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-[11px] text-stone-400">নিরাপদ পেমেন্ট</span>
            <ul className="flex flex-wrap items-center justify-center gap-1.5">
              {PAYMENT_LOGOS.map((logo) => (
                <li
                  key={logo.name}
                  title={logo.name}
                  className="relative h-8 w-14 rounded-md bg-white ring-1 ring-white/10 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  <Image src={logo.src} alt={logo.name} fill sizes="56px" className="object-contain p-0.5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
