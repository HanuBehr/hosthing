import { PropertyCodeForm } from "@/components/access/property-code-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7fbfc] px-6 py-12 text-slate-900">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 rounded-[2rem] border border-cyan-100 bg-white p-8 shadow-sm sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            Guia Digital do Hóspede
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Fale com o César da Seazone
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Digite o código do imóvel reservado ou escaneie o QR Code no imóvel
            para conversar com o assistente que conhece exatamente a sua estadia.
          </p>
        </div>

        <PropertyCodeForm />

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          <p className="font-semibold text-slate-950">Como funciona?</p>
          <p className="mt-2 leading-7">
            Cada código abre o atendimento daquele imóvel. O assistente responde
            sobre WiFi, acesso, regras, contato e também envia o link do guia
            completo da propriedade.
          </p>
        </div>
      </section>
    </main>
  );
}
