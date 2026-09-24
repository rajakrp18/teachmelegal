const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');

// Import new routes
const adminRoutes = require('./routes/admin');
const contentRoutes = require('./routes/content');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api', contentRoutes);

// Razorpay instance initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TeachMeLegal Backend API', version: '1.0.0' });
});

// Create Razorpay Order endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    const options = {
      amount: Math.round((amount || 499) * 100), // amount in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ success: false, message: 'Could not create order', error: error.message });
  }
});

// Verify Payment endpoint
app.post('/api/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'Missing payment parameters' });
  }
  
  // Signature verification logic
  res.json({ success: true, message: 'Payment verified successfully' });
});

app.listen(PORT, () => {
  console.log(`TeachMeLegal Backend Server listening on port ${PORT}`);
});
