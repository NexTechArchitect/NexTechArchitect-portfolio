import {
  fullStackProjects,
  coreProjects,
  TECH_STACK,
  ARCHITECTURE_INSIGHTS,
  type ProjectItem,
  type TechDomain,
  type TechStackItem,
} from "../data/projects";

export const REQUIRED_MODAL_IDS = [
  "nexus-rwa",
  "onchain-automation",
  "sentinel-insurance",
  "fs1",
  "fs2",
  "fs3",
  "fs4",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
] as const;

export const FLAGSHIP_ORDER = [
  "nexus-rwa",
  "onchain-automation",
  "sentinel-insurance",
  "fs1",
] as const;

export function getAllProjects(): ProjectItem[] {
  return [...fullStackProjects, ...coreProjects];
}

export function getFlagshipProjects(): ProjectItem[] {
  return fullStackProjects.filter((project) => project.flagship);
}

export function filterTechByDomain(domain: TechDomain): TechStackItem[] {
  if (domain === "All") return TECH_STACK;
  return TECH_STACK.filter((item) => item.domain === domain);
}

export function filterProjectsByQuery(
  projects: ProjectItem[],
  query: string
): ProjectItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return projects;

  return projects.filter((project) => {
    const searchable = [
      project.title,
      project.description,
      project.network,
      project.standard,
      ...project.tech,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(normalized);
  });
}

export function formatContractAddress(address: string): string {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function containsEmDash(text: string): boolean {
  return text.includes("\u2014");
}

export function validatePortfolioIntegrity(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const allProjects = getAllProjects();
  const ids = allProjects.map((p) => p.id);
  const idSet = new Set(ids);

  if (ids.length !== idSet.size) {
    errors.push("Duplicate project IDs detected.");
  }

  for (const requiredId of REQUIRED_MODAL_IDS) {
    if (!idSet.has(requiredId)) {
      errors.push(`Missing required modal ID: ${requiredId}`);
    }
  }

  const flagshipIds = getFlagshipProjects().map((p) => p.id);
  if (JSON.stringify(flagshipIds) !== JSON.stringify([...FLAGSHIP_ORDER])) {
    errors.push(
      `Flagship order mismatch. Expected ${FLAGSHIP_ORDER.join(", ")}, got ${flagshipIds.join(", ")}`
    );
  }

  for (const project of allProjects) {
    if (project.description.includes("...")) {
      errors.push(`Truncated description detected in project: ${project.id}`);
    }
    if (
      containsEmDash(project.title) ||
      containsEmDash(project.description) ||
      containsEmDash(project.metricDetail)
    ) {
      errors.push(`Em-dash detected in project: ${project.id}`);
    }
  }

  for (const insight of ARCHITECTURE_INSIGHTS) {
    if (
      containsEmDash(insight.title) ||
      containsEmDash(insight.summary) ||
      containsEmDash(insight.body) ||
      containsEmDash(insight.tradeoff) ||
      containsEmDash(insight.outcome)
    ) {
      errors.push(`Em-dash detected in insight: ${insight.id}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
