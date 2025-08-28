
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { adminSupabase } from '@/integrations/supabase/adminClient';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactsTable } from '@/components/admin/ContactsTable';
import { LogOut, Users } from 'lucide-react';

interface ContactSubmission {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const { logout, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login-secure');
      return;
    }

    fetchData();
    const cleanup = setupRealtimeSubscriptions();
    
    return cleanup;
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      console.log('Fetching contacts with admin client...');
      setLoading(true);
      
      // Fetch contacts using admin client
      const { data: contactsData, error: contactsError } = await adminSupabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Contacts query result:', { 
        count: contactsData?.length || 0, 
        error: contactsError 
      });

      if (contactsError) {
        console.error('Error fetching contacts:', contactsError);
      } else {
        console.log('Successfully fetched contacts:', contactsData?.length || 0);
        setContacts(contactsData || []);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    console.log('Setting up realtime subscriptions for contact submissions...');
    
    const channel = supabase
      .channel('contact-submissions-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contact_submissions'
      }, (payload) => {
        console.log('Contact submissions change received:', payload);
        fetchData();
      })
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions...');
      supabase.removeChannel(channel);
    };
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login-secure');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Submissions Management</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactsTable contacts={contacts} onRefresh={fetchData} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
