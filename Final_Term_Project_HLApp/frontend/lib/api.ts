export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "doctor" | "patient";
};

type ApiResult<T = any> = {
  ok: boolean;
  data?: T;
  message?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function getSession(): { token: string; user: SessionUser } | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("healthlink_token");
  const user = localStorage.getItem("healthlink_user");
  return token && user ? { token, user: JSON.parse(user) } : null;
}

export function saveSession(data: { token: string; user: SessionUser }) {
  localStorage.setItem("healthlink_token", data.token);
  localStorage.setItem("healthlink_user", JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem("healthlink_token");
  localStorage.removeItem("healthlink_user");
}

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  const session = getSession();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (session?.token) headers.set("Authorization", `Bearer ${session.token}`);

  try {
    const response = await fetch(`${API_URL}${path}`, { ...init, headers });
    const data = await response.json().catch(() => ({}));
    return response.ok ? { ok: true, data } : { ok: false, message: data.message || "Request failed", data };
  } catch (error) {
    return { ok: false, message: "API server is not reachable" };
  }
}
