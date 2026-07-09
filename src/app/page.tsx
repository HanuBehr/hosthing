import Image from "next/image";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { BrandLogo } from "@/components/brand/brand-logo";

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
              Smart arrival companion
            </p>
            <h1 className="mt-4 text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-navy">
              Open your guest guide
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-muted sm:mt-5 sm:text-lg">
              Enter a property code to view arrival details, house rules,
              local recommendations, and AI-powered support.
            </p>

            <div className="mt-6 max-w-lg rounded-card border border-line bg-surface p-4 shadow-card sm:mt-8 sm:p-6">
              <PropertyCodeForm />
            </div>

            <p className="mt-4 text-sm leading-6 text-muted sm:mt-5">
              24/7 assistant · Arrival details · Local recommendations
            </p>
          </div>
        </div>

        <ArrivalSupportVisual />
      </section>
    </main>
  );
}

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
            Access, WiFi, and check-in details in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Access", "WiFi", "Check-in"].map((label) => (
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
