import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_CUSTOMERS } from "@/lib/customerStorage";

function generateInitials(name: string): string {
  if (!name) return "গ্রা";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] || "") + (parts[1][0] || "");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const tier = searchParams.get("tier");
    const status = searchParams.get("status");
    const city = searchParams.get("city");

    // 1. Auto-seed if empty
    const count = await prisma.customer.count();
    if (count === 0) {
      console.log("[Customers API] No customers found in DB, auto-seeding defaults...");
      for (const c of DEFAULT_CUSTOMERS) {
        await prisma.customer.create({
          data: {
            name: c.name,
            phone: c.phone.trim(),
            email: c.email ? c.email.toLowerCase().trim() : null,
            address: c.address || "",
            city: c.city || "ঢাকা সিটি",
            tier: c.tier || "Regular",
            status: c.status || "Active",
            totalOrders: c.totalOrders || 0,
            totalSpent: c.totalSpent || 0,
            notes: c.notes || "",
            preferences: c.preferences || [],
            avatarInitials: c.avatarInitials || generateInitials(c.name),
          },
        });
      }
    }

    // 2. Fetch all customers from Supabase
    const dbCustomers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    // 3. Enrich with live orders data
    const allOrders = await prisma.order.findMany({
      select: {
        customerPhone: true,
        totalAmount: true,
      },
    });

    // Map order totals by customer phone
    const orderAggregates: Record<string, { count: number; spent: number }> = {};
    for (const ord of allOrders) {
      const cleanPhone = ord.customerPhone.trim().replace(/[\s-]/g, "");
      if (!orderAggregates[cleanPhone]) {
        orderAggregates[cleanPhone] = { count: 0, spent: 0 };
      }
      orderAggregates[cleanPhone].count += 1;
      orderAggregates[cleanPhone].spent += ord.totalAmount || 0;
    }

    // Format customers for frontend
    let list = dbCustomers.map((c) => {
      const cleanPhone = c.phone.trim().replace(/[\s-]/g, "");
      const liveOrders = orderAggregates[cleanPhone];
      
      const totalOrders = (c.totalOrders || 0) + (liveOrders?.count || 0);
      const totalSpent = (c.totalSpent || 0) + (liveOrders?.spent || 0);

      // Auto upgrade tier if high spender
      let currentTier = c.tier;
      if (totalSpent >= 15000 && currentTier !== "VIP" && currentTier !== "Wholesale") {
        currentTier = "VIP";
      } else if (totalSpent >= 10000 && currentTier === "Regular") {
        currentTier = "Gold";
      }

      const prefs = Array.isArray(c.preferences) ? (c.preferences as string[]) : [];

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || undefined,
        address: c.address || "",
        city: (c.city as "ঢাকা সিটি" | "ঢাকার বাইরে") || "ঢাকা সিটি",
        totalOrders,
        totalSpent,
        tier: currentTier as any,
        status: (c.status as "Active" | "Inactive") || "Active",
        joinedDate: c.createdAt.toLocaleDateString("bn-BD", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        notes: c.notes || "",
        preferences: prefs,
        avatarInitials: c.avatarInitials || generateInitials(c.name),
        avatarUrl: c.avatarUrl || undefined,
      };
    });

    // 4. Apply filters
    if (search) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.phone.includes(search) ||
          (c.email && c.email.toLowerCase().includes(search)) ||
          c.address.toLowerCase().includes(search)
      );
    }
    if (tier && tier !== "ALL") {
      list = list.filter((c) => c.tier === tier);
    }
    if (status && status !== "ALL") {
      list = list.filter((c) => c.status === status);
    }
    if (city && city !== "ALL") {
      list = list.filter((c) => c.city === city);
    }

    // 5. Calculate live executive metrics
    const totalCustomers = dbCustomers.length;
    const activeCustomers = dbCustomers.filter((c) => c.status === "Active").length;
    const vipOrGoldCustomers = list.filter(
      (c) => c.tier === "VIP" || c.tier === "Gold"
    ).length;
    const totalRevenue = list.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

    return NextResponse.json({
      ok: true,
      customers: list,
      metrics: {
        totalCustomers,
        activeCustomers,
        vipOrGoldCustomers,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error("[Customers GET Error]:", error);
    return NextResponse.json(
      { ok: false, error: "গ্রাহকদের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, tier, status, notes, preferences } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে গ্রাহকের পুরো নাম দিন।" },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || "").trim();
    if (!cleanPhone) {
      return NextResponse.json(
        { ok: false, error: "সঠিক মোবাইল নম্বর প্রদান করুন।" },
        { status: 400 }
      );
    }

    // Check phone uniqueness
    const existingPhone = await prisma.customer.findFirst({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { ok: false, error: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একজন গ্রাহক নিবন্ধিত আছেন।" },
        { status: 409 }
      );
    }

    // Clean optional email
    const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null;
    if (cleanEmail) {
      const existingEmail = await prisma.customer.findFirst({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { ok: false, error: "এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একজন গ্রাহক নিবন্ধিত আছেন।" },
          { status: 409 }
        );
      }
    }

    const initials = generateInitials(name);
    const safePrefs = Array.isArray(preferences) ? preferences : [];

    const newCustomer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phone: cleanPhone,
        email: cleanEmail,
        address: address ? address.trim() : "",
        city: city || "ঢাকা সিটি",
        tier: tier || "Regular",
        status: status || "Active",
        notes: notes ? notes.trim() : "",
        preferences: safePrefs,
        avatarInitials: initials,
        totalOrders: 0,
        totalSpent: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      message: `গ্রাহক "${newCustomer.name}" সফলভাবে ডাটাবেজে তৈরি করা হয়েছে!`,
      customer: {
        id: newCustomer.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email || undefined,
        address: newCustomer.address,
        city: newCustomer.city,
        tier: newCustomer.tier,
        status: newCustomer.status,
        totalOrders: 0,
        totalSpent: 0,
        notes: newCustomer.notes,
        preferences: newCustomer.preferences,
        avatarInitials: newCustomer.avatarInitials,
        joinedDate: "আজকে",
      },
    });
  } catch (error: any) {
    console.error("[Customers POST Error]:", error);
    return NextResponse.json(
      { ok: false, error: "গ্রাহক তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

