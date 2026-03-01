import { db } from './db'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  // Clear existing data
  await db.invoice.deleteMany()
  await db.review.deleteMany()
  await db.booking.deleteMany()
  await db.visit.deleteMany()
  await db.userBadge.deleteMany()
  await db.address.deleteMany()
  await db.bordell.deleteMany()
  await db.badge.deleteMany()
  await db.user.deleteMany()

  // Create badges
  const badges = await Promise.all([
    db.badge.create({
      data: {
        name: 'Premium',
        description: 'Premium üyelik rozeti',
        icon: 'crown',
        color: '#FFD700'
      }
    }),
    db.badge.create({
      data: {
        name: 'Early Adopter',
        description: 'İlk kullanıcılar',
        icon: 'star',
        color: '#4CAF50'
      }
    }),
    db.badge.create({
      data: {
        name: 'Active Member',
        description: 'Aktif üye',
        icon: 'zap',
        color: '#2196F3'
      }
    }),
    db.badge.create({
      data: {
        name: 'Top Reviewer',
        description: 'En çok yorum yapan',
        icon: 'message-circle',
        color: '#9C27B0'
      }
    })
  ])

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const admin = await db.user.create({
    data: {
      email: 'admin@desiremap.de',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  })

  // Create customer users
  const customers = await Promise.all([
    db.user.create({
      data: {
        email: 'max@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Max Mustermann',
        phone: '+49 30 12345678',
        role: 'CUSTOMER',
        status: 'ACTIVE'
      }
    }),
    db.user.create({
      data: {
        email: 'anna@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Anna Schmidt',
        phone: '+49 89 87654321',
        role: 'CUSTOMER',
        status: 'ACTIVE'
      }
    }),
    db.user.create({
      data: {
        email: 'hans@example.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Hans Müller',
        role: 'CUSTOMER',
        status: 'ACTIVE'
      }
    })
  ])

  // Create user badges
  await db.userBadge.create({
    data: { userId: customers[0].id, badgeId: badges[0].id }
  })
  await db.userBadge.create({
    data: { userId: customers[0].id, badgeId: badges[2].id }
  })
  await db.userBadge.create({
    data: { userId: customers[1].id, badgeId: badges[1].id }
  })

  // Create addresses
  await db.address.create({
    data: {
      userId: customers[0].id,
      label: 'Home',
      street: 'Hauptstraße 123',
      city: 'Berlin',
      zip: '10115',
      country: 'Deutschland',
      isDefault: true
    }
  })
  await db.address.create({
    data: {
      userId: customers[0].id,
      label: 'Work',
      street: 'Friedrichstraße 45',
      city: 'Berlin',
      zip: '10117',
      country: 'Deutschland',
      isDefault: false
    }
  })

  return { badges, admin, customers }
}

