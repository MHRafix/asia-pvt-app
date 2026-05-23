import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { changePasswordSchema } from '@/lib/validations/auth';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		// Get user from token
		const cookieStore = await cookies();
		const token = cookieStore.get('auth-token')?.value;

		if (!token) {
			return NextResponse.json(
				{ success: false, error: 'Not authenticated' },
				{ status: 401 }
			);
		}

		// Verify token
		const secret = new TextEncoder().encode(
			process.env.JWT_SECRET || 'your-secret-key'
		);

		let payload;
		try {
			const { payload: verifiedPayload } = await jose.jwtVerify(token, secret);
			payload = verifiedPayload;
		} catch {
			return NextResponse.json(
				{ success: false, error: 'Invalid token' },
				{ status: 401 }
			);
		}

		const body = await request.json();

		// Validate with Zod
		const validationResult = changePasswordSchema.safeParse(body);
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

		const { currentPassword, newPassword } = validationResult.data;

		// Find user with password
		const user = await User.findById(payload.userId).select('+password');

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 }
			);
		}

		// Verify current password
		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return NextResponse.json(
				{ success: false, error: 'Current password is incorrect' },
				{ status: 400 }
			);
		}

		// Update password
		user.password = newPassword;
		await user.save();

		return NextResponse.json({
			success: true,
			message: 'Password changed successfully',
		});
	} catch (error) {
		console.error('Error changing password:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to change password' },
			{ status: 500 }
		);
	}
}
