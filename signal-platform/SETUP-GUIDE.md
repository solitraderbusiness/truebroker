# 🚀 Complete Setup Guide - Trading Signals Platform

## What You Have

A complete, production-ready trading signals platform with:
- ✅ Beautiful landing page
- ✅ User authentication & registration
- ✅ Stripe payment integration ($29/month subscriptions)
- ✅ Admin dashboard for creating signals
- ✅ User dashboard for viewing signals
- ✅ Telegram bot for instant signal delivery
- ✅ Full database with SQLite

---

## Quick Start (5 Minutes)

### 1. Get Stripe Keys (Required for Payments)

**Step 1:** Go to https://dashboard.stripe.com/register
- Create a free Stripe account
- Verify your email

**Step 2:** Get your API keys
- Go to https://dashboard.stripe.com/test/apikeys
- Copy "Publishable key" (starts with `pk_test_`)
- Copy "Secret key" (starts with `sk_test_`)

**Step 3:** Create a product
- Go to https://dashboard.stripe.com/test/products
- Click "Add product"
- Name: "Premium Trading Signals"
- Price: $29/month (recurring)
- Click "Save product"
- Copy the "Price ID" (starts with `price_`)

**Step 4:** Get webhook secret (for subscription updates)
- Go to https://dashboard.stripe.com/test/webhooks
- Click "Add endpoint"
- Endpoint URL: `https://yourdomain.com/api/stripe/webhook` (you'll update this later)
- Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Click "Add endpoint"
- Copy "Signing secret" (starts with `whsec_`)

---

### 2. Get Telegram Bot Token (Required for Signals)

**Step 1:** Open Telegram and search for [@BotFather](https://t.me/botfather)

**Step 2:** Send `/newbot`

**Step 3:** Follow prompts:
- Bot name: "Premium Trading Signals"
- Username: something like `YourNameSignalsBot`

**Step 4:** Copy the token (looks like `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Step 5:** Send `/setdescription` to set bot description:
```
Get premium crypto and forex trading signals delivered instantly!
```

**Step 6:** Send `/setabouttext`:
```
Professional trading signals for crypto and forex markets. Subscribe at [your website]
```

---

### 3. Configure Environment Variables

Open the `.env` file and update these values:

```env
# Database (leave as is)
DATABASE_URL="file:./dev.db"

# NextAuth / JWT (change in production!)
NEXTAUTH_SECRET="your-random-secret-key-here-change-this"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (paste your keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET"
STRIPE_PRICE_ID="price_YOUR_PRICE_ID"

# Telegram (paste your bot token)
TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN_HERE"

# Admin (you can change these)
ADMIN_EMAIL="admin@signals.com"
ADMIN_PASSWORD="admin123"
```

---

### 4. Run the Application

**Terminal 1 - Start the website:**
```bash
cd signal-platform
npm run dev
```

The website will be at: http://localhost:3000

**Terminal 2 - Start the Telegram bot (optional for now):**
```bash
npm run bot
```

---

### 5. Test Everything

**Test 1: Access the website**
- Go to http://localhost:3000
- You should see the landing page

**Test 2: Login as admin**
- Go to http://localhost:3000/auth/login
- Email: `admin@signals.com`
- Password: `admin123`
- You should see the admin dashboard

**Test 3: Create a signal**
- In admin dashboard, fill out the form:
  - Type: BUY
  - Market: crypto
  - Asset: BTC/USD
  - Entry Price: 50000
  - Stop Loss: 48000
  - Take Profit: 55000
- Click "Create & Send Signal"

**Test 4: Register a user**
- Open incognito/private window
- Go to http://localhost:3000/auth/register
- Create an account
- You should see user dashboard

**Test 5: Test payment (optional)**
- Click "Subscribe Now"
- Use Stripe test card: `4242 4242 4242 4242`
- Any future date, any CVC
- Should redirect back with success

---

## Deployment to Production

### Option 1: Vercel (Easiest, Recommended)

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Deploy
```bash
cd signal-platform
vercel
```

**Step 3:** Follow prompts:
- Link to existing project? No
- Project name? signal-platform
- Which directory? ./
- Override settings? No

**Step 4:** Add environment variables
```bash
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_PRICE_ID
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add TELEGRAM_BOT_TOKEN
```

**Step 5:** Update production settings
- Change `NEXTAUTH_URL` to your Vercel URL
- Update Stripe webhook to point to `https://your-domain.vercel.app/api/stripe/webhook`

**Step 6:** Redeploy
```bash
vercel --prod
```

**Note:** For production, you'll need to use a real database (PostgreSQL) instead of SQLite. Vercel has easy Postgres integration.

---

### Option 2: VPS/Server (Full Control)

**Requirements:**
- Ubuntu/Debian server
- Node.js 18+
- PM2 for process management

**Step 1:** Upload code to server
```bash
scp -r signal-platform user@your-server:/var/www/
```

**Step 2:** Install dependencies
```bash
cd /var/www/signal-platform
npm install
npm run build
```

**Step 3:** Install PM2
```bash
npm install -g pm2
```

**Step 4:** Create ecosystem file
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'signals-web',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'signals-bot',
      script: 'npm',
      args: 'run bot',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

**Step 5:** Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Step 6:** Setup Nginx reverse proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Step 7:** Get SSL certificate
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Using the Platform

### As Admin

**Login:**
- Go to /auth/login
- Use your admin credentials

**Send a Signal:**
1. Fill out the form
2. Choose BUY or SELL
3. Enter asset (e.g., BTC/USD, EUR/USD)
4. Set entry price
5. Optionally add stop loss, take profit, leverage
6. Add notes if needed
7. Click "Create & Send Signal"

**Signal will be:**
- Saved to database
- Displayed on user dashboards
- Sent to all active subscribers via Telegram

**Close a Signal:**
- In "Active Signals" section
- Click "Close as Win", "Close as Loss", or "Breakeven"
- This updates the signal status and shows results to users

---

### As User

**Subscribe:**
1. Register account
2. Click "Subscribe Now"
3. Pay with credit card
4. Subscription activates instantly

**Connect Telegram:**
1. Start your bot on Telegram
2. Send `/start`
3. Copy your Chat ID
4. Enter it in dashboard settings
5. Save

**Receive Signals:**
- View all signals in dashboard
- Get instant Telegram notifications
- See full history and results

---

## Troubleshooting

### "Cannot connect to database"
- Run `npm run setup` to initialize database

### "Stripe checkout not working"
- Check that all Stripe keys are correct in `.env`
- Make sure you're using test mode keys (start with `pk_test_` and `sk_test_`)
- Verify STRIPE_PRICE_ID matches your product

### "Telegram bot not responding"
- Check TELEGRAM_BOT_TOKEN is correct
- Make sure bot is running: `npm run bot`
- Try `/start` command in Telegram

### "Admin login not working"
- Run `npm run seed` to create admin user
- Check ADMIN_EMAIL and ADMIN_PASSWORD in `.env`

### "Signals not showing in dashboard"
- Make sure you're logged in
- Check that signal was created successfully in admin panel
- Refresh the page

---

## Customization

### Change Pricing
1. Create new price in Stripe dashboard
2. Update `STRIPE_PRICE_ID` in `.env`
3. Update pricing display in `app/page.tsx` (landing page)

### Change Branding
- Edit colors in `tailwind.config.js`
- Update logo/name in page headers
- Modify text in landing page (`app/page.tsx`)

### Add More Features
- Email notifications: Integrate SendGrid or Resend
- SMS signals: Add Twilio
- Advanced analytics: Add charts with Chart.js
- Mobile app: Build with React Native

---

## Maintenance

### Daily
- Check active subscribers
- Monitor signal performance
- Respond to support requests

### Weekly
- Review subscription metrics
- Check for failed payments
- Analyze which signals performed best

### Monthly
- Review revenue
- Update marketing content
- Plan improvements

---

## Support & Help

### Common Questions

**Q: How do I change the admin password?**
A: Currently, update it in `.env` and run `npm run seed` again, or create a password change feature.

**Q: Can I have multiple admins?**
A: Yes, create more users and set `isAdmin: true` in database.

**Q: How do I handle refunds?**
A: Go to Stripe dashboard → Payments → Find payment → Refund

**Q: Can I add more payment methods?**
A: Yes, Stripe supports many methods. Enable them in Stripe dashboard.

**Q: How do I migrate to production database?**
A: Update DATABASE_URL to PostgreSQL connection string, run `prisma db push`

---

## Next Steps

1. ✅ Complete setup (this guide)
2. 📱 Create Instagram content (see MARKETING.md)
3. 🚀 Deploy to production
4. 💰 Start accepting subscribers
5. 📊 Send quality signals
6. 💬 Engage with community
7. 📈 Scale to $10k+/month

---

## Your Numbers

With 300k Instagram followers:

**If 1% subscribe:**
- 3,000 users × $29/month = **$87,000/month**

**If 0.5% subscribe:**
- 1,500 users × $29/month = **$43,500/month**

**Even 0.25%:**
- 750 users × $29/month = **$21,750/month**

You already have the audience. Now you have the platform. Just execute! 🚀

---

## Files Overview

```
signal-platform/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── auth/              # Login & register
│   ├── dashboard/         # User dashboard
│   └── admin/             # Admin dashboard
├── lib/                   # Backend utilities
│   ├── db.ts             # Database connection
│   ├── auth.ts           # Authentication
│   └── telegram.ts       # Telegram bot
├── prisma/               # Database schema
├── scripts/              # Utility scripts
├── .env                  # Configuration (IMPORTANT!)
├── SETUP-GUIDE.md       # This file
└── MARKETING.md         # Marketing templates
```

---

**You're ready to launch! 🎯**

Any questions? Start with the Quick Start section above and follow step by step.
