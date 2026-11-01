import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: "লগআউট সম্পন্ন হয়েছে।",
  });

  response.cookies.set("doibilash_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}

