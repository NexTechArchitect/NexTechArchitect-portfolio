import {
  fullStackProjects,
  coreProjects,
  ARCHITECTURE_INSIGHTS,
  type ProjectItem,
  type ArchitectureInsight,
} from "../data/projects";
import { sanitizeEditorialCopy } from "./agentKnowledge";
import {
  WEB3_KNOWLEDGE_BASE,
  SUGGESTED_QUESTIONS_POOL,
  type KnowledgeEntry,
} from "./offlineKnowledgeBase";

const ALL_PROJECTS: readonly ProjectItem[] = [
  ...fullStackProjects,
  ...coreProjects,
];

const FLAGSHIP_PROJECTS: readonly ProjectItem[] = fullStackProjects.filter(
  (p) => p.flagship
);

const KNOWN_STANDARD_NUMBERS = new Set<string>([
  "155",
  "165",
  "170",
  "173",
  "712",
  "721",
  "721a",
  "1115",
  "1153",
  "1155",
  "1559",
  "1822",
  "1967",
  "2535",
  "2612",
  "2929",
  "2981",
  "3156",
  "3643",
  "4337",
  "4626",
  "4844",
  "5192",
  "5484",
  "5626",
  "6551",
  "6909",
  "7540",
  "7579",
  "7683",
  "7702",
  "19000",
]);

/** Common non-domain words excluded from fuzzy Levenshtein matching to avoid false positives. */
const FUZZY_STOP_WORDS = new Set<string>([
  "about",
  "after",
  "also",
  "always",
  "been",
  "best",
  "between",
  "book",
  "both",
  "cake",
  "capital",
  "coffee",
  "compare",
  "cook",
  "cooking",
  "could",
  "cricket",
  "define",
  "difference",
  "dinner",
  "does",
  "doing",
  "explain",
  "fast",
  "film",
  "first",
  "food",
  "football",
  "france",
  "from",
  "funny",
  "game",
  "give",
  "good",
  "great",
  "have",
  "hello",
  "here",
  "history",
  "into",
  "joke",
  "just",
  "know",
  "like",
  "love",
  "lunch",
  "make",
  "makes",
  "many",
  "more",
  "movie",
  "music",
  "news",
  "nice",
  "only",
  "other",
  "over",
  "paris",
  "pasta",
  "pizza",
  "play",
  "please",
  "politics",
  "really",
  "recipe",
  "same",
  "should",
  "show",
  "sleep",
  "soccer",
  "some",
  "song",
  "sport",
  "story",
  "such",
  "take",
  "tell",
  "than",
  "thank",
  "thanks",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "thing",
  "think",
  "this",
  "those",
  "time",
  "today",
  "tomorrow",
  "using",
  "very",
  "want",
  "weather",
  "what",
  "whats",
  "when",
  "where",
  "which",
  "while",
  "will",
  "with",
  "work",
  "works",
  "would",
  "write",
  "yesterday",
  "your",
]);

export interface NormalizedQuery {
  raw: string;
  normalized: string;
  softCollapsed: string;
  hardCollapsed: string;
  compact: string;
  hardCompact: string;
  tokens: Set<string>;
  hardTokens: Set<string>;
  tokenList: readonly string[];
  hardTokenList: readonly string[];
  extractedStandards: Set<string>;
}

export interface FallbackHistoryTurn {
  role: string;
  text?: string;
  content?: string;
}

function softCollapseText(text: string): string {
  return text.replace(/(.)\1{2,}/g, "$1");
}

function hardCollapseText(text: string): string {
  return text.replace(/(.)\1+/g, "$1");
}

function isPureNumber(s: string): boolean {
  return /^\d+$/.test(s);
}

/** Fast dependency-free bounded Levenshtein edit distance. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  let prev = new Array<number>(bl + 1);
  let curr = new Array<number>(bl + 1);
  for (let j = 0; j <= bl; j++) prev[j] = j;

  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= bl; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    const tmp = prev;
    prev = curr;
    curr = tmp;
  }
  return prev[bl];
}

function extractStandardsFromText(
  softCollapsed: string,
  hardCollapsed: string,
  tokens: Set<string>
): Set<string> {
  const found = new Set<string>();
  const stdRegex = /\b(?:erc|eip)\s*\.?\s*(\d{2,5}[a-z]?)\b/g;

  for (const variant of [softCollapsed, hardCollapsed]) {
    let match: RegExpExecArray | null;
    while ((match = stdRegex.exec(variant)) !== null) {
      const num = match[1];
      if (num) {
        found.add(num);
        found.add(`erc${num}`);
        found.add(`eip${num}`);
      }
    }
  }

  for (const tok of tokens) {
    if (KNOWN_STANDARD_NUMBERS.has(tok)) {
      found.add(tok);
      found.add(`erc${tok}`);
      found.add(`eip${tok}`);
    }
    if (tok === "aa") {
      found.add("aa");
      found.add("4337");
      found.add("erc4337");
    }
  }

  return found;
}

export function normalizeQuery(input: string): NormalizedQuery {
  const raw = input.trim();
  const preNormalized = raw
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/\be\s*\.\s*r\s*\.\s*c\b/g, "erc")
    .replace(/\be\s*\.\s*i\s*\.\s*p\b/g, "eip")
    .replace(/\be\s+r\s+c(?=\s*\d)/g, "erc")
    .replace(/\be\s+i\s+p(?=\s*\d)/g, "eip");

  const normalized = preNormalized
    .replace(/[^a-z0-9.+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const softCollapsed = softCollapseText(normalized);
  const hardCollapsed = hardCollapseText(normalized);
  const compact = softCollapsed.replace(/[\s.]+/g, "");
  const hardCompact = hardCollapsed.replace(/[\s.]+/g, "");
  const tokenList = softCollapsed ? softCollapsed.split(" ") : [];
  const hardTokenList = hardCollapsed ? hardCollapsed.split(" ") : [];
  const tokens = new Set(tokenList);
  const hardTokens = new Set(hardTokenList);
  const extractedStandards = extractStandardsFromText(
    softCollapsed,
    hardCollapsed,
    tokens
  );

  return {
    raw,
    normalized,
    softCollapsed,
    hardCollapsed,
    compact,
    hardCompact,
    tokens,
    hardTokens,
    tokenList,
    hardTokenList,
    extractedStandards,
  };
}

function cleanPhraseText(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9.+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns match strength in {1.0 (exact), 0.95 (hardCollapsed), 0.75 (fuzzy Levenshtein), 0 (none)}.
 * Skips fuzzy matching on pure numbers so 721 never accidentally matches 712.
 */
function matchSingleTokenWeight(q: NormalizedQuery, word: string): number {
  if (!word) return 0;
  const softWord = softCollapseText(word);
  if (q.tokens.has(word) || q.tokens.has(softWord)) return 1.0;

  const hardWord = hardCollapseText(word);
  if (hardWord.length >= 2 && q.hardTokens.has(hardWord)) {
    return 0.95;
  }

  if (isPureNumber(word) || word.length < 4 || FUZZY_STOP_WORDS.has(word)) {
    return 0;
  }

  const maxDist = word.length <= 6 ? 1 : 2;
  for (const tok of q.tokenList) {
    if (
      tok.length < 4 ||
      isPureNumber(tok) ||
      FUZZY_STOP_WORDS.has(tok) ||
      Math.abs(tok.length - word.length) > maxDist
    ) {
      continue;
    }
    if (levenshtein(tok, word) <= maxDist) {
      return 0.75;
    }
  }

  return 0;
}

