import { NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, sanitizeUser } from '../../../../lib/usersStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: sanitizeUser(user),
      enrolledCourses: user.enrolledCourses || [],
      orderHistory: user.orderHistory || []
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Authentication failed.' }, { status: 500 });
  }
}
