import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Clock3, DoorOpen, MapPin, ShowerHead, Users, Wifi } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ArrivalEssentials } from "@/components/property/arrival-essentials";
import { ExperienceGuideSection } from "@/components/property/experience-guide-section";
import { HouseRules } from "@/components/property/house-rules";
import { ShareGuideButton } from "@/components/property/share-guide-button";
import { StaySummary } from "@/components/property/stay-summary";
import type { Property } from "@/lib/validators/property";
import type { Reservation } from "@/lib/validators/reservation";

export function PropertyGuide({
  property,
  reservation,
}: {
  property: Property;
  reservation: Reservation | null;
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
            className="z-0 object-cover opacity-78"
          />
        ) : null}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy via-navy/68 to-navy/14" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-cream to-transparent" />

        <div className="relative z-20 mx-auto flex min-h-[500px] max-w-7xl flex-col px-4 py-5 sm:min-h-[620px] sm:px-8 sm:py-7 lg:px-10">
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
              <p className="inline-flex rounded-full border border-white/25 bg-white/14 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-soft backdrop-blur">
                Guest guide · {property.code}
              </p>
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

            <div className="mt-5 sm:mt-6">
              <ShareGuideButton
                propertyCode={property.code}
                propertyName={property.name}
              />
            </div>

            <div className="mt-5 grid max-w-4xl gap-2 rounded-card border border-white/28 bg-surface/16 p-3 shadow-pop backdrop-blur-md sm:mt-7 sm:grid-cols-4 sm:p-4">
              <QuickStep
                icon={<Clock3 className="h-4 w-4" aria-hidden />}
                label="Check-in"
                value={`From ${property.rules.check_in_time}`}
              />
              <QuickStep
                icon={<Wifi className="h-4 w-4" aria-hidden />}
                label="WiFi"
                value={property.operational.wifi_network}
              />
              <QuickStep
                icon={<DoorOpen className="h-4 w-4" aria-hidden />}
                label="Access"
                value={property.operational.property_access_type.replaceAll("_", " ")}
              />
              <QuickStep
                icon={<MapPin className="h-4 w-4" aria-hidden />}
                label="Area"
                value={property.address.neighborhood}
              />
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-0 z-30 border-b border-line bg-surface/78 backdrop-blur-xl">
        <div className="app-scroll mx-auto flex max-w-7xl min-w-0 gap-1.5 overflow-x-auto px-4 py-2.5 sm:gap-2 sm:px-8 sm:py-3 lg:px-10">
          <NavPill href="#access">Access</NavPill>
          <NavPill href="#rules">Rules</NavPill>
          <NavPill href="#experiences">Local Guide</NavPill>
          <NavPill href="#contact">Contact</NavPill>
        </div>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-8 sm:py-9 lg:grid-cols-[1.32fr_0.68fr] lg:px-10">
        <div className="space-y-4 sm:space-y-5">
          <ArrivalEssentials property={property} />
          <HouseRules property={property} />
          <ExperienceGuideSection
            propertyCode={property.code}
            propertyName={property.name}
            location={`${property.address.neighborhood}, ${property.address.city}/${property.address.state}`}
          />
        </div>

        <StaySummary property={property} reservation={reservation} />
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
    <div className="rounded-panel border border-white/24 bg-white/14 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
      <dt className="flex items-center gap-1 text-[11px] font-medium text-white/70 sm:gap-1.5 sm:text-xs">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-xl font-semibold leading-none sm:text-2xl">{value}</dd>
    </div>
  );
}

function QuickStep({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-panel border border-white/25 bg-surface/90 p-3 text-navy shadow-card">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-coral">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold capitalize" title={value}>
        {value}
      </p>
    </div>
  );
}
