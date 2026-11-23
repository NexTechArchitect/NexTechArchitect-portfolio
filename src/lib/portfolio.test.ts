import test from "node:test";
import assert from "node:assert/strict";
import {
  REQUIRED_MODAL_IDS,
  FLAGSHIP_ORDER,
  getAllProjects,
  getFlagshipProjects,
  filterTechByDomain,
  filterProjectsByQuery,
  formatContractAddress,
  validatePortfolioIntegrity,
} from "./portfolio";
import { fullStackProjects, coreProjects } from "../data/projects";

test("all 15 required modal IDs are wired and unique", () => {
  const all = getAllProjects();
  assert.equal(all.length, 15);
  const ids = new Set(all.map((p) => p.id));
  assert.equal(ids.size, 15);
  for (const id of REQUIRED_MODAL_IDS) {
    assert.ok(ids.has(id), `Expected modal ID ${id} to exist`);
  }
});

test("flagship protocols appear at top of fullStackProjects in exact priority order", () => {
  const topFour = fullStackProjects.slice(0, 4).map((p) => p.id);
  assert.deepEqual(topFour, [...FLAGSHIP_ORDER]);

  const flagships = getFlagshipProjects().map((p) => p.id);
  assert.deepEqual(flagships, [...FLAGSHIP_ORDER]);
});

test("portfolio data integrity passes with zero truncated descriptions and zero em-dashes", () => {
  const result = validatePortfolioIntegrity();
  assert.equal(
    result.valid,
    true,
    `Integrity check failed: ${result.errors.join(" | ")}`
  );
});

test("filterTechByDomain filters accurately across all domains", () => {
  const all = filterTechByDomain("All");
  const security = filterTechByDomain("Security & Testing");
  const defi = filterTechByDomain("DeFi Standards");

  assert.equal(all.length, 14);
  assert.equal(security.length, 2);
  assert.ok(security.some((item) => item.name.includes("Foundry")));
  assert.ok(security.some((item) => item.name.includes("Slither")));
  assert.ok(defi.some((item) => item.name.includes("ERC-3643")));
  assert.ok(defi.some((item) => item.name.includes("ERC-4626")));
});

test("filterProjectsByQuery matches protocol title, standard, and tech", () => {
  const rwa = filterProjectsByQuery(fullStackProjects, "ERC-3643");
  assert.equal(rwa.length, 1);
  assert.equal(rwa[0].id, "nexus-rwa");

  const vrf = filterProjectsByQuery(coreProjects, "VRF");
  assert.equal(vrf.length, 1);
  assert.equal(vrf[0].id, "c2");

  const empty = filterProjectsByQuery(coreProjects, "   ");
  assert.equal(empty.length, coreProjects.length);
});

test("formatContractAddress formats standard 42-char EVM addresses cleanly", () => {
  assert.equal(
    formatContractAddress("0x00c0E82e0C81c4Df096aAd98f2aA5A399b34131c"),
    "0x00c0...131c"
  );
  assert.equal(formatContractAddress("0x1234"), "0x1234");
});
