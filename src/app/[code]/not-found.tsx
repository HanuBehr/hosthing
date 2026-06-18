import Link from "next/link";

import { SeazoneLogo } from "@/components/brand/seazone-logo";

const exampleCodes = ["FLN001", "CMP001", "BNU001", "BCA001", "GRM001"];

export default function PropertyNotFound() {
  return (
    <main className="seazone-shell flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <section className="w-full max-w-xl rounded-card border border-line bg-surface p-6 shadow-card sm:p-8">
        <SeazoneLogo />
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-coral">
          Código não encontrado
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-navy">
          Não encontramos um imóvel com este código.
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Confira o código na reserva ou no QR Code do imóvel. Se o problema
          continuar, entre em contato com o anfitrião ou com a central da Seazone.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex rounded-field bg-coral px-5 py-3 font-semibold text-white transition hover:bg-coral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
        >
          Tentar outro código
        </Link>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs font-medium text-muted">Códigos de exemplo:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {exampleCodes.map((code) => (
              <Link
                key={code}
                href={`/${code}`}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-coral hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2"
              >
                {code}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
