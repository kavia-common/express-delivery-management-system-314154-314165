import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listAvailableJobs } from "../../api/deliveries";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

function normalize(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

// PUBLIC_INTERFACE
export function AvailableJobs() {
  /** Courier: list available jobs to accept. */
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      if (!isBackendConfigured()) {
        setJobs([{ _id: "job-demo-1", pickupLocation: "Warehouse A", dropoffLocation: "Client B", status: "available" }]);
        return;
      }
      const data = await listAvailableJobs();
      setJobs(normalize(data));
    } catch (err) {
      toast.error("Failed to load", err.message);
      setJobs([]);
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
            <h2>Available jobs</h2>
            <div className="actionsRow">
              <button className="btn btnSmall" type="button" onClick={load} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>
          <div className="cardBody">
            <table className="table" aria-label="Available jobs">
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
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "var(--muted)" }}>
                      No available jobs.
                    </td>
                  </tr>
                ) : (
                  jobs.map((j) => {
                    const id = j.id || j._id;
                    return (
                      <tr key={id}>
                        <td style={{ fontFamily: "ui-monospace", fontSize: 12 }}>{id}</td>
                        <td>{j.pickupLocation || j.pickup || "—"}</td>
                        <td>{j.dropoffLocation || j.dropoff || "—"}</td>
                        <td>
                          <span className="chip chipPrimary">{j.status || "available"}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <Link className="btn btnSmall btnPrimary" to={`/deliveries/${id}`}>
                            Open
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="helper" style={{ marginTop: 10 }}>
              Expected endpoint <span className="kbd">GET /courier/jobs</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
