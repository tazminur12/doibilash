import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
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
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ ok: false, error: "পাসওয়ার্ড পরিবর্তন করতে অনুগ্রহ করে প্রথমে লগইন করুন।" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json({ ok: false, error: "বর্তমান পাসওয়ার্ড দিন।" }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ ok: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ ok: false, error: "ইউজার পাওয়া যায়নি।" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ ok: false, error: "বর্তমান পাসওয়ার্ড সঠিক নয়।" }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      ok: true,
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!",
    });
  } catch (error: unknown) {
    console.error("Change password error:", error);
    return NextResponse.json({ ok: false, error: "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" }, { status: 500 });
  }
}

