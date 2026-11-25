"use client";

import { useState } from "react";
import { Activity, ArrowRight3, Call, Camera, Danger, DocumentText, Drop, Flash, FolderOpen, Health, MessageQuestion, NoteText, Reserve } from "@/lib/plus/icons";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { MobileApiError, mobileRequest } from "@/lib/plus/client/api";
import { useSubscription } from "@/lib/plus/client/data";
import { useCareTeam, type CareProfessional } from "@/lib/plus/client/care-team";
import { invalidate } from "@/lib/plus/client/use-resource";
import { unwrapEnvelope } from "@/lib/plus/client/insights";
import { AppBar, CenterSpinner, Page, useFeedback } from "../ui/vita";
import { ProviderRow, ProviderSheet, coachFromPro, kindFromPro } from "../support/provider";
import { VisitsCard } from "./visits-card";
import { stashCoach } from "../support/support";
import { useChatGate } from "../support/sheets";

const FILTERS: Array<[string, string]> = [
  ["all", "care_filter_all"],
  ["nurse", "care_filter_nurses"],
  ["doctor", "care_filter_doctors"],
  ["pharmacist", "care_filter_pharmacists"],
  ["nutritionist", "care_filter_nutritionists"],
  ["coach", "care_filter_coaches"],
];
const TOPICS: Array<[string, string, React.ReactNode]> = [
  ["food", "care_topic_food", <Reserve key="food" size={20} color="currentColor" />],
  ["medicines", "care_topic_medicines", <Health key="medicines" size={20} color="currentColor" />],
  ["sugar", "care_topic_sugar", <Drop key="sugar" size={20} color="currentColor" />],
  ["bp", "care_topic_bp", <Activity key="bp" size={20} color="currentColor" />],
  ["symptoms", "care_topic_symptoms", <Danger key="symptoms" size={20} color="currentColor" />],
  ["habits", "care_topic_habits", <Flash key="habits" size={20} color="currentColor" />],
  ["other", "care_topic_other", <MessageQuestion key="other" size={20} color="currentColor" />],
];

function ActionRow({ icon, tint, title, subtitle, onClick }: { icon: React.ReactNode; tint?: string; title: string; subtitle?: string; onClick: () => void }) {
  return (
    <button type="button" className="vita-tap vita-care-action" onClick={onClick}>
      <span className="ic" style={tint ? { background: tint } : undefined}>{icon}</span>
      <span className="tx">
        <b>{title}</b>
        {subtitle ? <small>{subtitle}</small> : null}
      </span>
      <ArrowRight3 size={20} color="currentColor" />
    </button>
  );
}

