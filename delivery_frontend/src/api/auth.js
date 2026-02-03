import api from "./client";

// PUBLIC_INTERFACE
export async function apiLogin({ email, password }) {
  /** Login API call. */
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

// PUBLIC_INTERFACE
export async function apiRegister({ email, password, role }) {
  /** Register API call. */
  const res = await api.post("/auth/register", { email, password, role });
  return res.data;
}
