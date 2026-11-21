import { NextResponse } from 'next/server';
import { getAllPosts, createPost } from '../../../../lib/blogsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let posts = getAllPosts(true);

    // If on frontend, sync any extra posts from admin deployment
    const adminUrl = process.env.ADMIN_BACKEND_URL || 'https://teachmelegal-teach-me-legal-admin-p.vercel.app';
    if (adminUrl && !adminUrl.includes('localhost')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${adminUrl}/api/admin/blogs`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
            const idMap = new Map();
            posts.forEach(p => idMap.set(p.id || p.slug, p));
            data.posts.forEach(p => idMap.set(p.id || p.slug, p));
            posts = Array.from(idMap.values());
          }
        }
      } catch (e) {}
    }

    return NextResponse.json({ success: true, posts }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*'
      }
    });
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

    // Also forward post to admin deployment if running on frontend
    const adminUrl = process.env.ADMIN_BACKEND_URL || 'https://teachmelegal-teach-me-legal-admin-p.vercel.app';
    if (adminUrl && !adminUrl.includes('localhost')) {
      try {
        fetch(`${adminUrl}/api/admin/blogs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).catch(() => {});
      } catch (e) {}
    }

    return NextResponse.json({ success: true, post: newPost }, { 
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
