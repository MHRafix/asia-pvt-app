import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const body = await request.json();

		// Validate with Zod
		const validationResult = forgotPasswordSchema.safeParse(body);
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

		const { email } = validationResult.data;

		// Find user
		const user = await User.findOne({ email });

		// Always return success to prevent email enumeration
		if (!user) {
			return NextResponse.json({
				success: true,
				message: 'If an account exists with this email, you will receive a password reset link.',
			});
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetPasswordToken = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');
		const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

		// Save token to user
		await User.findByIdAndUpdate(user._id, {
			resetPasswordToken,
			resetPasswordExpires,
		});

		// Build reset URL
		const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
		const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

		// In production, you would send an email here
		// For now, we'll log the reset URL (in production, use a service like Resend, SendGrid, etc.)
		console.log('Password Reset URL:', resetUrl);

		// TODO: Send email with reset link
		// Example with Resend:
		// await resend.emails.send({
		//   from: 'noreply@yourdomain.com',
		//   to: email,
		//   subject: 'Password Reset Request',
		//   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
		// });

		return NextResponse.json({
			success: true,
			message: 'If an account exists with this email, you will receive a password reset link.',
			// Only include resetUrl in development for testing
			...(process.env.NODE_ENV === 'development' && { resetUrl }),
		});
	} catch (error) {
		console.error('Error in forgot password:', error);
		return NextResponse.json(
			{ success: false, error: 'Failed to process request' },
			{ status: 500 }
		);
	}
}
