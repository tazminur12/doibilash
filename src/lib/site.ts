import type { Metadata } from "next";

const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://doibilash.com"
).replace(/\/$/, "");

export const SITE = {
  url: APP_URL,
  name: "দই বিলাস",
  englishName: "Doi Bilash",
  tagline: "বগুড়ার খাঁটি দই ও মিষ্টান্ন",
  description:
    "দই বিলাস — বগুড়ার ঐতিহ্যবাহী মাটির সরার দই, খাঁটি গাওয়া ঘি, শাহী লাড্ডু ও লাচ্ছা সেমাই অনলাইনে অর্ডার করুন। ১০০% খাঁটি দুধে তৈরি, প্রিজারভেটিভমুক্ত, কোল্ড-চেইন হোম ডেলিভারি সারা বাংলাদেশে। ক্যাশ অন ডেলিভারি উপলব্ধ।",
  keywords: [
    "দই বিলাস",
    "Doi Bilash",
    "বগুড়ার দই",
    "বগুড়ার সরার দই",
    "সরার দই",
    "মিষ্টি দই",
    "খাঁটি দই অনলাইন",
    "Bogura doi",
    "Bogura curd online",
    "গাওয়া ঘি",
    "খাঁটি গাওয়া ঘি",
    "লাচ্ছা সেমাই",
    "শাহী লাড্ডু",
    "মিষ্টান্ন হোম ডেলিভারি",
    "দই হোম ডেলিভারি ঢাকা",
    "online sweets Bangladesh",
    "cash on delivery doi",
    "ঐতিহ্যবাহী বাংলা মিষ্টি",
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
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  noIndex?: boolean;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  // Social platforms don't render SVG previews, so fall back to the default share image.
  const ogImage =
    image && !image.url.endsWith(".svg")
      ? image
      : { ...SITE.ogImage, alt: `${SITE.name} — ${SITE.tagline}` };
  const fullTitle = `${title} | ${SITE.name}`;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "bn-BD": canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      type,
      locale: "bn_BD",
      alternateLocale: ["en_US"],
      siteName: `${SITE.name} — ${SITE.englishName}`,
      url: canonicalPath,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage.url,
          width: ogImage.width || SITE.ogImage.width,
          height: ogImage.height || SITE.ogImage.height,
          alt: ("alt" in ogImage && ogImage.alt) || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
    ...(noIndex
      ? { robots: { index: false, follow: false, nocache: true } }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-image-preview": "large" as const,
              "max-snippet": -1,
              "max-video-preview": -1,
            },
          },
        }),
  };
}
