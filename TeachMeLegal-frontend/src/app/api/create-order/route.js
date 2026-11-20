import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // If real Razorpay keys are configured, create live/test order with Razorpay SDK
    if (key_id && key_secret && key_id !== 'dummy_key_id' && key_id.startsWith('rzp_')) {
      const razorpay = new Razorpay({ key_id, key_secret });
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt,
      });
      return NextResponse.json({ success: true, order });
    }

    // Secure fallback simulation for dev/staging when keys are not yet provided in environment
    const simulatedOrderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const order = {
      id: simulatedOrderId,
      entity: 'order',
      amount: Math.round(amount * 100),
      amount_paid: 0,
      amount_due: Math.round(amount * 100),
      currency,
      receipt,
      status: 'created',
      attempts: 0,
      created_at: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json({ success: true, order, isSimulation: true });
  } catch (error) {
    console.error('Error creating razorpay order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
