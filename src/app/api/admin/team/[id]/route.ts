import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ ok: false, error: "টিম সদস্য পাওয়া যায়নি।" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, member });
  } catch (error: any) {
    console.error("[Team [id] GET Error]:", error);
    return NextResponse.json({ ok: false, error: "সার্ভার এরর" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, phone, role, designation, status, permissions, password, notes } = body;

    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "টিম সদস্য পাওয়া যায়নি।" }, { status: 404 });
    }

    // Safety: Protect the last active Super Admin
    if (existing.role === "Super Admin") {
      const willDemoteOrDeactivate =
        (role && role !== "Super Admin") || (status && status !== "Active");

      if (willDemoteOrDeactivate) {
        const otherSuperAdmins = await prisma.teamMember.count({
          where: {
            role: "Super Admin",
            status: "Active",
            NOT: { id },
          },
        });

        if (otherSuperAdmins === 0) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "সিস্টেমে অন্তত একজন সক্রিয় সুপার অ্যাডমিন থাকা আবশ্যক। এই সদস্যের রোল বা স্ট্যাটাস পরিবর্তন করা যাবে না।",
            },
            { status: 400 }
          );
        }
      }
    }

    const dataToUpdate: Record<string, unknown> = {};

    if (name && typeof name === "string") dataToUpdate.name = name.trim();
    if (designation && typeof designation === "string") dataToUpdate.designation = designation.trim();
    if (role && typeof role === "string") dataToUpdate.role = role;
    if (status && typeof status === "string") dataToUpdate.status = status;
    if (Array.isArray(permissions)) dataToUpdate.permissions = permissions;
    if (notes !== undefined) dataToUpdate.notes = typeof notes === "string" ? notes.trim() : "";

    // If changing email, check uniqueness
    if (email && typeof email === "string") {
      const cleanEmail = email.trim().toLowerCase();
      if (cleanEmail !== existing.email) {
        const conflict = await prisma.teamMember.findFirst({
          where: { email: cleanEmail, NOT: { id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই ইমেইল ঠিকানা অন্য একজন টিম সদস্য ব্যবহার করছেন।" },
            { status: 409 }
          );
        }
        dataToUpdate.email = cleanEmail;
      }
    }

    // If changing phone, check uniqueness
    if (phone && typeof phone === "string") {
      const cleanPhone = phone.trim().replace(/[\s-]/g, "");
      if (cleanPhone !== existing.phone) {
        const conflict = await prisma.teamMember.findFirst({
          where: { phone: cleanPhone, NOT: { id } },
        });
        if (conflict) {
          return NextResponse.json(
            { ok: false, error: "এই মোবাইল নম্বর অন্য একজন টিম সদস্য ব্যবহার করছেন।" },
            { status: 409 }
          );
        }
        dataToUpdate.phone = cleanPhone;
      }
    }

    // If changing password
    if (password && typeof password === "string" && password.trim().length >= 6) {
      dataToUpdate.passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      ok: true,
      message: `${updated.name}-এর তথ্য সফলভাবে আপডেট করা হয়েছে!`,
      member: updated,
    });
  } catch (error: any) {
    console.error("[Team [id] PUT Error]:", error);
    return NextResponse.json(
      { ok: false, error: "টিম সদস্য আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ ok: false, error: "টিম সদস্য পাওয়া যায়নি।" }, { status: 404 });
    }

    // Safety: Prevent deleting the last Super Admin
    if (existing.role === "Super Admin") {
      const superAdminCount = await prisma.teamMember.count({
        where: { role: "Super Admin" },
      });

      if (superAdminCount <= 1) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "সিস্টেমের একমাত্র সুপার অ্যাডমিনকে মুছে ফেলা সম্ভব নয়। অন্তত একজন সুপার অ্যাডমিন থাকতে হবে।",
          },
          { status: 400 }
        );
      }
    }

    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({
      ok: true,
      message: `${existing.name} কে সফলভাবে টিম থেকে অপসারণ করা হয়েছে।`,
    });
  } catch (error: any) {
    console.error("[Team [id] DELETE Error]:", error);
    return NextResponse.json(
      { ok: false, error: "টিম সদস্য ডিলিট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

