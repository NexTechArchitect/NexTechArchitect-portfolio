"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AGENT_DEFAULT_GREETING,
  AGENT_INITIAL_PROMPTS,
  buildProjectPrompt,
} from "@/lib/agentKnowledge";
import { streamAmitChat } from "@/lib/agentService";

export interface AgentMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  followUps?: readonly string[];
  topic?: string;
  isError?: boolean;
  retryPrompt?: string;
}

interface AgentContextValue {
  isOpen: boolean;
  isThinking: boolean;
  openAgent: () => void;
  closeAgent: () => void;
  toggleAgent: () => void;
  messages: readonly AgentMessage[];
  activeTopic: string;
  sendMessage: (question: string) => void;
  retryMessage: (errorMessageId: string, prompt: string) => void;
  explainProtocol: (protocolId: string) => void;
  resetConversation: () => void;
  voiceEnabled: boolean;
  isSpeaking: boolean;
  speechSupported: boolean;
  toggleVoice: () => void;
  stopSpeaking: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

const subscribeNoop = () => () => {};
const getSpeechSupportedClient = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;
const getSpeechSupportedServer = () => false;

function createGreetingMessage(): AgentMessage {
  return {
    id: "greeting-initial",
    role: "assistant",
    text: AGENT_DEFAULT_GREETING,
    followUps: AGENT_INITIAL_PROMPTS,
    topic: "greeting",
  };
}

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>(() => [
    createGreetingMessage(),
  ]);
  const [activeTopic, setActiveTopic] = useState<string>("greeting");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSupported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupportedClient,
    getSpeechSupportedServer
  );

  const counterRef = useRef(1);
  const voiceEnabledRef = useRef(voiceEnabled);
  const messagesRef = useRef(messages);
  const requestSeqRef = useRef(0);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback((text: string) => {
    if (
      !voiceEnabledRef.current ||
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const plainText = text
        .replace(/```[\s\S]*?```/g, "code snippet")
        .replace(/[*`#]/g, "");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 0.99;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (
        !next &&
        typeof window !== "undefined" &&
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return next;
    });
  }, []);

  const openAgent = useCallback(() => setIsOpen(true), []);
  const closeAgent = useCallback(() => {
    stopSpeaking();
    setIsOpen(false);
  }, [stopSpeaking]);
  const toggleAgent = useCallback(() => {
    setIsOpen((prev) => {
      if (prev) stopSpeaking();
      return !prev;
    });
  }, [stopSpeaking]);

  const executeLiveTurn = useCallback(
    (
      promptText: string,
      options?: { replaceErrorId?: string }
    ) => {
      const trimmed = promptText.trim();
      if (!trimmed) return;

      const seq = ++requestSeqRef.current;
      const assistantId = `assistant-${counterRef.current++}`;
      const replaceErrorId = options?.replaceErrorId;

      const cleanHistory = messagesRef.current
        .filter((m) => !m.isError && m.id !== "greeting-initial")
        .map((m) => ({ role: m.role, text: m.text }));

      setIsOpen(true);
      setIsThinking(true);

      if (replaceErrorId) {
        setMessages((prev) => prev.filter((m) => m.id !== replaceErrorId));
      } else {
        const userId = `user-${counterRef.current++}`;
        setMessages((prev) => [
          ...prev,
          { id: userId, role: "user", text: trimmed },
        ]);
      }

      void (async () => {
        let streamedInserted = false;

        const result = await streamAmitChat(
          trimmed,
          cleanHistory,
          (partialText) => {
            if (requestSeqRef.current !== seq) return;
            setIsThinking(false);
            if (!streamedInserted) {
              streamedInserted = true;
              setActiveTopic("live");
              setMessages((prev) => [
                ...prev,
                {
                  id: assistantId,
                  role: "assistant",
                  text: partialText,
                  topic: "live",
                },
              ]);
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, text: partialText } : m
                )
              );
            }
          }
        );

        if (requestSeqRef.current !== seq) return;

        setIsThinking(false);
        if (!streamedInserted) {
          setActiveTopic(result.mode === "gemini" ? "live" : "local");
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              text: result.text,
              topic: result.mode === "gemini" ? "live" : "local",
            },
          ]);
        }
        speakText(result.text);
      })();
    },
    [speakText]
  );

  const sendMessage = useCallback(
    (rawQuestion: string) => {
      executeLiveTurn(rawQuestion);
    },
    [executeLiveTurn]
  );

  const retryMessage = useCallback(
    (errorMessageId: string, prompt: string) => {
      executeLiveTurn(prompt, { replaceErrorId: errorMessageId });
    },
    [executeLiveTurn]
  );

  const explainProtocol = useCallback(
    (protocolId: string) => {
      executeLiveTurn(buildProjectPrompt(protocolId));
    },
    [executeLiveTurn]
  );

  const resetConversation = useCallback(() => {
    requestSeqRef.current += 1;
    stopSpeaking();
    setIsThinking(false);
    setActiveTopic("greeting");
    setMessages([createGreetingMessage()]);
  }, [stopSpeaking]);

  const value = useMemo<AgentContextValue>(
    () => ({
      isOpen,
      isThinking,
      openAgent,
      closeAgent,
      toggleAgent,
      messages,
      activeTopic,
      sendMessage,
      retryMessage,
      explainProtocol,
      resetConversation,
      voiceEnabled,
      isSpeaking,
      speechSupported,
      toggleVoice,
      stopSpeaking,
    }),
    [
      isOpen,
      isThinking,
      openAgent,
      closeAgent,
      toggleAgent,
      messages,
      activeTopic,
      sendMessage,
      retryMessage,
      explainProtocol,
      resetConversation,
      voiceEnabled,
      isSpeaking,
      speechSupported,
      toggleVoice,
      stopSpeaking,
    ]
  );

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export function useAgent(): AgentContextValue {
  const ctx = useContext(AgentContext);
  if (!ctx) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return ctx;
}
