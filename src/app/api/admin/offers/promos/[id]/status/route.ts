import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
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

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    return NextResponse.json({
      ok: true,
      isActive: updated.isActive,
      message: updated.isActive
        ? `প্রোমো কোড "${updated.code}" সক্রিয় (Active) করা হয়েছে!`
        : `প্রোমো কোড "${updated.code}" নিষ্ক্রিয় (Inactive) করা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Failed to toggle promo status:", error);
    return NextResponse.json(
      { ok: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

