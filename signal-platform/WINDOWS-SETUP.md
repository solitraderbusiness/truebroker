# 🖥️ Windows 11 Setup Guide

## Complete Step-by-Step Instructions

### Prerequisites

#### 1. Install Node.js
1. Go to https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run the installer
4. Check "Add to PATH" during installation
5. Verify installation:
```powershell
node --version
npm --version
```

#### 2. Install Git (Optional)
1. Go to https://git-scm.com/download/win
2. Download and install
3. Use default settings

---

## 🚀 Quick Start (Testing on Windows)

### Option 1: Download Code
1. Download the project as ZIP
2. Extract to: `C:\Users\YourName\signal-platform`
3. Open PowerShell or Command Prompt
4. Navigate to folder:
```powershell
cd C:\Users\YourName\signal-platform
```

### Option 2: Clone with Git
```powershell
git clone [repository-url]
cd signal-platform
```

---

## 📦 Installation Steps

### Step 1: Install Dependencies
```powershell
npm install
```
This downloads all required packages (might take 2-3 minutes)

### Step 2: Initialize Database
```powershell
npm run setup
```
This creates the database and admin account

### Step 3: Start the Platform
```powershell
npm run dev
```

### Step 4: Open in Browser
Open: **http://localhost:3000**

---

## 🔐 Admin Access

**Login at:** http://localhost:3000/auth/login

- **Email:** `admin@signals.com`
- **Password:** `admin123`

⚠️ **Change this password after first login!**

---

## 💰 Crypto Payment Setup (USDT TRC20)

### Step 1: Get Your TRON Wallet
1. Install TronLink wallet (Chrome extension or mobile app)
2. Create or import wallet
3. Copy your TRON address (starts with 'T')

### Step 2: Configure in `.env` File
```env
TRON_MASTER_WALLET="YOUR_TRON_ADDRESS_HERE"
```

### Step 3: How Payments Work

1. **User subscribes:**
   - Sees unique payment address
   - Sends $29 USDT (TRC20) to that address
   - System auto-detects payment
   - Subscription activates

2. **You receive payments:**
   - All payments go to YOUR master wallet
   - Automatic verification
   - No manual processing needed

---

## 🤖 Telegram Bot Setup

### Already Configured!
Your bot token is already in `.env`:
```
@deletelater_bot
```

### How to Use:
1. Users start bot on Telegram
2. Copy their Chat ID
3. Enter in dashboard
4. Receive all signals automatically

---

## 🎯 Testing the Platform

### Test as User:
1. Register new account: http://localhost:3000/auth/register
2. Login with new account
3. View signals dashboard
4. Test crypto payment flow

### Test as Admin:
1. Login: http://localhost:3000/auth/login
2. Create a test signal:
   - Type: BUY
   - Asset: BTC/USD
   - Entry: 50000
   - Stop Loss: 48000
   - Take Profit: 55000
3. Check user dashboard - signal appears!

---

## 📁 File Structure

```
signal-platform/
├── app/                    # Frontend pages
│   ├── page.tsx           # Landing page
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   └── api/               # Backend API
│       ├── auth/          # Login/Register
│       ├── signals/       # Signal management
│       └── crypto/        # Crypto payments (NEW!)
├── lib/                   # Backend logic
│   ├── db.ts             # Database
│   ├── auth.ts           # Authentication
│   ├── telegram.ts       # Telegram bot
│   └── crypto.ts         # Crypto payments (NEW!)
├── prisma/               # Database schema
└── .env                  # Configuration
```

---

## 🔧 Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use":
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Or use different port
$env:PORT=3001
npm run dev
```

### Module Not Found
```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

### Database Locked
```powershell
# Close all running instances and restart
npm run setup
```

---

## 🚀 Deploying to Production

### Option 1: Vercel (Easiest)
```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: VPS Server
1. Rent a VPS (DigitalOcean, AWS, etc.)
2. Upload code via FTP or Git
3. Install Node.js on server
4. Run:
```bash
npm install
npm run build
npm start
```

### Option 3: Windows Server
1. Install IIS + iisnode
2. Configure as Node.js application
3. Use process manager (PM2)

---

## 💡 How It All Works

### User Journey:
```
1. Visit Landing Page (localhost:3000)
   ↓
2. Sign Up (/auth/register)
   ↓
3. See Dashboard with "Subscribe" button
   ↓
4. Click "Pay with Crypto"
   ↓
5. Get unique USDT TRC20 address
   ↓
6. Send $29 USDT from their wallet
   ↓
7. System detects payment (30-60 seconds)
   ↓
8. Subscription activates automatically
   ↓
9. Connect Telegram bot
   ↓
10. Receive all signals automatically!
```

### Admin Journey:
```
1. Login as Admin
   ↓
2. Go to Admin Dashboard
   ↓
3. Fill signal form:
   - BUY or SELL
   - Asset (BTC/USD)
   - Entry Price
   - Stop Loss
   - Take Profit
   ↓
4. Click "Create & Send Signal"
   ↓
5. Signal appears in user dashboards
   ↓
6. Telegram bot sends to all active subscribers
   ↓
7. Users get notification instantly!
```

---

## 🔐 Security Notes

### For Testing (Development):
- ✅ SQLite database (fine for testing)
- ✅ Simple JWT auth (fine for testing)
- ✅ HTTP on localhost (fine for testing)

### For Production (Live):
- ⚠️ Use PostgreSQL (not SQLite)
- ⚠️ Use strong JWT secret
- ⚠️ Use HTTPS (SSL certificate)
- ⚠️ Enable CORS properly
- ⚠️ Use environment variables
- ⚠️ Regular backups

---

## 📊 Monitoring Payments

### Check Payments Manually:
1. Go to: https://tronscan.org
2. Enter your master wallet address
3. See all incoming USDT transfers
4. Verify amounts match subscriptions

### Automatic Monitoring:
- Platform checks TronGrid API every time user clicks "Verify Payment"
- Auto-activates subscription when payment detected
- No manual intervention needed

---

## 🎨 Customization

### Change Branding:
1. Edit `app/page.tsx` (landing page)
2. Change "ProSignals" to your brand name
3. Update colors in `tailwind.config.js`

### Change Pricing:
1. Update `.env`:
```env
USDT_PRICE=49  # Change from $29 to $49
```
2. Update landing page text

### Add Features:
- Copy trading integration
- Multiple signal providers
- Performance analytics
- Email notifications
- SMS alerts
- Mobile app

---

## 🆘 Need Help?

### Common Issues:

**Can't access localhost:3000**
- Check if `npm run dev` is running
- Try `http://127.0.0.1:3000` instead
- Check firewall settings

**Payment not verifying**
- Wait 1-2 minutes after sending USDT
- Check TronScan to verify transaction
- Ensure sent to correct address
- Verify amount is exactly $29 USDT

**Signals not appearing**
- Check user has active subscription
- Verify signal was created by admin
- Refresh dashboard page
- Check browser console for errors

---

## 📈 Next Steps After Testing

1. ✅ Test all features locally
2. ✅ Get your own TRON wallet
3. ✅ Update `.env` with your wallet
4. ✅ Test with small USDT amount
5. ✅ Create Instagram content (MARKETING.md)
6. ✅ Deploy to production
7. ✅ Launch and promote!

---

**You're ready to test! Run `npm run dev` and open http://localhost:3000** 🚀
