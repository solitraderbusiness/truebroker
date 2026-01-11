'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">📊 ProSignals</div>
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-white hover:text-gray-300 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Professional Trading Signals
          <br />
          <span className="text-green-400">Crypto & Forex</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Get real-time trading signals from expert traders. Automated delivery
          via Telegram. Start trading like a PRO today.
        </p>
        <Link
          href="/auth/register"
          className="inline-block bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-4 rounded-lg transition transform hover:scale-105"
        >
          Start Free Trial - $29/month
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">
              High Accuracy Signals
            </h3>
            <p className="text-gray-300">
              Professional traders with proven track records provide signals
              with detailed entry, stop loss, and take profit levels.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Instant Delivery
            </h3>
            <p className="text-gray-300">
              Receive signals instantly via Telegram. Never miss a trading
              opportunity with real-time notifications.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">
              Crypto & Forex
            </h3>
            <p className="text-gray-300">
              Get signals for both cryptocurrency and forex markets. Diversify
              your trading portfolio.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-12">
          Simple Pricing
        </h2>
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-lg p-10">
          <div className="text-5xl font-bold text-green-400 mb-2">$29</div>
          <div className="text-gray-300 mb-6">per month</div>
          <ul className="text-left text-gray-300 space-y-3 mb-8">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Unlimited trading signals
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Telegram delivery
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Crypto + Forex signals
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Performance history
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </li>
          </ul>
          <Link
            href="/auth/register"
            className="block bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-3 rounded-lg transition"
          >
            Subscribe Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2025 ProSignals. All rights reserved.</p>
      </footer>
    </div>
  )
}
