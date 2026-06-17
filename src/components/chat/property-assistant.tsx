"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CalendarClock, Send } from "lucide-react";

import { SeazoneLogo } from "@/components/brand/seazone-logo";
import { formatHour } from "@/lib/format";
import type { Property } from "@/lib/validators/property";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Qual é a senha do Wi-Fi?",
  "Como entro no imóvel?",
  "Quais são as regras da casa?",
  "Que horas é o check-out?",
  "Posso trazer meu cachorro?",
];

export function PropertyAssistant({ property }: { property: Property }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Encontrei sua estadia no imóvel ${property.code}. Posso ajudar com acesso, Wi-Fi, horários e regras da casa.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyCode: property.code, messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Não consegui responder agora. Tente novamente em instantes.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages([...nextMessages, { role: "assistant", content: assistantContent }]);
      }
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Erro inesperado no assistente.",
        },
      ]);
    } finally {
      setIsStreaming(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  const staySubtitle = `${property.code} · ${property.name} · ${property.address.city}/${property.address.state}`;
  const visibleMessages = messages.slice(1);

  return (
    <main className="seazone-shell min-h-screen px-5 py-6 text-[var(--color-text)] sm:px-8 lg:px-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <SeazoneLogo />
        <Link
          href={`/${property.code}/guia`}
          className="hidden rounded-full border border-[var(--color-navy)] bg-white/70 px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white focus:ring-4 focus:ring-[rgba(255,107,95,0.18)] focus:outline-none sm:inline-flex"
        >
          Guia completo
        </Link>
      </header>

      <section className="mx-auto mt-7 max-w-6xl space-y-6 lg:mt-9">
        <section
          aria-labelledby="stay-title"
          className="border-b border-[var(--color-border)] pb-5"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-coral)]">
                Sua estadia
              </p>
              <h1
                id="stay-title"
                className="mt-2 text-[clamp(2rem,4vw,3.35rem)] font-semibold leading-tight tracking-[-0.045em] text-[var(--color-navy)]"
              >
                Sua estadia foi encontrada
              </h1>
              <p className="mt-2.5 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
                {staySubtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <StayDetail
                icon={<CalendarClock className="h-4 w-4" aria-hidden />}
                text={`Check-in ${formatHour(property.rules.check_in_time)}`}
              />
              <StayDetail
                icon={<CalendarClock className="h-4 w-4" aria-hidden />}
                text={`Check-out até ${formatHour(property.rules.check_out_time)}`}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <GuideCard propertyCode={property.code} />

          <section
            aria-labelledby="chat-title"
            className="rounded-[1.35rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-surface)] sm:p-6"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Ajuda rápida
              </p>
              <h2
                id="chat-title"
                className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[var(--color-navy)]"
              >
                Tire suas dúvidas
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Escolha uma pergunta rápida ou digite sua dúvida sobre a estadia.
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-[var(--color-navy)]">
                Perguntas rápidas
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={isStreaming}
                    className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-coral)] hover:bg-[var(--color-bg)] focus:ring-4 focus:ring-[rgba(255,107,95,0.15)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <label htmlFor="guest-question" className="sr-only">
                Digite sua dúvida sobre a estadia
              </label>
              <input
                id="guest-question"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Digite sua dúvida sobre a estadia"
                className="min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-navy)] focus:ring-4 focus:ring-[rgba(255,107,95,0.16)]"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="rounded-2xl bg-[var(--color-coral)] p-3 text-white transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[rgba(255,107,95,0.25)] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f4b4ae] disabled:text-white/85"
                aria-label="Enviar mensagem"
              >
                <Send className="h-5 w-5" aria-hidden />
              </button>
            </form>

            {visibleMessages.length > 0 ? (
              <div className="mt-4 space-y-3" aria-live="polite">
                {visibleMessages.map((message, index) => (
                  <MessageBubble key={index} role={message.role}>
                    {message.content || "..."}
                  </MessageBubble>
                ))}
              </div>
            ) : null}
          </section>
        </section>
      </section>
    </main>
  );
}

function GuideCard({ propertyCode }: { propertyCode: string }) {
  return (
    <section className="relative overflow-hidden rounded-[1.55rem] bg-[var(--color-navy)] p-6 text-white shadow-[0_22px_60px_rgba(3,31,51,0.16)] sm:p-7 lg:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--color-coral)]" />
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/58">
        Caminho recomendado
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
        Guia completo da estadia
      </h2>
      <p className="mt-3 max-w-xl leading-7 text-white/72">
        Acesse entrada no imóvel, Wi-Fi, regras da casa, check-in, check-out e
        recomendações locais em um só lugar.
      </p>

      <Link
        href={`/${propertyCode}/guia`}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-coral)] px-5 py-3.5 font-semibold text-white transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[rgba(255,107,95,0.25)] focus:outline-none sm:w-auto"
      >
        Ver guia completo
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function StayDetail({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 font-semibold text-[var(--color-navy)]">
      {icon}
      {text}
    </span>
  );
}

function MessageBubble({
  role,
  children,
}: {
  role: ChatMessage["role"];
  children: ReactNode;
}) {
  const isUser = role === "user";

  return (
    <div
      className={
        isUser
          ? "ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-[var(--color-navy)] px-4 py-3 text-sm leading-6 text-white"
          : "mr-auto max-w-[90%] rounded-2xl rounded-bl-md border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--color-text)]"
      }
    >
      {children}
    </div>
  );
}
