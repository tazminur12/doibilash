import { NextResponse } from "next/server";
import { getPublicOffersData } from "@/lib/offerService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPublicOffersData();
    return NextResponse.json({ ok: true, ...data });
  } catch (error: any) {
    console.error("Public offers error:", error);
    return NextResponse.json(
      { ok: false, error: "অফার লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
