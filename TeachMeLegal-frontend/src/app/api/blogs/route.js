import { NextResponse } from 'next/server';
import { getAllPosts } from '../../../lib/blogsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let posts = getAllPosts(false);

    // Sync from admin backend on Vercel
    const adminUrl = process.env.ADMIN_BACKEND_URL || 'https://teachmelegal-teach-me-legal-admin-p.vercel.app';
    if (adminUrl && !adminUrl.includes('localhost')) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${adminUrl}/api/blogs`, {
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
      } catch (err) {}
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
