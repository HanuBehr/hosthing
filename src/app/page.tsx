import { PropertyCodeForm } from "@/components/access/property-code-form";
import { SeazoneLogo } from "@/components/brand/seazone-logo";

export default function Home() {
  return (
    <main className="seazone-shell min-h-screen px-5 py-6 text-[var(--color-text)] sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col justify-center">
        <div className="mx-auto w-full max-w-2xl">
          <SeazoneLogo />

          <div className="mt-10 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_20px_70px_rgba(6,43,69,0.08)] sm:p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seazone-blue,#0067b1)]">
              Assistente da sua estadia
            </p>
            <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-navy)]">
              Encontre sua estadia
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-muted)]">
              Digite o código do imóvel para acessar o guia, tirar dúvidas e ver
              informações da sua reserva.
            </p>

            <div className="mt-6">
              <PropertyCodeForm />
            </div>

            <p className="mt-6 border-t border-[var(--color-border)] pt-5 text-sm leading-6 text-[var(--color-muted)]">
              Atendimento 24h · Guia completo · Ajuda com acesso e Wi-Fi
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
