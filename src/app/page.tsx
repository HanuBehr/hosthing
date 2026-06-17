import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbfc] px-6 py-12 text-slate-900">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[2rem] border border-cyan-100 bg-white p-8 shadow-sm sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Guia Digital do Hóspede
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Acesse as informações da sua estadia
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Este projeto substitui o folheto impresso entregue pelo anfitrião:
            cada imóvel tem um link próprio com WiFi, acesso, regras, contato,
            guia de experiências e assistente virtual.
          </p>
        </div>
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5 text-slate-700">
          <p className="font-semibold text-slate-950">
            Exemplos disponíveis para avaliação
          </p>
          <p className="mt-2 leading-7">
            No uso real, o hóspede receberia diretamente o link do imóvel
            reservado. Para o teste técnico, use os códigos abaixo.
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
      <span className="text-sm font-medium text-cyan-700">Abrir guia da estadia</span>
      <strong className="mt-2 block text-2xl text-slate-950">{code}</strong>
      <span className="mt-1 block text-slate-600">{location}</span>
    </Link>
  );
}
