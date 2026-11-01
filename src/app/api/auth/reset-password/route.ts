import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ResetRecord = {
  id: string;
  token: string;
  email: string;
  accountType: string;
  accountId: string;
  expiresAt: Date;
  usedAt: Date | null;
};

async function findValidReset(
  token: string
): Promise<{ record: ResetRecord } | { error: string; status: number }> {
  const record = await prisma.passwordReset.findUnique({
    where: { token },
  });
  if (!record) {
    return {
      error: "এই রিসেট লিংকটি অবৈধ বা ইতিমধ্যে ব্যবহার করা হয়েছে।",
      status: 404,
    };
  }
  if (record.usedAt) {
    return {
      error: "এই রিসেট লিংকটি ইতিমধ্যে ব্যবহার করা হয়েছে। নতুন অনুরোধ করুন।",
      status: 410,
    };
  }
  if (record.expiresAt.getTime() < Date.now()) {
    return {
      error: "এই রিসেট লিংকের মেয়াদ শেষ হয়ে গেছে। আবার ফরগট পাসওয়ার্ড করুন।",
      status: 410,
    };
  }
  return { record };
}

/** Validate reset token for the reset-password page */
export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "রিসেট টোকেন পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const result = await findValidReset(token);
    if ("error" in result) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    const { record } = result;
    let name = "";
    if (record.accountType === "team") {
      const m = await prisma.teamMember.findUnique({
        where: { id: record.accountId },
      });
      name = m?.name || "";
    } else {
      const u = await prisma.user.findUnique({
        where: { id: record.accountId },
      });
      name = u?.name || "";
    }

    return NextResponse.json({
      ok: true,
      reset: {
        email: record.email,
        name,
        accountType: record.accountType,
        expiresAt: record.expiresAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[Reset Password GET]:", error);
    return NextResponse.json(
      { ok: false, error: "রিসেট লিংক যাচাই করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

/** Set new password using reset token */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "রিসেট টোকেন প্রয়োজন।" },
        { status: 400 }
      );
    }
    if (!password || password.trim().length < 6) {
      return NextResponse.json(
        { ok: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    const result = await findValidReset(token);
    if ("error" in result) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      );
    }

    const { record } = result;
    const passwordHash = await bcrypt.hash(password.trim(), 10);

    if (record.accountType === "team") {
      const member = await prisma.teamMember.findUnique({
        where: { id: record.accountId },
      });
      if (!member || member.status === "Inactive") {
        return NextResponse.json(
          { ok: false, error: "টিম অ্যাকাউন্ট পাওয়া যায়নি বা নিষ্ক্রিয়।" },
          { status: 404 }
        );
      }
      await prisma.teamMember.update({
        where: { id: member.id },
        data: {
          passwordHash,
          inviteToken: null,
          inviteExpiresAt: null,
          status: member.status === "Invited" ? "Active" : member.status,
        },
      });
    } else {
      const user = await prisma.user.findUnique({
        where: { id: record.accountId },
      });
      if (!user) {
        return NextResponse.json(
          { ok: false, error: "ইউজার অ্যাকাউন্ট পাওয়া যায়নি।" },
          { status: 404 }
        );
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });
    }

    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    await prisma.passwordReset.updateMany({
      where: {
        accountId: record.accountId,
        usedAt: null,
        NOT: { id: record.id },
      },
      data: { usedAt: new Date() },
    });

    return NextResponse.json({
      ok: true,
      message:
        "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।",
      accountType: record.accountType,
    });
  } catch (error: unknown) {
    console.error("[Reset Password POST]:", error);
    return NextResponse.json(
      { ok: false, error: "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
