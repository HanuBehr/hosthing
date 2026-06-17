"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const exampleCodes = ["FLN001", "GRM001"];

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
    <form onSubmit={handleSubmit} className="max-w-xl" noValidate>
      <label
        htmlFor="property-code"
        className="block text-sm font-semibold text-[var(--color-navy)]"
      >
        Código do imóvel
      </label>
      <p
        id="property-code-help"
        className="mt-2 text-sm leading-6 text-[var(--color-muted)]"
      >
        Você encontra esse código na reserva ou no QR Code do imóvel.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="property-code"
          value={propertyCode}
          onChange={(event) => setPropertyCode(event.target.value)}
          placeholder="Ex: FLN001"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 text-base font-semibold tracking-wide text-[var(--color-navy)] shadow-sm outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[var(--seazone-blue,#0067b1)] focus:ring-4 focus:ring-cyan-500/10 sm:h-14"
          autoComplete="off"
          inputMode="text"
          aria-describedby="property-code-help property-code-examples"
        />
        <button
          type="submit"
          disabled={isPending || !propertyCode.trim()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-coral)] px-6 font-semibold text-white shadow-sm transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[var(--color-coral)]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f2b9b3] disabled:text-white/80 sm:h-14 sm:w-auto sm:min-w-44"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Continuar
        </button>
      </div>

      <div
        id="property-code-examples"
        className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]"
      >
        <span>Exemplos para teste:</span>
        {exampleCodes.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setPropertyCode(code)}
            className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 font-semibold text-[var(--color-muted)] transition hover:border-[var(--seazone-blue,#0067b1)]/30 hover:text-[var(--seazone-blue,#0067b1)] focus:ring-4 focus:ring-cyan-500/10 focus:outline-none"
          >
            {code}
          </button>
        ))}
      </div>
    </form>
  );
}
