/**
 * Browser API client — centralized fetch wrapper for all backend calls.
 *
 * Security features built in:
 * - Automatically fetches and caches a CSRF token before any mutating request
 *   (POST, PUT, PATCH, DELETE) and sends it as the X-CSRF-Token header.
 * - Always sends credentials (HttpOnly session cookie).
 * - Returns normalized, safe error messages — never exposes internal server detail.
 * - Attaches X-Request-Id from response to thrown errors for support traceability.
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000");
const CSRF_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Module-level CSRF token cache — reused across calls until invalidated
let _csrfToken = null;

// Lock to prevent multiple concurrent refresh calls
let _refreshPromise = null;

async function getCsrfToken() {
  if (_csrfToken) return _csrfToken;
  try {
    const res = await fetch(`${API_BASE}/v1/csrf-token`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      _csrfToken = data.csrfToken ?? null;
    }
  } catch {
    // CSRF endpoint unreachable (e.g. backend down) — proceed without token.
    // The backend will reject the request if CSRF is required.
  }
  return _csrfToken;
}

// Invalidate cached token (call after a 403 CSRF rejection)
function invalidateCsrfToken() {
  _csrfToken = null;
}

/**
 * Make an authenticated API call.
 *
 * @param {string} path  - Path relative to API base, e.g. "/v1/auth/login"
 * @param {RequestInit} options - fetch options (method, body, headers, etc.)
 * @returns {Promise<any>} Parsed response data, or null for 204 No Content
 */
export async function apiFetch(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = { "Content-Type": "application/json", ...options.headers };

  // Automatically inject CSRF token for state-mutating requests
  if (CSRF_METHODS.has(method)) {
    const token = await getCsrfToken();
    if (token) headers["x-csrf-token"] = token;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  // No content — return null
  if (response.status === 204) return null;

  const requestId = response.headers.get("x-request-id");

  // Handle CSRF token expiry — invalidate cache and retry once
  if (response.status === 403) {
    const body = await response.json().catch(() => ({}));
    if (body?.error?.code === "CSRF_TOKEN_INVALID") {
      invalidateCsrfToken();
      // Retry once with a fresh token
      const freshToken = await getCsrfToken();
      const retryHeaders = { ...headers };
      if (freshToken) retryHeaders["x-csrf-token"] = freshToken;
      const retry = await fetch(`${API_BASE}${path}`, {
        ...options,
        method,
        credentials: "include",
        headers: retryHeaders,
      });
      if (retry.status === 204) return null;
      const retryPayload = await retry.json().catch(() => ({}));
      if (!retry.ok) throw Object.assign(
        new Error(safeErrorMessage(retry.status)),
        { status: retry.status, code: retryPayload?.error?.code, requestId }
      );
      return retryPayload.data;
    }
  }

  const payload = await response.json().catch(() => ({}));

  // Handle Access Token Expiration — seamless refresh interceptor
  if (response.status === 401 && !path.startsWith("/v1/auth/login") && !path.startsWith("/v1/auth/refresh")) {
    if (!_refreshPromise) {
      _refreshPromise = fetch(`${API_BASE}/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        _refreshPromise = null;
      });
    }

    const refreshResponse = await _refreshPromise;
    if (refreshResponse.ok) {
      // Refresh succeeded, retry original request
      const retryAfterRefresh = await fetch(`${API_BASE}${path}`, {
        ...options,
        method,
        credentials: "include",
        headers,
      });
      
      if (retryAfterRefresh.status === 204) return null;
      const retryPayload = await retryAfterRefresh.json().catch(() => ({}));
      if (!retryAfterRefresh.ok) {
        throw Object.assign(
          new Error(safeErrorMessage(retryAfterRefresh.status, retryPayload?.error?.code)),
          { status: retryAfterRefresh.status, code: retryPayload?.error?.code, requestId: retryAfterRefresh.headers.get("x-request-id") }
        );
      }
      return retryPayload.data ?? retryPayload;
    }
    // If refresh failed, fall through to throwing the 401 below
  }

  if (!response.ok) {
    throw Object.assign(
      new Error(safeErrorMessage(response.status, payload?.error?.code)),
      { status: response.status, code: payload?.error?.code, requestId }
    );
  }

  return payload.data ?? payload;
}

/**
 * Return a safe, user-facing error message for a given HTTP status.
 * Never exposes internal server messages to the browser.
 */
function safeErrorMessage(status, code) {
  if (status === 401) return "You are not signed in. Please sign in to continue.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This action conflicts with existing data. Please refresh and try again.";
  if (status === 422) return "The submitted data is invalid. Please check your input.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  return "An unexpected error occurred. Please try again.";
}
