import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { resetPasswordSchema } from '@/lib/validations/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();
		const { token, ...passwordData } = body;

		if (!token) {
			return NextResponse.json(
				{ success: false, error: 'Reset token is required' },
				{ status: 400 }
			);
		}

		// Validate password data with Zod
		const validationResult = resetPasswordSchema.safeParse(passwordData);
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

		// Hash the token to compare with stored hash
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(token)
			.digest('hex');

		// Find user with valid token
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpires: { $gt: new Date() },
		}).select('+resetPasswordToken +resetPasswordExpires');

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'Invalid or expired reset token' },
				{ status: 400 }
			);
		}

		// Update password and clear reset token
		user.password = validationResult.data.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		return NextResponse.json({
			success: true,
			message: 'Password has been reset successfully',
		});
	} catch (error) {
		console.error('Error in reset password:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to reset password' },
			{ status: 500 }
		);
	}
}

// Verify token validity
export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const { searchParams } = new URL(request.url);
		const token = searchParams.get('token');

		if (!token) {
			return NextResponse.json(
				{ success: false, error: 'Reset token is required' },
				{ status: 400 }
			);
		}

		// Hash the token to compare with stored hash
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(token)
			.digest('hex');

		// Find user with valid token
		const user = await User.findOne({
			resetPasswordToken,
			resetPasswordExpires: { $gt: new Date() },
		}).select('email');

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'Invalid or expired reset token' },
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			email: user.email,
		});
	} catch (error) {
		console.error('Error verifying reset token:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to verify token' },
			{ status: 500 }
		);
	}
}
