// api/webhook.js
// Stripe Webhook — handles payment success events

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send('Webhook Error: ' + err.message);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const meta = session.metadata || {};
    
    console.log('Payment successful:', {
      order_id: meta.order_id,
      user: meta.user_name,
      plan: meta.plan,
      amount: session.amount_total,
    });
    
    // TODO: Store order in database (Supabase/Firebase)
    // For MVP, the frontend uses the success_url redirect to unlock the report
  }

  if (event.type === 'customer.subscription.deleted') {
    console.log('Subscription canceled:', event.data.object.id);
    // TODO: Revoke access
  }

  res.json({ received: true });
};
