import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyDeliveries } from "../../api/deliveries";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

function normalizeDeliveries(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

function statusChip(status) {
  const s = (status || "pending").toLowerCase();
  if (["delivered"].includes(s)) return "chip chipSuccess";
  if (["cancelled", "failed"].includes(s)) return "chip chipDanger";
  if (["in_transit", "in transit", "picked_up"].includes(s)) return "chip chipPrimary";
  return "chip";
}

// PUBLIC_INTERFACE
export function MyDeliveries() {
  /** Customer: list deliveries. */
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (!isBackendConfigured()) {
        // UI placeholder mode
        setRows([
          { _id: "demo-1", pickupLocation: "123 Main St", dropoffLocation: "500 Market Ave", status: "pending" },
        ]);
        return;
      }
      const data = await listMyDeliveries();
      setRows(normalizeDeliveries(data));
    } catch (err) {
      toast.error("Failed to load", err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <div className="container">
        <div className="card">
          <div className="cardHeader">
            <h2>My deliveries</h2>
            <div className="actionsRow">
              <Link className="btn btnPrimary btnSmall" to="/customer/create">
                New delivery
              </Link>
              <button className="btn btnSmall" type="button" onClick={load} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>
          <div className="cardBody">
            <table className="table" aria-label="My deliveries">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pickup</th>
                  <th>Dropoff</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ color: "var(--muted)" }}>
                      Loading...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "var(--muted)" }}>
                      No deliveries yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((d) => {
                    const id = d.id || d._id;
                    return (
                      <tr key={id}>
                        <td style={{ fontFamily: "ui-monospace", fontSize: 12 }}>{id}</td>
                        <td>{d.pickupLocation || d.pickup || "—"}</td>
                        <td>{d.dropoffLocation || d.dropoff || "—"}</td>
                        <td>
                          <span className={statusChip(d.status)}>{d.status || "pending"}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link className="btn btnSmall" to={`/deliveries/${id}`}>
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="helper" style={{ marginTop: 10 }}>
              Expected endpoint <span className="kbd">GET /deliveries/my</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
