import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createHeroBanner,
  listAllHeroBanners,
} from "@/lib/heroBannerService";

export async function GET() {
  try {
    const banners = await listAllHeroBanners();
    return NextResponse.json({ ok: true, banners });
  } catch (error: unknown) {
    console.error("Admin hero banners list error:", error);
    return NextResponse.json(
      { ok: false, error: "হিরো ব্যানার লোড করা যায়নি।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, error: "ছবির URL প্রয়োজন।" },
        { status: 400 }
      );
    }

    const banner = await createHeroBanner({
      imageUrl,
      publicId: typeof body.publicId === "string" ? body.publicId : null,
      altText: typeof body.altText === "string" ? body.altText : undefined,
      link: typeof body.link === "string" ? body.link : undefined,
      sortOrder:
        typeof body.sortOrder === "number" ? body.sortOrder : undefined,
    });

    try {
      revalidateTag("public-hero-banners", "max");
      revalidatePath("/");
    } catch {
      /* optional in some runtimes */
    }

    return NextResponse.json({
      ok: true,
      banner,
      message: "হিরো ব্যানার যোগ করা হয়েছে!",
    });
  } catch (error: unknown) {
    console.error("Admin hero banner create error:", error);
    return NextResponse.json(
      { ok: false, error: "হিরো ব্যানার সেভ করা যায়নি।" },
      { status: 500 }
    );
  }
}
