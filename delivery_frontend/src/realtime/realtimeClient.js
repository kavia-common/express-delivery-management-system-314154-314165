/**
 * Lightweight real-time client placeholder.
 * Intended for subscribing to delivery status/location updates.
 *
 * When backend is ready, align:
 * - URL: REACT_APP_WS_URL
 * - Message schema: { type, deliveryId, payload }
 */

function getWsUrl() {
  return process.env.REACT_APP_WS_URL || "";
}

// PUBLIC_INTERFACE
export function createRealtimeClient({ onMessage, onStatus } = {}) {
  /** Create a WS client with connect/subscribe/close methods (placeholder). */
  let ws = null;

  function connect() {
    const url = getWsUrl();
    if (!url) {
      onStatus?.({ connected: false, reason: "Missing REACT_APP_WS_URL" });
      return;
    }

    try {
      ws = new WebSocket(url);
      ws.onopen = () => onStatus?.({ connected: true });
      ws.onclose = () => onStatus?.({ connected: false });
      ws.onerror = () => onStatus?.({ connected: false, reason: "WebSocket error" });
      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          onMessage?.(data);
        } catch {
          onMessage?.({ type: "raw", payload: evt.data });
        }
      };
    } catch (e) {
      onStatus?.({ connected: false, reason: e?.message || "Failed to connect" });
    }
  }

  function subscribeToDelivery(deliveryId) {
    // Placeholder: backend wiring pending.
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "subscribe", deliveryId }));
  }

  function close() {
    try {
      ws?.close();
    } catch {
      // ignore
    } finally {
      ws = null;
    }
  }

  return { connect, subscribeToDelivery, close };
}
