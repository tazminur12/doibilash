import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { sendWelcomeEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, password } = body;

    // Validate name
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { ok: false, error: "দয়া করে আপনার পুরো নাম লিখুন।" },
        { status: 400 }
      );
    }

    // Validate phone
    const cleanPhone = (phone || "").trim().replace(/[\s-]/g, "");
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { ok: false, error: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।" },
        { status: 400 }
      );
    }

    // Standardize phone to 11 digits (e.g. 01712345678)
    const normalizedPhone = cleanPhone.startsWith("+88")
      ? cleanPhone.slice(3)
      : cleanPhone.startsWith("88")
      ? cleanPhone.slice(2)
      : cleanPhone;

    // Validate password
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    // Clean optional email
    const cleanEmail = email && typeof email === "string" && email.trim() ? email.trim().toLowerCase() : null;

    // Check if phone already registered
    const existingPhone = await prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { ok: false, error: "এই মোবাইল নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।" },
        { status: 409 }
      );
    }

    // Check if email already registered
    if (cleanEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { ok: false, error: "এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।" },
          { status: 409 }
        );
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: normalizedPhone,
        email: cleanEmail,
        passwordHash,
        city: "ঢাকা সিটি",
        address: "",
        role: "CUSTOMER",
      },
    });

    // Send Welcome Email asynchronously via Resend
    if (user.email) {
      sendWelcomeEmail({
        name: user.name,
        toEmail: user.email,
      }).catch((err) => {
        console.error("Non-blocking welcome email error:", err);
      });
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });

    // Format safe user payload
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
    };

    const response = NextResponse.json({
      ok: true,
      message: "রেজিস্ট্রেশন সফল হয়েছে!",
      user: safeUser,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("doibilash_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { ok: false, error: "সার্ভারে ত্রুটি হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}

