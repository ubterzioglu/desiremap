# DesireMap Backend - Learned 2026-04-22

## Stack
- NestJS 11, TypeORM 0.3 (mapping only), Liquibase (schema owner)
- PostgreSQL on 87.106.222.106:54320, db: postgres

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

## Frontend Contract Gaps (P0)
- Event status: frontend has PUBLISHED, backend uses OPEN
- Reservation mode: frontend has OPEN|FORM|NONE, backend uses AUTO|MANUAL
- Response envelope: frontend expects {success,data}, backend returns flat
- Refresh tokens in httpOnly cookies, not JSON body

## Error Codes
- Format: {statusCode, errorCode, message}
- message always German, UI logic must use errorCode
- 50+ error codes across auth/event/reservation/permission families

## DB Data (live)
- 69 tables, 20 venues, 16 events, 13 operators, 2 members, 13 reservations
