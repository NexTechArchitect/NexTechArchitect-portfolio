"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Copy,
  Maximize2,
  MessageSquare,
  Minimize2,
  RotateCcw,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAgent } from "@/context/AgentContext";
import { parseAssistantBlocks, parseInlineTokens } from "@/lib/markdownParser";

function StudioMonogramBadge() {
  return (
    <span
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1E1510] border border-[#D96B27]/45 text-[#FAF6F0] font-display font-bold text-xs shrink-0"
      aria-hidden="true"
    >
      AK
    </span>
  );
}

function CopyableCodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="my-2.5 rounded-xl bg-[#120B07] border border-[#FAF6F0]/12 overflow-hidden text-[#FAF6F0]">
      <div className="px-3 py-1.5 bg-[#1B120C] border-b border-[#FAF6F0]/10 flex items-center justify-between gap-2 text-[10.5px] font-mono-tabular text-[#B8A699]">
        <span>{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code block"
          className="inline-flex items-center gap-1 text-[#F48C06] hover:text-[#FAF6F0] transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[11.5px] leading-[1.6] font-mono-tabular text-[#F3EAE0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CopyableInlineCode({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy"
      className="inline-flex items-center gap-1 font-mono-tabular text-[12px] px-1.5 py-0.5 rounded bg-[#ECE2D4] hover:bg-[#E2D3BE] text-[#140E0B] transition-colors cursor-pointer break-all text-left"
    >
      <span>{text}</span>
      {copied && (
        <Check
          className="w-3 h-3 text-[#E85D04] shrink-0"
          aria-hidden="true"
        />
      )}
    </button>
  );
}

function renderInlineFormatted(text: string): React.ReactNode[] {
  const tokens = parseInlineTokens(text);

  return tokens.map((token, idx) => {
    switch (token.type) {
      case "bold":
        return (
          <strong key={idx} className="font-semibold text-[#140E0B]">
            {token.value}
          </strong>
        );
      case "italic":
        return (
          <em key={idx} className="italic text-[#3B2E27]">
            {token.value}
          </em>
        );
      case "code":
        return <CopyableInlineCode key={idx} text={token.value} />;
      case "link":
        return (
          <a
            key={idx}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#C84B00] underline decoration-[#E85D04]/50 underline-offset-2 hover:text-[#E85D04] break-all"
          >
            {token.label}
          </a>
        );
      case "email":
        return (
          <a
            key={idx}
            href={`mailto:${token.address}`}
            className="font-semibold text-[#C84B00] underline decoration-[#E85D04]/50 underline-offset-2 hover:text-[#E85D04]"
          >
            {token.address}
          </a>
        );
      default:
        return <React.Fragment key={idx}>{token.value}</React.Fragment>;
    }
  });
}

