import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'
import { sendSignalToSubscribers } from '@/lib/telegram'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || 'all'

    // Build where clause
    const where = status === 'all' ? {} : { status }

    const signals = await prisma.signal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({ signals })
  } catch (error) {
    console.error('Fetch signals error:', error)
    return NextResponse.json({ error: 'Failed to fetch signals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Create signal
    const signal = await prisma.signal.create({
      data: {
        type: data.type,
        asset: data.asset,
        market: data.market,
        entryPrice: parseFloat(data.entryPrice),
        stopLoss: data.stopLoss ? parseFloat(data.stopLoss) : null,
        takeProfit: data.takeProfit ? parseFloat(data.takeProfit) : null,
        leverage: data.leverage || null,
        notes: data.notes || null,
      },
    })

    // Send to Telegram subscribers
    const activeSubscribers = await prisma.user.findMany({
      where: {
        telegramChatId: { not: null },
        subscription: {
          status: 'active',
        },
      },
    })

    const chatIds = activeSubscribers
      .map((u) => u.telegramChatId)
      .filter((id): id is string => id !== null)

    if (chatIds.length > 0) {
      await sendSignalToSubscribers(chatIds, signal)
    }

    return NextResponse.json({ signal })
  } catch (error) {
    console.error('Create signal error:', error)
    return NextResponse.json({ error: 'Failed to create signal' }, { status: 500 })
  }
}
