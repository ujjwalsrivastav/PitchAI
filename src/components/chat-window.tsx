import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import logo from "@/assets/pitchai-logo.png";

type Mode = "fan" | "ops";

type ChatWindowProps = {
  mode: Mode;
  suggestions: string[];
  greeting: string;
  placeholder: string;
};

export function ChatWindow({ mode, suggestions, greeting, placeholder }: ChatWindowProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { mode },
      }),
    [mode],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `pitchai-${mode}`,
    transport,
  });

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [mode, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = async (msg: PromptInputMessage) => {
    const text = (msg.text ?? input).trim();
    if (!text || isBusy) return;
    setInput("");
    await sendMessage({ text });
  };

  const sendSuggestion = async (s: string) => {
    if (isBusy) return;
    await sendMessage({ text: s });
  };

  return (
    <div className="glass-panel flex h-[calc(100vh-9rem)] min-h-[520px] flex-col rounded-2xl overflow-hidden">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState
              greeting={greeting}
              suggestions={suggestions}
              onPick={sendSuggestion}
            />
          ) : (
            messages.map((m: UIMessage) => (
              <Message from={m.role} key={m.id}>
                <MessageContent
                  className={
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-foreground"
                  }
                >
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : (
                        <span key={i} className="whitespace-pre-wrap">
                          {part.text}
                        </span>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {status === "submitted" && (
            <div className="mt-2 pl-1">
              <Shimmer>PitchAI is thinking…</Shimmer>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error.message ?? "Something went wrong. Please retry."}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border/60 bg-card/60 p-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              ref={textareaRef}
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <PromptInputFooter className="justify-between">
              <div className="flex items-center gap-2 pl-1 text-xs text-muted-foreground">
                <img
                  src={logo}
                  alt=""
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
                <span>PitchAI · {mode === "fan" ? "Fan Concierge" : "Ops Copilot"}</span>
              </div>
              <PromptInputSubmit status={status} disabled={!input.trim() && !isBusy} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  greeting,
  suggestions,
  onPick,
}: {
  greeting: string;
  suggestions: string[];
  onPick: (s: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/25 blur-2xl" />
        <img src={logo} alt="PitchAI" width={80} height={80} className="rounded-2xl" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{greeting}</h2>
        <p className="text-sm text-muted-foreground">
          Ask anything — wayfinding, food, match info, transit. Multilingual.
        </p>
      </div>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="group rounded-xl border border-border/60 bg-card/60 p-3 text-left text-sm text-foreground/90 transition hover:border-primary/60 hover:bg-card hover:neon-ring"
          >
            <span className="text-primary">→</span> {s}
          </button>
        ))}
      </div>
    </div>
  );
}
