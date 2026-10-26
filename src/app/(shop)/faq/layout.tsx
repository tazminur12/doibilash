import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "সাধারণ জিজ্ঞাসা (FAQ)",
  description: "দই বিলাসের অর্ডার, ডেলিভারি, পেমেন্ট, দই সংরক্ষণ ও রিটার্ন সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর।",
  path: "/faq",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
