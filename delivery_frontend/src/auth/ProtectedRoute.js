import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
export function ProtectedRoute({ roles }) {
  /** Protect routes by requiring auth and optional role(s). */
  const auth = useAuth();

  if (!auth.isAuthed) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !auth.hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
