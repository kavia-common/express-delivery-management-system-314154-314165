import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

// PUBLIC_INTERFACE
export function Login() {
  /** Login screen with JWT storage via AuthContext. */
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (!isBackendConfigured()) {
      toast.error("Backend not configured", "Set REACT_APP_BACKEND_URL to enable login.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = await auth.login({ email, password });
      const role = payload?.user?.role || auth.role;
      if (role === "courier") navigate("/courier/jobs");
      else navigate("/customer/deliveries");
    } catch (err) {
      toast.error("Login failed", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="content">
      <div className="container">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="cardHeader">
            <h2>Login</h2>
            <span className="chip chipPrimary">JWT</span>
          </div>
          <div className="cardBody">
            <form className="form" onSubmit={onSubmit}>
              <div className="field">
                <div className="labelRow">
                  <label htmlFor="email">Email</label>
                  {errors.email ? <span className="errorText">{errors.email}</span> : null}
                </div>
                <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>

              <div className="field">
                <div className="labelRow">
                  <label htmlFor="password">Password</label>
                  {errors.password ? <span className="errorText">{errors.password}</span> : null}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="actionsRow">
                <button className="btn btnPrimary" type="submit" disabled={submitting}>
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
                <Link className="btn" to="/register">
                  Create account
                </Link>
              </div>

              <div className="helper">
                Demo note: endpoints expected <span className="kbd">POST /auth/login</span>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
