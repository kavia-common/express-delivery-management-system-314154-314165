import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

function Icon({ name }) {
  // Minimal inline icons (no extra deps)
  const common = { className: "navIcon", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-6v-6H10v6H4a1 1 0 0 1-1-1v-10.5z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "list":
      return (
        <svg {...common}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </svg>
      );
    case "package":
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="M3.29 7 12 12l8.71-5" />
          <path d="M12 22V12" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "truck":
      return (
        <svg {...common}>
          <path d="M3 17V6a1 1 0 0 1 1-1h11v12H3z" />
          <path d="M15 8h4l2 3v6h-6V8z" />
          <path d="M7.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
          <path d="M17.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        </svg>
      );
    default:
      return null;
  }
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `navItem ${isActive ? "navItemActive" : ""}`}
      end
    >
      <Icon name={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Sidebar navigation with role-aware sections. */
  const auth = useAuth();

  const links = useMemo(() => {
    const base = [{ to: "/", icon: "home", label: "Dashboard" }];

    if (!auth.isAuthed) {
      return base;
    }

    if (auth.role === "customer") {
      return [
        ...base,
        { to: "/customer/create", icon: "plus", label: "Create Delivery" },
        { to: "/customer/deliveries", icon: "list", label: "My Deliveries" },
        { to: "/notifications", icon: "bell", label: "Notifications" },
      ];
    }

    if (auth.role === "courier") {
      return [
        ...base,
        { to: "/courier/jobs", icon: "truck", label: "Available Jobs" },
        { to: "/courier/assigned", icon: "package", label: "My Assigned" },
        { to: "/notifications", icon: "bell", label: "Notifications" },
      ];
    }

    return [...base, { to: "/notifications", icon: "bell", label: "Notifications" }];
  }, [auth.isAuthed, auth.role]);

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      <div className="brand">
        <div className="brandMark" aria-hidden="true" />
        <div className="brandText">
          <strong>Express Delivery</strong>
          <span>Tracking & management</span>
        </div>
      </div>

      <div className="navSectionTitle">Navigation</div>
      <nav className="navList">
        {links.map((l) => (
          <NavItem key={l.to} to={l.to} icon={l.icon} label={l.label} />
        ))}
      </nav>

      <div className="navSectionTitle">Account</div>
      <div className="navList">
        {!auth.isAuthed ? (
          <>
            <NavItem to="/login" icon="package" label="Login" />
            <NavItem to="/register" icon="plus" label="Register" />
          </>
        ) : (
          <button className="navItem" onClick={auth.logout} type="button">
            <span style={{ width: 18 }} aria-hidden="true" />
            <span>Logout</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 16, padding: "10px 8px", color: "var(--muted)", fontSize: 12 }}>
        Role: <span className="chip chipPrimary">{auth.role || "guest"}</span>
      </div>
    </aside>
  );
}
