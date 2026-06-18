"use client";

import { useEffect, useState, useTransition } from "react";
import {
  AlertTriangle,
  HeartPulse,
  MapPin,
  MapPinned,
  Pill,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Sun,
} from "lucide-react";

import { Card, SectionTitle } from "@/components/ui/card";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";

type Status = "idle" | "generating" | "ready" | "error";

type Place = { name: string; distance: string; description: string };

type EssentialType = ExperienceGuide["essentials"][number]["type"];

export function ExperienceGuideSection({
  propertyCode,
  initialGuide,
}: {
  propertyCode: string;
  initialGuide: ExperienceGuide | null;
}) {
  const [guide, setGuide] = useState(initialGuide);
  const [status, setStatus] = useState<Status>(initialGuide ? "ready" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialGuide) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;

    async function loadGuide() {
      setStatus("generating");
      setError(null);

      try {
        const response = await fetch(
          `/api/properties/${propertyCode}/experience-guide`,
          {
            method: "POST",
          },
        );

        if (response.status === 202) {
          timeoutId = window.setTimeout(loadGuide, 2500);
          return;
        }

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(body?.error ?? "Não foi possível gerar o guia.");
        }

        const body = (await response.json()) as { guide: ExperienceGuide };
        if (!cancelled) {
          startTransition(() => {
            setGuide(body.guide);
            setStatus("ready");
          });
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Erro inesperado.");
        }
      }
    }

    void loadGuide();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [attempt, initialGuide, propertyCode]);

  const isLoading = status === "generating" || isPending;

  return (
    <Card className="border-0 bg-transparent p-0 shadow-none">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          eyebrow="Guia local"
          title="Guia de experiências"
          description="Recomendações contextualizadas para o bairro e a cidade deste imóvel."
        />
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-line bg-sand px-3 py-1.5 text-xs font-semibold text-navy">
          <Sparkles className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
          Gerado com IA
        </span>
      </div>

      {status === "ready" && guide ? (
        <div className="mt-6 space-y-6">
          <p className="border-l-2 border-coral pl-4 text-sm leading-7 text-ink sm:text-base">
            {guide.welcome_message}
          </p>

          <GuideList
            title="Restaurantes próximos"
            items={guide.restaurants}
          />
          <GuideList title="Atrações próximas" items={guide.attractions} />
          <EssentialsList items={guide.essentials} />

          <div className="rounded-panel border border-orange/30 bg-orange-soft p-5">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">
              <Sun className="h-4 w-4" aria-hidden="true" />
              Dica sazonal
            </p>
            <p className="mt-2 text-sm leading-7 text-ink">
              {guide.seasonal_tips}
            </p>
          </div>
        </div>
      ) : null}

      {isLoading ? <GuideSkeleton /> : null}

      {status === "error" ? (
        <div className="mt-6 rounded-panel border border-coral/20 bg-coral-soft p-4">
          <p className="flex items-center gap-2 font-semibold text-navy">
            <AlertTriangle className="h-5 w-5 text-coral" aria-hidden="true" />
            Não foi possível gerar o guia agora.
          </p>
          {error ? (
            <p className="mt-2 text-sm leading-6 text-muted">{error}</p>
          ) : null}
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-4 inline-flex items-center gap-2 rounded-field bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </button>
        </div>
      ) : null}
    </Card>
  );
}

function GuideList({ title, items }: { title: string; items: Place[] }) {
  return (
    <div>
      <h3 className="text-base font-semibold tracking-[-0.01em] text-navy">
        {title}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={`${title}-${item.name}`}
            className="min-w-0 rounded-panel border border-line bg-surface/85 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="flex min-w-0 items-center gap-2 font-semibold text-navy">
                <MapPinned
                  className="h-4 w-4 shrink-0 text-coral"
                  aria-hidden="true"
                />
                <span className="break-words">{item.name}</span>
              </p>
              <DistanceBadge distance={item.distance} />
            </div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

const essentialMeta: Record<
  EssentialType,
  { label: string; Icon: typeof Pill }
> = {
  pharmacy: { label: "Farmácia", Icon: Pill },
  supermarket: { label: "Mercado", Icon: ShoppingBag },
  hospital: { label: "Saúde", Icon: HeartPulse },
  other: { label: "Serviço", Icon: MapPin },
};

function EssentialsList({
  items,
}: {
  items: ExperienceGuide["essentials"];
}) {
  return (
    <div>
      <h3 className="text-base font-semibold tracking-[-0.01em] text-navy">
        Serviços essenciais
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const { label, Icon } = essentialMeta[item.type] ?? essentialMeta.other;
          return (
            <article
              key={`essential-${item.name}`}
              className="min-w-0 rounded-panel border border-line bg-surface/85 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="flex min-w-0 items-center gap-2.5 font-semibold text-navy">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-field bg-coral-soft text-coral"
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words">{item.name}</span>
                    <span className="block text-xs font-medium text-muted">
                      {label}
                    </span>
                  </span>
                </p>
                <DistanceBadge distance={item.distance} />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function DistanceBadge({ distance }: { distance: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-navy">
      {distance}
    </span>
  );
}

function GuideSkeleton() {
  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-panel border border-line bg-sand p-5">
        <p className="flex items-center gap-2 font-semibold text-navy">
          <Sparkles className="h-4 w-4 text-orange" aria-hidden="true" />
          Estamos montando seu guia local…
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          A IA está analisando bairro, cidade e época do ano para criar sugestões
          úteis para a sua estadia.
        </p>
      </div>

      <div className="h-16 animate-pulse rounded-panel bg-sand" />

      {Array.from({ length: 2 }).map((_, group) => (
        <div key={group} className="space-y-3">
          <div className="h-4 w-44 animate-pulse rounded-full bg-mist" />
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 rounded-panel border border-line bg-surface p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="h-4 w-28 animate-pulse rounded-full bg-mist" />
                  <div className="h-5 w-14 animate-pulse rounded-full bg-sand" />
                </div>
                <div className="h-3 w-full animate-pulse rounded-full bg-sand" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-sand" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
