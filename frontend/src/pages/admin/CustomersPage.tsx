// src/pages/admin/CustomersPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import { apiGet } from "@/lib/api";
import { fmtDateTime } from "@/lib/date";
import  {apiSend}  from "@/lib/api";

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  created_at?: string | null;
};

type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number; size: number; };

export default function CustomersPage() {
  const [data, setData] = useState<Page<Customer> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const size = 20;

  // modal state
  const [modalOpen, setModalOpen] = useState<null | "create" | { mode: "edit", row: Customer }>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiGet<Page<Customer>>(`/admin/customers?page=${page}&size=${size}`);
      setData(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [page]);

  function openCreate() {
    setForm({ name: "", email: "", phone: "" });
    setError(null);
    setModalOpen("create");
  }
  function openEdit(row: Customer) {
    setForm({ name: row.customer_name || "", email: row.customer_email || "", phone: row.customer_phone || "" });
    setError(null);
    setModalOpen({ mode: "edit", row });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (modalOpen === "create") {
        await apiSend<Customer>(`/admin/customers`, "POST", {
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone || null,
        });
      } else if (modalOpen && modalOpen.mode === "edit") {
        await apiSend<Customer>(`/admin/customers/${modalOpen.row.customer_id}`, "PUT", {
          customer_name: form.name,
          customer_email: form.email || null,
          customer_phone: form.phone || null,
        });
      }
      setModalOpen(null);
      await load();
    } catch (err: any) {
      setError(err?.message || "Request failed");
    }
  }

  async function onDelete(row: Customer) {
    if (!confirm(`Delete customer #${row.customer_id} (${row.customer_name})?`)) return;
    try {
      await apiSend<void>(`/admin/customers/${row.customer_id}`, "DELETE");
      await load();
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    }
  }

  const columns = [
    { key: "customer_id", header: "ID" },
    { key: "customer_name", header: "Name" },
    { key: "customer_email", header: "Email" },
    { key: "customer_phone", header: "Phone" },
    { key: "created_at", header: "Created", render: (r: Customer) => fmtDateTime(r.created_at) },
    {
      key: "actions", header: "Actions", render: (r: Customer) => (
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded" onClick={() => openEdit(r)}>Edit</button>
          <button className="px-2 py-1 border rounded text-red-600" onClick={() => onDelete(r)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customers</h2>
        <button className="px-3 py-2 border rounded-md" onClick={openCreate}>Add Customer</button>
      </div>

      <DataTable columns={columns} rows={data?.content ?? []} loading={loading} />

      <div className="flex items-center gap-2">
        <button className="border rounded-md px-3 py-1 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
          Prev
        </button>
        <span className="text-sm">Page {page + 1} / {data?.totalPages ?? 1}</span>
        <button className="border rounded-md px-3 py-1 disabled:opacity-50"
          onClick={() => setPage(p => ((data?.totalPages ?? 1) > p + 1 ? p + 1 : p))}
          disabled={(data?.totalPages ?? 1) <= page + 1}>
          Next
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              {modalOpen === "create" ? "Add Customer" : "Edit Customer"}
            </h3>
            <div className="space-y-1">
              <label className="text-sm">Name</label>
              <input className="w-full border rounded p-2" value={form.name}
                     onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Email</label>
              <input className="w-full border rounded p-2" type="email" value={form.email}
                     onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Phone</label>
              <input className="w-full border rounded p-2" value={form.phone}
                     onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-2 border rounded" onClick={() => setModalOpen(null)}>Cancel</button>
              <button className="px-3 py-2 bg-black text-white rounded">
                {modalOpen === "create" ? "Create" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

