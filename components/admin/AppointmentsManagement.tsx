'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
}

export default function AppointmentsManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      const data = await response.json();
      if (data.success) setAppointments(data.data);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Status updated!');
        fetchAppointments();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    try {
      const response = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Appointment deleted!');
        fetchAppointments();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete appointment');
    }
  };

  if (loading) return <div className='text-center py-8'>Loading appointments...</div>;

  return (
    <div className='space-y-4'>
      <h3 className='text-xl font-bold text-foreground mb-6'>Appointment Bookings</h3>
      <div className='grid gap-4'>
        {appointments.map((apt) => (
          <Card key={apt._id} className='border-0 shadow-soft'>
            <CardContent className='p-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <p className='font-bold text-foreground'>{apt.fullName}</p>
                  <p className='text-sm text-muted-foreground'>{apt.email}</p>
                  <p className='text-sm text-muted-foreground'>{apt.phone}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-primary'>{apt.service}</p>
                  <p className='text-sm text-muted-foreground'>
                    {apt.preferredDate} at {apt.preferredTime}
                  </p>
                  <div className='flex items-center gap-2 mt-2'>
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt._id, e.target.value)}
                      className='text-xs rounded px-2 py-1 bg-muted border border-border'
                    >
                      <option value='pending'>Pending</option>
                      <option value='confirmed'>Confirmed</option>
                      <option value='completed'>Completed</option>
                      <option value='cancelled'>Cancelled</option>
                    </select>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => handleDelete(apt._id)}
                    >
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
