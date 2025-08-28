
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PhotoPrinting from "./pages/PhotoPrinting";
import PassportPhotos from "./pages/PassportPhotos";
import VisaPhotos from "./pages/VisaPhotos";
import CustomFraming from "./pages/CustomFraming";
import PhotoRestoration from "./pages/PhotoRestoration";
import Laminating from "./pages/Laminating";
import VisitingCards from "./pages/VisitingCards";
import { AdminProvider } from "./contexts/AdminContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Registration from "./pages/Registration";
import Login from "./pages/Login";

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
      <AdminProvider>
        <BrowserRouter>
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
            
            {/* Hidden Admin Routes */}
            <Route path="/admin-login-secure" element={<AdminLogin />} />
            <Route path="/system-management-panel-x7k9p" element={<AdminDashboard />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
