export type PromoRule =
  | { type: "flat"; amount: number }
  | { type: "percent"; percent: number; appliesToKeyword?: string }
  | { type: "freeDelivery"; insideDhakaOnly?: boolean };

export interface StoredPromoCode {
  id: string;
  code: string;
  discount: string;
  condition: string;
  expiry: string;
  expiresAt?: string;
  description: string;
  tag: string;
  rule: PromoRule;
  minOrder?: number;
  requires?: { keyword: string; minQty: number };
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  createdAt: string;
}

export interface StoredFlashDeal {
  id: string;
  slug: string;
  title: string;
  price: number; // Flash Rate
  originalPrice: number;
  unit: string;
  badge: string;
  image: string;
  soldCount: number;
  totalStock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CampaignSettings {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  campaignEnd: string;
  bannerActive: boolean;
  announcementText?: string;
}

export const DEFAULT_PROMOS: StoredPromoCode[] = [
  {
    id: "doi100",
    code: "DOI100",
    discount: "৳ ১০০ ছাড়",
    condition: "ন্যূনতম ১০০০ টাকার অর্ডারে",
    expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
    expiresAt: "2026-10-31T23:59:59+06:00",
    description: "প্রথম অর্ডারে স্পেশাল ছাড়",
    tag: "নতুন গ্রাহক",
    rule: { type: "flat", amount: 100 },
    minOrder: 1000,
    isActive: true,
    usageCount: 142,
    createdAt: "2026-01-10",
  },
  {
    id: "ghee15",
    code: "GHEE15",
    discount: "১৫% ছাড়",
    condition: "ন্যূনতম ১৫০০ টাকার গাওয়া ঘি অর্ডারে",
    expiry: "২৫ অক্টোবর ২০২৬ পর্যন্ত",
    expiresAt: "2026-10-25T23:59:59+06:00",
    description: "গাওয়া ঘি ক্যাটাগরির সকল পণ্যে",
    tag: "স্পেশাল",
    rule: { type: "percent", percent: 15, appliesToKeyword: "ঘি" },
    minOrder: 1500,
    isActive: true,
    usageCount: 88,
    createdAt: "2026-01-15",
  },
  {
    id: "festive250",
    code: "FESTIVE250",
    discount: "৳ ২৫০ ছাড়",
    condition: "ন্যূনতম ২৫০০ টাকার কম্বো অর্ডারে",
    expiry: "১৫ নভেম্বর ২০২৬ পর্যন্ত",
    expiresAt: "2026-11-15T23:59:59+06:00",
    description: "দই, লাড্ডু ও সেমাই কম্বো প্যাকেজে",
    tag: "মেগা সেভার",
    rule: { type: "flat", amount: 250 },
    minOrder: 2500,
    isActive: true,
    usageCount: 64,
    createdAt: "2026-01-20",
  },
  {
    id: "laddu50",
    code: "LADDU50",
    discount: "৳ ৫০ ছাড়",
    condition: "যেকোনো লাড্ডু বক্স ক্রয়ে",
    expiry: "২৮ অক্টোবর ২০২৬ পর্যন্ত",
    expiresAt: "2026-10-28T23:59:59+06:00",
    description: "শাহী মতিচুর ও বেসন লাড্ডুতে প্রযোজ্য",
    tag: "জনপ্রিয়",
    rule: { type: "flat", amount: 50 },
    requires: { keyword: "লাড্ডু", minQty: 1 },
    isActive: true,
    usageCount: 95,
    createdAt: "2026-01-25",
  },
  {
    id: "freedel",
    code: "FREEDEL",
    discount: "ফ্রি ডেলিভারি",
    condition: "ন্যূনতম ১২০০ টাকার অর্ডারে",
    expiry: "সীমিত সময়ের জন্য",
    description: "ঢাকা ও বগুড়া সিটিতে সম্পূর্ণ ফ্রি ডেলিভারি",
    tag: "ডেলিভারি অফার",
    rule: { type: "freeDelivery", insideDhakaOnly: true },
    minOrder: 1200,
    isActive: true,
    usageCount: 230,
    createdAt: "2026-02-01",
  },
  {
    id: "doi20",
    code: "DOI20",
    discount: "২০% ছাড়",
    condition: "২ কেজি বা তদূর্ধ্ব মাটির সরার দইয়ে",
    expiry: "৩১ অক্টোবর ২০২৬ পর্যন্ত",
    expiresAt: "2026-10-31T23:59:59+06:00",
    description: "ঐতিহ্যবাহী বগুড়ার স্পেশাল সরার দইয়ে",
    tag: "হট ডিল",
    rule: { type: "percent", percent: 20, appliesToKeyword: "দই" },
    requires: { keyword: "দই", minQty: 2 },
    isActive: true,
    usageCount: 178,
    createdAt: "2026-02-05",
  },
];

export const DEFAULT_FLASH_DEALS: StoredFlashDeal[] = [
  {
    id: "flash-1",
    slug: "bogra-special-doi",
    title: "বগুড়ার স্পেশাল সরার মিষ্টি দই",
    price: 400,
    originalPrice: 500,
    unit: "১ কেজি মাটির সরা",
    badge: "ফ্ল্যাশ সেল",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
    soldCount: 42,
    totalStock: 50,
    isActive: true,
    createdAt: "2026-01-10",
  },
  {
    id: "flash-2",
    slug: "shahi-ghee-motichoor-laddu",
    title: "শাহী গাওয়া ঘি মতিচুর লাড্ডু",
    price: 510,
    originalPrice: 680,
    unit: "১ কেজি প্রিমিয়াম বক্স",
    badge: "ফ্ল্যাশ সেল",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515856/doibilash/offers/mini_doi.png",
    soldCount: 35,
    totalStock: 40,
    isActive: true,
    createdAt: "2026-01-12",
  },
  {
    id: "flash-3",
    slug: "special-ghee-roasted-laccha-semai",
    title: "গাওয়া ঘিয়ে ভাজা স্পেশাল লাচ্ছা সেমাই",
    price: 360,
    originalPrice: 480,
    unit: "৫০০ গ্রাম বক্স",
    badge: "ফ্ল্যাশ সেল",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515855/doibilash/offers/laccha_semai.jpg",
    soldCount: 28,
    totalStock: 30,
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "flash-4",
    slug: "sundarban-honey",
    title: "সুন্দরবনের প্রাকৃতিক খাঁটি মধু",
    price: 680,
    originalPrice: 850,
    unit: "৫০০ গ্রাম কাঁচের জার",
    badge: "ফ্ল্যাশ সেল",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515855/doibilash/offers/mango_doi.jpg",
    soldCount: 19,
    totalStock: 25,
    isActive: true,
    createdAt: "2026-01-18",
  },
  {
    id: "flash-5",
    slug: "pure-ghee",
    title: "খাঁটি দানাদার গাওয়া ঘি",
    price: 1085,
    originalPrice: 1450,
    unit: "৯০০ গ্রাম জার",
    badge: "ফ্ল্যাশ সেল",
    image: "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
    soldCount: 15,
    totalStock: 20,
    isActive: true,
    createdAt: "2026-01-20",
  },
];

export const DEFAULT_CAMPAIGN_SETTINGS: CampaignSettings = {
  badge: "মেগা ডিসকাউন্ট উৎসব",
  title: "স্পেশাল",
  highlightText: "ধামাকা অফার",
  description: "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ভাউচার কোড উপভোগ করুন।",
  campaignEnd: "2026-11-15T23:59:59+06:00",
  bannerActive: true,
  announcementText: "অফার চলাকালীন যেকোনো ২টি মিষ্টি আইটেমে বিশেষ উপহার!",
};
