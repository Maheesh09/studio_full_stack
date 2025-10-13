
import { Camera, Image, Users, FileImage, Book, Contact, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { useCustomer } from "@/contexts/CustomerContext";

const services = [
  {
    icon: Image,
    title: "Photo Printing",
    description: "Any size, any format — premium quality guaranteed. Professional photo printing services with vibrant colors and lasting quality.",
    image: "/printing.png",
    path: "/services/photo-printing",
    alt: "High quality photo printing services - Digital photo prints in various sizes and formats",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Contact,
    title: "Online Passport & ID Photos",
    description: "Instant compliant digital ID solutions. Government-approved passport and visa photos delivered instantly.",
    image: "/passport.jpg",
    path: "/services/passport-photos",
    alt: "Passport photo services - Government compliant ID photos for visa and passport applications",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Users,
    title: "Visa Photos for Any Country",
    description: "Get visa-ready in minutes. Country-specific visa photo requirements met with precision and speed.",
    image: "/visa_photos.png",
    path: "/services/visa-photos",
    alt: "Visa photo services - International visa photos for all countries with specific requirements",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: FileImage,
    title: "Custom Photo Framing",
    description: "Elegant frames tailored to your photos. Premium framing services to preserve and display your memories beautifully.",
    image: "/frames1.png",
    path: "/services/custom-framing",
    alt: "Custom photo framing services - Premium frames for photographs and artwork preservation",
    gradient: "from-amber-500 to-amber-600"
  },
  {
    icon: Clock,
    title: "Photo Restoration",
    description: "Old memories, digitally brought back to life. Expert restoration of damaged, faded, and vintage photographs.",
    image: "/restoration.jpg",
    path: "/services/photo-restoration",
    alt: "Photo restoration services - Repair and restore old, damaged, and faded vintage photographs",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Book,
    title: "Laminating",
    description: "Protect your important documents and photos. Professional laminating services for durability and preservation.",
    image: "/laminating.png",
    path: "/services/laminating",
    alt: "Document laminating services - Protect important documents and certificates with professional lamination",
    gradient: "from-teal-500 to-teal-600"
  },
  {
    icon: Contact,
    title: "Visiting Card Printing",
    description: "Design. Print. Impress. Professional business card design and printing for lasting first impressions.",
    image: "/visiting_card.png",
    path: "/services/visiting-cards",
    alt: "Visiting card printing services - Professional business card design and high-quality printing",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

export const Services = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { customer, isAuthenticated } = useCustomer();

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-studio-gray-50 via-white to-studio-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-studio-gray-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-studio-gray-300/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6 bg-gradient-to-r from-studio-black via-studio-gray-700 to-studio-black bg-clip-text">
            Our Photography Services
          </h2>
          <p className="text-xl text-studio-gray-600 max-w-3xl mx-auto text-balance leading-relaxed">
            Professional photography services tailored to meet all your personal and business needs. From passport photos to custom framing, we deliver excellence.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-studio-black to-studio-gray-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={index} to={service.path} className="block" aria-label={`Learn more about ${service.title}`}>
              <Card 
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover-lift animate-on-scroll group h-full relative overflow-hidden transition-all duration-500 hover:shadow-2xl"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10`}></div>
                
                <CardContent className="p-0 h-full flex flex-col relative z-20">
                  <div className="aspect-video bg-studio-gray-100 overflow-hidden relative">
                    {/* Loading placeholder */}
                    {!loadedImages.has(index) && (
                      <div className="absolute inset-0 bg-gradient-to-br from-studio-gray-200 to-studio-gray-300 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-studio-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    <img 
                      src={service.image}
                      alt={service.alt}
                      title={service.title}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                        loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                      } ${hoveredCard === index ? 'brightness-110' : ''}`}
                      loading={index < 3 ? "eager" : "lazy"}
                      fetchPriority={index < 3 ? "high" : "low"}
                      onLoad={() => handleImageLoad(index)}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <div className="flex items-center mb-4">
                      <div className={`bg-gradient-to-br ${service.gradient} p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`} aria-hidden="true">
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-studio-black group-hover:text-studio-gray-800 transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                    <p className="text-studio-gray-600 leading-relaxed group-hover:text-studio-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                  
                  {/* Bottom border accent */}
                  <div className={`h-1 bg-gradient-to-r ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Booking Section */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-studio-gray-200">
            <h3 className="text-2xl font-playfair font-semibold text-studio-black mb-4">
              Ready to Book a Service?
            </h3>
            <p className="text-studio-gray-600 mb-6 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Choose from our professional services and book your appointment today. We're here to help bring your vision to life."
                : "Please log in to book a service. Create an account or sign in to get started with our professional photography services."
              }
            </p>
            <BookingForm 
              isAuthenticated={isAuthenticated} 
              customerName={customer?.name}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
