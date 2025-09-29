import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Category = { id: number; name: string; description?: string | null };

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

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
      body: JSON.stringify({ 
        pc_name: name.trim(),
        pc_description: description.trim() || null
      })
    });
    if (res.ok) {
      setName("");
      setDescription("");
      await load();
    }
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setIsEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;
    
    const res = await fetch(`${API_BASE}/admin/categories/${editingCategory.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        pc_name: editName.trim(),
        pc_description: editDescription.trim() || null
      })
    });
    
    if (res.ok) {
      setIsEditOpen(false);
      setEditingCategory(null);
      await load();
    }
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
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Category name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <Button onClick={onCreate}>Add</Button>
          </div>
          <Textarea 
            placeholder="Category description (optional)" 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
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
            <div className="space-y-3">
              {categories.map(c => (
                <div key={c.id} className="border rounded p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">#{c.id} — {c.name}</div>
                      {c.description && (
                        <div className="text-sm text-gray-600 mt-1">{c.description}</div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEdit(c)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Category description (optional)"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


