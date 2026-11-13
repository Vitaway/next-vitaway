"use client";

import { useState } from "react";
import { CalendarTick, Clock, Cup, Notification as NotificationIcon, TickCircle } from "iconsax-react";
import { MdArrowBack, MdArrowForward, MdCheck } from "react-icons/md";
import { usePlusAuth } from "@/lib/plus/auth-context";
import { useAuthGate } from "@/lib/plus/use-auth-gate";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useT } from "@/lib/plus/i18n";
import { mobileRequest, MobileApiError } from "@/lib/plus/client/api";
import { saveReading } from "@/lib/plus/client/readings";
import { invalidate } from "@/lib/plus/client/use-resource";
import { PLAN_DEFAULT_TIME, PLAN_GOAL_MINUTES, PLAN_STREAK_DAYS, planProfileFields, planReminder, savePlanLocally, type PlanChoices } from "@/lib/plus/onboarding-plan";
import { useReminders } from "@/lib/plus/reminders";
import { requestNotificationPermission } from "@/lib/plus/web-notifications";
import { TimePickerModal, fmtTimeOfDay } from "../readings/log-chrome";
import { AuthBrandPanel } from "../auth/auth-ui";
import PlusLoading from "../plus-loading";
import { ActionButton, BubbleBackdrop, CircleButton, FieldLabel, useFeedback } from "../ui/vita";
import { DatePickerModal, formatSlashDate, parseIsoDate, todayLocal, yearsAgoFromToday } from "../ui/date-picker";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const ART = "/plus-assets/onboarding";

type Option = { label: string; value: string; other?: boolean; none?: boolean };
type Question = { id: "chronic" | "goals" | "sex"; title: string; subtitle: string; single: boolean; options: Option[] };

/** _buildQuizQuestions() in onboarding_quiz.dart. */
const QUESTIONS: Question[] = [
  {
    id: "chronic",
    title: "q1",
    subtitle: "q1_1",
    single: false,
    options: [
      { label: "diabetes", value: "Diabetes" },
      { label: "hypertension", value: "Hypertension" },
      { label: "cholesterol", value: "High Cholesterol" },
      { label: "heart_disease", value: "Heart Disease" },
      { label: "other_value", value: "Other", other: true },
      { label: "none_of_these", value: "None", none: true },
    ],
  },
  {
    id: "goals",
    title: "q2",
    subtitle: "q1_1",
    single: false,
    options: [
      { label: "weight_loss", value: "Weight Loss" },
      { label: "blood_sugar_control", value: "Blood Sugar Control" },
      { label: "blood_pressure_control", value: "Lower Blood Pressure" },
      { label: "fitness", value: "Improve Fitness" },
      { label: "other_value", value: "Other", other: true },
      { label: "none_of_these", value: "None", none: true },
    ],
  },
  {
    id: "sex",
    title: "q3",
    subtitle: "q3_1",
    single: true,
    options: [
      { label: "male_small", value: "M" },
      { label: "female_small", value: "F" },
      { label: "no_say", value: "Prefer Not to Say" },
    ],
  },
];

const ART_FOR: Record<Question["id"], string> = { chronic: "conditions.png", goals: "goals.png", sex: "about.png" };

function ageFrom(birth: Date): number {
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const had = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!had) years -= 1;
  return years;
}

function Art({ image, height = 188 }: { image: string; height?: number }) {
  return (
    <div className="vita-quiz-art-inline" style={{ height, width: "100%", display: "flex", justifyContent: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ART}/${image}`} alt="" style={{ height: "100%", width: "100%", objectFit: "contain" }} />
    </div>
  );
}

function Choice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" className={selected ? "vita-quiz-choice on" : "vita-quiz-choice"} onClick={onClick} aria-pressed={selected}>
      <span style={{ flex: 1, textAlign: "left", fontSize: 16, fontWeight: 600, color: "var(--vc-navy)" }}>{label}</span>
      {selected ? (
        <TickCircle size={22} variant="Bold" color="var(--vc-navy)" />
      ) : (
        <span style={{ width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${navyA(0.22)}` }} />
        </span>
      )}
    </button>
  );
}

function LineField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="vita-quiz-line">
      <span style={{ display: "block", fontSize: 12, fontWeight: 600, color: navyA(0.55) }}>{label}</span>
      {children}
    </label>
  );
}

