// src/pages/admin/OrdersPage.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Order = {
  order_id: number;
  order_date: string | null;
  delivery_date: string | null;
  total_price: number | null;
  advance_payment_status: string;
  balance_payment_status: string;
  order_status: string;
  customer_id: number;
  created_at?: string | null;
};

const OrdersPage = () => {
  const [orders] = useState<Order[]>([]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "unpaid": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Button>Add New Order</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found. Orders will appear here when customers place them.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.order_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">Order #{order.order_id}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Order Date:</strong> {order.order_date || 'N/A'}</p>
                          <p><strong>Delivery Date:</strong> {order.delivery_date || 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Customer ID:</strong> {order.customer_id}</p>
                          <p><strong>Total Price:</strong> Rs. {order.total_price || '0'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.order_status)}>
                        {order.order_status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Badge className={getPaymentStatusColor(order.advance_payment_status)}>
                          Advance: {order.advance_payment_status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.balance_payment_status)}>
                          Balance: {order.balance_payment_status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
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

export default OrdersPage;
