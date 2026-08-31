import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import * as jose from 'jose';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const roles = ['user', 'employee', 'moderator', 'admin'] as const;
type Role = (typeof roles)[number];

async function getAdmin() {
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

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const admin = await getAdmin();
		if (!admin)
			return NextResponse.json(
				{ success: false, error: 'Admin access required' },
				{ status: 403 },
			);
		const { id } = await params;
		if (!mongoose.isValidObjectId(id))
			return NextResponse.json(
				{ success: false, error: 'Invalid user id' },
				{ status: 400 },
			);
		const body = await request.json();
		const role = body.role as Role;
		if (!roles.includes(role))
			return NextResponse.json(
				{
					success: false,
					error: 'Role must be user, employee, moderator, or admin',
				},
				{ status: 400 },
			);
		if (String(admin.userId) === id && role !== 'admin')
			return NextResponse.json(
				{ success: false, error: 'You cannot remove your own admin access' },
				{ status: 400 },
			);
		await connectDB();
		const user = await User.findByIdAndUpdate(
			id,
			{ role },
			{ new: true, runValidators: true },
		)
			.select('name email phone role avatar createdAt updatedAt')
			.lean();
		if (!user)
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 },
			);
		return NextResponse.json({
			success: true,
			data: user,
			message: 'Access updated successfully',
		});
	} catch (error) {
		console.error('[v0] Error updating user role:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update access' },
			{ status: 500 },
		);
	}
}

export { getAdmin };
