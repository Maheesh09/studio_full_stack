import { createContext, useContext, useEffect, useState } from "react";

type Customer = { customerId: number; name: string; email: string } | null;

type CustomerContextValue = {
  customer: Customer;
  isAuthenticated: boolean;
  setCustomer: (c: Customer) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextValue | undefined>(undefined);

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const CustomerProvider = ({ children }: { children: React.ReactNode }) => {
  const [customer, setCustomer] = useState<Customer>(null);

  useEffect(() => {
    const restore = async () => {
      // Optimistic restore from localStorage for faster first paint
      const saved = localStorage.getItem("customer");
      if (saved) {
        try { setCustomer(JSON.parse(saved)); } catch {}
      }
      await refresh();
    };
    restore();
  }, []);

  const refresh = async () => {
    if (!API_BASE) return;
    try {
      const res = await fetch(`${API_BASE}/api/customers/me`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const c = { customerId: data.customerId, name: data.name, email: data.email };
        setCustomer(c);
        localStorage.setItem("customer", JSON.stringify(c));
      } else if (res.status === 401) {
        setCustomer(null);
        localStorage.removeItem("customer");
      }
    } catch {
      // ignore transient errors
    }
  };

  const logout = async () => {
    if (API_BASE) {
      try {
        await fetch(`${API_BASE}/api/customers/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch {}
    }
    setCustomer(null);
    localStorage.removeItem("customer");
  };

  return (
    <CustomerContext.Provider
      value={{ customer, isAuthenticated: !!customer, setCustomer, logout, refresh }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used within CustomerProvider");
  return ctx;
};