import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { DEFAULT_TEAM_MEMBERS } from "@/lib/teamStorage";

// Generate initials in Bengali/English
function generateInitials(name: string): string {
  if (!name) return "টিম";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] || "") + (parts[1][0] || "");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const role = searchParams.get("role");
    const status = searchParams.get("status");

    // Check count and auto-seed if empty
    const count = await prisma.teamMember.count();
    if (count === 0) {
      console.log("[Team API] No team members found in DB, auto-seeding defaults...");
      const defaultPasswordHash = await bcrypt.hash("admin123456", 10);
      for (const m of DEFAULT_TEAM_MEMBERS) {
        await prisma.teamMember.create({
          data: {
            name: m.name,
            email: m.email.toLowerCase(),
            phone: m.phone,
            role: m.role,
            designation: m.designation,
            status: m.status,
            avatarInitials: m.avatarInitials,
            permissions: m.permissions,
            passwordHash: defaultPasswordHash,
            notes: m.notes || "",
            lastLogin: new Date(),
          },
        });
      }
    }

    // Fetch members from Supabase
    const dbMembers = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Format for frontend
    let list = dbMembers.map((m) => {
      const perms = Array.isArray(m.permissions) ? (m.permissions as string[]) : [];
      return {
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone || "",
        role: m.role,
        designation: m.designation,
        status: m.status,
        avatarUrl: m.avatarUrl,
        avatarInitials: m.avatarInitials || generateInitials(m.name),
        permissions: perms,
        joinedDate: m.createdAt.toLocaleDateString("bn-BD", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),
        lastLogin:
          m.status === "Invited"
            ? "ইনভাইট পেন্ডিং"
            : m.lastLogin
              ? m.lastLogin.toLocaleDateString("bn-BD", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "এখনো লগইন করেননি",
        notes: m.notes || "",
        invitePending: m.status === "Invited" || Boolean(m.inviteToken),
      };
    });

    // Filters if provided
    if (search) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search) ||
          m.phone.includes(search) ||
          m.designation.toLowerCase().includes(search)
      );
    }
    if (role && role !== "ALL") {
      list = list.filter((m) => m.role === role);
    }
    if (status && status !== "ALL") {
      list = list.filter((m) => m.status === status);
    }

    // Stats
    const stats = {
      total: dbMembers.length,
      active: dbMembers.filter((m) => m.status === "Active").length,
      superAdmins: dbMembers.filter((m) => m.role === "Super Admin").length,
      managers: dbMembers.filter((m) => m.role === "Manager").length,
      moderators: dbMembers.filter((m) => m.role === "Moderator" || m.role === "Staff").length,
    };

    return NextResponse.json({
      ok: true,
      members: list,
      stats,
    });
  } catch (error: any) {
    console.error("[Team GET API Error]:", error);
    return NextResponse.json(
      { ok: false, error: "টিম সদস্যদের তালিকা লোড করতে ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, role, designation, status, permissions, password, notes } = body;

    // Validations
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে টিম সদস্যের পুরো নাম দিন।" },
        { status: 400 }
      );
    }

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "সঠিক প্রাতিষ্ঠানিক ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    const cleanPhone = (phone || "").trim().replace(/[\s-]/g, "");
    if (!cleanPhone) {
      return NextResponse.json(
        { ok: false, error: "সঠিক মোবাইল নম্বর দিন।" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingEmail = await prisma.teamMember.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { ok: false, error: "এই ইমেইল দিয়ে ইতিমধ্যে একজন টিম সদস্য নিবন্ধিত আছেন।" },
        { status: 409 }
      );
    }

    // Check phone uniqueness
    const existingPhone = await prisma.teamMember.findUnique({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { ok: false, error: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একজন টিম সদস্য নিবন্ধিত আছেন।" },
        { status: 409 }
      );
    }

    // Hash password
    const rawPass = password && typeof password === "string" && password.length >= 6 ? password : "admin" + cleanPhone.slice(-4);
    const passwordHash = await bcrypt.hash(rawPass, 10);

    const safeRole = role || "Staff";
    const safeStatus = status || "Active";
    const safeDesignation = designation && typeof designation === "string" ? designation.trim() : "টিম মেম্বার";
    const initials = generateInitials(name);
    const safePerms = Array.isArray(permissions) ? permissions : [];

    const newMember = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: safeRole,
        designation: safeDesignation,
        status: safeStatus,
        avatarInitials: initials,
        permissions: safePerms,
        passwordHash,
        notes: notes || "",
        lastLogin: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      message: `${newMember.name} কে সফলভাবে টিম সদস্য হিসেবে যুক্ত করা হয়েছে!`,
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.role,
        designation: newMember.designation,
        status: newMember.status,
        avatarInitials: newMember.avatarInitials,
        permissions: newMember.permissions,
        joinedDate: "আজকে",
        lastLogin: "এখন সক্রিয় (Just Now)",
        notes: newMember.notes,
      },
    });
  } catch (error: any) {
    console.error("[Team POST API Error]:", error);
    return NextResponse.json(
      { ok: false, error: "টিম সদস্য তৈরি করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

