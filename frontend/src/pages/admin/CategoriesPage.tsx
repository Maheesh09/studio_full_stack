import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Category = { id: number; name: string };

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!API_BASE) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/categories`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed ${res.status}`);
      const page = await res.json();
      setCategories(page.content || []);
    } catch (e: any) {
      setError(e.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!name.trim()) return;
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pc_name: name.trim() })
    });
    if (res.ok) {
      setName("");
      await load();
    }
  };

  const onRename = async (id: number, current: string) => {
    const next = prompt("New name", current);
    if (!next || next.trim() === current) return;
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ pc_name: next.trim() })
    });
    if (res.ok) await load();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Category</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Category name" value={name} onChange={e => setName(e.target.value)} />
          <Button onClick={onCreate}>Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No categories</div>
          ) : (
            <div className="space-y-2">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between border rounded p-3">
                  <div>#{c.id} — {c.name}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onRename(c.id, c.name)}>Rename</Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(c.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


