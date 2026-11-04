"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  ChevronRight,
  Copy,
  Hash,
  ImagePlus,
  Lock,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { authFetch } from "@/lib/authStorage";
import { clearCheckoutDraft, readCheckoutDraft, type CheckoutDraft } from "@/lib/checkoutDraft";
import { DEFAULT_SETTINGS, type StoreSettings } from "@/lib/settingsStorage";

const cardClass = "rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_18px_44px_-32px_rgba(53,28,27,0.45)]";

const formatTaka = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [draft, setDraft] = useState<CheckoutDraft | null>(null);
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [transactionId, setTransactionId] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(readCheckoutDraft());
    setReady(true);
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!proofFile) {
      setProofPreview("");
      return;
    }
    const url = URL.createObjectURL(proofFile);
    setProofPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proofFile]);

  if (!ready) {
    return (
      <main className="min-h-[70vh] grid place-items-center bg-doibrand-light">
        <div className="w-10 h-10 rounded-full border-4 border-doibrand-gold border-t-transparent animate-spin" />
      </main>
    );
  }

  if (!draft) {
    return (
      <main className="min-h-[70vh] bg-doibrand-light text-doibrand-dark font-bengali px-4 py-16 grid place-items-center">
        <div className={`${cardClass} max-w-md w-full p-8 text-center`}>
          <h1 className="text-2xl font-extrabold">পেমেন্টের তথ্য পাওয়া যায়নি</h1>
          <p className="mt-2 text-sm text-stone-500">চেকআউট থেকে বিকাশ বা নগদ বেছে নিয়ে আবার এগোন।</p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-doibrand-accent to-doibrand-gold px-6 py-3 text-sm font-bold text-white"
          >
            চেকআউটে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  const isBkash = draft.paymentMethod === "bkash";
  const methodName = isBkash ? "বিকাশ" : "নগদ";
  const walletNumber = isBkash ? settings.bkashMerchantNumber : settings.nagadMerchantNumber;
  const accountType = isBkash ? settings.bkashAccountType : settings.nagadAccountType;
  const sendLabel = accountType === "Personal" ? "Send Money" : "Payment";

  const copyNumber = async () => {
    if (!walletNumber) return;
    try {
      await navigator.clipboard.writeText(walletNumber.replace(/[\s-]/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trx = transactionId.replace(/\s+/g, "").toUpperCase();
    if (!/^[A-Z0-9]{6,30}$/.test(trx)) {
      setError("সঠিক ট্রানজেকশন আইডি দিন। শুধু ইংরেজি অক্ষর ও সংখ্যা, কমপক্ষে ৬ অক্ষর।");
      return;
    }
    if (proofFile && !proofFile.type.startsWith("image/")) {
      setError("পেমেন্ট প্রুফ হিসেবে শুধু ছবি আপলোড করা যাবে।");
      return;
    }
    if (proofFile && proofFile.size > 5 * 1024 * 1024) {
      setError("স্ক্রিনশটের সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      let paymentProofUrl: string | undefined;
      if (proofFile) {
        const formData = new FormData();
        formData.append("file", proofFile);
        const uploadRes = await fetch("/api/upload/payment-proof", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.ok || !uploadData.url) {
          setError(uploadData.error || "পেমেন্ট প্রুফ আপলোড করা যায়নি।");
          setIsSubmitting(false);
          return;
        }
        paymentProofUrl = uploadData.url;
      }

      const res = await authFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: draft.customerName,
          customerPhone: draft.customerPhone,
          customerEmail: draft.customerEmail,
          shippingAddress: draft.shippingAddress,
          deliveryArea: draft.deliveryArea,
          notes: draft.notes,
          items: draft.items,
          subtotal: draft.subtotal,
          deliveryFee: draft.deliveryFee,
          discount: draft.discount,
          totalAmount: draft.totalAmount,
          paymentMethod: draft.paymentMethod,
          promoCode: draft.promoCode,
          transactionId: trx,
          paymentProofUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "অর্ডার সম্পন্ন করা যায়নি।");
        setIsSubmitting(false);
        return;
      }

      const orderId = data.orderNumber || data.order?.id || "DB-00000";
      clearCart();
      clearCheckoutDraft();
      const params = new URLSearchParams({
        orderId,
        total: String(draft.totalAmount),
        payment: draft.paymentMethod,
        name: draft.customerName,
        area: draft.deliveryArea,
      });
      router.push(`/checkout/success?${params.toString()}`);
    } catch {
      setError("সার্ভারে সংযোগ করা যায়নি। আবার চেষ্টা করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-doibrand-light text-doibrand-dark font-bengali pb-16">
      <section className="px-4 sm:px-6 lg:px-8 pt-5 md:pt-6">
        <div className="relative max-w-3xl mx-auto overflow-hidden rounded-3xl bg-linear-to-br from-[#FFF3E3] via-[#FFFCF7] to-[#F6DDBD] ring-1 ring-doibrand-gold/20 px-5 py-6 sm:px-8 sm:py-8">
          <nav aria-label="Breadcrumb" className="relative flex items-center gap-1.5 text-xs text-stone-500">
            <Link href="/checkout" className="hover:text-doibrand-accent transition-colors">
              চেকআউট
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-doibrand-accent">{methodName} পেমেন্ট</span>
          </nav>
          <h1 className="relative mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            {methodName} পেমেন্ট নিশ্চিত করুন
          </h1>
          <p className="relative mt-2 max-w-xl text-sm text-stone-600">
            নিচের নম্বরে টাকা পাঠান, তারপর ট্রানজেকশন আইডি দিন। এটা জমা না দিলে অর্ডার কনফার্ম হবে না।
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-5">
        <div className={`${cardClass} p-5 sm:p-7`}>
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-doibrand-gold/15">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Wallet className="w-5 h-5 text-doibrand-gold" />
              টাকা পাঠানোর নম্বর
            </h2>
            <span
              className={`rounded-md bg-white px-2 py-1 text-[11px] font-black ring-1 ring-stone-200 font-sans ${
                isBkash ? "text-[#E2136E]" : "text-[#F6921E]"
              }`}
            >
              {isBkash ? "bKash" : "Nagad"}
            </span>
          </div>

          <p className="mt-4 text-sm text-stone-600">
            {methodName} অ্যাপ থেকে <strong>{sendLabel}</strong> করে ঠিক এই পরিমাণ টাকা পাঠান
            {accountType === "Personal" ? "। এটি একটি পার্সোনাল নম্বর।" : "। এটি একটি মার্চেন্ট নম্বর।"}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FFF9F1] p-4 ring-1 ring-doibrand-gold/20">
            <div>
              <p className="text-[11px] text-stone-500">{methodName} নম্বর</p>
              <p className="mt-0.5 text-2xl font-black font-sans tracking-wide">{walletNumber || "নম্বর সেট করা হয়নি"}</p>
            </div>
            <button
              type="button"
              onClick={copyNumber}
              disabled={!walletNumber}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-doibrand-accent ring-1 ring-doibrand-gold/30 cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "কপি হয়েছে" : "নম্বর কপি"}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-doibrand-dark px-4 py-3 text-white">
            <span className="text-sm">পাঠানোর পরিমাণ</span>
            <span className="text-2xl font-black font-sans">{formatTaka(draft.totalAmount)}</span>
          </div>
        </div>

        <div className={`${cardClass} p-5 sm:p-7 space-y-4`}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Smartphone className="w-5 h-5 text-doibrand-gold" />
            পেমেন্ট প্রুফ
          </h2>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <Hash className="w-3.5 h-3.5 text-doibrand-gold" />
              ট্রানজেকশন আইডি *
            </span>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value.toUpperCase());
                setError("");
              }}
              placeholder="যেমন: 8N7A6B5C4D"
              autoComplete="off"
              className="w-full rounded-xl bg-white px-4 py-3.5 text-sm font-sans tracking-wider text-doibrand-dark placeholder-stone-400 ring-1 ring-stone-200 outline-none transition focus:ring-2 focus:ring-doibrand-gold/60"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold">
              <ImagePlus className="w-3.5 h-3.5 text-doibrand-gold" />
              পেমেন্ট স্ক্রিনশট <span className="font-normal text-stone-400">(ঐচ্ছিক)</span>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setProofFile(e.target.files?.[0] || null);
                setError("");
              }}
              className="block w-full text-xs text-stone-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#FBF1E4] file:px-3 file:py-2 file:text-xs file:font-bold file:text-doibrand-accent"
            />
            {proofPreview && (
              <img src={proofPreview} alt="পেমেন্ট প্রুফ প্রিভিউ" className="mt-3 max-h-56 rounded-2xl ring-1 ring-stone-200" />
            )}
          </label>

          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700 ring-1 ring-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-doibrand-accent to-doibrand-gold py-4 text-base font-bold text-white shadow-[0_16px_32px_-14px_rgba(169,94,53,0.95)] disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            {isSubmitting ? "অর্ডার নিশ্চিত হচ্ছে..." : "পেমেন্ট দিয়ে অর্ডার কনফার্ম করুন"}
          </button>
          <p className="text-center text-[11px] text-stone-400">
            ট্রানজেকশন আইডি মিলিয়ে অ্যাডমিন প্যানেলে এই অর্ডার <strong>পেমেন্ট সফল</strong> হিসেবে দেখা যাবে।
          </p>
        </div>
      </form>
    </main>
  );
}
