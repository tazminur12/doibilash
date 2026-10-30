"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  User,
  Truck,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Home,
  Store,
  Milk,
  Cookie,
  Wheat,
  BadgePercent,
  ChevronRight,
  Award,
  Snowflake,
  ShieldCheck,
  CircleHelp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "হোম", englishName: "Home", href: "/", icon: Home },
  { name: "সব পণ্য", englishName: "All Products", href: "/shop", icon: Store },
  { name: "প্রিমিয়াম দই", englishName: "Premium Doi", href: "/category/premium-doi", icon: Milk },
  { name: "লাড্ডু", englishName: "Laddu", href: "/category/laddu", icon: Cookie },
  { name: "লাচ্ছা সেমাই", englishName: "Laccha Semai", href: "/category/laccha-semai", icon: Wheat },
  { name: "অফার", englishName: "Offers", href: "/offers", icon: BadgePercent, isOffer: true },
];

const announcements = [
  { icon: Award, text: "১০০% খাঁটি গরুর দুধে তৈরি" },
  { icon: Sparkles, text: "বগুড়ার ঐতিহ্যবাহী পোড়ামাটির সরা" },
  { icon: Snowflake, text: "কোল্ড-চেইন এক্সপ্রেস ডেলিভারি" },
  { icon: ShieldCheck, text: "প্রিজারভেটিভ ও কেমিক্যালমুক্ত" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { openCart, totalCount } = useCart();

  useEffect(() => {
    let ticking = false;
    const SCROLL_DOWN_THRESHOLD = 70; // Only collapse after user scrolls down 70px
    const SCROLL_UP_THRESHOLD = 15;   // Only expand when user scrolls back near top (< 15px)

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const current = window.scrollY;
          setIsScrolled((prev) => {
            if (!prev && current > SCROLL_DOWN_THRESHOLD) return true;
            if (prev && current < SCROLL_UP_THRESHOLD) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(
      () => setAnnouncementIndex((i) => (i + 1) % announcements.length),
      3500
    );
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname === "/orders" ||
    pathname === "/categories" ||
    pathname === "/customers" ||
    pathname === "/products" ||
    pathname === "/settings";
  if (isAdminRoute) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);
  const ActiveAnnouncementIcon = announcements[announcementIndex].icon;

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Tier 1: Announcement Bar */}
        <div
          className={`grid bg-doibrand-dark text-doibrand-light transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isScrolled ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center lg:justify-between text-[12px]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,138,78,0.18),transparent_70%)]" />

              {/* Desktop: all promises in a row */}
              <ul className="relative hidden lg:flex items-center gap-6">
                {announcements.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-1.5 text-doibrand-light/80">
                    <Icon className="w-3.5 h-3.5 text-doibrand-gold" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              {/* Mobile / Tablet: rotating promise */}
              <p
                key={announcementIndex}
                className="relative lg:hidden flex items-center gap-1.5 text-doibrand-light/90 animate-header-fade-up"
              >
                <ActiveAnnouncementIcon className="w-3.5 h-3.5 text-doibrand-gold" />
                <span>{announcements[announcementIndex].text}</span>
              </p>

              <div className="relative hidden lg:flex items-center gap-4 text-doibrand-light/70">
                <Link href="/track-order" className="flex items-center gap-1.5 hover:text-doibrand-gold transition-colors">
                  <Truck className="w-3.5 h-3.5" />
                  অর্ডার ট্র্যাক
                </Link>
                <span className="w-px h-3 bg-doibrand-light/20" />
                <Link href="/faq" className="flex items-center gap-1.5 hover:text-doibrand-gold transition-colors">
                  <CircleHelp className="w-3.5 h-3.5" />
                  সাহায্য
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Main Bar (glass) */}
        <div
          className={`relative bg-doibrand-light/85 backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-300 ${
            isScrolled ? "shadow-[0_10px_30px_-12px_rgba(53,28,27,0.25)]" : ""
          }`}
        >
          <div
            className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 lg:gap-8 transition-[padding] duration-300 ${
              isScrolled ? "py-2" : "py-3 sm:py-4"
            }`}
          >
            {/* Hamburger + Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden -ml-1 w-10 h-10 grid place-items-center rounded-full text-doibrand-dark hover:bg-doibrand-dark/5 active:scale-95 transition"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
                <span className="relative shrink-0 rounded-full p-[1.5px] bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent shadow-[0_4px_14px_-4px_rgba(196,138,78,0.6)] transition-transform duration-500 group-hover:rotate-[8deg]">
                  <span
                    className={`relative block rounded-full bg-white transition-all duration-300 ${
                      isScrolled ? "w-9 h-9" : "w-10 h-10 sm:w-12 sm:h-12"
                    }`}
                  >
                    <Image
                      src="/Logo/logo.png"
                      alt="দই বিলাস লোগো"
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                      preload
                    />
                  </span>
                </span>
                <span className="flex flex-col leading-none min-w-0">
                  <span
                    className={`font-bold font-bengali text-doibrand-dark tracking-tight transition-all duration-300 ${
                      isScrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-[28px]"
                    }`}
                  >
                    দই বিলাস
                  </span>
                  <span className="mt-1 hidden sm:flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-doibrand-gold">
                    <span className="w-3 h-px bg-doibrand-gold/60" />
                    Heritage Sweets
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl"
              role="search"
            >
              <div className="group relative w-full flex items-center rounded-full bg-white border border-doibrand-dark/10 shadow-[inset_0_1px_2px_rgba(53,28,27,0.04)] transition-all duration-300 focus-within:border-doibrand-gold/60 focus-within:shadow-[0_0_0_4px_rgba(196,138,78,0.12),0_8px_24px_-12px_rgba(196,138,78,0.5)]">
                <Search className="absolute left-4 w-4 h-4 text-stone-400 transition-colors group-focus-within:text-doibrand-gold pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="দই, মিষ্টি, লাড্ডু খুঁজুন..."
                  aria-label="Search products"
                  className="w-full bg-transparent pl-11 pr-2 py-2.5 text-sm font-bengali text-doibrand-dark placeholder-stone-400 outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="shrink-0 p-1.5 mr-1 rounded-full text-stone-400 hover:text-doibrand-dark hover:bg-stone-100 transition"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden lg:grid shrink-0 mr-2 place-items-center w-6 h-6 rounded-md border border-stone-200 bg-stone-50 text-[11px] font-sans text-stone-400">
                    /
                  </kbd>
                )}
                <button
                  type="submit"
                  className="shrink-0 m-1 px-5 py-2 rounded-full bg-doibrand-dark text-doibrand-light text-xs font-semibold tracking-wide hover:bg-doibrand-accent active:scale-95 transition"
                >
                  খুঁজুন
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Link
                href="/track-order"
                className="hidden sm:grid w-10 h-10 place-items-center rounded-full text-doibrand-dark hover:text-doibrand-accent hover:bg-doibrand-dark/5 transition group"
                title="Track Order"
                aria-label="Track order"
              >
                <Truck className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </Link>

              <Link
                href="/profile"
                className={`hidden sm:grid w-10 h-10 place-items-center rounded-full transition group ${
                  isActive("/profile")
                    ? "bg-doibrand-gold/15 text-doibrand-accent"
                    : "text-doibrand-dark hover:text-doibrand-accent hover:bg-doibrand-dark/5"
                }`}
                title="Profile"
                aria-label="Profile"
              >
                <User className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </Link>

              <button
                type="button"
                onClick={openCart}
                className="relative flex items-center gap-2 h-10 pl-3 pr-3 sm:pr-4 rounded-full bg-doibrand-dark text-doibrand-light shadow-[0_8px_20px_-8px_rgba(53,28,27,0.6)] hover:bg-doibrand-accent active:scale-95 transition cursor-pointer group"
                aria-label={`Open cart, ${totalCount} items`}
              >
                <ShoppingBag className="w-[18px] h-[18px] transition-transform duration-300 group-hover:-rotate-12" />
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">কার্ট</span>
                <span className="min-w-5 h-5 px-1.5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-gold text-doibrand-dark text-[11px] font-bold font-sans grid place-items-center">
                  {totalCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div
            className={`md:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
              isScrolled ? "grid-rows-[0fr] opacity-0 pointer-events-none" : "grid-rows-[1fr] opacity-100"
            }`}
          >
            <div className="overflow-hidden min-h-0">
              <form onSubmit={handleSearchSubmit} className="px-4 pb-3" role="search">
                <div className="relative flex items-center rounded-full bg-white border border-doibrand-dark/10 focus-within:border-doibrand-gold/60 focus-within:shadow-[0_0_0_3px_rgba(196,138,78,0.12)] transition">
                  <Search className="absolute left-3.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="দই, মিষ্টি, লাড্ডু খুঁজুন..."
                    aria-label="Search products"
                    className="w-full bg-transparent pl-10 pr-2 py-2.5 text-[13px] font-bengali text-doibrand-dark placeholder-stone-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 m-1 w-8 h-8 grid place-items-center rounded-full bg-doibrand-dark text-doibrand-light"
                    aria-label="Search"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tier 3: Desktop Navigation */}
          <nav className="hidden md:block border-t border-doibrand-dark/[0.06]" aria-label="Main navigation">
            <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-1 lg:gap-2 py-2 text-sm font-medium font-bengali">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                if (link.isOffer) {
                  return (
                    <li key={link.href} className="ml-1 lg:ml-3">
                      <Link
                        href={link.href}
                        className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full overflow-hidden text-doibrand-dark font-semibold bg-linear-to-r from-[#F3DDB8] via-[#E9C893] to-[#F3DDB8] ring-1 ring-doibrand-gold/40 hover:ring-doibrand-gold transition group ${
                          active ? "ring-2 ring-doibrand-gold" : ""
                        }`}
                      >
                        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-linear-to-r from-transparent via-white/70 to-transparent skew-x-[-20deg] animate-header-shine" />
                        <Sparkles className="relative w-3.5 h-3.5 text-doibrand-accent" />
                        <span className="relative">{link.name}</span>
                        <span className="relative ml-0.5 px-1.5 py-px rounded-full bg-doibrand-accent text-white text-[9px] font-bold font-sans tracking-wider">
                          HOT
                        </span>
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative flex items-center gap-1.5 px-3.5 lg:px-4 py-1.5 rounded-full transition-colors duration-200 group ${
                        active
                          ? "bg-doibrand-dark text-doibrand-light shadow-[0_6px_16px_-8px_rgba(53,28,27,0.7)]"
                          : "text-doibrand-dark/80 hover:text-doibrand-dark hover:bg-doibrand-dark/[0.04]"
                      }`}
                    >
                      <span>{link.name}</span>
                      <span
                        className={`hidden lg:inline text-[10px] font-sans tracking-wide transition-colors ${
                          active ? "text-doibrand-gold" : "text-stone-400 group-hover:text-doibrand-gold"
                        }`}
                      >
                        {link.englishName}
                      </span>
                      {!active && (
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-0.5 h-[2px] w-0 rounded-full bg-doibrand-gold transition-all duration-300 group-hover:w-6" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Signature gold hairline */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-doibrand-gold/50 to-transparent" />
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[60] ${isMobileMenuOpen ? "" : "pointer-events-none"}`}
        inert={!isMobileMenuOpen}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          onClick={closeMenu}
          className={`absolute inset-0 bg-doibrand-dark/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={`absolute inset-y-0 left-0 w-[86%] max-w-sm flex flex-col bg-doibrand-light shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="relative overflow-hidden bg-doibrand-dark text-doibrand-light px-5 pt-5 pb-6">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-doibrand-gold/20 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-3">
                <span className="relative w-11 h-11 rounded-full bg-white ring-2 ring-doibrand-gold/70">
                  <Image src="/Logo/logo.png" alt="দই বিলাস লোগো" fill sizes="44px" className="object-contain p-1" />
                </span>
                <span className="flex flex-col leading-none">
                  <span className="text-2xl font-bold">দই বিলাস</span>
                  <span className="mt-1.5 text-[10px] uppercase tracking-[0.28em] text-doibrand-gold font-semibold">
                    Heritage Sweets
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="w-9 h-9 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="relative mt-4 text-xs text-doibrand-light/70 leading-relaxed">
              বগুড়ার ঐতিহ্যবাহী খাঁটি দই ও মিষ্টি — সরাসরি আপনার দোরগোড়ায়।
            </p>
          </div>

          {/* Drawer Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-doibrand-gold">
              মেনু
            </p>
            <ul className="space-y-1">
              {navLinks.map((link, i) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <li
                    key={link.href}
                    className={isMobileMenuOpen ? "animate-header-fade-up" : "opacity-0"}
                    style={{ animationDelay: `${80 + i * 45}ms`, animationFillMode: "both" }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition group ${
                        active
                          ? "bg-white shadow-[0_6px_20px_-10px_rgba(53,28,27,0.35)] ring-1 ring-doibrand-gold/25"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <span
                        className={`w-9 h-9 grid place-items-center rounded-xl transition ${
                          active || link.isOffer
                            ? "bg-doibrand-dark text-doibrand-gold"
                            : "bg-doibrand-gold/10 text-doibrand-accent"
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center gap-2 text-[15px] font-semibold text-doibrand-dark">
                          {link.name}
                          {link.isOffer && (
                            <span className="px-1.5 py-px rounded-full bg-doibrand-accent text-white text-[9px] font-bold font-sans tracking-wider">
                              HOT
                            </span>
                          )}
                        </span>
                        <span className="block text-[11px] text-stone-400 font-sans">{link.englishName}</span>
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                          active ? "text-doibrand-gold" : "text-stone-300"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-doibrand-dark/[0.06] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-doibrand-dark">
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white ring-1 ring-doibrand-dark/5 hover:ring-doibrand-gold/40 transition"
            >
              <User className="w-[18px] h-[18px] text-doibrand-gold" />
              প্রোফাইল
            </Link>
            <Link
              href="/track-order"
              onClick={closeMenu}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-white ring-1 ring-doibrand-dark/5 hover:ring-doibrand-gold/40 transition"
            >
              <Truck className="w-[18px] h-[18px] text-doibrand-gold" />
              ট্র্যাক
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                openCart();
              }}
              className="relative flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-doibrand-dark text-doibrand-light cursor-pointer"
              aria-label={`Open cart, ${totalCount} items`}
            >
              <span className="relative">
                <ShoppingBag className="w-[18px] h-[18px] text-doibrand-gold" />
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-doibrand-gold text-doibrand-dark text-[9px] font-bold font-sans grid place-items-center">
                  {totalCount}
                </span>
              </span>
              কার্ট
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
