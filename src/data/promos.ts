export type PromoRule =
  | { type: "flat"; amount: number }
  | { type: "percent"; percent: number; appliesToKeyword?: string }
  | { type: "freeDelivery"; insideDhakaOnly?: boolean };

export interface PromoCodeItem {
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
  /** Cart must contain at least this many units of products whose title includes `keyword`. */
  requires?: { keyword: string; minQty: number };
  isActive?: boolean;
}

export const PROMO_CODES: PromoCodeItem[] = [
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
  },
  {
    id: "festive250",
    code: "FESTIVE250",
    discount: "৳ ২৫০ ছাড়",
    condition: "ন্যূনতম ২৫০০ টাকার কম্বো অর্ডারে",
    expiry: "৫ নভেম্বর ২০২৬ পর্যন্ত",
    expiresAt: "2026-11-05T23:59:59+06:00",
    description: "দই, লাড্ডু ও সেমাই কম্বো প্যাকেজে",
    tag: "মেগা সেভার",
    rule: { type: "flat", amount: 250 },
    minOrder: 2500,
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
  },
];

import { getStoredPromos } from "@/lib/offerStorage";

export const isPromoExpired = (promo: PromoCodeItem, now: number) =>
  promo.expiresAt ? new Date(promo.expiresAt).getTime() < now : false;

interface CartLine {
  title: string;
  price: number;
  quantity: number;
}

export type PromoResult =
  | { ok: true; promo: PromoCodeItem; discount: number; freeDelivery: boolean }
  | { ok: false; error: string };

export function evaluatePromo(
  rawCode: string,
  ctx: { items: CartLine[]; subtotal: number; insideDhaka: boolean; now: number }
): PromoResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "দয়া করে একটি কুপন কোড লিখুন।" };

  const allPromos = typeof window !== "undefined" ? getStoredPromos() : PROMO_CODES;
  const promo = allPromos.find((p) => p.code.toUpperCase() === code);
  if (!promo) return { ok: false, error: "কুপন কোডটি সঠিক নয়।" };
  if ("isActive" in promo && !promo.isActive) {
    return { ok: false, error: "এই কুপন কোডটি বর্তমানে নিষ্ক্রিয় রয়েছে।" };
  }
  if (isPromoExpired(promo, ctx.now)) return { ok: false, error: "এই কুপনের মেয়াদ শেষ হয়ে গেছে।" };
  if (promo.minOrder && ctx.subtotal < promo.minOrder) {
    return { ok: false, error: `এই কুপনের জন্য ন্যূনতম ৳${promo.minOrder.toLocaleString("en-US")} টাকার অর্ডার প্রয়োজন।` };
  }
  if (promo.requires) {
    const { keyword, minQty } = promo.requires;
    const qty = ctx.items.filter((i) => i.title.includes(keyword)).reduce((s, i) => s + i.quantity, 0);
    if (qty < minQty) return { ok: false, error: `এই কুপনটি প্রযোজ্য: ${promo.condition}।` };
  }

  const { rule } = promo;
  if (rule.type === "freeDelivery") {
    if (rule.insideDhakaOnly && !ctx.insideDhaka) {
      return { ok: false, error: "ফ্রি ডেলিভারি শুধুমাত্র ঢাকার ভেতরে প্রযোজ্য।" };
    }
    return { ok: true, promo, discount: 0, freeDelivery: true };
  }
  if (rule.type === "flat") {
    return { ok: true, promo, discount: Math.min(rule.amount, ctx.subtotal), freeDelivery: false };
  }

  const base = rule.appliesToKeyword
    ? ctx.items.filter((i) => i.title.includes(rule.appliesToKeyword!)).reduce((s, i) => s + i.price * i.quantity, 0)
    : ctx.subtotal;
  if (base === 0) return { ok: false, error: `কুপনটি শুধুমাত্র ${rule.appliesToKeyword} পণ্যে প্রযোজ্য।` };
  return { ok: true, promo, discount: Math.round((base * rule.percent) / 100), freeDelivery: false };
}
