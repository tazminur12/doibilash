import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPackageById } from "@/lib/packageService";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkg = await getPackageById(id);
    if (!pkg) {
      return NextResponse.json(
        { ok: false, error: "প্যাকেজটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, package: pkg });
  } catch (error: any) {
    console.error("Admin package GET by id error:", error);
    return NextResponse.json(
      { ok: false, error: "প্যাকেজ লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      subtitle,
      occasion,
      packagingType,
      price,
      originalPrice,
      badge,
      image,
      features,
      components,
      isFeatured,
      status,
      availableStock,
      customGreetingAllowed,
    } = body;

    const existing = await prisma.giftPackage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "প্যাকেজটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const numPrice = price !== undefined ? Number(price) : existing.price;
    const numOrig = originalPrice !== undefined ? Number(originalPrice) : existing.originalPrice;
    const discountPercent =
      numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

    const updated = await prisma.giftPackage.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : existing.title,
        subtitle: subtitle !== undefined ? subtitle.trim() : existing.subtitle,
        occasion: occasion !== undefined ? occasion : existing.occasion,
        packagingType: packagingType !== undefined ? packagingType.trim() : existing.packagingType,
        price: numPrice,
        originalPrice: numOrig,
        discountPercent,
        badge: badge !== undefined ? badge.trim() : existing.badge,
        image: image !== undefined ? image : existing.image,
        features: features !== undefined ? features : existing.features,
        components: components !== undefined ? components : existing.components,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        status: status !== undefined ? status : existing.status,
        availableStock: availableStock !== undefined ? Number(availableStock) : existing.availableStock,
        customGreetingAllowed:
          customGreetingAllowed !== undefined ? Boolean(customGreetingAllowed) : existing.customGreetingAllowed,
      },
    });

    return NextResponse.json({
      ok: true,
      package: {
        ...updated,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
      message: `উপহার প্যাকেজ "${updated.title}" সফলভাবে আপডেট হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Admin package PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "উপহার প্যাকেজ আপডেট করতে সমস্যা হয়েছে।" },
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
    const existing = await prisma.giftPackage.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "প্যাকেজটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.giftPackage.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: `উপহার প্যাকেজ "${existing.title}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Admin package DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "উপহার প্যাকেজ ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

