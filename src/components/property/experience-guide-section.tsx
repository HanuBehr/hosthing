"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AlertCircle, Loader2, MapPin, RefreshCw, Sparkles, Utensils } from "lucide-react";

import { SectionTitle } from "@/components/ui/card";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";

type GuideState =
  | { status: "loading" }
  | { status: "ready"; guide: ExperienceGuide }
  | { status: "error"; message: string };

type Place = ExperienceGuide["restaurants"][number];
type Essential = ExperienceGuide["essentials"][number];

const essentialLabels: Record<Essential["type"], string> = {
  pharmacy: "Pharmacy",
  supermarket: "Supermarket",
  hospital: "Hospital",
  other: "Service",
};

export function ExperienceGuideSection({
  propertyCode,
  propertyName,
  location,
}: {
  propertyCode: string;
  propertyName: string;
  location: string;
}) {
  const [state, setState] = useState<GuideState>({ status: "loading" });
  const [retryKey, setRetryKey] = useState(0);
  const retryKeyRef = useRef(retryKey);

  useEffect(() => {
    retryKeyRef.current = retryKey;
  }, [retryKey]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    const currentRetryKey = retryKeyRef.current;

    async function loadGuide(attempt = 0) {
      try {
        const response = await fetch(
          `/api/properties/${encodeURIComponent(propertyCode)}/experience-guide`,
          { method: "POST" },
        );

        if (cancelled || currentRetryKey !== retryKeyRef.current) return;

        if (response.status === 202 && attempt < 12) {
          timeoutId = window.setTimeout(() => void loadGuide(attempt + 1), 2000);
          return;
        }

        const payload = (await response.json()) as {
          guide?: ExperienceGuide;
          error?: string;
        };

        if (!response.ok || !payload.guide) {
          throw new Error(
            payload.error ?? "The local guide could not be generated right now.",
          );
        }

        setState({ status: "ready", guide: payload.guide });
      } catch (error) {
        if (cancelled || currentRetryKey !== retryKeyRef.current) return;

        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "The local guide could not be generated right now.",
        });
      }
    }

    void loadGuide();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [propertyCode, retryKey]);

  function retry() {
    setState({ status: "loading" });
    setRetryKey((current) => current + 1);
  }

  return (
    <section id="experiences" className="scroll-mt-24 border-b border-line bg-transparent pb-6 sm:pb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          eyebrow="AI local guide"
          title="Recommendations near this stay"
          description={`AI-generated recommendations for ${propertyName}, based on ${location}.`}
        />
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-muted">
          <Sparkles className="h-3.5 w-3.5 text-coral" aria-hidden />
          Context-aware AI
        </span>
      </div>

      {state.status === "loading" ? <LoadingGuide /> : null}

      {state.status === "error" ? (
        <div className="mt-4 rounded-panel border border-line bg-surface/85 p-3 sm:mt-5 sm:p-5">
          <div className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
              <AlertCircle className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-navy">Guide unavailable right now</p>
              <p className="mt-1 text-sm leading-6 text-muted">{state.message}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 inline-flex items-center gap-2 rounded-field border border-line bg-surface px-3 py-2 text-sm font-semibold text-navy transition hover:border-coral hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state.status === "ready" ? <GuideContent guide={state.guide} /> : null}
    </section>
  );
}

function LoadingGuide() {
  return (
    <div className="mt-4 rounded-panel border border-line bg-surface/85 p-3 sm:p-4" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-field bg-coral-soft text-coral">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">Generating local recommendations</p>
          <p className="mt-1 text-sm leading-6 text-muted">
            Restaurants, attractions, essential services, and a seasonal tip are being prepared for this address.
          </p>
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-mist" />
            <div className="h-2 w-4/5 rounded-full bg-mist" />
            <div className="h-2 w-2/3 rounded-full bg-mist" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideContent({ guide }: { guide: ExperienceGuide }) {
  return (
    <div className="mt-4 rounded-panel border border-line bg-surface/85 p-3 sm:p-5">
      <p className="text-sm leading-6 text-muted">{guide.welcome_message}</p>

      <div className="mt-4 grid gap-5 sm:mt-5 sm:gap-6 lg:grid-cols-2">
        <GuideGroup
          title="Nearby restaurants"
          icon={<Utensils className="h-4 w-4" aria-hidden />}
          places={guide.restaurants}
        />

        <GuideGroup
          title="Nearby attractions"
          icon={<MapPin className="h-4 w-4" aria-hidden />}
          places={guide.attractions}
        />
      </div>

      <div className="mt-4 border-t border-line pt-4 sm:mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-coral">
          Essential services
        </h3>
        <ul className="mt-3 grid gap-x-5 gap-y-3 sm:grid-cols-2">
          {guide.essentials.map((service) => (
            <li key={`${service.name}-${service.distance}`} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="font-semibold text-navy">{service.name}</p>
                <span className="text-xs font-semibold text-coral">{service.distance}</span>
                <span className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold text-muted">
                  {essentialLabels[service.type]}
                </span>
              </div>
              <p className="mt-1 text-sm leading-5 text-muted">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-field bg-coral-soft/60 px-3 py-2.5 text-sm leading-6 sm:mt-5 sm:px-4 sm:py-3">
        <span className="font-semibold text-navy">Seasonal tip: </span>
        <span className="text-muted">{guide.seasonal_tips}</span>
      </div>
    </div>
  );
}

function GuideGroup({
  title,
  icon,
  places,
}: {
  title: string;
  icon: ReactNode;
  places: Place[];
}) {
  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-coral">
        <span className="grid h-7 w-7 place-items-center rounded-field bg-coral-soft text-coral">{icon}</span>
        {title}
      </h3>
      <ol className="mt-3 divide-y divide-line">
        {places.map((place, index) => (
          <li key={`${place.name}-${place.distance}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 py-3 first:pt-0 last:pb-0">
            <span className="text-xs font-semibold text-coral">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p className="font-semibold text-navy">{place.name}</p>
                <span className="text-xs font-semibold text-muted">{place.distance}</span>
              </div>
              <p className="mt-1 text-sm leading-5 text-muted">{place.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