/**
 * Evaluates exact, hard-collapsed, compact, or fuzzy multi-word match for a phrase.
 * Returns weight in {1.0, 0.95, 0.75, 0}.
 */
function matchPhraseWeight(
  q: NormalizedQuery,
  phrase: string,
  allowFuzzy = true
): number {
  const clean = cleanPhraseText(phrase);
  if (!clean) return 0;

  const softClean = softCollapseText(clean);
  const hardClean = hardCollapseText(clean);

  if (clean.includes(" ")) {
    const paddedSoft = ` ${q.softCollapsed} `;
    if (paddedSoft.includes(` ${softClean} `)) return 1.0;

    const paddedHard = ` ${q.hardCollapsed} `;
    if (paddedHard.includes(` ${hardClean} `)) return 0.95;

    const compactPhrase = softClean.replace(/[\s.]+/g, "");
    if (compactPhrase.length >= 5 && q.compact.includes(compactPhrase)) {
      return 1.0;
    }
    const hardCompactPhrase = hardClean.replace(/[\s.]+/g, "");
    if (
      hardCompactPhrase.length >= 5 &&
      q.hardCompact.includes(hardCompactPhrase)
    ) {
      return 0.95;
    }

    if (!allowFuzzy) return 0;
    const words = softClean.split(" ").filter((w) => w.length >= 2);
    if (words.length < 2 || words.length > 4) return 0;

    let minWeight = 1.0;
    for (const w of words) {
      const wScore = matchSingleTokenWeight(q, w);
      if (wScore === 0) return 0;
      if (wScore < minWeight) minWeight = wScore;
    }
    return minWeight;
  }

  // Single-word phrase
  if (q.tokens.has(clean) || q.tokens.has(softClean)) return 1.0;
  if (
    softClean.length >= 6 &&
    q.compact.includes(softClean.replace(/[\s.]+/g, ""))
  ) {
    return 1.0;
  }
  if (hardClean.length >= 3 && q.hardTokens.has(hardClean)) return 0.95;
  if (
    hardClean.length >= 6 &&
    q.hardCompact.includes(hardClean.replace(/[\s.]+/g, ""))
  ) {
    return 0.95;
  }
  return allowFuzzy ? matchSingleTokenWeight(q, softClean) : 0;
}

function hasPhrase(q: NormalizedQuery, phrase: string): boolean {
  return matchPhraseWeight(q, phrase, true) >= 0.75;
}

function getTurnText(turn: FallbackHistoryTurn): string {
  const raw =
    typeof turn.text === "string"
      ? turn.text
      : typeof turn.content === "string"
        ? turn.content
        : "";
  return raw.trim();
}

const PROJECT_STANDARD_SECONDARY: Record<string, readonly string[]> = {
  "nexus-rwa": ["erc3643", "erc 3643", "3643", "rwa", "kyc"],
  "onchain-automation": ["keeper", "keepers", "automation"],
  "sentinel-insurance": ["erc4626", "erc 4626", "4626", "aave v3", "aave"],
  fs1: ["perps", "ccip", "paymaster", "erc4337", "erc 4337"],
  fs2: ["dao", "timelock", "governance"],
  fs4: ["erc5484", "erc 5484", "5484", "soulbound", "sbt"],
  c1: ["stablecoin", "cdp"],
  c2: ["vrf"],
  c3: ["erc4337", "erc 4337", "4337", "entrypoint", "userop"],
  c4: ["uups", "eip1822", "1822", "erc1967", "1967"],
  c5: ["merkle", "airdrop", "eip712"],
  c6: ["erc721", "erc 721", "721", "nft"],
  c7: ["erc20", "erc 20"],
  c8: ["aggregatorv3"],
};

function findInsightForProject(
  project: ProjectItem
): ArchitectureInsight | undefined {
  const titleLower = project.title.toLowerCase();
  const shortLower = project.shortTitle.toLowerCase();
  return ARCHITECTURE_INSIGHTS.find((insight) => {
    const proto = insight.protocol.toLowerCase();
    return (
      proto.includes(shortLower) ||
      titleLower.includes(proto) ||
      (project.id === "nexus-rwa" && insight.id === "l3") ||
      (project.id === "onchain-automation" && insight.id === "l2") ||
      (project.id === "sentinel-insurance" && insight.id === "l1") ||
      (project.id === "fs1" && insight.id === "l4") ||
      (project.id === "fs4" && insight.id === "l5")
    );
  });
}

type ProjectIntent =
  | "walkthrough"
  | "gas"
  | "security"
  | "architecture"
  | "links"
  | "story";

function formatProjectLinks(project: ProjectItem): string[] {
  const lines: string[] = [];
  if (project.liveUrl) {
    lines.push(`- **Live App:** ${project.liveUrl}`);
  }
  lines.push(`- **GitHub:** ${project.link}`);
  return lines;
}

function formatProjectContracts(project: ProjectItem): string[] {
  if (project.smartContracts.length === 0) return [];
  const lines: string[] = ["- **Smart Contracts:**"];
  for (const c of project.smartContracts) {
    const addr = c.address ? ` (\`${c.address}\`)` : "";
    lines.push(`  - **${c.name}**${addr}: ${c.responsibility}`);
  }
  return lines;
}

function formatProjectWalkthrough(project: ProjectItem): string {
  const lines: string[] = [
    `### ${project.title}`,
    `**Category:** ${
      project.category === "fullstack"
        ? "Full-Stack Web3 Protocol"
        : "Core EVM Contract"
    } | **Network:** ${project.network} | **Standard:** ${project.standard}`,
    "",
    `**Story & Problem Solved:** ${project.story}`,
    "",
    `**Core Architecture:** ${project.architecture}`,
    "",
    ...formatProjectContracts(project),
    "",
    "- **Security Invariants:**",
    ...project.securityInvariants.map((inv) => `  - ${inv}`),
    "",
    "- **Gas Optimizations:**",
    ...project.gasOptimizations.map((opt) => `  - ${opt}`),
    "",
    `- **Key Highlight:** ${project.metric} (${project.metricDetail})`,
    `- **Tech Stack:** ${project.tech.join(", ")}`,
    ...formatProjectLinks(project),
  ];

  const relatedInsight = findInsightForProject(project);
  if (relatedInsight) {
    lines.push(
      `- **Workbench Code Reference:** \`${relatedInsight.filename}\` (${relatedInsight.outcome})`
    );
  }

  return lines.join("\n");
}

