# Backend Architecture — External Reference Only

Backend lives at https://github.com/ozbakirsahincan/desiremap_core_backend
API endpoint: https://api.desiremap.de
Managed by a colleague — user does NOT maintain backend.

## Backend Stack
- NestJS 11, TypeORM 0.3, Liquibase (schema owner)
- PostgreSQL

## API Surfaces (consumed by frontend)
- Public: /api/public/* (cities, service-types, establishments, events, ticket-tiers)
- Member: /api/member/* (profile, visits, badges, reservations)
- Member auth: /api/member-auth/* (OTP request/verify)
- Admin auth: /api/admin-auth/* (login/refresh/logout)
- Venue auth: /api/venue-auth/* (login/refresh/logout)
- Operator: /api/operator/* (CRUD venues, events, tiers, pricing, reservations)

## Auth Model
- Members: OTP-based, accessToken in body, refreshToken httpOnly cookie
- Operators: password-based, cookies dm_admin_refresh / dm_venue_refresh
- Access token TTL: 15min

## Frontend API Clients
- `src/lib/api.ts` — public/admin features, calls NEXT_PUBLIC_API_URL
- `src/lib/backend-client.ts` — operator/member flows, calls BACKEND_API_URL

## No Backend Code Here
Do not look for API routes, database schemas, or server-side auth in this repo.
