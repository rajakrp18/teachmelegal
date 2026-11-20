import { NextResponse } from 'next/server';
import { getAllUsers } from '../../../../lib/usersStore';

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({
      success: true,
      total: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching admin scholars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registered scholars' },
      { status: 500 }
    );
  }
}
