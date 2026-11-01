import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { uploadImageBuffer } from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("doibilash_session")?.value;
  if (tokenFromCookie) {
    const payload = verifyToken(tokenFromCookie);
    if (payload?.userId) return payload.userId;
  }

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.slice(7).trim();
    const payload = verifyToken(bearerToken);
    if (payload?.userId) return payload.userId;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ ok: false, error: "কোনো ফাইল সিলেক্ট করা হয়নি।" }, { status: 400 });
    }

    // Verify it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "শুধুমাত্র ছবি (JPG, PNG, WebP) আপলোড করতে পারবেন।" }, { status: 400 });
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে।" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadImageBuffer(buffer, "doibilash/avatars");

    // If logged in, update user avatar in Supabase database
    const userId = await getSessionUserId();
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: uploadResult.url },
      });
    }

    return NextResponse.json({
      ok: true,
      url: uploadResult.url,
      publicId: uploadResult.publicId,
      message: "ছবি সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!",
    });
  } catch (error: unknown) {
    console.error("Avatar upload API error:", error);
    return NextResponse.json(
      { ok: false, error: "ছবি আপলোড ব্যর্থ হয়েছে। ক্লাউডিনারি কনফিগারেশন যাচাই করুন।" },
      { status: 500 }
    );
  }
}

