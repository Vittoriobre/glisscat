// server.js
require('dotenv').config();

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('ERROR: STRIPE_SECRET_KEY is not set. Please set it in your Vercel project environment variables.');
}
console.log('Stripe key:', process.env.STRIPE_SECRET_KEY);
const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

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
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Serve images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Map your product IDs to Stripe price IDs
const PRODUCT_PRICE_MAP = {
  1: 'price_1RfV0FDfRnaFvmpAByGd7MhH', // Cat Scratcher - 429 kr
  2: 'price_1RfV1LDfRnaFvmpAksIRqLoV', // Stone Diamond Bowl - 399 kr
  3: 'price_1RfV0dDfRnaFvmpAB3im1OvA', // Premium Cat Bag - 699 kr
  4: 'price_1RfV1kDfRnaFvmpAiUhxekEj', // Fountain (if needed) - 349 kr
};

// API Routes
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body; // [{ id: 1, quantity: 2 }, ...]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    console.log('Received items:', items);

    // Calculate subtotal
    const productPrices = {
      1: 429, // Cat Scratcher
      2: 399, // Stone Diamond Bowl
      3: 699, // Premium Cat Bag
      4: 349, // Fountain
    };

    let subtotal = 0;
    items.forEach(item => {
      if (productPrices[item.id]) {
        subtotal += productPrices[item.id] * item.quantity;
      }
    });

    console.log('Calculated subtotal:', subtotal);

    // Build Stripe line_items
    const line_items = items.map(item => ({
      price: PRODUCT_PRICE_MAP[item.id],
      quantity: item.quantity,
    })).filter(li => li.price);

    if (line_items.length === 0) {
      return res.status(400).json({ error: 'No valid products' });
    }

    // Set up shipping options based on order total
    const shippingOptions = subtotal < 500 ? [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 4900, currency: 'sek' }, // 49 kr in öre
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      }
    ] : [];

    if (subtotal < 500) {
      console.log('Adding shipping cost (49 kr) for order under 500 kr');
    } else {
      console.log('Order is 500 kr or above - free shipping');
    }

    console.log('Final line_items for Stripe:', JSON.stringify(line_items, null, 2));
    console.log('Shipping options:', JSON.stringify(shippingOptions, null, 2));

    try {
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
        currency: 'sek',
        shipping_options: shippingOptions,
      });
      console.log('Stripe session created successfully');
      res.json({ url: session.url });
    } catch (stripeErr) {
      console.error('Stripe error:', stripeErr);
      res.status(500).json({ error: 'Stripe error', details: stripeErr.message });
    }
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/create-donation-session', async (req, res) => {
  try {
    const { amount, email, message } = req.body;
    if (!amount || isNaN(amount) || amount < 5) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    // Stripe expects amount in öre (cents)
    const amountInOres = Math.round(Number(amount) * 100);

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
            unit_amount: amountInOres,
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
    console.error('Error creating donation session:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Serve legal page
app.get('/legal', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'legal.html'));
});

// Handle all other routes by serving the main page (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 