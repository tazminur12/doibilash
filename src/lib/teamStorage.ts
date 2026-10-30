export type TeamRole = "Super Admin" | "Manager" | "Moderator" | "Staff";
export type MemberStatus = "Active" | "Inactive" | "Suspended";

export interface RolePermission {
  id: string;
  labelBn: string;
  description: string;
  category: "অর্ডার" | "ইনভেন্টরি" | "গ্রাহক" | "সিস্টেম";
}

export const ALL_PERMISSIONS: RolePermission[] = [
  {
    id: "orders_view",
    labelBn: "অর্ডার দেখা ও অনুসন্ধান",
    description: "সকল গ্রাহকের অর্ডার তালিকা এবং চালান দেখার অনুমতি",
    category: "অর্ডার",
  },
  {
    id: "orders_manage",
    labelBn: "ম্যানুয়াল অর্ডার তৈরি ও স্ট্যাটাস আপডেট",
    description: "নতুন অর্ডার তৈরি, প্রসেসিং ও ডেলিভারি স্ট্যাটাস পরিবর্তনের অধিকার",
    category: "অর্ডার",
  },
  {
    id: "products_manage",
    labelBn: "পণ্য যোগ, মূল্য ও ডিসকাউন্ট",
    description: "নতুন খাদ্যপণ্য যোগ, ছবি আপলোড এবং দাম নির্ধারণের অনুমতি",
    category: "ইনভেন্টরি",
  },
  {
    id: "categories_manage",
    labelBn: "ক্যাটাগরি নিয়ন্ত্রণ",
    description: "দই, মিষ্টি ও খাদ্য বিভাগের ক্যাটাগরি ব্যবস্থাপনা",
    category: "ইনভেন্টরি",
  },
  {
    id: "customers_manage",
    labelBn: "গ্রাহক ডাটাবেজ ও ভিআইপি লয়ালটি",
    description: "গ্রাহক প্রোফাইল দেখা, ম্যানুয়ালি যুক্তকরণ ও টিয়ার পরিবর্তন",
    category: "গ্রাহক",
  },
  {
    id: "settings_manage",
    labelBn: "সিস্টেম ও পেমেন্ট গেটওয়ে সেটিংস",
    description: "বিকাশ/নগদ গেটওয়ে, ডেলিভারি ফি এবং ব্র্যান্ড সেটিংস পরিবর্তন",
    category: "সিস্টেম",
  },
  {
    id: "team_manage",
    labelBn: "টিম সদস্য ও রোল ব্যবস্থাপনা",
    description: "নতুন অ্যাডমিন, মডারেটর নিয়োগ ও পারমিশন কন্ট্রোল",
    category: "সিস্টেম",
  },
  {
    id: "reports_view",
    labelBn: "আর্থিক ও সেলস অ্যানালিটিক্স",
    description: "সামগ্রিক রাজস্ব, দৈনিক লাভ-ক্ষতি ও বিক্রয় রিপোর্ট দেখা",
    category: "সিস্টেম",
  },
];

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: TeamRole;
  designation: string;
  status: MemberStatus;
  avatarInitials: string;
  permissions: string[];
  joinedDate: string;
  lastLogin: string;
  notes?: string;
}

export const ROLE_META: Record<
  TeamRole,
  {
    labelBn: string;
    subtitle: string;
    color: string;
    bg: string;
    border: string;
    badgeBg: string;
    defaultPermissions: string[];
  }
