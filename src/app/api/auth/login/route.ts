import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে আপনার মোবাইল নম্বর বা ইমেইল ঠিকানা দিন।" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { ok: false, error: "দয়া করে আপনার পাসওয়ার্ড দিন।" },
        { status: 400 }
      );
    }

    const cleanInput = identifier.trim().toLowerCase();
    const cleanDigits = cleanInput.replace(/[\s-]/g, "");

    // Normalize phone if digit-like
    const normalizedPhone = cleanDigits.startsWith("+88")
      ? cleanDigits.slice(3)
      : cleanDigits.startsWith("88")
      ? cleanDigits.slice(2)
      : cleanDigits;

    // Find customer user first
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { email: cleanInput },
        ],
      },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return NextResponse.json(
          { ok: false, error: "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।" },
          { status: 401 }
        );
      }

      const token = signToken({
        userId: user.id,
        phone: user.phone,
        email: user.email,
        role: user.role,
      });

      const safeUser = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email || `${user.phone}@customer.doibilash.com`,
        avatarUrl: user.avatarUrl,
        city: user.city,
        address: user.address,
        role: user.role,
        joinedAt: user.createdAt.toISOString(),
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
      };

      const response = NextResponse.json({
        ok: true,
        message: `স্বাগতম, ${user.name}! লগইন সফল হয়েছে।`,
        user: safeUser,
        token,
      });

      response.cookies.set("doibilash_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });

      return response;
    }

    // Fallback: invited / active admin team members (email or phone login)
    const teamMember = await prisma.teamMember.findFirst({
      where: {
        OR: [
          { email: cleanInput },
          ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
        ],
        status: "Active",
      },
    });

    if (!teamMember || !teamMember.passwordHash) {
      return NextResponse.json(
        { ok: false, error: "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।" },
        { status: 401 }
      );
    }

    const isTeamPassValid = await bcrypt.compare(password, teamMember.passwordHash);
    if (!isTeamPassValid) {
      return NextResponse.json(
        { ok: false, error: "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।" },
        { status: 401 }
      );
    }

    await prisma.teamMember.update({
      where: { id: teamMember.id },
      data: { lastLogin: new Date() },
    });

    const adminRole = "ADMIN";
    const token = signToken({
      userId: teamMember.id,
      phone: teamMember.phone || "",
      email: teamMember.email,
      role: adminRole,
    });

    const safeAdmin = {
      id: teamMember.id,
      name: teamMember.name,
      phone: teamMember.phone || "",
      email: teamMember.email,
      avatarUrl: teamMember.avatarUrl,
      city: "",
      address: "",
      role: adminRole,
      teamRole: teamMember.role,
      designation: teamMember.designation,
      avatarInitials: teamMember.avatarInitials,
      permissions: Array.isArray(teamMember.permissions)
        ? teamMember.permissions
        : [],
      joinedAt: teamMember.createdAt.toISOString(),
      shippingAddress: null,
      billingAddress: null,
    };

    const response = NextResponse.json({
      ok: true,
      message: `স্বাগতম, ${teamMember.name}! অ্যাডমিন লগইন সফল হয়েছে।`,
      user: safeAdmin,
      token,
      redirectTo: "/admin",
    });

    response.cookies.set("doibilash_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { ok: false, error: "সার্ভারে ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

