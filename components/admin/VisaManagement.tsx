'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VisaCountry {
  _id: string;
  slug: string;
  name: string;
  flag: string;
  type: string;
}

export default function VisaManagement() {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    flag: '',
    processing: '',
    type: '',
    description: '',
    requirements: [] as string[],
    documents: [] as string[],
    fees: [] as any[],
    tips: [] as string[],
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visa');
      const data = await response.json();
      if (data.success) setCountries(data.data);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to fetch visa countries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/visa/${editingId}` : '/api/visa';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Country updated!' : 'Country created!');
        resetForm();
        fetchCountries();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to save country');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this country?')) return;
    try {
      const response = await fetch(`/api/visa/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Country deleted!');
        fetchCountries();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete country');
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      flag: '',
      processing: '',
      type: '',
      description: '',
      requirements: [],
      documents: [],
      fees: [],
      tips: [],
    });
    setEditingId(null);
  };

  if (loading) return <div className='text-center py-8'>Loading visa countries...</div>;

  return (
    <div className='space-y-8'>
      <Card className='border-0 shadow-soft'>
        <CardContent className='p-6'>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            {editingId ? 'Edit Country' : 'Add Country'}
          </h3>
          <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-4'>
            <Input
              placeholder='Slug'
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <Input
              placeholder='Country Name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder='Flag Emoji'
              value={formData.flag}
              onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
              required
            />
            <Input
              placeholder='Processing Time'
              value={formData.processing}
              onChange={(e) => setFormData({ ...formData, processing: e.target.value })}
              required
            />
            <Input
              placeholder='Visa Type'
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
            <Input
              placeholder='Description'
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className='md:col-span-2'
            />
            <div className='md:col-span-2 flex gap-2'>
              <Button type='submit' variant='coral' className='flex-1'>
                {editingId ? 'Update Country' : 'Add Country'}
              </Button>
              {editingId && (
                <Button type='button' variant='outline' onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h3 className='text-xl font-bold text-foreground mb-4'>All Countries</h3>
        <div className='grid gap-4'>
          {countries.map((country) => (
            <Card key={country._id} className='border-0 shadow-soft'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-2xl mb-2'>{country.flag}</p>
                    <h4 className='font-bold text-foreground'>{country.name}</h4>
                    <p className='text-sm text-muted-foreground'>{country.type}</p>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setEditingId(country._id);
                        setFormData({
                          slug: country.slug,
                          name: country.name,
                          flag: country.flag,
                          processing: '',
                          type: country.type,
                          description: '',
                          requirements: [],
                          documents: [],
                          fees: [],
                          tips: [],
                        });
                      }}
                    >
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant='ghost' onClick={() => handleDelete(country._id)}>
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
