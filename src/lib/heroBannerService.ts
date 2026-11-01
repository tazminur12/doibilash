import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export type HeroBannerDTO = {
  id: string;
  imageUrl: string;
  publicId: string | null;
  altText: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const DEFAULT_HERO_BANNERS: HeroBannerDTO[] = [
  {
    id: "default-1",
    imageUrl: "/Hero/Hero1.png",
    publicId: null,
    altText: "বগুড়ার খাঁটি দই - দই বিলাস",
    link: "/shop",
    sortOrder: 0,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "default-2",
    imageUrl: "/Hero/Hero2.jpg",
    publicId: null,
    altText: "দই বিলাস স্পেশাল প্রিমিয়াম মিষ্টান্ন",
    link: "/shop",
    sortOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
];

function toDTO(row: {
  id: string;
  imageUrl: string;
  publicId: string | null;
  altText: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): HeroBannerDTO {
  return {
    id: row.id,
    imageUrl: row.imageUrl,
    publicId: row.publicId,
    altText: row.altText,
    link: row.link || "/shop",
    sortOrder: row.sortOrder,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listAllHeroBanners(): Promise<HeroBannerDTO[]> {
  const rows = await prisma.heroBanner.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDTO);
}

export async function listActiveHeroBanners(): Promise<HeroBannerDTO[]> {
  const rows = await prisma.heroBanner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toDTO);
}

/** Public home hero — cached briefly; falls back to bundled defaults when empty. */
export const getPublicHeroBanners = unstable_cache(
  async (): Promise<HeroBannerDTO[]> => {
    try {
      const banners = await listActiveHeroBanners();
      return banners.length > 0 ? banners : DEFAULT_HERO_BANNERS;
    } catch {
      return DEFAULT_HERO_BANNERS;
    }
  },
  ["public-hero-banners-v1"],
  { revalidate: 30, tags: ["public-hero-banners"] }
);

export async function createHeroBanner(input: {
  imageUrl: string;
  publicId?: string | null;
  altText?: string;
  link?: string;
  sortOrder?: number;
}): Promise<HeroBannerDTO> {
  const max = await prisma.heroBanner.aggregate({ _max: { sortOrder: true } });
  const nextOrder =
    typeof input.sortOrder === "number"
      ? input.sortOrder
      : (max._max.sortOrder ?? -1) + 1;

  const row = await prisma.heroBanner.create({
    data: {
      imageUrl: input.imageUrl,
      publicId: input.publicId || null,
      altText: input.altText?.trim() || "দই বিলাস হিরো ব্যানার",
      link: input.link?.trim() || "/shop",
      sortOrder: nextOrder,
      isActive: true,
    },
  });
  return toDTO(row);
}

export async function deleteHeroBanner(id: string): Promise<boolean> {
  try {
    await prisma.heroBanner.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function updateHeroBanner(
  id: string,
  input: Partial<{
    altText: string;
    link: string;
    sortOrder: number;
    isActive: boolean;
  }>
): Promise<HeroBannerDTO | null> {
  try {
    const row = await prisma.heroBanner.update({
      where: { id },
      data: {
        ...(input.altText !== undefined ? { altText: input.altText } : {}),
        ...(input.link !== undefined ? { link: input.link } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    });
    return toDTO(row);
  } catch {
    return null;
  }
}
