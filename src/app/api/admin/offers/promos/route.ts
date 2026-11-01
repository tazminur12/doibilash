import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      code,
      discount,
      condition,
      expiry,
      expiresAt,
      description,
      tag,
      rule,
      minOrder,
      requires,
      isActive,
    } = body;

    const normalizedCode = (code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return NextResponse.json(
        { ok: false, error: "প্রোমো কোড প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const existing = await prisma.promoCode.findUnique({
      where: { code: normalizedCode },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: `কোড "${normalizedCode}" ইতিমধ্যে বিদ্যমান। অন্য একটি কোড ব্যবহার করুন।` },
        { status: 409 }
      );
    }

    const newPromo = await prisma.promoCode.create({
      data: {
        code: normalizedCode,
        discount: discount || "বিশেষ ছাড়",
        condition: condition || "শর্ত প্রযোজ্য",
        expiry: expiry || "সীমিত সময়ের জন্য",
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        description: description || "বিশেষ কুপন ছাড়",
        tag: tag || "স্পেশাল",
        rule: rule || { type: "flat", amount: 0 },
        minOrder: minOrder ? Number(minOrder) : null,
        requires: requires || null,
        isActive: isActive !== false,
        usageCount: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      promo: {
        ...newPromo,
        expiresAt: newPromo.expiresAt ? newPromo.expiresAt.toISOString() : null,
        createdAt: newPromo.createdAt.toISOString().split("T")[0],
      },
      message: `প্রোমো কোড "${newPromo.code}" সফলভাবে তৈরি হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Failed to create promo code:", error);
    return NextResponse.json(
      { ok: false, error: "প্রোমো কোড তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

