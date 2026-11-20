// Phase 3 W17 (BL-083): the 12 prototype badges on "My badges". Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseBadgeBoard } from "../lib/plus/badge-board.ts";

const CODES = [
  "plus_first_check_in", "plus_streak_7", "plus_local_foodie", "plus_learner_1_4", "plus_steady_mover", "plus_clinic_connected",
  "plus_first_review", "plus_coach_kudos", "plus_team_player", "plus_halfway", "plus_graduate", "plus_champion",
];

const server = {
  badges: CODES.map((code, i) => ({
    id: i + 1, code, name: code, description: "", icon: "star", earned: i === 0 || i === 7,
    available: code !== "plus_steady_mover" && code !== "plus_champion" ? true : code === "plus_champion",
    progress: { current: i === 0 ? 1 : 0, target: 1 },
  })).concat([{ id: 99, code: null, name: "Article badge", description: "", icon: null, earned: true, available: true, progress: null } as never]),
  earned_count: 3,
  total: 13,
  board: { earned: 2, total: 12 },
};

test("the board counts only the 12 prototype badges and keeps their order", () => {
  const b = parseBadgeBoard(server);
  assert.equal(b.earnedCount, 2);
  assert.equal(b.total, 12);
  assert.deepEqual(b.badges.slice(0, 12).map((x) => x.code), CODES);
  assert.equal(b.badges[0].icon, "star");
});

test("a badge the app cannot record yet is marked unavailable", () => {
  const b = parseBadgeBoard(server);
  assert.equal(b.badges.find((x) => x.code === "plus_steady_mover")?.available, false);
  assert.equal(b.badges.find((x) => x.code === "plus_first_check_in")?.available, true);
});

test("older servers without board still sort earned first", () => {
  const b = parseBadgeBoard({ badges: [{ id: 1, name: "a", earned: false }, { id: 2, name: "b", earned: true }] });
  assert.equal(b.badges[0].name, "b");
  assert.equal(b.badges[0].available, true);
});

test("every prototype badge has English and Kinyarwanda text, and none mention weight", () => {
  for (const lang of ["en", "rw"]) {
    const d = JSON.parse(readFileSync(`lib/plus/i18n/${lang}.json`, "utf8"));
    for (const c of CODES) {
      assert.ok(d[`badge_${c}_name`], `${lang} ${c} name`);
      assert.ok(d[`badge_${c}_desc`], `${lang} ${c} desc`);
    }
    assert.ok(d.badge_coming_soon);
  }
  const en = JSON.parse(readFileSync("lib/plus/i18n/en.json", "utf8"));
  for (const c of CODES) assert.doesNotMatch(en[`badge_${c}_desc`], /weight|kg|glucose|blood/i);
});

test("meal photo detail shows kudos from the care team", () => {
  // meal-photos.ts imports the app client, so check the source rather than importing it.
  const lib = readFileSync("lib/plus/meal-photos.ts", "utf8");
  assert.match(lib, /kudos: kudos && kudos\.message \?/);
  const ui = readFileSync("app/components/plus/meals/meal-photos.tsx", "utf8");
  assert.match(ui, /photo\.kudos \?/);
  assert.match(ui, /meal_kudos_from/);
});
