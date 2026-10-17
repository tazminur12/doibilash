"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { name: "হোম", englishName: "Home", href: "/" },
  { name: "সব পণ্য", englishName: "All Products", href: "/shop" },
  { name: "প্রিমিয়াম দই", englishName: "Premium Doi", href: "/category/premium-doi" },
  { name: "লাড্ডু", englishName: "Laddu", href: "/category/laddu" },
  { name: "লাচ্ছা সেমাই", englishName: "Laccha Semai", href: "/category/laccha-semai" },
  { name: "অফার", englishName: "Offers", href: "/offers", isOffer: true },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { openCart, totalCount } = useCart();

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname === "/orders" ||
    pathname === "/categories" ||
    pathname === "/customers" ||
    pathname === "/products" ||
    pathname === "/settings";
  if (isAdminRoute) return null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-sm bg-white">
      {/* Tier 1: Top Bar */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Hamburger + Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-doibrand-dark hover:bg-stone-100 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Official Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0">
                <Image
                  src="/Logo/logo.png"
                  alt="দই বিলাস লোগো"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl sm:text-3xl font-bold font-bengali text-doibrand-dark tracking-tight transition-transform duration-200 group-hover:scale-102">
                দই বিলাস
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-4 lg:mx-8 relative"
          >
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="সার্চ করুন..."
                className="w-full pl-11 pr-10 py-2 sm:py-2.5 rounded-full border border-stone-200 bg-stone-50/80 focus:bg-white focus:border-doibrand-gold focus:ring-2 focus:ring-doibrand-gold/20 text-sm font-bengali text-doibrand-dark placeholder-stone-400 outline-none transition-all duration-200 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Profile */}
            <Link
              href="/profile"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-doibrand-dark hover:text-doibrand-accent hover:bg-stone-100 transition-colors group"
              title="Profile"
            >
              <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden xl:inline text-xs font-semibold tracking-wide">
                Profile
              </span>
            </Link>

            {/* Track Order */}
            <Link
              href="/track-order"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-doibrand-dark hover:text-doibrand-accent hover:bg-stone-100 transition-colors group"
              title="Track Order"
            >
              <Truck className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="hidden xl:inline text-xs font-semibold tracking-wide">
                Track Order
              </span>
            </Link>

            {/* Cart with Badge */}
            <button
              type="button"
              onClick={openCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full text-doibrand-dark hover:text-doibrand-accent hover:bg-stone-100 transition-colors group cursor-pointer focus:outline-none"
              title="Cart"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                {/* Circular Notification Badge */}
                <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 rounded-full bg-doibrand-gold text-white text-[10px] font-bold flex items-center justify-center shadow-sm font-sans">
                  {totalCount}
                </span>
              </div>
              <span className="hidden xl:inline text-xs font-semibold tracking-wide">
                Cart
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input (Visible only on mobile below header top) */}
        <div className="md:hidden px-4 pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ করুন..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-200 bg-stone-50 text-xs font-bengali text-doibrand-dark placeholder-stone-400 outline-none focus:border-doibrand-gold focus:ring-1 focus:ring-doibrand-gold shadow-sm"
            />
          </form>
        </div>
      </div>

      {/* Tier 2: Bottom Navigation (Desktop) */}
      <nav className="w-full bg-doibrand-dark text-doibrand-light hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 lg:gap-10 py-3 text-sm font-medium font-bengali">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative py-1 text-doibrand-light/90 hover:text-doibrand-gold transition-colors duration-200 flex items-center gap-1.5 group"
                >
                  {link.isOffer && (
                    <Sparkles className="w-3.5 h-3.5 text-doibrand-gold animate-pulse" />
                  )}
                  <span>{link.name}</span>
                  <span className="text-[11px] text-stone-400 group-hover:text-doibrand-gold/80 transition-colors font-sans">
                    ({link.englishName})
                  </span>
                  {/* Subtle underline hover indicator */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-doibrand-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-doibrand-dark text-doibrand-light border-t border-doibrand-dark/80 px-4 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-xs uppercase tracking-wider text-doibrand-gold font-semibold px-2">
            মেনু নেভিগেশন
          </div>
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bengali text-doibrand-light hover:bg-white/10 hover:text-doibrand-gold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    {link.isOffer && (
                      <Sparkles className="w-4 h-4 text-doibrand-gold" />
                    )}
                    {link.name}
                  </span>
                  <span className="text-xs text-stone-400 font-sans">
                    {link.englishName}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Quick links in mobile drawer */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs">
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200"
            >
              <User className="w-4 h-4 text-doibrand-gold" />
              <span>Profile</span>
            </Link>
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200"
            >
              <Truck className="w-4 h-4 text-doibrand-gold" />
              <span>Track Order</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCart();
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-200 relative cursor-pointer"
              aria-label="Open cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-doibrand-gold" />
                <span className="absolute -top-1 -right-2 px-1 rounded-full bg-doibrand-gold text-white text-[9px] font-bold">
                  {totalCount}
                </span>
              </div>
              <span>Cart</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
