import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';

async function getAdminPayload() {
  const token = (await cookies()).get('authToken')?.value;
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key'),
    );
    return payload.role === 'admin' ? payload : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getAdminPayload();
    if (!payload) return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
    await connectDB();
    const search = request.nextUrl.searchParams.get('search')?.trim();
    const role = request.nextUrl.searchParams.get('role');
    const query: Record<string, unknown> = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    if (role && ['user', 'employee', 'admin'].includes(role)) query.role = role;
    const users = await User.find(query)
      .select('name email phone role avatar createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('[v0] Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
  }
}

export { getAdminPayload };
