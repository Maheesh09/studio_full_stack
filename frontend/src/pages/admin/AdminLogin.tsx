// src/pages/admin/AdminLogin.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const AdminLogin: React.FC = () => {
  const { login } = useAdmin();
  const nav = useNavigate();
  const location = useLocation() as any;
  const [nic, setNic] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError(null);
  try {
    const ok = await login(nic.trim(), password);
    if (ok) {
      const redirectTo = (location as any)?.state?.from?.pathname || "/admin";
      nav(redirectTo, { replace: true });
    } else {
      setError("Invalid NIC or password");
    }
  } catch {
    setError("Unable to reach server. Check API URL and CORS.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-2xl p-6 shadow">
        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <div className="space-y-1">
          <label className="text-sm">Admin NIC</label>
          <input
            className="w-full border rounded-md p-2"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            placeholder="991234567V"
            autoComplete="username"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Password</label>
          <input
            className="w-full border rounded-md p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={submitting}
          className="w-full rounded-md bg-black text-white py-2 disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
