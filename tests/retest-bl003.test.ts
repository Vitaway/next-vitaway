// W11 re-test pack (BL-003 "string keys" defect): every t("key") used in the PWA exists in English and Kinyarwanda,
// so no raw key like "hm_weight" can show on screen. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const files: string[] = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.tsx?$/.test(name)) files.push(path);
  }
};
walk(join(root, "app"));
walk(join(root, "lib/plus"));

test("every translation key used in code exists in en.json and rw.json", () => {
  const en = JSON.parse(readFileSync(join(root, "lib/plus/i18n/en.json"), "utf8"));
  const rw = JSON.parse(readFileSync(join(root, "lib/plus/i18n/rw.json"), "utf8"));
  const used = new Set<string>();
  for (const file of files) for (const m of readFileSync(file, "utf8").matchAll(/\bt\(\s*"([a-z][a-z0-9_]*)"\s*[,)]/g)) used.add(m[1]);
  assert.ok(used.size > 500, `found ${used.size} keys`);
  assert.deepEqual([...used].filter((k) => !(k in en)), [], "missing in en.json");
  assert.deepEqual([...used].filter((k) => !(k in rw)), [], "missing in rw.json");
});
