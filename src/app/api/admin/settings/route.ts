import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_SETTINGS, StoreSettings } from "@/lib/settingsStorage";

export async function GET() {
  try {
    const record = await prisma.storeSetting.findUnique({
      where: { id: "default" },
    });

    if (!record) {
      console.log("[Settings API] No settings found in DB, auto-seeding defaults...");
      const newRecord = await prisma.storeSetting.create({
        data: {
          id: "default",
          data: DEFAULT_SETTINGS as any,
        },
      });
      return NextResponse.json({
        ok: true,
        settings: { ...DEFAULT_SETTINGS, ...(newRecord.data as object) },
      });
    }

    return NextResponse.json({
      ok: true,
      settings: { ...DEFAULT_SETTINGS, ...(record.data as object) },
      updatedAt: record.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("[Settings GET API Error]:", error);
    return NextResponse.json(
      { ok: false, error: "স্টোর সেটিংস লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "ভুল সেটিংস ডাটা প্রদান করা হয়েছে।" },
        { status: 400 }
      );
    }

    // Merge with defaults to ensure complete integrity
    const mergedSettings: StoreSettings = {
      ...DEFAULT_SETTINGS,
      ...body,
    };

    const updatedRecord = await prisma.storeSetting.upsert({
      where: { id: "default" },
      update: {
        data: mergedSettings as any,
      },
      create: {
        id: "default",
        data: mergedSettings as any,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "দই বিলাসের সমস্ত সেটিংস সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!",
      settings: updatedRecord.data,
      updatedAt: updatedRecord.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error("[Settings POST API Error]:", error);
    return NextResponse.json(
      { ok: false, error: "সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

