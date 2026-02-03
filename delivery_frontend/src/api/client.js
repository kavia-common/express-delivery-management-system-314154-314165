import axios from "axios";
import { getAuthToken, clearAuth } from "../auth/authStorage";

/**
 * Compute the backend base URL from environment variables.
 * CRA supports REACT_APP_* variables only.
 */
function getBaseURL() {
  return (
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_API_BASE ||
    ""
  );
}

const api = axios.create({
  baseURL: getBaseURL() || undefined,
  timeout: 15000,
});

/**
 * Request interceptor: attach JWT token if present.
 */
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: normalize errors and clear auth on 401.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // If backend is unreachable, surface a friendly message.
    if (!error?.response && (error?.code === "ECONNABORTED" || error?.message)) {
      return Promise.reject(
        new Error(
          "Backend is unreachable. Set REACT_APP_BACKEND_URL and ensure the backend is running."
        )
      );
    }

    if (status === 401) {
      clearAuth();
    }

    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    return Promise.reject(new Error(msg));
  }
);

// PUBLIC_INTERFACE
export function isBackendConfigured() {
  /** Returns true if a backend base URL is configured. */
  return Boolean(getBaseURL());
}

// PUBLIC_INTERFACE
export function getBackendBaseURL() {
  /** Returns the configured backend base URL (or empty string). */
  return getBaseURL();
}

export default api;
