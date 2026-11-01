import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSessionPayload } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const payload = await getSessionPayload();
    if (!payload?.userId) {
      return NextResponse.json(
        { ok: false, error: "অনুমোদিত নয়। আবার লগইন করুন।", needsLogin: true },
        { status: 401 }
      );
    }

    const member = await prisma.teamMember.findUnique({
      where: { id: payload.userId },
    });

    if (!member) {
      return NextResponse.json(
        { ok: false, error: "টিম অ্যাকাউন্ট পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 6) {
      return NextResponse.json(
        { ok: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    if (member.passwordHash) {
      if (!currentPassword || typeof currentPassword !== "string") {
        return NextResponse.json(
          { ok: false, error: "বর্তমান পাসওয়ার্ড দিন।" },
          { status: 400 }
        );
      }
      const valid = await bcrypt.compare(currentPassword, member.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: "বর্তমান পাসওয়ার্ড সঠিক নয়।" },
          { status: 401 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(newPassword.trim(), 10);
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { passwordHash },
    });

    return NextResponse.json({
      ok: true,
      message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। পরবর্তী লগইনে নতুন পাসওয়ার্ড ব্যবহার করুন।",
    });
  } catch (error: unknown) {
    console.error("[Admin Me Password PUT]:", error);
    return NextResponse.json(
      { ok: false, error: "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
