import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'
import { generatePaymentAddress, getUSDTPrice } from '@/lib/crypto'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if already has active subscription
    if (user.subscription?.status === 'active') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 })
    }

    // Check if there's a pending payment
    const existingPayment = await prisma.cryptoPayment.findFirst({
      where: {
        userId: user.id,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    })

    if (existingPayment) {
      return NextResponse.json({
        paymentAddress: existingPayment.paymentAddress,
        amount: existingPayment.amount,
        currency: existingPayment.currency,
        network: existingPayment.network,
        expiresAt: existingPayment.expiresAt,
      })
    }

    // Generate new payment address
    const paymentData = generatePaymentAddress(user.id)
    const amount = getUSDTPrice()

    // Create payment record
    const payment = await prisma.cryptoPayment.create({
      data: {
        userId: user.id,
        paymentAddress: paymentData.address,
        amount: amount,
        currency: 'USDT',
        network: 'TRC20',
        status: 'pending',
        expiresAt: paymentData.expiresAt,
      },
    })

    return NextResponse.json({
      paymentAddress: payment.paymentAddress,
      amount: payment.amount,
      currency: payment.currency,
      network: payment.network,
      expiresAt: payment.expiresAt,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${payment.paymentAddress}`,
    })
  } catch (error) {
    console.error('Create crypto payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
