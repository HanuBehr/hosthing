# Changelog

## v0.1.0 - 2026-07-12

- Product scope: public fictional property guides, reservation-scoped private guest links, generated local recommendations, and streaming stay-support chat at https://hosthing.vercel.app.
- Architecture: Next.js App Router, Prisma/PostgreSQL models for properties, reservations, experience guides, hashed guest tokens, and audit events; see `docs/architecture.md`.
- Production hardening: signed expiring guest links, hashed token persistence, private-data redaction without valid access, guide/chat audit records, and configurable AI message/rate/token limits.
- Verification commands: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
- Limitations: no owner/admin authentication, token-management UI, real billing reconciliation, or full audit dashboard; sample data is fictional and intentionally public.
