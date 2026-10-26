import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "আমার অ্যাকাউন্ট",
  description: "আপনার দই বিলাস অ্যাকাউন্ট, অর্ডার ও ঠিকানা পরিচালনা করুন।",
  path: "/profile",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
