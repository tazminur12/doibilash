"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  Users,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  Plus,
  ExternalLink,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Star,
  Sliders,
  CheckCircle2,
  Store,
  Gift,
  Building2,
  TicketPercent,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  name: string;
  nameBn: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  groupTitleBn: string;
  items: NavItem[];
}

const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    groupTitleBn: "মূল কার্যক্রম (Core)",
    items: [
      {
        name: "Dashboard",
        nameBn: "ড্যাশবোর্ড",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Orders",
        nameBn: "অর্ডারসমূহ",
        href: "/admin/orders",
        icon: ShoppingBag,
        badge: "৮ টি",
        badgeColor: "bg-[#C48A4E] text-white",
      },
      {
        name: "Corporate Orders",
        nameBn: "কর্পোরেট ও বাল্ক অর্ডার",
        href: "/admin/corporate",
        icon: Building2,
        badge: "B2B",
        badgeColor: "bg-blue-600 text-white",
      },
      {
        name: "Products",
        nameBn: "পণ্য তালিকা",
        href: "/admin/products",
        icon: Package,
      },
      {
        name: "Categories",
        nameBn: "ক্যাটাগরি",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        name: "Gift Packages",
        nameBn: "উপহার ও উৎসব সম্ভার",
        href: "/admin/packages",
        icon: Gift,
        badge: "স্পেশাল",
        badgeColor: "bg-rose-600 text-white",
      },
    ],
  },
  {
    groupTitleBn: "মার্কেটিং ও অফার (Campaigns)",
    items: [
      {
        name: "Offers & Promos",
        nameBn: "অফার ও প্রোমো কোড",
        href: "/admin/offers",
        icon: TicketPercent,
        badge: "হট ডিল",
        badgeColor: "bg-linear-to-r from-amber-600 to-rose-600 text-white",
      },
    ],
  },
  {
    groupTitleBn: "গ্রাহক ও সম্পর্ক (CRM)",
    items: [
      {
        name: "Customers",
        nameBn: "গ্রাহকবৃন্দ",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    groupTitleBn: "সিস্টেম ও টিম এক্সেস",
    items: [
      {
        name: "Team & Staff",
        nameBn: "টিম ও রোলস",
        href: "/admin/team",
        icon: ShieldCheck,
      },
      {
        name: "Settings",
        nameBn: "স্টোর সেটিংস",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isRouteActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full font-bengali bg-linear-to-b from-[#200F0E] via-[#2A1413] to-[#180A09] text-amber-50/90 relative overflow-hidden select-none">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-linear-to-bl from-[#C48A4E]/15 via-amber-900/10 to-transparent rounded-full blur-2xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-20 left-0 w-36 h-36 bg-linear-to-tr from-[#A95E35]/15 to-transparent rounded-full blur-xl pointer-events-none -ml-10" />

      {/* ── 1. Brand Header ─────────────────────────────────────── */}
      <div className="p-5 sm:p-6 border-b border-amber-900/30 relative shrink-0">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group" onClick={onClose}>
            {/* Luxury Brand Emblem */}
            <div className="relative w-11 h-11 rounded-2xl bg-linear-to-br from-[#FAF8F5] via-[#F3E5D8] to-[#C48A4E] p-0.5 shadow-lg shadow-black/40 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full rounded-[14px] bg-[#351C1B] flex items-center justify-center text-[#C48A4E]">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-amber-200 transition-colors">
                  দই বিলাস
                </span>
                <span className="text-[10px] font-sans font-extrabold uppercase px-1.5 py-0.5 rounded bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white shadow-2xs">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-amber-200/60 font-medium">
                বগুড়ার খাঁটি ঐতিহ্যবাহী স্বাদ
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Live Store Status Pill */}
        <div className="mt-3.5 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/25 border border-amber-900/30 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-300 font-medium">লাইভ স্টোর সক্রিয়</span>
          </div>
          <span className="font-mono text-stone-400 text-[10px]">v২.০</span>
        </div>
      </div>

      {/* ── 2. Quick Create Shortcut ───────────────────────────── */}
      <div className="px-4 pt-4 shrink-0">
        <Link
          href="/admin/orders/new"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] hover:from-[#d1965a] hover:to-[#b8673a] text-white font-bold text-xs shadow-md shadow-[#C48A4E]/20 hover:shadow-lg transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-amber-100" />
          <span>নতুন অর্ডার তৈরি করুন</span>
        </Link>
      </div>

      {/* ── 3. Navigation Groups ───────────────────────────────── */}
      <nav
        className="flex-1 px-3 py-4 overflow-y-auto space-y-5 scrollbar-thin scrollbar-thumb-stone-800"
        aria-label="Admin Navigation"
      >
        {ADMIN_NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-amber-200/40">
              {group.groupTitleBn}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isRouteActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-linear-to-r from-[#C48A4E]/30 via-amber-900/25 to-transparent text-amber-100 border-l-3 border-[#C48A4E] shadow-xs"
                      : "text-stone-300 hover:text-white hover:bg-white/5 border-l-3 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform ${
                        active
                          ? "bg-[#C48A4E] text-[#241312] shadow-xs scale-105"
                          : "bg-white/5 text-stone-400 group-hover:text-amber-200 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>

                    <div className="flex flex-col text-left leading-tight">
                      <span className={`${active ? "text-white font-bold" : "text-stone-300"}`}>
                        {item.nameBn}
                      </span>
                      <span className="text-[10px] text-stone-500 font-sans group-hover:text-stone-400">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  {item.badge ? (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor || "bg-[#C48A4E] text-white"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        active
                          ? "text-[#C48A4E] translate-x-0.5"
                          : "text-stone-600 opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── 4. Bottom User Profile & Storefront Exit ───────────── */}
      <div className="p-4 border-t border-amber-900/30 bg-black/25 shrink-0 space-y-2">
        {/* View Storefront Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-stone-400 hover:text-amber-200 hover:bg-white/5 text-xs font-semibold transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#C48A4E]" />
            <span>মূল ওয়েবসাইট দেখুন</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
        </Link>

        {/* Admin User Card with Logout */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#C48A4E] to-[#A95E35] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              দবি
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">সুপার অ্যাডমিন</div>
              <div className="text-[10px] text-stone-400 truncate">admin@doibilash.com</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            title="লগআউট"
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#2A1413] border border-amber-900/40 rounded-2xl max-w-sm w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-white">লগআউট নিশ্চিতকরণ</h3>
              <p className="text-xs text-stone-400">
                আপনি কি নিশ্চিত যে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-stone-300 transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors shadow-sm"
              >
                হ্যাঁ, লগআউট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen flex flex-col hidden lg:flex z-30 shadow-2xl border-r border-amber-900/20">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        >
          <div
            className="w-68 max-w-[85vw] h-full shadow-2xl transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
