// src/pages/admin/ServicesPage.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Service = {
  service_id: number;
  service_name: string;
  service_price: number | null;
  created_at?: string | null;
};

const ServicesPage = () => {
  const [services] = useState<Service[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <Button>Add New Service</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No services found. Add services to manage your offerings.
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.service_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{service.service_name}</h3>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Service ID:</strong> #{service.service_id}</p>
                        <p><strong>Price:</strong> {service.service_price ? `Rs. ${service.service_price}` : 'Price on request'}</p>
                        {service.created_at && (
                          <p><strong>Created:</strong> {new Date(service.created_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        Active
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

export default ServicesPage;
