export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  address?: string;
  joinedAt: string;
}

export interface RegisteredAccount extends UserSession {
  passwordHash?: string;
}

export const AUTH_USER_STORAGE_KEY = "doibilash_user_session_v1";
export const AUTH_USERS_LIST_KEY = "doibilash_registered_users_v1";
export const AUTH_CHANGED_EVENT = "doibilash_auth_changed";

export const DEFAULT_DEMO_USER: UserSession = {
  id: "USR-1001",
  name: "তানভীর আহমেদ",
  phone: "01712345678",
  email: "tanvir.ahmed@example.com",
  city: "ঢাকা সিটি",
  address: "বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা",
  joinedAt: "২০২৬-০১-১০",
};

export function getCurrentUser(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserSession): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: user }));
  } catch (err) {
    console.error("Failed to set user session", err);
  }
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: null }));
  } catch (err) {
    console.error("Failed to clear user session", err);
  }
}

export function getRegisteredUsers(): RegisteredAccount[] {
  if (typeof window === "undefined") return [DEFAULT_DEMO_USER];
  try {
    const raw = localStorage.getItem(AUTH_USERS_LIST_KEY);
    if (!raw) {
      const initial = [DEFAULT_DEMO_USER];
      localStorage.setItem(AUTH_USERS_LIST_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_USER];
  } catch {
    return [DEFAULT_DEMO_USER];
  }
}

export function registerUser(data: {
  name: string;
  phone: string;
  email?: string;
  password?: string;
}): { ok: true; user: UserSession } | { ok: false; error: string } {
  const users = getRegisteredUsers();
  const cleanPhone = data.phone.trim();
  const cleanEmail = (data.email || "").trim().toLowerCase();

  const existingPhone = users.find((u) => u.phone === cleanPhone);
  if (existingPhone) {
    return { ok: false, error: "এই ফোন নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।" };
  }

  if (cleanEmail) {
    const existingEmail = users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return { ok: false, error: "এই ইমেইল ঠিকানা দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।" };
    }
  }

  const newUser: RegisteredAccount = {
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    name: data.name.trim(),
    phone: cleanPhone,
    email: cleanEmail || `${cleanPhone}@customer.doibilash.com`,
    city: "ঢাকা সিটি",
    address: "",
    joinedAt: new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    passwordHash: data.password || "",
  };

  const updatedUsers = [newUser, ...users];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_USERS_LIST_KEY, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error("Failed to save registered users", err);
    }
  }

  // Auto login newly registered user
  setCurrentUser({
    id: newUser.id,
    name: newUser.name,
    phone: newUser.phone,
    email: newUser.email,
    city: newUser.city,
    address: newUser.address,
    joinedAt: newUser.joinedAt,
  });

  return { ok: true, user: newUser };
}

export function loginUser(
  identifier: string,
  _password?: string
): { ok: true; user: UserSession } | { ok: false; error: string } {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return { ok: false, error: "দয়া করে আপনার ফোন নম্বর বা ইমেইল দিন।" };

  const users = getRegisteredUsers();
  const matched = users.find(
    (u) =>
      u.phone === clean ||
      u.phone.replace(/[^0-9]/g, "").endsWith(clean.replace(/[^0-9]/g, "")) ||
      (u.email && u.email.toLowerCase() === clean)
  );

  if (matched) {
    const session: UserSession = {
      id: matched.id,
      name: matched.name,
      phone: matched.phone,
      email: matched.email,
      city: matched.city,
      address: matched.address,
      joinedAt: matched.joinedAt,
    };
    setCurrentUser(session);
    return { ok: true, user: session };
  }

  // If not found in registered list, create instant customer session for seamless UX
  const isPhone = /^01[3-9]\d{8}$/.test(clean.replace(/[\s-]/g, ""));
  const fallbackUser: UserSession = {
    id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
    name: isPhone ? `সম্মানিত গ্রাহক (${clean.slice(-4)})` : clean.split("@")[0],
    phone: isPhone ? clean : "01710000000",
    email: isPhone ? `${clean}@customer.doibilash.com` : clean,
    city: "ঢাকা সিটি",
    address: "",
    joinedAt: new Date().toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  setCurrentUser(fallbackUser);
  return { ok: true, user: fallbackUser };
}

