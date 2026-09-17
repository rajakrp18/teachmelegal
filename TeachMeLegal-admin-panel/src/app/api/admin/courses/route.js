import { NextResponse } from 'next/server';
import { getAllCourses, createCourse } from '../../../../lib/coursesStore';

export async function GET() {
  try {
    const courses = getAllCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Course title is required.' }, { status: 400 });
    }
    const newCourse = createCourse(body);
    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
