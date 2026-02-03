import React from "react";

// PUBLIC_INTERFACE
export function MapPlaceholder({ title = "Live map tracking", subtitle = "Map integration will be wired once backend events are ready." }) {
  /** Placeholder for map component (central live tracking area). */
  return (
    <div className="mapPlaceholder" aria-label="Map placeholder">
      <div>
        <div style={{ fontWeight: 800, color: "#1f2937" }}>{title}</div>
        <div style={{ marginTop: 6, fontSize: 13 }}>{subtitle}</div>
        <div style={{ marginTop: 10, fontSize: 12 }}>
          Tip: set <span className="kbd">REACT_APP_BACKEND_URL</span> and <span className="kbd">REACT_APP_WS_URL</span>.
        </div>
      </div>
    </div>
  );
}