function formatProjectGasDeepDive(project: ProjectItem): string {
  const relatedInsight = findInsightForProject(project);
  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  const lines: string[] = [
    `### Gas Optimizations in ${project.title}`,
    `Built on **${project.network}** (${project.standard}), **${project.title}** minimizes EVM execution and storage cost through targeted contract-level optimizations:`,
    "",
    ...project.gasOptimizations.map((opt) => `- ${opt}`),
    "",
    `- **Key Metric:** ${project.metric} (${project.metricDetail})`,
  ];

  if (deployed.length > 0) {
    lines.push(
      `- **Deployed Contracts:** ${deployed
        .map((c) => `**${c.name}** (\`${c.address}\`)`)
        .join(", ")}`
    );
  }

  if (relatedInsight) {
    lines.push(
      `- **Related Workbench Code:** \`${relatedInsight.filename}\` (${relatedInsight.tradeoff})`
    );
  }

  lines.push(...formatProjectLinks(project));
  lines.push(
    "",
    `Want to inspect the **security invariants** or **smart contract architecture** of ${project.shortTitle} next?`
  );
  return lines.join("\n");
}

function formatProjectSecurityDeepDive(project: ProjectItem): string {
  const relatedInsight = findInsightForProject(project);
  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  const lines: string[] = [
    `### Security Invariants & Threat Model: ${project.title}`,
    `In **${project.title}** (${project.network} | ${project.standard}), security invariants are enforced at the contract boundary:`,
    "",
    ...project.securityInvariants.map((inv) => `- ${inv}`),
    "",
    `- **Architecture Context:** ${project.architecture}`,
  ];

  if (deployed.length > 0) {
    lines.push(
      `- **Deployed Contracts:** ${deployed
        .map((c) => `**${c.name}** (\`${c.address}\`)`)
        .join(", ")}`
    );
  }

  if (relatedInsight) {
    lines.push(
      `- **Related Workbench Guard:** \`${relatedInsight.filename}\` (${relatedInsight.outcome})`
    );
  }

  lines.push(...formatProjectLinks(project));
  lines.push(
    "",
    `Ask if you'd like a breakdown of ${project.shortTitle}'s **gas optimizations** or **individual contracts**.`
  );
  return lines.join("\n");
}

function formatProjectArchitectureDeepDive(project: ProjectItem): string {
  const lines: string[] = [
    `### Architecture & Smart Contracts: ${project.title}`,
    `**Network:** ${project.network} | **Standard:** ${project.standard} | **Stack:** ${project.tech.join(", ")}`,
    "",
    project.architecture,
    "",
    ...formatProjectContracts(project),
    "",
    ...formatProjectLinks(project),
  ];
  return lines.join("\n");
}

function formatProjectStoryDeepDive(project: ProjectItem): string {
  const lines: string[] = [
    `### Why Amit Built ${project.title}`,
    project.story,
    "",
    `**How It Works:** ${project.architecture}`,
    "",
    `- **Highlight:** ${project.metric} (${project.metricDetail})`,
    ...formatProjectLinks(project),
  ];
  return lines.join("\n");
}

function formatProjectLinksOnly(project: ProjectItem): string {
  const lines: string[] = [
    `### Links & Deployed References: ${project.title}`,
    `**Network:** ${project.network} | **Standard:** ${project.standard}`,
    "",
    ...formatProjectLinks(project),
  ];

  const deployed = project.smartContracts.filter((c) => Boolean(c.address));
  if (deployed.length > 0) {
    lines.push("- **Verified Contract Addresses:**");
    for (const c of deployed) {
      lines.push(`  - **${c.name}:** \`${c.address}\``);
    }
  }

  return lines.join("\n");
}

function formatProjectForIntent(
  project: ProjectItem,
  intent: ProjectIntent
): string {
  switch (intent) {
    case "gas":
      return formatProjectGasDeepDive(project);
    case "security":
      return formatProjectSecurityDeepDive(project);
    case "architecture":
      return formatProjectArchitectureDeepDive(project);
    case "story":
      return formatProjectStoryDeepDive(project);
    case "links":
      return formatProjectLinksOnly(project);
    case "walkthrough":
    default:
      return formatProjectWalkthrough(project);
  }
}

function formatProjectComparison(a: ProjectItem, b: ProjectItem): string {
  const formatContractsBrief = (p: ProjectItem) =>
    p.smartContracts.map((c) => `\`${c.name}\``).join(", ");

  return [
    `### Side-by-Side Comparison: ${a.title} vs. ${b.title}`,
    "",
    `**1. ${a.title}** (${a.network} | ${a.standard})`,
    `- **Problem Solved:** ${a.story}`,
    `- **Core Contracts:** ${formatContractsBrief(a)}`,
    `- **Top Security Invariant:** ${a.securityInvariants[0] ?? a.metricDetail}`,
    `- **Top Gas Optimization:** ${a.gasOptimizations[0] ?? a.metric}`,
    `- **Stack:** ${a.tech.join(", ")}`,
    ...(a.liveUrl ? [`- **Live App:** ${a.liveUrl}`] : []),
    `- **GitHub:** ${a.link}`,
    "",
    `**2. ${b.title}** (${b.network} | ${b.standard})`,
    `- **Problem Solved:** ${b.story}`,
    `- **Core Contracts:** ${formatContractsBrief(b)}`,
    `- **Top Security Invariant:** ${b.securityInvariants[0] ?? b.metricDetail}`,
    `- **Top Gas Optimization:** ${b.gasOptimizations[0] ?? b.metric}`,
    `- **Stack:** ${b.tech.join(", ")}`,
    ...(b.liveUrl ? [`- **Live App:** ${b.liveUrl}`] : []),
    `- **GitHub:** ${b.link}`,
    "",
    `Ask a follow-up on either **${a.shortTitle}** or **${b.shortTitle}** to drill into its contracts, invariants, or gas benchmarks.`,
  ].join("\n");
}

function detectProjectIntent(q: NormalizedQuery): ProjectIntent {
  const s = q.softCollapsed;
  const asksWalkthrough =
    /\b(walkthrough|walk me through|overview|full breakdown|everything about|deep dive|summarize|summary|all details)\b/.test(
      s
    );
  const asksGas =
    /\b(gas|yul|assembly|optimi[sz]\w*|sload|sstore|storage pack\w*|cheaper|cost|calldata|efficiency)\b/.test(
      s
    ) || matchSingleTokenWeight(q, "optimization") >= 0.75;
  const asksSecurity =
    /\b(security|invariants?|audit\w*|vulnerab\w*|attack\w*|threat\w*|risks?|reentrancy|flash ?loan|exploit\w*|safeguard\w*|fuzz\w*|slither|defen[cs]e)\b/.test(
      s
    ) ||
    matchSingleTokenWeight(q, "security") >= 0.75 ||
    matchSingleTokenWeight(q, "invariant") >= 0.75;
  const asksArchitecture =
    /\b(architecture|smart contracts?|contracts?|components?|modules?|tech stack|stack|how does it work|how it works|design)\b/.test(
      s
    ) || matchSingleTokenWeight(q, "architecture") >= 0.75;
  const asksLinks =
    /\b(github|repo|repository|source code|live app|live demo|demo|url|links?|website|contract address\w*|addresses)\b/.test(
      s
    );
  const asksStory =
    /\b(story|why did|motivation|problem solved|what problem|purpose|background)\b/.test(
      s
    );

  const dimensionCount =
    Number(asksGas) +
    Number(asksSecurity) +
    Number(asksArchitecture) +
    Number(asksStory);

  if (asksWalkthrough || dimensionCount >= 2) {
    return "walkthrough";
  }
  if (asksGas) return "gas";
  if (asksSecurity) return "security";
  if (asksArchitecture) return "architecture";
  if (asksStory) return "story";
  if (asksLinks) return "links";
  return "walkthrough";
}

