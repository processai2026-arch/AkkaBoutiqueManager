import type { AuthUser } from "@/types";

const KEY = "boutiqueos.auth";

const ADMIN: AuthUser = {
  email: "admin@boutiqueos.com",
  name: "Lakshmi (Owner)",
  role: "admin",
};

export function login(email: string, password: string): AuthUser | null {
  const e = email.trim().toLowerCase();
  if (password !== "demo123") return null;
  if (e === ADMIN.email) {
    localStorage.setItem(KEY, JSON.stringify(ADMIN));
    return ADMIN;
  }
  return null;
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(KEY);
}
