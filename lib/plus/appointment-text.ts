/** appointment_text.dart (BL-103): "Tue 10 Nov · 10:00" over "Grace, nutritionist · clinic". */
type Lang = "en" | "rw";

const PLACEHOLDER_NAMES = new Set(["platform", "clinic", "vitaway", "admin", "staff", "coach", "test", "user", "null", "none"]);

const SPECIALITIES: Record<string, [string, string]> = {
  nutritionist: ["nutritionist", "umuhanga mu mirire"],
  dietitian: ["dietitian", "umuhanga mu mirire"],
  health_coach: ["health coach", "umujyanama w’ubuzima"],
  coach: ["coach", "umujyanama"],
  nutrition_coach: ["nutrition coach", "umujyanama mu mirire"],
  registered_nurse: ["nurse", "umuforomo"],
  nurse: ["nurse", "umuforomo"],
  medical_doctor: ["doctor", "muganga"],
  doctor: ["doctor", "muganga"],
  pharmacist: ["pharmacist", "umufarumasiye"],
  counselor: ["counsellor", "umujyanama mu by’imitekerereze"],
  counsellor: ["counsellor", "umujyanama mu by’imitekerereze"],
  fitness_trainer: ["fitness trainer", "umutoza w’imyitozo ngororamubiri"],
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A real first name, or null for empty or placeholder names such as "Platform". */
export function appointmentPersonName(firstName: string | null | undefined): string | null {
  const name = (firstName ?? "").trim();
  if (name.length < 2 || PLACEHOLDER_NAMES.has(name.toLowerCase())) return null;
  return name;
}

/** Accepts the server's {id, name} object or a plain string. */
export function specialityLabel(raw: unknown, lang: Lang): string | null {
  const value = raw && typeof raw === "object" ? (raw as { name?: unknown }).name : raw;
  const key = String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const hit = SPECIALITIES[key];
  return hit ? (lang === "rw" ? hit[1] : hit[0]) : null;
}

export function appointmentCardText(a: { start: Date; firstName?: string | null; speciality?: unknown; clinic: boolean; lang: Lang }): { title: string; subtitle: string } {
  const two = (n: number) => String(n).padStart(2, "0");
  // English short day and month in both languages, like the app.
  const title = `${DAYS[a.start.getDay()]} ${a.start.getDate()} ${MONTHS[a.start.getMonth()]} · ${two(a.start.getHours())}:${two(a.start.getMinutes())}`;
  const name = appointmentPersonName(a.firstName);
  const role = specialityLabel(a.speciality, a.lang);
  const who = name === null ? (a.lang === "rw" ? "Itsinda ryawe ry’ubuvuzi" : "Your care team") : role === null ? name : `${name}, ${role}`;
  const where = a.clinic ? (a.lang === "rw" ? "ku ivuriro" : "clinic") : a.lang === "rw" ? "kuri telefoni cyangwa videwo" : "call or video";
  return { title, subtitle: `${who} · ${where}` };
}
