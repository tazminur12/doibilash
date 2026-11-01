import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Search by ID or phone
    const customer = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { phone: id }],
      },
    });

    if (!customer) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহক খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // Load customer's live orders from orders table
    const cleanPhone = customer.phone.trim().replace(/[\s-]/g, "");
    const rawOrders = await prisma.order.findMany({
      where: {
        OR: [
          { customerPhone: customer.phone },
          { customerPhone: cleanPhone },
          { customerName: customer.name },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    const orders = rawOrders.map((o) => {
      const statusMap: Record<string, string> = {
        PENDING: "Processing",
        PROCESSING: "Processing",
        SHIPPED: "Shipped",
        DELIVERED: "Delivered",
        CANCELLED: "Cancelled",
      };

      const rawItems = Array.isArray(o.items) ? o.items : [];
      return {
        id: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail || "",
        shippingAddress:
          typeof o.shippingAddress === "string"
            ? o.shippingAddress
            : (o.shippingAddress as any)?.fullAddress || "ঢাকা",
        city: "ঢাকা সিটি",
        status: statusMap[o.status] || "Processing",
        deliveryMethod: o.deliveryMethod,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        deliveryCharge: o.deliveryCharge,
        discount: o.discount,
        totalAmount: o.totalAmount,
        items: rawItems.map((it: any) => ({
          name: it.title || it.name || "দই বিলাসের পণ্য",
          quantity: it.quantity || it.qty || 1,
          price: it.price || 0,
        })),
        createdAt: o.createdAt.toLocaleDateString("bn-BD", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
      };
    });

    const totalOrders = (customer.totalOrders || 0) + orders.length;
    const totalSpent =
      (customer.totalSpent || 0) +
      orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const safeCustomer = {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
      address: customer.address || "",
      city: customer.city || "ঢাকা সিটি",
      tier: customer.tier,
      status: customer.status,
      totalOrders,
      totalSpent,
      notes: customer.notes || "",
      preferences: Array.isArray(customer.preferences) ? customer.preferences : [],
      avatarInitials: customer.avatarInitials,
      avatarUrl: customer.avatarUrl || undefined,
      joinedDate: customer.createdAt.toLocaleDateString("bn-BD", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return NextResponse.json({
      ok: true,
      customer: safeCustomer,
      orders,
    });
  } catch (error: any) {
    console.error("[Customer [id] GET Error]:", error);
    return NextResponse.json(
      { ok: false, error: "গ্রাহকের তথ্য লোড করতে সমস্যা হয়েছে।" },
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
    const { name, phone, email, address, city, tier, status, notes, preferences } = body;

    const existing = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { phone: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহক খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (name && typeof name === "string") dataToUpdate.name = name.trim();
    if (address !== undefined) dataToUpdate.address = typeof address === "string" ? address.trim() : "";
    if (city && typeof city === "string") dataToUpdate.city = city.trim();
    if (tier && typeof tier === "string") dataToUpdate.tier = tier;
    if (status && typeof status === "string") dataToUpdate.status = status;
    if (notes !== undefined) dataToUpdate.notes = typeof notes === "string" ? notes.trim() : "";
    if (Array.isArray(preferences)) dataToUpdate.preferences = preferences;

    // If changing phone, check uniqueness
    if (phone && typeof phone === "string") {
      const cleanPhone = phone.trim();
      if (cleanPhone !== existing.phone) {
        const conflict = await prisma.customer.findFirst({
          where: { phone: cleanPhone, NOT: { id: existing.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই মোবাইল নম্বর অন্য একজন গ্রাহকের জন্য নিবন্ধিত আছে।" },
            { status: 409 }
          );
        }
        dataToUpdate.phone = cleanPhone;
      }
    }

    // If changing email, check uniqueness
    if (email !== undefined) {
      const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null;
      if (cleanEmail && cleanEmail !== existing.email) {
        const conflict = await prisma.customer.findFirst({
          where: { email: cleanEmail, NOT: { id: existing.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই ইমেইল ঠিকানা অন্য একজন গ্রাহকের জন্য নিবন্ধিত আছে।" },
            { status: 409 }
          );
        }
      }
      dataToUpdate.email = cleanEmail;
    }

    const updated = await prisma.customer.update({
      where: { id: existing.id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ok: true,
      message: `গ্রাহক "${updated.name}"-এর তথ্য সফলভাবে আপডেট করা হয়েছে!`,
      customer: updated,
    });
  } catch (error: any) {
    console.error("[Customer [id] PUT Error]:", error);
    return NextResponse.json(
      { ok: false, error: "গ্রাহকের তথ্য আপডেট করতে সমস্যা হয়েছে।" },
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

    const existing = await prisma.customer.findFirst({
      where: {
        OR: [{ id }, { phone: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "গ্রাহক খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    await prisma.customer.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      ok: true,
      message: `গ্রাহক "${existing.name}" কে সফলভাবে মুছে ফেলা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("[Customer [id] DELETE Error]:", error);
    return NextResponse.json(
      { ok: false, error: "গ্রাহক মুছে ফেলতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

