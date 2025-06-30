// api/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const serverless = require('serverless-http');

const app = express();

// Optional: simple root route to avoid 500 on '/'
app.get('/', (req, res) => {
  res.send('Nuvepet API is running');
});

// CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4242',
  'http://127.0.0.1:4242',
  'https://nuvepet.com',
  'https://www.nuvepet.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Stripe price map
const PRODUCT_PRICE_MAP = {
  1: 'price_1RfUliDfRnaFvmpAk4NWnx01',
  2: 'price_1RfUlhDfRnaFvmpAvVrgYaEf',
  3: 'price_1RfUlhDfRnaFvmpAHLwbXNNb',
  4: 'price_1RfihbDfRnaFvmpAkgrhGifJ',
};

// Route: Create Checkout
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const productPrices = {
      1: 429,
      2: 399,
      3: 699,
      4: 349,
    };

    let subtotal = 0;
    items.forEach(item => {
      if (productPrices[item.id]) {
        subtotal += productPrices[item.id] * item.quantity;
      }
    });

    const line_items = items.map(item => ({
      price: PRODUCT_PRICE_MAP[item.id],
      quantity: item.quantity,
    })).filter(li => li.price);

    if (line_items.length === 0) {
      return res.status(400).json({ error: 'No valid products' });
    }

    const shippingOptions = subtotal < 500 ? [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 4900, currency: 'sek' },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      }
    ] : [];

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      currency: 'sek',
      shipping_options: shippingOptions,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: Donations
app.post('/create-donation-session', async (req, res) => {
  try {
    const { amount, email, message } = req.body;

    if (!amount || isNaN(amount) || amount < 5) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Nuvepet Donation',
              description: message ? `Message: ${message}` : undefined,
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: email || undefined,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Donation session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = serverless(app);
