import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Public search for establishments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const city = searchParams.get('city') || ''
    const type = searchParams.get('type') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      status: 'ACTIVE'
    }

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { location: { contains: query } }
      ]
    }

    if (city) {
      where.city = { contains: city }
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    if (minPrice || maxPrice) {
      where.minPrice = {}
      if (minPrice) where.minPrice.gte = parseFloat(minPrice)
      if (maxPrice) where.minPrice.lte = parseFloat(maxPrice)
    }

    const [establishments, total] = await Promise.all([
      db.bordell.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { sponsored: 'desc' },
          { premium: 'desc' },
          { rating: 'desc' }
        ]
      }),
      db.bordell.count({ where })
    ])

    return NextResponse.json({
      results: establishments.map(e => ({
        id: e.id,
        name: e.name,
        type: e.type.toLowerCase(),
        location: e.location,
        city: e.city,
        distance: e.distance,
        rating: e.rating,
        reviewCount: e.reviewCount,
        priceRange: e.priceRange,
        minPrice: e.minPrice,
        maxPrice: e.maxPrice,
        ladiesCount: e.ladiesCount,
        services: e.services ? JSON.parse(e.services) : [],
        isOpen: e.isOpen,
        openHours: e.openHours,
        verified: e.verified,
        premium: e.premium,
        sponsored: e.sponsored,
        phone: e.phone,
        email: e.email,
        website: e.website,
        description: e.description,
        coverImage: e.coverImage,
        images: e.images ? JSON.parse(e.images) : []
      })),
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Search establishments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET single establishment by ID
export async function getEstablishmentById(id: string) {
  const establishment = await db.bordell.findUnique({
    where: { id, status: 'ACTIVE' }
  })

  if (!establishment) return null

  // Increment view count
  await db.bordell.update({
    where: { id },
    data: { views: { increment: 1 } }
  })

  return {
    id: establishment.id,
    name: establishment.name,
    type: establishment.type.toLowerCase(),
    location: establishment.location,
    city: establishment.city,
    distance: establishment.distance,
    rating: establishment.rating,
    reviewCount: establishment.reviewCount,
    priceRange: establishment.priceRange,
    minPrice: establishment.minPrice,
    maxPrice: establishment.maxPrice,
    ladiesCount: establishment.ladiesCount,
    services: establishment.services ? JSON.parse(establishment.services) : [],
    isOpen: establishment.isOpen,
    openHours: establishment.openHours,
    verified: establishment.verified,
    premium: establishment.premium,
    sponsored: establishment.sponsored,
    phone: establishment.phone,
    email: establishment.email,
    website: establishment.website,
    description: establishment.description,
    coverImage: establishment.coverImage,
    images: establishment.images ? JSON.parse(establishment.images) : [],
    availableSlots: establishment.availableSlots ? JSON.parse(establishment.availableSlots) : []
  }
}
