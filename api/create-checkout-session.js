// api/create-checkout-session.js
// Stripe Checkout Session for LingShu · Life Compass
// Pricing: $9.99 one-time, $9.99/month, $79.99/year

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  oneTime: { amount: 999, name: 'LingShu Energy Blueprint Report', mode: 'payment' },
  monthly: { amount: 999, name: 'LingShu Monthly Subscription', mode: 'subscription', interval: 'month' },
  yearly: { amount: 7999, name: 'LingShu Yearly Subscription', mode: 'subscription', interval: 'year' }
};

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan, userData } = req.body;
    const price = PRICES[plan];

    if (!price) return res.status(400).json({ error: 'Invalid plan: ' + plan });

    const orderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: { name: price.name, description: 'Your personalized Energy Blueprint report' },
        unit_amount: price.amount,
        recurring: price.interval ? { interval: price.interval } : undefined,
      },
      quantity: 1,
    }];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: price.mode,
      success_url: (req.headers.origin || 'https://lingshu.life') + '/?paid=true&order=' + orderId,
      cancel_url: (req.headers.origin || 'https://lingshu.life') + '/?canceled=true',
      metadata: {
        order_id: orderId,
        plan: plan,
        user_name: (userData && userData.name) || '',
        birth_date: (userData && userData.birthDate) || '',
        birth_time: (userData && userData.birthTime) || '',
        birth_place: (userData && userData.birthPlace) || '',
      },
    });

    res.status(200).json({ url: session.url, sessionId: session.id, orderId: orderId });
  } catch (error) {
    console.error('Stripe error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
