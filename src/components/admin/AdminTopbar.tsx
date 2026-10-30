"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  Plus,
  ExternalLink,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Command,
  X,
  Store,
} from "lucide-react";

interface AdminTopbarProps {
  onToggleMobileSidebar?: () => void;
}

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "এডমিন ড্যাশবোর্ড", subtitle: "এক নজরে সামগ্রিক বিক্রয় ও অর্ডার মেট্রিক্স" },
  "/admin/orders": { title: "অর্ডার ব্যবস্থাপনা", subtitle: "সকল অর্ডার পর্যালোচনা ও ডেলিভারি ট্র্যাকিং" },
  "/admin/orders/new": { title: "ম্যানুয়াল অর্ডার তৈরি", subtitle: "গ্রাহকের জন্য সরাসরি নতুন অর্ডার প্লেসমেন্ট" },
  "/admin/products": { title: "পণ্য তালিকা ও ইনভেন্টরি", subtitle: "মিষ্টি ও দইয়ের ক্যাটালগ ও মূল্য নির্ধারণ" },
  "/admin/products/new": { title: "নতুন পণ্য যুক্তকরণ", subtitle: "ক্যাটালগে নতুন প্রডাক্ট ও ছবি আপলোড" },
  "/admin/categories": { title: "ক্যাটাগরি ম্যানেজমেন্ট", subtitle: "দই, মিষ্টি ও লাড্ডুর বিভাগসমূহ" },
  "/admin/categories/new": { title: "নতুন ক্যাটাগরি তৈরি", subtitle: "নতুন খাদ্য বিভাগ ও মেটা বিবরণ" },
  "/admin/customers": { title: "গ্রাহকবৃন্দ ও সিআরএম", subtitle: "গ্রাহক ডাটাবেজ, টিয়ার ও লয়ালটি হিস্ট্রি" },
  "/admin/customers/new": { title: "নতুন গ্রাহক যুক্তকরণ", subtitle: "ম্যানুয়ালি নতুন গ্রাহক প্রোফাইল তৈরি" },
  "/admin/packages": { title: "উপহার ও উৎসব সম্ভার", subtitle: "ঈদ, বৈশাখ ও কর্পোরেট গিফট প্যাকেজ ব্যবস্থাপনা" },
  "/admin/packages/new": { title: "নতুন উপহার প্যাকেজ তৈরি", subtitle: "লাক্সারি গিফট বক্স, আইটেম ও উৎসব অফার কনফিগারেশন" },
  "/admin/corporate": { title: "কর্পোরেট ও বাল্ক অর্ডার", subtitle: "প্রাতিষ্ঠানিক বিটুবি কোটেশন ও বাল্ক সাপ্লাই চেইন" },
  "/admin/corporate/new": { title: "নতুন কর্পোরেট কোটেশন", subtitle: "কোম্পানি ও ইভেন্টের জন্য বাল্ক প্রাইসিং ও এগ্রিমেন্ট" },
  "/admin/team": { title: "টিম মেম্বার ও রোলস", subtitle: "সুপার অ্যাডমিন, ম্যানেজার, মডারেটর ও স্টাফ ম্যানেজমেন্ট" },
  "/admin/settings": { title: "স্টোর সেটিংস ও কনফিগারেশন", subtitle: "পেমেন্ট গেটওয়ে, ডেলিভারি ও ব্র্যান্ড সেটিংস" },
};

