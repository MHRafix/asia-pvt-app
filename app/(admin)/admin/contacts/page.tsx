'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Mail, Phone, User, Loader, Search, Eye, MessageSquare, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  createdAt: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500',
};

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts');
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      console.error('[v0] Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
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
        if (selectedContact?._id === id) {
          setSelectedContact({ ...selectedContact, status: status as Contact['status'] });
        }
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const response = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Message deleted!');
        fetchContacts();
        setDrawerOpen(false);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete message');
    }
  };

  const viewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setDrawerOpen(true);
    // Auto-mark as read if new
    if (contact.status === 'new') {
      // Optionally mark as read automatically
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
    archived: contacts.filter((c) => c.status === 'archived').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'bg-muted' },
          { label: 'New', value: stats.new, color: 'bg-blue-100 dark:bg-blue-950/30' },
          { label: 'Replied', value: stats.replied, color: 'bg-green-100 dark:bg-green-950/30' },
          { label: 'Archived', value: stats.archived, color: 'bg-gray-100 dark:bg-gray-950/30' },
        ].map((stat) => (
          <Card key={stat.label} className="border-0 shadow-soft">
            <CardContent className={`p-4 ${stat.color} rounded-xl`}>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredContacts.length === 0 ? (
        <Card className="border-0 shadow-soft">
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' ? 'No messages match your filters' : 'No messages yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredContacts.map((contact) => (
            <Card
              key={contact._id}
              className={`border-0 shadow-soft hover:shadow-md transition-shadow cursor-pointer ${
                contact.status === 'new' ? 'ring-2 ring-primary/20' : ''
              }`}
              onClick={() => viewContact(contact)}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 text-pink-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <Badge className={`${statusColors[contact.status]} border-0 text-xs`}>
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{contact.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(contact.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={contact.status}
                      onValueChange={(value) => handleStatusChange(contact._id, value)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(contact._id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Message Details</SheetTitle>
            <SheetDescription>View contact message and update status</SheetDescription>
          </SheetHeader>

          {selectedContact && (
            <div className="space-y-6 py-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-pink-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h3>
                  <Badge className={`${statusColors[selectedContact.status]} border-0`}>
                    {selectedContact.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedContact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {selectedContact.phone}
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-2">Message</p>
                  <p className="text-foreground whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Received</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedContact.createdAt), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Update Status</p>
                  <Select
                    value={selectedContact.status}
                    onValueChange={(value) => handleStatusChange(selectedContact._id, value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 gap-2"
                  onClick={() => window.open(`mailto:${selectedContact.email}`, '_blank')}
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </Button>
              </div>
            </div>
          )}

          <SheetFooter className="border-t border-border pt-4">
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            {selectedContact && (
              <Button variant="destructive" onClick={() => handleDelete(selectedContact._id)}>
                Delete
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