function matchWorkbenchSnippet(
  q: NormalizedQuery
): ArchitectureInsight | undefined {
  for (const insight of ARCHITECTURE_INSIGHTS) {
    const fname = insight.filename.toLowerCase();
    const baseName = fname.replace(/\.(sol|yul)$/, "");
    if (
      q.raw.toLowerCase().includes(fname) ||
      q.compact.includes(baseName) ||
      q.hardCompact.includes(hardCollapseText(baseName)) ||
      hasPhrase(q, baseName)
    ) {
      return insight;
    }
  }
  return undefined;
}

function formatWorkbenchWalkthrough(insight: ArchitectureInsight): string {
  return [
    `### ${insight.filename} (${insight.protocol})`,
    `**Domain:** ${insight.domain} | **Language:** ${insight.language}`,
    "",
    insight.body,
    "",
    `- **Engineering Tradeoff:** ${insight.tradeoff}`,
    `- **Verified Outcome:** ${insight.outcome}`,
    "",
    "```solidity",
    insight.code,
    "```",
  ].join("\n");
}

function extractRepoSlug(githubUrl: string): string {
  const trimmed = githubUrl.replace(/\/+$/, "");
  const parts = trimmed.split("/");
  return (parts[parts.length - 1] ?? "").toLowerCase();
}

const EXPLICIT_PROJECT_THRESHOLD = 70;

