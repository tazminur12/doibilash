"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  KeyRound,
} from "lucide-react";

type ResetInfo = {
  email: string;
  name: string;
  accountType: string;
};

export default function ResetPasswordPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#C48A4E] border-t-transparent rounded-full animate-spin" />
            <span>রিসেট লিংক যাচাই হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </React.Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<ResetInfo | null>(null);
  const [loadError, setLoadError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoadError("রিসেট লিংকটি অসম্পূর্ণ। ইমেইল থেকে সম্পূর্ণ লিংকটি খুলুন।");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/auth/reset-password?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.ok) {
          setLoadError(data.error || "রিসেট লিংক যাচাই করা যায়নি।");
        } else {
          setInfo(data.reset);
        }
      } catch {
        if (!cancelled) setLoadError("সার্ভারে সংযোগ করা যায়নি।");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (password.trim().length < 6) {
      setFormError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("পাসওয়ার্ড এবং নিশ্চিতকরণ মিলছে না।");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError(data.error || "পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে।");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setFormError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali text-stone-500">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-[#C48A4E] border-t-transparent rounded-full animate-spin" />
          <span>রিসেট লিংক যাচাই হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-bengali text-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-[0_24px_70px_-20px_rgba(53,28,27,0.2)] border border-amber-900/10 p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-linear-to-br from-[#351C1B] to-[#C48A4E] text-amber-100 flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-[#351C1B]">নতুন পাসওয়ার্ড সেট করুন</h1>
          <p className="text-xs text-stone-500">
            ইমেইলে পাওয়া লিংক দিয়ে আপনার অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করুন।
          </p>
        </div>

        {loadError ? (
          <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <p className="text-sm text-red-700 font-medium">{loadError}</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A95E35] hover:underline"
            >
              লগইন পেজে ফিরে যান
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : success ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-800">পাসওয়ার্ড আপডেট হয়েছে!</p>
            <p className="text-xs text-emerald-700/80">লগইন পেজে নিয়ে যাওয়া হচ্ছে...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {info && (
              <div className="rounded-xl bg-[#FAF8F5] border border-stone-100 px-3.5 py-3 space-y-1">
                {info.name ? (
                  <p className="text-sm font-bold text-[#351C1B]">{info.name}</p>
                ) : null}
                <p className="text-[11px] text-stone-500 flex items-center gap-1.5 font-sans">
                  <Mail className="w-3.5 h-3.5 text-[#C48A4E]" />
                  {info.email}
                </p>
              </div>
            )}

            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-stone-600">নতুন পাসওয়ার্ড</span>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/80 pl-10 pr-10 py-2.5 text-sm focus:border-[#C48A4E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/20"
                  placeholder="কমপক্ষে ৬ অক্ষর"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-stone-600">পাসওয়ার্ড নিশ্চিত করুন</span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl border border-stone-200 bg-stone-50/80 px-3.5 py-2.5 text-sm focus:border-[#C48A4E] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/20"
              />
            </label>

            {formError && (
              <p className="text-xs text-red-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-amber-50 text-sm font-bold shadow-md disabled:opacity-60 hover:shadow-lg transition"
            >
              {submitting ? "সংরক্ষণ হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
