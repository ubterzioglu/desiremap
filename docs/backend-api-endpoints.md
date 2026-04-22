# Backend API Endpoint Reference

**Repo:** `ozbakirsahincan/desiremap_core_backend`  
**Latest commit:** `cec37b92` — fix: restore Dockerfile and entrypoint for Coolify deploy (2026-04-18)  
**Runtime docs:** `/api-docs` · `/api-reference` · `/openapi.json`

## General Rules

- Auth: `Authorization: Bearer <token>` on all member/operator endpoints
- Mutation endpoints: include `idempotencyKey` where required
- All public IDs are UUID-based (`publicId`) — never use numeric DB ids
- `api/internal/*` and `api/integrations/*` are not for frontend use

---

## 1. Member Auth

### `POST /member-auth/request-otp`

Request OTP to member's contact.

```json
{
  "contactType": "EMAIL | PHONE",
  "contactValue": "user@example.com",
  "purpose": "LOGIN | VERIFY_CONTACT",   // optional
  "deviceInfo": "iPhone 15 / iOS 17"     // optional, max 500
}
```

### `POST /member-auth/verify-otp`

Verify OTP and receive session token.

```json
{
  "contactType": "EMAIL | PHONE",
  "contactValue": "user@example.com",
  "code": "123456",                       // exactly 6 chars
  "purpose": "LOGIN | VERIFY_CONTACT",   // optional
  "deviceInfo": "iPhone 15 / iOS 17"     // optional
}
```

**Response:** `{ sessionToken: string }`

---

## 2. Operator Auth

### `POST /operator-auth/login`

```json
{
  "email": "admin@nordicsauna.de",
  "password": "Admin123!"
}
```

**Response:** `{ sessionToken, requirePasswordReset? }`  
**429** = rate limited. `requirePasswordReset: true` → force reset flow.

### `POST /operator-auth/password-reset/request`

```json
{ "email": "admin@nordicsauna.de" }
```

### `POST /operator-auth/password-reset/confirm`

```json
{
  "resetToken": "reset_live_token_12345",
  "password": "NewStrongPass123!"       // min 8, max 255
}
```

### `POST /operator-auth/invitations/accept`

Accept operator invitation via token from invite link. Public endpoint.

---

## 3. Public Browse

No auth required.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/public/cities` | All available cities |
| `GET` | `/public/service-types` | All service type lookup values |
| `GET` | `/public/establishments` | Paginated establishment list (filterable) |
| `GET` | `/public/establishments/:slug` | Single establishment by slug |
| `GET` | `/public/venues/:venuePublicId/events` | Events for a venue |
| `GET` | `/public/events/:eventPublicId/ticket-tiers` | Ticket tiers for an event |

### Query params — `GET /public/establishments`

```
cityId, serviceTypeId, page, limit
```

---

## 4. Member Dashboard

Auth required (`Bearer <memberToken>`).

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/member/profile` | Authenticated member profile |
| `GET` | `/member/reservations` | Member's reservation list |
| `GET` | `/member/visits` | Visit history |
| `GET` | `/member/badges` | Badges / loyalty status |

---

## 5. Member Reservation Flow

### `POST /member/events/:eventPublicId/holds`

Create a reservation hold (capacity lock before committing).

```json
{
  "ticketTierPublicId": "80000000-0000-0000-0000-000000000123",
  "participantCount": 2
}
```

**Response:** `{ holdPublicId, holdToken, expiresAt }`

### `POST /member/holds/:holdPublicId/reservations`

Convert a hold to a reservation.

```json
{
  "holdToken": "hold_live_n1M2x3",
  "idempotencyKey": "checkout-berlin-sauna-night-001",
  "promoCode": "EARLY10",              // optional
  "formResponses": [                   // optional, when event requiresForm
    { "fieldKey": "allergies", "value": "Keine Birke" }
  ],
  "note": "Wir kommen 10 Min später"  // optional, max 2000
}
```

**Response status:** `APPROVED` → success screen, `PENDING` → review pending screen.

### `POST /member/events/:eventPublicId/waitlist`

Join waitlist when capacity is full.