export async function seedBordells() {
  return Promise.all([
    db.bordell.create({
      data: {
        name: 'FKK Oase',
        type: 'FKK',
        location: 'Friedrichstraße 123, Mitte',
        city: 'Berlin',
        distance: '2.5 km',
        rating: 4.8,
        reviewCount: 156,
        priceRange: '€€€',
        minPrice: 80,
        maxPrice: 150,
        ladiesCount: 25,
        services: JSON.stringify(['Sauna', 'Pool', 'Bar', 'Massage']),
        isOpen: true,
        openHours: '11:00 - 05:00',
        verified: true,
        premium: true,
        premiumPlan: 'PREMIUM',
        phone: '+49 30 12345678',
        email: 'info@fkk-oase.de',
        website: 'https://fkk-oase.de',
        description: 'Berlin\'in en büyük FKK saunası.',
        coverImage: '/images/fkk-oase.jpg',
        status: 'ACTIVE',
        views: 5420,
        bookings: 234,
        revenue: 18720
      }
    }),
    db.bordell.create({
      data: {
        name: 'Laufhaus Wien',
        type: 'LAUFHAUS',
        location: 'Kurfürstenstraße 45',
        city: 'Berlin',
        distance: '1.2 km',
        rating: 4.5,
        reviewCount: 89,
        priceRange: '€€',
        minPrice: 50,
        maxPrice: 100,
        ladiesCount: 18,
        services: JSON.stringify(['Bar', 'Private Rooms']),
        isOpen: true,
        openHours: '10:00 - 04:00',
        verified: true,
        phone: '+49 30 23456789',
        description: 'Merkezi konumda laufhaus.',
        coverImage: '/images/laufhaus-wien.jpg',
        status: 'ACTIVE',
        views: 3210,
        bookings: 156,
        revenue: 7800
      }
    }),
    db.bordell.create({
      data: {
        name: 'Studio Elite',
        type: 'STUDIO',
        location: 'Potsdamer Straße 78',
        city: 'Berlin',
        distance: '3.0 km',
        rating: 4.9,
        reviewCount: 67,
        priceRange: '€€€',
        minPrice: 100,
        maxPrice: 200,
        ladiesCount: 8,
        services: JSON.stringify(['VIP Rooms', 'Massage', 'Wellness']),
        isOpen: true,
        openHours: '12:00 - 02:00',
        verified: true,
        premium: true,
        sponsored: true,
        premiumPlan: 'SPONSORED',
        phone: '+49 30 34567890',
        description: 'VIP deneyimi için premium stüdyo.',
        coverImage: '/images/studio-elite.jpg',
        status: 'ACTIVE',
        views: 2890,
        bookings: 98,
        revenue: 11760
      }
    }),
    db.bordell.create({
      data: {
        name: 'Bordell Charlottenburg',
        type: 'BORDELL',
        location: 'Kantstraße 156',
        city: 'Berlin',
        distance: '4.5 km',
        rating: 4.2,
        reviewCount: 45,
        priceRange: '€€',
        minPrice: 60,
        maxPrice: 120,
        ladiesCount: 12,
        services: JSON.stringify(['Bar', 'Private Rooms']),
        isOpen: false,
        openHours: '14:00 - 03:00',
        phone: '+49 30 45678901',
        description: 'Charlottenburg bölgesinde geleneksel bordell.',
        coverImage: '/images/bordell-charlottenburg.jpg',
        status: 'ACTIVE',
        views: 1560,
        bookings: 67,
        revenue: 4020
      }
    }),
    db.bordell.create({
      data: {
        name: 'FKK Artemis',
        type: 'FKK',
        location: 'Halenseestraße 32-36',
        city: 'Berlin',
        distance: '5.0 km',
        rating: 4.7,
        reviewCount: 203,
        priceRange: '€€€',
        minPrice: 90,
        maxPrice: 160,
        ladiesCount: 35,
        services: JSON.stringify(['Sauna', 'Pool', 'Bar', 'Restaurant', 'Cinema']),
        isOpen: true,
        openHours: '11:00 - 05:00',
        verified: true,
        premium: true,
        premiumPlan: 'PREMIUM',
        phone: '+49 30 56789012',
        description: 'Avrupa\'nın en büyük FKK komplekslerinden biri.',
        coverImage: '/images/fkk-artemis.jpg',
        status: 'ACTIVE',
        views: 8920,
        bookings: 412,
        revenue: 37080
      }
    }),
    db.bordell.create({
      data: {
        name: 'Privat Club München',
        type: 'PRIVAT',
        location: 'Schillerstraße 23',
        city: 'München',
        distance: '1.8 km',
        rating: 4.6,
        reviewCount: 34,
        priceRange: '€€€€',
        minPrice: 150,
        maxPrice: 300,
        ladiesCount: 6,
        services: JSON.stringify(['VIP Rooms', 'Champagne', 'Dinner']),
        isOpen: true,
        openHours: '18:00 - 04:00',
        verified: true,
        premium: true,
        premiumPlan: 'PREMIUM',
        phone: '+49 89 12345678',
        description: 'Münih\'te özel ve gizli kulüp.',
        coverImage: '/images/privat-muenchen.jpg',
        status: 'ACTIVE',
        views: 1230,
        bookings: 45,
        revenue: 9000
      }
    })
  ])
}

export async function seedVisitsAndBookings(customers: any[], bordells: any[]) {
  // Create visits
  await Promise.all([
    db.visit.create({
      data: {
        userId: customers[0].id,
        bordellId: bordells[0].id,
        date: new Date('2024-01-15'),
        duration: 60,
        price: 100,
        rating: 5
      }
    }),
    db.visit.create({
      data: {
        userId: customers[0].id,
        bordellId: bordells[2].id,
        date: new Date('2024-02-20'),
        duration: 90,
        price: 180,
        rating: 4
      }
    }),
    db.visit.create({
      data: {
        userId: customers[1].id,
        bordellId: bordells[0].id,
        date: new Date('2024-03-10'),
        duration: 60,
        price: 120
      }
    })
  ])

  // Create bookings
  await Promise.all([
    db.booking.create({
      data: {
        customerId: customers[0].id,
        bordellId: bordells[0].id,
        date: new Date('2024-04-01'),
        time: '20:00',
        duration: 60,
        price: 100,
        status: 'CONFIRMED',
        paymentStatus: 'PAID'
      }
    }),
    db.booking.create({
      data: {
        customerId: customers[0].id,
        bordellId: bordells[2].id,
        date: new Date('2024-04-05'),
        time: '22:00',
        duration: 90,
        price: 180,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    }),
    db.booking.create({
      data: {
        customerId: customers[1].id,
        bordellId: bordells[4].id,
        date: new Date('2024-04-02'),
        time: '19:00',
        duration: 120,
        price: 200,
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        rating: 5,
        review: 'Harika bir deneyimdi!'
      }
    })
  ])

  // Create reviews
  await Promise.all([
    db.review.create({
      data: {
        customerId: customers[0].id,
        bordellId: bordells[0].id,
        rating: 5,
        title: 'Mükemmel deneyim',
        content: 'FKK Oase gerçekten harika.',
        status: 'APPROVED'
      }
    }),
    db.review.create({
      data: {
        customerId: customers[0].id,
        bordellId: bordells[2].id,
        rating: 4,
        title: 'İyi ama pahalı',
        content: 'VIP odalar çok lüks ama fiyatlar yüksek.',
        status: 'APPROVED'
      }
    }),
    db.review.create({
      data: {
        customerId: customers[1].id,
        bordellId: bordells[4].id,
        rating: 5,
        title: 'Avrupa\'nın en iyisi',
        content: 'Artemis muhteşem!',
        status: 'PENDING'
      }
    })
  ])
}
