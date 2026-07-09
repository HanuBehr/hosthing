import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, ShieldCheck, Users } from "lucide-react";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { BrandLogo } from "@/components/brand/brand-logo";
import { propertyCatalog } from "@/lib/property-catalog";

const supportImageUrl =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=82";

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-8 sm:py-10 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-3rem)] max-w-[1120px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-14">
        <div className="max-w-2xl">
          <BrandLogo />

          <div className="mt-8 sm:mt-12">
            <div className="inline-flex rounded-full border border-line bg-surface/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral shadow-card">
              Host-ready arrival guides
            </div>
            <h1 className="mt-4 text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-navy">
              A guest guide for the first five minutes of every stay
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:mt-5 sm:text-lg">
              Open a property guide with arrival instructions, booking details,
              house rules, local recommendations, and fast help when guests
              need it.
            </p>

            <div className="mt-6 max-w-lg rounded-card border border-line bg-surface p-4 shadow-card sm:mt-8 sm:p-6">
              <PropertyCodeForm />
            </div>

            <div className="mt-5 grid max-w-xl gap-2 text-sm text-muted sm:grid-cols-3">
              {heroSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="rounded-field border border-line bg-surface/70 px-3 py-2 shadow-card"
                  >
                    <Icon className="mb-1 h-4 w-4 text-coral" aria-hidden />
                    <p className="font-semibold text-navy">{signal.label}</p>
                    <p className="mt-0.5 leading-5">{signal.text}</p>
                  </div>
                );
              })}
            </div>

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
            local recommendations, and stay support.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2 lg:grid-cols-4">
          {propertyCatalog.map((property) => (
            <Link
              key={property.code}
              href={`/${property.code}`}
              className="group overflow-hidden rounded-card border border-line bg-surface shadow-card transition hover:-translate-y-1 hover:border-coral/60 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
            >
              <div className="relative h-40 overflow-hidden bg-mist">
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
                <div className="absolute bottom-3 left-3 rounded-full bg-surface/92 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
                  {property.address.neighborhood}
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
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-2.5 py-1 text-coral">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {property.guestCapacity} guests
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-navy">
                    <BedDouble className="h-3.5 w-3.5" aria-hidden />
                    {property.bedroomQuantity} bed
                    {property.bedroomQuantity > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-navy">
                  {property.typeLabel} · Self check-in
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
                Host and guest workflow
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                Guide details that keep each stay moving
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/72 sm:text-base sm:leading-7">
                Each guide brings together access details, house rules,
                reservation context, nearby recommendations, and answers to
                common guest questions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {guideHighlights.map((item) => (
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

const guideHighlights = [
  {
    title: "Arrival details",
    description:
      "WiFi, lock instructions, parking, check-in, check-out, and host contact are kept in one place.",
  },
  {
    title: "Booking context",
    description:
      "Guests can confirm reservation code, dates, guest count, fees, currency, and stay status.",
  },
  {
    title: "Local recommendations",
    description:
      "Restaurants, attractions, essentials, map links, and seasonal notes are tailored to the property location.",
  },
  {
    title: "Guest questions",
    description:
      "The support chat answers from the current property and stay details instead of sending guests hunting.",
  },
] as const;

const heroSignals = [
  {
    label: "Access first",
    text: "WiFi, lock code, parking, and timing are easy to find.",
    icon: ShieldCheck,
  },
  {
    label: "Stay context",
    text: "Booking details travel with the property guide.",
    icon: Users,
  },
  {
    label: "Local map",
    text: "Nearby food, essentials, and attractions are one tap away.",
    icon: MapPin,
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

        <div className="absolute right-3 top-3 rounded-full border border-white/35 bg-white/18 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          8 guides · 6 markets
        </div>

        <div className="absolute inset-x-3 bottom-3 rounded-panel border border-white/40 bg-surface/90 p-3 text-navy shadow-card backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Guest guide
          </p>
          <p className="mt-2 text-base font-semibold tracking-[-0.02em]">
            Access, reservation details, and stay support in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Access", "Booking", "Local tips"].map((label) => (
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
