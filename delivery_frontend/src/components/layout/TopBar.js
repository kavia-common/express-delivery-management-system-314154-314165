import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useNotifications } from "../../notifications/NotificationsContext";

function BellIcon() {
  return (
    <svg className="navIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function routeTitle(pathname) {
  if (pathname.startsWith("/customer/create")) return "Create delivery";
  if (pathname.startsWith("/customer/deliveries/")) return "Delivery details";
  if (pathname.startsWith("/customer/deliveries")) return "My deliveries";
  if (pathname.startsWith("/courier/jobs")) return "Available jobs";
  if (pathname.startsWith("/courier/assigned")) return "My assigned deliveries";
  if (pathname.startsWith("/deliveries/")) return "Delivery details";
  if (pathname.startsWith("/notifications")) return "Notifications";
  if (pathname.startsWith("/login")) return "Login";
  if (pathname.startsWith("/register")) return "Register";
  return "Dashboard";
}

// PUBLIC_INTERFACE
export function TopBar() {
  /** Top app bar with page title, notifications, and profile indicator. */
  const { pathname } = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();
  const notifications = useNotifications();

  const [open, setOpen] = useState(false);

  const title = useMemo(() => routeTitle(pathname), [pathname]);
  const initials = useMemo(() => {
    const email = auth.user?.email || "";
    if (!email) return "U";
    return email.slice(0, 1).toUpperCase();
  }, [auth.user]);

  const unreadCount = notifications.items.filter((n) => !n.read).length;

  return (
    <header className="topbar" aria-label="Top bar">
      <div className="topbarLeft">
        <div className="pageTitle">{title}</div>
        <div className="pill">Primary {getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#3b82f6"}</div>
      </div>

      <div className="topbarRight">
        <button
          className={`iconBtn ${unreadCount ? "badgeDot" : ""}`}
          onClick={() => setOpen((v) => !v)}
          type="button"
          aria-label="Open notifications"
        >
          <BellIcon />
        </button>

        <button
          className="avatar"
          type="button"
          onClick={() => {
            if (auth.isAuthed) return;
            navigate("/login");
          }}
          aria-label="Profile"
          title={auth.user?.email || "Guest"}
        >
          {initials}
        </button>
      </div>

      {open ? (
        <div className="dropdown" role="dialog" aria-label="Notifications dropdown">
          <div className="dropdownHeader">
            <strong>Notifications</strong>
            <div className="actionsRow">
              <button className="btn btnSmall" onClick={notifications.markAllRead} type="button">
                Mark all read
              </button>
              <Link className="btn btnSmall" to="/notifications" onClick={() => setOpen(false)}>
                View all
              </Link>
            </div>
          </div>
          <div className="dropdownList">
            {notifications.items.length === 0 ? (
              <div className="dropdownItem">
                <div className="dropdownItemTitle">No notifications</div>
                <div className="dropdownItemBody">We’ll show delivery updates here.</div>
              </div>
            ) : (
              notifications.items.slice(0, 6).map((n) => (
                <div key={n.id} className="dropdownItem">
                  <div className="dropdownItemTitle">
                    {n.title} {n.read ? null : <span className="chip chipPrimary">new</span>}
                  </div>
                  <div className="dropdownItemBody">{n.body}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
