import { NextResponse } from 'next/server';
import { getAllPosts } from '../../../lib/blogsStore';

export async function GET() {
  try {
    const posts = getAllPosts(false);
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
