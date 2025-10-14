// src/pages/admin/BookingsPage.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, MessageSquare, Edit, Trash2, Eye } from "lucide-react";

type Booking = {
  bookingId: number;
  customerName: string;
  bookingStatus: "pending" | "confirmed" | "completed" | "cancelled";
  bookingDescription: string | null;
  customerId: number | null;
  serviceId: number | null;
  serviceName: string | null;
  bookingDate: string;
  createdAt: string;
};

type Service = {
  service_id: number;
  service_name: string;
  service_price?: number;
  service_description?: string;
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({
    customerName: "",
    serviceId: "",
    bookingDate: "",
    bookingTime: "",
    bookingDescription: "",
    bookingStatus: "pending" as const
  });
  const { toast } = useToast();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    loadBookings();
    loadServices();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?size=100`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.content || []);
      } else {
        toast({
          title: "Failed to load bookings",
          description: "Could not fetch bookings from server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const res = await fetch(`/api/services?size=100`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data.content || []);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    const bookingDateTime = new Date(booking.bookingDate);
    setEditForm({
      customerName: booking.customerName,
      serviceId: booking.serviceId?.toString() || "",
      bookingDate: bookingDateTime.toISOString().split('T')[0],
      bookingTime: bookingDateTime.toTimeString().slice(0, 5),
      bookingDescription: booking.bookingDescription || "",
      bookingStatus: booking.bookingStatus
    });
  };

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;

    const bookingDateTime = new Date(`${editForm.bookingDate}T${editForm.bookingTime}`);
    
    try {
      const res = await fetch(`/api/bookings/${editingBooking.bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerName: editForm.customerName.trim(),
          serviceId: editForm.serviceId ? parseInt(editForm.serviceId) : null,
          bookingDate: bookingDateTime.toISOString(),
          bookingDescription: editForm.bookingDescription.trim() || null,
          bookingStatus: editForm.bookingStatus
        })
      });

      if (res.ok) {
        toast({
          title: "Booking Updated!",
          description: "The booking has been updated successfully.",
        });
        setEditingBooking(null);
        await loadBookings();
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast({
          title: "Booking Deleted!",
          description: "The booking has been deleted successfully.",
        });
        await loadBookings();
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking. Please check your connection.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings Management</h1>
        <Button onClick={loadBookings} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings ({bookings.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-500">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bookings found. Bookings will appear here when customers make appointments.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const { date, time } = formatDateTime(booking.bookingDate);
                return (
                  <div key={booking.bookingId} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">Booking #{booking.bookingId}</h3>
                          <Badge className={getStatusColor(booking.bookingStatus)}>
                            {booking.bookingStatus}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span><strong>Customer:</strong> {booking.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span><strong>Date:</strong> {date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span><strong>Time:</strong> {time}</span>
                          </div>
                          <div>
                            <span><strong>Service:</strong> {booking.serviceName || 'N/A'}</span>
                          </div>
                        </div>
                        
                        {booking.bookingDescription && (
                          <div className="mt-3 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-0.5" />
                            <p className="text-sm text-gray-600">
                              <strong>Description:</strong> {booking.bookingDescription}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Created: {new Date(booking.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setViewingBooking(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Booking Details</DialogTitle>
                            </DialogHeader>
                            {viewingBooking && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Booking ID</label>
                                    <p className="text-lg font-semibold">#{viewingBooking.bookingId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Status</label>
                                    <Badge className={getStatusColor(viewingBooking.bookingStatus)}>
                                      {viewingBooking.bookingStatus}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Customer</label>
                                    <p>{viewingBooking.customerName}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Service</label>
                                    <p>{viewingBooking.serviceName || 'N/A'}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Date</label>
                                    <p>{formatDateTime(viewingBooking.bookingDate).date}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Time</label>
                                    <p>{formatDateTime(viewingBooking.bookingDate).time}</p>
                                  </div>
                                </div>
                                {viewingBooking.bookingDescription && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <p className="mt-1 p-3 bg-gray-50 rounded-md">{viewingBooking.bookingDescription}</p>
                                  </div>
                                )}
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Created</label>
                                  <p>{new Date(viewingBooking.createdAt).toLocaleString()}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditBooking(booking)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBooking(booking.bookingId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Booking Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={() => setEditingBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Booking #{editingBooking?.bookingId}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Customer Name</label>
              <Input
                value={editForm.customerName}
                onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Service</label>
              <Select value={editForm.serviceId} onValueChange={(value) => setEditForm(prev => ({ ...prev, serviceId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.service_id} value={service.service_id.toString()}>
                      {service.service_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editForm.bookingDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bookingDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={editForm.bookingTime}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bookingTime: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editForm.bookingStatus} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, bookingStatus: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editForm.bookingDescription}
                onChange={(e) => setEditForm(prev => ({ ...prev, bookingDescription: e.target.value }))}
                placeholder="Enter booking description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingBooking(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBooking}>
                Update Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
