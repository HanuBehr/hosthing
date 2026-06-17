"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, CalendarClock, MapPin, Send } from "lucide-react";

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
      content: `Encontrei sua estadia no imóvel ${property.code}. Você pode abrir o guia completo ou me perguntar qualquer coisa sobre acesso, Wi-Fi, check-in e regras da casa.`,
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

  return (
    <main className="seazone-shell min-h-screen px-5 py-6 text-[var(--color-text)] sm:px-8">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <SeazoneLogo />
        <Link
          href={`/${property.code}/guia`}
          className="hidden rounded-full border border-[var(--color-navy)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white focus:ring-4 focus:ring-cyan-500/10 focus:outline-none sm:inline-flex"
        >
          Guia completo
        </Link>
      </header>

      <section className="mx-auto mt-8 max-w-5xl space-y-5">
        <section aria-labelledby="stay-title" className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--seazone-blue,#0067b1)]">
              Sua estadia
            </p>
            <h1
              id="stay-title"
              className="mt-2 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-[-0.04em] text-[var(--color-navy)]"
            >
              Sua estadia foi encontrada
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--color-muted)]">
              {staySubtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
            <StayFact
              icon={<MapPin className="h-5 w-5" />}
              label="Imóvel"
              value={property.code}
              detail={`${property.address.city}/${property.address.state}`}
            />
            <StayFact
              icon={<CalendarClock className="h-5 w-5" />}
              label="Check-in"
              value={formatHour(property.rules.check_in_time)}
              detail={`Check-out até ${formatHour(property.rules.check_out_time)}`}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <GuideCard propertyCode={property.code} />

          <section
            aria-labelledby="chat-title"
            className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_18px_60px_rgba(6,43,69,0.08)] sm:p-5"
          >
            <div>
              <h2 id="chat-title" className="text-2xl font-semibold text-[var(--color-navy)]">
                Pergunte ao César
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Escolha uma pergunta rápida ou digite sua dúvida sobre a estadia.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {messages.map((message, index) => (
                <MessageBubble key={index} role={message.role}>
                  {message.content || "..."}
                </MessageBubble>
              ))}
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
                    className="rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold text-[var(--color-muted)] transition hover:border-[var(--seazone-blue,#0067b1)]/40 hover:text-[var(--seazone-blue,#0067b1)] focus:ring-4 focus:ring-cyan-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
              <label htmlFor="guest-question" className="sr-only">
                Digite sua dúvida sobre a estadia
              </label>
              <input
                id="guest-question"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Digite sua dúvida sobre a estadia"
                className="min-w-0 flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--seazone-blue,#0067b1)] focus:ring-4 focus:ring-cyan-500/10"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="rounded-2xl bg-[var(--color-coral)] p-3 text-white transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[var(--color-coral)]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#f2b9b3] disabled:text-white/80"
                aria-label="Enviar mensagem"
              >
                <Send className="h-5 w-5" aria-hidden />
              </button>
            </form>
          </section>
        </section>
      </section>
    </main>
  );
}

function GuideCard({ propertyCode }: { propertyCode: string }) {
  return (
    <section className="rounded-[1.5rem] border border-orange-100 bg-white p-5 shadow-[0_18px_60px_rgba(6,43,69,0.08)] sm:p-6">
      <h2 className="text-2xl font-semibold text-[var(--color-navy)]">
        Guia completo da estadia
      </h2>
      <p className="mt-3 leading-7 text-[var(--color-muted)]">
        Acesse tudo em um só lugar: entrada no imóvel, Wi-Fi, regras da casa,
        check-in, check-out e recomendações locais.
      </p>
      <Link
        href={`/${propertyCode}/guia`}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-coral)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--color-coral-hover)] focus:ring-4 focus:ring-[var(--color-coral)]/25 focus:outline-none sm:w-auto"
      >
        Ver guia completo
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

function StayFact({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-[var(--seazone-blue,#0067b1)]">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-[var(--color-navy)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{detail}</p>
    </div>
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
          ? "ml-auto max-w-[86%] rounded-2xl rounded-br-md bg-[#2c6f93] px-4 py-3 text-sm leading-6 text-white"
          : "mr-auto max-w-[90%] rounded-2xl rounded-bl-md bg-[var(--color-bg)] px-4 py-3 text-sm leading-6 text-slate-700"
      }
    >
      {children}
    </div>
  );
}
