"use client";

import { Fragment, FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What is the WiFi password?",
  "What can I do nearby?",
  "Nearby restaurants",
  "Market or pharmacy nearby?",
];

const initialAssistantMessage =
  "Hi, I can help with this stay: WiFi, access, house rules, restaurants, and nearby essentials.";

export function ChatWidget({
  propertyCode,
}: {
  propertyCode: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasUnreadIntro, setHasUnreadIntro] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  const hasMessagesRef = useRef(false);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    hasMessagesRef.current = messages.length > 0;
  }, [messages]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (hasMessagesRef.current) return;

      setMessages([
        {
          role: "assistant",
          content: initialAssistantMessage,
        },
      ]);
      const shouldNotify = !isOpenRef.current;

      setHasUnreadIntro(shouldNotify);

      if (shouldNotify) {
        playNotificationSound();
      }
    }, 2000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
    });
  }, [messages, isOpen]);

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
        throw new Error("The assistant is unavailable right now.");
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
              : "Unexpected assistant error.",
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
        <div className="fixed inset-x-2 bottom-2 z-50 mx-auto flex max-h-[calc(100dvh-1rem)] max-w-md flex-col overflow-hidden rounded-card border border-line bg-surface shadow-pop pb-[env(safe-area-inset-bottom)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-h-[85dvh] sm:w-[400px]">
          <div className="flex items-center justify-between gap-3 bg-navy px-4 py-3.5 text-white sm:px-5 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-orange">
                <Image
                  src="/assistant-avatar.svg"
                  alt="Hostwise stay support"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="font-semibold tracking-[-0.01em]">
                  Stay support
                </p>
                <p className="truncate text-xs text-white/60">
                  Property code: {propertyCode}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="-mr-1 shrink-0 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="app-scroll flex-1 space-y-2.5 overflow-y-auto bg-fog p-3 sm:space-y-3 sm:p-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[92%] rounded-panel rounded-br-md bg-navy px-3 py-2.5 text-sm leading-6 text-white sm:max-w-[85%] sm:px-4 sm:py-3"
                    : "mr-auto max-w-[92%] rounded-panel rounded-bl-md border border-line bg-surface/95 px-3 py-2.5 text-sm leading-6 text-ink shadow-card sm:max-w-[85%] sm:px-4 sm:py-3"
                }
              >
                {message.content ? (
                  <MarkdownText content={message.content} />
                ) : (
                  <span className="text-muted">…</span>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-line bg-surface p-3 sm:p-4">
            <div className="app-scroll -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              {suggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  disabled={isStreaming}
                  className="shrink-0 rounded-full border border-line bg-surface/85 px-3 py-1.5 text-xs font-semibold text-navy transition hover:border-coral hover:bg-coral-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Ask about your stay
              </label>
              <input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about your stay"
                className="min-w-0 flex-1 rounded-field border border-line bg-fog px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-muted focus:border-coral focus:bg-surface sm:px-4 sm:py-3"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="flex shrink-0 items-center justify-center rounded-field bg-navy px-3 text-white transition hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-3.5"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" aria-hidden />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <div className="fixed right-3 bottom-3 z-40 mb-[env(safe-area-inset-bottom)] flex flex-col items-end gap-2 sm:right-4 sm:bottom-4">
          {hasUnreadIntro ? (
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setHasUnreadIntro(false);
              }}
              className="relative max-w-[230px] rounded-panel border border-line bg-surface/95 px-3.5 py-2.5 text-left text-sm font-semibold leading-5 text-navy shadow-pop transition hover:-translate-y-0.5 hover:border-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 sm:max-w-[260px] sm:px-4 sm:py-3"
            >
              Need help with WiFi, access, or local tips?
              <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-b border-r border-line bg-surface" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setHasUnreadIntro(false);
            }}
            className="relative flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-navy font-semibold text-white shadow-pop transition hover:-translate-y-0.5 hover:bg-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 focus-visible:ring-offset-2 sm:h-auto sm:w-auto sm:px-4 sm:py-3"
            aria-label="Open stay support"
          >
            {hasUnreadIntro ? (
              <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full border-2 border-surface bg-red-600 px-1.5 text-xs font-bold leading-none text-white">
                1
              </span>
            ) : null}
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-orange sm:h-8 sm:w-8">
              <Image
                src="/assistant-avatar.svg"
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </span>
            <span className="hidden sm:inline">Stay support</span>
          </button>
        </div>
      ) : null}
    </>
  );
}

function MarkdownText({ content }: { content: string }) {
  const lines = content.split("\n");

  return lines.map((line, lineIndex) => (
    <Fragment key={`${line}-${lineIndex}`}>
      {renderInlineMarkdown(line)}
      {lineIndex < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

function renderInlineMarkdown(content: string) {
  const nodes: ReactNode[] = [];
  const boldPattern = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index));
    }

    nodes.push(
      <strong key={`${match.index}-${match[1]}`} className="font-semibold text-current">
        {match[1]}
      </strong>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  return nodes.length ? nodes : content;
}

function playNotificationSound() {
  try {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1320,
      audioContext.currentTime + 0.08,
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.18);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.18);
    window.setTimeout(() => void audioContext.close(), 240);
  } catch {
    // Browsers can block autoplay before interaction; the visual badge still appears.
  }
}
