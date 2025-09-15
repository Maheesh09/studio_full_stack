import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Helper: client-side constraints matching your DB/api
const NAME_MAX = 20; // customers.customer_name VARCHAR(20)
const EMAIL_MAX = 45; // customers.customer_email VARCHAR(45)
const PHONE_MAX = 45; // customers.customer_phone VARCHAR(45)
const PASSWORD_MIN = 8; // server requires 8..72

// Phone: numbers, spaces, + - ( ) only (same as backend regex)
const PHONE_REGEX = /^[0-9+\-()\s]{0,45}$/;


export default function Registration() {
useScrollAnimation();
const { toast } = useToast();
const [isSubmitting, setIsSubmitting] = useState(false);
const [form, setForm] = useState({
fullName: "",
email: "",
phone: "",
password: "",
});
const [errors, setErrors] = useState<{ [k: string]: string }>({});


const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setForm((prev) => ({ ...prev, [name]: value }));
setErrors((prev) => ({ ...prev, [name]: "" }));
};


const validate = () => {
const e: { [k: string]: string } = {};
if (!form.fullName.trim()) e.fullName = "Name is required";
if (form.fullName.length > NAME_MAX) e.fullName = `Max ${NAME_MAX} characters`;


if (!form.email.trim()) e.email = "Email is required";
if (form.email.length > EMAIL_MAX) e.email = `Max ${EMAIL_MAX} characters`;
// Let the browser also validate email pattern via type="email"


if (!form.phone.trim()) e.phone = "Phone is required";
if (form.phone.length > PHONE_MAX) e.phone = `Max ${PHONE_MAX} characters`;
if (!PHONE_REGEX.test(form.phone)) e.phone = "Only digits, space, + - ( )";


if (!form.password) e.password = "Password is required";
if (form.password.length < PASSWORD_MIN) e.password = `Min ${PASSWORD_MIN} characters`;


setErrors(e);
return Object.keys(e).length === 0;
};


const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
 if (!validate()) return;
setIsSubmitting(true);


try {
const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/customers/register`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
// Map UI → API field names
name: form.fullName.trim(),
email: form.email.trim(),
phone: form.phone.trim(),
password: form.password,
}),
});


if (!res.ok) {
      if (res.status === 409) throw new Error("Email already in use");
      const msg = await res.text();
      throw new Error(msg || "Request failed");
    }

    toast({ title: "Registration successful", description: "Your account has been created." });
    setForm({ fullName: "", email: "", phone: "", password: "" });
  } catch (err: any) {
    console.error(err);
    toast({
      title: "Registration failed",
      description: err?.message || "Please try again.",
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
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">
                      Customer Name
                    </label>
                    <Input
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className={`border-studio-gray-300 focus:border-studio-black ${errors.fullName ? 'border-red-500' : ''}`}
                      value={form.fullName}
                      onChange={onChange}
                      required
                      maxLength={NAME_MAX}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Email</label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`border-studio-gray-300 focus:border-studio-black ${errors.email ? 'border-red-500' : ''}`}
                      value={form.email}
                      onChange={onChange}
                      required
                      maxLength={EMAIL_MAX}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Phone</label>
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className={`border-studio-gray-300 focus:border-studio-black ${errors.phone ? 'border-red-500' : ''}`}
                      value={form.phone}
                      onChange={onChange}
                      required
                      pattern={PHONE_REGEX.source}
                      maxLength={PHONE_MAX}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-studio-gray-700 mb-2">Password</label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      className={`border-studio-gray-300 focus:border-studio-black ${errors.password ? 'border-red-500' : ''}`}
                      value={form.password}
                      onChange={onChange}
                      required
                      minLength={PASSWORD_MIN}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
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
}