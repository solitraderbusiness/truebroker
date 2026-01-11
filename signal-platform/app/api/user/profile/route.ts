import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: data.name,
        telegramUsername: data.telegramUsername,
        telegramChatId: data.telegramChatId,
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      telegramUsername: user.telegramUsername,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