```json
{
  "ticketTierPublicId": "80000000-0000-0000-0000-000000000123",
  "participantCount": 2
}
```

**Response:** `{ waitlistEntryPublicId }`

### `POST /member/reservations/:reservationPublicId/cancel`

Member cancels own reservation.

### `POST /member/reservations/:reservationPublicId/postpone-response`

Respond to postponed event.

```json
{ "decision": "RECONFIRM | DECLINE" }
```

---

## 6. Operator Business & Venue Setup

### `POST /operator/businesses`

Onboard a new business. Creates business account + initial subscription + first invoice.

```json
{
  "legalName": "Nordic Sauna GmbH",
  "displayName": "Nordic Sauna Berlin",
  "billingEmail": "billing@nordicsauna.de",
  "billingPhone": "+49 30 1234567",           // optional
  "taxIdentifier": "DE123456789",             // optional
  "countryCode": "DE",                        // optional, ISO-2
  "timezone": "Europe/Berlin",                // optional, IANA
  "initialPlanPublicId": "20000000-0000-0000-0000-000000000001",
  "seatsPurchased": 10,                       // optional, min 1
  "note": "Pilotkunde für Berlin Launch"      // optional, max 2000
}
```

**Response:** `{ businessAccountPublicId }` — use this in all subsequent routes.

### Venue Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:businessAccountPublicId/venues` | List venues |
| `POST` | `/operator/businesses/:businessAccountPublicId/venues` | Create venue |

#### `POST /operator/businesses/:businessAccountPublicId/venues` body

```json
{
  "cityId": 101,
  "name": "Berlin Mitte Sauna",
  "addressLine": "Torstrasse 21, 10119 Berlin",
  "website": "https://nordicsauna.de/berlin-mitte",   // optional
  "publicEmail": "berlin@nordicsauna.de",             // optional
  "publicPhone": "+49 30 7654321",                    // optional
  "generalNote": "Türöffnung 30 Min vor Start",       // optional
  "reservationNote": "No-show nach 15 Min verfällt",  // optional
  "checkinNote": "Check-in rechts neben Eingang",     // optional
  "serviceTypeIds": [1, 2],                           // required, non-empty
  "policy": {                                         // optional
    "maxActivePendingPerMember": 2,
    "maxActiveTotalPerMember": 4,
    "maxOverlappingActiveReservations": 1,
    "requireVerifiedPhoneForReservation": true,
    "requireVerifiedPhoneForCheckin": false,
    "pendingReviewTtlHours": 24,
    "lateCancelThresholdMinutes": 180,
    "note": "Late arrivals need manual approval"
  }
}
```

---

## 7. Operator Event Lifecycle

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/events` | List events (incl. drafts) |
| `POST` | `/operator/businesses/:bId/venues/:vId/events` | Create event |
| `GET` | `/operator/businesses/:bId/venues/:vId/events/:eId` | Get event detail |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/publish` | Publish event |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/cancel` | Cancel event |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/postpone` | Postpone event |

> Path abbreviations: `bId` = `businessAccountPublicId`, `vId` = `venuePublicId`, `eId` = `eventPublicId`

#### `POST .../events` body

```json
{
  "title": "Friday Sauna Night",
  "description": "Aufguss, Sound und Community-Abend.",  // optional, max 4000
  "startAt": "2026-05-08T19:00:00.000Z",
  "endAt": "2026-05-08T23:00:00.000Z",
  "reservationMode": "AUTO | MANUAL",                    // optional
  "requiresForm": false,                                 // optional
  "capacityTotal": 80,                                   // optional
  "generalNote": "Bitte 15 Min vor Beginn eintreffen",  // optional
  "visibility": "PUBLIC | PRIVATE",                      // optional
  "customerCancellationAllowed": true,                   // optional
  "customerCancellationCutoffMinutes": 120,              // optional
  "checkinOtpPolicy": "OPTIONAL | REQUIRED | DISABLED"  // optional
}
```

---

## 8. Ticket Tiers

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/events/:eId/ticket-tiers` | List tiers |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/ticket-tiers` | Create tier |

#### `POST .../ticket-tiers` body

