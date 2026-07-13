# Hosthing Architecture

Hosthing is a Next.js App Router application for public sample property guides and reservation-scoped private guest access.

```mermaid
flowchart LR
  Guest[Guest browser] --> Route[Dynamic /[code] route]
  Route --> PropertyLoader[getPropertyByCode]
  Route --> Token[verifyGuestAccessToken]
  PropertyLoader --> DB[(PostgreSQL via Prisma)]
  PropertyLoader --> Catalog[fictional catalog fallback]
  Token --> Private{valid token?}
  Private -->|yes| Reservation[Reservation context]
  Private -->|no| Redaction[redacted private fields]
  Route --> GuideUI[Guest guide UI]
  GuideUI --> GuideAPI[experience-guide API]
  GuideUI --> ChatAPI[streaming chat API]
  GuideAPI --> AI[OpenAI structured generation]
  GuideAPI --> Zod[Zod validation]
  GuideAPI --> Persist[ExperienceGuide persistence]
  ChatAPI --> Limits[rate/token limits]
  ChatAPI --> Audit[AuditEvent]
  ChatAPI --> Stream[Vercel AI SDK stream]
  ChatAPI --> Fallback[deterministic fallback]
```

## Request Flow

The guest guide page is served by `src/app/[code]/page.tsx`. The route reads the property code, loads the property server-side with `getPropertyByCode`, and validates the optional `token` query parameter with `verifyGuestAccessToken`.

If the token is valid, it must be signed, unexpired, stored only as a matching SHA-256 hash, and scoped to a reservation on the requested property. The page then passes the reservation and full operational details to the UI.

If the token is missing, invalid, expired, revoked, or scoped to a different property, the page still renders the fictional public demo property, but `redactPrivatePropertyData` removes private arrival data: WiFi password, access instructions, access codes, exact parking details, host phone, and reservation context.

## Core Models

`Property` stores the property code, address, capacity, amenities, operational arrival details, rules, images, and host contact. Public pages can show general property and local-guide details, but private operational fields are redacted without a valid token.

`Reservation` stores booking-specific data: reservation code, guest name, dates, guest count, cleaning fee, currency, and status. Reservation data is only loaded through a valid guest token.

`ExperienceGuide` stores generated local guide content for a property with status, error state, and generation timestamp. It is property-scoped and safe to show publicly because it contains local recommendations rather than private reservation data.

`GuestAccessToken` stores only `tokenHash`, reservation scope, expiry, revocation timestamp, and last-use timestamp. Raw guest tokens are never persisted.

`AuditEvent` records guide access and assistant questions with property/reservation scope and compact metadata. Audit writes are best-effort so the public demo still works when persistence is unavailable.

## AI Guide Generation

The experience-guide API route loads the current property, checks for a completed persisted guide, and otherwise attempts OpenAI structured object generation through `generateExperienceGuide`.

The prompt is location-scoped to the current property and explicitly forbids invented operational details, reservation numbers, prices, fees, rules, passwords, or contacts. The AI response is validated with `experienceGuideSchema` before being returned or persisted.

If OpenAI is unavailable, the database is unavailable, validation fails, or generation errors, Hosthing returns deterministic fictional catalog guide content from `property-catalog.ts`. This keeps the demo reliable without exposing real guest data.

## Streaming Chat

The chat widget posts the property code, optional access token, and conversation messages to `src/app/api/chat/route.ts`.

The route reloads property context server-side, validates guest access, redacts private data when needed, records an `assistant_question` audit event, enforces configurable message/input/output/rate/token limits, and then streams an answer with the Vercel AI SDK when `OPENAI_API_KEY` is configured.

When OpenAI is unavailable or the stream fails before emitting text, `buildFallbackAnswer` returns deterministic answers from the same scoped context. The fallback refuses to reveal or invent WiFi passwords, access codes, cleaning fees, reservation numbers, parking details, or host contacts when the relevant data is absent or redacted.

## Deployment

The intended production URL is https://hosthing.vercel.app. CI runs on `main` only and verifies installation, Prisma generation, linting, TypeScript, tests, and production build using placeholder environment variables. Real secrets must be configured only in Vercel or local ignored `.env*` files.

Required production settings:

- `DATABASE_URL` or a supported Neon/Postgres URL for Prisma.
- `GUEST_LINK_SECRET` as a long random value; changing it invalidates existing signed links.
- `OPENAI_API_KEY` for live AI generation and chat streaming.
- Optional `AI_CHAT_*` settings for rate, input, output, and token budgets.

## Failure Handling

Database reads fall back to the fictional catalog where safe. Experience-guide generation falls back to deterministic catalog guide content. Audit writes and token last-use updates are best-effort and do not block page rendering. Chat uses deterministic fallback text when OpenAI is missing or fails before streaming.

## Security Limitations

Hosthing is still a portfolio/demo app. It now demonstrates signed guest links, hashed token storage, redaction, audit logging, and AI limits, but it does not include owner/admin authentication, token rotation UI, per-host authorization, billing enforcement, abuse detection, or a full incident/audit dashboard.

The public demo data is fictional and intentionally inspectable. Real deployments should use private production data, strict environment secrets, HTTPS-only links, short token lifetimes, and operational monitoring.

## Deliberate Trade-offs

The implementation favors a small, readable production-hardening slice over a full identity platform. Token validation and private-data gating are server-side, but the app preserves public sample pages so recruiters can review the product without credentials. AI limits are configurable and conservative, but cost governance is still approximate because exact provider billing reconciliation is outside this repo's scope.
