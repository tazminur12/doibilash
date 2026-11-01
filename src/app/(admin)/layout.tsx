import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getAdminFromRequest } from "@/lib/adminAuth";

export const metadata: Metadata = {
  title: "অ্যাডমিন প্যানেল",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    redirect("/login?next=/admin&reason=admin");
  }

  return <AdminShell>{children}</AdminShell>;
}