```json
{
  "code": "STANDARD",                    // alphanumeric + _-
  "name": "Standard Eintritt",
  "description": "Allgemeiner Einlass", // optional
  "currencyCode": "EUR",                 // 3-letter ISO
  "basePriceAmount": "25.00",            // decimal string
  "capacityTotal": 60,                   // optional
  "minParticipantCount": 1,             // optional
  "maxParticipantCount": 4,             // optional
  "saleStartsAt": "2026-04-01T00:00:00Z", // optional
  "saleEndsAt": "2026-05-08T18:00:00Z",   // optional
  "isDefault": true,                    // optional
  "sortOrder": 0                        // optional
}
```

---

## 9. Pricing Rules

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/events/:eId/pricing-rules` | List rules |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/pricing-rules` | Create rule |

#### `POST .../pricing-rules` body

```json
{
  "code": "EARLY_BIRD",
  "name": "Early Bird Discount",
  "ruleType": "PERCENTAGE | FIXED",
  "triggerType": "DATE_RANGE | PARTICIPANT_COUNT | ALWAYS",
  "discountType": "PERCENTAGE | FIXED_AMOUNT",
  "discountValue": "15.00",
  "maxDiscountAmount": "20.00",       // optional
  "ticketTierPublicId": "...",         // optional, target specific tier
  "minParticipantCount": 2,           // optional
  "maxParticipantCount": 8,           // optional
  "startsAt": "2026-04-01T00:00:00Z", // optional
  "endsAt": "2026-05-01T00:00:00Z",   // optional
  "priority": 10,                     // optional
  "isStackable": false,               // optional
  "usageLimitTotal": 100,             // optional
  "criteriaJson": {}                  // optional
}
```

---

## 10. Promo Codes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/events/:eId/promo-codes` | List codes |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/promo-codes` | Create code |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/promo-codes/:promoCodePublicId/disable` | Disable code |

#### `POST .../promo-codes` body

```json
{
  "code": "EARLY10",
  "campaignName": "Spring Launch",       // optional
  "pricingRulePublicId": "...",           // optional
  "usageLimitTotal": 500,               // optional
  "usageLimitPerMember": 1,             // optional
  "startsAt": "2026-04-01T00:00:00Z",   // optional
  "endsAt": "2026-05-31T23:59:59Z",     // optional
  "metadataJson": {}                    // optional
}
```

---

## 11. Event Form Fields

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/events/:eId/form-fields` | List fields |
| `POST` | `/operator/businesses/:bId/venues/:vId/events/:eId/form-fields` | Create field |
| `PATCH` | `/operator/businesses/:bId/venues/:vId/events/:eId/form-fields/:fieldKey` | Update field |
| `DELETE` | `/operator/businesses/:bId/venues/:vId/events/:eId/form-fields/:fieldKey` | Delete field |

#### `POST .../form-fields` body

```json
{
  "fieldKey": "allergies",
  "label": "Allergien",
  "fieldType": "TEXT | SELECT | BOOLEAN | NUMBER",
  "isRequired": false,           // optional
  "isCheckinRelevant": false,    // optional
  "validationRule": null,        // optional
  "optionsJson": [],             // optional, for SELECT type
  "sortOrder": 0                 // optional
}
```

---

## 12. Operator Reservation Operations

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/operator/businesses/:bId/venues/:vId/reservations/:rId/approve` | Approve |
| `POST` | `/operator/businesses/:bId/venues/:vId/reservations/:rId/reject` | Reject |
| `POST` | `/operator/businesses/:bId/venues/:vId/reservations/:rId/cancel` | Operator cancel |
| `POST` | `/operator/businesses/:bId/venues/:vId/reservations/:rId/check-in/request-otp` | Request check-in OTP |
| `POST` | `/operator/businesses/:bId/venues/:vId/reservations/:rId/check-in/complete` | Complete check-in |

> `rId` = `reservationPublicId`

---

## 13. Operator Management

