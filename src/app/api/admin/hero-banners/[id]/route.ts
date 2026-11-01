import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  deleteHeroBanner,
  updateHeroBanner,
} from "@/lib/heroBannerService";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const updated = await updateHeroBanner(id, {
      altText: typeof body.altText === "string" ? body.altText : undefined,
      link: typeof body.link === "string" ? body.link : undefined,
      sortOrder:
        typeof body.sortOrder === "number" ? body.sortOrder : undefined,
      isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "ব্যানার পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    try {
      revalidateTag("public-hero-banners", "max");
      revalidatePath("/");
    } catch {
      /* optional */
    }

    return NextResponse.json({
      ok: true,
      banner: updated,
      message: "ব্যানার আপডেট হয়েছে!",
    });
  } catch (error: unknown) {
    console.error("Admin hero banner update error:", error);
    return NextResponse.json(
      { ok: false, error: "ব্যানার আপডেট ব্যর্থ।" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const ok = await deleteHeroBanner(id);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "ব্যানার পাওয়া যায়নি বা ডিলিট করা যায়নি।" },
        { status: 404 }
      );
    }

    try {
      revalidateTag("public-hero-banners", "max");
      revalidatePath("/");
    } catch {
      /* optional */
    }

    return NextResponse.json({
      ok: true,
      message: "ব্যানার ডিলিট করা হয়েছে।",
    });
  } catch (error: unknown) {
    console.error("Admin hero banner delete error:", error);
    return NextResponse.json(
      { ok: false, error: "ব্যানার ডিলিট ব্যর্থ।" },
      { status: 500 }
    );
  }
}
