import prisma from "@/lib/prisma";
import type { PackageOccasion, PackageStatus, PackageItemComponent } from "@/lib/packageStorage";

export interface PackageData {
  id: string;
  title: string;
  subtitle: string;
  occasion: PackageOccasion;
  packagingType: string;
  price: number;
  originalPrice: number;
  discountPercent?: number | null;
  badge: string;
  image: string;
  features: string[];
  components: PackageItemComponent[];
  isFeatured: boolean;
  status: PackageStatus;
  availableStock: number;
  customGreetingAllowed: boolean;
  createdAt: string;
}

function mapPrismaPackage(p: any): PackageData {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    occasion: p.occasion as PackageOccasion,
    packagingType: p.packagingType,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    badge: p.badge,
    image: p.image,
    features: (p.features as string[]) || [],
    components: (p.components as PackageItemComponent[]) || [],
    isFeatured: p.isFeatured,
    status: p.status as PackageStatus,
    availableStock: p.availableStock,
    customGreetingAllowed: p.customGreetingAllowed,
    createdAt: p.createdAt ? p.createdAt.toISOString().split("T")[0] : "",
  };
}

export async function getAdminPackages() {
  const packagesRaw = await prisma.giftPackage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return packagesRaw.map(mapPrismaPackage);
}

export async function getPublicPackages() {
  const packagesRaw = await prisma.giftPackage.findMany({
    where: { status: "Active" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  return packagesRaw.map(mapPrismaPackage);
}

export async function getPackageById(id: string) {
  const p = await prisma.giftPackage.findUnique({
    where: { id },
  });
  if (!p) return null;
  return mapPrismaPackage(p);
}

