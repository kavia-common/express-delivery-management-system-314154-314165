import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { clearAuth, getAuthUser, isAuthenticated, setAuth } from "./authStorage";
import { useToast } from "../components/toast/ToastProvider";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and actions (login/register/logout). */
  const [user, setUser] = useState(getAuthUser());
  const [tokenPresent, setTokenPresent] = useState(isAuthenticated());
  const toast = useToast();

  useEffect(() => {
    setUser(getAuthUser());
    setTokenPresent(isAuthenticated());
  }, []);

  async function login({ email, password }) {
    // Endpoint is backend-dependent; keep flexible.
    // Expected response: { token, user }
    const res = await api.post("/auth/login", { email, password });
    const payload = res.data || {};
    setAuth({ token: payload.token, user: payload.user });
    setUser(payload.user || null);
    setTokenPresent(Boolean(payload.token));
    toast.success("Signed in", "Welcome back.");
    return payload;
  }

  async function register({ email, password, role }) {
    const res = await api.post("/auth/register", { email, password, role });
    const payload = res.data || {};

    // Some backends return token on register; support both.
    if (payload.token) {
      setAuth({ token: payload.token, user: payload.user });
      setUser(payload.user || null);
      setTokenPresent(Boolean(payload.token));
      toast.success("Account created", "You are now signed in.");
    } else {
      toast.success("Account created", "Please sign in.");
    }

    return payload;
  }

  function logout() {
    clearAuth();
    setUser(null);
    setTokenPresent(false);
    toast.info("Signed out", "You have been signed out.");
  }

  const value = useMemo(() => {
    const role = user?.role || null;
    return {
      user,
      role,
      isAuthed: tokenPresent,
      login,
      register,
      logout,
      hasRole: (allowed) => {
        if (!allowed) return true;
        const allowList = Array.isArray(allowed) ? allowed : [allowed];
        return Boolean(role && allowList.includes(role));
      },
    };
  }, [user, tokenPresent]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
