import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCategoryByIdOrSlug } from "@/lib/categoryService";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await getCategoryByIdOrSlug(id);
    if (!category) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, category });
  } catch (error: any) {
    console.error("Admin category GET by id error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি তথ্য লোড করতে সমস্যা হয়েছে।" },
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

    const existing = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const trimmedSlug = slug
      ? slug.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "")
      : existing.slug;

    // Check slug uniqueness if changed
    if (trimmedSlug !== existing.slug) {
      const duplicate = await prisma.category.findUnique({
        where: { slug: trimmedSlug },
      });
      if (duplicate && duplicate.id !== existing.id) {
        return NextResponse.json(
          { ok: false, error: `স্লাগ "${trimmedSlug}" ইতিমধ্যে অন্য একটি ক্যাটাগরিতে ব্যবহৃত হয়েছে।` },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.category.update({
      where: { id: existing.id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        nameBn: nameBn !== undefined ? nameBn.trim() : existing.nameBn,
        slug: trimmedSlug,
        subtitle: subtitle !== undefined ? subtitle.trim() : existing.subtitle,
        description: description !== undefined ? description.trim() : existing.description,
        image: image !== undefined ? image : existing.image,
        totalProducts: totalProducts !== undefined ? Number(totalProducts) : existing.totalProducts,
        highlights: highlights !== undefined ? highlights : existing.highlights,
        tags: tags !== undefined ? tags : existing.tags,
        productSlugs: productSlugs !== undefined ? productSlugs : existing.productSlugs,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured,
        status: status !== undefined ? status : existing.status,
        order: order !== undefined ? Number(order) : existing.order,
      },
    });

    return NextResponse.json({
      ok: true,
      category: {
        ...updated,
        createdAt: updated.createdAt.toISOString().split("T")[0],
      },
      message: `ক্যাটাগরি "${updated.nameBn}" সফলভাবে আপডেট হয়েছে!`,
    });
  } catch (error: any) {
    console.error("Admin category PUT error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি আপডেট করতে সমস্যা হয়েছে।" },
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
    const existing = await prisma.category.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "ক্যাটাগরিটি খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.category.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      ok: true,
      message: `ক্যাটাগরি "${existing.nameBn}" সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("Admin category DELETE error:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাটাগরি ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

