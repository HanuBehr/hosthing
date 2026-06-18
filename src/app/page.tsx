import Image from "next/image";

import { PropertyCodeForm } from "@/components/access/property-code-form";
import { SeazoneLogo } from "@/components/brand/seazone-logo";

const supportImageUrl =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=82";

export default function Home() {
  return (
    <main className="seazone-shell min-h-screen px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-[1120px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16">
        <div className="max-w-2xl">
          <SeazoneLogo />

          <div className="mt-10 sm:mt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Acesso rápido ao guia
            </p>
            <h1 className="mt-4 text-[clamp(2.1rem,4.5vw,3.4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-navy">
              Encontre sua estadia
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted sm:text-lg">
              Digite o código do imóvel para acessar o guia, tirar dúvidas e ver
              informações da sua reserva.
            </p>

            <div className="mt-8 max-w-lg rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
              <PropertyCodeForm />
            </div>

            <p className="mt-5 text-sm leading-6 text-muted">
              Atendimento 24h · Guia completo · Ajuda com acesso e Wi-Fi
            </p>
          </div>
        </div>

        <ArrivalSupportVisual />
      </section>
    </main>
  );
}

function ArrivalSupportVisual() {
  return (
    <aside
      aria-label="Resumo do suporte disponível para hóspedes"
      className="flex justify-center lg:justify-end"
    >
      <div className="relative h-[320px] w-full max-w-lg overflow-hidden rounded-card border border-line bg-surface shadow-card sm:h-[380px] lg:h-[520px] lg:max-w-none">
        <Image
          src={supportImageUrl}
          alt="Ambiente de hospedagem Seazone"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />

        <div className="absolute inset-x-4 bottom-4 rounded-panel border border-white/40 bg-surface/90 p-4 text-navy shadow-card backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
            Guia da estadia
          </p>
          <p className="mt-2 text-base font-semibold tracking-[-0.02em]">
            Acesso, Wi-Fi e check-in em um só lugar.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Acesso", "Wi-Fi", "Check-in"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-navy"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
