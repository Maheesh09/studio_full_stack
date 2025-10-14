import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders/my-orders", {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.content || []);
      } else if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your orders",
          variant: "destructive"
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch your orders",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include'
      });
      
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button onClick={fetchMyOrders} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order History ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading your orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't placed any orders yet.</p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/")}
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
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
                            <p><strong>Total Price:</strong> Rs. {order.totalPrice || '0'}</p>
                            <p><strong>Status:</strong> 
                              <Badge className={`ml-2 ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </Badge>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-2">
                          <Badge className={getPaymentStatusColor(order.advancePaymentStatus)}>
                            Advance: {order.advancePaymentStatus}
                          </Badge>
                          <Badge className={getPaymentStatusColor(order.balancePaymentStatus)}>
                            Balance: {order.balancePaymentStatus}
                          </Badge>
                        </div>
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
                                    <p><strong>Status:</strong> 
                                      <Badge className={`ml-2 ${getStatusColor(selectedOrder.orderStatus)}`}>
                                        {selectedOrder.orderStatus}
                                      </Badge>
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">Payment Status</h4>
                                    <p><strong>Advance Payment:</strong> 
                                      <Badge className={`ml-2 ${getPaymentStatusColor(selectedOrder.advancePaymentStatus)}`}>
                                        {selectedOrder.advancePaymentStatus}
                                      </Badge>
                                    </p>
                                    <p><strong>Balance Payment:</strong> 
                                      <Badge className={`ml-2 ${getPaymentStatusColor(selectedOrder.balancePaymentStatus)}`}>
                                        {selectedOrder.balancePaymentStatus}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold">Order Items</h4>
                                  <div className="border rounded-lg">
                                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-semibold">
                                      <div>Product</div>
                                      <div>Quantity</div>
                                      <div>Price Each</div>
                                      <div>Line Total</div>
                                    </div>
                                    {selectedOrder.orderItems.map((item, index) => (
                                      <div key={index} className="grid grid-cols-4 gap-4 p-3 border-t">
                                        <div>{item.productName}</div>
                                        <div>{item.quantity}</div>
                                        <div>Rs. {item.priceEach}</div>
                                        <div>Rs. {item.lineTotal}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyOrders;
