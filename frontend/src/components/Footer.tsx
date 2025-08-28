import { Phone, MessageSquare, Facebook } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-studio-black text-white py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-studio-gray-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-studio-gray-800 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Studio Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4 group">
              <img 
                src="/favicon.ico"
                alt="Studio Arunaseya Logo" 
                className="w-10 h-10 mr-3 rounded-full object-contain bg-white transform transition-transform duration-300 group-hover:scale-110"
              />
              <h3 className="text-2xl font-playfair font-semibold group-hover:text-studio-gray-300 transition-colors">Studio Arunaseya</h3>
            </div>
            <p className="text-studio-gray-400 mb-4 leading-relaxed">
              Your memories, professionally preserved. We provide premium photography 
              services for all your personal and professional needs.
            </p>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/arunaseya.01" target="_blank" rel="noopener noreferrer" className="text-studio-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@studioaruna" target="_blank" rel="noopener noreferrer" className="text-studio-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="https://wa.me/+94702284833" className="text-studio-gray-400 hover:text-white transition-colors transform hover:scale-110 duration-300">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 group">
              <span className="relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-studio-gray-400 hover:text-white transition-colors inline-block transform hover:translate-x-1 duration-300">Home</a>
              </li>
              <li>
                <a href="#services" className="text-studio-gray-400 hover:text-white transition-colors inline-block transform hover:translate-x-1 duration-300">Services</a>
              </li>
              <li>
                <a href="#gallery" className="text-studio-gray-400 hover:text-white transition-colors inline-block transform hover:translate-x-1 duration-300">Gallery</a>
              </li>
              <li>
                <a href="#contact" className="text-studio-gray-400 hover:text-white transition-colors inline-block transform hover:translate-x-1 duration-300">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 group">
              <span className="relative inline-block">
                Contact Info
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center group">
                <Phone className="w-4 h-4 mr-3 text-studio-gray-400 group-hover:text-white transition-colors" />
                <span className="text-studio-gray-400 group-hover:text-white transition-colors">+94 70 228 4833</span>
              </div>
              <div className="text-studio-gray-400 text-sm group-hover:text-white transition-colors">
                Monday - Sunday: 8:00 AM - 8:00 PM<br />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-studio-gray-800 mt-8 pt-8 text-center">
          <p className="text-studio-gray-400">
            © {currentYear} Studio Arunaseya. All rights reserved.
          </p>
          <p className="text-studio-gray-500 text-sm mt-2">
            Website crafted with ❤️ by{" "}
            <a 
              href="https://maheesh.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-studio-gray-400 hover:text-white transition-colors inline-block transform hover:scale-105 duration-300"
            >
              CodeNerve
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
