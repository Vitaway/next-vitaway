"use client";

import { useEffect, useState } from "react";
import { Add, Alarm, Clock, CloseCircle, Drop, Health, Heart, Notification as NotificationIcon, Play, Save2, Trash } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { useBack } from "@/lib/plus/nav";
import { useReminders, type Reminder } from "@/lib/plus/reminders";
import { TimePickerModal } from "../readings/log-chrome";
import { ActionButton, AppBar, CircleButton, Page, useFeedback } from "../ui/vita";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;
const border = `1px solid ${navyA(0.12)}`;

type Kind = "med" | "glucose" | "bp" | "other";

function kindLabel(type: string, t: (k: string) => string) {
  return type === "med" ? t("medication") : type === "glucose" ? t("measurement_reminder") : type === "bp" ? t("measure_bp") : t("reminders_title");
}

const nowTime = () => {
  const d = new Date();
  return { hour: d.getHours(), minute: d.getMinutes() };
};

/** Asks for notification permission the way NotificationPermissions.requestIfNeeded does. */
async function requestNotifications(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

function SwitchKnob({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-label={label} aria-checked={value} onClick={() => onChange(!value)} style={{ width: 50, height: 30, borderRadius: 999, padding: 3, background: value ? "var(--vc-mint)" : navyA(0.12), flex: "0 0 auto" }}>
      <span style={{ display: "block", width: 24, height: 24, borderRadius: "50%", background: value ? "var(--vc-teal)" : "#fff", transform: `translateX(${value ? 20 : 0}px)`, transition: "transform 160ms", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

function TextBtn({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ fontSize: 15, fontWeight: 700, color: "var(--vc-teal)", padding: "8px 12px" }}>
      {text}
    </button>
  );
}

const timeStyle: React.CSSProperties = { fontSize: 30, fontWeight: 800, color: "#c5cae9" };

/* ───────── /reminders (RemindersPage, normal user view) ───────── */

export function RemindersScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const { list } = useReminders();
  return (
    <Page backdrop>
      <AppBar
        title={t("reminders_title")}
        actions={
          <CircleButton label={t("add_reminder_speed")} onClick={() => push("/reminders/add")} background="var(--vc-tile-mint)" color="var(--vc-navy)">
            <Add size={20} color="currentColor" />
          </CircleButton>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)", maxWidth: 720, width: "100%", margin: "0 auto" }}>
        {list.length === 0 ? (
          <div style={{ padding: "48px 32px", textAlign: "center" }}>
            <Alarm size={42} color={navyA(0.28)} />
            <p style={{ margin: "16px 0 0", fontSize: 16, fontWeight: 700, color: "var(--vc-navy)" }}>{t("reminders_empty")}</p>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: navyA(0.5) }}>{t("add_reminder_home_text")}</p>
            <div style={{ marginTop: 22 }}>
              <ActionButton full label={t("add_reminder_speed")} icon={<Add size={18} color="currentColor" />} onClick={() => push("/reminders/add")} />
            </div>
          </div>
        ) : (
          list.map((r) => <ReminderTile key={r.id} reminder={r} onClick={() => push(`/reminders/${encodeURIComponent(r.id)}`)} />)
        )}
      </div>
    </Page>
  );
}

function ReminderTile({ reminder, onClick }: { reminder: Reminder; onClick: () => void }) {
  const t = useT();
  const kind = kindLabel(reminder.type, t);
  const color = reminder.type === "med" ? "var(--vc-tile-lilac)" : reminder.type === "bp" ? "var(--vc-tile-peach)" : "var(--vc-tile-mint)";
  const Icon = reminder.type === "med" ? Health : reminder.type === "bp" ? Heart : Drop;
  const time = reminder.times[0] ?? "";
  return (
    <button type="button" onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 12, width: "calc(100% - 32px)", margin: "6px 16px", padding: 14, borderRadius: 10, background: "var(--vc-sheet, var(--vc-surface))", textAlign: "left" }}>
      <span style={{ width: 42, height: 42, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color="var(--vc-navy)" />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--vc-navy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{reminder.name || kind}</span>
        {time ? <span style={{ display: "block", fontSize: 12, color: navyA(0.45) }}>{time}</span> : null}
      </span>
      <span style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Play size={20} color="var(--vc-navy)" variant="Bold" />
      </span>
    </button>
  );
}

/* ───────── /reminders/add (AddReminderPage) ───────── */

