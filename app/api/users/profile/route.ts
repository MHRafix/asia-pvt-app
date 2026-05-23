import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { userProfileSchema } from '@/lib/validations/user';
import { cookies } from 'next/headers';
import * as jose from 'jose';

async function getUserFromToken() {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth-token')?.value;

	if (!token) {
		return null;
	}

	const secret = new TextEncoder().encode(
		process.env.JWT_SECRET || 'your-secret-key'
	);

	try {
		const { payload } = await jose.jwtVerify(token, secret);
		return payload;
	} catch {
		return null;
	}
}

export async function GET() {
	try {
		await connectDB();

		const payload = await getUserFromToken();
		if (!payload) {
			return NextResponse.json(
				{ success: false, error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const user = await User.findById(payload.userId).select('-password');

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: user,
		});
	} catch (error) {
		console.error('Error fetching profile:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to fetch profile' },
			{ status: 500 }
		);
	}
}

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const payload = await getUserFromToken();
		if (!payload) {
			return NextResponse.json(
				{ success: false, error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		const body = await request.json();

		// Validate with Zod
		const validationResult = userProfileSchema.safeParse(body);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error: 'Validation failed',
					details: validationResult.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		// Check if email is being changed and if it's already in use
		if (validationResult.data.email) {
			const existingUser = await User.findOne({
				email: validationResult.data.email,
				_id: { $ne: payload.userId },
			});

			if (existingUser) {
				return NextResponse.json(
					{ success: false, error: 'Email is already in use' },
					{ status: 400 }
				);
			}
		}

		const user = await User.findByIdAndUpdate(
			payload.userId,
			validationResult.data,
			{ new: true, runValidators: true }
		).select('-password');

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: user,
			message: 'Profile updated successfully',
		});
	} catch (error) {
		console.error('Error updating profile:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to update profile' },
			{ status: 500 }
		);
	}
}
