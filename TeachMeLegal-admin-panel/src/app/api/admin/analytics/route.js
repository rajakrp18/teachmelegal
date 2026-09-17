import { NextResponse } from 'next/server';
import { getAnalyticsStats } from '../../../../lib/blogsStore';

export async function GET() {
  try {
    const stats = getAnalyticsStats();
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
