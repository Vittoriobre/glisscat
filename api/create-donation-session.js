const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    const { amount, message, email } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    console.log('Creating donation session for amount:', amount, 'kr');

    // Create Stripe checkout session for donation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'sek',
            product_data: {
              name: 'Donation to Nuvepet',
              description: message || 'Support for Nuvepet pet products development',
            },
            unit_amount: amount * 100, // Convert to öre
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/?donation=success`,
      cancel_url: `${req.headers.origin}/?donation=canceled`,
      currency: 'sek',
      metadata: {
        order_type: 'donation',
        message: message || '',
        email: email || '',
        amount: amount.toString()
      }
    });

    console.log('Donation session created:', session.id);
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Error creating donation session:', error);
    res.status(500).json({ error: 'Failed to create donation session' });
  }
}; 