// src/pages/admin/OrdersPage.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";
import { Plus, X } from "lucide-react";
import { api } from "@/lib/api";

type Order = {
  orderId: number;
  orderDate: string | null;
  deliveryDate: string | null;
  totalPrice: number | null;
  advancePaymentStatus: string;
  balancePaymentStatus: string;
  orderStatus: string;
  customerId: number;
  customerName: string;
  createdAt: string | null;
};

type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  priceEach: number;
  lineTotal: number;
};

type OrderDetails = Order & {
  orderItems: OrderItem[];
  customerEmail: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  availability: string;
  category: {
    id: number;
    name: string;
  } | null;
};

type Customer = {
  customer_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

type NewOrderItem = {
  productId: number;
  quantity: number;
  priceEach: number;
};

type NewOrderForm = {
  customerId: number;
  orderDate: string;
  deliveryDate: string;
  totalPrice: number;
  advancePayment: number;
  balancePayment: number;
  orderItems: NewOrderItem[];
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddOrderDialog, setShowAddOrderDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newOrder, setNewOrder] = useState<NewOrderForm>({
    customerId: 0,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    totalPrice: 0,
    advancePayment: 0,
    balancePayment: 0,
    orderItems: []
  });
  const { toast } = useToast();
  const { isAuthenticated, admin } = useAdmin();

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  // Fetch products and customers when dialog opens
  useEffect(() => {
    if (showAddOrderDialog) {
      fetchProducts();
      fetchCustomers();
    }
  }, [showAddOrderDialog]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = statusFilter === "all" 
        ? "/api/admin/orders" 
        : `/api/admin/orders/status/${statusFilter}`;
      
      const response = await fetch(url, { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.content || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, { credentials: 'include' });
      
      if (response.ok) {
        const orderDetails = await response.json();
        setSelectedOrder(orderDetails);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch order details",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch order details",
        variant: "destructive"
      });
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.get<any>(`/api/admin/orders/available-products?size=100`);
      
      setProducts(data.content || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available products",
        variant: "destructive"
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await api.get<any>(`/api/admin/customers?size=100`);
      setCustomers(data.content || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive"
      });
    }
  };

  const createOrder = async () => {
    try {
      console.log('Admin authentication status:', isAuthenticated, admin);
      
      if (!isAuthenticated) {
        toast({
          title: "Error",
          description: "You must be logged in as an admin to create orders",
          variant: "destructive"
        });
        return;
      }

      if (newOrder.customerId === 0) {
        toast({
          title: "Error",
          description: "Please select a customer",
          variant: "destructive"
        });
        return;
      }

      if (newOrder.orderItems.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one item to the order",
          variant: "destructive"
        });
        return;
      }

      const orderData = {
        customerId: newOrder.customerId,
        orderDate: newOrder.orderDate ? new Date(newOrder.orderDate).toISOString() : undefined,
        deliveryDate: newOrder.deliveryDate ? new Date(newOrder.deliveryDate).toISOString() : undefined,
        totalPrice: newOrder.totalPrice || 0,
        advancePayment: newOrder.advancePayment || 0,
        balancePayment: newOrder.balancePayment || 0,
        orderItems: newOrder.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          priceEach: item.priceEach || 0
        }))
      };

      console.log('Sending order data:', orderData);
      console.log('Current session cookies:', document.cookie);

      const response = await fetch("/api/admin/orders",{ 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        credentials: "include", 
        body: JSON.stringify(orderData) });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        toast({ title: "Success", description: "Order created successfully" });
        setShowAddOrderDialog(false);
        resetNewOrderForm();
        fetchOrders();
        return;
      }

      // not ok -> read error body (may be text or json)
      let errorMessage = "Failed to create order";
      try {
        const ct = response.headers.get("content-type") || "";
        const errorData = ct.includes("application/json")
          ? await response.json()
          : await response.text();
        errorMessage =
          typeof errorData === "string"
            ? `${response.status} ${errorData}`
            : errorData.message || errorData.error || errorMessage;
        console.error("Order creation error:", errorData);
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }

      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } catch (err) {
      console.error("Network/JS error creating order:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    }
  };


  const resetNewOrderForm = () => {
    setNewOrder({
      customerId: 0,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      totalPrice: 0,
      advancePayment: 0,
      balancePayment: 0,
      orderItems: []
    });
  };

  const handleCancelOrder = () => {
    resetNewOrderForm();
    setShowAddOrderDialog(false);
  };

  const addOrderItem = () => {
    setNewOrder(prev => ({
      ...prev,
      orderItems: [...prev.orderItems, { productId: 0, quantity: 1, priceEach: 0 }]
    }));
  };

  const removeOrderItem = (index: number) => {
    setNewOrder(prev => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index)
    }));
  };

  const updateOrderItem = (index: number, field: keyof NewOrderItem, value: number) => {
    setNewOrder(prev => ({
      ...prev,
      orderItems: prev.orderItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    const total = newOrder.orderItems.reduce((sum, item) => sum + (item.quantity * item.priceEach), 0);
    setNewOrder(prev => ({ ...prev, totalPrice: total }));
  };

  const calculateBalancePayment = () => {
    const balance = newOrder.totalPrice - newOrder.advancePayment;
    setNewOrder(prev => ({ ...prev, balancePayment: Math.max(0, balance) }));
  };

  // Calculate total whenever order items change
  useEffect(() => {
    calculateTotal();
  }, [newOrder.orderItems]);

  // Calculate balance payment whenever total price or advance payment changes
  useEffect(() => {
    calculateBalancePayment();
  }, [newOrder.totalPrice, newOrder.advancePayment]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: newStatus })
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully"
        });
        fetchOrders();
      } else {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  const updatePaymentStatus = async (orderId: number, paymentType: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          paymentType: paymentType.toUpperCase(),
          paymentStatus: paymentStatus
        })
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment status updated successfully"
        });
        fetchOrders();
      } else {
        toast({
          title: "Error",
          description: "Failed to update payment status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "refunded": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "unpaid": return "bg-red-100 text-red-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <div className="flex gap-2">
          <Dialog open={showAddOrderDialog} onOpenChange={(open) => {
            setShowAddOrderDialog(open);
            if (!open) {
              resetNewOrderForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Customer Selection */}
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select 
                    value={newOrder.customerId.toString()} 
                    onValueChange={(value) => setNewOrder(prev => ({ ...prev, customerId: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.customer_id} value={customer.customer_id.toString()}>
                          {customer.customer_name} ({customer.customer_email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={newOrder.orderDate}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, orderDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={newOrder.deliveryDate}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Order Items *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  
                  {newOrder.orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                      <div className="col-span-4">
                        <Label>Product</Label>
                        <Select 
                          value={item.productId.toString()} 
                          onValueChange={(value) => {
                            const productId = parseInt(value);
                            const product = products.find(p => p.id === productId);
                            updateOrderItem(index, 'productId', productId);
                            if (product) {
                              updateOrderItem(index, 'priceEach', product.price);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - ${product.price} ({product.availability})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Price Each</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.priceEach || ''}
                          onChange={(e) => updateOrderItem(index, 'priceEach', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Line Total</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={(item.quantity * item.priceEach).toFixed(2)}
                          disabled
                        />
                      </div>
                      <div className="col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalPrice">Total Price</Label>
                    <Input
                      id="totalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newOrder.totalPrice || ''}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, totalPrice: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advancePayment">Advance Payment</Label>
                    <Input
                      id="advancePayment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newOrder.advancePayment || ''}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, advancePayment: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="balancePayment">Balance Payment</Label>
                    <Input
                      id="balancePayment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newOrder.balancePayment || ''}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, balancePayment: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelOrder}>
                    Cancel
                  </Button>
                  <Button onClick={createOrder}>
                    Create Order
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={fetchOrders} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by customer name or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders found. Orders will appear here when customers place them.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.orderId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">Order #{order.orderId}</h3>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                          <p><strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}</p>
                        </div>
                        <div>
                          <p><strong>Customer:</strong> {order.customerName}</p>
                          <p><strong>Total Price:</strong> Rs. {order.totalPrice || '0'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                      <div className="flex space-x-2">
                        <Badge className={getPaymentStatusColor(order.advancePaymentStatus)}>
                          Advance: {order.advancePaymentStatus}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.balancePaymentStatus)}>
                          Balance: {order.balancePaymentStatus}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => fetchOrderDetails(order.orderId)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Order #{order.orderId} Details</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold">Order Information</h4>
                                    <p><strong>Order Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                                    <p><strong>Delivery Date:</strong> {formatDate(selectedOrder.deliveryDate)}</p>
                                    <p><strong>Total Price:</strong> Rs. {selectedOrder.totalPrice}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Customer Information</h4>
                                    <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                                    <p><strong>Customer ID:</strong> {selectedOrder.customerId}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold">Order Items</h4>
                                  <div className="border rounded-lg">
                                    <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 font-semibold">
                                      <div>Product</div>
                                      <div>Quantity</div>
                                      <div>Price Each</div>
                                      <div>Line Total</div>
                                    </div>
                                    {selectedOrder.orderItems.map((item, index) => (
                                      <div key={index} className="grid grid-cols-5 gap-4 p-3 border-t">
                                        <div>{item.productName}</div>
                                        <div>{item.quantity}</div>
                                        <div>Rs. {item.priceEach}</div>
                                        <div>Rs. {item.lineTotal}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Select onValueChange={(value) => updateOrderStatus(order.orderId, value)}>
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Update Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                      <SelectItem value="shipped">Shipped</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <Select onValueChange={(value) => updatePaymentStatus(order.orderId, 'advance', value)}>
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Advance Payment" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unpaid">Unpaid</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="verified">Verified</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  <Select onValueChange={(value) => updatePaymentStatus(order.orderId, 'balance', value)}>
                                    <SelectTrigger className="w-40">
                                      <SelectValue placeholder="Balance Payment" />
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
                            )}
                          </DialogContent>
                        </Dialog>
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

export default OrdersPage;
