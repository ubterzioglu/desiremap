# Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Locale-based routing (de, en, ar, tr)
│   │   ├── page.tsx       # Homepage
│   │   ├── layout.tsx     # Locale layout with metadata
│   │   └── search/        # Search page
│   ├── api/               # API routes
│   ├── sitemap.ts         # Dynamic sitemap generation
│   └── robots.ts          # Robots.txt generation
├── components/
│   ├── ui/                # shadcn/ui components (50+ components)
│   ├── home/              # Homepage sections (Hero, Categories, Cities, Promo)
│   ├── layout/            # Header, Footer, LanguageSelector, MobileMenu
│   ├── listings/          # ListingCard, ListingsSection, ReservationModal
│   └── pages/             # Admin, Dashboard, City, Detail, Login pages
├── hooks/                 # Custom hooks (use-mobile, use-toast, useScrollHeader)
├── lib/                   # Utilities (utils, db, search, structuredData)
├── types/                 # TypeScript types (Bordell, Customer, Booking, etc.)
├── i18n/                  # next-intl configuration
└── data/                  # Mock data

messages/                  # Translation files (de.json, en.json, ar.json, tr.json)
prisma/                    # Database schema
.agent/skills/             # Claude Code skills (frontend-design, seo-audit, etc.)
```
