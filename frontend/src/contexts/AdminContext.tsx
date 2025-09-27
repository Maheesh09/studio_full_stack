// src/contexts/AdminContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";

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
      const data = await apiGet<any>("/api/admins/me");
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
    try {
      await apiSend("/api/admins/login", "POST", { adminNic, password });
      await refreshMe();
      return true;
    } catch {
      return false;
    }
  }, [refreshMe]);

  const logout = useCallback(async () => {
    try {
      await apiSend("/api/admins/logout", "POST");
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
