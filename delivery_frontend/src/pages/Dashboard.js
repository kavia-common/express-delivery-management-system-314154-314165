import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { MapPlaceholder } from "../components/layout/MapPlaceholder";
import { SetupBanner } from "../components/layout/SetupBanner";

// PUBLIC_INTERFACE
export function Dashboard() {
  /** App landing dashboard with central map area placeholder. */
  const auth = useAuth();

  return (
    <div className="content">
      <SetupBanner />
      <div className="grid2">
        <div className="card">
          <div className="cardHeader">
            <h2>Live tracking</h2>
            <span className="chip chipPrimary">Real-time placeholder</span>
          </div>
          <div className="cardBody">
            <MapPlaceholder />
          </div>
        </div>

        <div className="card">
          <div className="cardHeader">
            <h2>Quick actions</h2>
            <span className="chip chipSuccess">Ready</span>
          </div>
          <div className="cardBody">
            {!auth.isAuthed ? (
              <>
                <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 13 }}>
                  Sign in to create and manage deliveries.
                </p>
                <div className="actionsRow">
                  <Link className="btn btnPrimary" to="/login">
                    Login
                  </Link>
                  <Link className="btn" to="/register">
                    Register
                  </Link>
                </div>
              </>
            ) : auth.role === "customer" ? (
              <>
                <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 13 }}>
                  Create a delivery request and track it in real time.
                </p>
                <div className="actionsRow">
                  <Link className="btn btnPrimary" to="/customer/create">
                    Create delivery
                  </Link>
                  <Link className="btn" to="/customer/deliveries">
                    My deliveries
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 13 }}>
                  Browse available jobs and manage assigned deliveries.
                </p>
                <div className="actionsRow">
                  <Link className="btn btnPrimary" to="/courier/jobs">
                    Available jobs
                  </Link>
                  <Link className="btn" to="/courier/assigned">
                    My assigned
                  </Link>
                </div>
              </>
            )}

            <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)" }}>
              Theme: <span className="chip chipPrimary">light</span> · Primary <span className="chip chipPrimary">#3b82f6</span> · Success{" "}
              <span className="chip chipSuccess">#06b6d4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
