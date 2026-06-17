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
        className="block text-sm font-semibold text-[var(--color-navy)]"
      >
        Código do imóvel
      </label>
      <p id="property-code-help" className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
        Você encontra esse código na reserva ou no QR Code do imóvel.
      </p>

      <div className="mt-3.5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <input
          id="property-code"
          value={propertyCode}
          onChange={(event) => setPropertyCode(event.target.value)}
          placeholder="Ex: FLN001"
          className="h-[3.2rem] min-w-0 flex-1 rounded-[1rem] border border-[#dfe6ec] bg-white px-4 text-base font-semibold tracking-wide text-[var(--color-navy)] outline-none transition placeholder:font-medium placeholder:text-slate-400 hover:border-[#cfd9e2] focus:border-[var(--color-navy)] focus:ring-4 focus:ring-[rgba(255,107,95,0.16)] sm:h-[3.35rem]"
          autoComplete="off"
          inputMode="text"
          aria-describedby="property-code-help property-code-examples"
        />
        <button
          type="submit"
          disabled={isPending || !propertyCode.trim()}
          className="inline-flex h-[3.2rem] w-full items-center justify-center gap-2 rounded-[1rem] bg-[var(--color-coral)] px-6 font-semibold text-white shadow-sm transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[rgba(255,107,95,0.25)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f4b4ae] disabled:text-white/85 sm:h-[3.35rem] sm:w-auto sm:min-w-36"
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
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-coral)] hover:bg-white hover:text-[var(--color-navy-strong)] focus:ring-4 focus:ring-[rgba(255,107,95,0.15)] focus:outline-none"
          >
            {code}
          </button>
        ))}
      </div>
    </form>
  );
}
