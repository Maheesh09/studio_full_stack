import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, ""); // e.g. http://localhost:8080

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

    if (!API_BASE) {
      toast({
        title: "Missing API base URL",
        description: "Set VITE_API_BASE_URL in your frontend .env and restart the dev server.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/customers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include cookies
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Persist a simple session (swap to JWT later if you want)
        localStorage.setItem("customer", JSON.stringify(data));
        toast({ title: "Logged in", description: `Welcome back, ${data.name}!` });
        window.location.href = "/profile"; // simple way to refresh and redirect
        // e.g. navigate("/dashboard") if you have a route
      } else if (res.status === 401) {
        toast({ title: "Invalid credentials", description: "Check your email or password.", variant: "destructive" });
      } else if (res.status === 404) {
        toast({ title: "Account not found", description: "Create an account first.", variant: "destructive" });
      } else if (res.status === 400) {
        const err = await res.json().catch(() => null);
        toast({
          title: "Fix your input",
          description: err?.fields ? JSON.stringify(err.fields) : "Bad request",
          variant: "destructive",
        });
      } else {
        toast({ title: "Login failed", description: `Server returned ${res.status}`, variant: "destructive" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Network error", description: "Check your connection and try again.", variant: "destructive" });
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
              Customer Login
            </h1>
            <p className="text-studio-gray-600 max-w-2xl mx-auto">
              Sign in to manage your bookings and preferences.
            </p>
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
                      minLength={8} // match backend validation
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-studio-black hover:bg-studio-gray-800 text-white py-3 text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Login"}
                  </Button>
                </form>

                {/* ✅ keep navigation to registration */}
                <div className="mt-6 text-center text-sm text-studio-gray-600">
                  Not registered yet?{" "}
                  <Link to="/register" className="text-studio-black font-medium hover:underline">
                    Create an account
                  </Link>
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
