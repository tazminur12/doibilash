"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  Award,
  Star,
  ChevronLeft,
  Store,
  HelpCircle,
  X,
} from "lucide-react";
import { loginUser } from "@/lib/authStorage";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-bengali text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#C48A4E] border-t-transparent rounded-full animate-spin" />
            <span>লোড হচ্ছে...</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/profile";

  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phoneOrEmail.trim()) {
      setError("দয়া করে আপনার মোবাইল নম্বর বা ইমেইল ঠিকানা দিন।");
      return;
    }
    if (!password.trim()) {
      setError("দয়া করে আপনার পাসওয়ার্ড দিন।");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginUser(phoneOrEmail, password);
      if (res.ok) {
        setSuccessMsg(`স্বাগতম, ${res.user.name}! লগইন সফল হয়েছে।`);
        setTimeout(() => {
          router.push(redirectPath);
        }, 800);
      } else {
        setError(res.error);
        setIsLoading(false);
      }
    }, 700);
  };

  const handleDemoLogin = () => {
    setPhoneOrEmail("01712345678");
    setPassword("demo12345");
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotPhone("");
      alert("আপনার নম্বরে পাসওয়ার্ড রিসেট ওটিপি (OTP) পাঠানো হয়েছে।");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] font-bengali text-stone-900 flex flex-col justify-between selection:bg-[#C48A4E]/30 selection:text-[#351C1B]">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-5xl rounded-3xl bg-white shadow-[0_24px_70px_-20px_rgba(53,28,27,0.2)] border border-amber-900/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* ── LEFT SHOWCASE PANEL (Desktop) ─────────────────────────── */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-linear-to-br from-[#200F0E] via-[#2F1514] to-[#180A09] text-white overflow-hidden">
            {/* Ambient Lighting Orbs */}
            <div className="pointer-events-none absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#C48A4E]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-[#A95E35]/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/40 to-transparent" />

            {/* Top Brand Identity */}
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#FAF8F5] via-[#F3E5D8] to-[#C48A4E] p-0.5 shadow-md shadow-black/40 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-[#351C1B] flex items-center justify-center text-[#C48A4E]">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-2xl text-white tracking-tight group-hover:text-amber-200 transition-colors">
                      দই বিলাস
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#C48A4E]" />
                  </div>
                  <p className="text-[11px] text-amber-200/70 font-medium">
                    বগুড়ার খাঁটি ঐতিহ্যবাহী আদি স্বাদ
                  </p>
                </div>
              </Link>
            </div>

            {/* Middle Value Proposition */}
            <div className="relative z-10 my-8 space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C48A4E]/20 border border-[#C48A4E]/30 text-amber-300 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  প্রিমিয়াম কাস্টমার পোর্টাল
                </span>
                <h2 className="mt-3 text-2xl font-black leading-snug text-white">
                  স্বাদ ও ঐতিহ্যের রাজকীয় আবহে আপনাকে স্বাগতম
                </h2>
                <p className="mt-2 text-xs text-stone-300 leading-relaxed">
                  আপনার অ্যাকাউন্টে লগইন করে দ্রুত অর্ডার করুন, লাইভ ডেলিভারি ট্র্যাক করুন এবং বিশেষ কুপন ছাড় উপভোগ করুন।
                </p>
              </div>

              {/* 3 Bullet Features */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0 border border-white/10">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-stone-200 font-medium">
                    ১০০% প্রাকৃতিক খাঁটি গাভীর দুধের মাটির সরার দই
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0 border border-white/10">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-stone-200 font-medium">
                    ঢাকা ও বগুড়া সিটিতে দ্রুততম বিশ্বস্ত হোম ডেলিভারি
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-rose-400 flex items-center justify-center shrink-0 border border-white/10">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-stone-200 font-medium">
                    নিরাপদ পেমেন্ট ও ক্যাশ অন ডেলিভারি নিশ্চয়তা
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Snippet */}
            <div className="relative z-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-1 text-amber-300 mb-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs italic text-stone-300 leading-snug">
                &ldquo;দই বিলাসের সরার দই আর ঘি মুখে লেগে থাকার মতো স্বাদ! অতিথি আপ্যায়নে আমার প্রথম পছন্দ।&rdquo;
              </p>
              <p className="text-[10px] text-amber-200/80 mt-1 font-semibold">
                — সালমা পারভীন, গুলশান, ঢাকা
              </p>
            </div>
          </div>

          {/* ── RIGHT AUTH FORM CONTAINER ─────────────────────────────── */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white relative">
            
            {/* Top Back Nav & Quick Demo */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#A95E35] transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ওয়েবসাইটে ফিরে যান</span>
              </Link>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-[11px] font-bold text-[#A95E35] bg-[#FAF3EA] hover:bg-[#F3E5D4] px-2.5 py-1 rounded-lg border border-[#C48A4E]/30 transition active:scale-95"
              >
                ⚡ কুইক ডেমো তথ্য বসান
              </button>
            </div>

            {/* Form Header */}
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-doibrand-dark tracking-tight">
                    অ্যাকাউন্টে লগইন
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    আপনার ব্যক্তিগত অ্যাকাউন্ট সুরক্ষিতভাবে এক্সেস করুন
                  </p>
                </div>

                {/* Tab Pill to Sign Up */}
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                >
                  <span>নতুন অ্যাকাউন্ট</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C48A4E]" />
                </Link>
              </div>

              {/* Feedback messages */}
              {error && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Actual Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Mobile / Email */}
                <div>
                  <label
                    htmlFor="phoneOrEmail"
                    className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider"
                  >
                    মোবাইল নম্বর অথবা ইমেইল
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="phoneOrEmail"
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="যেমন: 01712-345678 বা email@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
                    >
                      পাসওয়ার্ড
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-bold text-[#A95E35] hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 pointer-events-none">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="আপনার পাসওয়ার্ড লিখুন"
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-doibrand-dark placeholder-stone-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30 focus:border-[#C48A4E] transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#A95E35] focus:ring-[#C48A4E] accent-[#A95E35] cursor-pointer"
                    />
                    <span className="text-xs text-stone-600 font-medium">আমাকে মনে রাখুন</span>
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-linear-to-r from-[#A95E35] via-[#C48A4E] to-[#A95E35] bg-[length:150%_100%] hover:bg-right text-white font-bold text-sm sm:text-base shadow-lg shadow-[#A95E35]/25 flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>লগইন হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>লগইন সম্পন্ন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bottom Register Redirection */}
            <div className="pt-6 mt-6 border-t border-stone-100 text-center">
              <p className="text-xs sm:text-sm text-stone-600">
                দই বিলাসে আপনি নতুন?{" "}
                <Link
                  href="/register"
                  className="font-bold text-[#A95E35] hover:text-[#C48A4E] transition underline underline-offset-2"
                >
                  বিনামূল্যে রেজিস্ট্রেশন / সাইন-আপ করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-stone-200 relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C48A4E] flex items-center justify-center mx-auto ring-1 ring-[#C48A4E]/20">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">পাসওয়ার্ড পুনরুদ্ধার</h3>
              <p className="text-xs text-stone-500 mt-1">
                আপনার নিবন্ধিত মোবাইল নম্বর দিন। আমরা একটি ওটিপি (OTP) কোড পাঠিয়ে দেব।
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-3 pt-2">
              <input
                type="text"
                required
                value={forgotPhone}
                onChange={(e) => setForgotPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#C48A4E]/30"
              />
              <button
                type="submit"
                disabled={forgotSent}
                className="w-full py-2.5 rounded-xl bg-linear-to-r from-[#C48A4E] to-[#A95E35] text-white text-xs font-bold shadow-md hover:shadow-lg transition"
              >
                {forgotSent ? "কোড পাঠানো হচ্ছে..." : "রিসেট কোড পাঠান"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
