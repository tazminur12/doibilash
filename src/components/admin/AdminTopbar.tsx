"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

interface AdminTopbarProps {
  onToggleMobileSidebar?: () => void;
}

export default function AdminTopbar({ onToggleMobileSidebar }: AdminTopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 z-40 font-bengali">
      {/* ── Left Side ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:text-doibrand-dark hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle mobile sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Subtle Admin Panel text */}
        <div>
          <span className="text-sm sm:text-base font-bold text-doibrand-dark">
            Admin Panel
          </span>
          <span className="hidden sm:inline-block text-xs text-gray-400 ml-2 font-bengali">
            (ব্যবস্থাপনা প্যানেল)
          </span>
        </div>
      </div>

      {/* ── Right Side ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Global Search Input */}
        <div className="relative hidden md:block">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার, পণ্য বা গ্রাহক খুঁজুন..."
            className="bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-doibrand-gold focus:border-transparent outline-none w-64 text-xs font-bengali text-doibrand-dark placeholder-gray-400 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2.5 rounded-full text-gray-600 hover:text-doibrand-dark hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Tiny red dot badge */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Quick Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 font-bold text-doibrand-dark">
                <span>বিজ্ঞপ্তি (Notifications)</span>
                <span className="text-[10px] text-doibrand-gold bg-amber-50 px-2 py-0.5 rounded-full">
                  ৩ টি নতুন
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                  <p className="font-semibold text-doibrand-dark">নতুন অর্ডার #DB-1035</p>
                  <p className="text-gray-400 text-[10px]">২ মিনিট আগে • বগুড়ার সরার দই</p>
                </div>
                <div className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors">
                  <p className="font-semibold text-doibrand-dark">স্টক সতর্কতা</p>
                  <p className="text-gray-400 text-[10px]">খাঁটি গাওয়া ঘি এর স্টক শেষ হতে চলেছে</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Avatar */}
        <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-gray-200">
          <div className="relative w-10 h-10 rounded-full bg-doibrand-gold/15 border-2 border-doibrand-gold/30 flex items-center justify-center text-doibrand-gold font-bold text-sm shadow-xs overflow-hidden">
            <User className="w-5 h-5 text-doibrand-gold" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-doibrand-dark leading-tight">
              Admin
            </span>
            <span className="text-[10px] text-gray-400 font-sans leading-tight">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
