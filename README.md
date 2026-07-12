# Hosthing

Guest guides for short-term rental operators.

Hosthing is a rental guest experience app for short-term rental hosts who are tired of repeating check-in instructions, house rules, WiFi details, and local recommendations. Each property has its own guest guide, persisted local content, booking context, and a streaming support chat that answers from the current property and reservation data.

## Live App

Production: https://hosthing.vercel.app

Repository: https://github.com/HanuBehr/hosthing

Sample property codes:

- `SYD001` - Sydney harbour apartment
- `BLI001` - Bali beach villa
- `NYG001` - Greenwich Village condo
- `MEL001` - Melbourne CBD apartment
- `TYO001` - Tokyo micro studio
- `SFO001` - San Francisco townhouse
- `RIO001` - Rio de Janeiro ocean-view flat
- `LIS001` - Lisbon terrace apartment

## Product Features

- Dynamic guest guides by property code at `/[code]`
- Read-only operator dashboard at `/operator`
- Property photos, address, capacity, amenities, and host contact details
- Arrival essentials: WiFi, access instructions, check-in, check-out, and parking
- Reservation context: reservation code, guest name, stay dates, cleaning fee, currency, and status
- Local guide with restaurants, attractions, essential services, and seasonal tips
- Persisted local guide content in PostgreSQL to avoid regenerating on every visit
- Streaming guest support powered by the Vercel AI SDK
- Strict assistant behavior: no invented private details, fees, codes, rules, or contacts
- Friendly invalid-code page and mobile-first responsive UI

## Stack

- **Next.js 16 App Router** for dynamic routes, server-rendered guide pages, and API routes
- **React 19** for interactive client components and the streaming chat widget
- **TypeScript** for typed application boundaries and safer refactors
- **Tailwind CSS v4** for custom design tokens and responsive product UI
- **PostgreSQL** for persistent property, reservation, and generated guide data
- **Prisma 7** for schema modeling, migrations, generated client, and seed workflow
- **Vercel AI SDK** for structured object generation and streaming assistant responses
- **OpenAI** for local guide generation and real-time guest support responses
- **Zod** for runtime validation of database JSON, API input, and AI output
- **Vitest** for unit tests around formatting, prompts, and generated-guide validation
- **Vercel** for production deployment

## Architecture

```txt
src/app
  App Router pages and API routes

src/components
  UI, guest guide, property, reservation, and chat components

src/lib
  Prisma client, validators, formatting helpers, and AI prompts

src/server
  Server-side property, reservation, and experience-guide data access

prisma
  PostgreSQL schema, migrations, and seed data
```

The guide page loads property and reservation context server-side. The local guide section calls an API route that generates a structured guide with OpenAI, validates it with Zod, and persists it in PostgreSQL. The chat route streams an AI answer using the property, reservation, and generated guide as context. If the AI key is unavailable, deterministic fallback responses still answer core operational questions.

The operator dashboard is a read-only product surface that summarizes property inventory, markets, guide coverage, and operational signals for rental managers.

## Assistant Behavior

The assistant is intentionally constrained:

- It can answer operational questions from property data, such as WiFi, access, check-in, check-out, parking, pets, and host contact.
- It can answer booking-specific questions from reservation data, such as reservation code and cleaning fee.
- It can answer local public questions using the generated local guide and safe location-bound knowledge.
- It must refuse or clarify when private data is not present instead of inventing details.
- It includes Google Maps search links when recommending real local places.

## Data Model

Core models:

- `Property`: property code, name, type, capacity, address, operational details, rules, amenities, images, and host information
- `Reservation`: sample booking data connected to a property, including reservation code, guest, dates, guest count, cleaning fee, currency, and status
- `ExperienceGuide`: persisted generated local recommendations with generation status and error state

The included data is safe for a public repository and does not represent real guest records.

## Security Notes

This repository intentionally keeps sample guides public so reviewers can inspect the full guest flow without authentication. In a production guest-guide product, direct public property codes should not expose WiFi passwords, access codes, host phone numbers, or reservation details.

Production hardening path:

- Use signed, expiring guest-guide links scoped to a reservation
- Store only hashed access tokens server-side
- Hide or redact sensitive operational fields until a valid token/session is present
- Add audit logging for guide access and assistant questions
- Separate public local recommendations from private arrival and reservation data

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/hosthing"
OPENAI_API_KEY=""
```

Prepare the database:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000` and use one of the sample property codes.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run db:seed
```

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

## Next Improvements

- Add authenticated owner/admin workflows for managing properties and reservations
- Add tokenized guest access links so private arrival details are not public by code alone
- Add integration tests for chat API fallback behavior
- Add map previews and richer local-guide cards
