import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiGet } from "@/lib/api";
import { fmtDateTime } from "@/lib/date";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

// Types
type CustomerInfo = {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

type OrderItemSummary = {
  productId: number;
  productName: string;
  quantity: number;
  priceEach: number;
  totalPrice: number;
};

type OrderSummary = {
  id: number;
  orderDate: string | null;
  deliveryDate: string | null;
  totalPrice: number | null;
  advancePayment: number | null;
  balancePayment: number | null;
  advancePaymentStatus: string | null;
  balancePaymentStatus: string | null;
  orderStatus: string | null;
  orderItems: OrderItemSummary[];
  createdAt: string | null;
};

type BookingSummary = {
  id: number;
  customerName: string;
  bookingDescription: string;
  serviceName: string;
  bookingStatus: string | null;
  bookingDate: string | null;
  createdAt: string | null;
};

type PaymentSummary = {
  totalPaid: number;
  totalPending: number;
  totalAdvance: number;
  totalBalance: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
};

type CustomerProfile = {
  customer: CustomerInfo;
  orders: OrderSummary[];
  bookings: BookingSummary[];
  payments: PaymentSummary;
};

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!API_BASE) return;
      try {
        const data = await apiGet<CustomerProfile>("/customers/profile");
        setProfile(data);
      } catch (e: any) {
        if (e.message.includes("401")) {
          window.location.href = "/login";
        } else {
          toast({ 
            title: "Error", 
            description: `Failed to load profile: ${e.message}`, 
            variant: "destructive" 
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [toast]);

  const logout = async () => {
    if (!API_BASE) return;
    await fetch(`${API_BASE}/customers/logout`, { method: "POST", credentials: "include" });
    localStorage.removeItem("customer");
    window.location.href = "/login";
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
      case "confirmed": return "bg-green-100 text-green-800";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <section className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-studio-black mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your profile...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <section className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-20">
              <p className="text-gray-600">Unable to load profile data</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8 bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.customer.name}</h1>
                    <p className="text-gray-600 mt-1">{profile.customer.email}</p>
                    <p className="text-gray-500 text-sm">{profile.customer.phone}</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Member since {fmtDateTime(profile.customer.createdAt)}
                    </p>
                  </div>
                  <Button onClick={logout} className="bg-studio-black hover:bg-studio-black/90">
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total Paid</p>
                      <p className="text-2xl font-bold">Rs. {profile.payments.totalPaid.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Pending Payments</p>
                      <p className="text-2xl font-bold">Rs. {profile.payments.totalPending.toFixed(2)}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold">{profile.payments.totalOrders}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Bookings</p>
                      <p className="text-2xl font-bold">{profile.bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for Orders and Bookings */}
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="orders">Order History ({profile.orders.length})</TabsTrigger>
                <TabsTrigger value="bookings">Booking History ({profile.bookings.length})</TabsTrigger>
              </TabsList>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                {profile.orders.length === 0 ? (
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                      <p className="text-gray-600">You haven't placed any orders yet. Start by exploring our services!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {profile.orders.map((order) => (
                      <Card key={order.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Order #{order.id}</h3>
                              <div className="text-sm text-gray-600 mt-1">
                                <p>Order Date: {order.orderDate ? fmtDateTime(order.orderDate) : 'N/A'}</p>
                                {order.deliveryDate && (
                                  <p>Delivery Date: {fmtDateTime(order.deliveryDate)}</p>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(order.orderStatus)}>
                              {order.orderStatus || 'Unknown'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                              <p className="text-sm text-gray-600">Total: Rs. {order.totalPrice?.toFixed(2) || '0.00'}</p>
                              <p className="text-sm text-gray-600">Items: {order.orderItems.length}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">Advance Payment</h4>
                              <p className="text-sm text-gray-600">Amount: Rs. {order.advancePayment?.toFixed(2) || '0.00'}</p>
                              <Badge className={`mt-1 ${getPaymentStatusColor(order.advancePaymentStatus)}`}>
                                {order.advancePaymentStatus || 'Unknown'}
                              </Badge>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">Balance Payment</h4>
                              <p className="text-sm text-gray-600">Amount: Rs. {order.balancePayment?.toFixed(2) || '0.00'}</p>
                              <Badge className={`mt-1 ${getPaymentStatusColor(order.balancePaymentStatus)}`}>
                                {order.balancePaymentStatus || 'Unknown'}
                              </Badge>
                            </div>
                          </div>

                          {order.orderItems.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                              <div className="space-y-2">
                                {order.orderItems.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-900">{item.productName}</span>
                                    <div className="text-gray-600">
                                      <span>Qty: {item.quantity} × Rs. {item.priceEach.toFixed(2)} = Rs. {item.totalPrice.toFixed(2)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                {profile.bookings.length === 0 ? (
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-600">You haven't made any bookings yet. Book a service to get started!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {profile.bookings.map((booking) => (
                      <Card key={booking.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Booking #{booking.id}</h3>
                              <div className="text-sm text-gray-600 mt-1">
                                <p>Service: {booking.serviceName}</p>
                                <p>Booking Date: {booking.bookingDate ? fmtDateTime(booking.bookingDate) : 'N/A'}</p>
                                <p>Created: {booking.createdAt ? fmtDateTime(booking.createdAt) : 'N/A'}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(booking.bookingStatus)}>
                              {booking.bookingStatus || 'Unknown'}
                            </Badge>
                          </div>

                          {booking.bookingDescription && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                              <p className="text-sm text-gray-600">{booking.bookingDescription}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;