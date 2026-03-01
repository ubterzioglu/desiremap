import { NextResponse } from 'next/server'
import { seedDatabase, seedBordells, seedVisitsAndBookings } from '@/lib/seedData'

// POST - Seed database with mock data
export async function POST() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding not allowed in production' },
        { status: 403 }
      )
    }

    const { badges, customers } = await seedDatabase()
    const bordells = await seedBordells()
    await seedVisitsAndBookings(customers, bordells)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        badges: badges.length,
        users: customers.length + 1,
        bordells: bordells.length
      }
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seeding failed', details: String(error) },
      { status: 500 }
    )
  }
}
