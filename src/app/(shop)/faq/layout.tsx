import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { JsonLd, faqPageSchema } from "@/lib/seo";
import { FAQS } from "@/data/faqs";

export const metadata: Metadata = pageMetadata({
  title: "সাধারণ জিজ্ঞাসা (FAQ) — অর্ডার, ডেলিভারি ও পেমেন্ট",
  description:
    "দই বিলাসের অর্ডার, ডেলিভারি, পেমেন্ট, দই সংরক্ষণ, মাটির সরা ও রিটার্ন সম্পর্কে সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর। ক্যাশ অন ডেলিভারি ও হোম ডেলিভারি তথ্য।",
  path: "/faq",
  keywords: [
    "দই বিলাস FAQ",
    "দই ডেলিভারি",
    "ক্যাশ অন ডেলিভারি",
    "সরার দই সংরক্ষণ",
  ],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={faqPageSchema(
          FAQS.map((f) => ({ question: f.question, answer: f.answer }))
        )}
      />
      {children}
    </>
  );
}
