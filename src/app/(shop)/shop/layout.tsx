import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "সকল পণ্য — খাঁটি দই, ঘি, মধু ও মিষ্টান্ন",
  description: "বগুড়ার খাঁটি সরার দই, গাওয়া ঘি, সুন্দরবনের মধু ও ঐতিহ্যবাহী মিষ্টান্ন — দই বিলাসের সকল পণ্য এক জায়গায়, ক্যাশ অন ডেলিভারিসহ।",
  path: "/shop",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
