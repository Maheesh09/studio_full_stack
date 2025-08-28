import { useState } from "react";
import { MapPin, Phone, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Contact = () => {
  const [contactForm, setContactForm] = useState({
    fullName: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWhatsApp = () => {
    window.open("https://wa.me/+94702284833?text=Hi%2C%20I%20want%20to%20know%20more%20about%20your%20services.", "_blank");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          full_name: contactForm.fullName,
          phone: contactForm.phone,
          message: contactForm.message
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });

      // Reset form
      setContactForm({
        fullName: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-studio-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-6">
            Visit Our Studio
          </h2>
          <p className="text-xl text-studio-gray-600 max-w-3xl mx-auto text-balance">
            Ready to capture your perfect moment? Get in touch with us today
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 animate-on-scroll">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-studio-black p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-studio-black mb-2">Location</h3>
                    <p className="text-studio-gray-600">
                      17, Eksath Mawatha, Sinharamulla<br />
                      Kelaniya, 11600
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-studio-black p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-studio-black mb-2">Contact</h3>
                    <p className="text-studio-gray-600 mb-2">
                      Phone: +94 70 228 4833
                    </p>
                    <p className="text-studio-gray-600">
                      Email: arunaseya48@gmail.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-studio-black p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-studio-black mb-2">Working Hours</h3>
                    <div className="text-studio-gray-600 space-y-1">
                      <p>Monday - Sunday: 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
          </div>
          
          {/* Contact Form */}
          <div className="animate-on-scroll">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-studio-black mb-6">Send us a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input 
                      type="text" 
                      placeholder="Enter your full name"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={contactForm.fullName}
                      onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="Enter your phone number"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">
                      Message
                    </label>
                    <textarea 
                      rows={4}
                      placeholder="Tell us about your requirements"
                      className="w-full px-3 py-2 border border-studio-gray-300 rounded-md focus:outline-none focus:border-studio-black resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-studio-black hover:bg-studio-gray-800 text-white py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Google Maps */}
        <div className="mt-12 animate-on-scroll">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d247.53028753858567!2d79.9166868!3d6.9520211!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2582620d31761%3A0xc696b81a1da9d95e!2sStudio%20Arunaseya!5e0!3m2!1sen!2slk!4v1748073317499!5m2!1sen!2slk" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
