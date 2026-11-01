import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminPackages } from "@/lib/packageService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const packages = await getAdminPackages();
    return NextResponse.json({ ok: true, packages });
  } catch (error: any) {
    console.error("Admin packages GET error:", error);
    return NextResponse.json(
      { ok: false, error: "উপহার প্যাকেজের তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
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

    if (!title || !packagingType) {
      return NextResponse.json(
        { ok: false, error: "প্যাকেজের নাম এবং প্যাকেজিং ধরণ প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const numPrice = Number(price) || 0;
    const numOrig = Number(originalPrice) || numPrice;
    const discountPercent =
      numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

    const created = await prisma.giftPackage.create({
      data: {
        id: id || `PKG-${Date.now().toString().slice(-4)}`,
        title: title.trim(),
        subtitle: (subtitle || "").trim(),
        occasion: occasion || "ঈদ উৎসব",
        packagingType: packagingType.trim(),
        price: numPrice,
        originalPrice: numOrig,
        discountPercent,
        badge: badge || "উৎসব স্পেশাল",
        image: image || "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
        features: Array.isArray(features) ? features : [],
        components: Array.isArray(components) ? components : [],
        isFeatured: Boolean(isFeatured),
        status: status || "Active",
        availableStock: Number(availableStock) || 0,
        customGreetingAllowed: customGreetingAllowed !== false,
      },
    });

    return NextResponse.json({
      ok: true,
      package: {
        ...created,
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
      message: `উপহার প্যাকেজ "${created.title}" সফলভাবে তৈরি হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Admin package POST error:", error);
    return NextResponse.json(
      { ok: false, error: "উপহার প্যাকেজ তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

