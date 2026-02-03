import React from "react";
import { useNotifications } from "../notifications/NotificationsContext";

// PUBLIC_INTERFACE
export function NotificationsPage() {
  /** Notifications page (customer/courier). */
  const notifications = useNotifications();

  return (
    <div className="content">
      <div className="container">
        <div className="card">
          <div className="cardHeader">
            <h2>Notifications</h2>
            <div className="actionsRow">
              <button className="btn btnSmall" type="button" onClick={notifications.markAllRead}>
                Mark all read
              </button>
            </div>
          </div>
          <div className="cardBody">
            {notifications.items.length === 0 ? (
              <div style={{ color: "var(--muted)" }}>No notifications yet.</div>
            ) : (
              <table className="table" aria-label="Notifications list">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Body</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {notifications.items.map((n) => (
                    <tr key={n.id}>
                      <td>
                        <span className={n.read ? "chip" : "chip chipPrimary"}>{n.read ? "read" : "new"}</span>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 13 }}>{n.title}</td>
                      <td style={{ color: "var(--muted)", fontSize: 13 }}>{n.body}</td>
                      <td style={{ textAlign: "right" }}>
                        {!n.read ? (
                          <button className="btn btnSmall" type="button" onClick={() => notifications.markRead(n.id)}>
                            Mark read
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="helper" style={{ marginTop: 10 }}>
              This is an in-memory placeholder. Backend notification wiring will plug into this store later.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
