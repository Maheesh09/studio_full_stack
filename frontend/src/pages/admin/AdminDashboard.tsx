// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  created_at?: string | null;
};

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdmin();
  const [rows, setRows] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/customers?page=0&size=20`, {
          credentials: "include",
        });
        if (res.status === 401) {
          setErr("Unauthorized. Please login again.");
          return;
        }
        if (!res.ok) {
          setErr(`Failed: ${res.status}`);
          return;
        }
        const data = await res.json(); // Spring Data Page
        setRows(Array.isArray(data.content) ? data.content : []);
      } catch (e) {
        setErr("Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="text-sm">
          <span className="mr-3">Signed in as <b>{admin?.name}</b> ({admin?.nic})</span>
          <button className="px-3 py-1 rounded-md border" onClick={() => logout()}>
            Logout
          </button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-[640px] w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.customer_id} className="border-t">
                  <td className="p-3">{c.customer_id}</td>
                  <td className="p-3">{c.customer_name}</td>
                  <td className="p-3">{c.customer_email ?? "-"}</td>
                  <td className="p-3">{c.customer_phone ?? "-"}</td>
                  <td className="p-3">{c.created_at ? new Date(c.created_at).toLocaleString() : "-"}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-sm text-gray-500" colSpan={5}>No customers.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
