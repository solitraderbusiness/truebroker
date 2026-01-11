# 📊 Premium Trading Signals Platform

A complete, production-ready SaaS platform for selling trading signals via subscription.

## Features

- 💰 **$29/month subscriptions** via Stripe
- ⚡ **Instant Telegram delivery** of signals
- 📱 **Beautiful landing page** with conversion-optimized design
- 🎯 **Admin dashboard** for creating and managing signals
- 👥 **User dashboard** for viewing signals and managing subscription
- 📊 **Signal tracking** with win/loss/breakeven status
- 🔐 **Secure authentication** with JWT
- 💳 **Full payment integration** with Stripe
- 🤖 **Telegram bot** for automated signal delivery

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** Prisma + SQLite (easily upgradeable to PostgreSQL)
- **Payments:** Stripe
- **Messaging:** Telegram Bot API
- **Auth:** JWT + bcrypt

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in your keys:
- Stripe keys (from stripe.com/dashboard)
- Telegram bot token (from @BotFather)

### 3. Initialize database
```bash
npm run setup
```

### 4. Start the application
```bash
npm run dev
```

Visit http://localhost:3000

### 5. Login as admin
- Email: `admin@signals.com`
- Password: `admin123`

## Documentation

- 📖 **[Complete Setup Guide](SETUP-GUIDE.md)** - Step-by-step instructions
- 📱 **[Marketing Guide](MARKETING.md)** - Instagram content templates and strategy

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run setup` - Initialize database and create admin
- `npm run seed` - Create admin user
- `npm run bot` - Start Telegram bot

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── page.tsx        # Landing page
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── admin/          # Admin dashboard
│   └── api/            # API routes
├── lib/                # Utilities
│   ├── db.ts          # Database client
│   ├── auth.ts        # Auth helpers
│   └── telegram.ts    # Telegram bot
├── prisma/            # Database schema
└── scripts/           # Utility scripts
```

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### VPS/Server
```bash
npm run build
npm start
```

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed deployment instructions.

## Revenue Potential

With proper marketing to your Instagram audience:

- **Conservative (0.5%):** 1,500 subs = $43,500/month
- **Moderate (1%):** 3,000 subs = $87,000/month
- **Optimistic (2%):** 6,000 subs = $174,000/month

## License

MIT

## Support

For issues or questions, refer to the [SETUP-GUIDE.md](SETUP-GUIDE.md) troubleshooting section.

---

**Built with ❤️ for traders by traders**
