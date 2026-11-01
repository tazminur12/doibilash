import { NextResponse } from "next/server";
import { getPublicHeroBanners } from "@/lib/heroBannerService";

export async function GET() {
  try {
    const banners = await getPublicHeroBanners();
    return NextResponse.json({ ok: true, banners });
  } catch (error: unknown) {
    console.error("Public hero banners error:", error);
    return NextResponse.json(
      { ok: false, error: "হিরো ব্যানার লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}
