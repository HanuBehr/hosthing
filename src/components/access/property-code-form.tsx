"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const exampleCodes = ["FLN001", "CMP001", "BNU001", "BCA001", "GRM001"];

export function PropertyCodeForm() {
  const router = useRouter();
  const [propertyCode, setPropertyCode] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = propertyCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!code) return;

    startTransition(() => {
      router.push(`/${encodeURIComponent(code)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={isPending}>
      <label
        htmlFor="property-code"
        className="block text-sm font-semibold text-navy"
      >
        Código do imóvel
      </label>
      <p id="property-code-help" className="mt-1.5 text-sm leading-6 text-muted">
        Você encontra esse código na reserva ou no QR Code do imóvel.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <input
          id="property-code"
          value={propertyCode}
          onChange={(event) => setPropertyCode(event.target.value)}
          placeholder="Ex: FLN001"
          className="h-14 min-w-0 flex-1 rounded-field border border-line bg-surface px-4 text-base font-semibold tracking-wide text-navy outline-none transition placeholder:font-medium placeholder:text-muted/70 hover:border-line-cool focus-visible:border-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
          autoComplete="off"
          inputMode="text"
          aria-describedby="property-code-help property-code-examples"
        />
        <button
          type="submit"
          disabled={isPending || !propertyCode.trim()}
          className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-field bg-coral px-6 font-semibold text-white transition hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-36"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Continuar
        </button>
      </div>

      <div
        id="property-code-examples"
        className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted"
      >
        <span>Exemplos para teste:</span>
        {exampleCodes.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setPropertyCode(code)}
            className="rounded-full border border-line bg-surface px-3 py-1.5 font-semibold text-navy transition hover:border-coral hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
          >
            {code}
          </button>
        ))}
      </div>
    </form>
  );
}
