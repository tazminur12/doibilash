import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminProducts } from "@/lib/productService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getAdminProducts();
    return NextResponse.json({ ok: true, products });
  } catch (error: unknown) {
    console.error("Admin products GET error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য তালিকা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      slug,
      name,
      nameEn,
      category,
      price,
      originalPrice,
      unit,
      stockStatus,
      stockQuantity,
      image,
      galleryImages,
      description,
      features,
      badge,
      isFeatured,
      rating,
      reviewsCount,
      status,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "পণ্যের বাংলা নাম প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || nameEn || name)
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    if (!cleanSlug) {
      return NextResponse.json(
        { ok: false, error: "পণ্যের URL slug প্রদান করুন।" },
        { status: 400 }
      );
    }

    const existingSlug = await prisma.product.findUnique({ where: { slug: cleanSlug } });
    if (existingSlug) {
      return NextResponse.json(
        { ok: false, error: "এই slug দিয়ে ইতিমধ্যে একটি পণ্য আছে। অন্য slug দিন।" },
        { status: 409 }
      );
    }

    const numPrice = Number(price) || 0;
    if (numPrice <= 0) {
      return NextResponse.json(
        { ok: false, error: "পণ্যের সঠিক মূল্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    const numOrig =
      originalPrice !== undefined && originalPrice !== null && originalPrice !== ""
        ? Number(originalPrice)
        : null;

    const qty = Number(stockQuantity);
    const resolvedStockStatus =
      stockStatus === "Out of Stock" || qty === 0 ? "Out of Stock" : "In Stock";

    const created = await prisma.product.create({
      data: {
        id: id || `PROD-${Date.now().toString().slice(-6)}`,
        slug: cleanSlug,
        name: name.trim(),
        nameEn: (nameEn && String(nameEn).trim()) || name.trim(),
        category: (category && String(category).trim()) || "প্রিমিয়াম দই",
        price: numPrice,
        originalPrice: numOrig && numOrig > 0 ? numOrig : null,
        unit: (unit && String(unit).trim()) || "১ কেজি মাটির সরা",
        stockStatus: resolvedStockStatus,
        stockQuantity: Number.isFinite(qty) ? Math.max(0, qty) : resolvedStockStatus === "In Stock" ? 50 : 0,
        image: image || "/Product/doi.jpg",
        galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
        description:
          (description && String(description).trim()) ||
          `${name.trim()} — বগুড়ার আদি ও খাঁটি স্বাদের সেরা পণ্য।`,
        features: Array.isArray(features) ? features : [],
        badge: badge ? String(badge).trim() : null,
        isFeatured: Boolean(isFeatured),
        rating: Number(rating) || 5,
        reviewsCount: Number(reviewsCount) || 0,
        status: status || "Active",
      },
    });

    return NextResponse.json({
      ok: true,
      message: `পণ্য "${created.name}" সফলভাবে সুপাবেস ডাটাবেজে যুক্ত হয়েছে!`,
      product: {
        id: created.id,
        slug: created.slug,
        name: created.name,
        nameEn: created.nameEn,
        category: created.category,
        price: created.price,
        originalPrice: created.originalPrice ?? undefined,
        unit: created.unit,
        stockStatus: created.stockStatus,
        stockQuantity: created.stockQuantity,
        image: created.image,
        galleryImages: created.galleryImages,
        description: created.description,
        features: created.features,
        badge: created.badge ?? undefined,
        isFeatured: created.isFeatured,
        rating: created.rating,
        reviewsCount: created.reviewsCount,
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: unknown) {
    console.error("Admin products POST error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
