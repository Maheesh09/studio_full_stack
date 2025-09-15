import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const Profile = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!API_BASE) return;
      try {
        const res = await fetch(`${API_BASE}/api/customers/me`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setMe({ name: data.name, email: data.email });
        } else if (res.status === 401) {
          window.location.href = "/login";
        } else {
          toast({ title: "Error", description: `Failed to load profile (${res.status})`, variant: "destructive" });
        }
      } catch {
        toast({ title: "Network error", description: "Check your connection.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [toast]);

  const logout = async () => {
    if (!API_BASE) return;
    await fetch(`${API_BASE}/api/customers/logout`, { method: "POST", credentials: "include" });
    localStorage.removeItem("customer");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-8">
                {loading ? (
                  <div>Loading...</div>
                ) : me ? (
                  <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">Your Profile</h1>
                    <div><span className="font-medium">Name:</span> {me.name}</div>
                    <div><span className="font-medium">Email:</span> {me.email}</div>
                    <Button onClick={logout} className="mt-4 bg-studio-black">Logout</Button>
                  </div>
                ) : (
                  <div>No profile data</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Profile;