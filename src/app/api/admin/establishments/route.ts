import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// Helper to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'admin') {
    return null
  }
  return session
}

// GET - Get all establishments
export async function GET(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}
    if (status) where.status = status.toUpperCase()
    if (type) where.type = type.toUpperCase()
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { city: { contains: search } }
      ]
    }

    const establishments = await db.bordell.findMany({
      where,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(establishments.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type.toLowerCase(),
      location: e.location,
      city: e.city,
      rating: e.rating,
      reviewCount: e.reviewCount,
      status: e.status.toLowerCase(),
      verified: e.verified,
      premium: e.premium,
      sponsored: e.sponsored,
      views: e.views,
      bookings: e.bookings,
      revenue: e.revenue,
      ownerId: e.ownerId,
      ownerName: e.owner?.name,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString()
    })))
  } catch (error) {
    console.error('Get establishments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create establishment
export async function POST(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name, type, location, city, distance, minPrice, maxPrice,
      priceRange, ladiesCount, services, isOpen, openHours,
      phone, email, website, description, coverImage, images,
      availableSlots, ownerId
    } = body

    const establishment = await db.bordell.create({
      data: {
        name,
        type: type?.toUpperCase() || 'BORDELL',
        location: location || '',
        city: city || '',
        distance: distance || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        priceRange: priceRange || null,
        ladiesCount: ladiesCount || 0,
        services: services ? JSON.stringify(services) : null,
        isOpen: isOpen ?? true,
        openHours: openHours || null,
        phone: phone || null,
        email: email || null,
        website: website || null,
        description: description || null,
        coverImage: coverImage || null,
        images: images ? JSON.stringify(images) : null,
        availableSlots: availableSlots ? JSON.stringify(availableSlots) : null,
        ownerId: ownerId || null,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      id: establishment.id,
      name: establishment.name,
      type: establishment.type.toLowerCase(),
      status: establishment.status.toLowerCase()
    }, { status: 201 })
  } catch (error) {
    console.error('Create establishment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update establishment
export async function PUT(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    // Transform data
    const data: any = {}
    if (updateData.type) data.type = updateData.type.toUpperCase()
    if (updateData.status) data.status = updateData.status.toUpperCase()
    if (updateData.services) data.services = JSON.stringify(updateData.services)
    if (updateData.images) data.images = JSON.stringify(updateData.images)
    if (updateData.availableSlots) data.availableSlots = JSON.stringify(updateData.availableSlots)
    
    // Copy other fields
    const simpleFields = ['name', 'location', 'city', 'distance', 'minPrice', 'maxPrice',
      'priceRange', 'ladiesCount', 'isOpen', 'openHours', 'phone', 'email', 'website',
      'description', 'coverImage', 'verified', 'premium', 'sponsored', 'ownerId']
    
    for (const field of simpleFields) {
      if (updateData[field] !== undefined) {
        data[field] = updateData[field]
      }
    }

    const establishment = await db.bordell.update({
      where: { id },
      data
    })

    return NextResponse.json({
      id: establishment.id,
      name: establishment.name,
      status: establishment.status.toLowerCase()
    })
  } catch (error) {
    console.error('Update establishment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete establishment
export async function DELETE(request: NextRequest) {
  try {
    const session = await checkAdminAccess()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await db.bordell.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete establishment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
