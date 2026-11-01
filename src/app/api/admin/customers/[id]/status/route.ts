import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (status !== "Active" && status !== "Inactive") {
      return NextResponse.json(
        { ok: false, error: "অবৈধ স্ট্যাটাস ভ্যালু।" },
        { status: 400 }
      );
    }

    const existing = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { phone: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহক পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const updated = await prisma.customer.update({
      where: { id: existing.id },
      data: { status },
    });

    return NextResponse.json({
      ok: true,
      message: `${updated.name}-এর স্ট্যাটাস ${status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে।`,
      customer: updated,
    });
  } catch (error: any) {
    console.error("[Customer Status PATCH Error]:", error);
    return NextResponse.json(
      { ok: false, error: "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

