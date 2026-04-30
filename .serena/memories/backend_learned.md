# Backend API Reference — External (Read-Only)

Backend repo: https://github.com/ozbakirsahincan/desiremap_core_backend
API: https://api.desiremap.de
Managed by colleague — user does NOT maintain backend.

## Stack
- NestJS 11, TypeORM 0.3, Liquibase (schema owner)
- PostgreSQL

## Module Count: 19
tenancy, venues, events, ticket-tiers, pricing, reservation-holds, reservations, waitlists, member-auth, operator-auth, operators, operator-access, session-security, restrictions, risk-signals, subscriptions, async-workflows, integrations, cleanup

## Key API Surfaces
- Public: /api/public/* (cities, service-types, establishments, events, ticket-tiers)
- Member: /api/member/* (profile, visits, badges, reservations)
- Member auth: /api/member-auth/* (OTP request/verify)
- Admin auth: /api/admin-auth/* (login/refresh/logout)
- Venue auth: /api/venue-auth/* (login/refresh/logout)
- Operator: /api/operator/* (CRUD for venues, events, tiers, pricing, reservations, operators, security)

## Auth Model
- Members: OTP-based, accessToken in body, refreshToken httpOnly cookie (dm_member_refresh)
- Operators: password-based, separate admin/venue portals, cookies dm_admin_refresh / dm_venue_refresh
- Access token TTL: 15min, Refresh: 720min (operator), 10080min (member)

## Error Codes
- Format: {statusCode, errorCode, message}
- message always German, UI logic must use errorCode