> = {
  "Super Admin": {
    labelBn: "সুপার অ্যাডমিন (Super Admin)",
    subtitle: "সর্বোচ্চ প্রশাসনিক এক্সেস ও সিস্টেম কন্ট্রোল",
    color: "text-purple-900",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badgeBg: "bg-linear-to-r from-[#351C1B] to-[#C48A4E] text-amber-100",
    defaultPermissions: ALL_PERMISSIONS.map((p) => p.id),
  },
  Manager: {
    labelBn: "ম্যানেজার (Operations Manager)",
    subtitle: "দৈনন্দিন বিক্রয়, পণ্য স্টক ও অর্ডার নিয়ন্ত্রণ",
    color: "text-blue-900",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badgeBg: "bg-blue-600 text-white",
    defaultPermissions: [
      "orders_view",
      "orders_manage",
      "products_manage",
      "categories_manage",
      "customers_manage",
      "reports_view",
    ],
  },
  Moderator: {
    labelBn: "মডারেটর (Store Moderator)",
    subtitle: "অর্ডার যাচাই, স্ট্যাটাস ট্র্যাকিং ও কাস্টমার কেয়ার",
    color: "text-emerald-900",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeBg: "bg-emerald-600 text-white",
    defaultPermissions: [
      "orders_view",
      "orders_manage",
      "customers_manage",
    ],
  },
  Staff: {
    labelBn: "স্টাফ / ডেলিভারি অপারেটর (Staff)",
    subtitle: "অর্ডার প্যাকেজিং ও ডেলিভারি হ্যান্ডলিং",
    color: "text-stone-800",
    bg: "bg-stone-100",
    border: "border-stone-200",
    badgeBg: "bg-stone-700 text-white",
    defaultPermissions: [
      "orders_view",
      "orders_manage",
    ],
  },
};

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "TEAM-001",
    name: "তাজমিনুর রহমান",
    email: "tazminur@doibilash.com",
    phone: "01712-000001",
    role: "Super Admin",
    designation: "ফাউন্ডার ও প্রধান নির্বাহী",
    status: "Active",
    avatarInitials: "তার",
    permissions: ALL_PERMISSIONS.map((p) => p.id),
    joinedDate: "০১ জানুয়ারি, ২০২৬",
    lastLogin: "এখন সক্রিয় (Just Now)",
    notes: "মাস্টার সুপার অ্যাডমিন অ্যাকাউন্ট। সর্বময় সিস্টেম ক্ষমতা সম্পন্ন।",
  },
  {
    id: "TEAM-002",
    name: "তানভীর আহমেদ",
    email: "tanvir.ops@doibilash.com",
    phone: "01823-000002",
    role: "Manager",
    designation: "অপারেশনস ও সাপ্লাই চেইন ম্যানেজার",
    status: "Active",
    avatarInitials: "তাআ",
    permissions: ROLE_META.Manager.defaultPermissions,
    joinedDate: "১৫ জানুয়ারি, ২০২৬",
    lastLogin: "২০ মিনিট আগে",
    notes: "বগুড়া কারখানা এবং ঢাকা হাবের সমস্ত ডেলিভারি ও স্টক মনিটরিং করেন।",
  },
  {
    id: "TEAM-003",
    name: "সাদিয়া ইসলাম",
    email: "sadia.mod@doibilash.com",
    phone: "01934-000003",
    role: "Moderator",
    designation: "কাস্টমার সাপোর্ট ও অর্ডার স্পেশালিস্ট",
    status: "Active",
    avatarInitials: "সাই",
    permissions: ROLE_META.Moderator.defaultPermissions,
    joinedDate: "০১ ফেব্রুয়ারি, ২০২৬",
    lastLogin: "২ ঘণ্টা আগে",
    notes: "গ্রাহকদের ফোন কল যাচাই ও বিকাশ পেমেন্ট নিশ্চিত করেন।",
  },
  {
    id: "TEAM-004",
    name: "রাকিবুল হাসান",
    email: "rakib.staff@doibilash.com",
    phone: "01545-000004",
    role: "Staff",
    designation: "প্যাকেজিং ও ডিসপ্যাচ অফিসার",
    status: "Active",
    avatarInitials: "রাহা",
    permissions: ROLE_META.Staff.defaultPermissions,
    joinedDate: "১০ ফেব্রুয়ারি, ২০২৬",
    lastLogin: "আজ দুপুর ২:১৫",
    notes: "মাটির হাঁড়ির নিরাপদ বাবল র‍্যাপ প্যাকিং ও কুরিয়ার হ্যান্ডওভার।",
  },
];

const STORAGE_KEY = "doibilash_admin_team_v1";

export function getStoredTeamMembers(): TeamMember[] {
  if (typeof window === "undefined") {
    return DEFAULT_TEAM_MEMBERS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TEAM_MEMBERS));
      return DEFAULT_TEAM_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TEAM_MEMBERS;
  } catch {
    return DEFAULT_TEAM_MEMBERS;
  }
}

export function saveTeamMember(member: TeamMember): TeamMember[] {
  const members = getStoredTeamMembers();
  const index = members.findIndex((m) => m.id === member.id || m.email === member.email);

  let updated: TeamMember[];
  if (index >= 0) {
    updated = [...members];
    updated[index] = { ...member };
  } else {
    updated = [member, ...members];
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save team member to localStorage", err);
    }
  }
  return updated;
}

export function deleteTeamMember(id: string): TeamMember[] {
  const members = getStoredTeamMembers();
  const updated = members.filter((m) => m.id !== id);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to delete team member from localStorage", err);
    }
  }
  return updated;
}

export function getTeamMemberById(id: string): TeamMember | undefined {
  const members = getStoredTeamMembers();
  return members.find((m) => m.id === id || m.email === id);
}