/** Pages/onboarding/onboarding_quiz.dart: intro, three questions, birth date, height and weight, then the BL-151 plan (goal, time, streak, ready). */
export default function OnboardingQuiz() {
  const t = useT();
  const { toast } = useFeedback();
  const { completeSignIn } = usePlusAuth();
  const { session, allowed } = useAuthGate("/onboarding-quiz");
  const { replace } = usePlusPaths();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Record<string, string[]>>({ chronic: [], goals: [], sex: [] });
  const [other, setOther] = useState<Record<string, string>>({ chronic: "", goals: "" });
  const [birth, setBirth] = useState("");
  const [dobOpen, setDobOpen] = useState(false);
  // No made-up defaults: a pre-filled 170 cm / 70 kg would be saved as real data.
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  // BL-151 plan: daily goal, reminder time, streak promise, then "Your plan is ready".
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [reminderTime, setReminderTime] = useState(PLAN_DEFAULT_TIME);
  const [timeOpen, setTimeOpen] = useState(false);
  const [streakGoal, setStreakGoal] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { save: saveReminder } = useReminders();

  const Q = QUESTIONS.length;
  const stepCount = Q + 5;
  const onQuestion = index < Q;
  const onMeasurements = index === Q;
  const onGoal = index === Q + 1;
  const onTime = index === Q + 2;
  const onStreak = index === Q + 3;
  const onReady = index === Q + 4;
  const isLast = onReady;
  const current = QUESTIONS[Math.min(index, Q - 1)];

  if (!allowed || !session) return <PlusLoading label="Opening Vitaway Plus…" />;

  const answered = (q: Question) => {
    const sel = picked[q.id];
    if (!sel.length) return false;
    if (q.options.some((o) => o.other && sel.includes(o.value)) && !(other[q.id] ?? "").trim()) return false;
    return true;
  };
  const birthDate = parseIsoDate(birth);
  const age = birthDate ? ageFrom(birthDate) : 0;
  const h = Number(height.trim());
  const w = Number(weight.trim());
  const measurementsReady = Boolean(birthDate) && age >= 1 && h > 0 && w > 0;
  const canAdvance = onQuestion ? answered(current) : onMeasurements ? measurementsReady : onGoal ? dailyGoal !== null : onStreak ? streakGoal !== null : true;
  const otherSelected = onQuestion && current.options.some((o) => o.other && picked[current.id].includes(o.value));
  const plan: PlanChoices = { dailyGoal: dailyGoal ?? 5, reminder: reminderTime, streakGoal: streakGoal ?? 7 };

  const toggle = (option: Option) => {
    setPicked((prev) => {
      const sel = prev[current.id];
      let next: string[];
      if (current.single) next = [option.value];
      else if (option.none) next = sel.includes(option.value) ? [] : [option.value];
      else {
        next = sel.includes(option.value) ? sel.filter((v) => v !== option.value) : [...sel.filter((v) => v !== "None"), option.value];
      }
      return { ...prev, [current.id]: next };
    });
    if (option.none || (option.other && picked[current.id].includes(option.value))) setOther((prev) => ({ ...prev, [current.id]: "" }));
  };

  const submitQuiz = async (): Promise<boolean> => {
    const values = (q: Question) => q.options.filter((o) => picked[q.id].includes(o.value) && !o.other).map((o) => o.value).join(",");
    const otherText = (q: Question) => (q.options.some((o) => o.other && picked[q.id].includes(o.value)) ? (other[q.id] ?? "").trim() : "");
    const [chronic, goals] = QUESTIONS;
    const sex = picked.sex.find((v) => v !== "Prefer Not to Say") ?? "";
    try {
      await mobileRequest("/update-health/", {
        method: "PATCH",
        body: {
          chronic_conditions: values(chronic),
          other_chronic_condition: otherText(chronic),
          health_goals: values(goals),
          other_health_goal: otherText(goals),
          gender: sex,
        },
      });
      return true;
    } catch (err) {
      toast(t(err instanceof MobileApiError && err.status === 0 ? "network_error" : "quiz_submit_failed"), { error: true });
      return false;
    }
  };

  const saveMeasurements = async (): Promise<boolean> => {
    if (!birthDate || age < 1 || !(h > 0) || !(w > 0)) {
      toast(t("onboarding_measures_required"), { error: true });
      return false;
    }
    try {
      // BL-151: plan choices saved to the profile too (older servers ignore these fields).
      await mobileRequest("/update_profile/", { method: "POST", body: { age, height: h, ...planProfileFields(plan) } });
      invalidate("/me/");
      await saveReading({ type: "weight", name: "Weight", unit: "Kg", systolic: 0, diastolic: 0, latestValue: String(w), stamp: new Date(), fullness: 0 });
      return true;
    } catch (err) {
      toast(t(err instanceof MobileApiError && err.status === 0 ? "network_error" : "quiz_submit_failed"), { error: true });
      return false;
    }
  };

  const next = async () => {
    if (submitting) return;
    if (!canAdvance) {
      if (onMeasurements) toast(t("onboarding_measures_required"), { error: true });
      else if (!onQuestion) toast(t("quiz_answer_required"), { error: true });
      else toast(t(otherSelected ? "quiz_other_required" : "quiz_answer_required"), { error: true });
      return;
    }
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    const ok = (await submitQuiz()) && (await saveMeasurements());
    if (!ok) {
      setSubmitting(false);
      return;
    }
    savePlanLocally(plan);
    // The daily reminder the plan promises, at the chosen time (BL-151 / BL-032).
    saveReminder(planReminder(t("plan_reminder_name"), plan));
    await requestNotificationPermission().catch(() => false);
    toast(t("thank_you"));
    completeSignIn({ ...session, hasCompletedProfile: true });
    replace("/home");
  };

  const back = () => {
    if (submitting) return;
    if (index === 0) setStarted(false);
    else setIndex((i) => i - 1);
  };

  const stepTitleKey = onQuestion ? current.title : onMeasurements ? "onboarding_body_title" : onGoal ? "plan_goal_title" : onTime ? "plan_time_title" : onStreak ? "plan_streak_title" : "plan_ready_title";
  const stepSubtitleKey = onQuestion ? current.subtitle : onMeasurements ? "onboarding_body_subtitle" : onGoal ? "plan_goal_subtitle" : onTime ? "plan_time_subtitle" : onStreak ? "plan_streak_subtitle" : "plan_ready_subtitle";

  // Phones: unchanged. From 768px the column becomes a card; from 1024px the step's art moves to a brand panel.
  const shell = (body: React.ReactNode, footer: React.ReactNode, art = "intro.png") => (
    <div className="vita-page vita-wide vita-fullbleed" style={{ position: "relative", height: "100dvh", minHeight: "100dvh" }}>
      <BubbleBackdrop />
      <AuthBrandPanel image={art} title={t("onboarding_intro_title")} body={t("onboarding_intro_body")} />
      <div className="vita-quiz-body">
        <div className="vita-quiz-card">
          {body}
          {footer}
        </div>
      </div>
    </div>
  );

  if (!started) {
    const steps = [t("onboarding_intro_conditions"), t("onboarding_intro_goals"), t("onboarding_intro_about")];
    return shell(
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Art image="intro.png" />
        <div style={{ height: 8 }} />
        <p style={{ margin: 0, textAlign: "center", fontSize: 15, fontWeight: 700, color: "var(--vc-action)" }}>{t("onboarding_intro_time")}</p>
        <h1 style={{ margin: "12px 0 0", textAlign: "center", fontSize: 32, fontWeight: 800, lineHeight: 1.12, letterSpacing: -0.7, color: "var(--vc-navy)" }}>{t("onboarding_intro_title")}</h1>
        <p style={{ margin: "12px 0 0", textAlign: "center", fontSize: 16, lineHeight: 1.45, color: navyA(0.62) }}>{t("onboarding_intro_body")}</p>
        <div style={{ height: 28 }} />
        {steps.map((step, i) => (
          <div key={step} className="vita-quiz-step">
            <span className="num">{i + 1}</span>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: "var(--vc-navy)" }}>{step}</span>
          </div>
        ))}
      </div>,
      <div style={{ paddingTop: 12 }}>
        <ActionButton full label={t("onboarding_intro_start")} icon={<MdArrowForward size={16} />} onClick={() => setStarted(true)} />
      </div>,
    );
  }

  return shell(
    <>
      <div style={{ display: "flex" }}>
        {Array.from({ length: stepCount }, (_, i) => (
          <span key={i} style={{ height: 7, width: i === index ? 22 : 7, marginRight: 6, borderRadius: 99, background: i === index ? "var(--vc-navy)" : navyA(0.16), transition: "width 0.24s" }} />
        ))}
      </div>
      <div style={{ height: 28 }} />
      <div key={index} className="vita-fade-in" style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Art image={onQuestion ? ART_FOR[current.id] : "goals.png"} height={168} />
        <div style={{ height: 8 }} />
        <h1 style={{ margin: 0, textAlign: "center", fontSize: 30, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.7, color: "var(--vc-navy)" }}>
          {t(stepTitleKey)}
        </h1>
        <p style={{ margin: "8px 0 0", textAlign: "center", fontSize: 15, lineHeight: 1.45, color: navyA(0.55) }}>{t(stepSubtitleKey)}</p>
        <div style={{ height: 22 }} />
        {onMeasurements ? (
          <>
            <LineField label={t("onboarding_dob")}>
              <button
                type="button"
                className="vita-quiz-input"
                onClick={() => setDobOpen(true)}
                aria-label={t("onboarding_dob_hint")}
                style={{ textAlign: "left", cursor: "pointer", color: birth ? "var(--vc-navy)" : navyA(0.35) }}
              >
                {birth ? formatSlashDate(birth) : t("onboarding_dob_hint")}
              </button>
            </LineField>
            <LineField label={t("ap_height")}>
              <input inputMode="decimal" value={height} placeholder={t("onboarding_height_hint")} onChange={(e) => setHeight(e.target.value.replace(/[^0-9.]/g, ""))} className="vita-quiz-input" />
            </LineField>
            <LineField label={t("hm_weight")}>
              <input inputMode="decimal" value={weight} placeholder={t("onboarding_weight_hint")} onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))} className="vita-quiz-input" />
            </LineField>
          </>
        ) : onGoal ? (
          PLAN_GOAL_MINUTES.map((v) => (
            <div key={v} style={{ marginBottom: 10 }}>
              <Choice label={t("plan_goal_option", { n: v })} selected={dailyGoal === v} onClick={() => setDailyGoal(v)} />
            </div>
          ))
        ) : onTime ? (
          <Choice label={`${t("plan_time_label")}: ${fmtTimeOfDay(reminderTime)}`} selected onClick={() => setTimeOpen(true)} />
        ) : onStreak ? (
          PLAN_STREAK_DAYS.map((v) => (
            <div key={v} style={{ marginBottom: 10 }}>
              <Choice label={t("plan_streak_option", { n: v })} selected={streakGoal === v} onClick={() => setStreakGoal(v)} />
            </div>
          ))
        ) : onReady ? (
          <div style={{ padding: "16px 16px 4px", borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.1)}` }}>
            {[
              [<Clock key="c" size={20} color="var(--vc-navy)" />, t("plan_ready_goal", { n: plan.dailyGoal })],
              [<NotificationIcon key="n" size={20} color="var(--vc-navy)" />, t("plan_ready_time", { time: fmtTimeOfDay(reminderTime) })],
              [<Cup key="s" size={20} color="var(--vc-navy)" />, t("plan_ready_streak", { n: plan.streakGoal })],
              [<CalendarTick key="d" size={20} color="var(--vc-navy)" />, t("plan_ready_day1")],
            ].map(([icon, text], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                {icon}
                <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: "var(--vc-navy)" }}>{text}</span>
              </div>
            ))}
          </div>
        ) : (
          current.options.map((option) => (
            <div key={option.value} style={{ marginBottom: 10 }}>
              <Choice label={t(option.label)} selected={picked[current.id].includes(option.value)} onClick={() => toggle(option)} />
            </div>
          ))
        )}
        {otherSelected ? (
          <div style={{ marginTop: 4 }}>
            <FieldLabel text={t("other_specify")} required />
            <input
              className="vita-quiz-other"
              maxLength={80}
              value={other[current.id] ?? ""}
              placeholder={t("other_specify")}
              onChange={(e) => setOther((prev) => ({ ...prev, [current.id]: e.target.value }))}
            />
          </div>
        ) : null}
      </div>
    </>,
    <>
    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 12 }}>
      <CircleButton label="Back" size={56} background="#003e48" color="#fff" onClick={back}>
        <MdArrowBack size={22} />
      </CircleButton>
      <div style={{ flex: 1 }}>
        <ActionButton
          full
          label={t(isLast ? "plan_start_day1" : "next")}
          loading={submitting}
          disabled={!canAdvance}
          icon={isLast ? <MdCheck size={16} /> : <MdArrowForward size={16} />}
          onClick={next}
        />
      </div>
    </div>
    <DatePickerModal
      open={dobOpen}
      value={birth}
      initialDate={yearsAgoFromToday(30)}
      firstDate={yearsAgoFromToday(120)}
      lastDate={todayLocal()}
      initialMode="year"
      cancelLabel={t("cancel")}
      okLabel={t("ok")}
      onClose={() => setDobOpen(false)}
      onPick={setBirth}
    />
    <TimePickerModal open={timeOpen} value={reminderTime} onClose={() => setTimeOpen(false)} onPick={(v) => { setReminderTime(v); setTimeOpen(false); }} />
    </>,
    onQuestion ? ART_FOR[current.id] : "goals.png",
  );
}
