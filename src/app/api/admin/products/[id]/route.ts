import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getProductByIdOrSlugDb } from "@/lib/productService";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductByIdOrSlugDb(id);
    if (!product) {
      return NextResponse.json(
        { ok: false, error: "পণ্যটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, product });
  } catch (error: unknown) {
    console.error("Admin product GET error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য লোড করতে সমস্যা হয়েছে।" },
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

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "পণ্যটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const {
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

    let cleanSlug = existing.slug;
    if (slug !== undefined) {
      cleanSlug = String(slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      if (cleanSlug !== existing.slug) {
        const conflict = await prisma.product.findFirst({
          where: { slug: cleanSlug, NOT: { id: existing.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই slug অন্য একটি পণ্যে ব্যবহৃত হচ্ছে।" },
            { status: 409 }
          );
        }
      }
    }

    const numPrice = price !== undefined ? Number(price) : existing.price;
    if (numPrice <= 0) {
      return NextResponse.json(
        { ok: false, error: "পণ্যের সঠিক মূল্য প্রদান করুন।" },
        { status: 400 }
      );
    }

    let numOrig = existing.originalPrice;
    if (originalPrice !== undefined) {
      numOrig =
        originalPrice === null || originalPrice === ""
          ? null
          : Number(originalPrice) || null;
    }

    const qty =
      stockQuantity !== undefined
        ? Math.max(0, Number(stockQuantity) || 0)
        : existing.stockQuantity;

    let resolvedStock =
      stockStatus !== undefined ? String(stockStatus) : existing.stockStatus;
    if (stockQuantity !== undefined && qty === 0) {
      resolvedStock = "Out of Stock";
    } else if (stockStatus === "In Stock" || stockStatus === "Out of Stock") {
      resolvedStock = stockStatus;
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
        slug: cleanSlug,
        name: name !== undefined ? String(name).trim() : existing.name,
        nameEn:
          nameEn !== undefined
            ? String(nameEn).trim() || existing.nameEn
            : existing.nameEn,
        category:
          category !== undefined
            ? String(category).trim() || existing.category
            : existing.category,
        price: numPrice,
        originalPrice: numOrig && numOrig > 0 ? numOrig : null,
        unit: unit !== undefined ? String(unit).trim() || existing.unit : existing.unit,
        stockStatus: resolvedStock,
        stockQuantity: qty,
        image: image !== undefined ? image : existing.image,
        galleryImages:
          galleryImages !== undefined ? galleryImages : existing.galleryImages,
        description:
          description !== undefined
            ? String(description).trim()
            : existing.description,
        features: features !== undefined ? features : existing.features,
        badge:
          badge !== undefined
            ? badge
              ? String(badge).trim()
              : null
            : existing.badge,
        isFeatured:
          isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        rating: rating !== undefined ? Number(rating) || existing.rating : existing.rating,
        reviewsCount:
          reviewsCount !== undefined
            ? Number(reviewsCount) || 0
            : existing.reviewsCount,
        status: status !== undefined ? status : existing.status,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `পণ্য "${updated.name}" সফলভাবে আপডেট হয়েছে!`,
      product: {
        id: updated.id,
        slug: updated.slug,
        name: updated.name,
        nameEn: updated.nameEn,
        category: updated.category,
        price: updated.price,
        originalPrice: updated.originalPrice ?? undefined,
        unit: updated.unit,
        stockStatus: updated.stockStatus,
        stockQuantity: updated.stockQuantity,
        image: updated.image,
        galleryImages: updated.galleryImages,
        description: updated.description,
        features: updated.features,
        badge: updated.badge ?? undefined,
        isFeatured: updated.isFeatured,
        rating: updated.rating,
        reviewsCount: updated.reviewsCount,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
    });
  } catch (error: unknown) {
    console.error("Admin product PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "পণ্যটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: existing.id } });

    return NextResponse.json({
      ok: true,
      message: `পণ্য "${existing.name}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: unknown) {
    console.error("Admin product DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "পণ্য ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
