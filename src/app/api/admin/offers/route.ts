import { NextResponse } from "next/server";
import { getAdminOffersData } from "@/lib/offerService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAdminOffersData();
    return NextResponse.json({ ok: true, ...data });
  } catch (error: any) {
    console.error("Failed to fetch admin offers:", error);
    return NextResponse.json(
      { ok: false, error: "অফার ও প্রোমো কোডের তথ্য লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}
