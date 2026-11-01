import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.giftPackage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "প্যাকেজটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const nextStatus = existing.status === "Active" ? "Draft" : "Active";
    const updated = await prisma.giftPackage.update({
      where: { id },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      ok: true,
      status: updated.status,
      message:
        updated.status === "Active"
          ? `প্যাকেজ "${updated.title}" সক্রিয় (Active) করা হয়েছে!`
          : `প্যাকেজ "${updated.title}" খসড়া (Draft) করা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Admin package status toggle error:", error);
    return NextResponse.json(
      { ok: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

