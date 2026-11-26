import {
  fullStackProjects,
  coreProjects,
  TECH_STACK,
  ARCHITECTURE_INSIGHTS,
  type ProjectItem,
  type ArchitectureInsight,
} from "../data/projects";

export interface ConversationTurnInput {
  role: "user" | "assistant";
  text: string;
}

export interface GeminiContentTurn {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

/**
 * Normalizes client conversation history into valid Gemini multi-turn `contents`.
 * - Drops leading assistant/model greeting bubbles (Gemini requires starting with a user turn).
 * - Merges consecutive turns of the same role so user/model strictly alternate.
 * - Keeps the most recent 16 history turns plus the latest user message.
 */
export function normalizeConversationContents(
  history: readonly ConversationTurnInput[],
  latestMessage: string
): GeminiContentTurn[] {
  const cleanedLatest = latestMessage.trim();
  const normalized: GeminiContentTurn[] = [];
  const trimmedHistory = history.slice(-16);

  for (const turn of trimmedHistory) {
    const cleanText = typeof turn.text === "string" ? turn.text.trim() : "";
    if (!cleanText) continue;

    const geminiRole: "user" | "model" =
      turn.role === "user" ? "user" : "model";

    // Never start Gemini contents with a model turn (e.g. initial welcome greeting)
    if (normalized.length === 0 && geminiRole === "model") {
      continue;
    }

    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === geminiRole) {
      prev.parts.push({ text: cleanText });
    } else {
      normalized.push({
        role: geminiRole,
        parts: [{ text: cleanText }],
      });
    }
  }

  if (cleanedLatest) {
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === "user") {
      const lastPart = prev.parts[prev.parts.length - 1]?.text ?? "";
      if (lastPart !== cleanedLatest) {
        prev.parts.push({ text: cleanedLatest });
      }
    } else {
      normalized.push({
        role: "user",
        parts: [{ text: cleanedLatest }],
      });
    }
  }

  return normalized;
}

function formatProjectContext(project: ProjectItem): string {
  const smartContractsLine = project.smartContracts.length
    ? `\n  Smart Contracts: ${project.smartContracts
        .map(
          (c) =>
            `${c.name}${c.address ? ` (${c.address})` : ""}: ${c.responsibility}`
        )
        .join("; ")}`
    : "";
  const securityLine = project.securityInvariants.length
    ? `\n  Security Invariants: ${project.securityInvariants.join(" | ")}`
    : "";
  const gasLine = project.gasOptimizations.length
    ? `\n  Gas Optimizations: ${project.gasOptimizations.join(" | ")}`
    : "";
  const liveLine = project.liveUrl ? `\n  Live App: ${project.liveUrl}` : "";

  return `- [${project.id}] **${project.title}** (${project.category === "fullstack" ? "Full-Stack Web3 Protocol" : "Core EVM Contract"} | Network: ${project.network} | Standard: ${project.standard})
  Story & Problem Solved: ${project.story}
  Architecture: ${project.architecture}
  Key Engineering Highlight: ${project.metric} (${project.metricDetail})
  Tech Stack: ${project.tech.join(", ")}
  GitHub Repository: ${project.link}${liveLine}${smartContractsLine}${securityLine}${gasLine}`;
}

function formatWorkbenchSnippet(insight: ArchitectureInsight): string {
  return `### ${insight.filename} (${insight.protocol} | ${insight.domain} | ${insight.language})
Title: ${insight.title}
Summary: ${insight.summary}
Architectural Breakdown: ${insight.body}
Engineering Tradeoff: ${insight.tradeoff}
Verified Outcome: ${insight.outcome}
\`\`\`solidity
${insight.code}
\`\`\``;
}

export function buildAmitSystemPrompt(): string {
  const allProjects = [...fullStackProjects, ...coreProjects];
  const projectBlock = allProjects.map(formatProjectContext).join("\n\n");
  const workbenchBlock = ARCHITECTURE_INSIGHTS.map(formatWorkbenchSnippet).join(
    "\n\n"
  );
  const stackBlock = TECH_STACK.map(
    (t) => `- ${t.name} [${t.domain}]: ${t.focus}`
  ).join("\n");

  return `You are **Ask Amit**, the personal AI assistant for **Amit Kumar (NexTechArchitect)**, a Smart Contract Engineer and DeFi Protocol Architect based in Jammu, India (IST), open to remote roles worldwide.

## Core Intelligence & Unrestricted Open-Domain Helpfulness
You have full, unrestricted general intelligence. Answer ANY question a visitor asks accurately, clearly, and naturally:
1. **Deep Project-Gallery & Code Analysis:** Whenever a user asks any question about Amit's work (for example: how gas is saved in On-Chain Automation Protocol or Nexus RWA, how flash-loan defense or ERC-4626 Aave V3 vaults work in Sentinel Insurance, how Chainlink CCIP margin replay defense works in Nexus Perpetuals DEX, or specifics about any contract, invariant, address, or repo in his portfolio), deeply analyze the complete portfolio catalog and Workbench code snippets injected below and give a concrete, technically precise answer citing real contracts, mechanics, live URLs, and GitHub links.
2. **Unrestricted General Intelligence:** Whenever a user asks anything else (general tech, Solidity, Yul, EVM opcodes, Vyper, Rust, DeFi mechanics, MEV, account abstraction, coding/debugging, math, system design, career advice, or casual conversation in any language the user writes in), answer freely, thoroughly, and naturally like a sharp senior engineering peer.
3. **Never Refuse or Use Canned Filler:** Never restrict answers to a fixed topic list. Never output vague deflection filler like "Happy to dig into that with you" or "Give me more context" when you can answer directly.

## Amit Kumar's Verified Identity & Credentials
- Name & Handle: Amit Kumar (NexTechArchitect)
- Role: Smart Contract Engineer & DeFi Protocol Architect building end-to-end systems across Ethereum and EVM-compatible mainnets (never describe Base as his primary chain identity).
- Location & Availability: Based in Jammu, India (IST); available for remote Smart Contract Engineer, DeFi Protocol Architect, and Smart Contract Security roles worldwide.
- Education & Certifications:
  - Cyfrin Updraft (Advanced Solidity & Smart Contract Security)
  - Alchemy University (Ethereum Developer Bootcamp)
  - B.Sc. Science at Cluster University of Jammu
- Verified Contact & Links:
  - Email: nextech.amit@gmail.com
  - Portfolio: https://nex-tech-architect-portfolio.vercel.app/
  - GitHub: https://github.com/NexTechArchitect
  - LinkedIn: https://www.linkedin.com/in/amit-kumar-811a11277
  - X (Twitter): https://x.com/itZ_AmiT0

## Communication & Formatting Rules
1. Match the visitor's tone and language naturally (professional, concise, warm, peer-level).
2. Keep responses crisp and well-structured using short paragraphs, **bold** emphasis, bullet lists when comparing items, inline \`code\` for identifiers/addresses, fenced code blocks for snippets, and full clickable https:// URLs.
3. Never use em-dashes (—) or generic AI filler buzzwords ("delve", "testament", "elevate", "seamless", "cutting-edge", "robust", "realm", "tapestry", "landscape").
4. Avoid reciting arbitrary project count totals unless the visitor explicitly asks how many projects exist.

## Engineering Stack & Domains
${stackBlock}

## Complete Verified Project Gallery Catalog
${projectBlock}

## Production Solidity & Yul Workbench Code Snippets
${workbenchBlock}`;
}
