import { createContext, useContext, useEffect, useState } from "react";
import type { SessionUser } from "@shared/types/user";

interface AuthContextType {
  user: SessionUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  switchToTeacher: () => Promise<void>;
  updateUser: (userData: SessionUser) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    checkAuth();
  }, []);

  const getToken = () => {
    try {
      return localStorage.getItem("sc_token");
    } catch (e) {
      return null;
    }
  };

  const setToken = (token: string | null) => {
    try {
      if (token) localStorage.setItem("sc_token", token);
      else localStorage.removeItem("sc_token");
    } catch (e) {
      console.warn("Failed to set token", e);
    }
  };

  const fetchWithAuth = (input: RequestInfo, init?: RequestInit) => {
    const token = getToken();
    const headers = new Headers((init?.headers as any) || {});
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(input, { ...init, headers });
  };

  const checkAuth = async () => {
    try {
      const response = await fetchWithAuth("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    // server returns token and session user
    if (data.token) setToken(data.token);
    setUser({
      id: data.id,
      email: data.email,
      name: data.name,
      userType: data.userType,
      avatar: data.avatar,
    } as SessionUser);
  };

  const register = async (userData: any) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    if (data.token) setToken(data.token);
    setUser({
      id: data.id,
      email: data.email,
      name: data.name,
      userType: data.userType,
      avatar: data.avatar,
    } as SessionUser);
  };

  const logout = async () => {
    try {
      await fetchWithAuth("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.warn("logout request failed", e);
    }
    setToken(null);
    setUser(null);
  };

  const switchToTeacher = async () => {
    const response = await fetchWithAuth("/api/auth/switch-to-teacher", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to switch to teacher");
    }

    const updatedUser = await response.json();
    setUser(updatedUser);
  };

  const updateUser = async (userData: SessionUser) => {
    try {
      const response = await fetchWithAuth("/api/auth/update", {
        method: "PUT",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error("Update user failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        switchToTeacher,
        updateUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
