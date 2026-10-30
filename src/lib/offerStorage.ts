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
    image: "/Product/doi.jpg",
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
    image: "/Product/placeholder.svg",
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
    image: "/Product/laccha_semai.jpg",
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
    image: "/Product/placeholder.svg",
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
    image: "/Product/placeholder.svg",
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

export const STORAGE_KEY_PROMOS = "doibilash_promo_codes_v2";
export const STORAGE_KEY_FLASH = "doibilash_flash_deals_v2";
export const STORAGE_KEY_CAMPAIGN = "doibilash_campaign_settings_v2";
export const OFFERS_UPDATED_EVENT = "doibilash_offers_updated";

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OFFERS_UPDATED_EVENT));
  }
}

// ── PROMO CODES ──────────────────────────────────────────────────────────

export function getStoredPromos(): StoredPromoCode[] {
  if (typeof window === "undefined") {
    return DEFAULT_PROMOS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROMOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROMOS, JSON.stringify(DEFAULT_PROMOS));
      return DEFAULT_PROMOS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_PROMOS;
  } catch {
    return DEFAULT_PROMOS;
  }
}

export function savePromo(promo: StoredPromoCode): StoredPromoCode[] {
  const promos = getStoredPromos();
  const index = promos.findIndex((p) => p.id === promo.id || p.code.toUpperCase() === promo.code.toUpperCase());

  let updated: StoredPromoCode[];
  if (index >= 0) {
    updated = [...promos];
    updated[index] = { ...promo, code: promo.code.toUpperCase() };
  } else {
    updated = [{ ...promo, code: promo.code.toUpperCase() }, ...promos];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_PROMOS, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to save promo to localStorage", err);
    }
  }
  return updated;
}

export function togglePromoActive(id: string): StoredPromoCode[] {
  const promos = getStoredPromos();
  const updated = promos.map((p) => {
    if (p.id === id) {
      return { ...p, isActive: !p.isActive };
    }
    return p;
  });

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_PROMOS, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to toggle promo", err);
    }
  }
  return updated;
}

export function deletePromo(id: string): StoredPromoCode[] {
  const promos = getStoredPromos();
  const updated = promos.filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_PROMOS, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to delete promo", err);
    }
  }
  return updated;
}

export function getPromoById(id: string): StoredPromoCode | undefined {
  const promos = getStoredPromos();
  return promos.find((p) => p.id === id || p.code.toUpperCase() === id.toUpperCase());
}

// ── FLASH DEALS ──────────────────────────────────────────────────────────

export function getStoredFlashDeals(): StoredFlashDeal[] {
  if (typeof window === "undefined") {
    return DEFAULT_FLASH_DEALS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FLASH);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FLASH, JSON.stringify(DEFAULT_FLASH_DEALS));
      return DEFAULT_FLASH_DEALS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_FLASH_DEALS;
  } catch {
    return DEFAULT_FLASH_DEALS;
  }
}

export function saveFlashDeal(deal: StoredFlashDeal): StoredFlashDeal[] {
  const deals = getStoredFlashDeals();
  const index = deals.findIndex((d) => d.id === deal.id);

  let updated: StoredFlashDeal[];
  if (index >= 0) {
    updated = [...deals];
    updated[index] = { ...deal };
  } else {
    updated = [{ ...deal }, ...deals];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_FLASH, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to save flash deal to localStorage", err);
    }
  }
  return updated;
}

export function toggleFlashDealActive(id: string): StoredFlashDeal[] {
  const deals = getStoredFlashDeals();
  const updated = deals.map((d) => {
    if (d.id === id) {
      return { ...d, isActive: !d.isActive };
    }
    return d;
  });

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_FLASH, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to toggle flash deal", err);
    }
  }
  return updated;
}

export function deleteFlashDeal(id: string): StoredFlashDeal[] {
  const deals = getStoredFlashDeals();
  const updated = deals.filter((d) => d.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_FLASH, JSON.stringify(updated));
      notifyChange();
    } catch (err) {
      console.error("Failed to delete flash deal", err);
    }
  }
  return updated;
}

export function getFlashDealById(id: string): StoredFlashDeal | undefined {
  const deals = getStoredFlashDeals();
  return deals.find((d) => d.id === id);
}

// ── CAMPAIGN SETTINGS ────────────────────────────────────────────────────

export function getStoredCampaignSettings(): CampaignSettings {
  if (typeof window === "undefined") {
    return DEFAULT_CAMPAIGN_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CAMPAIGN, JSON.stringify(DEFAULT_CAMPAIGN_SETTINGS));
      return DEFAULT_CAMPAIGN_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...DEFAULT_CAMPAIGN_SETTINGS, ...parsed };
    }
    return DEFAULT_CAMPAIGN_SETTINGS;
  } catch {
    return DEFAULT_CAMPAIGN_SETTINGS;
  }
}

export function saveCampaignSettings(settings: CampaignSettings): CampaignSettings {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY_CAMPAIGN, JSON.stringify(settings));
      notifyChange();
    } catch (err) {
      console.error("Failed to save campaign settings", err);
    }
  }
  return settings;
}

