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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and restore session on application startup / browser refresh
  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await refreshUserSession();
      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
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

    return () => unsubscribe();
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
