import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "গোপনীয়তা নীতি",
  description: "দই বিলাস কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার ও সুরক্ষা করে তার বিস্তারিত নীতিমালা।",
  path: "/privacy-policy",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
