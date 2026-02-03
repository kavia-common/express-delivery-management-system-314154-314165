import React, { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function id() {
  return Math.random().toString(16).slice(2);
}

function ToastItem({ toast, onClose }) {
  const variantClass =
    toast.variant === "success"
      ? "toastVariantSuccess"
      : toast.variant === "error"
        ? "toastVariantError"
        : "toastVariantInfo";

  return (
    <div className={`toast ${variantClass}`} role="status" aria-live="polite">
      <div>
        <div className="toastTitle">{toast.title}</div>
        {toast.body ? <div className="toastBody">{toast.body}</div> : null}
      </div>
      <button className="toastClose" onClick={() => onClose(toast.id)} aria-label="Close toast">
        Close
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
export function ToastProvider({ children }) {
  /** Global toast provider with helper methods. */
  const [toasts, setToasts] = useState([]);

  function push({ title, body, variant = "info", timeoutMs = 3500 }) {
    const toast = { id: id(), title, body, variant };
    setToasts((prev) => [toast, ...prev]);

    if (timeoutMs) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, timeoutMs);
    }
  }

  function remove(toastId) {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  }

  const api = useMemo(() => {
    return {
      push,
      info: (title, body) => push({ title, body, variant: "info" }),
      success: (title, body) => push({ title, body, variant: "success" }),
      error: (title, body) => push({ title, body, variant: "error", timeoutMs: 6000 }),
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toastWrap">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to show toast notifications. */
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
