import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "সকল পণ্য — খাঁটি দই, ঘি, মধু ও মিষ্টান্ন",
  description:
    "বগুড়ার খাঁটি সরার দই, গাওয়া ঘি, সুন্দরবনের মধু, লাচ্ছা সেমাই ও ঐতিহ্যবাহী মিষ্টান্ন — দই বিলাসের সম্পূর্ণ ক্যাটালগ। ক্যাশ অন ডেলিভারি, হোম ডেলিভারি সারা বাংলাদেশে।",
  path: "/shop",
  keywords: [
    "দই কিনুন অনলাইন",
    "বগুড়ার দই অর্ডার",
    "গাওয়া ঘি কিনুন",
    "মিষ্টান্ন হোম ডেলিভারি",
    "Doi Bilash shop",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
