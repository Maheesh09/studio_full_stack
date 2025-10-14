import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, MessageSquare } from 'lucide-react';

interface Service {
  service_id: number;
  service_name: string;
  service_price?: number;
  service_description?: string;
}

interface BookingFormProps {
  isAuthenticated: boolean;
  customerName?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ isAuthenticated, customerName }) => {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    customerName: customerName || '',
    serviceId: '',
    bookingDate: '',
    bookingTime: '',
    bookingDescription: ''
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  // Load services when dialog opens
  useEffect(() => {
    if (open && services.length === 0) {
      loadServices();
    }
  }, [open]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/services`, { 
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data.content || []);
      } else {
        toast({
          title: "Failed to load services",
          description: "Could not fetch available services. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load services. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to make a booking.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerName.trim() || !formData.serviceId || !formData.bookingDate || !formData.bookingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Combine date and time
    const bookingDateTime = new Date(`${formData.bookingDate}T${formData.bookingTime}`);
    
    // Check if the booking date is in the future
    if (bookingDateTime <= new Date()) {
      toast({
        title: "Invalid Date",
        description: "Booking date and time must be in the future.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          serviceId: parseInt(formData.serviceId),
          bookingDate: bookingDateTime.toISOString(),
          bookingDescription: formData.bookingDescription.trim() || null
        })
      });

      if (res.ok) {
        toast({
          title: "Booking Created!",
          description: "Your booking has been submitted successfully. We'll contact you soon.",
        });
        setOpen(false);
        // Reset form
        setFormData({
          customerName: customerName || '',
          serviceId: '',
          bookingDate: '',
          bookingTime: '',
          bookingDescription: ''
        });
      } else if (res.status === 401) {
        toast({
          title: "Login Required",
          description: "Please log in to make a booking.",
          variant: "destructive",
        });
      } else {
        const errorData = await res.json().catch(() => null);
        toast({
          title: "Booking Failed",
          description: errorData?.message || "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isAuthenticated && newOpen) {
      toast({
        title: "Login Required",
        description: "Please log in to make a booking.",
        variant: "destructive",
      });
      return;
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="bg-studio-black hover:bg-studio-gray-800 text-white px-8 py-3 text-lg font-medium mt-8"
          disabled={!isAuthenticated}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Add a Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair font-semibold text-studio-black">
            Book a Service
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name */}
          <div className="space-y-2">
            <label htmlFor="customerName" className="text-sm font-medium text-studio-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Your Name *
            </label>
            <Input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full"
            />
          </div>

          {/* Service Selection */}
          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium text-studio-gray-700">
              Select Service *
            </label>
            <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={loading ? "Loading services..." : "Choose a service"} />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.service_id} value={service.service_id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{service.service_name}</span>
                      {service.service_price && (
                        <span className="text-sm text-studio-gray-600">
                          Rs {service.service_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="bookingDate" className="text-sm font-medium text-studio-gray-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date *
              </label>
              <Input
                id="bookingDate"
                type="date"
                value={formData.bookingDate}
                onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bookingTime" className="text-sm font-medium text-studio-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time *
              </label>
              <Input
                id="bookingTime"
                type="time"
                value={formData.bookingTime}
                onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="bookingDescription" className="text-sm font-medium text-studio-gray-700 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Additional Details (Optional)
            </label>
            <Textarea
              id="bookingDescription"
              value={formData.bookingDescription}
              onChange={(e) => handleInputChange('bookingDescription', e.target.value)}
              placeholder="Tell us more about your requirements..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-studio-black hover:bg-studio-gray-800 text-white"
            >
              {submitting ? "Creating Booking..." : "Create Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
