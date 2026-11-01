import prisma from "@/lib/prisma";
import type { StoredCategory } from "@/lib/categoryStorage";

function mapPrismaCategory(c: any): StoredCategory {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    nameBn: c.nameBn,
    subtitle: c.subtitle || "",
    description: c.description || "",
    image: c.image || "",
    totalProducts: c.totalProducts || 0,
    highlights: (c.highlights as string[]) || [],
    tags: (c.tags as string[]) || [],
    productSlugs: (c.productSlugs as string[]) || [],
    isFeatured: Boolean(c.isFeatured),
    status: (c.status as "active" | "draft") || "active",
    createdAt: c.createdAt ? c.createdAt.toISOString().split("T")[0] : "",
  };
}

export async function getAdminCategories(): Promise<StoredCategory[]> {
  const categoriesRaw = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return categoriesRaw.map(mapPrismaCategory);
}

export async function getPublicCategories(): Promise<StoredCategory[]> {
  const categoriesRaw = await prisma.category.findMany({
    where: { status: "active" },
    orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return categoriesRaw.map(mapPrismaCategory);
}

export async function getCategoryByIdOrSlug(identifier: string): Promise<StoredCategory | null> {
  const c = await prisma.category.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
    },
  });
  if (!c) return null;
  return mapPrismaCategory(c);
}

