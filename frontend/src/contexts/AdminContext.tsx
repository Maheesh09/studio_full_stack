// src/contexts/AdminContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type AdminUser = {
  id: string;
  nic: string;
  name: string;
};

type AdminContextType = {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  login: (adminNic: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const refreshMe = useCallback(async () => {
    try {
      const res = await fetch("/api/admins/me", {
        credentials: "include",
      });
      if (!res.ok) {
        setAdmin(null);
        return;
      }
      const data = await res.json();
      setAdmin({
        id: String(data.adminId),
        nic: String(data.adminNic),
        name: String(data.adminName || "Admin"),
      });
    } catch {
      setAdmin(null);
    }
  }, []);

  useEffect(() => {
    // Try to restore session on first load
    refreshMe();
  }, [refreshMe]);

  const login = useCallback(async (adminNic: string, password: string) => {
    const res = await fetch("/api/admins/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ adminNic, password }),
});
    if (!res.ok) return false;
    await refreshMe();
    return true;
  }, [refreshMe]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admins/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAdmin(null);
    }
  }, []);

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout, refreshMe }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within an AdminProvider");
  return ctx;
};
