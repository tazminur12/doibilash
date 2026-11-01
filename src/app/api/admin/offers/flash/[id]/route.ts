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

    const existing = await prisma.flashDeal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ফ্ল্যাশ ডিলটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const updated = await prisma.flashDeal.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        slug: slug !== undefined ? slug.trim() : existing.slug,
        price: price !== undefined ? Number(price) : existing.price,
        originalPrice: originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice,
        unit: unit !== undefined ? unit.trim() : existing.unit,
        badge: badge !== undefined ? badge.trim() : existing.badge,
        image: image !== undefined ? image : existing.image,
        soldCount: soldCount !== undefined ? Number(soldCount) : existing.soldCount,
        totalStock: totalStock !== undefined ? Number(totalStock) : existing.totalStock,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    return NextResponse.json({
      ok: true,
      deal: {
        ...updated,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
      message: `ফ্ল্যাশ অফার "${updated.title}" সফলভাবে আপডেট হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Failed to update flash deal:", error);
    return NextResponse.json(
      { ok: false, error: "ফ্ল্যাশ অফার আপডেট করতে সমস্যা হয়েছে।" },
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
    const existing = await prisma.flashDeal.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ফ্ল্যাশ ডিলটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.flashDeal.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: `ফ্ল্যাশ অফার "${existing.title}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Failed to delete flash deal:", error);
    return NextResponse.json(
      { ok: false, error: "ফ্ল্যাশ অফার ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

