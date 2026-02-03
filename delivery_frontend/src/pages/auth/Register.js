import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

// PUBLIC_INTERFACE
export function Register() {
  /** Registration screen (customer/courier role selection). */
  const auth = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email.includes("@")) e.email = "Enter a valid email.";
    if (!["customer", "courier"].includes(role)) e.role = "Choose a valid role.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (confirm !== password) e.confirm = "Passwords do not match.";
    return e;
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (!isBackendConfigured()) {
      toast.error("Backend not configured", "Set REACT_APP_BACKEND_URL to enable registration.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = await auth.register({ email, password, role });
      if (payload?.token) {
        navigate(role === "courier" ? "/courier/jobs" : "/customer/deliveries");
      } else {
        navigate("/login");
      }
    } catch (err) {
      toast.error("Registration failed", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="content">
      <div className="container">
        <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <div className="cardHeader">
            <h2>Register</h2>
            <span className="chip chipSuccess">Role-based</span>
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
                  <label htmlFor="role">Role</label>
                  {errors.role ? <span className="errorText">{errors.role}</span> : null}
                </div>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="courier">Courier</option>
                </select>
              </div>

              <div className="grid2">
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
                    autoComplete="new-password"
                  />
                </div>

                <div className="field">
                  <div className="labelRow">
                    <label htmlFor="confirm">Confirm</label>
                    {errors.confirm ? <span className="errorText">{errors.confirm}</span> : null}
                  </div>
                  <input
                    id="confirm"
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="actionsRow">
                <button className="btn btnPrimary" type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create account"}
                </button>
                <Link className="btn" to="/login">
                  Back to login
                </Link>
              </div>

              <div className="helper">
                Expected endpoint <span className="kbd">POST /auth/register</span> with <span className="kbd">role</span>.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
