// src/pages/admin/ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  id: number;
  name: string;
  price: number;
  availability: "in_stock"|"out_of_stock"|"preorder"|"discontinued";
  category?: { id: number; name: string } | null;
  supplier?: { id: number; name: string } | null;
  imageUrl?: string | null;
  createdAt?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [cats, setCats] = useState<{id:number; name:string}[]>([]);
  const [form, setForm] = useState({ name: "", price: "", pc_id: "" });

  useEffect(() => {
    const load = async () => {
      if (!API_BASE) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/admin/products`, { credentials: "include" });
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const page = await res.json();
        setProducts(page.content || []);
        const rc = await fetch(`${API_BASE}/admin/categories`, { credentials: "include" });
        if (rc.ok) {
          const pc = await rc.json();
          setCats(pc.content || []);
        }
      } catch (e:any) {
        setError(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onCreate = async () => {
    if (!form.name.trim() || !form.price) return;
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_name: form.name.trim(), product_price: Number(form.price), pc_id: form.pc_id ? Number(form.pc_id) : null })
    });
    if (res.ok) {
      setForm({ name: "", price: "", pc_id: "" });
      const page = await (await fetch(`${API_BASE}/admin/products`, { credentials: "include" })).json();
      setProducts(page.content || []);
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in_stock": return "bg-green-100 text-green-800";
      case "out_of_stock": return "bg-red-100 text-red-800";
      case "preorder": return "bg-blue-100 text-blue-800";
      case "discontinued": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatAvailability = (availability: string) => {
    return availability.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button>Add New Product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
            <Input placeholder="Name" value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} />
            <Input placeholder="Price" type="number" min="0" value={form.price} onChange={e=>setForm(s=>({...s,price:e.target.value}))} />
            <Select value={form.pc_id} onValueChange={(v)=>setForm(s=>({...s, pc_id:v}))}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {cats.map(c=> <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={onCreate}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Add products to manage your inventory.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Product ID:</strong> #{product.id}</p>
                          <p><strong>Price:</strong> Rs. {product.price}</p>
                        </div>
                        <div>
                          <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
                          <p><strong>Supplier:</strong> {product.supplier?.name || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getAvailabilityColor(product.availability)}>
                        {formatAvailability(product.availability)}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
