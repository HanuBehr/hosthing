"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { Bot, ExternalLink, Send } from "lucide-react";

import type { Property } from "@/lib/validators/property";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Qual a senha do WiFi?",
  "Como eu entro no imóvel?",
  "Posso trazer meu cachorro?",
  "Me envie o guia completo",
];

export function PropertyAssistant({ property }: { property: Property }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Oi, aqui é o César da Seazone. Como posso te ajudar na sua estadia no imóvel ${property.code}? Se quiser ver tudo organizado, acesse o guia completo em /${property.code}/guia.`,
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbfc] px-4 py-8 text-slate-900">
      <section className="flex h-[min(820px,calc(100vh-4rem))] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-cyan-100 bg-white shadow-xl">
        <header className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                <Bot className="h-7 w-7" />
              </span>
              <div>
                <p className="text-sm text-cyan-100">César da Seazone</p>
                <h1 className="text-xl font-semibold">Como posso te ajudar?</h1>
              </div>
            </div>
            <Link
              href={`/${property.code}/guia`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              Abrir guia completo
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-cyan-50/90">
            Estou conectado ao imóvel {property.code}. Posso responder sobre
            WiFi, acesso, regras da estadia, contato e recomendações próximas.
          </p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 sm:p-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[86%] rounded-3xl bg-cyan-700 px-5 py-3 text-sm leading-6 text-white"
                  : "mr-auto max-w-[86%] rounded-3xl bg-white px-5 py-3 text-sm leading-6 text-slate-700 shadow-sm"
              }
            >
              {message.content || "..."}
            </div>
          ))}
        </div>

        <footer className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={isStreaming}
                className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pergunte sobre sua estadia"
              className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-600"
            />
            <button
              type="submit"
              disabled={isStreaming}
              className="rounded-full bg-cyan-700 p-3 text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Enviar mensagem"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </footer>
      </section>
    </main>
  );
}
