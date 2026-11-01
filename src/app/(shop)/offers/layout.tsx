import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "স্পেশাল অফার ও প্রোমো কোড — ফ্ল্যাশ সেল",
  description:
    "দই বিলাসের সর্বশেষ ফ্ল্যাশ সেল, ডিসকাউন্ট ও প্রোমো কোড — সীমিত সময়ের জন্য বগুড়ার খাঁটি দই ও মিষ্টান্নে বিশেষ ছাড়। আজই অর্ডার করুন।",
  path: "/offers",
  keywords: [
    "দই অফার",
    "প্রোমো কোড",
    "ফ্ল্যাশ সেল",
    "দই বিলাস ডিসকাউন্ট",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
