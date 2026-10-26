import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "শর্তাবলী",
  description: "দই বিলাসের ওয়েবসাইট ব্যবহার ও পণ্য ক্রয়ের সাধারণ শর্তাবলী।",
  path: "/terms",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
