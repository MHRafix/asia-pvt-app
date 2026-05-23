import { connectDB } from '@/lib/db/connection';
import { BlogPost } from '@/lib/models/BlogPost';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const { id } = await params;
		const post = await BlogPost.findById(id);

		if (!post) {
			return NextResponse.json(
				{ success: false, message: 'Blog post not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: post });
	} catch (error) {
		console.error('[v0] Error fetching blog post:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch blog post' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();
		const body = await request.json();

		const { id } = await params;

		const updatedPost = await BlogPost.findByIdAndUpdate(id, body, {
			new: true,
			runValidators: true,
		});

		if (!updatedPost) {
			return NextResponse.json(
				{ success: false, message: 'Blog post not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: updatedPost });
	} catch (error) {
		console.error('[v0] Error updating blog post:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to update blog post' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await connectDB();

		const { id } = await params;

		const deletedPost = await BlogPost.findByIdAndDelete(id);

		if (!deletedPost) {
			return NextResponse.json(
				{ success: false, message: 'Blog post not found' },
				{ status: 404 },
			);
		}

		return NextResponse.json({ success: true, data: deletedPost });
	} catch (error) {
		console.error('[v0] Error deleting blog post:', error);
		return NextResponse.json(
			{ success: false, message: 'Failed to delete blog post' },
			{ status: 500 },
		);
	}
}
