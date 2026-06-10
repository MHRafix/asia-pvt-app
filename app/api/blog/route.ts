import { connectDB } from '@/lib/db/connection';
import { BlogPost } from '@/lib/models/BlogPost';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '../../../lib/models/User';

export async function GET() {
	const models = mongoose.modelNames();
	try {
		await connectDB();

		const posts = await BlogPost.find()
			.populate({
				path: 'author',
				select: 'name email avatar',
				strictPopulate: false,
			})
			.sort({ createdAt: -1 })
			.lean();
		return NextResponse.json({ success: true, data: posts });
	} catch (error) {
		console.error('[v0] Error fetching blog posts:', error);
		return NextResponse.json(
			{ success: false, message: error, models },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const body = await request.json();

		if (!body.title || !body.content) {
			return NextResponse.json(
				{ success: false, message: 'Missing required fields' },
				{ status: 400 },
			);
		}

		const newPost = await BlogPost.create(body);
		return NextResponse.json({ success: true, data: newPost }, { status: 201 });
	} catch (error) {
		console.error('[v0] Error creating blog post:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to create blog post' },
			{ status: 500 },
		);
	}
}
