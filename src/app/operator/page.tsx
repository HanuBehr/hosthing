import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  CircleDollarSign,
  Globe2,
  MapPin,
  MessageCircle,
  ParkingCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { propertyCatalog, reservationCatalog } from "@/lib/property-catalog";

export const metadata: Metadata = {
  title: "Operator Dashboard | Hostwise",
  description:
    "Read-only operations dashboard for the Hostwise property guide system.",
};

const marketCount = new Set(propertyCatalog.map((property) => property.market)).size;
const guestCapacity = propertyCatalog.reduce(
  (total, property) => total + property.guestCapacity,
  0,
);
const activeReservations = reservationCatalog.filter(
  (reservation) => reservation.status === "confirmed",
).length;
const parkingReadyCount = propertyCatalog.filter(
  (property) => property.operational.has_parking_spot,
).length;

const operationsStats = [
  {
    label: "Properties",
    value: String(propertyCatalog.length),
    detail: `Across ${marketCount} markets`,
    icon: Building2,
  },
  {
    label: "Confirmed bookings",
    value: String(activeReservations),
    detail: "Arrival details attached",
    icon: CalendarCheck,
  },
  {
    label: "Guest capacity",
    value: String(guestCapacity),
    detail: "Beds, access, and rules modeled",
    icon: Users,
  },
  {
    label: "Parking ready",
    value: `${parkingReadyCount}/${propertyCatalog.length}`,
    detail: "Properties with dedicated instructions",
    icon: ParkingCircle,
  },
] as const;

const marketSummary = [
  { market: "Australia", properties: 2, currency: "AUD" },
  { market: "United States", properties: 2, currency: "USD" },
  { market: "Indonesia", properties: 1, currency: "IDR" },
  { market: "Japan", properties: 1, currency: "JPY" },
  { market: "Brazil", properties: 1, currency: "BRL" },
  { market: "Portugal", properties: 1, currency: "EUR" },
] as const;

export default function OperatorDashboardPage() {
  const topMarkets = [...marketSummary].sort((a, b) => b.properties - a.properties);

  return (
    <main className="app-shell min-h-screen px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
              Operator view
            </p>
            <h1 className="mt-3 max-w-3xl text-[clamp(2.1rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-navy">
              Property operations for guest guides
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Track which stays are ready for guests, where operational details
              live, and which markets need host attention before arrival.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-2.5 text-sm font-semibold text-navy shadow-card transition hover:-translate-y-0.5 hover:border-coral hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Guest launcher
          </Link>
        </header>

        <section className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 lg:grid-cols-4">
          {operationsStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-card border border-line bg-surface/86 p-4 shadow-card sm:p-5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-field bg-coral-soft text-coral">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-navy">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm leading-5 text-muted">{stat.detail}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-card border border-line bg-surface/86 p-4 shadow-card sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                  Property operations
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-navy">
                  Guide inventory
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted">
                Each row represents a property with operational data,
                reservation context, and a local guide ready for guests.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {propertyCatalog.map((property) => (
                <Link
                  href={`/${property.code}`}
                  key={property.code}
                  className="grid gap-3 rounded-panel border border-line bg-surface/92 p-3 shadow-card transition hover:-translate-y-0.5 hover:border-coral/60 hover:bg-fog sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center sm:p-4"
                >
                  <div className="relative h-20 overflow-hidden rounded-field bg-mist sm:h-16">
                    <Image
                      src={property.images[0]}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <p className="font-semibold tracking-[-0.01em] text-navy">
                        {property.name}
                      </p>
                      <span className="rounded-full bg-coral-soft px-2 py-0.5 text-[11px] font-semibold text-coral">
                        {property.code}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-5 text-muted">
                      {property.address.neighborhood}, {property.address.city} · {property.typeLabel}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-semibold">
                      <span className="rounded-full bg-coral-soft px-2 py-0.5 text-coral">
                        {property.guestCapacity} guests
                      </span>
                      <span className="rounded-full bg-fog px-2 py-0.5 text-navy">
                        {property.bedroomQuantity} bed{property.bedroomQuantity > 1 ? "s" : ""}
                      </span>
                      <span className="rounded-full bg-positive-soft px-2 py-0.5 text-positive">
                        Guide ready
                      </span>
                      <span className="rounded-full bg-fog px-2 py-0.5 text-muted">
                        {property.operational.has_parking_spot ? "Parking" : "No parking"}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-line bg-surface/90 px-3 py-1 text-xs font-semibold text-navy">
                    Open guide
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <section className="rounded-card border border-line bg-surface/86 p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                Attention queue
              </p>
              <div className="mt-4 space-y-3">
                <QueueItem
                  icon={<ShieldCheck className="h-4 w-4" aria-hidden />}
                  title="Arrival data ready"
                  text="All listed guides include WiFi, access instructions, rules, host contact, and reservation context."
                />
                <QueueItem
                  icon={<Sparkles className="h-4 w-4" aria-hidden />}
                  title="Local guide coverage"
                  text="Every stay has restaurants, attractions, essential services, and a seasonal note."
                />
                <QueueItem
                  icon={<MessageCircle className="h-4 w-4" aria-hidden />}
                  title="Guest support active"
                  text="Support chat answers from property and booking context with deterministic fallbacks."
                />
              </div>
            </section>

            <section className="rounded-card border border-navy/10 bg-navy p-5 text-white shadow-raised">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-soft">
                Product signals
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                What this dashboard controls
              </h2>
              <div className="mt-5 space-y-3">
                <Signal
                  icon={<Globe2 className="h-4 w-4" aria-hidden />}
                  title="Multi-market catalog"
                  text="The same guide workflow supports apartments, villas, condos, studios, and townhouses across countries."
                />
                <Signal
                  icon={<MessageCircle className="h-4 w-4" aria-hidden />}
                  title="Local guide workflow"
                  text="Local recommendations are prepared on demand, validated, saved, and reused by the guest support chat."
                />
                <Signal
                  icon={<CircleDollarSign className="h-4 w-4" aria-hidden />}
                  title="Reservation context"
                  text="Booking-specific fields like cleaning fee and reservation code are modeled separately from public local content."
                />
              </div>
            </section>

            <section className="rounded-card border border-line bg-surface/86 p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
                Markets
              </p>
              <ul className="mt-4 space-y-3">
                {topMarkets.map((market) => (
                  <li key={market.market} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-semibold text-navy">
                        <MapPin className="h-4 w-4 text-coral" aria-hidden />
                        {market.market}
                      </p>
                      <p className="text-sm text-muted">{market.currency}</p>
                    </div>
                    <span className="rounded-full bg-fog px-3 py-1 text-xs font-semibold text-navy">
                      {market.properties} {market.properties > 1 ? "properties" : "property"}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Signal({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-panel border border-white/12 bg-white/8 p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-field bg-white/10 text-orange">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/68">{text}</p>
      </div>
    </div>
  );
}

function QueueItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-panel border border-line bg-fog/75 p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-navy">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
      </div>
    </div>
  );
}
