"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Images,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Info,
  Monitor,
  Smartphone,
  Link2,
  Ruler,
} from "lucide-react";
import type { HeroBannerDTO } from "@/lib/heroBannerService";
import { toBnDigits } from "@/lib/bangla";

type Toast = { type: "success" | "error"; message: string } | null;

export default function AdminHeroBannersPage() {
  const [banners, setBanners] = useState<HeroBannerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [altText, setAltText] = useState("দই বিলাস হিরো ব্যানার");
  const [link, setLink] = useState("/shop");
  const [toast, setToast] = useState<Toast>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 3500);
  }, []);

  const loadBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/hero-banners");
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "লোড ব্যর্থ");
      setBanners(json.banners || []);
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ব্যানার লোড ব্যর্থ");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("error", "শুধুমাত্র ছবি আপলোড করুন (JPG, PNG, WebP)।");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast("error", "ছবি সর্বোচ্চ ৮MB হতে পারবে।");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const upRes = await fetch("/api/upload/hero", { method: "POST", body: form });
      const upJson = await upRes.json();
      if (!upRes.ok || !upJson.ok) {
        throw new Error(upJson.error || "আপলোড ব্যর্থ");
      }

      const saveRes = await fetch("/api/admin/hero-banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: upJson.url,
          publicId: upJson.publicId,
          altText: altText.trim() || "দই বিলাস হিরো ব্যানার",
          link: link.trim() || "/shop",
        }),
      });
      const saveJson = await saveRes.json();
      if (!saveRes.ok || !saveJson.ok) {
        throw new Error(saveJson.error || "সেভ ব্যর্থ");
      }

      setBanners((prev) => [...prev, saveJson.banner]);
      showToast("success", "হিরো ব্যানার সফলভাবে যোগ হয়েছে!");
      setAltText("দই বিলাস হিরো ব্যানার");
      setLink("/shop");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "আপলোড ব্যর্থ");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("এই ব্যানারটি মুছে ফেলতে চান?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/hero-banners/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "ডিলিট ব্যর্থ");
      setBanners((prev) => prev.filter((b) => b.id !== id));
      showToast("success", "ব্যানার ডিলিট করা হয়েছে।");
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "ডিলিট ব্যর্থ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 font-bengali">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#C48A4E]">
            হোমপেজ মিডিয়া
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#351C1B] sm:text-3xl">
            হিরো ব্যানার স্লাইডার
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-stone-500">
            হোমপেজের উপরের ব্যানারগুলো এখান থেকে আপলোড ও ডিলিট করুন। একাধিক ব্যানার থাকলে
            স্লাইডার স্বয়ংক্রিয়ভাবে পরিবর্তন হবে।
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          হোম দেখুন
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Size guide */}
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C48A4E] text-white">
            <Ruler className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#351C1B]">
              কী সাইজের ব্যানার দিলে ভালো দেখাবে?
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              হিরো সেকশনে প্রতিটি ব্যানার{" "}
              <span className="font-bold text-[#351C1B]">১৬∶৯</span> অনুপাতে দেখানো হয়।
              ডেস্কটপে একসাথে দুইটি ব্যানার পাশাপাশি থাকে; মোবাইলে একটি করে স্লাইড হয়।
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-200/70 bg-white/80 p-3.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#351C1B]">
                  <Monitor className="h-4 w-4 text-[#C48A4E]" />
                  সুপারিশকৃত সাইজ
                </div>
                <p className="mt-1.5 text-sm text-stone-600">
                  <span className="font-extrabold text-[#A95E35]">১৬০০ × ৯০০ px</span>{" "}
                  (১৬∶৯) — তীক্ষ্ণ ও ক্লিয়ার
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  ন্যূনতম: ১২৮০ × ৭২০ px · ফরম্যাট: JPG / PNG / WebP · সর্বোচ্চ ৮MB
                </p>
              </div>
              <div className="rounded-xl border border-amber-200/70 bg-white/80 p-3.5">
                <div className="flex items-center gap-2 text-sm font-bold text-[#351C1B]">
                  <Smartphone className="h-4 w-4 text-[#C48A4E]" />
                  ডিজাইন টিপস
                </div>
                <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-stone-600">
                  <li>• গুরুত্বপূর্ণ টেক্সট/লোগো মাঝখানে রাখুন (প্রান্ত কেটে যেতে পারে)</li>
                  <li>• অতিরিক্ত ছোট টেক্সট এড়িয়ে চলুন</li>
                  <li>• একই অনুপাতে সব ব্যানার দিলে স্লাইডার সুন্দর দেখায়</li>
                </ul>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-xs text-stone-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C48A4E]" />
              কোনো ব্যানার না থাকলে হোমে ডিফল্ট স্থানীয় ছবি দেখাবে। আপলোড করলে সেগুলোই দেখাবে।
            </p>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-base font-bold text-[#351C1B]">
          <Upload className="h-4 w-4 text-[#C48A4E]" />
          নতুন ব্যানার আপলোড
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-stone-600">
              অল্ট টেক্সট (Alt)
            </span>
            <input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#C48A4E] focus:ring-2 focus:ring-[#C48A4E]/20"
              placeholder="বগুড়ার খাঁটি দই..."
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-stone-600">
              <Link2 className="h-3.5 w-3.5" />
              ক্লিক লিংক
            </span>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-[#C48A4E] focus:ring-2 focus:ring-[#C48A4E]/20"
              placeholder="/shop"
            />
          </label>
        </div>

        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#351C1B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#4a2826] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                আপলোড হচ্ছে...
              </>
            ) : (
              <>
                <Images className="h-4 w-4" />
                ছবি সিলেক্ট ও আপলোড
              </>
            )}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#351C1B]">
            আপলোডকৃত ব্যানার ({toBnDigits(banners.length)})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin text-[#C48A4E]" />
            লোড হচ্ছে...
          </div>
        ) : banners.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 py-14 text-center">
            <Images className="mx-auto h-8 w-8 text-stone-300" />
            <p className="mt-3 text-sm font-semibold text-stone-600">
              এখনো কোনো ব্যানার আপলোড হয়নি
            </p>
            <p className="mt-1 text-xs text-stone-400">
              হোমে ডিফল্ট ব্যানার দেখাচ্ছে — নতুন ছবি আপলোড করলে সেগুলোই স্লাইডার হবে।
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50"
              >
                <div className="relative aspect-video bg-stone-200">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.altText}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-white">
                    #{toBnDigits(index + 1)}
                  </span>
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-sm font-semibold text-[#351C1B]">
                    {banner.altText}
                  </p>
                  <p className="truncate text-xs text-stone-500">{banner.link}</p>
                  <button
                    type="button"
                    disabled={deletingId === banner.id}
                    onClick={() => void handleDelete(banner.id)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                  >
                    {deletingId === banner.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    ডিলিট
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
