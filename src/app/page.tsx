import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbfc] px-6 py-12 text-slate-900">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[2rem] border border-cyan-100 bg-white p-8 shadow-sm sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Seazone
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Guia Digital do Hóspede personalizado por imóvel
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Acesse um guia com dados de chegada, regras, experiências locais
            geradas por IA e assistente virtual contextualizado para cada
            propriedade.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <PropertyLink code="FLN001" location="Florianópolis, SC" />
          <PropertyLink code="GRM001" location="Gramado, RS" />
        </div>
      </section>
    </main>
  );
}

function PropertyLink({ code, location }: { code: string; location: string }) {
  return (
    <Link
      href={`/${code}`}
      className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5 transition hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-md"
    >
      <span className="text-sm font-medium text-cyan-700">Abrir guia</span>
      <strong className="mt-2 block text-2xl text-slate-950">{code}</strong>
      <span className="mt-1 block text-slate-600">{location}</span>
    </Link>
  );
}
