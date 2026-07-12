"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { propertyCodes } from "@/lib/property-catalog";

export function PropertyCodeForm({
  variant = "strip",
  showIntro,
}: {
  variant?: "strip" | "embedded";
  showIntro?: boolean;
}) {
  const router = useRouter();
  const [propertyCode, setPropertyCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const isEmbedded = variant === "embedded";
  const shouldShowIntro = showIntro ?? !isEmbedded;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = propertyCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!code) return;

    startTransition(() => {
      router.push(`/${encodeURIComponent(code)}`);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={isPending}
      className={isEmbedded ? "space-y-2.5" : "flex flex-col gap-3 border-t border-line/80 py-5 sm:flex-row sm:items-center sm:justify-between"}
    >
      {shouldShowIntro ? (
        <div className="min-w-0">
          <label htmlFor="property-code" className="text-sm font-semibold text-navy">
            {isEmbedded ? "Open a guide" : "Already have a property code?"}
          </label>
          <p className="mt-1 text-sm leading-5 text-muted">
            {isEmbedded
              ? "Enter the code from a reservation."
              : "Guests can open the exact guide from their reservation."}
          </p>
        </div>
      ) : null}

      <div className={isEmbedded ? "flex min-w-0 flex-col gap-2" : "flex min-w-0 flex-col gap-2 sm:w-auto sm:min-w-[28rem]"}>
        <div className="flex min-w-0 gap-2">
          <input
            id="property-code"
            value={propertyCode}
            onChange={(event) => setPropertyCode(event.target.value)}
            placeholder="SYD001"
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-white/62 px-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy outline-none transition placeholder:font-semibold placeholder:text-muted/60 hover:border-line-cool focus-visible:border-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/35 focus-visible:ring-offset-2"
            autoComplete="off"
            inputMode="text"
            aria-describedby="property-code-examples"
            aria-label={shouldShowIntro ? undefined : "Property code"}
          />
          <button
            type="submit"
            disabled={isPending || !propertyCode.trim()}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-5 text-sm font-semibold text-white transition hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Open
          </button>
        </div>

        <div
          id="property-code-examples"
          className="app-scroll flex items-center gap-1.5 overflow-x-auto text-xs text-muted sm:flex-wrap sm:overflow-visible"
        >
          <span className="shrink-0">Try</span>
          {propertyCodes.slice(0, 4).map((code) => (
            <Link
              key={code}
              href={`/${code}`}
              className="shrink-0 font-semibold text-navy underline-offset-4 transition hover:text-coral hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
            >
              {code}
            </Link>
          ))}
        </div>
      </div>
    </form>
  );
}
