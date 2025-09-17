// src/pages/admin/CustomersPage.tsx
import React, { useEffect, useState } from "react";
import DataTable from "@/components/admin/DataTable";
import { apiGet } from "@/lib/api";
import { fmtDateTime } from "@/lib/date";

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
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const size = 20;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching customers from:', `/admin/customers?page=${page}&size=${size}`);
        const res = await apiGet<Page<Customer>>(`/admin/customers?page=${page}&size=${size}`);
        console.log('Customers response:', res);
        setData(res);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const columns = [
    { key: "customer_id", header: "ID" },
    { key: "customer_name", header: "Name" },
    { key: "customer_email", header: "Email" },
    { key: "customer_phone", header: "Phone" },
    { key: "created_at", header: "Created", render: (r: Customer) => fmtDateTime(r.created_at) },
  ];

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customers</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Customers</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Customers</h2>
        {data && (
          <span className="text-sm text-gray-600">
            Total: {data.totalElements} customers
          </span>
        )}
      </div>

      <DataTable columns={columns} rows={data?.content ?? []} loading={loading} />

      {data && data.totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button className="border rounded-md px-3 py-1 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            Prev
          </button>
          <span className="text-sm">Page {page + 1} / {data.totalPages}</span>
          <button className="border rounded-md px-3 py-1 disabled:opacity-50"
            onClick={() => setPage(p => (data.totalPages > p + 1 ? p + 1 : p))}
            disabled={data.totalPages <= page + 1}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}