export default function AdminTopbar({ onToggleMobileSidebar }: AdminTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.getElementById("admin-global-search") as HTMLInputElement;
        input?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Determine current page header
  const matchedRoute =
    ROUTE_TITLES[pathname] ||
    (pathname.startsWith("/admin/orders/")
      ? { title: "অর্ডার ডিটেইলস ও চালান", subtitle: "অর্ডারের পূর্ণাঙ্গ বিবরণ ও রসিদ" }
      : pathname.startsWith("/admin/customers/")
      ? { title: "গ্রাহক প্রোফাইল", subtitle: "গ্রাহকের অর্ডার হিস্ট্রি ও যোগাযোগ" }
      : { title: "এডমিন কন্ট্রোল প্যানেল", subtitle: "দই বিলাস ব্যবস্থাপনা পোর্টাল" });

  const QUICK_SEARCH_RESULTS = [
    { type: "order", label: "অর্ডার #DB-1035 (তানভীর আহমেদ)", href: "/admin/orders/DB-1035" },
    { type: "order", label: "অর্ডার #DB-1034 (শাহরিয়ার কবীর)", href: "/admin/orders/DB-1034" },
    { type: "product", label: "বগুড়ার ঐতিহ্যবাহী সরার দই", href: "/admin/products" },
    { type: "product", label: "খাঁটি দানাদার গাওয়া ঘি", href: "/admin/products" },
    { type: "customer", label: "তানভীর আহমেদ (01712-345678)", href: "/admin/customers/CUST-001" },
    { type: "customer", label: "শাহরিয়ার কবীর (01823-456789)", href: "/admin/customers/CUST-002" },
  ];

  const filteredSearch = searchQuery.trim()
    ? QUICK_SEARCH_RESULTS.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 h-20 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs flex items-center justify-between px-4 sm:px-8 z-40 font-bengali">
      {/* ── 1. Left Side: Hamburger & Dynamic Title ──────────────── */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-[#351C1B] hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
          aria-label="Toggle mobile sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dynamic Page Title / Breadcrumb */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-[#351C1B] truncate tracking-tight">
              {matchedRoute.title}
            </h1>
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>স্টোর সিংকড</span>
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-stone-500 truncate">
            {matchedRoute.subtitle}
          </p>
        </div>
      </div>

      {/* ── 2. Center: Global Search Bar ─────────────────────────── */}
      <div ref={searchRef} className="relative hidden md:block w-72 lg:w-96 mx-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="admin-global-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="অর্ডার #, পণ্য বা গ্রাহক খুঁজুন..."
            className="w-full bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-[#C48A4E] rounded-xl pl-10 pr-12 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#C48A4E]/25 transition-all shadow-2xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-200/60 rounded border border-stone-300">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3 z-50 animate-in fade-in space-y-1 max-h-80 overflow-y-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-2 pb-1 border-b border-stone-100">
              অনুসন্ধানের ফলাফল ({filteredSearch.length})
            </div>
            {filteredSearch.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-400">
                কোনো ম্যাচ পাওয়া যায়নি
              </div>
            ) : (
              filteredSearch.map((res, i) => (
                <Link
                  key={i}
                  href={res.href}
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/50 transition-colors text-xs text-stone-800 group"
                >
                  <div className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-[#C48A4E]/20 text-[#351C1B] flex items-center justify-center shrink-0">
                    {res.type === "order" ? (
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C48A4E]" />
                    ) : res.type === "product" ? (
                      <Package className="w-3.5 h-3.5 text-blue-600" />
                    ) : (
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                    )}
                  </div>
                  <span className="truncate group-hover:text-[#351C1B] font-medium">
                    {res.label}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── 3. Right Side: Quick Action, Alerts & Admin Profile ──── */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick New Order Button */}
        <Link
          href="/admin/orders/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-amber-50 font-bold text-xs shadow-md shadow-[#351C1B]/15 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-amber-200" />
          <span>নতুন অর্ডার</span>
        </Link>

        {/* View Storefront Icon Button */}
        <Link
          href="/"
          target="_blank"
          title="ওয়েবসাইট লাইভ ভিউ"
          className="p-2.5 rounded-xl text-stone-500 hover:text-[#351C1B] hover:bg-stone-100 transition-colors"
        >
          <Store className="w-4 h-4" />
        </Link>

        {/* Notification Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-stone-600 hover:text-[#351C1B] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="বিজ্ঞপ্তি দেখুন"
          >
            <Bell className="w-5 h-5" />
            {/* Pulsing red badge */}
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-white"></span>
            </span>
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 text-xs animate-in fade-in duration-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C48A4E]" />
                  <span className="font-extrabold text-[#351C1B] text-sm">স্টোর বিজ্ঞপ্তি</span>
                </div>
                <span className="text-[10px] text-[#C48A4E] bg-amber-50 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                  ৩ টি নতুন এলার্ট
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                <Link
                  href="/admin/orders/DB-1035"
                  onClick={() => setShowNotifications(false)}
                  className="p-3 rounded-xl bg-amber-50/40 hover:bg-amber-50 border border-amber-100 flex items-start gap-3 transition-colors block"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#351C1B] text-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#351C1B]">নতুন অর্ডার #DB-1035</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                        ৳ ২,১৫০
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      তানভীর আহমেদ • বগুড়ার সরার দই (২ কেজি)
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ৫ মিনিট আগে
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/products"
                  onClick={() => setShowNotifications(false)}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 flex items-start gap-3 transition-colors block"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#C48A4E] flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">ইনভেন্টরি লো-স্টক সতর্কতা</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      খাঁটি দানাদার গাওয়া ঘি এর স্টক শেষ হতে চলেছে (মাত্র ৩টি অবশিষ্ট)।
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ২৫ মিনিট আগে
                    </span>
                  </div>
                </Link>

                <Link
                  href="/admin/customers/CUST-002"
                  onClick={() => setShowNotifications(false)}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 flex items-start gap-3 transition-colors block"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">ভিআইপি লয়ালটি আপগ্রেড</span>
                    <p className="text-stone-600 text-[11px] mt-0.5">
                      গ্রাহক শাহরিয়ার কবীর গোল্ড টিয়ার অর্জন করেছেন।
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> ১ ঘণ্টা আগে
                    </span>
                  </div>
                </Link>
              </div>

              <div className="pt-2 border-t border-stone-100 text-center">
                <Link
                  href="/admin/orders"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#C48A4E] hover:underline"
                >
                  সকল অর্ডার ও অ্যাক্টিভিটি দেখুন →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Admin Profile Avatar & Dropdown ───────────────────── */}
        <div ref={profileRef} className="relative pl-2 sm:pl-3 border-l border-stone-200">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer group"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-[#351C1B] via-[#4A2624] to-[#C48A4E] text-amber-100 flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ring-2 ring-[#C48A4E]/30 group-hover:ring-[#C48A4E] transition-all">
              দবি
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-extrabold text-[#351C1B] leading-tight">
                সুপার অ্যাডমিন
              </span>
              <span className="text-[10px] text-stone-400 font-sans leading-tight">
                Executive Manager
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-transform hidden sm:block" />
          </button>

          {/* Profile Menu Popover */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 text-xs animate-in fade-in duration-200 space-y-1">
              <div className="px-3 py-2 border-b border-stone-100 mb-1">
                <div className="font-extrabold text-stone-900 text-sm">দই বিলাস অ্যাডমিন</div>
                <div className="text-[11px] text-stone-400">admin@doibilash.com</div>
              </div>

              <Link
                href="/admin/team"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#351C1B] transition-colors"
              >
                <Users className="w-4 h-4 text-stone-400" />
                <span>টিম ও রোল ব্যবস্থাপনা</span>
              </Link>

              <Link
                href="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#351C1B] transition-colors"
              >
                <Settings className="w-4 h-4 text-stone-400" />
                <span>স্টোর সেটিংস</span>
              </Link>

              <Link
                href="/admin/orders"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#351C1B] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-stone-400" />
                <span>সকল অর্ডার তালিকা</span>
              </Link>

              <Link
                href="/"
                target="_blank"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-stone-50 text-stone-700 hover:text-[#351C1B] transition-colors"
              >
                <Store className="w-4 h-4 text-[#C48A4E]" />
                <span>লাইভ ওয়েবসাইট ভিউ</span>
              </Link>

              <div className="pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (confirm("আপনি কি নিশ্চিত যে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
                      window.location.href = "/";
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
