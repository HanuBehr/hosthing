import Image from "next/image";
import Link from "next/link";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { propertyCatalog } from "@/lib/property-catalog";

const supportImageUrl =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=82";

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-[1120px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="max-w-2xl">
          <BrandLogo />

          <div className="mt-8 sm:mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Host-ready arrival guides
            </p>
            <h1 className="mt-4 text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-navy">
              Everything guests need for a smoother stay
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-muted sm:mt-5 sm:text-lg">
              Open a property guide with arrival instructions, booking details,
              house rules, local recommendations, and fast help when guests
              need it.
            </p>

            <div className="mt-6 max-w-lg rounded-card border border-line bg-surface p-4 shadow-card sm:mt-8 sm:p-6">
              <PropertyCodeForm />
            </div>

            <p className="mt-4 text-sm leading-6 text-muted sm:mt-5">
              Arrival details · Booking context · Local recommendations
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/operator"
                className="inline-flex rounded-field border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-navy shadow-card transition hover:border-coral hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              >
                Host dashboard
              </Link>
            </div>
          </div>
        </div>

        <ArrivalSupportVisual />
      </section>

      <section className="mx-auto mt-10 max-w-[1120px] pb-10 sm:mt-14 sm:pb-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Featured stays
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-navy sm:text-3xl">
              Explore the property guides
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            Open a guide for each stay to see arrival details, booking context,
            local recommendations, and the concierge in action.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
          {propertyCatalog.map((property) => (
            <Link
              key={property.code}
              href={`/${property.code}`}
              className="group overflow-hidden rounded-card border border-line bg-surface shadow-card transition hover:-translate-y-1 hover:border-coral/60 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
            >
              <div className="relative h-36 overflow-hidden bg-mist">
                <Image
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-navy/88 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {property.code}
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                  {property.market}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-5 tracking-[-0.02em] text-navy">
                  {property.name}
                </h3>
                <p className="mt-2 text-sm leading-5 text-muted">
                  {property.address.neighborhood}, {property.address.city}
                </p>
                <p className="mt-3 inline-flex rounded-full bg-coral-soft px-3 py-1 text-xs font-semibold text-coral">
                  {property.typeLabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] pb-12 sm:pb-16">
        <div className="rounded-card border border-line bg-navy p-5 text-white shadow-raised sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                Built like a product
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Full-stack hospitality workflow, not a static brochure
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
                The product combines persisted property data, reservation
                context, structured local guide generation, and a concierge
                with deterministic fallbacks for operational questions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {architectureHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-panel border border-white/12 bg-white/8 p-4 backdrop-blur"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/68">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const architectureHighlights = [
  {
    title: "Next.js + React",
    description:
      "Dynamic guide routes, server-loaded context, responsive client chat, and production build checks.",
  },
  {
    title: "PostgreSQL + Prisma",
    description:
      "Property, reservation, and generated local-guide models with migrations and repeatable seed data.",
  },
  {
    title: "AI SDK + OpenAI",
    description:
      "Structured local guide generation, persisted outputs, and streaming concierge responses.",
  },
  {
    title: "Zod + Vitest",
    description:
      "Runtime validation for AI/database boundaries and tests for prompts, formatting, and fallback answers.",
  },
] as const;

function ArrivalSupportVisual() {
  return (
    <aside
      aria-label="Guest support overview"
      className="flex justify-center lg:justify-end"
    >
      <div className="relative h-[240px] w-full max-w-lg overflow-hidden rounded-card border border-line bg-surface shadow-card sm:h-[380px] lg:h-[520px] lg:max-w-none">
        <Image
          src={supportImageUrl}
          alt="Modern short-term rental living room"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />

        <div className="absolute inset-x-3 bottom-3 rounded-panel border border-white/40 bg-surface/90 p-3 text-navy shadow-card backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Guest guide
          </p>
          <p className="mt-2 text-base font-semibold tracking-[-0.02em]">
            Access, reservation details, and AI support in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Access", "Booking", "AI concierge"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-navy"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
