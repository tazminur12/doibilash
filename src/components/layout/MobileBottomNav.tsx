"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  getCurrentUser,
  syncCurrentUserWithServer,
  AUTH_CHANGED_EVENT,
  UserSession,
} from "@/lib/authStorage";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, totalCount } = useCart();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) setCurrentUser(user);

    syncCurrentUserWithServer().then((u) => {
      if (u) setCurrentUser(u);
    });

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserSession | null>;
      setCurrentUser(customEvent.detail);
    };
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    };
  }, []);

  const isAdminRoute =
    pathname?.startsWith("/admin") ||
    pathname === "/orders" ||
    pathname === "/categories" ||
    pathname === "/customers" ||
    pathname === "/products" ||
    pathname === "/settings";
  if (isAdminRoute) return null;

  const isHomeActive = pathname === "/";
  const isShopActive =
    pathname.startsWith("/shop") || pathname.startsWith("/products");
  const isProfileActive =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] block md:hidden pb-safe"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            isHomeActive
              ? "text-doibrand-gold font-semibold"
              : "text-gray-400 hover:text-doibrand-dark"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium font-bengali">
            হোম
          </span>
        </Link>

        {/* 2. Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            isShopActive
              ? "text-doibrand-gold font-semibold"
              : "text-gray-400 hover:text-doibrand-dark"
          }`}
        >
          <Store className="w-5 h-5" />
          <span className="text-[10px] font-medium font-bengali">
            শপ
          </span>
        </Link>

        {/* 3. Cart with Badge */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-gray-400 hover:text-doibrand-dark transition-colors cursor-pointer focus:outline-none"
          aria-label="Open cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-doibrand-accent text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium font-bengali">
            কার্ট
          </span>
        </button>

        {/* 4. Profile / Login */}
        <Link
          href={currentUser ? "/profile" : "/login"}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
            isProfileActive
              ? "text-doibrand-gold font-semibold"
              : "text-gray-400 hover:text-doibrand-dark"
          }`}
        >
          {currentUser?.avatarUrl ? (
            <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-doibrand-gold shrink-0">
              <Image
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : currentUser ? (
            <div className="w-5 h-5 rounded-full bg-linear-to-br from-[#E9C893] to-doibrand-accent text-white font-black text-[10px] flex items-center justify-center shrink-0">
              {Array.from(currentUser.name)[0] || "U"}
            </div>
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] font-medium font-bengali">
            {currentUser ? "প্রোফাইল" : "লগইন"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
