// src/pages/admin/AdminLayout.tsx
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const nav = [
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/suppliers", label: "Suppliers" },
];

export default function AdminLayout() {
  const { admin, logout } = useAdmin();
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r p-4 space-y-4">
        <div className="text-lg font-semibold">Admin</div>
        <nav className="flex flex-col gap-1">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({isActive}) =>
                `px-3 py-2 rounded-md ${isActive ? "bg-black text-white" : "hover:bg-gray-100"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm">
            {admin && <span className="mr-3">Signed in as <b>{admin.name}</b> ({admin.nic})</span>}
            <button onClick={logout} className="px-3 py-1 rounded-md border">Logout</button>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
