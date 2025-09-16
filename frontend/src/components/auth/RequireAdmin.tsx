// src/components/auth/RequireAdmin.tsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, refreshMe } = useAdmin();
  const [checked, setChecked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async () => {
      await refreshMe();
      setChecked(true);
    })();
  }, [refreshMe]);

  if (!checked) return null; // or a small spinner
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location }} />;

  return <>{children}</>;
};

export default RequireAdmin;
