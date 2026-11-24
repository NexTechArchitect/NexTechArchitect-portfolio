"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  RotateCcw,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAgent } from "@/context/AgentContext";

function GeometricOrbAvatar({
  size = "md",
  speaking = false,
}: {
  size?: "sm" | "md";
  speaking?: boolean;
}) {
  const dim = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  return (
    <span
      className={`relative inline-flex items-center justify-center ${dim} shrink-0`}
      aria-hidden="true"
    >
      {/* Subtle pulsing warm amber-bronze aura */}
      <span
        className={`absolute inset-0 rounded-full agent-orb-aura ${
          speaking ? "opacity-75" : ""
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(244, 140, 6, 0.48) 0%, rgba(232, 93, 4, 0.16) 58%, rgba(232, 93, 4, 0) 76%)",
        }}
      />
      {/* Faceted geometric bronze-amber crystal medallion */}
      <span
        className="relative w-full h-full rounded-full flex items-center justify-center border border-[#231712]/18 shadow-[inset_0_1px_2px_rgba(255,252,247,0.75)]"
        style={{
          background:
            "conic-gradient(from 135deg at 50% 50%, #231712 0deg, #8C5A32 92deg, #F48C06 188deg, #E85D04 268deg, #231712 360deg)",
        }}
      >
        <span className="w-[54%] h-[54%] rotate-45 rounded-[3px] bg-[#FAF6F0]/90 border border-[#E85D04]/45 shadow-sm" />
      </span>
    </span>
  );
}

export default function ProtocolAgent() {
  const {
    isOpen,
    openAgent,
    closeAgent,
    messages,
    sendMessage,
    resetConversation,
    voiceEnabled,
    isSpeaking,
    speechSupported,
    toggleVoice,
  } = useAgent();

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const id = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 160);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

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

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.section
            key="agent-console"
            role="dialog"
            aria-label="Amit Protocol Studio Agent"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-[calc(100vw-2rem)] sm:w-[396px] max-h-[min(590px,calc(100vh-5.5rem))] rounded-[24px] cream-glass-solid shadow-[0_24px_64px_-20px_rgba(35,23,18,0.28)] flex flex-col overflow-hidden"
          >
            {/* Console Header */}
            <div className="px-4 py-3.5 border-b border-[#231712]/12 bg-[#F3ECE1]/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <GeometricOrbAvatar size="sm" speaking={isSpeaking} />
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-[15px] leading-tight text-[#231712] truncate">
                    Amit Kumar
                  </h2>
                  <p className="text-[11px] text-[#8C7A6B] truncate">
                    {isSpeaking
                      ? "Reading architectural notes aloud"
                      : "Protocol Studio Guide"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
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
                    title={
                      voiceEnabled
                        ? "Voice read-aloud enabled"
                        : "Enable voice read-aloud"
                    }
                    className={`w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] ${
                      voiceEnabled
                        ? "bg-[#E85D04] text-[#FAF6F0]"
                        : "text-[#5C4B43] hover:bg-[#231712]/8 hover:text-[#231712]"
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
                  title="Reset conversation"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#5C4B43] hover:bg-[#231712]/8 hover:text-[#231712] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closeAgent}
                  aria-label="Close protocol studio agent"
                  className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#5C4B43] hover:bg-[#231712]/8 hover:text-[#231712] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Thread */}
            <div
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto studio-scroll px-4 py-4 space-y-3.5 bg-[#FAF6F0]/90"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.6] ${
                      msg.role === "user"
                        ? "bg-[#231712] text-[#FAF6F0] rounded-br-sm"
                        : "bg-[#FFFCF7] text-[#231712] border border-[#231712]/10 rounded-bl-sm shadow-[0_2px_10px_-6px_rgba(35,23,18,0.12)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Contextual Follow-Up Prompt Buttons */}
              {lastMessage?.role === "assistant" &&
                lastMessage.followUps &&
                lastMessage.followUps.length > 0 && (
                  <div
                    aria-label="Suggested follow-up prompts"
                    className="pt-1 flex flex-col gap-2"
                  >
                    <span className="text-[11px] font-medium text-[#8C7A6B]">
                      Suggested questions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {lastMessage.followUps.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => sendMessage(prompt)}
                          className="text-left text-[12.5px] font-medium text-[#231712] bg-[#F3ECE1] hover:bg-[#E85D04] hover:text-[#FAF6F0] border border-[#231712]/12 hover:border-[#E85D04] rounded-xl px-3 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04]"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Composer Input */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-3 border-t border-[#231712]/12 bg-[#FFFCF7]"
            >
              <label htmlFor="protocol-agent-input" className="sr-only">
                Ask Amit about smart contract architecture
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="protocol-agent-input"
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError(false);
                  }}
                  placeholder="Ask about ERC-3643, Yul, vaults, audits..."
                  className={`flex-1 min-w-0 bg-[#FAF6F0] text-[13.5px] text-[#231712] placeholder:text-[#8C7A6B] rounded-full px-4 py-2.5 border transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85D04]/40 ${
                    inputError
                      ? "border-[#E85D04]"
                      : "border-[#231712]/14 focus:border-[#E85D04]"
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Send message to Amit"
                  className="w-10 h-10 rounded-full bg-[#E85D04] hover:bg-[#D14F00] active:scale-95 text-[#FAF6F0] inline-flex items-center justify-center transition-all duration-150 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFCF7]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {inputError && (
                <p className="mt-1.5 px-3 text-[11px] text-[#E85D04]">
                  Enter a protocol question or select one of the prompts above.
                </p>
              )}
            </form>
          </motion.section>
        ) : (
          <motion.button
            key="agent-launcher"
            type="button"
            onClick={openAgent}
            aria-label="Open Amit Protocol Studio Agent"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            className="group flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full cream-glass-solid shadow-[0_14px_34px_-14px_rgba(35,23,18,0.28)] hover:border-[#E85D04]/45 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0]"
          >
            <GeometricOrbAvatar size="sm" />
            <span className="flex flex-col items-start text-left">
              <span className="font-display font-bold text-[13.5px] leading-tight text-[#231712] group-hover:text-[#E85D04] transition-colors whitespace-nowrap">
                Ask Amit
              </span>
              <span className="hidden sm:block text-[10.5px] text-[#8C7A6B] whitespace-nowrap">
                Protocol Studio
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
