import Image from "next/image";
import Link from "next/link";
import { BedDouble, Users } from "lucide-react";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { propertyCatalog } from "@/lib/property-catalog";

export default function Home() {
  const heroProperties = propertyCatalog.slice(0, 4);
  const remainingProperties = propertyCatalog.slice(4);

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

        <HeroGuidePreview properties={heroProperties} />
      </section>

      <section className="mx-auto mt-8 max-w-[1180px] pb-10 sm:mt-10 sm:pb-16">
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

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {remainingProperties.map((property, index) => (
            <GuideCard
              key={property.code}
              property={property}
              priority={false}
              className={index === 0 ? "min-h-[18rem] sm:col-span-2" : "min-h-[21rem]"}
            />
          ))}
        </div>
      </section>

    </main>
  );
}

type GuideProperty = (typeof propertyCatalog)[number];

function HeroGuidePreview({ properties }: { properties: GuideProperty[] }) {
  const [featured, ...supporting] = properties;

  return (
    <aside
      aria-label="Featured property guides"
      className="grid gap-4"
    >
      {featured ? (
        <GuideCard property={featured} priority className="min-h-[15rem]" />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-[1fr_0.85fr_1fr]">
        {supporting.map((property, index) => (
          <GuideCard
            key={property.code}
            property={property}
            priority={false}
            className={index === 1 ? "min-h-[17rem]" : "min-h-[14rem]"}
          />
        ))}
      </div>
    </aside>
  );
}

function GuideCard({
  property,
  priority,
  className,
}: {
  property: GuideProperty;
  priority: boolean;
  className: string;
}) {
  return (
    <Link
      href={`/${property.code}`}
      className={`group relative overflow-hidden rounded-[1.6rem] border border-line bg-navy shadow-card transition hover:-translate-y-1 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 ${className}`}
    >
      <Image
        src={property.images[0]}
        alt={property.name}
        fill
        priority={priority}
        sizes={priority ? "(max-width: 1024px) 100vw, 500px" : "(max-width: 1024px) 33vw, 220px"}
        className="object-cover opacity-95 transition duration-500 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 h-3/4 w-full bg-gradient-to-tr from-navy/96 via-navy/68 to-transparent" />
      <div className="absolute bottom-0 left-0 max-w-[88%] p-4 text-white sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun">
          {property.market}
        </p>
        <h3 className={`${priority ? "text-2xl" : "text-base"} mt-2 font-semibold leading-none tracking-[-0.04em]`}>
          {property.name}
        </h3>
        <p className="mt-2 text-sm leading-5 text-white/82">
          {property.address.neighborhood}, {property.address.city}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-white backdrop-blur">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {property.guestCapacity} guests
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-white backdrop-blur">
            <BedDouble className="h-3.5 w-3.5" aria-hidden />
            {property.bedroomQuantity} bed{property.bedroomQuantity > 1 ? "s" : ""}
          </span>
        </div>
        <p className="mt-3 text-xs font-semibold text-white/86">
          {property.typeLabel} · Self check-in · {property.code}
        </p>
      </div>
    </Link>
  );
}
