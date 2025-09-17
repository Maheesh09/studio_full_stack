
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhotoPrinting from "./pages/PhotoPrinting";
import PassportPhotos from "./pages/PassportPhotos";
import VisaPhotos from "./pages/VisaPhotos";
import CustomFraming from "./pages/CustomFraming";
import PhotoRestoration from "./pages/PhotoRestoration";
import Laminating from "./pages/Laminating";
import VisitingCards from "./pages/VisitingCards";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

import CustomerProfile from "./pages/CustomerProfile";
import { CustomerProvider } from "./contexts/CustomerContext";

import { AdminProvider } from "@/contexts/AdminContext";
import RequireAdmin from "@/components/auth/RequireAdmin";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import AdminLayout from "./pages/admin/AdminLayout";
import CustomersPage from "./pages/admin/CustomersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import ServicesPage from "./pages/admin/ServicesPage";
import SuppliersPage from "./pages/admin/SuppliersPage";
import BookingsPage from "./pages/admin/BookingsPage";



// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
        <CustomerProvider>
        <BrowserRouter>
        <AdminProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services/photo-printing" element={<PhotoPrinting />} />
            <Route path="/services/passport-photos" element={<PassportPhotos />} />
            <Route path="/services/visa-photos" element={<VisaPhotos />} />
            <Route path="/services/custom-framing" element={<CustomFraming />} />
            <Route path="/services/photo-restoration" element={<PhotoRestoration />} />
            <Route path="/services/laminating" element={<Laminating />} />
            <Route path="/services/visiting-cards" element={<VisitingCards />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<CustomerProfile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={<RequireAdmin><AdminLayout /></RequireAdmin>}
            >
              <Route index element={<Navigate to="customers" replace />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="suppliers" element={<SuppliersPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AdminProvider>
        </BrowserRouter>
        </CustomerProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
