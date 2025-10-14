// src/pages/admin/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiGet, apiSend } from "@/lib/api";
import { fmtDateTime } from "@/lib/date";

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  priceEach: number;
  totalPrice: number;
};

type Order = {
  id: number;
  orderDate: string | null;
  deliveryDate: string | null;
  totalPrice: number | null;
  advancePayment: number | null;
  advancePaymentStatus: string | null;
  balancePayment: number | null;
  balancePaymentStatus: string | null;
  orderStatus: string | null;
  customer: {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
  orderItems: OrderItem[];
  createdAt: string | null;
};

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
};

type Product = {
  id: number;
  name: string;
  price: number;
  availability: string;
};

type Page<T> = { 
  content: T[]; 
  totalElements: number; 
  totalPages: number; 
  number: number; 
  size: number; 
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  // Form state for creating/editing orders
  const [form, setForm] = useState({
    customerId: "",
    orderDate: "",
    deliveryDate: "",
    totalPrice: "",
    advancePayment: "",
    balancePayment: "",
    advancePaymentStatus: "unpaid",
    balancePaymentStatus: "unpaid",
    orderStatus: "pending"
  });
  
  const [orderItems, setOrderItems] = useState<{
    productId: string;
    quantity: string;
    priceEach: string;
  }[]>([]);

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadProducts();
  }, [page]);

  const loadOrders = async () => {
    if (!API_BASE) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<Page<Order>>(`/admin/orders?page=${page}&size=20`);
      setOrders(res.content || []);
    } catch (e: any) {
      setError(e.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await apiGet<Page<Customer>>("/admin/customers?page=0&size=1000");
      setCustomers(res.content || []);
    } catch (e) {
      console.error("Failed to load customers:", e);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await apiGet<Page<Product>>("/admin/products?page=0&size=1000");
      setProducts(res.content || []);
    } catch (e) {
      console.error("Failed to load products:", e);
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "refunded": return "bg-purple-100 text-purple-800";
      case "shipped": return "bg-indigo-100 text-indigo-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "unpaid": return "bg-red-100 text-red-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusDotColor = (status: string | null) => {
    if (!status) return "bg-gray-400";
    switch (status.toLowerCase()) {
      case "verified": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "unpaid": return "bg-red-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const openCreateModal = () => {
    setForm({
      customerId: "",
      orderDate: "",
      deliveryDate: "",
      totalPrice: "0",
      advancePayment: "0",
      balancePayment: "0",
      advancePaymentStatus: "unpaid",
      balancePaymentStatus: "unpaid",
      orderStatus: "pending"
    });
    setOrderItems([{ productId: "", quantity: "", priceEach: "" }]);
    setCreateModalOpen(true);
  };

  const handleAdvancePaymentChange = (value: string) => {
    const advance = parseFloat(value) || 0;
    const total = parseFloat(form.totalPrice) || 0;
    const balance = total - advance;
    setForm(prev => ({ 
      ...prev, 
      advancePayment: value,
      balancePayment: balance.toString()
    }));
  };

  const handleTotalPriceChange = (value: string) => {
    const total = parseFloat(value) || 0;
    const advance = parseFloat(form.advancePayment) || 0;
    const balance = total - advance;
    setForm(prev => ({ 
      ...prev, 
      totalPrice: value,
      balancePayment: balance.toString()
    }));
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: "", priceEach: "" }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
    
    // Recalculate total price when items are removed
    const newTotal = newItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const priceEach = parseFloat(item.priceEach) || 0;
      return total + (quantity * priceEach);
    }, 0);
    
    setForm(prev => ({ ...prev, totalPrice: newTotal.toString() }));
  };

  const updateOrderItem = (index: number, field: keyof typeof orderItems[0], value: string) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-populate price when product is selected
    if (field === 'productId' && value) {
      const selectedProduct = products.find(p => p.id.toString() === value);
      if (selectedProduct) {
        newItems[index].priceEach = selectedProduct.price.toString();
      }
    }
    
    setOrderItems(newItems);
    
    // Auto-calculate total price when items change
    const newTotal = newItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const priceEach = parseFloat(item.priceEach) || 0;
      return total + (quantity * priceEach);
    }, 0);
    
    setForm(prev => ({ ...prev, totalPrice: newTotal.toString() }));
  };

  const calculateTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const priceEach = parseFloat(item.priceEach) || 0;
      return total + (quantity * priceEach);
    }, 0);
  };

  const onCreateOrder = async () => {
    if (!form.customerId) {
      alert("Please select a customer");
      return;
    }

    const validItems = orderItems.filter(item => 
      item.productId && item.quantity && item.priceEach
    );

    if (validItems.length === 0) {
      alert("Please add at least one product item");
      return;
    }

    // Calculate totals automatically
    const calculatedTotal = calculateTotalPrice();
    const advancePayment = parseFloat(form.advancePayment) || 0;
    const balancePayment = parseFloat(form.balancePayment) || 0;

    try {
      const orderData = {
        customerId: parseInt(form.customerId),
        orderDate: form.orderDate ? new Date(form.orderDate).toISOString() : null,
        deliveryDate: form.deliveryDate ? new Date(form.deliveryDate).toISOString() : null,
        totalPrice: calculatedTotal,
        advancePayment: advancePayment,
        balancePayment: balancePayment,
        advancePaymentStatus: form.advancePaymentStatus,
        balancePaymentStatus: form.balancePaymentStatus,
        orderStatus: form.orderStatus,
        orderItems: validItems.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          priceEach: parseFloat(item.priceEach)
        }))
      };

      console.log("Creating order with data:", orderData);
      await apiSend<Order>("/admin/orders", "POST", orderData);
      setCreateModalOpen(false);
      await loadOrders();
    } catch (e: any) {
      console.error("Order creation error:", e);
      alert(e.message || "Failed to create order. Please check the console for details.");
    }
  };

  const onDeleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await apiSend<void>(`/admin/orders/${orderId}`, "DELETE");
      await loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to delete order");
    }
  };

  const onUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiSend<Order>(`/admin/orders/${orderId}`, "PUT", {
        orderStatus: newStatus
      });
      await loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to update order status");
    }
  };

  const onUpdateAdvancePaymentStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiSend<Order>(`/admin/orders/${orderId}`, "PUT", {
        advancePaymentStatus: newStatus
      });
      await loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to update advance payment status");
    }
  };

  const onUpdateBalancePaymentStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiSend<Order>(`/admin/orders/${orderId}`, "PUT", {
        balancePaymentStatus: newStatus
      });
      await loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to update balance payment status");
    }
  };

  const onUpdatePaymentAmounts = async (orderId: number, advancePayment: number, balancePayment: number) => {
    try {
      await apiSend<Order>(`/admin/orders/${orderId}`, "PUT", {
        advancePayment: advancePayment,
        balancePayment: balancePayment
      });
      await loadOrders();
    } catch (e: any) {
      alert(e.message || "Failed to update payment amounts");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <Button onClick={openCreateModal}>Create New Order</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found. Create your first order to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Customer:</strong> {order.customer?.name || 'Unknown'}</p>
                          <p><strong>Order Date:</strong> {order.orderDate ? fmtDateTime(order.orderDate) : 'N/A'}</p>
                          <p><strong>Delivery Date:</strong> {order.deliveryDate ? fmtDateTime(order.deliveryDate) : 'N/A'}</p>
                        </div>
                        <div>
                          <p><strong>Total Price:</strong> Rs. {order.totalPrice || '0'}</p>
                          <p><strong>Advance Payment:</strong> Rs. {order.advancePayment || '0'}</p>
                          <p><strong>Balance Payment:</strong> Rs. {order.balancePayment || '0'}</p>
                        </div>
                      </div>
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Items:</p>
                          <div className="text-xs text-gray-600">
                            {order.orderItems.map((item, idx) => (
                              <span key={idx}>
                                {item.productName} (Qty: {item.quantity}, Rs. {item.priceEach})
                                {idx < order.orderItems.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus || 'Unknown'}
                      </Badge>
                      <div className="flex space-x-2">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs text-gray-600">Advance Payment</span>
                            <div className={`w-2 h-2 rounded-full ${getPaymentStatusDotColor(order.advancePaymentStatus)}`}></div>
                          </div>
                          <Select value={order.advancePaymentStatus || ""} onValueChange={(value) => onUpdateAdvancePaymentStatus(order.id, value)}>
                            <SelectTrigger className="w-24 h-8 text-xs border-2">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-xs text-gray-600">Balance Payment</span>
                            <div className={`w-2 h-2 rounded-full ${getPaymentStatusDotColor(order.balancePaymentStatus)}`}></div>
                          </div>
                          <Select value={order.balancePaymentStatus || ""} onValueChange={(value) => onUpdateBalancePaymentStatus(order.id, value)}>
                            <SelectTrigger className="w-24 h-8 text-xs border-2">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unpaid">Unpaid</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="verified">Verified</SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-600 mb-1">Advance Amount</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="w-20 h-8 text-xs"
                            defaultValue={order.advancePayment || 0}
                            onBlur={(e) => {
                              const newAmount = parseFloat(e.target.value) || 0;
                              if (newAmount !== order.advancePayment) {
                                onUpdatePaymentAmounts(order.id, newAmount, order.balancePayment || 0);
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-gray-600 mb-1">Balance Amount</span>
                          <Input 
                            type="number" 
                            step="0.01" 
                            className="w-20 h-8 text-xs"
                            defaultValue={order.balancePayment || 0}
                            onBlur={(e) => {
                              const newAmount = parseFloat(e.target.value) || 0;
                              if (newAmount !== order.balancePayment) {
                                onUpdatePaymentAmounts(order.id, order.advancePayment || 0, newAmount);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Select value={order.orderStatus || ""} onValueChange={(value) => onUpdateOrderStatus(order.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => onDeleteOrder(order.id)}>
                          Delete
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

      {/* Create Order Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Customer Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer *</label>
                <Select value={form.customerId} onValueChange={(value) => setForm({...form, customerId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                        {customer.customer_name} ({customer.customer_email || customer.customer_phone || 'No contact'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Order Status</label>
                <Select value={form.orderStatus} onValueChange={(value) => setForm({...form, orderStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Order Date</label>
                <Input 
                  type="datetime-local" 
                  value={form.orderDate} 
                  onChange={(e) => setForm({...form, orderDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Date</label>
                <Input 
                  type="datetime-local" 
                  value={form.deliveryDate} 
                  onChange={(e) => setForm({...form, deliveryDate: e.target.value})} 
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Total Price (Auto-calculated)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={form.totalPrice} 
                  onChange={(e) => handleTotalPriceChange(e.target.value)} 
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Automatically calculated from items</p>
              </div>
              <div>
                <label className="text-sm font-medium">Advance Payment</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={form.advancePayment} 
                  onChange={(e) => handleAdvancePaymentChange(e.target.value)} 
                />
                <p className="text-xs text-gray-500 mt-1">Enter advance payment amount</p>
              </div>
              <div>
                <label className="text-sm font-medium">Balance Payment (Auto-calculated)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={form.balancePayment} 
                  readOnly
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Total - Advance Payment</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Advance Payment Status</label>
                <Select value={form.advancePaymentStatus} onValueChange={(value) => setForm({...form, advancePaymentStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Balance Payment Status</label>
                <Select value={form.balancePaymentStatus} onValueChange={(value) => setForm({...form, balancePaymentStatus: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Order Items *</label>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  Add Item
                </Button>
              </div>
              <div className="space-y-2">
                {orderItems.map((item, index) => {
                  const quantity = parseFloat(item.quantity) || 0;
                  const priceEach = parseFloat(item.priceEach) || 0;
                  const itemTotal = quantity * priceEach;
                  
                  return (
                    <div key={index} className="grid grid-cols-5 gap-2 items-end p-3 border rounded-lg bg-gray-50">
                      <div>
                        <label className="text-xs font-medium">Product</label>
                        <Select value={item.productId} onValueChange={(value) => updateOrderItem(index, 'productId', value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select Product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - Rs. {product.price}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Quantity</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={item.quantity} 
                          onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Price Each</label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          value={item.priceEach} 
                          onChange={(e) => updateOrderItem(index, 'priceEach', e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Total</label>
                        <div className="h-8 flex items-center px-3 bg-white border rounded text-sm font-medium">
                          Rs. {itemTotal.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeOrderItem(index)}
                          disabled={orderItems.length === 1}
                          className="h-8"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-blue-50 p-3 rounded-lg mt-2">
                <div className="text-sm font-medium text-blue-900 mb-2">Order Summary</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Items Total:</span>
                    <span className="font-medium ml-2">Rs. {calculateTotalPrice().toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Advance Payment:</span>
                    <span className="font-medium ml-2">Rs. {(parseFloat(form.advancePayment) || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Balance Payment:</span>
                    <span className="font-medium ml-2">Rs. {(parseFloat(form.balancePayment) || 0).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining:</span>
                    <span className={`font-medium ml-2 ${(calculateTotalPrice() - (parseFloat(form.advancePayment) || 0) - (parseFloat(form.balancePayment) || 0)) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Rs. {(calculateTotalPrice() - (parseFloat(form.advancePayment) || 0) - (parseFloat(form.balancePayment) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={onCreateOrder}>
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
