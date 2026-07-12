import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { propertyCatalog } from "@/lib/property-catalog";

const supportImageUrl =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=82";

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-2.5rem)] max-w-[1220px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-16">
        <div className="max-w-2xl">
          <div>
            <h1 className="text-[clamp(2.45rem,5.4vw,4.65rem)] font-semibold leading-[0.93] tracking-[-0.065em] text-navy">
              A guest guide for the first five minutes of every stay
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Open a property guide with arrival instructions, booking details,
              house rules, local recommendations, and fast help when guests
              need it.
            </p>

            <div className="atlas-paper app-surface mt-7 max-w-xl rounded-[2rem] border border-line p-4 shadow-raised sm:mt-9 sm:p-6">
              <div className="relative z-10">
                <PropertyCodeForm />
              </div>
            </div>
          </div>
        </div>

        <ArrivalSupportVisual />
      </section>

      <section className="mx-auto mt-10 max-w-[1180px] pb-10 sm:mt-16 sm:pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
              Featured stays
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-navy sm:text-4xl">
              Explore the property guides
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[18rem]">
          {propertyCatalog.map((property, index) => (
            <Link
              key={property.code}
              href={`/${property.code}`}
              className={`group relative min-h-[21rem] overflow-hidden rounded-[1.6rem] border border-line bg-navy shadow-card transition hover:-translate-y-1 hover:border-coral/60 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
                <Image
                  src={property.images[0]}
                  alt={property.name}
                  fill
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                  className="object-cover opacity-88 transition duration-700 group-hover:scale-105"
                />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/18 to-transparent" />
              <div className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
                {property.code}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun">
                  {property.market}
                </p>
                <h3 className={`${index === 0 ? "text-3xl" : "text-lg"} mt-2 font-semibold leading-none tracking-[-0.04em]`}>
                  {property.name}
                </h3>
                <p className="mt-2 text-sm leading-5 text-white/78">
                  {property.address.neighborhood}, {property.address.city}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-white backdrop-blur">
                    <Users className="h-3.5 w-3.5" aria-hidden />
                    {property.guestCapacity} guests
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-white backdrop-blur">
                    <BedDouble className="h-3.5 w-3.5" aria-hidden />
                    {property.bedroomQuantity} bed
                    {property.bedroomQuantity > 1 ? "s" : ""}
                  </span>
                </div>
                <p className="mt-3 text-xs font-semibold text-white/82">
                  {property.typeLabel} · Self check-in
                </p>
              </div>
            </Link>
          ))}
        </div>
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
      <div className="relative h-[280px] w-full max-w-lg overflow-hidden rounded-[2rem] border border-line bg-surface shadow-raised sm:h-[420px] lg:h-[560px] lg:max-w-none">
        <Image
          src={supportImageUrl}
          alt="Modern short-term rental living room"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/72 via-navy-900/8 to-transparent" />
        <div className="absolute left-4 top-4 h-20 w-20 rounded-full border border-white/25 bg-white/10 backdrop-blur" />

        <div className="absolute inset-x-4 bottom-4 rounded-card border border-white/45 bg-surface/88 p-4 text-navy shadow-raised backdrop-blur-md sm:inset-x-5 sm:bottom-5 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
            Guest guide
          </p>
          <p className="mt-2 text-lg font-semibold tracking-[-0.035em]">
            Access, reservation details, and stay support in one place.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Access", "Booking", "Local tips"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-line bg-fog px-3 py-1 text-xs font-semibold text-navy"
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
