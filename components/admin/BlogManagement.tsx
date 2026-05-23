'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  _id: string;
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    author: '',
    category: '',
    readTime: '5 min',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      const data = await response.json();
      if (data.success) setPosts(data.data);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Post updated!' : 'Post created!');
        resetForm();
        fetchPosts();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const response = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        toast.success('Post deleted!');
        fetchPosts();
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      slug: '',
      description: '',
      content: '',
      image: '',
      author: '',
      category: '',
      readTime: '5 min',
    });
    setEditingId(null);
  };

  if (loading) return <div className='text-center py-8'>Loading blog posts...</div>;

  return (
    <div className='space-y-8'>
      <Card className='border-0 shadow-soft'>
        <CardContent className='p-6'>
          <h3 className='text-xl font-bold text-foreground mb-4'>
            {editingId ? 'Edit Post' : 'Create New Post'}
          </h3>
          <form onSubmit={handleSubmit} className='grid md:grid-cols-2 gap-4'>
            <Input
              placeholder='Post ID'
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
            />
            <Input
              placeholder='Title'
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              placeholder='Slug'
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <Input
              placeholder='Author'
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            />
            <Input
              placeholder='Category'
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Input
              placeholder='Read Time'
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
            />
            <Input
              placeholder='Image URL'
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className='md:col-span-2'
            />
            <div className='md:col-span-2 flex gap-2'>
              <Button type='submit' variant='coral' className='flex-1'>
                {editingId ? 'Update Post' : 'Create Post'}
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
        <h3 className='text-xl font-bold text-foreground mb-4'>All Posts</h3>
        <div className='grid gap-4'>
          {posts.map((post) => (
            <Card key={post._id} className='border-0 shadow-soft'>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h4 className='font-bold text-foreground'>{post.title}</h4>
                    <p className='text-sm text-muted-foreground'>By {post.author}</p>
                    <p className='text-xs text-primary font-medium'>{post.category}</p>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='ghost'
                      onClick={() => {
                        setEditingId(post._id);
                        setFormData({
                          id: post.id,
                          title: post.title,
                          slug: post.slug,
                          description: '',
                          content: '',
                          image: '',
                          author: post.author,
                          category: post.category,
                          readTime: '5 min',
                        });
                      }}
                    >
                      <Edit2 className='w-4 h-4' />
                    </Button>
                    <Button size='sm' variant='ghost' onClick={() => handleDelete(post._id)}>
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
