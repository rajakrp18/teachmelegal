import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { addOrderAndEnrollUser } from '../../../lib/usersStore';

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      email,
      items,
      amount
    } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;

    let isVerified = false;

    if (secret && secret !== 'dummy_key_secret' && razorpay_signature) {
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      isVerified = (generated_signature === razorpay_signature);
    } else {
      // In sandbox mode without production secret, verify existence of order & payment tokens
      isVerified = Boolean(razorpay_order_id && razorpay_payment_id);
    }

    if (!isVerified) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 });
    }

    // Create unique order record
    const orderRecord = {
      id: `TML-ORD-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: Array.isArray(items) && items.length > 0 
        ? items.map(i => i.title).join(' + ') 
        : 'Legal Course / Material',
      amount: `₹${parseFloat(amount || 0).toFixed(2)}`,
      status: 'COMPLETED',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    };

    let userResult = null;
    if (email) {
      userResult = addOrderAndEnrollUser(email, orderRecord, items || []);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and access granted successfully',
      order: orderRecord,
      enrolledCourses: userResult ? userResult.enrolledCourses : [],
      orderHistory: userResult ? userResult.orderHistory : []
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
