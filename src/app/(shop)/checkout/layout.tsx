import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "চেকআউট",
  description: "দই বিলাসে নিরাপদ চেকআউট।",
  path: "/checkout",
  noIndex: true,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
