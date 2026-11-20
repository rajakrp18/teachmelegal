import { NextResponse } from 'next/server';
import { incrementPostViews } from '@/lib/blogsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const slug = body.slug || body.id;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug or ID is required' }, { status: 400 });
    }
    const updated = incrementPostViews(slug);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, views: updated.views, slug: updated.slug });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
