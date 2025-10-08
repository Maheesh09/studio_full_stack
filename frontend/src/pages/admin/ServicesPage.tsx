// src/pages/admin/ServicesPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiGet, apiSend } from "@/lib/api";

type ServiceRow = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  createdAt?: string | null;
};

const ServicesPage = () => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [editing, setEditing] = useState<ServiceRow | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await apiGet<{ content: ServiceRow[] }>(`/admin/services?page=0&size=100`);
      setServices(Array.isArray(page.content) ? page.content : []);
    } catch (e: any) {
      setError(e.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!name.trim()) return;
    try {
      await apiSend(`/admin/services`, "POST", {
        service_name: name.trim(),
        service_price: price ? Number(price) : null,
        service_description: description || null,
      });
      setName(""); setPrice(""); setDescription("");
      await load();
    } catch (e: any) { alert(e.message || "Create failed"); }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    try {
      await apiSend(`/admin/services/${id}`, "DELETE");
      await load();
    } catch {}
  };

  const onUpdate = async () => {
    if (!editing) return;
    try {
      await apiSend(`/admin/services/${editing.id}`, "PUT", {
        service_name: editing.name,
        service_price: editing.price,
        service_description: editing.description,
      });
      setEditing(null);
      await load();
    } catch (e: any) { alert(e.message || "Update failed"); }
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
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_auto]">
            <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
            <Input placeholder="Price" type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} />
            <Button onClick={onCreate}>Add</Button>
          </div>
          <Textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
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
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Service ID:</strong> #{service.id}</p>
                        <p><strong>Price:</strong> {service.price != null ? `Rs. ${service.price}` : 'Price on request'}</p>
                        <p><strong>Description:</strong> {service.description || '-'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={()=>setEditing(service)}>Edit</Button>
                      <Button variant="outline" size="sm" onClick={()=>onDelete(service.id)}>Delete</Button>
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
            <Input value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} />
            <Input type="number" min="0" value={editing.price ?? 0} onChange={e=>setEditing({...editing, price: Number(e.target.value)})} />
            <Textarea value={editing.description || ""} onChange={e=>setEditing({...editing, description: e.target.value})} />
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

