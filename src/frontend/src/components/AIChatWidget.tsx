import { Button } from "@/components/ui/button";
import { useAskChat } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import {
  Bot,
  ChevronDown,
  Loader2,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Welcome to OK Rentals concierge. Ask me anything about our fleet, availability, pricing, or membership plans.",
  timestamp: Date.now(),
};

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const sessionId = useMemo(() => Math.random().toString(36).slice(2), []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: askChat, isPending } = useAskChat();

  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, minimized]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;

    const userMsg: Message = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    askChat(
      { message: trimmed, sessionId },
      {
        onSuccess: (reply) => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: reply, timestamp: Date.now() },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "I'm having trouble connecting right now. Please try again in a moment.",
              timestamp: Date.now(),
            },
          ]);
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="chat_widget"
    >
      {/* Chat Panel */}
      {open && (
        <div
          className={cn(
            "w-[340px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
            minimized ? "h-12" : "h-[460px]",
          )}
          style={{
            boxShadow:
              "0 8px 40px 0 oklch(0.13 0 0 / 0.8), 0 0 0 1px oklch(0.75 0.15 45 / 0.18)",
          }}
          data-ocid="chat_widget.dialog"
        >
          {/* Header */}
          <button
            type="button"
            className="flex items-center justify-between px-4 py-3 bg-secondary border-b border-border cursor-pointer select-none w-full text-left"
            onClick={() => setMinimized((m) => !m)}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-display font-semibold tracking-widest uppercase text-foreground">
                  OK Rentals AI
                </p>
                <p className="text-[10px] text-primary tracking-wide">
                  Concierge
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized((m) => !m);
                }}
                className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
                data-ocid="chat_widget.toggle"
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    minimized && "rotate-180",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setMinimized(false);
                }}
                className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close chat"
                data-ocid="chat_widget.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </button>

          {/* Messages */}
          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div
                    key={`${msg.role}-${msg.timestamp}-${i}`}
                    className={cn(
                      "flex gap-2 max-w-full",
                      msg.role === "user" ? "justify-end" : "justify-start",
                    )}
                    data-ocid={`chat_widget.message.${i + 1}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[80%] break-words",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-medium"
                          : "bg-muted/60 text-foreground",
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isPending && (
                  <div
                    className="flex gap-2 justify-start"
                    data-ocid="chat_widget.loading_state"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-muted/60 rounded-xl px-4 py-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-border bg-secondary">
                <div className="flex items-center gap-2 bg-background rounded-xl border border-input px-3 py-1.5 focus-within:border-primary/60 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0 py-1"
                    disabled={isPending}
                    aria-label="Chat message input"
                    data-ocid="chat_widget.input"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!input.trim() || isPending}
                    className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                    aria-label="Send message"
                    data-ocid="chat_widget.submit_button"
                  >
                    {isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-1.5 tracking-wide">
                  Session history only · Clears on refresh
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setMinimized(false);
        }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 group",
          open
            ? "bg-muted text-muted-foreground hover:bg-muted/80"
            : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
        )}
        style={
          !open
            ? { boxShadow: "0 4px 20px 0 oklch(0.75 0.15 45 / 0.4)" }
            : undefined
        }
        aria-label={open ? "Close chat" : "Open AI concierge chat"}
        data-ocid="chat_widget.open_modal_button"
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}
