// src/pages/admin/ProductsPage.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Product = {
  product_id: number;
  product_name: string;
  product_price: number;
  availability: "in_stock"|"out_of_stock"|"preorder"|"discontinued";
  pc_id: number | null;
  sup_id: number | null;
  created_at?: string | null;
};

const ProductsPage = () => {
  const [products] = useState<Product[]>([]);

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
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No products found. Add products to manage your inventory.
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.product_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{product.product_name}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Product ID:</strong> #{product.product_id}</p>
                          <p><strong>Price:</strong> Rs. {product.product_price}</p>
                        </div>
                        <div>
                          <p><strong>Category ID:</strong> {product.pc_id || 'N/A'}</p>
                          <p><strong>Supplier ID:</strong> {product.sup_id || 'N/A'}</p>
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
