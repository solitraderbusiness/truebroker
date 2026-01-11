import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get pending payment
    const payment = await prisma.cryptoPayment.findFirst({
      where: {
        userId: decoded.userId,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!payment) {
      return NextResponse.json({ hasPending: false })
    }

    return NextResponse.json({
      hasPending: true,
      payment: {
        id: payment.id,
        paymentAddress: payment.paymentAddress,
        amount: payment.amount,
        currency: payment.currency,
        network: payment.network,
        expiresAt: payment.expiresAt,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payment.paymentAddress}`,
      },
    })
  } catch (error) {
    console.error('Check status error:', error)
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    )
  }
}
