import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import { getAppBaseUrl } from "@/lib/appUrl";

export const dynamic = "force-dynamic";

function normalizeEmail(raw: string): string {
  return String(raw || "").trim().toLowerCase();
}

/** Request password reset email (User or TeamMember) */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email || body.identifier || "");

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "সঠিক ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    // Prefer team member (admin), then customer user
    const team = await prisma.teamMember.findFirst({
      where: {
        email,
        status: { notIn: ["Inactive", "Invited"] },
      },
    });

    const user = !team
      ? await prisma.user.findFirst({
          where: { email },
        })
      : null;

    // Always respond success-shaped to avoid email enumeration
    const genericOk = {
      ok: true,
      message:
        "যদি এই ইমেইল দিয়ে অ্যাকাউন্ট থাকে, পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। ইনবক্স ও স্প্যাম চেক করুন।",
    };

    if (!team && !user) {
      return NextResponse.json(genericOk);
    }

    const accountType = team ? "team" : "user";
    const accountId = team ? team.id : user!.id;
    const name = team ? team.name : user!.name;
    const accountLabel = team
      ? `অ্যাডমিন অ্যাকাউন্ট (${team.role})`
      : "কাস্টমার অ্যাকাউন্ট";

    // Invalidate previous unused tokens for this account
    await prisma.passwordReset.updateMany({
      where: {
        accountId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { usedAt: new Date() },
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        token,
        email,
        accountType,
        accountId,
        expiresAt,
      },
    });

    const resetUrl = `${getAppBaseUrl(req)}/reset-password?token=${token}`;
    const mailResult = await sendPasswordResetEmail({
      name,
      toEmail: email,
      resetUrl,
      accountLabel,
    });

    if (!mailResult.ok) {
      console.error("[Forgot Password] email failed:", mailResult.error);
      return NextResponse.json(
        {
          ok: false,
          error:
            mailResult.error ||
            "ইমেইল পাঠানো যায়নি। কিছুক্ষণ পর আবার চেষ্টা করুন।",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(genericOk);
  } catch (error: unknown) {
    console.error("[Forgot Password] error:", error);
    return NextResponse.json(
      { ok: false, error: "পাসওয়ার্ড রিসেট অনুরোধ সম্পন্ন করা যায়নি।" },
      { status: 500 }
    );
  }
}
