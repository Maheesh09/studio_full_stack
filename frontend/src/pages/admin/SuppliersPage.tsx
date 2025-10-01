// src/pages/admin/SuppliersPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Supplier = {
  supplier_id: number;
  supplier_name: string;
  supplier_phone: string | null;
  supplier_email: string | null;
  supplier_address: string | null;
  created_at?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplier_name, setSupplier_name] = useState("");
  const [supplier_phone, setSupplier_phone] = useState("");
  const [supplier_email, setSupplier_email] = useState("");
  const [supplier_address, setSupplier_address] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal states
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editSupplier_name, setEditSupplier_name] = useState("");
  const [editSupplier_phone, setEditSupplier_phone] = useState("");
  const [editSupplier_email, setEditSupplier_email] = useState("");
  const [editSupplier_address, setEditSupplier_address] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const load = async () => {
    if (!API_BASE) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/suppliers?page=0&size=100`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed ${res.status}`);
      const page = await res.json();
      setSuppliers(page.content || []);
    } catch (e: any) {
      setError(e.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!supplier_name.trim()) return;
    const res = await fetch(`${API_BASE}/admin/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        supplier_name: supplier_name.trim(),
        supplier_phone: supplier_phone.trim() || null,
        supplier_email: supplier_email.trim() || null,
        supplier_address: supplier_address.trim() || null
      })
    });
    if (res.ok) {
      setSupplier_name("");
      setSupplier_phone("");
      setSupplier_email("");
      setSupplier_address("");
      await load();
    }
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditSupplier_name(supplier.supplier_name);
    setEditSupplier_phone(supplier.supplier_phone || "");
    setEditSupplier_email(supplier.supplier_email || "");
    setEditSupplier_address(supplier.supplier_address || "");
    setIsEditOpen(true);
  };

  const onSaveEdit = async () => {
    if (!editingSupplier || !editSupplier_name.trim()) return;
    
    const res = await fetch(`${API_BASE}/admin/suppliers/${editingSupplier.supplier_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ 
        supplier_name: editSupplier_name.trim(),
        supplier_phone: editSupplier_phone.trim() || null,
        supplier_email: editSupplier_email.trim() || null,
        supplier_address: editSupplier_address.trim() || null
      })
    });
    
    if (res.ok) {
      setIsEditOpen(false);
      setEditingSupplier(null);
      await load();
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this supplier?")) return;
    const res = await fetch(`${API_BASE}/admin/suppliers/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Supplier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Supplier Name *</label>
              <Input 
                placeholder="Supplier name" 
                value={supplier_name} 
                onChange={e => setSupplier_name(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input 
                placeholder="Phone number" 
                value={supplier_phone} 
                onChange={e => setSupplier_phone(e.target.value)} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                placeholder="Email address" 
                value={supplier_email} 
                onChange={e => setSupplier_email(e.target.value)} 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input 
                placeholder="Address" 
                value={supplier_address} 
                onChange={e => setSupplier_address(e.target.value)} 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onCreate}>Add Supplier</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No suppliers found</div>
          ) : (
            <div className="space-y-3">
              {suppliers.map(supplier => (
                <div key={supplier.supplier_id} className="border rounded p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">#{supplier.supplier_id} — {supplier.supplier_name}</div>
                      <div className="text-sm text-gray-600 mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <p><strong>Phone:</strong> {supplier.supplier_phone || 'N/A'}</p>
                          <p><strong>Email:</strong> {supplier.supplier_email || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Address:</strong> {supplier.supplier_address || 'N/A'}</p>
                          <p><strong>Added:</strong> {supplier.created_at ? new Date(supplier.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => openEdit(supplier)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onDelete(supplier.supplier_id)}
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
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Supplier Name *</label>
                <Input 
                  value={editSupplier_name}
                  onChange={e => setEditSupplier_name(e.target.value)}
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  value={editSupplier_phone}
                  onChange={e => setEditSupplier_phone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email"
                  value={editSupplier_email}
                  onChange={e => setEditSupplier_email(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  value={editSupplier_address}
                  onChange={e => setEditSupplier_address(e.target.value)}
                  placeholder="Address"
                />
              </div>
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
