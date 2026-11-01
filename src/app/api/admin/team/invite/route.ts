import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendTeamInviteEmail } from "@/lib/mail";
import { ROLE_META, type TeamRole } from "@/lib/teamStorage";
import { getAppBaseUrl } from "@/lib/appUrl";

function generateInitials(name: string): string {
  if (!name) return "টিম";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] || "") + (parts[1][0] || "");
}

function roleLabelBn(role: string): string {
  const meta = ROLE_META[role as TeamRole];
  return meta ? meta.labelBn.split(" (")[0] : role;
}

/** Create invited team member (no password) and email invite link */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, role, designation, permissions, notes, invitedBy } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে সদস্যের পুরো নাম দিন।" },
        { status: 400 }
      );
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "সঠিক ইমেইল ঠিকানা দিন। ইনভাইট এই ইমেইলে পাঠানো হবে।" },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.teamMember.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: "এই ইমেইল দিয়ে ইতিমধ্যে একজন টিম সদস্য আছেন।" },
        { status: 409 }
      );
    }

    let cleanPhone: string | null =
      phone && typeof phone === "string" && phone.trim()
        ? phone.trim().replace(/[\s-]/g, "")
        : null;

    if (cleanPhone) {
      const existingPhone = await prisma.teamMember.findUnique({
        where: { phone: cleanPhone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { ok: false, error: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একজন সদস্য আছেন।" },
          { status: 409 }
        );
      }
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const safeRole = (role as string) || "Staff";
    const safeDesignation =
      designation && typeof designation === "string" && designation.trim()
        ? designation.trim()
        : safeRole === "Super Admin"
          ? "প্রধান প্রশাসক"
          : "টিম মেম্বার";
    const safePerms = Array.isArray(permissions)
      ? permissions
      : ROLE_META[safeRole as TeamRole]?.defaultPermissions || [];

    const newMember = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: safeRole,
        designation: safeDesignation,
        status: "Invited",
        avatarInitials: generateInitials(name),
        permissions: safePerms,
        passwordHash: null,
        inviteToken,
        inviteExpiresAt,
        notes: notes || "",
      },
    });

    const inviteUrl = `${getAppBaseUrl(req)}/accept-invite?token=${inviteToken}`;
    const mailResult = await sendTeamInviteEmail({
      name: newMember.name,
      toEmail: newMember.email,
      roleLabel: roleLabelBn(safeRole),
      inviteUrl,
      invitedBy: typeof invitedBy === "string" ? invitedBy : undefined,
    });

    if (!mailResult.ok) {
      // Keep the invite record so admin can resend; surface email failure clearly
      return NextResponse.json({
        ok: true,
        emailSent: false,
        message: `${newMember.name} কে ইনভাইট করা হয়েছে, কিন্তু ইমেইল পাঠানো যায়নি: ${mailResult.error || "অজানা সমস্যা"}। লিংক পুনরায় পাঠাতে পারেন।`,
        inviteUrl,
        fromEmail: mailResult.fromEmail,
        member: {
          id: newMember.id,
          name: newMember.name,
          email: newMember.email,
          role: newMember.role,
          status: newMember.status,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      emailSent: true,
      message: `${newMember.name}-এর ইমেইলে অ্যাডমিন ইনভাইটেশন পাঠানো হয়েছে।`,
      fromEmail: mailResult.fromEmail,
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: newMember.status,
      },
    });
  } catch (error: unknown) {
    console.error("[Team Invite POST Error]:", error);
    return NextResponse.json(
      { ok: false, error: "ইনভাইটেশন তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
