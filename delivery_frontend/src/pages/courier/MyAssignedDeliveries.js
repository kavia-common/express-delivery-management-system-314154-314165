import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAssignedDeliveries } from "../../api/deliveries";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

function normalize(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

// PUBLIC_INTERFACE
export function MyAssignedDeliveries() {
  /** Courier: list assigned deliveries. */
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (!isBackendConfigured()) {
        setRows([{ _id: "assign-demo-1", pickupLocation: "Hub 1", dropoffLocation: "Office 9", status: "assigned" }]);
        return;
      }
      const data = await listAssignedDeliveries();
      setRows(normalize(data));
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
            <h2>My assigned deliveries</h2>
            <div className="actionsRow">
              <button className="btn btnSmall" type="button" onClick={load} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>
          <div className="cardBody">
            <table className="table" aria-label="Assigned deliveries">
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
                      No assigned deliveries.
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
                          <span className="chip chipPrimary">{d.status || "assigned"}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link className="btn btnSmall" to={`/deliveries/${id}`}>
                            Manage
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="helper" style={{ marginTop: 10 }}>
              Expected endpoint <span className="kbd">GET /courier/assigned</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
