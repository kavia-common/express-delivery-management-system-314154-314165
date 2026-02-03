import React, { createContext, useContext, useMemo, useState } from "react";

const NotificationsContext = createContext(null);

function makeId() {
  return Math.random().toString(16).slice(2);
}

// PUBLIC_INTERFACE
export function NotificationsProvider({ children }) {
  /** Provides a simple in-memory notifications store (placeholder). */
  const [items, setItems] = useState([
    {
      id: makeId(),
      title: "Welcome",
      body: "Create a delivery or accept a job to start tracking updates.",
      read: false,
      ts: Date.now(),
    },
  ]);

  function add({ title, body }) {
    setItems((prev) => [
      { id: makeId(), title, body, read: false, ts: Date.now() },
      ...prev,
    ]);
  }

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const value = useMemo(() => ({ items, add, markAllRead, markRead }), [items]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotifications() {
  /** Hook to access notifications store. */
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
