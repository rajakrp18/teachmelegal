import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/usersStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, profession, targetExam, university, state, bio } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const user = createUser({
      name,
      email,
      password,
      phone,
      profession,
      targetExam,
      university,
      state,
      bio
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user,
      enrolledCourses: [],
      orderHistory: []
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create account.' }, { status: 400 });
  }
}
