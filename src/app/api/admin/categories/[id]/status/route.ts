import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const nextStatus = existing.status === "active" ? "draft" : "active";
    const updated = await prisma.category.update({
      where: { id: existing.id },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      ok: true,
      status: updated.status,
      message:
        updated.status === "active"
          ? `ক্যাটাগরি "${updated.nameBn}" সক্রিয় (Active) করা হয়েছে!`
          : `ক্যাটাগরি "${updated.nameBn}" খসড়া (Draft) করা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Admin category status toggle error:", error);
    return NextResponse.json(
      { ok: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

