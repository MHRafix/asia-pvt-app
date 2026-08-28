'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, UserCog, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth/AuthContext';

type Role = 'user' | 'employee' | 'admin';
type ManagedUser = { _id: string; name: string; email: string; phone: string; role: Role; createdAt: string };

const roleLabels: Record<Role, string> = { user: 'User', employee: 'Employee', admin: 'Admin' };

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async (term = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users${term ? `?search=${encodeURIComponent(term)}` : ''}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to load users');
      setUsers(result.data);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to load users'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateRole = async (id: string, role: Role) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/users/${id}/role`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to update access');
      setUsers((items) => items.map((item) => item._id === id ? result.data : item));
      toast.success('Access updated successfully');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to update access'); }
    finally { setUpdating(null); }
  };

  const normalUsers = useMemo(() => users.filter((item) => item.role === 'user'), [users]);
  const managementUsers = useMemo(() => users.filter((item) => item.role !== 'user'), [users]);

  return <main className='space-y-6 p-4 pt-20 lg:p-8 lg:pt-8'>
    <div><p className='text-sm font-medium text-primary'>Administration</p><h1 className='mt-1 text-3xl font-bold tracking-tight'>User management</h1><p className='mt-2 text-muted-foreground'>Manage account access across your workspace.</p></div>
    <div className='flex max-w-xl gap-2'><div className='relative flex-1'><Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' /><Input className='pl-9' placeholder='Search name, email, or phone' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(search); }} /></div><Button onClick={() => fetchUsers(search)}>Search</Button></div>
    <Tabs defaultValue='users'>
      <TabsList><TabsTrigger value='users'><Users className='mr-2 size-4' />Users <span className='ml-2 text-xs text-muted-foreground'>{normalUsers.length}</span></TabsTrigger><TabsTrigger value='management'><ShieldCheck className='mr-2 size-4' />Management users <span className='ml-2 text-xs text-muted-foreground'>{managementUsers.length}</span></TabsTrigger></TabsList>
      <TabsContent value='users'><UserTable users={normalUsers} loading={loading} updating={updating} currentUserId={currentUser?.id} onUpdate={updateRole} /></TabsContent>
      <TabsContent value='management'><UserTable users={managementUsers} loading={loading} updating={updating} currentUserId={currentUser?.id} onUpdate={updateRole} /></TabsContent>
    </Tabs>
  </main>;
}

function UserTable({ users, loading, updating, currentUserId, onUpdate }: { users: ManagedUser[]; loading: boolean; updating: string | null; currentUserId?: string; onUpdate: (id: string, role: Role) => void }) {
  if (loading) return <div className='rounded-xl border p-10 text-center text-muted-foreground'>Loading users...</div>;
  if (!users.length) return <div className='rounded-xl border p-10 text-center text-muted-foreground'>No users found.</div>;
  return <div className='overflow-x-auto rounded-xl border bg-card'><table className='w-full min-w-[760px] text-sm'><thead className='border-b bg-muted/40 text-left text-muted-foreground'><tr><th className='p-4 font-medium'>User</th><th className='p-4 font-medium'>Phone</th><th className='p-4 font-medium'>Role</th><th className='p-4 font-medium'>Joined</th><th className='p-4 text-right font-medium'>Access modification</th></tr></thead><tbody className='divide-y'>{users.map((item) => { const self = item._id === currentUserId; return <tr key={item._id} className='hover:bg-muted/20'><td className='p-4'><div className='font-medium'>{item.name}</div><div className='text-muted-foreground'>{item.email}</div></td><td className='p-4 text-muted-foreground'>{item.phone || '—'}</td><td className='p-4'><Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>{roleLabels[item.role]}</Badge></td><td className='p-4 text-muted-foreground'>{new Date(item.createdAt).toLocaleDateString()}</td><td className='p-4 text-right'><div className='flex items-center justify-end gap-2'><UserCog className='size-4 text-muted-foreground' /><select aria-label={`Change access for ${item.name}`} disabled={updating === item._id || self} value={item.role} onChange={(e) => onUpdate(item._id, e.target.value as Role)} className='rounded-md border bg-background px-2 py-1.5 text-sm'>{(['user', 'employee', 'admin'] as Role[]).map((role) => <option key={role} value={role}>{roleLabels[role]}</option>)}</select></div>{self && <p className='mt-1 text-xs text-muted-foreground'>Your admin access is protected</p>}</td></tr>; })}</tbody></table></div>;
}
