import type { Metadata } from "next";

export const SITE = {
  url: "https://doibilash.com",
  name: "দই বিলাস",
  englishName: "Doi Bilash",
  tagline: "বগুড়ার খাঁটি দই ও মিষ্টান্ন",
  description:
    "দই বিলাস — বগুড়ার ঐতিহ্যবাহী মাটির সরার দই, খাঁটি গাওয়া ঘি, শাহী লাড্ডু ও লাচ্ছা সেমাই। ১০০% খাঁটি দুধে তৈরি, প্রিজারভেটিভমুক্ত, কোল্ড-চেইন হোম ডেলিভারি সারা বাংলাদেশে।",
  keywords: [
    "দই বিলাস",
    "Doi Bilash",
    "বগুড়ার দই",
    "সরার দই",
    "মিষ্টি দই",
    "Bogura doi",
    "গাওয়া ঘি",
    "লাচ্ছা সেমাই",
    "শাহী লাড্ডু",
    "online sweets Bangladesh",
    "দই হোম ডেলিভারি ঢাকা",
  ],
  ogImage: { url: "/Hero/Hero1.png", width: 1640, height: 924 },
  phone: "+8801645460095",
  email: "support@doibilash.com",
  address: { street: "বনানী", city: "ঢাকা", postalCode: "1213", country: "BD" },
  socials: [
    "https://www.facebook.com/profile.php?id=61565074421968",
    "https://www.instagram.com/doibilash",
  ],
  themeColor: "#351C1B",
} as const;

/**
 * Full per-page metadata. Nested objects (openGraph/twitter) are replaced, not merged,
 * by Next.js when a page defines them, so every field the page needs is rebuilt here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  noIndex?: boolean;
}): Metadata {
  // Social platforms don't render SVG previews, so fall back to the default share image.
  const ogImage =
    image && !image.url.endsWith(".svg") ? image : { ...SITE.ogImage, alt: `${SITE.name} — ${SITE.tagline}` };
  const fullTitle = `${title} | ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "bn_BD",
      siteName: `${SITE.name} — ${SITE.englishName}`,
      url: path,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
