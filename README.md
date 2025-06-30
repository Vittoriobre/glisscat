# Glisscat - Nuvepet Pet Products E-commerce

A modern, honest, and Swedish/EU-compliant e-commerce website for premium pet products. Built with Node.js, Express, and Stripe for secure payments.

## Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Product Catalog**: Detailed product modals with image galleries
- **Shopping Cart**: Persistent cart with local storage
- **Secure Payments**: Stripe integration for safe transactions
- **Legal Compliance**: Swedish/EU-compliant privacy policy and terms
- **Mobile Responsive**: Optimized for all device sizes
- **Live Chat**: Customer support widget
- **Donation System**: Support the company's growth

## Products

- **Cat Scratcher** (429 kr) - Natural sisal fiber scratching ball
- **Stone Diamond Bowl** (399 kr) - Elevated ceramic feeding bowl
- **Premium Cat Bag** (699 kr) - Luxury transport carrier
- **Fountain** (349 kr) - Automatic water dispenser (currently sold out)

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Payment**: Stripe Checkout
- **Email**: EmailJS
- **Deployment**: Vercel-ready configuration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Stripe account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vittoriobre/glisscat.git
   cd glisscat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```bash
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   
   # Environment
   NODE_ENV=development
   PORT=4242
   ```

   **Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`.

4. **Stripe Setup**
   
   - Create a Stripe account at [stripe.com](https://stripe.com)
   - Get your secret key from the Stripe Dashboard
   - Create products and prices in Stripe Dashboard
   - Update the `PRODUCT_PRICE_MAP` in `server.js` with your Stripe price IDs

5. **Run the application**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:4242`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 4242) | No |

## Project Structure

```
glisscat/
├── frontend/
│   ├── index.html          # Main application
│   └── legal.html          # Legal pages
├── images/                 # Product images
├── server.js              # Express server
├── package.json           # Dependencies
├── vercel.json           # Vercel deployment config
├── .env                  # Environment variables (not in git)
└── .gitignore           # Git ignore rules
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Set `NODE_ENV=production` in your environment
2. Update CORS origins in `server.js` for your domain
3. Deploy to your preferred hosting platform

## API Endpoints

- `POST /create-checkout-session` - Create Stripe checkout session
- `POST /create-donation-session` - Create donation checkout session
- `GET /` - Serve main application
- `GET /legal` - Serve legal pages

## Security Features

- Environment variables for sensitive data
- CORS configuration
- Input validation
- Secure payment processing with Stripe
- No sensitive data in client-side code

## Legal Compliance

The application includes:
- Privacy Policy (GDPR compliant)
- Terms of Service
- Cookie Policy
- Swedish/EU legal requirements

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, contact:
- Email: support@nuvepet.com
- Phone: +46 73 646 30 45
- Hours: Mon-Fri, 9am-5pm CET

## About Nuvepet

Nuvepet was founded in Sweden in 2025 by passionate pet lovers. We're dedicated to creating quality pet products and providing excellent customer experience. Your support helps us grow and develop new products for pets everywhere. 