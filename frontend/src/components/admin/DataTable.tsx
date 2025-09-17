// src/components/admin/DataTable.tsx
import React from "react";

type Col<T> = { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode };
export default function DataTable<T extends { [k: string]: any }>({
  columns, rows, empty = "No data.", loading,
}: { columns: Col<T>[]; rows: T[]; empty?: string; loading?: boolean }) {
  if (loading) return <p>Loading…</p>;
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-[720px] w-full">
        <thead className="bg-gray-50">
          <tr>{columns.map(c => <th key={String(c.key)} className="text-left p-3">{c.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className="p-4 text-gray-500 text-sm" colSpan={columns.length}>{empty}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} className="border-t">
              {columns.map(c => (
                <td key={String(c.key)} className="p-3">
                  {c.render ? c.render(r) : String(r[c.key as string] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