/** Care Team: the people first (left), everything you can do with them on the right. */
export default function MyCareScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { toast, confirm } = useFeedback();
  const sub = useSubscription();
  const team = useCareTeam();
  const gate = useChatGate();
  const [filter, setFilter] = useState("all");
  const [sheet, setSheet] = useState<CareProfessional | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const planPrompt = async () => {
    const go = await confirm({ title: t("premium_feature"), message: t("premium_text"), confirmLabel: t("choose_plan"), cancelLabel: t("cancel") });
    if (go) push("/plans");
  };

  /** Opens (or reuses) the chat with this person, or with whoever is on duty for a topic. */
  const connect = async (key: string, path: string, body: Record<string, unknown>) => {
    if (!(await gate.ensureGuidelines())) return;
    setBusy(key);
    try {
      const res = unwrapEnvelope<{ conversation?: { room_id?: number }; intro?: { en?: string } } | null>(await mobileRequest(path, { method: "POST", body }));
      const roomId = res?.conversation?.room_id;
      invalidate("chat:");
      if (res?.intro?.en) toast(res.intro.en);
      if (roomId) push(`/chat/${roomId}`);
    } catch (error) {
      const code = error instanceof MobileApiError && error.body && typeof error.body === "object" ? (error.body as { code?: string }).code : undefined;
      if (error instanceof MobileApiError && (error.status === 403 || code === "plan_required")) await planPrompt();
      else toast(error instanceof Error && error.message ? error.message : t("network_error"), { error: true });
    }
    setBusy(null);
  };

  const book = (pro: CareProfessional) => {
    if ((pro.discipline === "coach" || pro.discipline === "nutritionist") && pro.account_id) {
      stashCoach(coachFromPro(pro));
      push(`/coaches/${pro.account_id}/book`);
    } else {
      push(`/book-visit?pro=${encodeURIComponent(pro.id)}&with=${encodeURIComponent(pro.name)}&role=${encodeURIComponent(pro.role_label.en)}`);
    }
  };

  // Only roles that have someone on duty get a tab; a tab that empties falls back to All.
  // Counts are people on duty (Online or Busy); people who are off sit in a folded list below.
  const counts = new Map<string, number>();
  for (const p of team.onDuty) counts.set(p.discipline, (counts.get(p.discipline) ?? 0) + (p.status === "off" ? 0 : 1));
  const tabs = FILTERS.filter(([value]) => value === "all" || counts.has(value));
  const active = tabs.some(([value]) => value === filter) ? filter : "all";
  const inGroup = team.onDuty.filter((p) => active === "all" || p.discipline === active);
  const onDuty = inGroup.filter((p) => p.status !== "off");
  const offDuty = inGroup.filter((p) => p.status === "off");
  const dutyTotal = team.onDuty.filter((p) => p.status !== "off").length;
  const connectPro = (p: CareProfessional) => void connect(`pro:${p.id}`, "/api/v1/mobile/care/conversations", { professional_id: p.id });
  const line = (p: CareProfessional) => (
    <ProviderRow key={p.id} coach={coachFromPro(p)} kind={kindFromPro(p)} pro={p} busy={busy === `pro:${p.id}`} onOpen={() => setSheet(p)} onMessage={() => connectPro(p)} onBook={() => book(p)} />
  );

  return (
    <Page backdrop width="wide">
      <AppBar title={t("nav_care_team")} back={false} profile />
      <div className="vita-scroll with-dock vita-care-page">
        {/* ── Ask: one strip, topic chips in a row ───────────── */}
        <section className="vita-care-strip" aria-label={t("care_ask_title")}>
          <div className="lead">
            <b>{t("care_ask_title")}</b>
            {team.onlineCount ? (
              <span className="live">
                <i aria-hidden />
                {t("care_online_count", { n: team.onlineCount })}
              </span>
            ) : null}
          </div>
          <div className="topics">
            {TOPICS.map(([topic, key, icon]) => (
              <button key={topic} type="button" disabled={busy !== null} onClick={() => void connect(`topic:${topic}`, "/api/v1/mobile/care/ask", { topic })}>
                <span className="ic">{icon}</span>
                <span>{busy === `topic:${topic}` ? "…" : t(key)}</span>
              </button>
            ))}
          </div>
          <button type="button" className="sos" data-testid="emergency-link" onClick={() => push("/emergency")}>
            <Call size={16} variant="Bold" color="currentColor" />
            <span>{t("emergency_card_title")}</span>
          </button>
        </section>

        <div className="vita-care-layout">
          {/* ── People ─────────────────────────────────────────── */}
          <section className="vita-care-people" aria-label={t("care_people_title")}>
            <div className="vita-care-head">
              <h2>{t("care_people_title")}</h2>
              <span className="sub">{t("care_people_sub")}</span>
            </div>
            {team.loading && !team.data ? <CenterSpinner /> : team.mine.length ? <div className="vita-pro-rows">{team.mine.map(line)}</div> : <p className="vita-care-empty">{t("care_team_empty")}</p>}

            <div className="vita-care-head" style={{ marginTop: 20 }}>
              <h2>{t("care_on_duty")}</h2>
              <div className="vita-care-tabs" role="tablist" aria-label={t("care_on_duty")}>
                {tabs.map(([value, key]) => (
                  <button key={value} type="button" role="tab" aria-selected={active === value} className={active === value ? "on" : ""} onClick={() => setFilter(value)}>
                    {t(key)}
                    <span className="n">{value === "all" ? dutyTotal : counts.get(value)}</span>
                  </button>
                ))}
              </div>
            </div>
            {onDuty.length ? <div className="vita-pro-rows">{onDuty.map(line)}</div> : <p className="vita-care-empty">{t("care_on_duty_empty")}</p>}
            {offDuty.length ? (
              <details className="vita-care-off">
                <summary>
                  {t("care_off_duty", { n: offDuty.length })}
                  <ArrowRight3 size={16} color="currentColor" />
                </summary>
                <div className="vita-pro-rows" style={{ marginTop: 12 }}>{offDuty.map(line)}</div>
              </details>
            ) : null}
          </section>

          {/* ── Visits and the clinic record ───────────────────── */}
          <aside className="vita-care-side">
            <VisitsCard />
            <div className="vita-care-box">
              <div className="vita-care-clinic">
                <span className="mark" aria-hidden>V</span>
                <span>
                  <b>{t("my_care_clinic_name")}</b>
                  <small>{t("my_care_clinic_record")}</small>
                </span>
              </div>
              <div className="vita-care-record">
                <ActionRow icon={<DocumentText size={20} color="currentColor" />} title={t("care_tab_visit_summaries")} onClick={() => push("/visit-reports")} />
                <ActionRow icon={<NoteText size={20} color="currentColor" />} title={t("care_tab_progress_notes")} onClick={() => push("/notes")} />
                <ActionRow icon={<Reserve size={20} color="currentColor" />} title={t("care_tab_meal_plans")} onClick={() => push("/meal-plans")} />
                <ActionRow icon={<Camera size={20} color="currentColor" />} title={t("care_tab_meal_photos")} onClick={() => push("/meal-photos")} />
                <ActionRow icon={<FolderOpen size={20} color="currentColor" />} title={t("care_tab_documents")} onClick={() => push("/documents")} />
                {/* BL-122: the Pillbox is reachable from the Care card (Flutter my_care_page.dart). */}
                <ActionRow icon={<Health size={20} color="currentColor" />} title={t("pillbox")} onClick={() => push("/medications")} />
              </div>
            </div>
          </aside>
        </div>
      </div>
      {gate.element}
      {sheet ? (
        <ProviderSheet
          coach={coachFromPro(sheet)}
          kind={kindFromPro(sheet)}
          pro={sheet}
          isYours={sheet.mine}
          subscribed={sub.active}
          chatLoading={busy === `pro:${sheet.id}`}
          onClose={() => setSheet(null)}
          onMessage={() => {
            const pro = sheet;
            setSheet(null);
            void connect(`pro:${pro.id}`, "/api/v1/mobile/care/conversations", { professional_id: pro.id });
          }}
          onBook={() => {
            const pro = sheet;
            setSheet(null);
            book(pro);
          }}
          onProfile={(sheet.discipline === "coach" || sheet.discipline === "nutritionist") && sheet.account_id ? () => {
            stashCoach(coachFromPro(sheet));
            push(`/coaches/${sheet.account_id}`);
          } : undefined}
        />
      ) : null}
    </Page>
  );
}
