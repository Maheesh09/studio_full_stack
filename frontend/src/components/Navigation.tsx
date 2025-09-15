import { useState, useEffect } from "react";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCustomer } from "@/contexts/CustomerContext";

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isAuthenticated,customer,logout } = useCustomer();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/#home", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Services" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/#contact", label: "Contact" },
  ];

  const handleContactUs = () => {
    if (location.pathname !== '/') {
      navigate('/#contact');
    } else {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    const isInPageLink = href.startsWith('/#');

    if (isInPageLink) {
      if (location.pathname !== '/') {
        navigate(href);
      } else {
        const sectionId = href.split('#')[1];
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      navigate(href);
    }

    setIsMobileMenuOpen(false);
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/+94702284833?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services.", "_blank");
  };

  const handleFacebook = () => {
    window.open("https://www.facebook.com/arunaseya.01", "_blank");
  };

  const handleTikTok = () => {
    window.open("https://www.tiktok.com/@studioaruna", "_blank");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-studio-gray-200' 
        : 'bg-gradient-to-r from-white/90 to-studio-gray-50/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/favicon.ico"
                  alt="Studio Arunaseya" 
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-contain ring-2 ring-studio-gray-200 group-hover:ring-studio-black transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20"></div>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-playfair font-semibold text-studio-black group-hover:text-studio-gray-700 transition-colors duration-300">
                  Studio Arunaseya
                </h1>
                <p className="text-xs text-studio-gray-500 font-medium hidden sm:block">Professional Photography</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className="text-studio-gray-700 hover:text-studio-black transition-all duration-200 font-medium relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-studio-black transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Desktop Actions & Social Section */}
                    {/* Desktop Actions & Social Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Phone Number */}
            <a 
              href="tel:+94702284833" 
              className="flex items-center text-studio-black hover:text-studio-gray-800 transition-all duration-300 bg-studio-gray-50 hover:bg-studio-gray-100 px-3 py-2 rounded-lg group"
            >
              <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold text-base">+94 70 228 4833</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center space-x-2">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="p-2 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                title="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                </svg>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="p-2 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                title="Visit our Facebook page"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              {/* TikTok */}
              <button
                onClick={handleTikTok}
                className="p-2 rounded-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md"
                title="Follow us on TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button 
                  className="bg-studio-gray-900 hover:bg-studio-gray-800 text-white px-5 py-2.5 font-medium"
                  onClick={() => navigate("/profile")}
                >
                  Your Profile
                </Button>
                <Button 
                  className="bg-studio-black/80 hover:bg-studio-black text-white px-5 py-2.5 font-medium"
                  onClick={async () => { await logout(); navigate("/"); }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-studio-black hover:bg-studio-gray-800 text-white px-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-studio-gray-100 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-studio-black" />
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-studio-gray-200 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavigation(link.href)}
                    className="block w-full text-left px-4 py-3 text-studio-gray-700 hover:text-studio-black hover:bg-studio-gray-50 rounded-lg transition-colors duration-200 font-medium"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Mobile Actions & Social */}
              <div className="pt-4 border-t border-studio-gray-200 space-y-4">
                {/* Phone Number */}
                <a 
                  href="tel:+94702284833" 
                  className="flex items-center justify-center text-studio-black hover:text-studio-gray-800 transition-colors bg-studio-gray-50 hover:bg-studio-gray-100 px-4 py-3 rounded-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <span className="font-semibold text-base">+94 70 228 4833</span>
                </a>

                {/* Social Icons */}
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center space-x-1 bg-[#25D366] hover:bg-[#128C7E] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
                    </svg>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>

                  <button
                    onClick={handleFacebook}
                    className="flex items-center space-x-1 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3 py-2 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm font-medium">Facebook</span>
                  </button>

                  <button
                    onClick={handleTikTok}
                    className="flex items-center space-x-1 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    <span className="text-sm font-medium">TikTok</span>
                  </button>
                </div>

                  {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button
                      className="w-full bg-studio-gray-900 hover:bg-studio-gray-800 text-white py-3 font-medium"
                      onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                    >
                      Your Profile
                    </Button>

                    <Button
                      className="w-full bg-studio-black/80 hover:bg-studio-black text-white py-3 font-medium"
                      onClick={async () => { await logout(); setIsMobileMenuOpen(false); navigate("/"); }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-studio-black hover:bg-studio-gray-800 text-white py-3 font-medium"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
