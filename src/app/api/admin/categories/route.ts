import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminCategories } from "@/lib/categoryService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getAdminCategories();
    return NextResponse.json({ ok: true, categories });
  } catch (error: any) {
    console.error("Admin categories GET error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি তথ্য লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      nameBn,
      slug,
      subtitle,
      description,
      image,
      totalProducts,
      highlights,
      tags,
      productSlugs,
      isFeatured,
      status,
      order,
    } = body;

    const trimmedNameBn = (nameBn || "").trim();
    const trimmedSlug = (slug || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!trimmedNameBn) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরির বাংলা নাম প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    if (!trimmedSlug) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরির ইউনিক স্লাগ (Slug) প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug: trimmedSlug },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: `স্লাগ "${trimmedSlug}" ইতিমধ্যে অন্য একটি ক্যাটাগরিতে ব্যবহৃত হয়েছে।` },
        { status: 409 }
      );
    }

    const created = await prisma.category.create({
      data: {
        name: (name || trimmedNameBn).trim(),
        nameBn: trimmedNameBn,
        slug: trimmedSlug,
        subtitle: (subtitle || "").trim(),
        description: (description || "").trim(),
        image: image || "https://res.cloudinary.com/cwihms31/image/upload/v1793515853/doibilash/offers/doi_special.jpg",
        totalProducts: Number(totalProducts) || (Array.isArray(productSlugs) ? productSlugs.length : 0),
        highlights: Array.isArray(highlights) ? highlights : [],
        tags: Array.isArray(tags) ? tags : [],
        productSlugs: Array.isArray(productSlugs) ? productSlugs : [],
        isFeatured: Boolean(isFeatured),
        status: status || "active",
        order: Number(order) || 0,
      },
    });

    return NextResponse.json({
      ok: true,
      category: {
        ...created,
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
      message: `ক্যাটাগরি "${created.nameBn}" সফলভাবে তৈরি হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Admin category POST error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

