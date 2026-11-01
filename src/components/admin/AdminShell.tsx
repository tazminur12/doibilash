"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import {
  getCurrentUser,
  syncCurrentUserWithServer,
} from "@/lib/authStorage";
import { RefreshCw } from "lucide-react";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cached = getCurrentUser();
      if (cached?.role === "ADMIN") {
        if (!cancelled) setReady(true);
      }

      const user = await syncCurrentUserWithServer();
      if (cancelled) return;

      if (!user || user.role !== "ADMIN") {
        router.replace("/login?next=/admin&reason=admin");
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <RefreshCw className="w-7 h-7 animate-spin text-[#C48A4E]" />
          <p className="text-sm font-medium">অ্যাডমিন সেশন যাচাই হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] font-bengali text-stone-900 antialiased selection:bg-[#C48A4E]/30 selection:text-[#351C1B]">
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="w-full flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminTopbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
