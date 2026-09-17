import { NextResponse } from 'next/server';
import { getAllBooks, createBook } from '../../../../lib/booksStore';

export async function GET() {
  try {
    const books = getAllBooks();
    return NextResponse.json({ success: true, books });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Book title is required.' }, { status: 400 });
    }
    const newBook = createBook(body);
    return NextResponse.json({ success: true, book: newBook }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
