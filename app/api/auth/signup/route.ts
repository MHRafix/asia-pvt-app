import { generateToken } from '@/lib/auth/jwt';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		await connectDB();

		const body = await req.json();

		const name = body?.name?.trim();
		const email = body?.email?.trim().toLowerCase();
		const phone = body?.phone?.trim();
		const password = body?.password;
		const confirmPassword = body?.confirmPassword;

		// Required fields validation
		if (!name || !email || !phone || !password || !confirmPassword) {
			return NextResponse.json(
				{
					success: false,
					message: 'All fields are required',
				},
				{ status: 400 },
			);
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid email address',
				},
				{ status: 400 },
			);
		}

		// Password validation
		if (password.length < 6) {
			return NextResponse.json(
				{
					success: false,
					message: 'Password must be at least 6 characters',
				},
				{ status: 400 },
			);
		}

		// Confirm password
		if (password !== confirmPassword) {
			return NextResponse.json(
				{
					success: false,
					message: 'Passwords do not match',
				},
				{ status: 400 },
			);
		}

		// Existing user
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: 'Email already registered',
				},
				{ status: 409 },
			);
		}

		const hashedPass = await bcrypt.hash(password, 10);

		// Create user
		const user = await User.create({
			name,
			email,
			phone,
			password: hashedPass,
			role: 'user',
		});

		// JWT Token
		const token = generateToken({
			userId: String(user._id),
			email: user.email,
			role: user.role,
		});

		const response = NextResponse.json(
			{
				success: true,
				message: 'User registered successfully',
				user: {
					id: String(user._id),
					name: user.name,
					email: user.email,
					phone: user.phone,
					role: user.role,
				},
			},
			{ status: 201 },
		);

		response.cookies.set('authToken', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 7,
			path: '/',
		});

		return response;
	} catch (error: any) {
		console.error('Signup Error:', error);

		// Mongo duplicate key error
		if (error?.code === 11000) {
			return NextResponse.json(
				{
					success: false,
					message: 'Email already exists',
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{
				success: false,
				message: 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
}
