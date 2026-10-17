"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone.trim()) {
      setError("ফোন নম্বর বা ইমেইল দিন");
      return;
    }
    if (!password.trim()) {
      setError("পাসওয়ার্ড দিন");
      return;
    }

    setIsLoading(true);
    // Simulate async login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-doibrand-light px-4 py-12">
      {/* Subtle background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-doibrand-gold/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-doibrand-accent/5 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-1.5 group mb-2">
            <span className="font-bengali text-3xl font-bold text-doibrand-dark tracking-tight transition-colors group-hover:text-doibrand-gold">
              দই বিলাস
            </span>
            <span className="w-2 h-2 rounded-full bg-doibrand-gold mb-1 shrink-0" />
          </Link>

          <p className="text-gray-500 font-bengali text-sm text-center">
            আপনার একাউন্টে লগইন করুন
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-xs font-bengali animate-in fade-in">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Phone / Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="block text-xs font-semibold text-doibrand-dark font-bengali uppercase tracking-wider">
              ফোন নম্বর বা ইমেইল
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="phone"
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX বা email@example.com"
                autoComplete="tel"
                className="border border-gray-200 focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-lg py-3 pl-10 pr-4 w-full text-sm font-bengali text-doibrand-dark placeholder-stone-400 bg-white outline-none transition-all shadow-xs"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-doibrand-dark font-bengali uppercase tracking-wider">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                autoComplete="current-password"
                className="border border-gray-200 focus:ring-2 focus:ring-doibrand-gold focus:border-transparent rounded-lg py-3 pl-10 pr-11 w-full text-sm font-bengali text-doibrand-dark placeholder-stone-400 bg-white outline-none transition-all shadow-xs"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-doibrand-dark transition-colors cursor-pointer focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-doibrand-accent hover:underline font-bengali"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </div>

          {/* Login Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-doibrand-dark text-white py-3 rounded-xl hover:bg-doibrand-gold transition-colors font-semibold text-lg font-bengali shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>লগইন করুন</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-stone-400 font-bengali">
              অথবা
            </span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          id="google-login-btn"
          type="button"
          className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm shadow-xs cursor-pointer active:scale-[0.99] font-bengali"
        >
          {/* Google SVG Icon */}
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Google দিয়ে লগইন করুন</span>
        </button>

        {/* Registration Link */}
        <p className="text-center text-sm text-gray-500 font-bengali mt-6">
          একাউন্ট নেই?{" "}
          <Link
            href="/register"
            className="font-bold text-doibrand-gold hover:text-doibrand-accent transition-colors"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
