const TOKEN_KEY = "delivery.jwt";
const USER_KEY = "delivery.user";

/**
 * Stored user shape:
 * { id?: string, email?: string, role?: "customer" | "courier" }
 */

// PUBLIC_INTERFACE
export function setAuth({ token, user }) {
  /** Persist auth token and basic user info in localStorage. */
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Read the auth token from localStorage (if any). */
  return localStorage.getItem(TOKEN_KEY) || "";
}

// PUBLIC_INTERFACE
export function getAuthUser() {
  /** Read the persisted user from localStorage (if any). */
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function clearAuth() {
  /** Clear local auth information. */
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// PUBLIC_INTERFACE
export function isAuthenticated() {
  /** Check whether a token exists (does not validate token). */
  return Boolean(getAuthToken());
}
