// W12 fix: the receipt, payment status and My programmes screens must be readable in dark mode.
// Reads the theme tokens from plus.css and checks WCAG contrast (>= 4.5:1) in both themes. Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/app/plus.css", import.meta.url), "utf8");
const screens = readFileSync(new URL("../app/components/plus/programmes/screens.tsx", import.meta.url), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `missing ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/(--vc-[a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[m[1]] = m[2].toLowerCase();
  return out;
}

function ratio(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const light = block(".vita-root");
const dark = { ...light, ...block('.vita-root[data-theme="dark"]') };

const PAIRS: Array<[string, string]> = [
  ["--vc-ink", "--vc-surface"],
  ["--vc-amount", "--vc-surface"],
  ["--vc-warn-ink", "--vc-warn-bg"],
  ["--vc-bad-ink", "--vc-bad-bg"],
  ["--vc-bad-ink", "--vc-surface"],
  ["--vc-ok-ink", "--vc-surface"],
  ["--vc-chip-teal-ink", "--vc-surface"],
  ["--vc-chip-orange-ink", "--vc-surface"],
  ["--vc-muted", "--vc-surface"],
];

for (const [name, theme] of [["light", light], ["dark", dark]] as const) {
  test(`receipt colours have >= 4.5:1 contrast in the ${name} theme`, () => {
    for (const [fg, bg] of PAIRS) {
      assert.ok(theme[fg] && theme[bg], `${name}: ${fg} or ${bg} is not defined`);
      const r = ratio(theme[fg], theme[bg]);
      assert.ok(r >= 4.5, `${name}: ${fg} on ${bg} is only ${r.toFixed(2)}:1`);
    }
  });
}

test("receipt-related screens use theme tokens, not fixed text colours that vanish in dark mode", () => {
  for (const fixed of ['color: "#7A4A00"', 'color: "#E85D2F"', 'color: "#B3261E"', 'fg: "#9A5B00"', 'fg: "#C2410C"', 'color: "#1f8f83"']) {
    assert.equal(screens.includes(fixed), false, `screens.tsx still has ${fixed}`);
  }
  assert.ok(screens.includes('color: "var(--vc-amount)"'));
  assert.ok(screens.includes('background: "var(--vc-warn-bg)", color: "var(--vc-warn-ink)"'));
});
