import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      price,
      originalPrice,
      unit,
      badge,
      image,
      soldCount,
      totalStock,
      isActive,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { ok: false, error: "পণ্যের শিরোনাম এবং স্লাগ প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const created = await prisma.flashDeal.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        price: Number(price) || 0,
        originalPrice: Number(originalPrice) || 0,
        unit: unit || "১ প্যাক",
        badge: badge || "ফ্ল্যাশ সেল",
        image: image || "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
        soldCount: Number(soldCount) || 0,
        totalStock: Number(totalStock) || 10,
        isActive: isActive !== false,
      },
    });

    return NextResponse.json({
      ok: true,
      deal: {
        ...created,
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
      message: `ফ্ল্যাশ অফার "${created.title}" সফলভাবে তৈরি হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Failed to create flash deal:", error);
    return NextResponse.json(
      { ok: false, error: "ফ্ল্যাশ অফার তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

