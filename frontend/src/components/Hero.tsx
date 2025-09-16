
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of hero images to cycle through
  const heroImages = ['/hero3.jpg', '/hero4.jpg', '/hero5.jpg', '/hero6.jpg'];
  
  // Auto-advance the slider every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-studio-gray-50 via-white to-studio-gray-100 pt-20">
      {/* Image Slider Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        ))}
      </div>
      
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-studio-gray-200/30 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-studio-gray-300/20 rounded-full blur-2xl animate-float-reverse"></div>
      <div className="absolute top-1/3 right-20 w-16 h-16 bg-studio-black/10 rounded-full blur-lg animate-float-slow"></div>
      
      <div className="container mx-auto px-4 text-center relative z-30">
        <div className="max-w-4xl mx-auto">
          {/* Logo Area with enhanced styling */}
          <div className="mb-12 flex items-center justify-center animate-on-scroll">
            {!logoLoaded && (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/80 rounded-full animate-pulse shadow-xl"></div>
            )}
            <div className="relative">
              <img 
                src="/favicon.ico"
                alt="Studio Arunaseya Logo - Professional Photography Studio" 
                className={`w-24 h-24 md:w-32 md:h-32 object-contain rounded-full shadow-2xl transition-all duration-500 hover:scale-110 bg-white/90 p-2 ${
                  logoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="eager"
                fetchPriority="high"
                onLoad={() => setLogoLoaded(true)}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
              <div className="absolute -inset-2 rounded-full bg-white/40 blur-md -z-10 animate-pulse-slow"></div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/80 p-6 md:p-10 mx-auto animate-on-scroll delay-150">
            <h1 className="text-5xl md:text-7xl font-playfair font-semibold text-studio-black mb-4 text-balance drop-shadow-sm">
              Studio Arunaseya
            </h1>
            <p className="text-xl md:text-2xl text-studio-black mb-6 font-light text-balance drop-shadow-sm">
              Your Memories. Professionally Preserved.
            </p>
            <p className="text-lg text-studio-black mb-4 md:mb-6 max-w-3xl mx-auto text-balance leading-relaxed drop-shadow-sm">
              Premium photography services for all your personal and professional needs. From passport photos to treasured memories, we bring your vision to life with exceptional quality and attention to detail.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-on-scroll delay-700 mt-8">
            <Button 
              size="lg" 
              className="bg-studio-black hover:bg-studio-gray-800 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover-lift hover:shadow-2xl relative overflow-hidden group shadow-xl"
              onClick={() => scrollToSection("services")}
              aria-label="View our photography services"
            >
              <span className="relative z-10">View Our Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-studio-gray-700 to-studio-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-studio-black text-studio-black hover:bg-studio-black hover:text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover-lift hover:shadow-xl backdrop-blur-sm bg-white/90 shadow-xl"
              onClick={() => scrollToSection("contact")}
              aria-label="Contact us for photography services"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
      
      {/* Slider Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white shadow-lg scale-110' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-studio-gray-400 to-transparent animate-on-scroll delay-1000"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/50 to-transparent"></div>
    </section>
  );
};
