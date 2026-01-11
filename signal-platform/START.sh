#!/bin/bash

# Trading Signals Platform - Simple Startup Script

echo "🚀 Starting Trading Signals Platform..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please copy .env.example to .env and add your API keys"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if database exists
if [ ! -f prisma/dev.db ]; then
    echo "🗄️  Setting up database..."
    npm run setup
fi

echo ""
echo "✅ Everything is ready!"
echo ""
echo "Starting services..."
echo "- Web: http://localhost:3000"
echo "- Admin login: admin@signals.com / admin123"
echo ""

# Start the development server
npm run dev
