import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Clock3,
  DoorOpen,
  LayoutDashboard,
  MapPin,
  Wifi,
} from "lucide-react";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { propertyCatalog } from "@/lib/property-catalog";

const previewProperties = propertyCatalog.slice(0, 4);

const guideRows = [
  { label: "Arrival", value: "Check-in from 3:00 PM", icon: Clock3 },
  { label: "Access", value: "Lockbox, entry steps, and parking", icon: DoorOpen },
  { label: "WiFi", value: "Network and password ready to copy", icon: Wifi },
  { label: "Local", value: "Nearby food, essentials, and tips", icon: MapPin },
] as const;

const workflow = [
  "Add the property details hosts already repeat to guests.",
  "Share one guide link before arrival or attach it to the booking.",
  "Guests open the guide and get answers without another message thread.",
] as const;

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-5 text-ink sm:px-8 sm:py-8 lg:px-10">
      <header className="mx-auto flex max-w-[1220px] items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-baseline gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
        >
          <span className="text-lg font-semibold tracking-[-0.04em] text-navy">Hosthing</span>
          <span className="hidden text-sm font-semibold text-muted sm:inline">
            Guest guide automation
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 text-sm font-semibold">
          <a
            href="#preview"
            className="rounded-full px-3 py-2 text-muted transition hover:bg-coral-soft hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          >
            Preview
          </a>
          <Link
            href="/operator"
            className="rounded-full border border-line bg-surface/78 px-3 py-2 text-navy transition hover:border-coral hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
          >
            Host view
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[calc(100dvh-5.5rem)] max-w-[1220px] items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-20 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
            AI guest guides for short-term rentals
          </p>
          <h1 className="mt-5 text-[clamp(2.55rem,5.7vw,5.35rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-navy">
            Stop answering the same guest questions
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Hosthing creates a shareable guide for each property with check-in
            steps, WiFi, house rules, local tips, booking context, and AI
            answers renters can use before and during their stay.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${propertyCatalog[0].code}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
            >
              Preview guest guide
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/operator"
              className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-navy transition hover:bg-coral-soft hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              View host dashboard
            </Link>
          </div>
        </div>

        <GuideMockup />
      </section>

      <section className="mx-auto max-w-[1180px] pb-8">
        <PropertyCodeForm />
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-4 border-y border-line py-8 sm:grid-cols-3 sm:py-10">
        {workflow.map((step, index) => (
          <div key={step} className="flex gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="max-w-xs text-sm font-semibold leading-6 text-navy sm:text-base">
              {step}
            </p>
          </div>
        ))}
      </section>

      <section id="preview" className="mx-auto max-w-[1180px] scroll-mt-8 py-10 sm:py-14">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-[-0.05em] text-navy sm:text-4xl">
            See what guests receive
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
            Open a property guide to see how arrival details, rules, local tips,
            and support are organized for renters.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {previewProperties.map((property) => (
            <GuideCard key={property.code} property={property} />
          ))}
        </div>
      </section>
    </main>
  );
}

function GuideMockup() {
  return (
    <aside
      aria-label="Hosthing guide preview"
      className="rounded-[2rem] border border-line/80 bg-surface/92 p-3 shadow-card"
    >
      <div className="rounded-[1.55rem] border border-line/80 bg-white/55">
        <div className="flex items-center gap-2 border-b border-line/70 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-cool" />
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="ml-auto text-xs font-semibold text-muted">hosthing.app/SYD001</span>
        </div>

        <div className="p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Guest guide
            </p>
            <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.055em] text-navy">
              Harbour Loft Sydney
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Everything renters need for arrival, access, rules, and local help.
            </p>
          </div>

          <div className="mt-6 divide-y divide-line/70 border-y border-line/70">
            {guideRows.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="grid grid-cols-[2.25rem_5rem_minmax(0,1fr)] items-center gap-3 py-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-coral-soft text-coral">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-semibold text-navy">{item.label}</p>
                  <p className="min-w-0 text-sm leading-5 text-muted">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[1.25rem] bg-navy p-4 text-white">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Bot className="h-4 w-4 text-coral-soft" aria-hidden />
              Ask Hosthing
            </p>
            <p className="mt-3 text-sm leading-6 text-white/78">
              &quot;What is the WiFi password and where do I park?&quot;
            </p>
            <div className="mt-3 border-t border-white/14 pt-3 text-sm leading-6 text-white/88">
              The guide answers from this property&apos;s arrival details, rules, and
              booking context.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function GuideCard({ property }: { property: (typeof propertyCatalog)[number] }) {
  return (
    <Link
      href={`/${property.code}`}
      className="group overflow-hidden rounded-[1.35rem] border border-line bg-surface shadow-card transition hover:-translate-y-1 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
    >
      <div className="relative h-40 overflow-hidden bg-sand">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="(max-width: 1024px) 50vw, 280px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-[1.05] tracking-[-0.04em] text-navy">
          {property.name}
        </h3>
        <p className="mt-3 flex items-center gap-1.5 text-sm leading-5 text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-coral" aria-hidden />
          {property.address.neighborhood}, {property.address.city}
        </p>
        <p className="mt-4 border-t border-line pt-3 text-xs font-semibold text-muted">
          Guest guide · {property.code}
        </p>
      </div>
    </Link>
  );
}
