import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, ShowerHead, Users } from "lucide-react";

import { SeazoneLogo } from "@/components/brand/seazone-logo";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ArrivalEssentials } from "@/components/property/arrival-essentials";
import { HouseRules } from "@/components/property/house-rules";
import { StaySummary } from "@/components/property/stay-summary";
import type { Property } from "@/lib/validators/property";

export function PropertyGuide({
  property,
}: {
  property: Property;
}) {
  const heroImage = property.images[0];
  const shouldSkipOptimization = heroImage?.includes("upload.wikimedia.org") ?? false;

  return (
    <main className="seazone-shell min-h-screen pb-24 text-ink">
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`Foto do imóvel ${property.name}`}
            fill
            priority
            unoptimized={shouldSkipOptimization}
            sizes="100vw"
            className="z-0 object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy via-navy/78 to-navy/28" />

        <div className="relative z-20 mx-auto flex min-h-[560px] max-w-7xl flex-col px-5 py-7 sm:px-8 lg:px-10">
          <header className="flex items-center">
            <Link
              href="/"
              aria-label="Voltar para a página inicial"
              className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <SeazoneLogo />
            </Link>
          </header>

          <div className="flex flex-1 flex-col justify-center pb-2 pt-6 sm:pt-8">
            <div className="max-w-3xl space-y-5">
              <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {property.name}
              </h1>
              <p className="flex items-center gap-2 text-lg text-white/88">
                <MapPin className="h-5 w-5 shrink-0 text-orange" aria-hidden />
                <span className="min-w-0 break-words">
                  {property.address.neighborhood}, {property.address.city}/
                  {property.address.state}
                </span>
              </p>
            </div>

            <dl className="mt-8 grid gap-3 sm:max-w-2xl sm:grid-cols-3">
              <HeroStat
                icon={<Users className="h-4 w-4" aria-hidden />}
                label="Hóspedes"
                value={String(property.guestCapacity)}
              />
              <HeroStat
                icon={<BedDouble className="h-4 w-4" aria-hidden />}
                label="Quartos"
                value={String(property.bedroomQuantity)}
              />
              <HeroStat
                icon={<ShowerHead className="h-4 w-4" aria-hidden />}
                label={property.bathroomQuantity > 1 ? "Banheiros" : "Banheiro"}
                value={String(property.bathroomQuantity)}
              />
            </dl>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl min-w-0 gap-2 overflow-x-auto seazone-scroll px-5 py-3 sm:px-8 lg:px-10">
          <NavPill href="#acesso">Acesso</NavPill>
          <NavPill href="#regras">Regras</NavPill>
          <NavPill href="#contato">Contato</NavPill>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
        <div className="space-y-5">
          <ArrivalEssentials property={property} />
          <HouseRules property={property} />
        </div>

        <StaySummary property={property} />
      </div>

      <ChatWidget propertyCode={property.code} />
    </main>
  );
}

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold text-muted transition hover:bg-coral-soft hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
    >
      {children}
    </a>
  );
}

function HeroStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-panel border border-white/20 bg-white/15 px-4 py-4 backdrop-blur">
      <dt className="flex items-center gap-1.5 text-xs font-medium text-white/70">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold leading-none">{value}</dd>
    </div>
  );
}
