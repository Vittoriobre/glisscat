# Nuvepet - Premium Pet Products Website

A modern e-commerce website for premium pet products, built with Node.js, Express, and Stripe for payments.

## Features

- 🛍️ Product catalog with detailed modals
- 💳 Stripe payment integration
- 🛒 Shopping cart functionality
- 💝 Donation system
- 📱 Responsive design
- 💬 Live chat widget (with online/offline status)
- 📧 Contact form with EmailJS
- ⚖️ Legal pages

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Payments**: Stripe
- **Email**: EmailJS
- **Deployment**: Vercel

## Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**
2. **Go to [vercel.com](https://vercel.com)**
3. **Import your GitHub repository**
4. **Add environment variables** (see below)
5. **Deploy!**

## Environment Variables

You need to set these environment variables in Vercel:

### Required Variables:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `NODE_ENV` - Set to "production"

### Optional Variables:
- `EMAILJS_PUBLIC_KEY` - For contact form emails
- `EMAILJS_SERVICE_ID` - EmailJS service ID
- `EMAILJS_TEMPLATE_ID` - EmailJS template ID

## Setting Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add each variable:
   - `STRIPE_SECRET_KEY`: `sk_test_...` (your Stripe secret key)
   - `NODE_ENV`: `production`

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_key_here
   NODE_ENV=development
   ```

3. **Run the server**:
   ```bash
   npm start
   ```

4. **Open**: http://localhost:4242

## Project Structure

```
├── frontend/
│   ├── index.html          # Main website
│   └── legal.html          # Legal pages
├── images/                 # Product images
├── server.js              # Express server
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
└── README.md             # This file
```

## Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Create products and prices in Stripe
4. Update the `PRODUCT_PRICE_MAP` in `server.js` with your price IDs

## Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update CORS origins in `server.js`
4. Configure DNS records as instructed by Vercel

## Support

For support, email: support@nuvepet.com

## License

© 2025 Nuvepet Pet Products. All rights reserved. 