### Venue Scope (Invitations)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/venues/:vId/operators/invitations` | List invitations |
| `POST` | `/operator/businesses/:bId/venues/:vId/operators/invitations` | Invite operator |
| `POST` | `/operator/businesses/:bId/venues/:vId/operators/invitations/:opId/resend` | Resend invite |
| `POST` | `/operator/businesses/:bId/venues/:vId/operators/invitations/:opId/revoke` | Revoke invite |
| `POST` | `/operator/businesses/:bId/venues/:vId/operators/invitations/:opId/deprovision` | Deprovision |

#### `POST .../invitations` body

```json
{
  "email": "staff@nordicsauna.de",
  "displayName": "Max Müller",
  "roleCode": "VENUE_STAFF"
}
```

### Business Scope

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/operator/businesses/:bId/operators` | List business operators |
| `POST` | `/operator/businesses/:bId/operators/:opId/deprovision` | Deprovision operator |
| `POST` | `/operator/businesses/:bId/operators/:opId/disable` | Disable operator |
| `POST` | `/operator/businesses/:bId/operators/:opId/reactivate` | Reactivate operator |

---

## 14. Security & Risk

### Session Revocation

| Method | Path |
|--------|------|
| `POST` | `/operator/security/members/:memberPublicId/sessions/revoke` |
| `POST` | `/operator/security/operators/:operatorPublicId/sessions/revoke` |

### Member Restrictions (Venue Scope)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/operator/businesses/:bId/venues/:vId/members/:mId/restrictions` | Apply restriction |
| `POST` | `/operator/businesses/:bId/venues/:vId/members/:mId/restrictions/:restrictionType/revoke` | Revoke restriction |

#### `POST .../restrictions` body

```json
{
  "restrictionType": "ENTRY_BAN | PENDING_REVIEW",
  "reasonCode": "NO_SHOW",          // optional
  "note": "Did not show up twice",   // optional
  "startsAt": "2026-04-21T00:00:00Z", // optional
  "endsAt": "2026-07-01T00:00:00Z"   // optional
}
```

### Risk Signals

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/operator/security/members/:memberPublicId/risk-signals` | Create risk signal |
| `POST` | `/operator/security/risk-signals/:riskSignalId/review` | Review signal |
| `POST` | `/operator/security/risk-signals/:riskSignalId/escalate-restriction` | Escalate to restriction |

#### `POST .../risk-signals` body

```json
{
  "signalCode": "AGGRESSIVE_BEHAVIOR",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "scoreDelta": 25,
  "note": "Reported by staff",       // optional
  "expiresAt": "2026-10-01T00:00:00Z" // optional
}
```

---

## 15. Subscriptions

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/operator/businesses/:bId/subscription/change` | Change plan |
| `POST` | `/operator/businesses/:bId/subscription/pause` | Pause subscription |
| `POST` | `/operator/businesses/:bId/subscription/cancel` | Cancel subscription |

#### `POST .../subscription/change` body

```json
{
  "targetPlanPublicId": "20000000-0000-0000-0000-000000000002",
  "note": "Upgrading to premium"   // optional
}
```

---

## Module Map

| Module | Prefix |
|--------|--------|
| member-auth | `/member-auth` |
| operator-auth | `/operator-auth` |
| venues (public) | `/public` |
| ticket-tiers (public) | `/public/events/:id/ticket-tiers` |
| member-auth dashboard | `/member` |
| reservation-holds | `/member/events/:id/holds` |
| reservations (member) | `/member/holds/:id/reservations`, `/member/reservations` |
| waitlists | `/member/events/:id/waitlist` |
| subscriptions | `/operator/businesses` |
| venues (operator) | `/operator/businesses/:bId/venues` |
| events | `/operator/businesses/:bId/venues/:vId/events` |
| ticket-tiers | `/operator/.../events/:eId/ticket-tiers` |
| pricing | `/operator/.../events/:eId/pricing-rules` |
| promo-codes | `/operator/.../events/:eId/promo-codes` |
| reservations (operator) | `/operator/businesses/:bId/venues/:vId/reservations` |
| operators | `/operator/businesses/:bId/venues/:vId/operators` |
| restrictions | `/operator/security`, `/operator/businesses/:bId/venues/:vId/members` |
| risk-signals | `/operator/security` |
