'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Signal {
  id: string
  type: string
  asset: string
  market: string
  entryPrice: number
  stopLoss: number | null
  takeProfit: number | null
  leverage: string | null
  notes: string | null
  status: string
  result: string | null
  createdAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [telegramUsername, setTelegramUsername] = useState('')
  const [telegramChatId, setTelegramChatId] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth/login')
      return
    }

    fetchUserData(token)
    fetchSignals(token)
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error('Unauthorized')
      }

      setUser(data)
      setTelegramUsername(data.telegramUsername || '')
      setTelegramChatId(data.telegramChatId || '')
    } catch (error) {
      localStorage.removeItem('token')
      router.push('/auth/login')
    }
  }

  const fetchSignals = async (token: string) => {
    try {
      const res = await fetch('/api/signals?limit=20', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setSignals(data.signals || [])
    } catch (error) {
      console.error('Failed to fetch signals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Failed to create checkout:', error)
    }
  }

  const updateTelegram = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramUsername, telegramChatId }),
      })
      alert('Telegram info updated!')
    } catch (error) {
      console.error('Failed to update telegram:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const hasActiveSubscription = user?.subscription?.status === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">📊 ProSignals</div>
          <div className="space-x-4">
            <span className="text-white">Welcome, {user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Status */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Subscription Status
          </h2>
          {hasActiveSubscription ? (
            <div className="text-green-400 text-lg">
              ✅ Active - You're receiving signals!
            </div>
          ) : (
            <div>
              <div className="text-yellow-400 text-lg mb-4">
                ⚠️ No active subscription
              </div>
              <button
                onClick={handleSubscribe}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Subscribe Now - $29/month
              </button>
            </div>
          )}
        </div>

        {/* Telegram Setup */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Telegram Settings
          </h2>
          <p className="text-gray-300 mb-4">
            To receive signals on Telegram:
            <br />
            1. Start our bot: <a href="https://t.me/YourBotName" className="text-green-400">@YourBotName</a>
            <br />
            2. Type /start and copy your Chat ID
            <br />
            3. Enter your info below
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Telegram Username</label>
              <input
                type="text"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Chat ID</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="123456789"
                className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
              />
            </div>
          </div>
          <button
            onClick={updateTelegram}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Save Telegram Info
          </button>
        </div>

        {/* Recent Signals */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Signals</h2>

          {!hasActiveSubscription && (
            <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-200 px-4 py-3 rounded mb-4">
              Subscribe to view and receive trading signals
            </div>
          )}

          <div className="space-y-4">
            {signals.length === 0 ? (
              <p className="text-gray-400">No signals yet</p>
            ) : (
              signals.map((signal) => (
                <div
                  key={signal.id}
                  className={`bg-white/10 rounded-lg p-4 border-l-4 ${
                    signal.type === 'BUY'
                      ? 'border-green-500'
                      : 'border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span
                        className={`text-xl font-bold ${
                          signal.type === 'BUY'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {signal.type} {signal.asset}
                      </span>
                      <span className="ml-3 text-gray-400 text-sm">
                        {signal.market.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(signal.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Entry</div>
                      <div className="text-white font-bold">
                        {signal.entryPrice}
                      </div>
                    </div>
                    {signal.stopLoss && (
                      <div>
                        <div className="text-gray-400">Stop Loss</div>
                        <div className="text-white font-bold">
                          {signal.stopLoss}
                        </div>
                      </div>
                    )}
                    {signal.takeProfit && (
                      <div>
                        <div className="text-gray-400">Take Profit</div>
                        <div className="text-white font-bold">
                          {signal.takeProfit}
                        </div>
                      </div>
                    )}
                    {signal.leverage && (
                      <div>
                        <div className="text-gray-400">Leverage</div>
                        <div className="text-white font-bold">
                          {signal.leverage}
                        </div>
                      </div>
                    )}
                  </div>

                  {signal.notes && (
                    <div className="mt-3 text-gray-300 text-sm">
                      {signal.notes}
                    </div>
                  )}

                  {signal.status === 'closed' && signal.result && (
                    <div className="mt-3">
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          signal.result === 'win'
                            ? 'bg-green-500/20 text-green-400'
                            : signal.result === 'loss'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {signal.result.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
