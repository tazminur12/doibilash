import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { PromoRule } from "@/lib/offerService";

interface CartLine {
  title: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, items = [], subtotal = 0, insideDhaka = true } = body;

    const normalizedCode = (code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে একটি কুপন কোড লিখুন।" },
        { status: 400 }
      );
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (!promo) {
      return NextResponse.json(
        { ok: false, error: "কুপন কোডটি সঠিক নয়।" },
        { status: 404 }
      );
    }

    if (!promo.isActive) {
      return NextResponse.json(
        { ok: false, error: "এই কুপন কোডটি বর্তমানে নিষ্ক্রিয় রয়েছে।" },
        { status: 400 }
      );
    }

    const now = Date.now();
    if (promo.expiresAt && promo.expiresAt.getTime() < now) {
      return NextResponse.json(
        { ok: false, error: "এই কুপনের মেয়াদ শেষ হয়ে গেছে।" },
        { status: 400 }
      );
    }

    if (promo.minOrder && subtotal < promo.minOrder) {
      return NextResponse.json(
        {
          ok: false,
          error: `এই কুপনের জন্য ন্যূনতম ৳${promo.minOrder.toLocaleString("en-US")} টাকার অর্ডার প্রয়োজন।`,
        },
        { status: 400 }
      );
    }

    const requires = promo.requires as { keyword: string; minQty: number } | null;
    if (requires && requires.keyword) {
      const matchingQty = (items as CartLine[])
        .filter((i) => i.title && i.title.includes(requires.keyword))
        .reduce((sum, i) => sum + (i.quantity || 1), 0);

      if (matchingQty < (requires.minQty || 1)) {
        return NextResponse.json(
          {
            ok: false,
            error: `এই কুপনটি প্রযোজ্য: ${promo.condition}।`,
          },
          { status: 400 }
        );
      }
    }

    const rule = promo.rule as PromoRule;
    const promoResponse = {
      id: promo.id,
      code: promo.code,
      discount: promo.discount,
      condition: promo.condition,
      expiry: promo.expiry,
      expiresAt: promo.expiresAt ? promo.expiresAt.toISOString() : undefined,
      description: promo.description,
      tag: promo.tag,
      rule,
      minOrder: promo.minOrder ?? undefined,
      requires: (promo.requires as any) ?? undefined,
      isActive: promo.isActive,
    };

    if (rule.type === "freeDelivery") {
      if (rule.insideDhakaOnly && !insideDhaka) {
        return NextResponse.json(
          { ok: false, error: "ফ্রি ডেলিভারি শুধুমাত্র ঢাকার ভেতরে প্রযোজ্য।" },
          { status: 400 }
        );
      }
      return NextResponse.json({
        ok: true,
        promo: promoResponse,
        discount: 0,
        freeDelivery: true,
      });
    }

    if (rule.type === "flat") {
      return NextResponse.json({
        ok: true,
        promo: promoResponse,
        discount: Math.min(rule.amount, subtotal),
        freeDelivery: false,
      });
    }

    // rule.type === "percent"
    const base = rule.appliesToKeyword
      ? (items as CartLine[])
          .filter((i) => i.title && i.title.includes(rule.appliesToKeyword!))
          .reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0)
      : subtotal;

    if (base === 0) {
      return NextResponse.json(
        { ok: false, error: `কুপনটি শুধুমাত্র ${rule.appliesToKeyword} পণ্যে প্রযোজ্য।` },
        { status: 400 }
      );
    }

    const calculatedDiscount = Math.round((base * rule.percent) / 100);

    return NextResponse.json({
      ok: true,
      promo: promoResponse,
      discount: calculatedDiscount,
      freeDelivery: false,
    });
  } catch (error: any) {
    console.error("Promo validation error:", error);
    return NextResponse.json(
      { ok: false, error: "কুপন যাচাইকরণ ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
