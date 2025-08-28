import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Login = () => {
  useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Placeholder for auth integration
      await new Promise((res) => setTimeout(res, 600));
      toast({ title: "Logged in", description: "Welcome back!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Login failed", description: "Please try again.", variant: "destructive" });
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
            <h1 className="text-4xl md:text-5xl font-playfair font-semibold text-studio-black mb-4">Customer Login</h1>
            <p className="text-studio-gray-600 max-w-2xl mx-auto">Sign in to manage your bookings and preferences.</p>
          </div>

          <div className="max-w-xl mx-auto animate-on-scroll">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Password</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="border-studio-gray-300 focus:border-studio-black"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-studio-black hover:bg-studio-gray-800 text-white py-3 text-lg" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Login"}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-studio-gray-600">
                  Not registered yet? <Link to="/register" className="text-studio-black font-medium hover:underline">Create an account</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;


