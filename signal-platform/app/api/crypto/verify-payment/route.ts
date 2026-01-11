import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'
import { checkPayment } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId } = await request.json()

    // Find the payment
    const payment = await prisma.cryptoPayment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (payment.status === 'verified') {
      return NextResponse.json({
        verified: true,
        message: 'Payment already verified',
      })
    }

    if (payment.status === 'expired' || new Date() > payment.expiresAt) {
      await prisma.cryptoPayment.update({
        where: { id: payment.id },
        data: { status: 'expired' },
      })
      return NextResponse.json({
        verified: false,
        error: 'Payment expired',
      }, { status: 400 })
    }

    // Check if payment was received
    const isPaid = await checkPayment(payment.paymentAddress, payment.amount)

    if (isPaid) {
      // Mark payment as verified
      await prisma.cryptoPayment.update({
        where: { id: payment.id },
        data: {
          status: 'verified',
          verifiedAt: new Date(),
        },
      })

      // Activate subscription
      const subscription = await prisma.subscription.upsert({
        where: { userId: decoded.userId },
        create: {
          userId: decoded.userId,
          paymentMethod: 'crypto',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
        update: {
          paymentMethod: 'crypto',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      return NextResponse.json({
        verified: true,
        message: 'Payment verified! Your subscription is now active.',
        subscription,
      })
    }

    return NextResponse.json({
      verified: false,
      message: 'Payment not yet received. Please wait a few minutes and try again.',
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
