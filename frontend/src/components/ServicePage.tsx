import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

interface ServicePageProps {
  title: string;
  description: string;
  image: string;
  details: string[];
  pricing?: string;
  turnaround?: string;
}

export const ServicePage = ({ 
  title, 
  description, 
  image, 
  details,
  pricing,
  turnaround 
}: ServicePageProps) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/+94702284833?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services.", "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 bg-studio-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-4">
                  {title}
                </h1>
                <p className="text-xl text-studio-gray-600 mb-6">
                  {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 text-lg font-medium"
                    onClick={handleWhatsApp}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-xl">
                <img 
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-playfair font-semibold text-studio-black mb-8">
              Service Details
            </h2>
            <div className="bg-white shadow-lg rounded-lg p-8">
              <div className="space-y-6">
                {details.map((detail, index) => (
                  <p key={index} className="text-lg text-studio-gray-600">
                    {detail}
                  </p>
                ))}
              </div>

              {(pricing || turnaround) && (
                <div className="mt-12 grid md:grid-cols-2 gap-8 border-t border-studio-gray-200 pt-8">
                  {pricing && (
                    <div>
                      <h3 className="text-xl font-semibold text-studio-black mb-3">
                        Pricing
                      </h3>
                      <p className="text-studio-gray-600">{pricing}</p>
                    </div>
                  )}
                  
                  {turnaround && (
                    <div>
                      <h3 className="text-xl font-semibold text-studio-black mb-3">
                        Turnaround Time
                      </h3>
                      <p className="text-studio-gray-600">{turnaround}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};
