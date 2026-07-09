import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, ShowerHead, Users } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ArrivalEssentials } from "@/components/property/arrival-essentials";
import { ExperienceGuideSection } from "@/components/property/experience-guide-section";
import { HouseRules } from "@/components/property/house-rules";
import { StaySummary } from "@/components/property/stay-summary";
import type { Property } from "@/lib/validators/property";

export function PropertyGuide({
  property,
}: {
  property: Property;
}) {
  const heroImage = property.images[0];
  const shouldSkipOptimization =
    heroImage?.startsWith("/") || heroImage?.includes("upload.wikimedia.org") || false;

  return (
    <main className="app-shell min-h-screen pb-28 text-ink sm:pb-24">
      <section className="relative isolate overflow-hidden bg-navy text-white">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={`Photo of ${property.name}`}
            fill
            priority
            unoptimized={shouldSkipOptimization}
            sizes="100vw"
            className="z-0 object-cover opacity-70"
          />
        ) : null}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy via-navy/78 to-navy/28" />

        <div className="relative z-20 mx-auto flex min-h-[460px] max-w-7xl flex-col px-4 py-5 sm:min-h-[560px] sm:px-8 sm:py-7 lg:px-10">
          <header className="flex items-center">
            <Link
              href="/"
              aria-label="Back to home"
              className="inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <BrandLogo className="text-white" />
            </Link>
          </header>

          <div className="flex flex-1 flex-col justify-center pb-2 pt-5 sm:pt-8">
            <div className="max-w-3xl space-y-4 sm:space-y-5">
              <h1 className="text-[clamp(2.35rem,13vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]">
                {property.name}
              </h1>
              <p className="flex items-center gap-2 text-base text-white/88 sm:text-lg">
                <MapPin className="h-4 w-4 shrink-0 text-orange sm:h-5 sm:w-5" aria-hidden />
                <span className="min-w-0 break-words">
                  {property.address.neighborhood}, {property.address.city}/
                  {property.address.state}
                </span>
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:max-w-2xl sm:gap-3">
              <HeroStat
                icon={<Users className="h-4 w-4" aria-hidden />}
                label="Guests"
                value={String(property.guestCapacity)}
              />
              <HeroStat
                icon={<BedDouble className="h-4 w-4" aria-hidden />}
                label="Bedrooms"
                value={String(property.bedroomQuantity)}
              />
              <HeroStat
                icon={<ShowerHead className="h-4 w-4" aria-hidden />}
                label={property.bathroomQuantity > 1 ? "Bathrooms" : "Bathroom"}
                value={String(property.bathroomQuantity)}
              />
            </dl>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur-xl">
        <div className="app-scroll mx-auto flex max-w-7xl min-w-0 gap-1.5 overflow-x-auto px-4 py-2.5 sm:gap-2 sm:px-8 sm:py-3 lg:px-10">
          <NavPill href="#access">Access</NavPill>
          <NavPill href="#rules">Rules</NavPill>
          <NavPill href="#experiences">Local Guide</NavPill>
          <NavPill href="#contact">Contact</NavPill>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10">
        <div className="space-y-4 sm:space-y-5">
          <ArrivalEssentials property={property} />
          <HouseRules property={property} />
          <ExperienceGuideSection
            propertyCode={property.code}
            propertyName={property.name}
            location={`${property.address.neighborhood}, ${property.address.city}/${property.address.state}`}
          />
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
      className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-muted transition hover:bg-coral-soft hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 sm:px-4"
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
    <div className="rounded-panel border border-white/20 bg-white/15 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
      <dt className="flex items-center gap-1 text-[11px] font-medium text-white/70 sm:gap-1.5 sm:text-xs">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold leading-none sm:text-2xl">{value}</dd>
    </div>
  );
}
