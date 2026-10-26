import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "অর্ডার ট্র্যাক করুন",
  description: "অর্ডার আইডি ও মোবাইল নম্বর দিয়ে আপনার দই বিলাস অর্ডারের লাইভ স্ট্যাটাস জেনে নিন।",
  path: "/track-order",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
