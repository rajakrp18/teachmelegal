import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt = 'receipt#1' } = await request.json();

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    // In a real app, you'd save this order in your PostgreSQL database using Prisma here
    // e.g. await prisma.order.create({ data: { razorpayOrderId: order.id, amount, status: 'PENDING' } })

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
