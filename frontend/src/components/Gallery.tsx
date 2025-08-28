
import { useState } from "react";

const galleryImages = [
  {
    src: "/inside.png",
    alt: "Professional portrait photography services at Studio Arunaseya - High quality portrait session",
    category: "Portrait",
    title: "Professional Portrait Photography"
  },
  {
    src: "/printer.png",
    alt: "High quality photo printing services - Digital photo prints in various sizes and formats",
    category: "Printing",
    title: "Photo Printing"
  },
  {
    src: "/frames1.png",
    alt: "Custom photo framing samples - Premium framing services for photographs",
    category: "Framing",
    title: "Custom Photo Framing"
  },
  {
    src: "/printing2.png",
    alt: "High quality photo printing services - Digital photo prints in various sizes and formats",
    category: "Printing",
    title: "Photo Printing"
  },
  {
    src: "/arunaseya.png",
    alt: "Studio Arunaseya professional photography workspace and equipment setup",
    category: "Studio",
    title: "Professional Photography Studio"
  },
  {
    src: "/printing.png",
    alt: "High quality photo printing services - Digital photo prints in various sizes and formats",
    category: "Printing",
    title: "Photo Printing"
  }
];

export const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index));
  };

  return (
    <section id="gallery" className="py-20 bg-studio-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6">
            Sample Gallery
          </h2>
          <p className="text-xl text-studio-gray-600 max-w-3xl mx-auto text-balance">
            Explore our work and see the quality that sets us apart in professional photography services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg hover-lift animate-on-scroll cursor-pointer group"
              onClick={() => setSelectedImage(image.src)}
            >
              <div className="relative h-full">
                {/* Loading placeholder */}
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 bg-studio-gray-200 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-studio-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                <img 
                  src={image.src}
                  alt={image.alt}
                  title={image.title}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(index)}
                  fetchPriority={index < 3 ? "high" : "low"}
                />
                <div className="absolute inset-0 bg-studio-black/0 group-hover:bg-studio-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-studio-black/80 px-4 py-2 rounded-lg">
                    {image.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Modal for enlarged image view */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-studio-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-label="Gallery image viewer"
          >
            <div className="max-w-4xl max-h-full">
              <img 
                src={selectedImage}
                alt="Enlarged gallery image"
                className="max-w-full max-h-full object-contain rounded-lg"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
