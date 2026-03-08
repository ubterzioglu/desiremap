# Auth System Redesign - PASETO v4 + Google OAuth

## Overview
Replace NextAuth.js with custom PASETO v4 auth system. Google OAuth for Customers, Credentials for Admin/Owner.

## Phase 1: Core Infrastructure

### 1.1 PASETO Token Service
- **File:** `src/lib/auth/paseto.ts`
- Local v4 (symmetric) for speed, 32-byte key from env
- Functions: `encrypt()`, `decrypt()`, `generateToken()`, `verifyToken()`

### 1.2 Password Service
- **File:** `src/lib/auth/password.ts`
- bcrypt with cost factor 12
- Functions: `hash()`, `verify()`

### 1.3 Token Blacklist (Revocation)
- **File:** `src/lib/auth/blacklist.ts`
- Redis or in-memory Set for MVP
- Functions: `revoke()`, `isRevoked()`

## Phase 2: OAuth Integration

### 2.1 Google OAuth Flow
- **File:** `src/lib/auth/oauth/google.ts`
- PKCE flow for security
- Functions: `getAuthUrl()`, `exchangeCode()`, `getUserInfo()`

### 2.2 OAuth Callback Handler
- **File:** `src/app/api/auth/google/callback/route.ts`
- Exchange code → Get user → Create/Update DB → Issue PASETO

## Phase 3: API Routes

### 3.1 Login (Credentials)
- **File:** `src/app/api/auth/login/route.ts`
- Input: email, password
- Output: PASETO token + user info

### 3.2 Register
- **File:** `src/app/api/auth/register/route.ts` (update existing)
- Role assignment: CUSTOMER only via public endpoint

### 3.3 Logout
- **File:** `src/app/api/auth/logout/route.ts`
- Add token JTI to blacklist

### 3.4 Me (Current User)
- **File:** `src/app/api/auth/me/route.ts`
- Verify token, return user

## Phase 4: Middleware & Guards

### 4.1 Auth Middleware
- **File:** `src/middleware.ts`
- Verify PASETO on protected routes
- Inject user into headers

### 4.2 Role Guard Helper
- **File:** `src/lib/auth/guards.ts`
- `requireAuth()`, `requireRole()`, `requireAdmin()`

## Phase 5: Database Updates

### 5.1 Schema Changes
- Add `googleId` to User model
- Add `refreshToken` for future use
- Add `emailVerified` boolean

## Security Checklist
- [ ] PASETO key from env (256-bit)
- [ ] HTTP-only cookies for tokens
- [ ] CSRF protection via SameSite
- [ ] Rate limiting on auth endpoints
- [ ] Input validation with Zod
- [ ] No token in localStorage

## Files to Create/Modify
```
src/lib/auth/
├── paseto.ts          # NEW
├── password.ts        # NEW
├── blacklist.ts       # NEW
├── oauth/
│   └── google.ts      # NEW
└── guards.ts          # NEW

src/app/api/auth/
├── login/route.ts     # NEW
├── logout/route.ts    # NEW
├── me/route.ts        # NEW
└── google/
    ├── route.ts       # NEW (redirect)
    └── callback/route.ts # NEW

src/middleware.ts      # NEW/UPDATE

prisma/schema.prisma   # UPDATE (googleId, emailVerified)
```
