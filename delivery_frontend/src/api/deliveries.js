import api from "./client";

// PUBLIC_INTERFACE
export async function createDelivery(payload) {
  /** Create a delivery request (customer). */
  const res = await api.post("/deliveries", payload);
  return res.data;
}

// PUBLIC_INTERFACE
export async function listMyDeliveries() {
  /** List deliveries for current user (customer). */
  const res = await api.get("/deliveries/my");
  return res.data;
}

// PUBLIC_INTERFACE
export async function getDeliveryById(id) {
  /** Fetch delivery details by id. */
  const res = await api.get(`/deliveries/${encodeURIComponent(id)}`);
  return res.data;
}

// PUBLIC_INTERFACE
export async function listAvailableJobs() {
  /** List available deliveries to accept (courier). */
  const res = await api.get("/courier/jobs");
  return res.data;
}

// PUBLIC_INTERFACE
export async function listAssignedDeliveries() {
  /** List courier assigned deliveries. */
  const res = await api.get("/courier/assigned");
  return res.data;
}

// PUBLIC_INTERFACE
export async function updateDeliveryStatus(id, status) {
  /** Update delivery status (courier actions). */
  const res = await api.post(`/deliveries/${encodeURIComponent(id)}/status`, { status });
  return res.data;
}
