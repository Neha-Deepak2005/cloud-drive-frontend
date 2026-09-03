import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    // Try to silently resume a session using the HttpOnly refresh cookie.
    (async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.access_token);
        setUser(data.user);
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    })();
  }, [clearSession]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, fullName) => {
    const { data } = await api.post("/auth/register", {
      email,
      password,
      full_name: fullName,
    });
    setAccessToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogleToken = (data) => {
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithGoogleToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
