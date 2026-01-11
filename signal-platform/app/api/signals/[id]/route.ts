import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserFromToken } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const signal = await prisma.signal.update({
      where: { id },
      data: {
        status: data.status,
        result: data.result,
      },
    })

    return NextResponse.json({ signal })
  } catch (error) {
    console.error('Update signal error:', error)
    return NextResponse.json({ error: 'Failed to update signal' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const decoded = await getUserFromToken(token)

    if (!decoded || !decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.signal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete signal error:', error)
    return NextResponse.json({ error: 'Failed to delete signal' }, { status: 500 })
  }
}
