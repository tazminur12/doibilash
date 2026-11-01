import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      badge,
      title,
      highlightText,
      description,
      campaignEnd,
      bannerActive,
      announcementText,
      bannerUrl,
    } = body;

    const saved = await prisma.campaignSetting.upsert({
      where: { id: "default" },
      update: {
        badge: badge !== undefined ? badge : "মেগা ডিসকাউন্ট উৎসব",
        title: title !== undefined ? title : "স্পেশাল",
        highlightText: highlightText !== undefined ? highlightText : "ধামাকা অফার",
        description: description !== undefined ? description : "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য।",
        campaignEnd: campaignEnd ? new Date(campaignEnd) : null,
        bannerActive: bannerActive !== undefined ? Boolean(bannerActive) : true,
        announcementText: announcementText !== undefined ? announcementText : "",
        bannerUrl: bannerUrl !== undefined ? bannerUrl : "",
      },
      create: {
        id: "default",
        badge: badge || "মেগা ডিসকাউন্ট উৎসব",
        title: title || "স্পেশাল",
        highlightText: highlightText || "ধামাকা অফার",
        description: description || "সীমিত সময়ের জন্য সেরা দামে খাঁটি পণ্য।",
        campaignEnd: campaignEnd ? new Date(campaignEnd) : null,
        bannerActive: bannerActive !== undefined ? Boolean(bannerActive) : true,
        announcementText: announcementText || "",
        bannerUrl: bannerUrl || "",
      },
    });

    return NextResponse.json({
      ok: true,
      campaign: {
        badge: saved.badge,
        title: saved.title,
        highlightText: saved.highlightText,
        description: saved.description,
        campaignEnd: saved.campaignEnd ? saved.campaignEnd.toISOString() : "",
        bannerActive: saved.bannerActive,
        announcementText: saved.announcementText || "",
        bannerUrl: saved.bannerUrl || "",
      },
      message: "ক্যাম্পেইন ও টাইমার সেটিংস সফলভাবে সংরক্ষিত হয়েছে!",
    });
  } catch (error: any) {
    console.error("Failed to save campaign settings:", error);
    return NextResponse.json(
      { ok: false, error: "ক্যাম্পেইন সেটিংস সেভ করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}