function scoreProjects(
  q: NormalizedQuery,
  hasPortfolioContext: boolean
): Array<{ project: ProjectItem; score: number }> {
  const scored: Array<{ project: ProjectItem; score: number }> = [];

  for (const project of ALL_PROJECTS) {
    let score = 0;

    const titleW = matchPhraseWeight(q, project.title, true);
    if (titleW > 0) score += 220 * titleW;

    if (project.shortTitle.length >= 4) {
      const shortW = matchPhraseWeight(q, project.shortTitle, true);
      if (shortW > 0) score += 150 * shortW;
    }

    const repoSlug = extractRepoSlug(project.link);
    if (repoSlug.length >= 6) {
      const slugW = matchPhraseWeight(q, repoSlug, false);
      if (slugW > 0) score += 160 * slugW;
    }

    for (const alias of project.aliases) {
      const aliasW = matchPhraseWeight(q, alias, alias.length >= 6);
      if (aliasW > 0) {
        score += (alias.length >= 6 ? 120 : 90) * aliasW;
      }
    }

    for (const c of project.smartContracts) {
      const cleanName = c.name.replace(/\.(sol|yul)$/i, "").split(" ")[0] ?? "";
      if (
        (cleanName.length >= 5 && matchPhraseWeight(q, cleanName, true) > 0) ||
        (c.address && q.raw.toLowerCase().includes(c.address.toLowerCase()))
      ) {
        score += 140;
      }
    }

    const secondary = PROJECT_STANDARD_SECONDARY[project.id] ?? [];
    for (const term of secondary) {
      if (matchPhraseWeight(q, term, false) > 0) {
        if (score > 0) {
          score += 25;
        } else if (hasPortfolioContext) {
          score += 45;
        } else {
          score += 4;
        }
      }
    }

    if (score > 0) {
      scored.push({ project, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function resolveProjectFromHistory(
  history?: readonly FallbackHistoryTurn[]
): ProjectItem | undefined {
  if (!history || history.length === 0) return undefined;
  const recent = history.slice(-4).reverse();

  for (const turn of recent) {
    const text = getTurnText(turn);
    if (!text) continue;

    // 1. Check exact heading match in recent assistant replies
    const firstLine = text.split("\n")[0]?.toLowerCase() ?? "";
    if (firstLine.startsWith("### ")) {
      for (const project of ALL_PROJECTS) {
        if (
          firstLine.includes(project.title.toLowerCase()) ||
          (project.shortTitle.length >= 5 &&
            firstLine.includes(project.shortTitle.toLowerCase()))
        ) {
          return project;
        }
      }
    }

    // 2. Otherwise score the turn text against all projects
    const turnQuery = normalizeQuery(text);
    const matches = scoreProjects(turnQuery, true);
    if (matches[0] && matches[0].score >= EXPLICIT_PROJECT_THRESHOLD) {
      return matches[0].project;
    }
  }

  return undefined;
}

function isLikelyProjectFollowUp(q: NormalizedQuery): boolean {
  const s = q.softCollapsed;
  const hasPronounOrDeictic =
    /\b(it|its|this one|that one|this project|that project|this protocol|that protocol|the project|the protocol|the contract|the contracts|same project|same protocol)\b/.test(
      s
    );

  const isShortDimensionFollowUp =
    q.tokens.size <= 8 &&
    (/\b(gas|security|invariants?|risks?|contracts?|architecture|stack|github|repo|link|demo|live|story|why|address|addresses|audit|vulnerabilities|tradeoffs?|how does it|what about)\b/.test(
      s
    ) ||
      matchSingleTokenWeight(q, "security") >= 0.75 ||
      matchSingleTokenWeight(q, "architecture") >= 0.75 ||
      matchSingleTokenWeight(q, "optimization") >= 0.75);

  return hasPronounOrDeictic || isShortDimensionFollowUp;
}

const MIN_KNOWLEDGE_SCORE = 8.5;

function scoreKnowledgeBase(
  q: NormalizedQuery,
  isConceptualQuestion: boolean
): Array<{ entry: KnowledgeEntry; score: number }> {
  const scored: Array<{ entry: KnowledgeEntry; score: number }> = [];

  for (const entry of WEB3_KNOWLEDGE_BASE) {
    let score = 0;

    // 1. Noise-resistant ERC/EIP standard number extraction (handles "ercccccccc 20", "e.r.c 4626", "5626", "1115", "19000", "aa")
    if (entry.standardNumbers) {
      let stdHit = false;
      for (const std of entry.standardNumbers) {
        if (q.extractedStandards.has(std)) {
          stdHit = true;
          break;
        }
      }
      if (stdHit) {
        score += 34;
      }
    }

    // 2. Compact token matches
    if (entry.exactCompact) {
      let compactBoost = 0;
      for (const compactTerm of entry.exactCompact) {
        const hardTerm = hardCollapseText(compactTerm);
        if (q.compact === compactTerm || q.tokens.has(compactTerm)) {
          compactBoost = Math.max(compactBoost, 24);
        } else if (
          q.hardCompact === hardTerm ||
          (hardTerm.length >= 3 && q.hardTokens.has(hardTerm))
        ) {
          compactBoost = Math.max(compactBoost, 22);
        } else if (
          compactTerm.length >= 4 &&
          (q.compact.includes(compactTerm) || q.hardCompact.includes(hardTerm))
        ) {
          compactBoost = Math.max(compactBoost, 18);
        }
      }
      score += compactBoost;
    }

    // 3. Exact / hard-collapsed / fuzzy phrase matches
    for (const phrase of entry.exactPhrases) {
      const w = matchPhraseWeight(q, phrase, true);
      if (w > 0) {
        const base = phrase.includes(" ") ? 16 : 12;
        score += base * w;
      }
    }

    // 4. Supporting domain keywords (exact / hard / fuzzy)
    for (const kw of entry.keywords) {
      const w = matchPhraseWeight(q, kw, true);
      if (w > 0) {
        const kwBase = kw.length >= 7 ? 12 : 9;
        score += kwBase * w;
      }
    }

    if (score >= MIN_KNOWLEDGE_SCORE && isConceptualQuestion) {
      score += 6;
    }

    if (score >= MIN_KNOWLEDGE_SCORE) {
      scored.push({ entry, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function buildFlagshipOverview(): string {
  const blocks = FLAGSHIP_PROJECTS.map((project, idx) => {
    const livePart = project.liveUrl ? ` | Live: ${project.liveUrl}` : "";
    const contractSummary = project.contracts?.length
      ? ` Key contracts: ${project.contracts
          .map((c) => `\`${c.label}\` (${c.role})`)
          .join(", ")}.`
      : "";
    return `${idx + 1}. **${project.title}** (${project.standard}): **${project.metric}**, ${project.metricDetail}.${contractSummary}\n   GitHub: ${project.link}${livePart}`;
  });

  const additionalFullStack = fullStackProjects
    .filter((p) => !p.flagship)
    .map((p) => `**${p.shortTitle}** (${p.standard})`)
    .join(", ");

  const coreHighlights = coreProjects
    .slice(0, 4)
    .map((p) => `**${p.shortTitle}**`)
    .join(", ");

  return [
    "### Amit Kumar's Flagship DeFi Protocols",
    "Amit architects and ships production multi-contract systems across Ethereum and EVM-compatible mainnets:",
    "",
    ...blocks,
    "",
    `Beyond these flagship protocols, his full-stack gallery includes ${additionalFullStack}, plus core EVM Foundry systems like ${coreHighlights} and more.`,
    "",
    "Ask about any specific protocol (for example **Nexus RWA**, **Nexus Perps v2**, **Sentinel Insurance**, or **DSC StableCoin**) to inspect contracts, security invariants, and gas mechanics.",
  ].join("\n");
}

function buildContactAndBioReply(): string {
  return [
    "### Connect with Amit Kumar (NexTechArchitect)",
    "Amit Kumar is a **Smart Contract Engineer & DeFi Protocol Architect** based in **Jammu, India (IST)**, available for remote Smart Contract Engineer, Protocol Engineer, DeFi Security/Foundry, and Full-Stack Web3 roles worldwide (full-time or contract/audit).",
    "",
    "- **Email:** nextech.amit@gmail.com",
    "- **GitHub:** https://github.com/NexTechArchitect",
    "- **LinkedIn:** https://www.linkedin.com/in/amit-kumar-811a11277",
    "- **X (Twitter):** https://x.com/itZ_AmiT0",
    "- **Portfolio:** https://nex-tech-architect-portfolio.vercel.app/",
    "",
    "**Credentials & Education:**",
    "- **Cyfrin Updraft:** Smart Contract & Security Engineering graduate",
    "- **Alchemy University:** Ethereum Developer Bootcamp",
    "- **Cluster University of Jammu:** Associate of Science / B.Sc. Science candidate",
    "",
    "You can also click **Resume** in the top navigation bar or footer to view and download Amit's full CV.",
  ].join("\n");
}

function buildWhyHireAmitReply(): string {
  return [
    "### Why Teams Hire Amit Kumar (NexTechArchitect)",
    "Amit brings a **security-first DeFi architect** mindset paired with full-stack shipping velocity:",
    "",
    "- **Raw EIP-Spec Implementation:** Builds directly from protocol standards (`ERC-3643`, `ERC-4626`, `ERC-4337`, `ERC-5484`, `EIP-1822 UUPS`, `EIP-712`) rather than stitching opaque boilerplate.",
    "- **Security Closed at Design Time:** Enforces compliance inside transfer hooks, blocks flash-loan governance via prior-block checkpoints + Timelocks, hardens ERC-4626 vaults with virtual shares, and verifies invariants via stateful **Foundry** handler fuzzing and **Slither** CI sweeps.",
    "- **EVM Hot-Path Optimization:** Uses packed 256-bit storage slots, O(1) swap-and-pop queues, and targeted inline **Yul** (proven 35% gas savings in `SwapPopQueue.yul`).",
    "- **End-to-End Ownership:** Ships audited Solidity cores alongside production **Next.js, TypeScript, Wagmi v2 & Viem** frontends across Ethereum and EVM L2s.",
    "",
    "Reach Amit directly at `nextech.amit@gmail.com` or open his **Resume** in the top navigation bar.",
  ].join("\n");
}

function buildExperienceTrackRecordReply(): string {
  return [
    "### Amit Kumar's Web3 Experience & Track Record",
    "- **In Web3 Since 2019:** Deep familiarity across DeFi cycles, EVM internals, and protocol security patterns.",
    "- **Protocol Architecture & Web3 Labs (Jan 2024 - Present):** Operating as **NexTechArchitect**, designing and shipping full-stack decentralized protocols and core EVM primitives.",
    "- **Verified Output:** **15+ shipped projects** and **60+ deployed smart contracts** spanning RWA tokenization (**Nexus RWA**), decentralized keeper networks (**On-Chain Automation**), yield-bearing parametric insurance (**Sentinel Insurance**), cross-chain leveraged perpetuals (**Nexus Perpetuals DEX** & **Nexus Perps v2 on Polkadot Hub**), DAO governance, and CDP stablecoins.",
    "- **Chain-Agnostic EVM Engineering:** Production experience across Ethereum, Arbitrum, Base, Optimism, Sepolia, and Polkadot Hub EVM.",
    "",
    "Want to inspect his flagship builds or check his availability for remote roles?",
  ].join("\n");
}

function buildAvailabilityRolesReply(): string {
  return [
    "### Availability, Remote Work, Timezone & Target Roles",
    "- **Open Roles:** Remote **Smart Contract Engineer**, **Protocol Engineer**, **DeFi Security / Foundry Engineer**, and **Full-Stack Web3 Engineer** (open to full-time positions as well as contract/audit engagements).",
    "- **Location & Timezone:** Based in **Jammu, India (IST, UTC+5:30)** with flexible daily overlap for **US, EU, and global remote engineering teams**.",
    "- **Direct Contact:** Email `nextech.amit@gmail.com`, connect on [LinkedIn](https://www.linkedin.com/in/amit-kumar-811a11277), or view/download his CV via the **Resume** button in the top navigation bar.",
  ].join("\n");
}

function buildEducationCredentialsReply(): string {
  return [
    "### Amit Kumar's Education & Web3 Security Credentials",
    "- **Cyfrin Updraft:** Smart Contract & Security Engineering graduate (Solidity, Foundry stateful invariant fuzzing, auditing workflows, and DeFi threat modeling).",
    "- **Alchemy University:** Ethereum Developer Bootcamp graduate.",
    "- **Cluster University of Jammu:** Associate of Science / B.Sc. Science candidate.",
    "- **Proof of Work:** 15+ open-source protocols and 60+ deployed contracts verifiable on [GitHub](https://github.com/NexTechArchitect).",
  ].join("\n");
}

function buildToughestChallengePhilosophyReply(): string {
  return [
    "### Toughest Engineering Challenges & Security Philosophy",
    "Amit treats smart contract engineering as **adversarial systems design**, threat-modeling every economic and technical invariant before writing production Solidity:",
    "",
    "- **Compliance at the Transfer Boundary (`Nexus RWA`):** Enforcing `ERC-3643` KYC/OFAC identity checks and a 15% 24h Chainlink NAV circuit breaker directly inside token transfer hooks without centralized off-chain signers.",
    "- **O(1) Keeper Gas Engineering (`On-Chain Automation`):** Replacing unbounded job loops with 1-based index mappings and inline Yul swap-and-pop compaction (`SwapPopQueue.yul`), cutting keeper execution gas by **35%** while preventing block-gas-limit DoS.",
    "- **Flash-Loan & Inflation Hardening (`Sentinel Insurance`):** Combining prior-block vote checkpoints (`ClaimsGovernor.sol`), Timelock delays, and ERC-4626 virtual-share offsets verified through handler-based Foundry stateful invariant fuzzing.",
    "",
    "Ask me to walk through `SwapPopQueue.yul`, `ClaimsGovernor.sol`, or `ComplianceHook.sol` to inspect the code directly.",
  ].join("\n");
}

function buildSecurityAndGasReply(): string {
  const yulInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l2");
  const govInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l1");
  const rwaInsight = ARCHITECTURE_INSIGHTS.find((i) => i.id === "l3");

  return [
    "### Amit's Protocol Security & EVM Gas Engineering Approach",
    "Amit closes attack vectors at design time rather than patching after deployment, combining threat modeling, Foundry stateful fuzzing, and targeted inline Yul optimization:",
    "",
    `- **Flash-Loan & Governance Hardening:** ${
      govInsight
        ? govInsight.summary
        : "Prior-block vote checkpoints (block.number - 1) and TimelockController execution delays prevent same-block vote capture."
    } (\`ClaimsGovernor.sol\`)`,
    `- **O(1) Data Structures & Inline Yul:** ${
      yulInsight
        ? yulInsight.outcome
        : "Up to 35% execution gas reduction via 1-based index mappings, swap-and-pop removal, and direct storage length updates."
    } (\`SwapPopQueue.yul\`)`,
    `- **On-Chain Compliance & Oracle Circuit Breakers:** ${
      rwaInsight
        ? rwaInsight.summary
        : "ERC-3643 transfer hooks verify KYC/OFAC status on-chain alongside a 15% 24-hour Chainlink NAV deviation circuit breaker."
    } (\`ComplianceHook.sol\`)`,
    "- **Invariant Testing & Static Analysis:** Handler-based stateful Foundry fuzz campaigns, Anvil mainnet fork testing, Slither CI sweeps, strict Checks-Effects-Interactions (CEI), custom errors, and 50-slot UUPS storage gaps.",
    "",
    "Scroll to the **Workbench** section or ask me to explain `SwapPopQueue.yul`, `ClaimsGovernor.sol`, `ComplianceHook.sol`, `CCIPMarginReceiver.sol`, or `ReputationStorageV1.sol`.",
  ].join("\n");
}

function buildOverviewMenu(isGreeting: boolean): string {
  const opener = isGreeting
    ? "Hey! Great to meet you. I'm **Ask Amit**, Amit Kumar's personal protocol assistant."
    : "I can help with **Amit Kumar's (NexTechArchitect)** DeFi protocols, Solidity & Yul code, hiring details, or deep Web3/EVM engineering questions:";

  return [
    opener,
    "",
    "- **Flagship & Gallery Protocols:** Ask for a deep dive or comparison on **Nexus RWA**, **On-Chain Automation**, **Sentinel Insurance**, **Nexus Perpetuals DEX**, **Nexus Perps v2 (Polkadot Hub)**, **DSC StableCoin**, **VRF Raffle**, **Merkle-712 Airdrop**, or any other gallery project.",
    "- **ERC / EIP Standards & DeFi Mechanics:** Ask about `ERC-20`, `ERC-721/721A`, `ERC-1155`, `ERC-4337` (AA), `ERC-4626`, `ERC-3643`, `ERC-5484`, `ERC-2612`, `ERC-2981`, `ERC-3156`, `ERC-1967/UUPS`, `ERC-2535` Diamonds, `ERC-6551`, `EIP-7702`, `EIP-712`, `EIP-1153`, `EIP-1559`, `EIP-4844`, `CREATE2`, Uniswap V2/V3/V4, Aave V3, MEV, L2 rollups, or Foundry invariant testing.",
    "- **Hiring, Workbench & Contact:** Ask why teams hire Amit, his availability/timezone, inspect `SwapPopQueue.yul` or `ClaimsGovernor.sol`, or email `nextech.amit@gmail.com`.",
    "",
    "What would you like to explore first?",
  ].join("\n");
}

function matchConversationalTurn(
  q: NormalizedQuery,
  history?: readonly FallbackHistoryTurn[]
): string | null {
  const variants = [q.softCollapsed, q.hardCollapsed];
  const activeProject = resolveProjectFromHistory(history);

  // 1. Check-ins & casual Hinglish/English chat
  const checkInRe =
    /^(?:(?:hi|hey|helo|hello|hlo|yo|gm|bro|bhai)\s+)?(how are you|how are u|how r u|how are you doing|hows it going|how is it going|how you doing|hows everything|how is everything|whats up|whatsup|what is up|wasup|wassup|sup|kaise ho|kya hal|kya haal|kya hal hai|kya haal hai|al god|all good|sab badiya|sab badhiya)(?:\s+(amit|bro|bhai|mate|man|today|there))?$/;
  if (variants.some((v) => checkInRe.test(v))) {
    return "Doing great, thanks for asking! Always energized to talk DeFi architecture, Solidity internals, and **Amit Kumar's** deployed protocols. What's on your mind today: a walkthrough of a flagship system like **Nexus Perps v2** or **Nexus RWA**, a Solidity/EVM deep dive, or Amit's hiring details?";
  }

  // 2. Greetings (English + Hinglish + stretched forms like "hiiiiii", "heyy", "helloo", "hlo")
  const greetingRe =
    /^(hi|hello|helo|hlo|hey|yo|hola|namaste|salam|salaam|gm|good morning|god morning|good afternoon|god afternoon|good evening|god evening|greetings|bro|bhai)(?:\s+(there|amit|bro|bhai|mate|man|friend|everyone))?$/;
  if (variants.some((v) => greetingRe.test(v))) {
    return buildOverviewMenu(true);
  }

  // 3. Identity & Meta questions
  const identityRe =
    /^(who are you|what are you|tell me about yourself|tel me about yourself|what is your name|whats your name|who am i talking to|are you amit|are you a bot|are you bot|are you ai|are you an ai|help|menu|options)(?:\s+please)?$/;
  if (variants.some((v) => identityRe.test(v))) {
    if (q.softCollapsed === "help" || q.softCollapsed === "menu" || q.softCollapsed === "options") {
      return buildOverviewMenu(false);
    }
    return "I'm **Ask Amit**, the protocol assistant for **Amit Kumar (NexTechArchitect)**, a Smart Contract Engineer and DeFi Protocol Architect. Think of me as an interactive engineering guide to his 15+ deployed protocols, inline Yul and Solidity primitives, security invariants, hiring details, and deep Web3/EVM architecture. Ask me anything about his work or Solidity/DeFi engineering!";
  }

  // 4. Pleasantries
  const pleasantryRe =
    /^(nice to meet you|nice to met you|pleasure meeting you|pleasure meting you|pleasure to meet you|glad to meet you|good to meet you|god to met you|happy to meet you|hapy to met you|great to meet you)(?:\s+(too|to|amit|as well|as wel))?$/;
  if (variants.some((v) => pleasantryRe.test(v))) {
    return "Likewise, great to meet you! Whether you're evaluating **Amit Kumar** for a Smart Contract Engineer role, reviewing a protocol walkthrough, or exploring EVM and DeFi internals, I'm here to help. Where would you like to start?";
  }

  // 5. Gratitude (English + Hinglish)
  const gratitudeRe =
    /^(?:(?:ok|okay|k|cool|col|great|awesome|got it|nice)\s+)?(thank you|thanks|thankyou|thx|ty|tysm|shukriya|dhanyawad|apreciate it|appreciate it|much appreciated|much apreciated|cheers|chers|grateful)(?:\s+(so much|very much|a lot|amit|bro|bhai|mate|man|again|for that|for explaining|for the info|for helping|for the help))?$/;
  if (variants.some((v) => gratitudeRe.test(v))) {
    if (activeProject) {
      return `You're very welcome! Glad that helped unpack **${activeProject.title}**. If you want to dig deeper into its smart contracts, gas optimizations, or security invariants, or compare it against another protocol in Amit's gallery, just say the word.`;
    }
    return "You're very welcome! Happy to help anytime. If you'd like to walk through any of Amit's DeFi protocols, inspect a Solidity or Yul snippet, or reach out to Amit directly at `nextech.amit@gmail.com`, just let me know.";
  }

  // 6. Farewells (including "gn", "good night", "bye", "cya")
  const farewellRe =
    /^(bye|by|goodbye|godbye|good bye|god bye|see you|se you|see ya|se ya|cya|take care|later|catch you later|have a good day|have a great day|good night|god night|gn|peace out|peace|tata)(?:\s+(amit|bro|bhai|mate|man|soon|son))?$/;
  if (variants.some((v) => farewellRe.test(v))) {
    return "Take care, and thanks for stopping by **Amit Kumar's** portfolio! Whenever you want to connect directly with Amit, you can reach him at `nextech.amit@gmail.com`, check his repositories on [GitHub](https://github.com/NexTechArchitect), or connect on [LinkedIn](https://www.linkedin.com/in/amit-kumar-811a11277). See you around!";
  }

  // 7. Short positive reactions & acknowledgments (English + Hinglish)
  const reactionRe =
    /^(nice|cool|col|awesome|great|amazing|fire|dope|impressive|impresive|love it|loved it|sick|sweet|swet|solid|good|god|sounds good|sounds god|ok|okay|k|got it|makes sense|makes sence|understood|understod|noted|wow|brilliant|briliant|clean|neat|super|superb|perfect|fair enough|interesting|mast|badiya|badhiya|sahi|sahi hai|lol|haha|hahaha|hehe|nice work|good job|great work|awesome work|very nice|so cool|pretty cool|thats cool|that is cool|thats awesome|that is awesome|thats nice|that is nice|thats great|that is great)(?:\s+(work|stuff|stuf|job|man|bro|bhai|mate|amit))?$/;
  if (variants.some((v) => reactionRe.test(v))) {
    if (activeProject) {
      return `Glad you like how **${activeProject.title}** is put together! Want to inspect its security invariants, check its gas optimizations, or compare it side by side with another protocol in Amit's portfolio?`;
    }
    return [
      "Glad to hear it! Two high-signal places to jump in next:",
      "",
      "- **Flagship Protocol Walkthrough:** Ask about **Nexus RWA Protocol** (ERC-3643 institutional compliance) or **On-Chain Automation** (35% Yul gas savings).",
      "- **Live Code Deep Dive:** Ask me to walk through `SwapPopQueue.yul` or `ClaimsGovernor.sol` line by line.",
      "",
      "Which one sounds more interesting?",
    ].join("\n");
  }

  return null;
}

function matchRecruiterQuestion(q: NormalizedQuery): string | null {
  const s = q.softCollapsed;

  // 1. Why hire Amit / strengths / stand out
  if (
    /\b(why hire|why should (we|i|a team|teams|a defi team) hire|what makes (amit|him) stand out|stand out|his strengths|amit strengths|strengths|why amit)\b/.test(
      s
    )
  ) {
    return buildWhyHireAmitReply();
  }

  // 2. Toughest challenge / proudest build / security philosophy
  if (
    /\b(toughest challenge|hardest (problem|challenge|bug)|proudest|favorite (project|build)|security philosophy|engineering philosophy|approach to security)\b/.test(
      s
    )
  ) {
    return buildToughestChallengePhilosophyReply();
  }

  // 3. Experience & track record
  if (
    /\b(experience|years of experience|track record|how long has amit|how many (projects|contracts)|career|work history)\b/.test(
      s
    ) &&
    !q.tokens.has("foundry") &&
    !q.tokens.has("uniswap")
  ) {
    return buildExperienceTrackRecordReply();
  }

  // 4. Availability, remote work, timezone, roles
  if (
    /\b(available|availability|open to work|open for|remote|timezone|time zone|relocate|what roles|target roles|full time|freelance|contract role)\b/.test(
      s
    ) &&
    !q.tokens.has("contact") &&
    !q.tokens.has("connect") &&
    !q.tokens.has("email")
  ) {
    return buildAvailabilityRolesReply();
  }

  // 5. Education & credentials (standalone)
  if (
    /\b(education|degree|university|college|qualification|credentials|certifications?)\b/.test(
      s
    ) &&
    !q.tokens.has("contact") &&
    !q.tokens.has("connect") &&
    !q.tokens.has("email")
  ) {
    return buildEducationCredentialsReply();
  }

  // 6. Contact, hiring, resume, bio, socials, Cyfrin/Alchemy credentials
  if (
    /\b(contact|connect|hire|hiring|email|reach|linkedin|github|twitter|resume|cv|location|where is amit|cyfrin|alchemy|who is amit|about amit|background)\b/.test(
      s
    ) &&
    !s.includes("alchemy sdk")
  ) {
    return buildContactAndBioReply();
  }

  return null;
}

function buildDataUnavailableReply(
  history?: readonly FallbackHistoryTurn[]
): string {
  const recentText = (history ?? [])
    .slice(-6)
    .map((turn) => getTurnText(turn).toLowerCase())
    .join(" ");

  const freshPool = SUGGESTED_QUESTIONS_POOL.filter(
    (question) => !recentText.includes(question.toLowerCase())
  );
  const sourcePool =
    freshPool.length >= 3 ? [...freshPool] : [...SUGGESTED_QUESTIONS_POOL];

  // Fisher-Yates shuffle for true randomized suggestions
  for (let i = sourcePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = sourcePool[i];
    sourcePool[i] = sourcePool[j];
    sourcePool[j] = tmp;
  }

  const picked = sourcePool.slice(0, 3);

  return [
    "I don't have offline data available for that specific question right now.",
    "",
    "Here are 3 things you can ask me instead:",
    ...picked.map((q) => `- ${q}`),
    "",
    "For anything outside my offline knowledge base, you can reach **Amit Kumar** directly at `nextech.amit@gmail.com`.",
  ].join("\n");
}

/**
 * Project-First + Multi-Turn + Extreme Typo-Tolerant Offline Reasoning Engine
 * grounded in `src/data/projects.ts` and `src/lib/offlineKnowledgeBase.ts`.
 */
export function generateLocalFallbackReply(
  userMessage: string,
  history?: readonly FallbackHistoryTurn[]
): string {
  const q = normalizeQuery(userMessage);

  if (!q.normalized) {
    return sanitizeEditorialCopy(buildOverviewMenu(false));
  }

  // Step 0: Direct Workbench code file walkthrough (e.g. SwapPopQueue.yul, ClaimsGovernor.sol)
  const matchedSnippet = matchWorkbenchSnippet(q);
  if (matchedSnippet) {
    return sanitizeEditorialCopy(formatWorkbenchWalkthrough(matchedSnippet));
  }

  const hasPortfolioContext =
    /\b(amit|nextecharchitect|portfolio|his|your|flagship|built|shipped|deployed|protocol gallery|case study|walkthrough)\b/.test(
      q.softCollapsed
    );

  const isConceptualQuestion =
    /^(what is|what iz|what are|whats|tel me|tell me|explain|define|how does|how do|difference between|compare|tell me about)\b/.test(
      q.hardCollapsed
    ) && !hasPortfolioContext;

  // Step 1: Project Detection First (10x Priority over generic words like "security" or "gas")
  const projectMatches = scoreProjects(q, hasPortfolioContext);
  const explicitProjects = projectMatches.filter(
    (m) => m.score >= EXPLICIT_PROJECT_THRESHOLD
  );

  // Side-by-side comparison if 2+ distinct projects are explicitly mentioned
  const asksComparison =
    /\b(compare|comparison|vs|versus|difference between|differ|better)\b/.test(
      q.softCollapsed
    );
  if (
    explicitProjects.length >= 2 &&
    (asksComparison || explicitProjects[1].score >= 100)
  ) {
    return sanitizeEditorialCopy(
      formatProjectComparison(
        explicitProjects[0].project,
        explicitProjects[1].project
      )
    );
  }

  // Single explicit project matched -> tailor answer to user sub-intent
  if (explicitProjects.length >= 1) {
    const intent = detectProjectIntent(q);
    return sanitizeEditorialCopy(
      formatProjectForIntent(explicitProjects[0].project, intent)
    );
  }

  // Step 2: Natural Human Small Talk (English + Hinglish) & Capabilities Menu
  const conversationalReply = matchConversationalTurn(q, history);
  if (conversationalReply) {
    return sanitizeEditorialCopy(conversationalReply);
  }

  const asksCapabilities =
    /\b(what can you do|how can you help|help me|what do you know)\b/.test(
      q.softCollapsed
    );
  if (asksCapabilities) {
    return sanitizeEditorialCopy(buildOverviewMenu(false));
  }

  // Step 3: Explicit Flagship / Portfolio gallery overview
  const asksFlagshipOverview =
    /\b(flagship|top projects|best projects|all projects|what projects|his projects|your projects|project gallery|what has amit built|what did amit build|portfolio projects)\b/.test(
      q.softCollapsed
    );
  if (asksFlagshipOverview) {
    return sanitizeEditorialCopy(buildFlagshipOverview());
  }

  // Step 4: Multi-Turn Follow-Up Memory (scan last 4 turns for active project)
  const knowledgeMatches = scoreKnowledgeBase(q, isConceptualQuestion);
  const topKnowledge = knowledgeMatches[0];
  const strongNewWeb3Concept =
    Boolean(topKnowledge) &&
    topKnowledge.score >= 22 &&
    !/\b(it|its|this project|that project|this protocol|that protocol)\b/.test(
      q.softCollapsed
    );

  if (!strongNewWeb3Concept && isLikelyProjectFollowUp(q)) {
    const activeProject = resolveProjectFromHistory(history);
    if (activeProject) {
      const intent = detectProjectIntent(q);
      return sanitizeEditorialCopy(
        formatProjectForIntent(activeProject, intent)
      );
    }
  }

  // Step 5: General Amit security & gas engineering overview (check before generic contact/bio)
  const mentionsSecurity =
    q.softCollapsed.includes("security") ||
    matchSingleTokenWeight(q, "security") >= 0.75;
  const mentionsGasOrApproach =
    q.softCollapsed.includes("gas") ||
    q.softCollapsed.includes("approach") ||
    matchSingleTokenWeight(q, "optimization") >= 0.75;
  if (hasPortfolioContext && mentionsSecurity && mentionsGasOrApproach) {
    return sanitizeEditorialCopy(buildSecurityAndGasReply());
  }

  // Step 6: Recruiter, Hiring Manager, Contact, Credentials & Philosophy Q&A
  const recruiterReply = matchRecruiterQuestion(q);
  if (recruiterReply) {
    return sanitizeEditorialCopy(recruiterReply);
  }

  if (mentionsSecurity && mentionsGasOrApproach) {
    return sanitizeEditorialCopy(buildSecurityAndGasReply());
  }

  // Step 7: Portfolio-contextualized secondary project match vs. Offline Web3/EVM/DeFi Encyclopedia
  const topProject = projectMatches[0];
  if (
    topProject &&
    hasPortfolioContext &&
    (!topKnowledge || topProject.score > topKnowledge.score)
  ) {
    const intent = detectProjectIntent(q);
    return sanitizeEditorialCopy(
      formatProjectForIntent(topProject.project, intent)
    );
  }

  if (topKnowledge) {
    return sanitizeEditorialCopy(topKnowledge.entry.answer());
  }

  // Step 8: Generic "projects" inquiry with no specific project matched
  if (q.tokens.has("projects") || q.tokens.has("project")) {
    return sanitizeEditorialCopy(buildFlagshipOverview());
  }

  // Step 9: Honest "data not available" fallback with 3 random non-duplicate suggested questions
  return sanitizeEditorialCopy(buildDataUnavailableReply(history));
}
