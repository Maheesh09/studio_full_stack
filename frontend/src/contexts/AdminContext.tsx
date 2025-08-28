
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  username: string;
  sessionToken: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        console.log('Restored admin session:', parsed);
        setAdminUser(parsed);
      } catch (error) {
        console.error('Error parsing saved admin session:', error);
        localStorage.removeItem('admin_session');
      }
    }

    // Set session timeout (30 minutes)
    const sessionTimeout = setTimeout(() => {
      console.log('Admin session timed out');
      logout();
    }, 30 * 60 * 1000);

    return () => clearTimeout(sessionTimeout);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting admin login for username:', username);
      
      const response = await fetch('https://dfivsenfhmghxscyapvv.supabase.co/functions/v1/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmaXZzZW5maG1naHhzY3lhcHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwNjYzNDMsImV4cCI6MjA2MzY0MjM0M30.6_fI_tD_7THNfv1rdg-ViaRR2YhDdpRHZrGzK9tSC8I`
        },
        body: JSON.stringify({ username, password })
      });

      console.log('Admin auth response status:', response.status);
      const data = await response.json();
      console.log('Admin auth response data:', data);

      if (data.success) {
        const adminData = {
          id: data.adminId,
          username: data.username,
          sessionToken: data.sessionToken
        };
        setAdminUser(adminData);
        localStorage.setItem('admin_session', JSON.stringify(adminData));
        console.log('Admin login successful:', adminData);
        return true;
      } else {
        console.error('Admin login failed:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Admin logout');
    setAdminUser(null);
    localStorage.removeItem('admin_session');
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      login,
      logout,
      isAuthenticated: !!adminUser
    }}>
      {children}
    </AdminContext.Provider>
  );
};
