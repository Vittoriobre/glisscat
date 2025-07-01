const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Map your product IDs to Stripe price IDs
const PRODUCT_PRICE_MAP = {
  1: 'price_1RfUliDfRnaFvmpAk4NWnx01', // Cat Scratcher - 429 kr
  2: 'price_1RfUlhDfRnaFvmpAvVrgYaEf', // Stone Diamond Bowl - 399 kr
  3: 'price_1RfUliDfRnaFvmpAVcZ6GRNT', // Premium Cat Bag - 699 kr
  4: 'price_1RfihbDfRnaFvmpAkgrhGifJ', // Fountain (if needed) - 349 kr
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      shipping_options: shippingOptions,
      currency: 'sek',
      metadata: {
        order_type: 'product_purchase',
        items: JSON.stringify(items)
      }
    });

    console.log('Stripe session created:', session.id);
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}; 