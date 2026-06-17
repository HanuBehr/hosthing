"use client";

import { FormEvent, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Qual a senha do WiFi?",
  "Posso trazer meu cachorro?",
  "A que horas posso fazer check-in?",
  "Que restaurantes tem perto?",
];

export function ChatWidget({ propertyCode }: { propertyCode: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente virtual deste imóvel. Posso responder sobre WiFi, acesso, regras da estadia e recomendações próximas.",
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
        body: JSON.stringify({ propertyCode, messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Não foi possível falar com o assistente agora.");
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
    <>
      {isOpen ? (
        <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-h-[82vh] max-w-md flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[420px]">
          <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-cyan-400 p-2 text-slate-950">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Assistente Virtual</p>
                <p className="text-xs text-cyan-100">
                  Conhece este imóvel: {propertyCode}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label="Fechar chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-cyan-700 px-4 py-3 text-sm leading-6 text-white"
                    : "mr-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm"
                }
              >
                {message.content || "..."}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 bg-white p-4">
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
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-semibold text-white shadow-2xl transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        <Bot className="h-5 w-5 text-cyan-300" />
        Assistente virtual
      </button>
    </>
  );
}
