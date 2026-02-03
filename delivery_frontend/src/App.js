import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ToastProvider } from "./components/toast/ToastProvider";
import { NotificationsProvider } from "./notifications/NotificationsContext";

import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { CreateDelivery } from "./pages/customer/CreateDelivery";
import { MyDeliveries } from "./pages/customer/MyDeliveries";
import { DeliveryDetails } from "./pages/DeliveryDetails";
import { NotificationsPage } from "./pages/NotificationsPage";
import { AvailableJobs } from "./pages/courier/AvailableJobs";
import { MyAssignedDeliveries } from "./pages/courier/MyAssignedDeliveries";

// PUBLIC_INTERFACE
function App() {
  /** App entry: routing + global providers (auth, toasts, notifications). */
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationsProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/notifications" element={<NotificationsPage />} />

                <Route element={<ProtectedRoute roles={["customer"]} />}>
                  <Route path="/customer/create" element={<CreateDelivery />} />
                  <Route path="/customer/deliveries" element={<MyDeliveries />} />
                </Route>

                <Route element={<ProtectedRoute roles={["courier"]} />}>
                  <Route path="/courier/jobs" element={<AvailableJobs />} />
                  <Route path="/courier/assigned" element={<MyAssignedDeliveries />} />
                </Route>

                <Route element={<ProtectedRoute roles={["customer", "courier"]} />}>
                  <Route path="/deliveries/:id" element={<DeliveryDetails />} />
                  {/* Back-compat/shortcut for customer details */}
                  <Route path="/customer/deliveries/:id" element={<DeliveryDetails />} />
                </Route>

                <Route path="*" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </NotificationsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
