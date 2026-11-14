// Phase 3 W12: member programme screens (list, trial, pay, status, receipt). Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canPay,
  formatMoney,
  kigaliDateTime,
  listOf,
  methodLabel,
  nextPollMs,
  normalizeEnrolment,
  normalizePayment,
  normalizeProgramme,
  paymentSettled,
  receiptPayments,
  stageOf,
  stageTone,
} from "../lib/plus/programmes.ts";
import en from "../lib/plus/i18n/en.json" with { type: "json" };
import rw from "../lib/plus/i18n/rw.json" with { type: "json" };

const paidEnrolment = {
  id: 4,
  programme: { code: "t2_diabetes_support", name: "Type 2 Diabetes Support", pathway: "diabetes", duration_weeks: 12 },
  status: "enrolled",
  payment_state: "paid",
  stage: "waiting_for_care_team",
  trial: null,
  care: { active: false, care_team_assigned: false, intake_done: false, waiting_for: ["care_team", "intake", "triage"] },
  price: { amount: 60000, currency: "RWF" },
  payments: [
    {
      reference: "PG-1",
      status: "paid",
      amount: 60000,
      currency: "RWF",
      checkout_url: null,
      test_payment: true,
      paid_at: "2026-11-14T08:20:00.000Z",
      receipt: { number: "VWR-2026-000003", issuer: { name: "Vitaway Health Ltd", country: "Rwanda" }, description: "Type 2 Diabetes Support (12-week programme)", amount: 60000, currency: "RWF", paid_at: "2026-11-14T08:20:00.000Z", method: "mock", reference: "PG-1", invoice_number: "MOCK-1" },
    },
    { reference: "PG-0", status: "failed", amount: 60000, currency: "RWF", test_payment: true, receipt: null },
  ],
};

test("W12: paid but care not started reads 'Waiting for your care team', never active", () => {
  const e = normalizeEnrolment(paidEnrolment);
  assert.equal(e.stage, "waiting_for_care_team");
  assert.equal(stageTone(e.stage), "amber");
  assert.equal(canPay(e), false);
  assert.equal((en as Record<string, string>).stage_waiting_for_care_team, "Waiting for your care team");
});

test("W12: stage falls back to status + payment_state when an older server sends no stage", () => {
  assert.equal(stageOf({ status: "trial", payment_state: "none" }), "on_trial");
  assert.equal(stageOf({ status: "pending_payment", payment_state: "pending" }), "payment_processing");
  assert.equal(stageOf({ status: "pending_payment", payment_state: "failed" }), "needs_payment");
  assert.equal(stageOf({ status: "enrolled", payment_state: "sponsored" }), "waiting_for_care_team");
  assert.equal(stageOf({ status: "active_care", payment_state: "paid" }), "active");
  assert.equal(stageOf({ status: "expired", payment_state: "none", stage: "bogus" }), "expired");
});

test("W12: trial and expired enrolments can pay; funded ones cannot", () => {
  assert.equal(canPay({ stage: "on_trial", paymentState: "none" }), true);
  assert.equal(canPay({ stage: "expired", paymentState: "none" }), true);
  assert.equal(canPay({ stage: "payment_processing", paymentState: "pending" }), true);
  assert.equal(canPay({ stage: "on_trial", paymentState: "sponsored" }), false);
  assert.equal(canPay({ stage: "active", paymentState: "paid" }), false);
});

test("W12: receipts list only paid/refunded payments with a receipt number", () => {
  const e = normalizeEnrolment(paidEnrolment);
  assert.deepEqual(receiptPayments(e).map((p) => p.receipt?.number), ["VWR-2026-000003"]);
  assert.equal(e.payments[0].testPayment, true);
  assert.equal(methodLabel("mock", true), "test");
  assert.equal(methodLabel("mobile_money", false), "Mobile Money");
});

test("W12: polling every 3 s, then 10 s, stops after 15 minutes and when settled", () => {
  assert.equal(nextPollMs(0), 3000);
  assert.equal(nextPollMs(59_000), 3000);
  assert.equal(nextPollMs(61_000), 10_000);
  assert.equal(nextPollMs(15 * 60_000), null);
  assert.equal(paymentSettled(normalizePayment({ status: "initiated" })), false);
  assert.equal(paymentSettled(normalizePayment({ status: "paid" })), true);
  assert.equal(paymentSettled(normalizePayment({ status: "weird" })), false);
});

test("W12: programme list parsing, money and Kigali time", () => {
  const rows = listOf({ results: [{ code: "healthy_weight", name: "Healthy Weight", price: { amount: 60000, currency: "RWF" }, duration_weeks: 12, trial_days: 14, trial_available: true, my_enrolment: null }] }).map(normalizeProgramme);
  assert.equal(rows[0].trialAvailable, true);
  assert.equal(rows[0].myEnrolment, null);
  assert.equal(formatMoney(rows[0].price), "60,000 RWF");
  assert.equal(kigaliDateTime("2026-11-14T08:20:00.000Z"), "14 Nov 2026, 10:20");
  assert.equal(kigaliDateTime(null), "");
});

test("W12: every new programme string has an rw entry", () => {
  const keys = Object.keys(en).filter((k) => /^(programmes?_|my_programmes|stage_|care_step_|payment_(status|checking|waiting|auto|test|open|continue|paid|try|check)|receipt_)/.test(k));
  assert.ok(keys.length >= 60);
  for (const k of keys) assert.ok((rw as Record<string, string>)[k], `rw missing ${k}`);
});