export function AddReminderScreen() {
  const t = useT();
  const goBack = useBack("/reminders");
  const { toast } = useFeedback();
  const { save } = useReminders();
  const [type, setType] = useState<Kind>("med");
  const [name, setName] = useState("");
  const [times, setTimes] = useState<Array<{ hour: number; minute: number }>>([]);
  const [recurring, setRecurring] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [days, setDays] = useState<string[]>([]);
  const [picking, setPicking] = useState<number | null>(null);

  const kinds: Array<{ value: Kind; icon: React.ReactNode; label: string }> = [
    { value: "glucose", icon: <Drop size={22} color="var(--vc-danger)" />, label: t("ap_blood_glucose") },
    { value: "bp", icon: <Heart size={20} color="var(--vc-danger)" />, label: t("ap_bp") },
    { value: "med", icon: <Health size={20} color="var(--vc-navy)" />, label: t("medications_title") },
    { value: "other", icon: <Clock size={20} color="var(--vc-mint)" />, label: t("other") },
  ];

  const onSave = async () => {
    const timeStrings = times.map((x) => `${x.hour}:${x.minute}`);
    if (!timeStrings.length) return toast("Please select at least one time", { error: true });
    const reminder: Reminder = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      type,
      name: type === "bp" ? "BP reminder" : type === "glucose" ? "Glucose reminder" : name,
      times: timeStrings,
      timeEnabled: timeStrings.map(() => true),
      active: true,
      recurring,
      repeat: weekly,
      repeatDays: weekly ? days : ["Daily"],
      isNotificationEnabled: true,
      dateCreated: new Date().toISOString(),
    };
    save(reminder);
    const allowed = await requestNotifications();
    toast(allowed ? "Scheduled notification" : "Reminder saved. Enable notifications in device Settings to receive alerts.");
    goBack();
  };

  const toggleRecurring = () => {
    setRecurring((r) => {
      if (r) {
        setWeekly(false);
        setDays([]);
      }
      return !r;
    });
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar title={t("add_reminder_speed")} />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px calc(env(safe-area-inset-bottom) + 28px)", maxWidth: 640, width: "100%", margin: "0 auto" }}>
        <div style={{ border, borderRadius: 10, padding: 20 }}>
          <p style={{ margin: 0, textAlign: "center", fontWeight: 800, color: "var(--vc-navy)" }}>{t("reminder_question")}</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 10 }}>
            {kinds.map((k) => (
              <button key={k.value} type="button" aria-pressed={type === k.value} onClick={() => setType(k.value)} style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${type === k.value ? "var(--vc-navy)" : navyA(0.12)}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                {k.icon}
                <span style={{ fontSize: 11, lineHeight: 1.25, textAlign: "center", color: "var(--vc-ink)" }}>
                  {k.label}
                  <br />
                  {t("reminders_title")}
                </span>
              </button>
            ))}
          </div>
          {type === "med" || type === "other" ? (
            <input className="vita-input" style={{ marginTop: 20 }} value={name} placeholder={type === "med" ? t("med_name") : t("reminder_name")} onChange={(e) => setName(e.target.value)} />
          ) : null}
          <div style={{ marginTop: 20, border, borderRadius: 10, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 800, color: "var(--vc-navy)" }}>
                {t("reminders")} <span style={{ color: "var(--vc-danger)" }}>*</span>
              </span>
              <NotificationIcon size={22} color="var(--vc-navy)" />
            </div>
            <hr style={{ border: 0, borderTop: `1px solid ${navyA(0.12)}`, margin: "10px 0" }} />
            {times.map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button type="button" onClick={() => setPicking(i)} style={timeStyle}>{`${x.hour}:${x.minute}`}</button>
                <button type="button" aria-label="Remove time" onClick={() => setTimes((all) => all.filter((_, j) => j !== i))} style={{ padding: 8, color: "var(--vc-navy)" }}>
                  <CloseCircle size={22} color="currentColor" />
                </button>
              </div>
            ))}
            <hr style={{ border: 0, borderTop: `1px solid ${navyA(0.12)}`, margin: "10px 0 0" }} />
          </div>
          <div style={{ marginTop: 15, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 800, color: "var(--vc-navy)" }}>{t("repeat")}</span>
              <SwitchKnob label={t("repeat")} value={recurring} onChange={toggleRecurring} />
            </span>
            {recurring ? (
              <button type="button" onClick={() => setWeekly(false)} style={{ width: 70, padding: 10, borderRadius: 10, border: `1px solid ${weekly ? navyA(0.12) : "var(--vc-navy)"}`, fontSize: 15, color: "var(--vc-ink)" }}>
                Daily
              </button>
            ) : null}
          </div>
          {weekly ? (
            <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: 10 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
                const v = d.toLowerCase();
                const on = days.includes(v);
                return (
                  <button key={v} type="button" onClick={() => setDays((all) => (on ? all.filter((x) => x !== v) : [...all, v]))} style={{ width: 40, padding: 10, borderRadius: 6, border, fontSize: 10, background: on ? "var(--vc-teal)" : "var(--vc-surface)", color: on ? "#fff" : undefined }}>
                    {d}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <TextBtn text={t("add_time")} onClick={() => setPicking(times.length)} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <ActionButton full label={t("save")} icon={<Save2 size={18} color="currentColor" />} onClick={() => void onSave()} />
        </div>
      </div>
      <TimePickerModal
        open={picking !== null}
        value={picking !== null && times[picking] ? times[picking] : nowTime()}
        onClose={() => setPicking(null)}
        onPick={(v) =>
          setTimes((all) => {
            const next = [...all];
            if (picking !== null && picking < next.length) next[picking] = v;
            else next.push(v);
            return next;
          })
        }
      />
    </div>
  );
}

/* ───────── /reminders/[id] (ReminderDetails) ───────── */

export function ReminderDetailScreen({ id }: { id: string }) {
  const t = useT();
  const goBack = useBack("/reminders");
  const { toast, confirm } = useFeedback();
  const { list, save, remove } = useReminders();
  const [ready, setReady] = useState(false);
  const [picking, setPicking] = useState(false);
  const reminder = list.find((r) => r.id === id) ?? null;
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!reminder) {
    return (
      <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
        <AppBar title={t("reminders_title")} />
        {ready ? <p style={{ padding: 32, textAlign: "center", color: navyA(0.55) }}>{t("reminders_empty")}</p> : null}
      </div>
    );
  }

  const TitleIcon = reminder.type === "med" ? Health : reminder.type === "glucose" ? Drop : Alarm;
  const enabled = reminder.times.map((_, i) => reminder.timeEnabled?.[i] ?? true);

  const addTime = (v: { hour: number; minute: number }) => {
    const formatted = `${String(v.hour).padStart(2, "0")}:${String(v.minute).padStart(2, "0")}`;
    if (reminder.times.includes(formatted)) return toast("This reminder time already exists", { error: true });
    save({ ...reminder, times: [...reminder.times, formatted], timeEnabled: [...enabled, true] });
    void requestNotifications();
    toast("Reminder time added");
  };

  const toggle = (index: number, value: boolean) => {
    save({ ...reminder, timeEnabled: enabled.map((e, i) => (i === index ? value : e)) });
    void requestNotifications();
    toast(value ? "Reminder Enabled" : "Reminder Disabled");
  };

  const del = async () => {
    const ok = await confirm({ title: "Confirm Deletion", message: "Are you sure you want to delete this reminder?", confirmLabel: "Delete", cancelLabel: "Cancel", destructive: true });
    if (!ok) return;
    remove(reminder.id);
    goBack();
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)" }}>
      <AppBar
        title={kindLabel(reminder.type === "bp" ? "other" : reminder.type, t)}
        actions={
          <span style={{ width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <TitleIcon size={20} color="currentColor" variant={reminder.type === "glucose" ? "Bold" : "Linear"} />
          </span>
        }
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "25px 25px calc(env(safe-area-inset-bottom) + 28px)", maxWidth: 640, width: "100%", margin: "0 auto" }}>
        <div style={{ border: `1px solid ${navyA(0.08)}`, borderRadius: 10, padding: 20 }}>
          <input className="vita-input" value={reminder.name} onChange={(e) => save({ ...reminder, name: e.target.value })} />
          <div style={{ marginTop: 20, border: `1px solid ${navyA(0.08)}`, borderRadius: 10, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 800, color: "var(--vc-navy)" }}>Reminders</span>
              <NotificationIcon size={22} color="var(--vc-navy)" />
            </div>
            <hr style={{ border: 0, borderTop: `1px solid ${navyA(0.12)}`, margin: "10px 0" }} />
            {reminder.times.map((time, i) => (
              <div key={`${time}-${i}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 0" }}>
                <span style={timeStyle}>{time}</span>
                <SwitchKnob label={time} value={enabled[i]} onChange={(v) => toggle(i, v)} />
              </div>
            ))}
            <hr style={{ border: 0, borderTop: `1px solid ${navyA(0.12)}`, margin: "10px 0 0" }} />
          </div>
          <div style={{ marginTop: 15, textAlign: "center" }}>
            <TextBtn text="Add reminder time" onClick={() => setPicking(true)} />
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <ActionButton full tone="danger" label="Delete reminder" icon={<Trash size={18} color="currentColor" />} onClick={() => void del()} />
        </div>
        <div style={{ marginTop: 12 }}>
          {/* Flutter's button only cancels scheduled OS notifications; the PWA schedules none, so it is a no-op too. */}
          <ActionButton full tone="white" label="Clear all reminders" icon={<Trash size={18} color="currentColor" />} onClick={() => undefined} />
        </div>
      </div>
      <TimePickerModal open={picking} value={nowTime()} onClose={() => setPicking(false)} onPick={addTime} />
    </div>
  );
}

