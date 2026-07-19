export type UserRole = "user" | "vendor";

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("role") as UserRole) || null;
}

export function saveSession(token: string, role: UserRole) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}