function RichAssistantMessage({ text }: { text: string }) {
  const blocks = useMemo(() => parseAssistantBlocks(text), [text]);

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <CopyableCodeBlock
              key={idx}
              lang={block.lang}
              code={block.code}
            />
          );
        }

        if (block.type === "divider") {
          return (
            <hr
              key={idx}
              className="my-2.5 border-0 border-t border-[#140E0B]/12"
            />
          );
        }

        if (block.type === "heading") {
          const headingSize =
            block.level <= 2
              ? "text-[14.5px] font-bold mt-2.5 first:mt-0"
              : "text-[13.5px] font-bold mt-2 first:mt-0";
          return (
            <h3
              key={idx}
              className={`font-display tracking-[-0.015em] text-[#140E0B] leading-snug ${headingSize}`}
            >
              {renderInlineFormatted(block.text)}
            </h3>
          );
        }

        if (block.type === "bullet") {
          return (
            <div key={idx} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-2 w-1.5 h-1.5 rounded-full bg-[#E85D04] shrink-0"
              />
              <span className="min-w-0 break-words">
                {renderInlineFormatted(block.text)}
              </span>
            </div>
          );
        }

        if (block.type === "ordered") {
          return (
            <div key={idx} className="flex items-start gap-2">
              <span className="font-mono-tabular text-[11.5px] font-semibold text-[#C84B00] mt-0.5 shrink-0 min-w-[1.25rem]">
                {block.index}.
              </span>
              <span className="min-w-0 break-words">
                {renderInlineFormatted(block.text)}
              </span>
            </div>
          );
        }

        return (
          <p key={idx} className="break-words">
            {renderInlineFormatted(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ProtocolAgent() {
  const {
    isOpen,
    isThinking,
    openAgent,
    closeAgent,
    messages,
    sendMessage,
    retryMessage,
    resetConversation,
    voiceEnabled,
    isSpeaking,
    speechSupported,
    toggleVoice,
  } = useAgent();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const latestAssistantRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevThinkingRef = useRef(false);
  const anchoredAssistantIdRef = useRef<string | null>(null);

  // Identify the latest assistant reply (excluding the initial greeting at index 0)
  const latestAssistantIndex = useMemo(() => {
    for (let i = messages.length - 1; i >= 1; i--) {
      if (messages[i]?.role === "assistant") {
        return i;
      }
    }
    return -1;
  }, [messages]);

  const latestAssistantId =
    latestAssistantIndex >= 0 ? messages[latestAssistantIndex]?.id ?? null : null;
  const lastMessage = messages[messages.length - 1];
  const lastMessageId = lastMessage?.id ?? "";
  const lastMessageRole = lastMessage?.role ?? "assistant";

  // Anchor scroll to the TOP of every new assistant reply so the user reads naturally downward
  useEffect(() => {
    if (!isOpen) return;

    const justFinishedReply = prevThinkingRef.current && !isThinking;
    prevThinkingRef.current = isThinking;

    if (lastMessageRole === "user" && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
      return;
    }

    if (
      latestAssistantId &&
      (anchoredAssistantIdRef.current !== latestAssistantId || justFinishedReply)
    ) {
      anchoredAssistantIdRef.current = latestAssistantId;
      window.requestAnimationFrame(() => {
        latestAssistantRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [isOpen, isThinking, latestAssistantId, lastMessageId, lastMessageRole]);

  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 160);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAgent();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeAgent]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInputError(true);
      return;
    }
    setInputError(false);
    sendMessage(trimmed);
    setInputValue("");
  };

  // Show dynamic starter prompts only before the conversation begins
  const showStarters =
    !isThinking &&
    messages.length === 1 &&
    messages[0]?.role === "assistant" &&
    Boolean(messages[0]?.followUps?.length);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[180] flex flex-col items-end max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.section
            key="agent-drawer"
            role="dialog"
            aria-label="Ask Amit AI Assistant"
            data-expanded={isExpanded ? "true" : "false"}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`rounded-[24px] espresso-glass shadow-[0_32px_80px_-16px_rgba(11,7,5,0.72)] flex flex-col overflow-hidden text-[#FAF6F0] ${
              isExpanded
                ? "w-[calc(100vw-2rem)] sm:w-[640px] lg:w-[740px] max-h-[min(780px,calc(100vh-4.5rem))]"
                : "w-[calc(100vw-2rem)] sm:w-[428px] max-h-[min(610px,calc(100vh-5.5rem))]"
            }`}
          >
            {/* Dark Espresso Header */}
            <div className="px-4 py-3.5 border-b border-[#FAF6F0]/10 bg-[#120B07] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <StudioMonogramBadge />
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-[15px] leading-tight text-[#FAF6F0] truncate">
                    Ask Amit
                  </h2>
                  <p className="text-[11px] text-[#C8B9AE] truncate">
                    {isThinking
                      ? "Thinking..."
                      : isSpeaking
                      ? "Speaking response aloud"
                      : "Personal Protocol Assistant"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                <button
                  type="button"
                  data-testid="agent-expand-toggle"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  aria-pressed={isExpanded}
                  aria-label={
                    isExpanded ? "Compact chat drawer" : "Expand chat drawer"
                  }
                  title={isExpanded ? "Compact view" : "Expand view"}
                  className="hidden sm:inline-flex w-10 h-10 rounded-full items-center justify-center text-[#C8B9AE] hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Maximize2 className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                {speechSupported && (
                  <button
                    type="button"
                    onClick={toggleVoice}
                    aria-pressed={voiceEnabled}
                    aria-label={
                      voiceEnabled
                        ? "Disable voice read-aloud"
                        : "Enable voice read-aloud"
                    }
                    className={`w-10 h-10 rounded-full inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                      voiceEnabled
                        ? "bg-[#E85D04] text-[#FAF6F0]"
                        : "text-[#C8B9AE] hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0]"
                    }`}
                  >
                    {voiceEnabled ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <VolumeX className="w-4 h-4" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetConversation}
                  aria-label="Reset studio conversation"
                  className="w-10 h-10 rounded-full inline-flex items-center justify-center text-[#C8B9AE] hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeAgent}
                  aria-label="Close Ask Amit drawer"
                  className="w-11 h-11 rounded-full inline-flex items-center justify-center text-[#C8B9AE] hover:bg-[#FAF6F0]/10 hover:text-[#FAF6F0] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warm Cream + Roasted Espresso Conversation Thread */}
            <div
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto overscroll-contain studio-scroll px-4 py-4 space-y-3.5 bg-[#19110C]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {messages.map((msg, idx) => {
                const isLatestAssistant = idx === latestAssistantIndex;
                return (
                  <div
                    key={msg.id}
                    ref={isLatestAssistant ? latestAssistantRef : null}
                    data-testid={
                      msg.role === "assistant"
                        ? "agent-message-assistant"
                        : "agent-message-user"
                    }
                    className={`flex flex-col scroll-mt-3 ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-[13.5px] leading-[1.64] ${
                        msg.role === "user"
                          ? "bg-[#E85D04] text-[#FAF6F0] rounded-br-sm"
                          : msg.isError
                          ? "bg-[#2A1B14] border border-[#E85D04]/45 text-[#FAF6F0] rounded-bl-sm"
                          : "bg-[#FAF6F0] text-[#140E0B] rounded-bl-sm shadow-[0_6px_18px_-10px_rgba(0,0,0,0.45)]"
                      }`}
                    >
                      {msg.role === "assistant" && !msg.isError ? (
                        <RichAssistantMessage text={msg.text} />
                      ) : (
                        <p className="break-words">{msg.text}</p>
                      )}

                      {msg.isError && msg.retryPrompt && (
                        <button
                          type="button"
                          onClick={() => retryMessage(msg.id, msg.retryPrompt!)}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] text-[11.5px] font-semibold transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" aria-hidden="true" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isThinking && (
                <div
                  aria-label="Amit AI is typing"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-[#241A15] border border-[#FAF6F0]/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04] typing-dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D96B27] typing-dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FAF6F0]/80 typing-dot-3" />
                </div>
              )}

              {/* Conversation Starters (3 clean prompts, disappear cleanly once chatting starts) */}
              {showStarters && messages[0]?.followUps && (
                <div
                  data-testid="agent-starters"
                  aria-label="Conversation starters"
                  className="pt-1 flex flex-col gap-2"
                >
                  <span className="text-[11px] font-medium text-[#B8A699]">
                    Try asking
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {messages[0].followUps.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="text-left min-h-[44px] text-[12px] font-medium text-[#FAF6F0] bg-[#241A15] hover:bg-[#E85D04] border border-[#FAF6F0]/12 hover:border-[#E85D04] rounded-xl px-3.5 py-2.5 transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-3 border-t border-[#FAF6F0]/10 bg-[#120B07]"
            >
              <label htmlFor="protocol-agent-input" className="sr-only">
                Ask me anything about Amit, his protocols, or Web3
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="protocol-agent-input"
                  ref={inputRef}
                  type="text"
                  maxLength={1000}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError(false);
                  }}
                  placeholder="Ask me anything about Amit, his protocols, or Web3..."
                  className={`flex-1 min-w-0 min-h-[44px] bg-[#241A15] text-[13.5px] text-[#FAF6F0] placeholder:text-[#9D8C80] rounded-full px-4 py-2.5 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85D04]/45 ${
                    inputError
                      ? "border-[#E85D04]"
                      : "border-[#FAF6F0]/14 focus:border-[#E85D04]"
                  }`}
                />
                <button
                  type="submit"
                  disabled={isThinking}
                  aria-label="Send message to Amit"
                  className="w-11 h-11 rounded-full bg-[#E85D04] hover:bg-[#D14F00] disabled:opacity-50 active:scale-95 text-[#FAF6F0] inline-flex items-center justify-center transition-[background-color,transform] duration-150 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {inputError && (
                <p className="mt-1.5 px-3 text-[11px] text-[#E85D04]">
                  Type a message to start chatting.
                </p>
              )}
            </form>
          </motion.section>
        ) : (
          <motion.button
            key="agent-launcher"
            data-testid="agent-launcher"
            type="button"
            onClick={openAgent}
            aria-label="Open Ask Amit AI Assistant"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="group flex items-center gap-2.5 min-h-[48px] pl-2.5 pr-4 py-2 rounded-full bg-[#140E0B] text-[#FAF6F0] border border-[#D96B27]/45 shadow-[0_18px_42px_-12px_rgba(11,7,5,0.62)] hover:border-[#E85D04] hover:bg-[#1E1510] active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
          >
            <span className="w-8 h-8 rounded-full bg-[#E85D04] text-[#FAF6F0] inline-flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </span>
            <span className="flex flex-col items-start text-left">
              <span className="font-display font-bold text-[13.5px] leading-tight text-[#FAF6F0] whitespace-nowrap">
                Ask Amit
              </span>
              <span className="hidden sm:block text-[10.5px] text-[#C8B9AE] whitespace-nowrap">
                Personal Protocol Assistant
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
