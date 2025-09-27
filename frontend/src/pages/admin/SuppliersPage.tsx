// src/pages/admin/SuppliersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { listSuppliers, createSupplier, updateSupplier, deleteSupplier, type SupplierDTO, ApiError } from "@/lib/api";
import { useAdmin } from "@/contexts/AdminContext";

type Supplier = SupplierDTO;

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();
  const { refreshMe } = useAdmin();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  useEffect(() => {
    (async () => {
      // Ensure admin session is fresh before fetching
      try { await refreshMe(); } catch {}
      setLoading(true);
      setError(null);
      try {
        const data = await listSuppliers();
        setSuppliers(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onOpenNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", address: "" });
    setOpen(true);
  };

  const onOpenEdit = (s: Supplier) => {
    setEditing(s);
    setForm({ name: s.name || "", email: s.email || "", phone: s.phone || "", address: s.address || "" });
    setOpen(true);
  };

  const onSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const emailTrim = form.email.trim();
      if (emailTrim && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
        setLoading(false);
        setError("Please enter a valid email or leave it blank");
        return;
      }
      const payload = {
        name: form.name.trim(),
        email: emailTrim ? emailTrim : undefined,
        phone: form.phone.trim() ? form.phone.trim() : undefined,
        address: form.address.trim() ? form.address.trim() : undefined,
      };
      if (editing) {
        await updateSupplier(editing.supplierId, payload);
      } else {
        await createSupplier(payload);
      }
      const data = await listSuppliers();
      setSuppliers(data);
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (s: Supplier) => {
    if (!confirm(`Delete supplier ${s.name}?`)) return;
    setLoading(true);
    setError(null);
    try {
      await deleteSupplier(s.supplierId);
      setSuppliers((prev) => prev.filter((x) => x.supplierId !== s.supplierId));
    } catch (e: any) {
      if (e instanceof ApiError && e.status === 401) {
        setError("Admin session expired. Redirecting to login…");
        nav("/admin/login", { replace: true, state: { from: location } });
      } else {
        setError(e?.message || "Delete failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers Management</h1>
        <Button onClick={onOpenNew}>Add New Supplier</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="text-center py-2 text-red-600">{error}</div>
          )}
          {!loading && suppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No suppliers found. Add suppliers to manage your vendor relationships.
            </div>
          ) : (
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.supplierId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Supplier ID:</strong> #{supplier.supplierId}</p>
                          <p><strong>Phone:</strong> {supplier.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Email:</strong> {supplier.email || 'N/A'}</p>
                          <p><strong>Address:</strong> {supplier.address || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onOpenEdit(supplier)}>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(supplier)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Address</label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onSave} disabled={loading}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuppliersPage;
