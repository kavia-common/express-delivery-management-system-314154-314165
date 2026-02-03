import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDelivery } from "../../api/deliveries";
import { useToast } from "../../components/toast/ToastProvider";
import { isBackendConfigured } from "../../api/client";

// PUBLIC_INTERFACE
export function CreateDelivery() {
  /** Customer: create delivery request form. */
  const toast = useToast();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [packageDetails, setPackageDetails] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (pickup.trim().length < 3) e.pickup = "Pickup location is required.";
    if (dropoff.trim().length < 3) e.dropoff = "Dropoff location is required.";
    if (packageDetails.trim().length < 3) e.packageDetails = "Package details are required.";
    return e;
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    if (!isBackendConfigured()) {
      toast.error("Backend not configured", "Set REACT_APP_BACKEND_URL to create deliveries.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = await createDelivery({
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        packageDetails,
        notes,
      });

      toast.success("Delivery created", "Your delivery request was created.");
      const id = payload?.id || payload?._id;
      navigate(id ? `/deliveries/${id}` : "/customer/deliveries");
    } catch (err) {
      toast.error("Create failed", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="content">
      <div className="container">
        <div className="grid2">
          <div className="card">
            <div className="cardHeader">
              <h2>Create delivery</h2>
              <span className="chip chipPrimary">Customer</span>
            </div>
            <div className="cardBody">
              <form className="form" onSubmit={onSubmit}>
                <div className="field">
                  <div className="labelRow">
                    <label htmlFor="pickup">Pickup location</label>
                    {errors.pickup ? <span className="errorText">{errors.pickup}</span> : null}
                  </div>
                  <input id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g., 123 Main St" />
                </div>

                <div className="field">
                  <div className="labelRow">
                    <label htmlFor="dropoff">Dropoff location</label>
                    {errors.dropoff ? <span className="errorText">{errors.dropoff}</span> : null}
                  </div>
                  <input id="dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="e.g., 500 Market Ave" />
                </div>

                <div className="field">
                  <div className="labelRow">
                    <label htmlFor="pkg">Package details</label>
                    {errors.packageDetails ? <span className="errorText">{errors.packageDetails}</span> : null}
                  </div>
                  <textarea
                    id="pkg"
                    rows={4}
                    value={packageDetails}
                    onChange={(e) => setPackageDetails(e.target.value)}
                    placeholder="Size, weight, contents (optional), handling instructions"
                  />
                </div>

                <div className="field">
                  <label htmlFor="notes">Notes (optional)</label>
                  <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery window, contact, etc." />
                </div>

                <div className="actionsRow">
                  <button className="btn btnPrimary" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Create delivery"}
                  </button>
                  <button className="btn" type="button" onClick={() => navigate("/customer/deliveries")}>
                    Cancel
                  </button>
                </div>

                <div className="helper">
                  Expected endpoint <span className="kbd">POST /deliveries</span>.
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="cardHeader">
              <h2>Preview</h2>
              <span className="chip chipSuccess">Tracking ready</span>
            </div>
            <div className="cardBody">
              <div className="mapPlaceholder" style={{ height: 360 }}>
                <div>
                  <div style={{ fontWeight: 800, color: "#1f2937" }}>Map preview</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: "var(--muted)" }}>
                    Once created, you’ll see courier + location updates here.
                  </div>
                  <div style={{ marginTop: 10, fontSize: 12 }}>
                    Pickup: <span className="kbd">{pickup || "—"}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12 }}>
                    Dropoff: <span className="kbd">{dropoff || "—"}</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>
                Real-time events are a placeholder until backend WS/SSE is wired.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
