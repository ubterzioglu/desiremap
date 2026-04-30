# Directory Structure — Frontend Only

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Locale-based routing (de, en, ar, tr)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── layout.tsx     # Locale layout with metadata
│   │   │   ├── bordell/       # Establishment detail pages
│   │   │   ├── stadt/         # City pages
│   │   │   ├── blog/          # Blog pages
│   │   │   └── search/        # Search page
│   │   ├── (admin)/           # Admin panel (no locale prefix)
│   │   ├── sitemap.ts         # Dynamic sitemap generation
│   │   └── robots.ts          # Robots.txt generation
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── home/              # Homepage sections
│   │   ├── layout/            # Header, Footer, MobileMenu
│   │   ├── listings/          # ListingCard, ReservationModal
│   │   └── pages/             # Page-level components
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities, API clients, structured data, SEO
│   ├── stores/                # Zustand stores (auth, admin, booking)
│   ├── types/                 # TypeScript types
│   ├── i18n/                  # next-intl configuration
│   └── data/                  # Static data (cities, blog posts)
├── messages/                  # Translation files (de.json, en.json, ar.json, tr.json)
└── public/                    # Static assets
```

No `prisma/`, no `src/app/api/`, no backend code in this repo.
