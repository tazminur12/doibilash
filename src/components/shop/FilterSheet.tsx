"use client";

import React, { useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { toBnDigits } from "@/lib/bangla";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  resultCount: number;
  children: React.ReactNode;
}

export default function FilterSheet({ open, onClose, onReset, resultCount, children }: FilterSheetProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`lg:hidden fixed inset-0 z-[60] font-bengali ${open ? "" : "pointer-events-none"}`}
      inert={!open}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-doibrand-dark/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`absolute inset-x-0 bottom-0 max-h-[85vh] flex flex-col rounded-t-3xl bg-doibrand-light shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-stone-300" />
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-doibrand-gold/15">
          <h3 className="flex items-center gap-2 text-base font-bold text-doibrand-dark">
            <SlidersHorizontal className="w-4 h-4 text-doibrand-gold" />
            ফিল্টার
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="w-9 h-9 grid place-items-center rounded-full bg-white ring-1 ring-stone-200 text-stone-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        <div className="flex gap-3 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-doibrand-gold/15 bg-white">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 rounded-xl py-3 text-sm font-bold text-doibrand-accent bg-[#FBF1E4] ring-1 ring-doibrand-gold/25 cursor-pointer"
          >
            রিসেট
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-[2] rounded-xl py-3 text-sm font-bold text-white bg-linear-to-r from-doibrand-accent to-doibrand-gold shadow-[0_10px_22px_-12px_rgba(169,94,53,0.9)] cursor-pointer"
          >
            {toBnDigits(resultCount)}টি পণ্য দেখুন
          </button>
        </div>
      </div>
    </div>
  );
}
