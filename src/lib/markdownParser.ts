export type MarkdownBlock =
  | { type: "code"; lang: string; code: string }
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "bullet"; text: string }
  | { type: "ordered"; index: string; text: string }
  | { type: "divider" }
  | { type: "paragraph"; text: string };

/**
 * Parses assistant markdown text into structured blocks without exposing raw
 * heading hashes (`###`), fence markers, or unformatted list prefixes.
 * Handles both complete responses and partially streamed fenced code blocks.
 */
export function parseAssistantBlocks(input: string): MarkdownBlock[] {
  const normalized = input.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const blocks: MarkdownBlock[] = [];

  let inCodeFence = false;
  let codeLang = "";
  let codeLines: string[] = [];

  const flushCode = () => {
    blocks.push({
      type: "code",
      lang: codeLang.trim(),
      code: codeLines.join("\n").replace(/\n$/, ""),
    });
    codeLang = "";
    codeLines = [];
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      if (!inCodeFence) {
        inCodeFence = true;
        codeLang = trimmed.slice(3).trim();
        codeLines = [];
      } else {
        inCodeFence = false;
        flushCode();
      }
      continue;
    }

    if (inCodeFence) {
      codeLines.push(rawLine);
      continue;
    }

    if (!trimmed) {
      continue;
    }

    if (/^([-*_]){3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+?)(?:\s+#+)?$/);
    if (headingMatch) {
      const level = Math.min(4, Math.max(1, headingMatch[1].length)) as
        | 1
        | 2
        | 3
        | 4;
      blocks.push({
        type: "heading",
        level,
        text: headingMatch[2].trim(),
      });
      continue;
    }

    const bulletMatch = trimmed.match(/^(?:[-*•])\s+(.+)$/);
    if (bulletMatch) {
      blocks.push({
        type: "bullet",
        text: bulletMatch[1].trim(),
      });
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d{1,2})\.\s+(.+)$/);
    if (orderedMatch) {
      blocks.push({
        type: "ordered",
        index: orderedMatch[1],
        text: orderedMatch[2].trim(),
      });
      continue;
    }

    blocks.push({
      type: "paragraph",
      text: trimmed,
    });
  }

  // Gracefully display an in-progress fenced block during live streaming
  if (inCodeFence && codeLines.length > 0) {
    flushCode();
  }

  return blocks;
}

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "italic"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "email"; address: string };

const INLINE_PATTERN =
  /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s)]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\*(?!\s)[^*\n]+?(?<!\s)\*)/g;

/**
 * Tokenizes inline markdown (bold, italic, inline code, links, emails) so
 * rendered chat replies never leak literal `**` or raw markdown punctuation.
 */
export function parseInlineTokens(text: string): InlineToken[] {
  const rawTokens = text.split(INLINE_PATTERN);
  const tokens: InlineToken[] = [];

  for (const token of rawTokens) {
    if (!token) continue;

    if (token.startsWith("**") && token.endsWith("**") && token.length > 4) {
      tokens.push({ type: "bold", value: token.slice(2, -2) });
      continue;
    }

    if (token.startsWith("`") && token.endsWith("`") && token.length > 2) {
      tokens.push({ type: "code", value: token.slice(1, -1) });
      continue;
    }

    const mdLink = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (mdLink) {
      tokens.push({ type: "link", label: mdLink[1], href: mdLink[2] });
      continue;
    }

    if (/^https?:\/\//.test(token)) {
      const cleanUrl = token.replace(/[.,;:!?]+$/, "");
      const trailing = token.slice(cleanUrl.length);
      tokens.push({ type: "link", label: cleanUrl, href: cleanUrl });
      if (trailing) {
        tokens.push({ type: "text", value: trailing });
      }
      continue;
    }

    if (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(token)) {
      tokens.push({ type: "email", address: token });
      continue;
    }

    if (token.startsWith("*") && token.endsWith("*") && token.length > 2) {
      tokens.push({ type: "italic", value: token.slice(1, -1) });
      continue;
    }

    tokens.push({ type: "text", value: token });
  }

  return tokens;
}
