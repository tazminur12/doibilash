"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Truck,
  ShoppingBag,
  ShieldCheck,
  Copy,
  PhoneCall,
  Package,
  ClipboardCheck,
  Wallet,
  Hash,
  CalendarClock,
} from "lucide-react";

const NEXT_STEPS = [
  { icon: PhoneCall, title: "অর্ডার নিশ্চিতকরণ", text: "আমাদের প্রতিনিধি ফোন করে অর্ডারটি নিশ্চিত করবেন।" },
  { icon: Package, title: "যত্নসহকারে প্যাকেজিং", text: "কোল্ড-চেইন প্যাকেজিংয়ে আপনার পণ্য প্রস্তুত করা হবে।" },
  { icon: Truck, title: "দ্রুত ডেলিভারি", text: "নির্ধারিত সময়ে পণ্য আপনার দোরগোড়ায় পৌঁছে যাবে।" },
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);

  const rawOrderId = searchParams.get("orderId");
  const orderId = rawOrderId ? (rawOrderId.startsWith("#") ? rawOrderId : `#${rawOrderId}`) : null;
  const rawTotal = Number(searchParams.get("total"));
  const totalFormatted = Number.isFinite(rawTotal) && rawTotal > 0 ? `৳ ${rawTotal.toLocaleString("en-US")}` : null;
  const isOnline = searchParams.get("payment") === "online";
  const insideDhaka = searchParams.get("area") !== "outside";
  const customerName = searchParams.get("name") || "সম্মানিত গ্রাহক";

  const copyOrderId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId.replace("#", ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const details = [
    {
      icon: Wallet,
      label: isOnline ? "পরিশোধযোগ্য মূল্য" : "ডেলিভারিতে পরিশোধ করবেন",
      value: totalFormatted ?? "—",
      accent: true,
    },
    { icon: ShieldCheck, label: "পেমেন্ট মেথড", value: isOnline ? "বিকাশ / নগদ" : "ক্যাশ অন ডেলিভারি" },
    { icon: CalendarClock, label: "সম্ভাব্য ডেলিভারি", value: insideDhaka ? "২৪ ঘণ্টার মধ্যে" : "৪৮–৭২ ঘণ্টার মধ্যে" },
    { icon: ClipboardCheck, label: "বর্তমান অবস্থা", value: "অর্ডার গ্রহণ করা হয়েছে", status: true },
  ];

  return (
    <main className="min-h-[80vh] bg-doibrand-light text-doibrand-dark font-bengali px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="relative max-w-3xl mx-auto overflow-hidden rounded-[32px] bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 shadow-[0_30px_70px_-40px_rgba(169,94,53,0.7)] px-5 py-10 sm:px-10 sm:py-12 text-center">
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] rounded-full bg-white/60 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-doibrand-gold/70 to-transparent" />

        {/* Check Badge */}
        <div className="relative mx-auto w-24 h-24 animate-header-fade-up">
          <span className="absolute inset-0 rounded-full bg-doibrand-gold/25 animate-ping" />
          <span className="relative w-24 h-24 grid place-items-center rounded-full bg-linear-to-br from-[#E9C893] via-doibrand-gold to-doibrand-accent text-white ring-8 ring-white shadow-[0_20px_40px_-16px_rgba(169,94,53,0.9)]">
            <Check className="w-12 h-12" strokeWidth={3} />
          </span>
        </div>

        <h1 className="relative mt-7 text-2xl sm:text-4xl font-extrabold tracking-tight">
          অর্ডার{" "}
          <span className="bg-linear-to-r from-doibrand-accent via-doibrand-gold to-doibrand-accent bg-clip-text text-transparent">
            সফলভাবে সম্পন্ন!
          </span>
        </h1>
        <p className="relative mx-auto mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-stone-600">
          ধন্যবাদ <strong className="text-doibrand-dark">{customerName}</strong>! দই বিলাস থেকে অর্ডার করার জন্য আমরা কৃতজ্ঞ।
          আমাদের প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="relative mx-auto mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-doibrand-gold/30 shadow-sm">
            <Hash className="w-4 h-4 text-doibrand-gold" />
            <span className="text-left">
              <span className="block text-[10px] text-stone-500">অর্ডার আইডি</span>
              <span className="block text-lg font-extrabold font-sans tracking-wide">{orderId}</span>
            </span>
            <button
              type="button"
              onClick={copyOrderId}
              aria-label="Copy order ID"
              className={`ml-2 inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                copied ? "bg-emerald-600 text-white" : "bg-[#FBF1E4] text-doibrand-accent hover:bg-[#F6E4CC]"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "কপি হয়েছে" : "কপি"}
            </button>
          </div>
        )}

        {/* Details */}
        <dl className="relative mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {details.map(({ icon: Icon, label, value, accent, status }) => (
            <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/80 backdrop-blur p-4 ring-1 ring-white shadow-sm">
              <span className="w-10 h-10 shrink-0 grid place-items-center rounded-xl bg-linear-to-br from-[#FBEBD2] to-[#EFCF9E] text-doibrand-accent">
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <dt className="text-[11px] text-stone-500">{label}</dt>
                <dd
                  className={`mt-0.5 text-sm font-bold ${accent ? "text-lg font-extrabold text-doibrand-accent font-sans" : ""} ${
                    status ? "inline-flex items-center gap-1.5 text-emerald-700" : ""
                  }`}
                >
                  {status && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  {value}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {/* What's Next */}
        <div className="relative mt-7 rounded-3xl bg-white p-5 sm:p-6 ring-1 ring-stone-200/70 text-left">
          <h2 className="text-sm font-bold">এরপর কী হবে?</h2>
          <ol className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {NEXT_STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="flex sm:flex-col items-start gap-3">
                <span className="relative shrink-0 w-10 h-10 grid place-items-center rounded-xl bg-[#FFF9F1] text-doibrand-accent ring-1 ring-doibrand-gold/25">
                  <Icon className="w-[18px] h-[18px]" />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-linear-to-br from-doibrand-accent to-doibrand-gold text-[10px] font-bold text-white">
                    {["১", "২", "৩"][i]}
                  </span>
                </span>
                <div>
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-stone-500">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/track-order"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-doibrand-accent to-doibrand-gold px-7 py-3.5 text-sm font-bold text-white shadow-[0_14px_28px_-14px_rgba(169,94,53,0.95)] hover:brightness-110 transition"
          >
            <Truck className="w-4 h-4" />
            অর্ডার ট্র্যাক করুন
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 hover:bg-[#FBF1E4] transition"
          >
            <ShoppingBag className="w-4 h-4" />
            আরও কেনাকাটা করুন
          </Link>
        </div>

        <p className="relative mt-8 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-doibrand-gold" />
          ১০০% খাঁটি ও গুণগত মান নিশ্চিত — দই বিলাস
        </p>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] grid place-items-center bg-doibrand-light px-4">
          <div className="w-10 h-10 rounded-full border-4 border-doibrand-gold border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
