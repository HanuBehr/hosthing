"use client";

import { useEffect, useState, useTransition } from "react";
import { MapPinned, Sparkles } from "lucide-react";

import { Card, SectionTitle } from "@/components/ui/card";
import type { ExperienceGuide } from "@/lib/validators/experience-guide";

type Status = "idle" | "generating" | "ready" | "error";

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

  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <SectionTitle
          eyebrow="IA local"
          title="Guia de experiências"
          description="Recomendações contextualizadas para o bairro e a cidade deste imóvel."
        />
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800">
          <Sparkles className="h-4 w-4" />
          Gerado com IA
        </div>
      </div>

      {status === "ready" && guide ? (
        <div className="mt-6 space-y-6">
          <p className="rounded-2xl bg-cyan-50 p-5 leading-7 text-slate-700">
            {guide.welcome_message}
          </p>
          <GuideList title="Restaurantes próximos" items={guide.restaurants} />
          <GuideList title="Atrações próximas" items={guide.attractions} />
          <GuideList title="Serviços essenciais" items={guide.essentials} />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Dica sazonal
            </p>
            <p className="mt-2 leading-7 text-slate-700">{guide.seasonal_tips}</p>
          </div>
        </div>
      ) : null}

      {status === "generating" || isPending ? <GuideSkeleton /> : null}

      {status === "error" ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">
            Não conseguimos gerar o guia agora.
          </p>
          <p className="mt-2 text-sm leading-6 text-red-800">{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((current) => current + 1)}
            className="mt-4 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Tentar novamente
          </button>
        </div>
      ) : null}
    </Card>
  );
}

function GuideList({
  title,
  items,
}: {
  title: string;
  items: Array<{ name: string; distance: string; description: string }>;
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <article key={`${title}-${item.name}`} className="rounded-2xl bg-slate-50 p-4">
            <p className="flex items-center gap-2 font-semibold text-slate-950">
              <MapPinned className="h-4 w-4 text-cyan-700" />
              {item.name}
            </p>
            <p className="mt-1 text-sm font-medium text-cyan-700">
              {item.distance}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function GuideSkeleton() {
  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl bg-cyan-50 p-5">
        <p className="font-semibold text-cyan-900">
          Estamos montando seu guia local...
        </p>
        <p className="mt-2 text-sm text-cyan-800">
          A IA está analisando bairro, cidade e época do ano para criar sugestões úteis.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  );
}
