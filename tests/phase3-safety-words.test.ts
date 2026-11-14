// Phase 3 W6: keyword routing in member chat (built-in list, pending CA-02). Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SAFETY_WORDS, matchSafetyWords } from "../lib/plus/safety-words.ts";

test("matches English and Kinyarwanda warning-sign phrases as whole words", () => {
  assert.deepEqual(matchSafetyWords("I have chest pain").groups, ["chest_breathing"]);
  assert.equal(matchSafetyWords("Ndashaka gupfa").matched, true);
  assert.equal(matchSafetyWords("I can’t breathe").matched, true);
  assert.equal(matchSafetyWords("my hypothyroid pills").matched, false);
  assert.equal(matchSafetyWords("Good morning coach").matched, false);
});

test("PWA list is the same as the backend list", () => {
  const backend = readFileSync(new URL("../../core-backend/src/modules/care-console/safety-words.ts", import.meta.url), "utf8");
  for (const words of Object.values(SAFETY_WORDS)) for (const phrase of [...words.en, ...words.rw]) assert.ok(backend.includes(JSON.stringify(phrase)), phrase);
});

test("chat shows the sheet for members only and still sends the message", () => {
  const src = readFileSync(new URL("../app/components/plus/support/chat.tsx", import.meta.url), "utf8");
  const send = src.slice(src.indexOf("const send = async"), src.indexOf("const reply ="));
  assert.match(send, /!isStaff && matchSafetyWords\(body\)\.matched/);
  assert.ok(send.indexOf("setSheet({ kind: \"safety\" })") < send.indexOf("await chat.sendText"), "sheet opens, then the message is sent anyway");
  assert.match(src, /data-testid="chat-safety-words-sheet"/);
  assert.match(src, /push\("\/emergency"\)/);
});

test("sheet strings exist in English and Kinyarwanda", () => {
  for (const lang of ["en", "rw"]) {
    const json = JSON.parse(readFileSync(new URL(`../lib/plus/i18n/${lang}.json`, import.meta.url), "utf8"));
    for (const key of ["chat_words_title", "chat_words_body", "chat_words_call", "chat_words_emergency", "chat_words_ok", "chat_words_noted"]) assert.ok(json[key], `${lang} ${key}`);
  }
});
