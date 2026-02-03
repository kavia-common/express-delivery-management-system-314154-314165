import React from "react";
import { getBackendBaseURL, isBackendConfigured } from "../../api/client";

// PUBLIC_INTERFACE
export function SetupBanner() {
  /** Warn users when backend URL is not configured; app still boots in UI-only mode. */
  if (isBackendConfigured()) return null;

  return (
    <div className="setupBanner" role="note">
      <strong>Backend not configured.</strong>{" "}
      Set <span className="kbd">REACT_APP_BACKEND_URL</span> (or <span className="kbd">REACT_APP_API_BASE</span>) to connect the UI.
      <div style={{ marginTop: 6, fontSize: 12 }}>
        Current baseURL: <span className="kbd">{getBackendBaseURL() || "(empty)"}</span>
      </div>
    </div>
  );
}
