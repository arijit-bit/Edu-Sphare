/**
 * Centralized Browser API Client for EduSphere.
 *
 * Security & Reliability Architecture:
 * - Access token stored strictly in JavaScript application memory (never in localStorage/sessionStorage).
 * - Refresh token stored in HttpOnly, SameSite, Secure cookie managed by browser.
 * - Centralized 401 interceptor with single-flight mutex lock to prevent concurrent refresh loops.
 * - Safe generic user-facing error messages to prevent leakage of internal system details.
 */

// In browser environments, ALWAYS use relative paths ("/api/...") so requests route through
// the same-origin Next.js proxy rewrites in next.config.mjs.
//
// ⚠️ WHY THIS MATTERS (Brave / Safari / Firefox):
//   If the browser calls the backend (onrender.com) directly, the refreshToken cookie is
//   set on a DIFFERENT origin (cross-site). Brave Shields and Safari ITP silently block
//   these third-party SameSite=None cookies, causing the login loop / 401 on /api/auth/refresh.
//
//   By always using "" here, the browser fetches /api/auth/login from vercel.app (same-origin),
//   the Next.js proxy forwards it to onrender.com server-side, and the Set-Cookie header is
//   written back onto vercel.app → same-origin → accepted by ALL browsers.
const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // Browser: always use relative paths → Next.js proxy (same-origin cookies)
    : (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000");

// In-memory access token storage
let _accessToken = null;

// Lock to prevent multiple concurrent refresh calls
let _refreshPromise = null;

// Listeners for auth state changes (e.g. forced logout on invalid session)
const _authListeners = new Set();

export function setAccessToken(token) {
  _accessToken = token || null;
  if (_accessToken) {
    console.info("[API Client] 🔑 Access Token set in memory.");
  } else {
    console.info("[API Client] 🔒 Access Token cleared from memory.");
  }
}

export function getAccessToken() {
  return _accessToken;
}

export function clearAccessToken() {
  _accessToken = null;
  console.info("[API Client] 🔒 Access Token cleared.");
}

export function onAuthStateChange(listener) {
  _authListeners.add(listener);
  return () => _authListeners.delete(listener);
}

function notifyAuthStateChange(user) {
  if (user) {
    console.info(`[API Client] 👤 Auth state changed: Logged in as ${user.role} (${user.email})`);
  } else {
    console.info("[API Client] 👤 Auth state changed: Logged out / Unauthenticated");
  }
  _authListeners.forEach((listener) => {
    try {
      listener(user);
    } catch (err) {
      console.error("[API Client] Error in auth listener:", err);
    }
  });
}

/**
 * Return safe user-facing error messages
 */
function safeErrorMessage(status, fallback) {
  if (status === 400) return fallback || "Invalid request. Please check your inputs.";
  if (status === 401) return "Invalid email or password.";
  if (status === 403) return "Access denied. You do not have permission to perform this action.";
  if (status === 404) return "Requested resource not found.";
  if (status === 409) return fallback || "An account with this email already exists.";
  if (status === 429) return "Too many attempts. Please wait a few moments and try again.";
  return fallback || "An unexpected error occurred. Please try again later.";
}

/**
 * Core fetch wrapper with automatic JWT header, cookie credentials, and 401 refresh retry.
 *
 * @param {string} path - API path (e.g. "/api/auth/me" or "/api/student/dashboard")
 * @param {RequestInit} options - fetch options
 * @returns {Promise<any>}
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Inject Bearer access token if present in memory
  if (_accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${_accessToken}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      method,
      credentials: "include", // Always include cookies for refresh_tokens and session
      headers,
    });
  } catch (netErr) {
    throw new Error("Unable to connect to the server. Please check your internet connection.");
  }

  // Handle 204 No Content
  if (response.status === 204) return null;

  // Handle 401 Access Token Expiration (only for authenticated routes, not login/refresh itself)
  const isAuthEndpoint =
    path.includes("/api/auth/login") ||
    path.includes("/api/auth/register") ||
    path.includes("/api/auth/refresh");

  if (response.status === 401 && !isAuthEndpoint) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[API] 401 Unauthorized on ${path}. Initiating token refresh...`);
    }

    // Execute single-flight refresh lock
    if (!_refreshPromise) {
      _refreshPromise = fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then(async (res) => {
          if (!res.ok) {
            clearAccessToken();
            notifyAuthStateChange(null);
            return null;
          }
          const data = await res.json();
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
            notifyAuthStateChange(data.user);
            return data;
          }
          return null;
        })
        .catch((err) => {
          clearAccessToken();
          notifyAuthStateChange(null);
          return null;
        })
        .finally(() => {
          _refreshPromise = null;
        });
    }

    const refreshResult = await _refreshPromise;

    // If refresh succeeded, retry original request once with fresh token
    if (refreshResult && refreshResult.accessToken) {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[API] Token refresh succeeded. Retrying original request to ${path}`);
      }

      headers.Authorization = `Bearer ${refreshResult.accessToken}`;
      const retryResponse = await fetch(url, {
        ...options,
        method,
        credentials: "include",
        headers,
      });

      if (retryResponse.status === 204) return null;
      const retryPayload = await retryResponse.json().catch(() => ({}));

      if (!retryResponse.ok) {
        throw new Error(safeErrorMessage(retryResponse.status, retryPayload?.message));
      }
      return retryPayload;
    } else {
      // Refresh failed — clear token
      clearAccessToken();
      throw new Error("Your session has expired. Please sign in again.");
    }
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = payload?.message || safeErrorMessage(response.status);
    const err = new Error(errorMsg);
    err.status = response.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

/**
 * Submit login credentials to Express backend
 */
export async function loginUser({ email, password }) {
  console.info(`[API Client] 🔐 Submitting login for ${email}...`);
  const result = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });

  if (result?.accessToken) {
    setAccessToken(result.accessToken);
    console.info(`[API Client] ✅ Login successful: Access granted for ${result.user?.role} (${result.user?.email})`);
  }

  return result;
}

/**
 * Refresh current access token using HttpOnly cookie
 */
export async function refreshUserSession() {
  console.info("[API Client] 🔍 Searching for active session / token cookie...");
  try {
    const result = await apiFetch("/api/auth/refresh", {
      method: "POST",
    });

    if (result?.accessToken && result?.user) {
      setAccessToken(result.accessToken);
      console.info(`[API Client] ✅ Token found -> Active session restored: Logged in as ${result.user.role} (${result.user.email})`);
      return result;
    }
    console.info("[API Client] ❌ Token not found or empty response -> Unauthenticated user");
    return null;
  } catch (err) {
    console.info(`[API Client] ⚠️ Session check completed: No active session (${err.message})`);
    clearAccessToken();
    return null;
  }
}

/**
 * Fetch current user profile
 */
export async function getCurrentUser() {
  return apiFetch("/api/auth/me", {
    method: "GET",
  });
}

/**
 * Revoke refresh token on backend and clear memory token
 */
export async function logoutUser() {
  console.info("[API Client] 🚪 Logging out user...");
  try {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });
  } catch (err) {
    // Ignore error during logout
  } finally {
    clearAccessToken();
    notifyAuthStateChange(null);
    console.info("[API Client] 🔒 Logged out successfully");
  }
}

export { logoutUser as logout };

