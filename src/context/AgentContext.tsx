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
  generateAgentReply,
  getProtocolExplanation,
} from "@/lib/agentKnowledge";

export interface AgentMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  followUps?: readonly string[];
  topic?: string;
}

interface AgentContextValue {
  isOpen: boolean;
  openAgent: () => void;
  closeAgent: () => void;
  toggleAgent: () => void;
  messages: readonly AgentMessage[];
  activeTopic: string;
  sendMessage: (question: string) => void;
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

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

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

  const speakText = useCallback(
    (text: string) => {
      if (
        !voiceEnabledRef.current ||
        typeof window === "undefined" ||
        !("speechSynthesis" in window)
      ) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.98;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
      }
    },
    []
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next && typeof window !== "undefined" && "speechSynthesis" in window) {
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

  const sendMessage = useCallback(
    (rawQuestion: string) => {
      const trimmed = rawQuestion.trim();
      if (!trimmed) return;

      const reply = generateAgentReply(trimmed);
      const userId = `user-${counterRef.current++}`;
      const assistantId = `assistant-${counterRef.current++}`;

      setIsOpen(true);
      setActiveTopic(reply.topic);
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", text: trimmed },
        {
          id: assistantId,
          role: "assistant",
          text: reply.text,
          followUps: reply.followUps,
          topic: reply.topic,
        },
      ]);
      speakText(reply.text);
    },
    [speakText]
  );

  const explainProtocol = useCallback(
    (protocolId: string) => {
      const { prompt, reply } = getProtocolExplanation(protocolId);
      const userId = `user-${counterRef.current++}`;
      const assistantId = `assistant-${counterRef.current++}`;

      setIsOpen(true);
      setActiveTopic(reply.topic);
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", text: prompt },
        {
          id: assistantId,
          role: "assistant",
          text: reply.text,
          followUps: reply.followUps,
          topic: reply.topic,
        },
      ]);
      speakText(reply.text);
    },
    [speakText]
  );

  const resetConversation = useCallback(() => {
    stopSpeaking();
    setActiveTopic("greeting");
    setMessages([createGreetingMessage()]);
  }, [stopSpeaking]);

  const value = useMemo<AgentContextValue>(
    () => ({
      isOpen,
      openAgent,
      closeAgent,
      toggleAgent,
      messages,
      activeTopic,
      sendMessage,
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
      openAgent,
      closeAgent,
      toggleAgent,
      messages,
      activeTopic,
      sendMessage,
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
