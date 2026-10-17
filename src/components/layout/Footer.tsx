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
} from "lucide-react";

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
    <footer className="w-full mt-auto">
      {/* 1. Top Section (4 Columns Grid) */}
      <div className="bg-[#fcfbf9] border-t border-stone-200/70 text-stone-700">
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/Logo/logo.png"
                  alt="দই বিলাস লোগো"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold font-bengali text-doibrand-dark tracking-tight transition-colors group-hover:text-doibrand-gold">
                দই বিলাস
              </span>
            </Link>

            <p className="font-bengali text-sm text-stone-600 leading-relaxed">
              ঐতিহ্যবাহী বগুড়ার আসল স্বাদ ও স্বাস্থ্যসম্মত খাঁটি মিষ্টান্ন সরাসরি আপনার দোরগোড়ায়। শতভাগ বিশুদ্ধতা ও প্রিমিয়াম কোয়ালিটির নিশ্চয়তা।
            </p>

            {/* Contact Details */}
            <div className="space-y-2 text-xs font-bengali text-stone-600 pt-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-doibrand-accent shrink-0 mt-0.5" />
                <span>বনানী, ঢাকা - ১২১৩, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-doibrand-accent shrink-0" />
                <span className="font-sans">+৮৮০ ১৭০০-০০০০০০</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-doibrand-accent shrink-0" />
                <span className="font-sans">support@doibilash.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-doibrand-accent hover:text-doibrand-dark hover:bg-stone-200 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-doibrand-accent hover:text-doibrand-dark hover:bg-stone-200 transition-colors"
                >
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-doibrand-accent hover:text-doibrand-dark hover:bg-stone-200 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-bengali text-lg font-semibold text-doibrand-dark relative inline-block">
              গুরুত্বপূর্ণ লিংক
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-doibrand-gold rounded-full" />
            </h3>

            <ul className="space-y-2.5 text-sm font-bengali text-stone-600 pt-1">
              <li>
                <Link
                  href="/about"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  আমাদের সম্পর্কে (About Us)
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  সকল পণ্য (All Products)
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  স্পেশাল অফার (Special Offers)
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  গোপনীয়তা নীতি (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  শর্তাবলী (Terms & Conditions)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h3 className="font-bengali text-lg font-semibold text-doibrand-dark relative inline-block">
              কাস্টমার সার্ভিস
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-doibrand-gold rounded-full" />
            </h3>

            <ul className="space-y-2.5 text-sm font-bengali text-stone-600 pt-1">
              <li>
                <Link
                  href="/track-order"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  অর্ডার ট্র্যাক করুন (Track Order)
                </Link>
              </li>
              <li>
                <Link
                  href="/return-policy"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  রিটার্ন পলিসি (Return Policy)
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  সাধারণ জিজ্ঞাসা (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  যোগাযোগ (Contact Us)
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery-info"
                  className="inline-block transition-transform duration-200 hover:translate-x-1 hover:text-doibrand-gold"
                >
                  ডেলিভারি তথ্য (Delivery Info)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-bengali text-lg font-semibold text-doibrand-dark relative inline-block">
              অফারের আপডেট পান
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-doibrand-gold rounded-full" />
            </h3>

            <p className="font-bengali text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
              নতুন মিষ্টান্ন, আকর্ষণীয় ডিসকাউন্ট এবং এক্সক্লুসিভ অফারের খবর সবার আগে পেতে সাবস্ক্রাইব করুন।
            </p>

            <form onSubmit={handleSubscribe} className="pt-1">
              <div className="flex items-stretch shadow-xs">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল দিন"
                  className="w-full px-3.5 py-2.5 rounded-l-md border border-r-0 border-stone-300 text-xs sm:text-sm font-bengali text-doibrand-dark placeholder-stone-400 focus:outline-none focus:border-doibrand-gold bg-white"
                />
                <button
                  type="submit"
                  className="bg-doibrand-gold text-white px-4 rounded-r-md text-xs sm:text-sm font-medium hover:bg-doibrand-dark transition-colors shrink-0 cursor-pointer flex items-center justify-center font-bengali"
                >
                  Subscribe
                </button>
              </div>

              {subscribed && (
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-700 font-bengali animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* 2. Bottom Section (Copyright & Payments) */}
      <div className="w-full bg-doibrand-dark text-white/80 py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright */}
          <p className="font-bengali text-xs sm:text-sm text-stone-300 text-center md:text-left">
            © 2026 দই বিলাস. সর্বস্বত্ব সংরক্ষিত।
          </p>

          {/* Right: Payment Method Placeholder Icons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* bKash */}
            <div className="bg-white p-1 rounded-md shadow-xs flex items-center justify-center px-2 py-1 min-w-[54px] h-7">
              <span className="text-[11px] font-black text-[#E2136E] tracking-tight">
                bKash
              </span>
            </div>

            {/* Nagad */}
            <div className="bg-white p-1 rounded-md shadow-xs flex items-center justify-center px-2 py-1 min-w-[54px] h-7">
              <span className="text-[11px] font-black text-[#F7931E] tracking-tight">
                Nagad
              </span>
            </div>

            {/* Visa */}
            <div className="bg-white p-1 rounded-md shadow-xs flex items-center justify-center px-2 py-1 min-w-[54px] h-7">
              <span className="text-[11px] font-black text-[#1A1F71] italic tracking-wider">
                VISA
              </span>
            </div>

            {/* Mastercard */}
            <div className="bg-white p-1 rounded-md shadow-xs flex items-center justify-center px-2 py-1 min-w-[54px] h-7">
              <div className="flex items-center -space-x-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] opacity-90" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
