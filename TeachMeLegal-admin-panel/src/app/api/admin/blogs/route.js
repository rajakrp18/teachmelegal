import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '../../../../lib/blogsStore';

export async function GET() {
  try {
    const posts = getAllPosts(true);
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required.' }, { status: 400 });
    }
    const newPost = createPost(body);
    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
