import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/settingsStorage";

export async function GET() {
  try {
    const record = await prisma.storeSetting.findUnique({
      where: { id: "default" },
    });

    const data = record ? (record.data as any) : DEFAULT_SETTINGS;

    return NextResponse.json({
      ok: true,
      settings: { ...DEFAULT_SETTINGS, ...data },
    });
  } catch (error: any) {
    console.error("[Public Settings API Error]:", error);
    return NextResponse.json({
      ok: true,
      settings: DEFAULT_SETTINGS,
    });
  }
}

