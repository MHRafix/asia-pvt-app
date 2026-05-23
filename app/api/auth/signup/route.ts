import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, phone, password, confirmPassword } = body;

    // Validation
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      role: 'user',
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Create response with secure cookie
    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('[v0] Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
