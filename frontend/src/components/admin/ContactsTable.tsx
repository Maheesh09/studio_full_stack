
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';

interface ContactSubmission {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  created_at: string;
}

interface ContactsTableProps {
  contacts: ContactSubmission[];
  onRefresh: () => void;
}

export const ContactsTable: React.FC<ContactsTableProps> = ({ contacts, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    contact.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCsv = () => {
    const headers = ['Name', 'Phone', 'Message', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact => [
        `"${contact.full_name}"`,
        `"${contact.phone}"`,
        `"${contact.message.replace(/"/g, '""')}"`,
        `"${format(new Date(contact.created_at), 'yyyy-MM-dd HH:mm:ss')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button onClick={exportToCsv} variant="outline">
            Export CSV
          </Button>
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message Preview</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.full_name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                <TableCell>{format(new Date(contact.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="font-semibold">Name:</label>
                          <p>{contact.full_name}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Phone:</label>
                          <p>{contact.phone}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Message:</label>
                          <p className="whitespace-pre-wrap">{contact.message}</p>
                        </div>
                        <div>
                          <label className="font-semibold">Received:</label>
                          <p>{format(new Date(contact.created_at), 'MMMM dd, yyyy at HH:mm')}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No contact submissions found.
        </div>
      )}
    </div>
  );
};
