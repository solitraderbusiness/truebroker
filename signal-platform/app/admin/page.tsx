'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [type, setType] = useState('BUY')
  const [asset, setAsset] = useState('')
  const [market, setMarket] = useState('crypto')
  const [entryPrice, setEntryPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [leverage, setLeverage] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.isAdmin) {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    fetchSignals(token)
  }, [])

  const fetchSignals = async (token: string) => {
    try {
      const res = await fetch('/api/signals?limit=50', {
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

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          asset,
          market,
          entryPrice,
          stopLoss: stopLoss || null,
          takeProfit: takeProfit || null,
          leverage: leverage || null,
          notes: notes || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create signal')
      }

      // Reset form
      setAsset('')
      setEntryPrice('')
      setStopLoss('')
      setTakeProfit('')
      setLeverage('')
      setNotes('')

      // Refresh signals
      fetchSignals(token)

      alert('Signal created and sent to subscribers!')
    } catch (error: any) {
      alert(error.message)
    }
  }

  const handleCloseSignal = async (signalId: string, result: string) => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      await fetch(`/api/signals/${signalId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'closed', result }),
      })

      fetchSignals(token)
    } catch (error) {
      console.error('Failed to close signal:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">📊 Admin Dashboard</div>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Signal Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Create New Signal
            </h2>

            <form onSubmit={handleCreateSignal} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Market</label>
                <select
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                >
                  <option value="crypto">Crypto</option>
                  <option value="forex">Forex</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Asset *</label>
                <input
                  type="text"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  placeholder="BTC/USD, EUR/USD, etc."
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Entry Price *</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="50000"
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Stop Loss</label>
                  <input
                    type="number"
                    step="any"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="48000"
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Take Profit</label>
                  <input
                    type="number"
                    step="any"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="55000"
                    className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Leverage</label>
                <input
                  type="text"
                  value={leverage}
                  onChange={(e) => setLeverage(e.target.value)}
                  placeholder="10x, 20x, etc."
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                />
              </div>

              <div>
                <label className="block text-white mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional information..."
                  rows={3}
                  className="w-full px-4 py-2 rounded bg-white/20 text-white border border-white/30"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
              >
                Create & Send Signal
              </button>
            </form>
          </div>

          {/* Active Signals */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Active Signals
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {signals
                .filter((s) => s.status === 'active')
                .map((signal) => (
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
                          className={`text-lg font-bold ${
                            signal.type === 'BUY'
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {signal.type} {signal.asset}
                        </span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {new Date(signal.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-sm text-gray-300 mb-3">
                      Entry: {signal.entryPrice}
                      {signal.stopLoss && ` | SL: ${signal.stopLoss}`}
                      {signal.takeProfit && ` | TP: ${signal.takeProfit}`}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCloseSignal(signal.id, 'win')}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Close as Win
                      </button>
                      <button
                        onClick={() => handleCloseSignal(signal.id, 'loss')}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Close as Loss
                      </button>
                      <button
                        onClick={() =>
                          handleCloseSignal(signal.id, 'breakeven')
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Breakeven
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* All Signals History */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Signal History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Type</th>
                  <th className="text-left py-3">Asset</th>
                  <th className="text-left py-3">Entry</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Result</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal) => (
                  <tr key={signal.id} className="border-b border-white/10">
                    <td className="py-3 text-sm">
                      {new Date(signal.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={`py-3 font-bold ${
                        signal.type === 'BUY'
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {signal.type}
                    </td>
                    <td className="py-3">{signal.asset}</td>
                    <td className="py-3">{signal.entryPrice}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          signal.status === 'active'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {signal.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {signal.result && (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            signal.result === 'win'
                              ? 'bg-green-500/20 text-green-400'
                              : signal.result === 'loss'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {signal.result}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
