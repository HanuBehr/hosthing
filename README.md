# StayPilot AI

AI-powered guest guides for short-term rental operators.

Guests open a property-specific guide, review arrival instructions, house rules, amenities, host contact details, AI-generated local recommendations, and chat with a streaming virtual concierge that understands the current property context.

## Live Demo

Production is deployed on Vercel.

Demo codes:

- `FLN001`
- `CMP001`
- `LAG001`
- `JUR001`
- `STO001`
- `BNU001`
- `BCA001`
- `GRM001`

The current dataset is being migrated from the original Brazil-focused demo to an international portfolio dataset.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- PostgreSQL
- Prisma ORM
- OpenAI via Vercel AI SDK
- Zod
- Vitest
- Vercel

## Features

- Dynamic guest guides by property code at `/[code]`
- Property photos, address, capacity, amenities, and host contact details
- Arrival essentials: WiFi, access instructions, check-in, check-out, and parking
- House rules for pets, smoking, children, babies, and events
- AI-generated local guide persisted in PostgreSQL
- Streaming virtual concierge with property and local-guide context
- Friendly invalid-code page
- Mobile-first responsive layout

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/staypilot_ai"
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

Open `http://localhost:3000` and use one of the demo codes.

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

## Project Structure

```txt
src/app
  App Router pages and API routes

src/components
  UI, guest guide, property, and chat components

src/lib
  Prisma client, validation, formatting, and AI prompts

src/server
  Server-side property and experience-guide access

prisma
  PostgreSQL schema, migrations, and seed data
```

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```
