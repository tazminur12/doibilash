import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.flashDeal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ফ্ল্যাশ অফারটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const updated = await prisma.flashDeal.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    return NextResponse.json({
      ok: true,
      isActive: updated.isActive,
      message: updated.isActive
        ? `ফ্ল্যাশ অফার "${updated.title}" সক্রিয় (Active) করা হয়েছে!`
        : `ফ্ল্যাশ অফার "${updated.title}" স্থগিত (Inactive) করা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Failed to toggle flash deal status:", error);
    return NextResponse.json(
      { ok: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

