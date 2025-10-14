// src/pages/admin/ServicesPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Service = {
  service_id: number;
  service_name: string;
  service_description?: string | null;
  service_price: number | null;
  created_at?: string | null;
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editing, setEditing] = useState<null | Service>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const load = async () => {
    if (!API_BASE) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/admin/services`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed ${res.status}`);
      const page = await res.json();
      setServices(page.content || []);
    } catch (e: any) {
      setError(e.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!form.name.trim()) return;
    const res = await fetch(`${API_BASE}/api/admin/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        service_name: form.name.trim(),
        service_price: form.price ? Number(form.price) : null,
        service_description: form.description || null,
      })
    });
    if (res.ok) {
      setForm({ name: "", price: "", description: "" });
      await load();
    } else {
      alert(`Create failed: ${res.status}`);
    }
  };

  const onEdit = (s: Service) => setEditing(s);

  const onUpdate = async () => {
    if (!editing) return;
    const res = await fetch(`${API_BASE}/api/admin/services/${editing.service_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        service_name: editing.service_name,
        service_price: editing.service_price,
        service_description: editing.service_description ?? null,
      })
    });
    if (res.ok) {
      setEditing(null);
      await load();
    } else {
      alert(`Update failed: ${res.status}`);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`${API_BASE}/api/admin/services/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
              <Input placeholder="Name" value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} />
              <Input placeholder="Price (optional)" type="number" min="0" value={form.price} onChange={e=>setForm(s=>({...s,price:e.target.value}))} />
              <Button onClick={onCreate}>Add</Button>
            </div>
            <Textarea placeholder="Description (optional)" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found. Add services to manage your offerings.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.service_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.service_name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Service ID:</strong> #{service.service_id}</p>
                        <p><strong>Price:</strong> {service.service_price ? `Rs. ${service.service_price}` : 'Price on request'}</p>
                        {service.service_description && (
                          <p><strong>Description:</strong> {service.service_description}</p>
                        )}
                        {service.created_at && (
                          <p><strong>Created:</strong> {new Date(service.created_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Active
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(service)}>Edit</Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(service.service_id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <Card>
          <CardHeader><CardTitle>Edit Service</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Input value={editing.service_name} onChange={e=>setEditing({...editing, service_name: e.target.value})} />
            <Input type="number" min="0" value={editing.service_price ?? 0} onChange={e=>setEditing({...editing, service_price: Number(e.target.value)})} />
            <Textarea value={editing.service_description || ""} onChange={e=>setEditing({...editing, service_description: e.target.value})} />
            <div className="flex gap-2">
              <Button onClick={onUpdate}>Save</Button>
              <Button variant="outline" onClick={()=>setEditing(null)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesPage;
