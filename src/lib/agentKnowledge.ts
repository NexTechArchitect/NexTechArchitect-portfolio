import {
  fullStackProjects,
  coreProjects,
  type ProjectItem,
} from "../data/projects";

export const AGENT_DEFAULT_GREETING =
  "Hey! I'm Amit Kumar's personal AI assistant. Ask me anything about Amit's DeFi protocols, smart contract architecture, or any general tech and Web3 question.";

export const AGENT_INITIAL_PROMPTS: readonly string[] = [
  "What are Amit's flagship projects?",
  "How can I connect with Amit?",
  "How does Amit approach protocol security and gas optimization?",
];

export const BANNED_BUZZWORDS = [
  "delve",
  "testament",
  "elevate",
  "seamless",
  "cutting-edge",
  "realm",
  "tapestry",
  "robust",
  "landscape",
] as const;

const ALL_PROJECTS: readonly ProjectItem[] = [
  ...fullStackProjects,
  ...coreProjects,
];

export function sanitizeEditorialCopy(text: string): string {
  return text.replace(/\u2014/g, ", ").replace(/[ \t]{2,}/g, " ").trim();
}

export function buildProjectPrompt(protocolId: string): string {
  const project = ALL_PROJECTS.find((p) => p.id === protocolId);
  if (project) {
    return `Give me a technical walkthrough of ${project.title}, including its architecture, smart contracts, security invariants, and gas optimizations.`;
  }
  return `Explain ${protocolId} from Amit's portfolio in technical detail.`;
}
