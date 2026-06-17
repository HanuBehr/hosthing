import { PropertyCodeForm } from "@/components/access/property-code-form";
import { SeazoneLogo } from "@/components/brand/seazone-logo";
import type { ReactNode } from "react";

export default function Home() {
  return (
    <main className="seazone-shell min-h-screen px-5 py-5 text-slate-900 sm:px-8 lg:px-10">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="flex flex-col">
          <SeazoneLogo />

          <div className="mt-9 max-w-xl sm:mt-11 lg:mt-12">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0067b1]">
              Assistente da sua estadia
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#06243d]">
              Precisa de ajuda no imóvel?
              <br />
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Digite o código da reserva ou escaneie o QR Code para falar com o
              César. Ele encontra as informações da sua estadia e ajuda com
              acesso, Wi-Fi, check-in, regras da casa e dicas locais.
            </p>

            <div className="mt-6">
              <PropertyCodeForm />
            </div>
          </div>

          <p className="mt-5 hidden text-sm leading-6 text-slate-500 lg:block">
            Atendimento 24h · Informações por imóvel · Respostas rápidas
          </p>
        </div>

        <ChatPreview />

        <p className="text-sm leading-6 text-slate-500 lg:hidden">
          Atendimento 24h · Informações por imóvel · Respostas rápidas
        </p>
      </section>
    </main>
  );
}

function ChatPreview() {
  return (
    <aside
      aria-label="Prévia do chat do César da Seazone"
      className="rounded-[1.75rem] border border-white bg-white p-3 shadow-[0_24px_70px_rgba(6,36,61,0.13)] sm:p-4"
    >
      <div className="overflow-hidden rounded-[1.45rem] border border-slate-100 bg-[#fbf8f2]">
        <div className="bg-[#06243d] px-5 py-4 text-white sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-base font-semibold">César da Seazone</p>
              <p className="mt-1 text-sm text-cyan-100">
                Assistente da sua estadia
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-50">
              disponível
            </span>
          </div>
        </div>

        <div className="space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <MessageBubble>
            Olá! Me envie o código do imóvel para eu abrir as informações da sua
            estadia.
          </MessageBubble>
          <MessageBubble align="right">FLN001</MessageBubble>
          <MessageBubble>
            Encontrei sua estadia. Posso te ajudar com acesso, Wi-Fi, check-in
            ou regras da casa.
          </MessageBubble>
        </div>
      </div>
    </aside>
  );
}

function MessageBubble({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "right";
}) {
  const isRight = align === "right";

  return (
    <div
      className={
        isRight
          ? "ml-auto max-w-[78%] rounded-3xl rounded-br-md bg-[#1e6f9f] px-5 py-3 text-sm font-medium leading-6 text-white"
          : "mr-auto max-w-[84%] rounded-3xl rounded-bl-md bg-white px-5 py-3 text-sm leading-6 text-slate-700 shadow-sm"
      }
    >
      {children}
    </div>
  );
}
