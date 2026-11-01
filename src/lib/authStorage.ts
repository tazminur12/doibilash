export interface UserSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
  city?: string;
  address?: string;
  role?: string;
  joinedAt: string;
  shippingAddress?: unknown;
  billingAddress?: unknown;
}

export const AUTH_USER_STORAGE_KEY = "doibilash_user_session_v1";
export const AUTH_TOKEN_KEY = "doibilash_auth_token_v1";
export const AUTH_CHANGED_EVENT = "doibilash_auth_changed";

export const DEFAULT_DEMO_USER: UserSession = {
  id: "USR-1001",
  name: "তানভীর আহমেদ",
  phone: "01712345678",
  email: "tanvir.ahmed@example.com",
  avatarUrl: null,
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

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (err) {
    console.error("Failed to set auth token", err);
  }
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (err) {
    console.error("Failed to clear auth token", err);
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
    clearAuthToken();
    window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: null }));
    fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
  } catch (err) {
    console.error("Failed to clear user session", err);
  }
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });
}

export async function syncCurrentUserWithServer(): Promise<UserSession | null> {
  if (typeof window === "undefined") return null;
  const token = getAuthToken();
  const cached = getCurrentUser();

  // If visitor has no token and no cached session, they are a guest: avoid background requests
  if (!token && !cached) return null;

  try {
    const res = await authFetch("/api/auth/me", { method: "GET" });
    if (!res.ok) return getCurrentUser();
    const data = await res.json();
    if (data.ok && data.user) {
      setCurrentUser(data.user);
      return data.user;
    } else if (data.ok && data.user === null) {
      // Server confirmed no active session
      clearCurrentUser();
      return null;
    }
    return getCurrentUser();
  } catch {
    return getCurrentUser();
  }
}

export async function registerUser(data: {
  name: string;
  phone: string;
  email?: string;
  password?: string;
}): Promise<{ ok: true; user: UserSession } | { ok: false; error: string }> {
  try {
    const res = await authFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (res.ok && json.ok) {
      if (json.token) setAuthToken(json.token);
      setCurrentUser(json.user);
      return { ok: true, user: json.user };
    }
    return { ok: false, error: json.error || "রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি।" };
  } catch (err) {
    console.error("registerUser API call failed", err);
    return { ok: false, error: "সার্ভারে সংযোগ করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।" };
  }
}

export async function loginUser(
  identifier: string,
  password?: string
): Promise<{ ok: true; user: UserSession } | { ok: false; error: string }> {
  try {
    const res = await authFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });

    const json = await res.json();
    if (res.ok && json.ok) {
      if (json.token) setAuthToken(json.token);
      setCurrentUser(json.user);
      return { ok: true, user: json.user };
    }
    return { ok: false, error: json.error || "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।" };
  } catch (err) {
    console.error("loginUser API call failed", err);
    return { ok: false, error: "সার্ভারে সংযোগ করা যায়নি। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।" };
  }
}
