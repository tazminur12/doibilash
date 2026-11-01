import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if code belongs to another record
    const duplicate = await prisma.promoCode.findFirst({
      where: {
        code: normalizedCode,
        NOT: { id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { ok: false, error: `কোড "${normalizedCode}" অন্য একটি অফারে ইতিমধ্যে ব্যবহৃত হয়েছে।` },
        { status: 409 }
      );
    }

    const updated = await prisma.promoCode.update({
      where: { id },
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
      },
    });

    return NextResponse.json({
      ok: true,
      promo: {
        ...updated,
        expiresAt: updated.expiresAt ? updated.expiresAt.toISOString() : null,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
      message: `প্রোমো কোড "${updated.code}" সফলভাবে আপডেট করা হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Failed to update promo code:", error);
    return NextResponse.json(
      { ok: false, error: "প্রোমো কোড আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "প্রোমো কোডটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: `প্রোমো কোড "${existing.code}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Failed to delete promo code:", error);
    return NextResponse.json(
      { ok: false, error: "প্রোমো কোড ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

