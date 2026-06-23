# LingShu · Life Compass

**Your body is your best feng shui.**

AI-powered wellness guide rooted in 5,000 years of Eastern wisdom.

## Quick Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New → Project → Import this repo
3. Framework preset: **Other**
4. Click Deploy
5. Add Environment Variables (Settings → Environment Variables):

| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | `sk_test_xxx` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` |
| `DEEPSEEK_API_KEY` | `sk-xxx` (optional) |

6. Redeploy

## Project Structure

```
├── lingShu.html          # Main frontend (entry point)
├── index.html             # Same as lingShu.html (for root URL)
├── intl-engine.js         # BaZi calculation engine (local, zero-cost)
├── api/
│   ├── create-checkout-session.js  # Stripe Checkout
│   ├── webhook.js                  # Stripe Webhook handler
│   └── generate-report.js          # Report generation API
├── package.json           # Dependencies
├── vercel.json            # Vercel deployment config
└── .gitignore
```

## Features

- **Energy Blueprint**: Five Element radar chart from birth chart analysis
- **5-Dimension Wellness Plan**: Movement, Nutrition, Body, Mind, Environment
- **Share Energy Avatar**: Downloadable share card with radar chart + traits
- **Stripe Payment**: $9.99 one-time, $9.99/month, $79.99/year
- **Classical Citations**: Every insight referenced to Huangdi Neijing, I Ching, etc.
- **Mobile-first**: 48px touch targets, responsive breakpoints

## Tech Stack

- Frontend: Vanilla HTML/CSS/JS (no framework)
- Engine: Local JS BaZi calculation (zero API cost)
- AI: Deepseek API (optional enhancement)
- Payment: Stripe Checkout
- Deploy: Vercel Serverless Functions

## License

© 2025 LingShu · Life Compass. All rights reserved.
