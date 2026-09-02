"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  onAuthStateChange,
  getAccessToken,
} from "@/lib/api";
import { getRequiredRoleForPortal, isValidPortal } from "@/lib/constants";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshSession: async () => {},
});

const AUTH_BROADCAST_CHANNEL = "edusphare_auth_sync";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to post message to other open tabs
  const broadcastAuth = (message) => {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
        bc.postMessage(message);
        bc.close();
        console.info(`[AuthContext] 📡 Broadcast sent to other tabs: ${message.type}`);
      }
    } catch (err) {
      // BroadcastChannel not available or error
    }
  };

  // Initialize and restore session on application startup / browser refresh
  const restoreSession = useCallback(async () => {
    console.info("[AuthContext] 🚀 Application startup: Checking / restoring user session...");
    try {
      setIsLoading(true);
      const res = await refreshUserSession();
      if (res && res.user) {
        setUser(res.user);
        console.info(`[AuthContext] ✅ Session verified: Authenticated as ${res.user.role} (${res.user.email})`);
        broadcastAuth({ type: "SESSION_RESTORED", user: res.user });
      } else {
        setUser(null);
        console.info("[AuthContext] ℹ️ No active session found: User is unauthenticated");
      }
    } catch (err) {
      console.info(`[AuthContext] ⚠️ Session restoration failed: ${err.message}`);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    restoreSession();

    // Listen to external auth events (e.g. token expired on API call)
    const unsubscribe = onAuthStateChange((newUser) => {
      setUser(newUser);
    });

    // Cross-tab synchronization via BroadcastChannel
    let channel = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel(AUTH_BROADCAST_CHANNEL);
        channel.onmessage = (event) => {
          const { type, user: incomingUser } = event.data || {};
          console.info(`[AuthContext] 📡 Broadcast received from another tab: ${type}`, incomingUser ? incomingUser.email : "");
          if (type === "LOGIN" || type === "SESSION_RESTORED") {
            if (incomingUser) {
              setUser(incomingUser);
              setIsLoading(false);
            }
          } else if (type === "LOGOUT") {
            setUser(null);
            setIsLoading(false);
          }
        };
      }
    } catch (err) {}

    return () => {
      unsubscribe();
      if (channel) channel.close();
    };
  }, [restoreSession]);

  /**
   * Log in user and verify role against target portal
   */
  const login = async ({ email, password, portal }) => {
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      const authenticatedUser = response.user;
      setUser(authenticatedUser);

      broadcastAuth({ type: "LOGIN", user: authenticatedUser });

      let roleMatch = true;
      let expectedRole = null;

      if (portal && isValidPortal(portal)) {
        expectedRole = getRequiredRoleForPortal(portal);
        roleMatch = authenticatedUser.role === expectedRole;
      }

      return {
        success: true,
        user: authenticatedUser,
        roleMatch,
        expectedRole,
        actualRole: authenticatedUser.role,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log out user from backend and reset frontend state
   */
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      broadcastAuth({ type: "LOGOUT" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshSession: restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
