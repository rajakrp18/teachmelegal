import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../../lib/usersStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({
      success: true,
      total: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrolled scholars' },
      { status: 500 }
    );
  }
}
