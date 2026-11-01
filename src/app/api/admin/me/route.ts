import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getAdminFromRequest,
  getSessionPayload,
  mapTeamMemberToAdminProfile,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminFromRequest();
    if (!admin) {
      return NextResponse.json(
        {
          ok: false,
          error: "অ্যাডমিন সেশন পাওয়া যায়নি। টিম অ্যাকাউন্ট দিয়ে লগইন করুন।",
          needsLogin: true,
        },
        { status: 401 }
      );
    }
    return NextResponse.json({ ok: true, admin });
  } catch (error: unknown) {
    console.error("[Admin Me GET]:", error);
    return NextResponse.json(
      { ok: false, error: "প্রোফাইল লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const payload = await getSessionPayload();
    if (!payload?.userId) {
      return NextResponse.json(
        { ok: false, error: "অনুমোদিত নয়। আবার লগইন করুন।", needsLogin: true },
        { status: 401 }
      );
    }

    const existing = await prisma.teamMember.findUnique({
      where: { id: payload.userId },
    });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "টিম অ্যাকাউন্ট পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, phone, email, designation, notes } = body;
    const dataToUpdate: Record<string, unknown> = {};

    if (name !== undefined) {
      const clean = String(name).trim();
      if (!clean) {
        return NextResponse.json(
          { ok: false, error: "নাম খালি রাখা যাবে না।" },
          { status: 400 }
        );
      }
      dataToUpdate.name = clean;
      const parts = clean.split(/\s+/);
      dataToUpdate.avatarInitials =
        parts.length === 1
          ? parts[0].slice(0, 2)
          : (parts[0][0] || "") + (parts[1][0] || "");
    }

    if (designation !== undefined) {
      dataToUpdate.designation = String(designation).trim();
    }

    if (notes !== undefined) {
      dataToUpdate.notes = notes ? String(notes).trim() : null;
    }

    if (email !== undefined) {
      const cleanEmail = String(email).trim().toLowerCase();
      if (!cleanEmail.includes("@")) {
        return NextResponse.json(
          { ok: false, error: "সঠিক ইমেইল দিন।" },
          { status: 400 }
        );
      }
      if (cleanEmail !== existing.email) {
        const conflict = await prisma.teamMember.findFirst({
          where: { email: cleanEmail, NOT: { id: existing.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই ইমেইল অন্য সদস্য ব্যবহার করছেন।" },
            { status: 409 }
          );
        }
        dataToUpdate.email = cleanEmail;
      }
    }

    if (phone !== undefined) {
      const cleanPhone = String(phone).trim().replace(/[\s-]/g, "");
      if (cleanPhone && cleanPhone !== existing.phone) {
        const conflict = await prisma.teamMember.findFirst({
          where: { phone: cleanPhone, NOT: { id: existing.id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই মোবাইল নম্বর অন্য সদস্য ব্যবহার করছেন।" },
            { status: 409 }
          );
        }
        dataToUpdate.phone = cleanPhone || null;
      } else if (!cleanPhone) {
        dataToUpdate.phone = null;
      }
    }

    const updated = await prisma.teamMember.update({
      where: { id: existing.id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ok: true,
      message: "প্রোফাইল সফলভাবে আপডেট হয়েছে।",
      admin: mapTeamMemberToAdminProfile(updated),
    });
  } catch (error: unknown) {
    console.error("[Admin Me PUT]:", error);
    return NextResponse.json(
      { ok: false, error: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
