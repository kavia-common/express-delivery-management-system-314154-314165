import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

// PUBLIC_INTERFACE
export function AppLayout() {
  /** Main app shell layout with sidebar and topbar. */
  return (
    <div className="appShell">
      <Sidebar />
      <div className="main">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
