import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizePhone(raw: string): string {
  return String(raw).replace(/[\s-]/g, "").replace(/^\+?88/, "");
}

/** Public corporate / bulk inquiry → New Lead in admin */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      company,
      phone,
      email,
      eventType,
      quantity,
      date,
      message,
    } = body;

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { ok: false, error: "আপনার নাম প্রদান করুন।" },
        { status: 400 }
      );
    }

    const cleanPhone = normalizePhone(String(phone || ""));
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { ok: false, error: "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)।" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    let quotationNo = "";
    for (let i = 0; i < 6; i++) {
      const candidate = `QT-DB-${Math.floor(100 + Math.random() * 900)}`;
      const exists = await prisma.corporateOrder.findUnique({
        where: { quotationNo: candidate },
      });
      if (!exists) {
        quotationNo = candidate;
        break;
      }
    }
    if (!quotationNo) {
      quotationNo = `QT-DB-${Date.now().toString().slice(-6)}`;
    }

    const companyName =
      (company && String(company).trim()) ||
      `${String(name).trim()} (ব্যক্তিগত)`;

    const noteParts = [
      message ? String(message).trim() : "",
      "উৎস: পাবলিক কন্টাক্ট ফর্ম",
    ].filter(Boolean);

    const created = await prisma.corporateOrder.create({
      data: {
        id: `CORP-${year}-${Date.now().toString().slice(-4)}`,
        quotationNo,
        companyName,
        contactPerson: String(name).trim(),
        designation: "",
        phone: cleanPhone,
        email: email ? String(email).trim().toLowerCase() : "",
        eventType: eventType ? String(eventType).trim() : "কর্পোরেট গিফটিং",
        deliveryDate: date ? String(date).trim() : "",
        deliveryAddress: "",
        approxQuantityText: quantity ? String(quantity).trim() : "",
        items: [],
        subtotal: 0,
        totalBudget: 0,
        dueAmount: 0,
        status: "New Lead",
        notes: noteParts.join("\n"),
      },
    });

    return NextResponse.json({
      ok: true,
      message: "আপনার অনুরোধ গ্রহণ করা হয়েছে। টিম শীঘ্রই যোগাযোগ করবে।",
      quotationNo: created.quotationNo,
      id: created.id,
    });
  } catch (error: unknown) {
    console.error("Public corporate POST error:", error);
    return NextResponse.json(
      { ok: false, error: "অনুরোধ জমা দিতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
