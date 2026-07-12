import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { propertyCatalog } from "@/lib/property-catalog";

const previewProperties = propertyCatalog;

const workflowSteps = [
  {
    title: "Add property details",
    body: "Check-in, WiFi, rules, parking, host contact, and local tips.",
  },
  {
    title: "Share one guide",
    body: "Send the guide link with the booking or before arrival.",
  },
  {
    title: "Let guests self-serve",
    body: "Renters find answers and ask stay-specific questions without another thread.",
  },
] as const;

export default function Home() {
  return (
    <main className="app-shell min-h-screen px-4 py-5 text-ink sm:px-8 sm:py-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-2.5rem)] max-w-[1220px] items-center gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-20 lg:py-12">
        <div className="max-w-3xl">
          <h1 className="text-[clamp(2.55rem,5.7vw,5.35rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-navy">
            Give every guest a guide that answers for you
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
              View host dashboard
            </Link>
          </div>
        </div>

        <GuideMockup />
      </section>

      <WorkflowSection />

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

        <div className="mt-6 grid auto-rows-[11rem] gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          {previewProperties.map((property, index) => (
            <GuideCard
              key={property.code}
              property={property}
              className={getMosaicClass(index)}
              featured={index === 0 || index === 3}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function WorkflowSection() {
  return (
    <section className="mx-auto max-w-[1180px] border-y border-line py-9 sm:py-12">
      <div className="grid gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.045em] text-navy sm:text-3xl">
            How Hosthing works
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-base">
            Set up each property once. Guests get one guide they can use before
            and during the stay.
          </p>
        </div>

        <ol className="relative grid gap-5 sm:grid-cols-3 sm:gap-4">
          <span className="pointer-events-none absolute left-4 right-4 top-4 hidden h-px bg-line sm:block" />
          {workflowSteps.map((step, index) => (
            <li key={step.title} className="relative flex gap-3 sm:block">
              <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div className="pt-0.5 sm:mt-4 sm:pt-0">
                <h3 className="font-semibold tracking-[-0.02em] text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GuideMockup() {
  return (
    <aside
      aria-label="Hosthing guide preview"
      className="rounded-[2rem] border border-line/80 bg-surface/92 p-5 shadow-card sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral">
        Guest access
      </p>
      <h2 className="mt-2 text-3xl font-semibold leading-none tracking-[-0.055em] text-navy">
        Open a property guide
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted">
        Enter a code to open the exact guide for a stay, or preview how guests
        see arrival details, rules, local tips, and support.
      </p>

      <div className="mt-6">
        <PropertyCodeForm variant="embedded" showIntro={false} />
      </div>

      <Link
        href={`/${propertyCatalog[0].code}`}
        className="mt-4 inline-flex text-sm font-semibold text-navy underline-offset-4 transition hover:text-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
      >
        Preview {propertyCatalog[0].code}
      </Link>
    </aside>
  );
}

function getMosaicClass(index: number) {
  const classes = [
    "sm:col-span-2 sm:row-span-2",
    "",
    "",
    "lg:col-span-2",
    "",
    "",
    "sm:col-span-2 lg:col-span-1",
    "sm:col-span-2 lg:col-span-1",
  ];

  return classes[index] ?? "";
}

function GuideCard({
  property,
  className,
  featured = false,
}: {
  property: (typeof propertyCatalog)[number];
  className?: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/${property.code}`}
      className={`group relative grid h-full overflow-hidden rounded-[1.35rem] border border-line bg-surface shadow-card transition hover:-translate-y-1 hover:border-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 ${className ?? ""}`}
    >
      <div className={`${featured ? "min-h-[15rem]" : "min-h-[8rem]"} relative overflow-hidden bg-sand`}>
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="(max-width: 1024px) 50vw, 280px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="self-end border-t border-line bg-surface/96 p-4 text-navy">
        <h3 className={`${featured ? "text-2xl" : "text-lg"} font-semibold leading-[1.05] tracking-[-0.04em]`}>
          {property.name}
        </h3>
        <p className="mt-3 flex items-center gap-1.5 text-sm leading-5 text-muted">
          <MapPin className="h-4 w-4 shrink-0 text-coral" aria-hidden />
          {property.address.neighborhood}, {property.address.city}
        </p>
        <p className="mt-3 border-t border-line pt-3 text-xs font-semibold text-muted">
          Guest guide · {property.code}
        </p>
      </div>
    </Link>
  );
}
