"use client";

import React from "react";
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
}

const ADMIN_NAV_ITEMS: NavItem[] = [
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
    name: "Customers",
    nameBn: "গ্রাহকবৃন্দ",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    nameBn: "সেটিংস",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isRouteActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = (
    <div className="flex flex-col h-full font-bengali">
      {/* Logo Area */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <Link href="/admin" className="block">
            <h1 className="font-bengali text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>দই বিলাস</span>
              <span className="text-doibrand-gold text-lg font-sans font-normal">- Admin</span>
            </h1>
          </Link>
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-doibrand-gold" />
            <span>Control Panel v1.0</span>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1" aria-label="Admin Navigation">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 transition-colors ${
                active
                  ? "bg-doibrand-gold/20 text-doibrand-gold border-r-4 border-doibrand-gold font-semibold rounded-l-lg mx-4 my-1 p-3"
                  : "text-gray-300 hover:bg-white/5 hover:text-white rounded-lg mx-4 my-1 p-3"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform ${
                  active ? "text-doibrand-gold scale-105" : "text-gray-400"
                }`}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-sm">{item.nameBn}</span>
                <span className="text-[10px] text-gray-400 font-sans">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area: Logout Button */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <Link
          href="/"
          className="w-full flex items-center gap-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg p-3 transition-colors text-xs font-semibold mb-2"
        >
          <span>ওয়েবসাইটে ফিরে যান →</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (confirm("আপনি কি অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?")) {
              window.location.href = "/";
            }
          }}
          className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg p-3 transition-colors cursor-pointer text-sm font-semibold"
        >
          <LogOut className="w-5 h-5 shrink-0 text-red-400" />
          <span>লগআউট</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-doibrand-dark text-white flex flex-col hidden lg:flex z-30 shadow-xl">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        >
          <div
            className="w-64 h-full bg-doibrand-dark text-white shadow-2xl transition-transform transform"
            onClick={(e) => e.stopPropagation()}
          >
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
