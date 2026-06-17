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
        className="block text-sm font-semibold text-[#06243d]"
      >
        Código do imóvel
      </label>
      <p id="property-code-help" className="mt-2 text-sm leading-6 text-slate-500">
        Você encontra esse código na reserva ou no QR Code do imóvel.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          id="property-code"
          value={propertyCode}
          onChange={(event) => setPropertyCode(event.target.value)}
          placeholder="Ex: FLN001"
          className="h-12 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-base font-semibold tracking-wide text-[#06243d] shadow-sm outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[#0067b1] focus:ring-4 focus:ring-[#10b6d6]/15 sm:h-13"
          autoComplete="off"
          inputMode="text"
          aria-describedby="property-code-help property-code-examples"
        />
        <button
          type="submit"
          disabled={isPending || !propertyCode.trim()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ff8a1c] px-6 font-semibold text-white shadow-sm transition hover:bg-[#f47c08] focus:ring-4 focus:ring-[#ff8a1c]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#e3d8cb] disabled:text-slate-500 sm:h-13 sm:w-auto sm:min-w-44"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Iniciar conversa
        </button>
      </div>

      <div
        id="property-code-examples"
        className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"
      >
        <span>Exemplos:</span>
        {exampleCodes.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setPropertyCode(code)}
            className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 font-semibold text-slate-600 transition hover:border-[#0067b1]/30 hover:text-[#0067b1] focus:ring-4 focus:ring-[#10b6d6]/15 focus:outline-none"
          >
            {code}
          </button>
        ))}
      </div>
    </form>
  );
}
