import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { BlogPost } from '@/lib/models/BlogPost';

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find().sort({ date: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('[v0] Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id || !body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await BlogPost.create(body);
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('[v0] Error creating blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
