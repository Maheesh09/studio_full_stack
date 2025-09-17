// src/pages/admin/SuppliersPage.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Supplier = {
  supplier_id: number;
  supplier_name: string;
  supplier_phone: string | null;
  supplier_email: string | null;
  supplier_address: string | null;
  created_at?: string | null;
};

const SuppliersPage = () => {
  const [suppliers] = useState<Supplier[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suppliers Management</h1>
        <Button>Add New Supplier</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No suppliers found. Add suppliers to manage your vendor relationships.
            </div>
          ) : (
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.supplier_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{supplier.supplier_name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Supplier ID:</strong> #{supplier.supplier_id}</p>
                          <p><strong>Phone:</strong> {supplier.supplier_phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Email:</strong> {supplier.supplier_email || 'N/A'}</p>
                          <p><strong>Address:</strong> {supplier.supplier_address || 'N/A'}</p>
                        </div>
                      </div>
                      {supplier.created_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          <strong>Added:</strong> {new Date(supplier.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact
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

export default SuppliersPage;
