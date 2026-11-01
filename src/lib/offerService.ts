import prisma from "@/lib/prisma";

export type PromoRule =
  | { type: "flat"; amount: number }
  | { type: "percent"; percent: number; appliesToKeyword?: string }
  | { type: "freeDelivery"; insideDhakaOnly?: boolean };

export interface PromoCodeData {
  id: string;
  code: string;
  discount: string;
  condition: string;
  expiry: string;
  expiresAt?: string | null;
  description: string;
  tag: string;
  rule: PromoRule;
  minOrder?: number | null;
  requires?: { keyword: string; minQty: number } | null;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number | null;
  createdAt: string;
}

export interface FlashDealData {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number;
  unit: string;
  badge: string;
  image: string;
  soldCount: number;
  totalStock: number;
  isActive: boolean;
  createdAt: string;
}

export interface CampaignData {
  badge: string;
  title: string;
  highlightText: string;
  description: string;
  campaignEnd: string;
  bannerActive: boolean;
  announcementText?: string;
  bannerUrl?: string;
}

export async function getAdminOffersData() {
  const [promosRaw, flashDealsRaw, campaignRaw] = await Promise.all([
    prisma.promoCode.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.flashDeal.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.campaignSetting.findUnique({
      where: { id: "default" },
    }),
  ]);

  const promos: PromoCodeData[] = promosRaw.map((p) => ({
    id: p.id,
    code: p.code,
    discount: p.discount,
    condition: p.condition,
    expiry: p.expiry,
    expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
    description: p.description,
    tag: p.tag,
    rule: p.rule as PromoRule,
    minOrder: p.minOrder,
    requires: (p.requires as { keyword: string; minQty: number }) || null,
    isActive: p.isActive,
    usageCount: p.usageCount,
    maxUsage: p.maxUsage,
    createdAt: p.createdAt.toISOString().split("T")[0],
  }));

  const flashDeals: FlashDealData[] = flashDealsRaw.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    price: f.price,
    originalPrice: f.originalPrice,
    unit: f.unit,
    badge: f.badge,
    image: f.image,
    soldCount: f.soldCount,
    totalStock: f.totalStock,
    isActive: f.isActive,
    createdAt: f.createdAt.toISOString().split("T")[0],
  }));

  const campaign: CampaignData = campaignRaw
    ? {
        badge: campaignRaw.badge,
        title: campaignRaw.title,
        highlightText: campaignRaw.highlightText,
        description: campaignRaw.description,
        campaignEnd: campaignRaw.campaignEnd
          ? campaignRaw.campaignEnd.toISOString()
          : "2026-11-15T23:59:59+06:00",
        bannerActive: campaignRaw.bannerActive,
        announcementText: campaignRaw.announcementText || "",
        bannerUrl: campaignRaw.bannerUrl || "",
      }
    : {
        badge: "মেগা ডিসকাউন্ট উৎসব",
        title: "স্পেশাল",
        highlightText: "ধামাকা অফার",
        description: "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য। সর্বোচ্চ ছাড় ও আকর্ষণীয় ভাউচার কোড উপভোগ করুন।",
        campaignEnd: "2026-11-15T23:59:59+06:00",
        bannerActive: true,
        announcementText: "অফার চলাকালীন যেকোনো ২টি মিষ্টি আইটেমে বিশেষ উপহার!",
        bannerUrl: "",
      };

  return { promos, flashDeals, campaign };
}

export async function getPublicOffersData() {
  const [promosRaw, flashDealsRaw, campaignRaw] = await Promise.all([
    prisma.promoCode.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.flashDeal.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.campaignSetting.findUnique({
      where: { id: "default" },
    }),
  ]);

  const promos: PromoCodeData[] = promosRaw.map((p) => ({
    id: p.id,
    code: p.code,
    discount: p.discount,
    condition: p.condition,
    expiry: p.expiry,
    expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
    description: p.description,
    tag: p.tag,
    rule: p.rule as PromoRule,
    minOrder: p.minOrder,
    requires: (p.requires as { keyword: string; minQty: number }) || null,
    isActive: p.isActive,
    usageCount: p.usageCount,
    maxUsage: p.maxUsage,
    createdAt: p.createdAt.toISOString().split("T")[0],
  }));

  const flashDeals: FlashDealData[] = flashDealsRaw.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    price: f.price,
    originalPrice: f.originalPrice,
    unit: f.unit,
    badge: f.badge,
    image: f.image,
    soldCount: f.soldCount,
    totalStock: f.totalStock,
    isActive: f.isActive,
    createdAt: f.createdAt.toISOString().split("T")[0],
  }));

  const campaign: CampaignData = campaignRaw
    ? {
        badge: campaignRaw.badge,
        title: campaignRaw.title,
        highlightText: campaignRaw.highlightText,
        description: campaignRaw.description,
        campaignEnd: campaignRaw.campaignEnd
          ? campaignRaw.campaignEnd.toISOString()
          : "2026-11-15T23:59:59+06:00",
        bannerActive: campaignRaw.bannerActive,
        announcementText: campaignRaw.announcementText || "",
        bannerUrl: campaignRaw.bannerUrl || "",
      }
    : {
        badge: "মেগা ডিসকাউন্ট উৎসব",
        title: "স্পেশাল",
        highlightText: "ধামাকা অফার",
        description: "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য।",
        campaignEnd: "2026-11-15T23:59:59+06:00",
        bannerActive: true,
        announcementText: "",
        bannerUrl: "",
      };

  return { promos, flashDeals, campaign };
}

