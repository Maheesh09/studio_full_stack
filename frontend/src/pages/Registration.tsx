import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Registration = () => {
  useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Placeholder: integrate with backend (e.g., Supabase auth) later
      await new Promise((res) => setTimeout(res, 800));

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });

      setForm({ fullName: "", email: "", phone: "", password: "" });
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="pt-24 pb-20 bg-studio-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-4">
              Create Your Account
            </h1>
            <p className="text-studio-gray-600 max-w-2xl mx-auto">
              Register to save your details and speed up future bookings.
            </p>
          </div>

          <div className="max-w-3xl mx-auto animate-on-scroll">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Customer Name</label>
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Phone</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Password</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <Button
                      type="submit"
                      className="w-full bg-studio-black hover:bg-studio-gray-800 text-white py-3 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Register"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Registration;


