import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { mapPrismaOrderToStored } from "@/lib/orderService";
import type { StoredOrder } from "@/lib/orderStorage";
import type { StoredProduct } from "@/lib/productStorage";
import type { CorporateOrder } from "@/lib/corporateOrderStorage";
import { getAdminCorporateOrders } from "@/lib/corporateOrderService";

export const dynamic = "force-dynamic";

const BN_WEEKDAYS = [
  { day: "শনি", full: "শনিবার", js: 6 },
  { day: "রবি", full: "রবিবার", js: 0 },
  { day: "সোম", full: "সোমবার", js: 1 },
  { day: "মঙ্গল", full: "মঙ্গলবার", js: 2 },
  { day: "বুধ", full: "বুধবার", js: 3 },
  { day: "বৃহঃ", full: "বৃহস্পতিবার", js: 4 },
  { day: "শুক্র", full: "শুক্রবার", js: 5 },
] as const;

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function buildWeeklySeries(orders: { createdAt: Date; totalAmount: number }[]) {
  const today = startOfDay(new Date());
  // Last 7 days ending today (oldest → newest)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return startOfDay(d);
  });

  const amounts = days.map((dayStart) => {
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const dayOrders = orders.filter(
      (o) => o.createdAt >= dayStart && o.createdAt < dayEnd
    );
    const amount = dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    return { amount, orders: dayOrders.length, date: dayStart };
  });

  const maxAmount = Math.max(...amounts.map((a) => a.amount), 1);

  return amounts.map((a) => {
    const jsDay = a.date.getDay();
    const meta = BN_WEEKDAYS.find((w) => w.js === jsDay) || BN_WEEKDAYS[0];
    const isToday = a.date.getTime() === today.getTime();
    return {
      day: isToday ? `${meta.day}` : meta.day,
      full: isToday ? `${meta.full} (আজ)` : meta.full,
      amount: Math.round(a.amount),
      orders: a.orders,
      height: Math.max(8, Math.round((a.amount / maxAmount) * 100)),
      isToday,
    };
  });
}

export async function GET() {
  try {
    const [
      orderRows,
      productCount,
      inStockCount,
      customerCount,
      vipGoldCount,
      categoryCount,
      packageCount,
      teamCount,
      corporateOrders,
      flashDealCount,
    ] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
      prisma.product.count(),
      prisma.product.count({ where: { stockStatus: "In Stock" } }),
      prisma.customer.count(),
      prisma.customer.count({
        where: { OR: [{ tier: "VIP" }, { tier: "Gold" }] },
      }),
      prisma.category.count(),
      prisma.giftPackage.count(),
      prisma.teamMember.count(),
      getAdminCorporateOrders(),
      prisma.flashDeal.count().catch(() => 0),
    ]);

    const storedOrders: StoredOrder[] = orderRows.map(mapPrismaOrderToStored);
    const recentOrders = storedOrders.slice(0, 5);

    const totalRevenue = storedOrders.reduce(
      (sum, o) => sum + (o.totalAmount || 0),
      0
    );
    const totalOrdersCount = storedOrders.length;
    const pendingOrProcessingOrders = storedOrders.filter(
      (o) => o.status === "Pending" || o.status === "Processing"
    ).length;
    const shippedOrders = storedOrders.filter((o) => o.status === "Shipped").length;
    const deliveredOrders = storedOrders.filter(
      (o) => o.status === "Delivered"
    ).length;
    const cancelledOrders = storedOrders.filter(
      (o) => o.status === "Cancelled"
    ).length;
    const aov =
      totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const weekOrdersRaw = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: (() => {
            const d = new Date();
            d.setDate(d.getDate() - 6);
            d.setHours(0, 0, 0, 0);
            return d;
          })(),
        },
      },
      select: { createdAt: true, totalAmount: true },
    });

    const weekly = buildWeeklySeries(weekOrdersRaw);
    const weekTotal = weekly.reduce((s, d) => s + d.amount, 0);
    const weekMin = weekly.length ? Math.min(...weekly.map((d) => d.amount)) : 0;
    const weekMax = weekly.length ? Math.max(...weekly.map((d) => d.amount)) : 0;

    // Featured / recent products for shelf
    const productRows = await prisma.product.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: 4,
    });

    const products: StoredProduct[] = productRows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameEn: p.nameEn,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      unit: p.unit,
      stockStatus:
        p.stockStatus === "Out of Stock" ? "Out of Stock" : "In Stock",
      stockQuantity: p.stockQuantity,
      image: p.image,
      galleryImages: Array.isArray(p.galleryImages)
        ? (p.galleryImages as string[])
        : [],
      description: p.description,
      features: Array.isArray(p.features) ? (p.features as string[]) : [],
      badge: p.badge ?? undefined,
      isFeatured: p.isFeatured,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
      createdAt: p.createdAt.toISOString().split("T")[0],
    }));

    const totalCorporatePipeline = corporateOrders.reduce(
      (s, c) => s + (c.totalBudget || 0),
      0
    );
    const corporateInProduction = corporateOrders.filter(
      (c) => c.status === "In Production"
    ).length;

    return NextResponse.json({
      ok: true,
      generatedAt: new Date().toISOString(),
      kpis: {
        totalRevenue,
        aov,
        totalOrdersCount,
        pendingOrProcessingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalCustomersCount: customerCount,
        vipCustomersCount: vipGoldCount,
        totalProductsCount: productCount,
        inStockProducts: inStockCount,
        categoryCount,
        packageCount,
        teamCount,
        flashDealCount,
        totalCorporatePipeline,
        corporateInProduction,
        corporateCount: corporateOrders.length,
      },
      weekly: {
        days: weekly,
        total: weekTotal,
        min: weekMin,
        max: weekMax,
      },
      recentOrders,
      products,
      corporateOrders: corporateOrders.slice(0, 3) as CorporateOrder[],
    });
  } catch (error: unknown) {
    console.error("[Admin Dashboard API Error]:", error);
    return NextResponse.json(
      { ok: false, error: "ড্যাশবোর্ড ডাটা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
