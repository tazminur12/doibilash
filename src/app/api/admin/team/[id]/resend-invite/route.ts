import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendTeamInviteEmail } from "@/lib/mail";
import { ROLE_META, type TeamRole } from "@/lib/teamStorage";
import { getAppBaseUrl } from "@/lib/appUrl";

function roleLabelBn(role: string): string {
  const meta = ROLE_META[role as TeamRole];
  return meta ? meta.labelBn.split(" (")[0] : role;
}

/** Resend invite email for a pending Invited member */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({ where: { id } });

    if (!member) {
      return NextResponse.json(
        { ok: false, error: "টিম সদস্য পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (member.status !== "Invited" && member.passwordHash) {
      return NextResponse.json(
        { ok: false, error: "এই সদস্য ইতিমধ্যে অ্যাকাউন্ট সক্রিয় করেছেন। নতুন ইনভাইট প্রয়োজন নেই।" },
        { status: 400 }
      );
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.teamMember.update({
      where: { id },
      data: {
        status: "Invited",
        inviteToken,
        inviteExpiresAt,
        passwordHash: null,
      },
    });

    const inviteUrl = `${getAppBaseUrl(req)}/accept-invite?token=${inviteToken}`;
    const mailResult = await sendTeamInviteEmail({
      name: member.name,
      toEmail: member.email,
      roleLabel: roleLabelBn(member.role),
      inviteUrl,
    });

    if (!mailResult.ok) {
      return NextResponse.json({
        ok: true,
        emailSent: false,
        message: `ইনভাইট লিংক নবায়ন হয়েছে, কিন্তু ইমেইল যায়নি: ${mailResult.error || "অজানা"}`,
        inviteUrl,
        fromEmail: mailResult.fromEmail,
      });
    }

    return NextResponse.json({
      ok: true,
      emailSent: true,
      message: `${member.email}-এ ইনভাইটেশন পুনরায় পাঠানো হয়েছে।`,
      fromEmail: mailResult.fromEmail,
    });
  } catch (error: unknown) {
    console.error("[Resend Invite Error]:", error);
    return NextResponse.json(
      { ok: false, error: "ইনভাইট পুনরায় পাঠাতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
