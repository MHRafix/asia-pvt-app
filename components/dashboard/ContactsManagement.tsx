'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      const data = await response.json();
      if (data.success) setContacts(data.data);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Status updated!');
        fetchContacts();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Message deleted!');
        fetchContacts();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete message');
    }
  };

  if (loading) return <div className='text-center py-8'>Loading messages...</div>;

  return (
    <div className='space-y-4'>
      <h3 className='text-xl font-bold text-foreground mb-6'>Contact Messages</h3>
      <div className='grid gap-4'>
        {contacts.map((contact) => (
          <Card key={contact._id} className='border-0 shadow-soft'>
            <CardContent className='p-4'>
              <div className='space-y-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='font-bold text-foreground'>
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className='text-sm text-muted-foreground'>{contact.email}</p>
                    <p className='text-sm text-muted-foreground'>{contact.phone}</p>
                  </div>
                  <div className='flex gap-2'>
                    <select
                      value={contact.status}
                      onChange={(e) => updateStatus(contact._id, e.target.value)}
                      className='text-xs rounded px-2 py-1 bg-muted border border-border'
                    >
                      <option value='new'>New</option>
                      <option value='replied'>Replied</option>
                      <option value='archived'>Archived</option>
                    </select>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDelete(contact._id)}
                    >
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                  </div>
                </div>
                <p className='text-sm text-foreground p-3 bg-muted rounded'>
                  {contact.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
