import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken, type TokenPayload } from "@/lib/jwt";
import { ROLE_META, type TeamRole } from "@/lib/teamStorage";

export type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN";
  teamRole: string;
  teamRoleLabel: string;
  designation: string;
  status: string;
  permissions: string[];
  avatarUrl: string | null;
  avatarInitials: string;
  notes?: string;
  lastLogin: string | null;
  joinedAt: string;
  hasPassword: boolean;
};

function roleLabel(role: string): string {
  const meta = ROLE_META[role as TeamRole];
  return meta ? meta.labelBn.split(" (")[0] : role;
}

export async function getSessionPayload(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("doibilash_session")?.value;
  if (tokenFromCookie) {
    const payload = verifyToken(tokenFromCookie);
    if (payload?.userId) return payload;
  }

  const headerStore = await headers();
  const authHeader = headerStore.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const payload = verifyToken(authHeader.slice(7).trim());
    if (payload?.userId) return payload;
  }

  return null;
}

export function mapTeamMemberToAdminProfile(m: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  designation: string;
  status: string;
  permissions: unknown;
  avatarUrl: string | null;
  avatarInitials: string;
  notes: string | null;
  passwordHash: string | null;
  lastLogin: Date | null;
  createdAt: Date;
}): AdminProfile {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone || "",
    role: "ADMIN",
    teamRole: m.role,
    teamRoleLabel: roleLabel(m.role),
    designation: m.designation,
    status: m.status,
    permissions: Array.isArray(m.permissions) ? (m.permissions as string[]) : [],
    avatarUrl: m.avatarUrl,
    avatarInitials: m.avatarInitials || m.name.slice(0, 2),
    notes: m.notes || undefined,
    lastLogin: m.lastLogin ? m.lastLogin.toISOString() : null,
    joinedAt: m.createdAt.toISOString(),
    hasPassword: Boolean(m.passwordHash),
  };
}

/** Resolve logged-in TeamMember from JWT (admin panel sessions) */
export async function getAdminFromRequest(): Promise<AdminProfile | null> {
  const payload = await getSessionPayload();
  if (!payload?.userId) return null;

  // Prefer team member when JWT says ADMIN, or when user id matches a team row
  const member = await prisma.teamMember.findUnique({
    where: { id: payload.userId },
  });

  if (!member) return null;
  if (member.status === "Invited" || member.status === "Inactive") return null;

  return mapTeamMemberToAdminProfile(member);
}
