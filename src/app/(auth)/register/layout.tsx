import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "রেজিস্ট্রেশন / সাইন-আপ",
  description: "দই বিলাসে নতুন অ্যাকাউন্ট খুলুন এবং বিশেষ অফার উপভোগ করুন।",
  path: "/register",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

