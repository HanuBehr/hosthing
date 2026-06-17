"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Home, Loader2 } from "lucide-react";

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
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 p-5"
    >
      <label htmlFor="property-code" className="block font-semibold text-slate-950">
        Código do imóvel
      </label>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Exemplo para avaliação: `FLN001` ou `GRM001`.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Home className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-cyan-700" />
          <input
            id="property-code"
            value={propertyCode}
            onChange={(event) => setPropertyCode(event.target.value)}
            placeholder="Ex: FLN001"
            className="h-12 w-full rounded-full border border-cyan-100 bg-white pr-4 pl-12 font-medium tracking-wide text-slate-950 outline-none transition focus:border-cyan-700"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={isPending || !propertyCode.trim()}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-700 px-6 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Iniciar conversa
        </button>
      </div>
    </form>
  );
}
