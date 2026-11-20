import { NextResponse } from 'next/server';
import { updateUserProfile } from '../../../../lib/usersStore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, ...updates } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'User email is required.' }, { status: 400 });
    }

    const updatedUser = updateUserProfile(email, updates);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update profile.' }, { status: 400 });
  }
}
