import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  })
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature') || ''

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          const subscriptionData: any = await stripe.subscriptions.retrieve(
            session.subscription as string
          )

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeSubscriptionId: subscriptionData.id,
              status: 'active',
              currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : null,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscriptionData: any = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscriptionData.customer as string)

        if ('metadata' in customer && customer.metadata?.userId) {
          await prisma.subscription.update({
            where: { userId: customer.metadata.userId },
            data: {
              status: subscriptionData.status,
              currentPeriodEnd: subscriptionData.current_period_end ? new Date(subscriptionData.current_period_end * 1000) : null,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscriptionData = event.data.object as Stripe.Subscription
        const customer = await stripe.customers.retrieve(subscriptionData.customer as string)

        if ('metadata' in customer && customer.metadata?.userId) {
          await prisma.subscription.update({
            where: { userId: customer.metadata.userId },
            data: {
              status: 'canceled',
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
