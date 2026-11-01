import prisma from "@/lib/prisma";
import { DEFAULT_PRODUCTS, type StoredProduct } from "@/lib/productStorage";

function mapPrismaProduct(p: {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  price: number;
  originalPrice: number | null;
  unit: string;
  stockStatus: string;
  stockQuantity: number;
  image: string;
  galleryImages: unknown;
  description: string;
  features: unknown;
  badge: string | null;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
}): StoredProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameEn: p.nameEn,
    category: p.category,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    unit: p.unit,
    stockStatus: (p.stockStatus === "Out of Stock" ? "Out of Stock" : "In Stock") as StoredProduct["stockStatus"],
    stockQuantity: p.stockQuantity,
    image: p.image,
    galleryImages: Array.isArray(p.galleryImages) ? (p.galleryImages as string[]) : [],
    description: p.description || "",
    features: Array.isArray(p.features) ? (p.features as string[]) : [],
    badge: p.badge || undefined,
    isFeatured: Boolean(p.isFeatured),
    rating: p.rating ?? 5,
    reviewsCount: p.reviewsCount ?? 0,
    createdAt: p.createdAt ? p.createdAt.toISOString().split("T")[0] : "",
  };
}

export async function ensureProductsSeeded() {
  const count = await prisma.product.count();
  if (count > 0) return;

  console.log("[Product Service] Seeding default products into Supabase...");
  for (const p of DEFAULT_PRODUCTS) {
    await prisma.product.create({
      data: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        nameEn: p.nameEn,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        unit: p.unit,
        stockStatus: p.stockStatus,
        stockQuantity: p.stockStatus === "In Stock" ? 50 : 0,
        image: p.image,
        galleryImages: p.galleryImages || [],
        description: p.description,
        features: p.features,
        badge: p.badge || null,
        isFeatured: Boolean(p.isFeatured),
        rating: p.rating ?? 5,
        reviewsCount: p.reviewsCount ?? 0,
        status: "Active",
      },
    });
  }
}

export async function getAdminProducts(): Promise<StoredProduct[]> {
  await ensureProductsSeeded();
  const rows = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapPrismaProduct);
}

export async function getPublicProducts(): Promise<StoredProduct[]> {
  await ensureProductsSeeded();
  const rows = await prisma.product.findMany({
    where: { status: "Active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(mapPrismaProduct);
}

/** Homepage top sellers — limited query, seed only if catalog empty */
export async function getTopSellingProducts(
  limit = 5
): Promise<StoredProduct[]> {
  const rows = await prisma.product.findMany({
    where: { status: "Active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: Math.max(1, Math.min(limit, 24)),
  });

  if (rows.length > 0) return rows.map(mapPrismaProduct);

  await ensureProductsSeeded();
  const seeded = await prisma.product.findMany({
    where: { status: "Active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: Math.max(1, Math.min(limit, 24)),
  });
  return seeded.map(mapPrismaProduct);
}

export async function getProductByIdOrSlugDb(
  identifier: string,
  opts?: { activeOnly?: boolean }
): Promise<StoredProduct | null> {
  const row = await prisma.product.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }],
      ...(opts?.activeOnly ? { status: "Active" } : {}),
    },
  });
  if (!row) return null;
  return mapPrismaProduct(row);
}
