import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET - Get user badges
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userBadges = await db.userBadge.findMany({
      where: { userId: session.user.id },
      include: {
        badge: true
      },
      orderBy: { earnedAt: 'desc' }
    })

    return NextResponse.json(userBadges.map(ub => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      icon: ub.badge.icon,
      color: ub.badge.color,
      earnedAt: ub.earnedAt.toISOString()
    })))
  } catch (error) {
    console.error('Get badges error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
