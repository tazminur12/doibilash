import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ROLE_META, type TeamRole } from "@/lib/teamStorage";

function roleLabelBn(role: string): string {
  const meta = ROLE_META[role as TeamRole];
  return meta ? meta.labelBn.split(" (")[0] : role;
}

/** Validate invite token (for accept-invite page preload) */
export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "ইনভাইটেশন টোকেন পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.findFirst({
      where: { inviteToken: token },
    });

    if (!member) {
      return NextResponse.json(
        { ok: false, error: "এই ইনভাইটেশন লিংকটি অবৈধ বা ইতিমধ্যে ব্যবহার করা হয়েছে।" },
        { status: 404 }
      );
    }

    if (member.inviteExpiresAt && member.inviteExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, error: "এই ইনভাইটেশন লিংকের মেয়াদ শেষ হয়ে গেছে। অ্যাডমিনকে নতুন ইনভাইট পাঠাতে বলুন।" },
        { status: 410 }
      );
    }

    if (member.status !== "Invited" && member.passwordHash) {
      return NextResponse.json(
        { ok: false, error: "আপনি ইতিমধ্যে পাসওয়ার্ড সেট করেছেন। লগইন পেজে যান।" },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      invite: {
        name: member.name,
        email: member.email,
        role: member.role,
        roleLabel: roleLabelBn(member.role),
        designation: member.designation,
      },
    });
  } catch (error: unknown) {
    console.error("[Accept Invite GET Error]:", error);
    return NextResponse.json(
      { ok: false, error: "ইনভাইটেশন যাচাই করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

/** Set password and activate invited team member */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, phone } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { ok: false, error: "ইনভাইটেশন টোকেন প্রয়োজন।" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.trim().length < 6) {
      return NextResponse.json(
        { ok: false, error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    const member = await prisma.teamMember.findFirst({
      where: { inviteToken: token.trim() },
    });

    if (!member) {
      return NextResponse.json(
        { ok: false, error: "এই ইনভাইটেশন লিংকটি অবৈধ বা ইতিমধ্যে ব্যবহার করা হয়েছে।" },
        { status: 404 }
      );
    }

    if (member.inviteExpiresAt && member.inviteExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { ok: false, error: "এই ইনভাইটেশন লিংকের মেয়াদ শেষ হয়ে গেছে।" },
        { status: 410 }
      );
    }

    let cleanPhone = member.phone;
    if (phone && typeof phone === "string" && phone.trim()) {
      cleanPhone = phone.trim().replace(/[\s-]/g, "");
      const phoneConflict = await prisma.teamMember.findFirst({
        where: { phone: cleanPhone, NOT: { id: member.id } },
      });
      if (phoneConflict) {
        return NextResponse.json(
          { ok: false, error: "এই মোবাইল নম্বর অন্য সদস্যের সাথে ব্যবহৃত হচ্ছে।" },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);

    await prisma.teamMember.update({
      where: { id: member.id },
      data: {
        passwordHash,
        phone: cleanPhone,
        status: "Active",
        inviteToken: null,
        inviteExpiresAt: null,
        lastLogin: null,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "পাসওয়ার্ড সফলভাবে সেট হয়েছে! এখন ইমেইল ও পাসওয়ার্ড দিয়ে অ্যাডমিন প্যানেলে লগইন করুন।",
      email: member.email,
      name: member.name,
    });
  } catch (error: unknown) {
    console.error("[Accept Invite POST Error]:", error);
    return NextResponse.json(
      { ok: false, error: "পাসওয়ার্ড সেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
