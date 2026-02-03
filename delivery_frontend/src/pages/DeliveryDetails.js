import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getDeliveryById, updateDeliveryStatus } from "../api/deliveries";
import { useAuth } from "../auth/AuthContext";
import { MapPlaceholder } from "../components/layout/MapPlaceholder";
import { useToast } from "../components/toast/ToastProvider";
import { isBackendConfigured } from "../api/client";
import { createRealtimeClient } from "../realtime/realtimeClient";
import { useNotifications } from "../notifications/NotificationsContext";

function chipClass(status) {
  const s = (status || "pending").toLowerCase();
  if (s === "delivered") return "chip chipSuccess";
  if (s === "cancelled" || s === "failed") return "chip chipDanger";
  if (s.includes("transit") || s.includes("picked")) return "chip chipPrimary";
  return "chip";
}

function prettyLocation(loc) {
  if (!loc) return "—";
  if (typeof loc === "string") return loc;
  const lat = loc.lat ?? loc.latitude;
  const lng = loc.lng ?? loc.longitude;
  if (typeof lat === "number" && typeof lng === "number") return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  return JSON.stringify(loc);
}

// PUBLIC_INTERFACE
export function DeliveryDetails() {
  /** Delivery details view with live update placeholder; courier actions included when role=courier. */
  const { id } = useParams();
  const auth = useAuth();
  const toast = useToast();
  const notifications = useNotifications();

  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rtStatus, setRtStatus] = useState({ connected: false });

  const realtimeRef = useRef(null);

  const canCourierAct = auth.isAuthed && auth.role === "courier";

  async function load() {
    setLoading(true);
    try {
      if (!isBackendConfigured()) {
        setDelivery({
          _id: id,
          pickupLocation: "Demo pickup",
          dropoffLocation: "Demo dropoff",
          status: "pending",
          lastLocation: { lat: 37.7749, lng: -122.4194 },
        });
        return;
      }
      const data = await getDeliveryById(id);
      setDelivery(data);
    } catch (err) {
      toast.error("Failed to load", err.message);
      setDelivery(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // Setup realtime placeholder client
    const client = createRealtimeClient({
      onStatus: (s) => setRtStatus(s),
      onMessage: (msg) => {
        // Placeholder: when backend emits updates, update local state + notifications.
        if (msg?.type === "delivery.update" && msg.deliveryId === id) {
          setDelivery((prev) => ({ ...(prev || {}), ...(msg.payload || {}) }));
          notifications.add({ title: "Delivery update", body: `Delivery ${id} updated.` });
        }
      },
    });
    realtimeRef.current = client;
    client.connect();
    client.subscribeToDelivery(id);

    return () => client.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const status = delivery?.status || "—";

  const actionButtons = useMemo(() => {
    if (!canCourierAct) return null;

    const actions = [
      { label: "Accept", status: "accepted", className: "btn btnPrimary btnSmall" },
      { label: "Picked up", status: "picked_up", className: "btn btnSuccess btnSmall" },
      { label: "In transit", status: "in_transit", className: "btn btnPrimary btnSmall" },
      { label: "Delivered", status: "delivered", className: "btn btnSuccess btnSmall" },
    ];

    async function act(next) {
      if (!isBackendConfigured()) {
        toast.info("Action placeholder", `Would set status to ${next}.`);
        setDelivery((prev) => ({ ...(prev || {}), status: next }));
        return;
      }
      try {
        const updated = await updateDeliveryStatus(id, next);
        toast.success("Updated", `Status set to ${next}.`);
        setDelivery(updated);
      } catch (err) {
        toast.error("Update failed", err.message);
      }
    }

    return (
      <div className="actionsRow">
        {actions.map((a) => (
          <button key={a.status} className={a.className} type="button" onClick={() => act(a.status)}>
            {a.label}
          </button>
        ))}
      </div>
    );
  }, [canCourierAct, id, toast]);

  return (
    <div className="content">
      <div className="container">
        <div className="grid2">
          <div className="card">
            <div className="cardHeader">
              <h2>Delivery details</h2>
              <span className={chipClass(status)}>{status}</span>
            </div>
            <div className="cardBody">
              {loading ? (
                <div style={{ color: "var(--muted)" }}>Loading...</div>
              ) : !delivery ? (
                <div style={{ color: "var(--muted)" }}>Delivery not found.</div>
              ) : (
                <>
                  <div className="grid2">
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Delivery ID</div>
                      <div style={{ fontFamily: "ui-monospace", marginTop: 4 }}>{delivery.id || delivery._id}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Realtime</div>
                      <div style={{ marginTop: 4 }}>
                        <span className={rtStatus.connected ? "chip chipSuccess" : "chip"}>
                          {rtStatus.connected ? "connected" : "not connected"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }} />
                  <div className="grid2">
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Pickup</div>
                      <div style={{ marginTop: 4 }}>{delivery.pickupLocation || delivery.pickup || "—"}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>Dropoff</div>
                      <div style={{ marginTop: 4 }}>{delivery.dropoffLocation || delivery.dropoff || "—"}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12 }} />
                  <div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>Last known location</div>
                    <div style={{ marginTop: 4 }}>{prettyLocation(delivery.lastLocation || delivery.location)}</div>
                  </div>

                  {canCourierAct ? (
                    <>
                      <div style={{ marginTop: 14 }} />
                      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>Courier actions</div>
                      {actionButtons}
                      <div className="helper" style={{ marginTop: 10 }}>
                        Expected endpoint <span className="kbd">POST /deliveries/:id/status</span>.
                      </div>
                    </>
                  ) : (
                    <div className="helper" style={{ marginTop: 12 }}>
                      Live tracking + notifications will update automatically once backend events are wired.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h2>Map</h2>
              <span className="chip chipPrimary">Central tracking</span>
            </div>
            <div className="cardBody">
              <MapPlaceholder
                title="Courier location (placeholder)"
                subtitle="This area will display a real map and live courier marker."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
