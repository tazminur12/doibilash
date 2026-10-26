"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-bengali">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <AdminSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Right Flexible Container */}
      <div className="w-full flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Topbar */}
        <AdminTopbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Dynamic Admin Page View */}
        <article className="p-6 overflow-y-auto flex-1">
          {children}
        </article>
      </div>
    </div>
  );
}
