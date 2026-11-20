/**
 * W6 keyword routing (PWA copy). BUILT-IN English + Kinyarwanda warning-sign words, PENDING CA-02 approval.
 * When a member's outgoing chat message matches, the chat shows a sheet pointing to the emergency screen; the message
 * is still sent unchanged. Same groups and phrases as core-backend src/modules/care-console/safety-words.ts, which
 * puts a "Support needed" row (never Urgent) on the coach's Today queue. Kinyarwanda needs native review.
 */

export type SafetyGroup = "chest_breathing" | "stroke" | "fainting_seizure" | "bleeding" | "self_harm" | "low_sugar" | "pregnancy";

export const SAFETY_GROUP_LABEL: Record<SafetyGroup, string> = {
  chest_breathing: "chest pain or breathing",
  stroke: "stroke signs",
  fainting_seizure: "fainting or seizure",
  bleeding: "heavy bleeding",
  self_harm: "self-harm",
  low_sugar: "very low sugar",
  pregnancy: "pregnancy warning sign",
};

export const SAFETY_WORDS: Record<SafetyGroup, { en: string[]; rw: string[] }> = {
  chest_breathing: {
    en: ["chest pain", "pain in my chest", "chest tightness", "can't breathe", "cannot breathe", "cant breathe", "short of breath", "shortness of breath", "difficulty breathing", "struggling to breathe"],
    rw: ["ububabare mu gatuza", "kubabara mu gatuza", "ndababara mu gatuza", "sinshobora guhumeka", "guhumeka nabi", "kubura umwuka", "mbuze umwuka"],
  },
  stroke: {
    en: ["face drooping", "slurred speech", "can't move my arm", "cannot move my arm", "weakness on one side", "one side of my body", "stroke"],
    rw: ["mu maso hagoramye", "kuvuga nabi", "sinshobora kunyeganyeza ukuboko", "uruhande rumwe rw'umubiri", "stroke"],
  },
  fainting_seizure: {
    en: ["fainted", "passed out", "unconscious", "blacked out", "seizure", "convulsion", "convulsions"],
    rw: ["nataye ubwenge", "yataye ubwenge", "guta ubwenge", "nituye hasi", "igicuri", "kugagara"],
  },
  bleeding: {
    en: ["heavy bleeding", "bleeding a lot", "won't stop bleeding", "vomiting blood", "coughing blood", "blood in my vomit"],
    rw: ["kuva amaraso menshi", "amaraso menshi", "kuruka amaraso", "gukorora amaraso"],
  },
  self_harm: {
    en: ["kill myself", "end my life", "want to die", "suicide", "suicidal", "hurt myself", "self harm", "self-harm"],
    rw: ["kwiyahura", "kwiyica", "ndashaka gupfa", "nshaka gupfa", "kwigirira nabi"],
  },
  low_sugar: {
    en: ["sugar is very low", "sugar very low", "very low sugar", "hypo", "shaking and sweating"],
    rw: ["isukari yagabanutse cyane", "isukari yamanutse cyane", "isukari nkeya cyane"],
  },
  pregnancy: {
    en: ["baby is not moving", "baby not moving", "bleeding while pregnant", "pregnant and bleeding", "waters broke"],
    rw: ["umwana ntanyeganyega", "umwana ntakinyeganyega", "ndatwite ndava amaraso", "amazi yamenetse"],
  },
};

/** Lower case, no accents, curly quotes made straight, anything that is not a letter, digit or apostrophe becomes one space. */
export function normalizeForSafety(text: string) {
  return ` ${text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\u2018\u2019\u02bc`]/g, "'")
    .replace(/[^a-z0-9']+/g, " ")
    .trim()} `;
}

export type SafetyMatch = { matched: boolean; groups: SafetyGroup[]; terms: string[] };

/** Whole-word / whole-phrase match against the built-in list ("hypo" matches, "hypothyroid" does not). */
export function matchSafetyWords(text: string | null | undefined): SafetyMatch {
  if (!text || !text.trim()) return { matched: false, groups: [], terms: [] };
  const haystack = normalizeForSafety(text);
  const groups: SafetyGroup[] = [];
  const terms: string[] = [];
  for (const [group, words] of Object.entries(SAFETY_WORDS) as [SafetyGroup, { en: string[]; rw: string[] }][]) {
    for (const phrase of [...words.en, ...words.rw]) {
      if (haystack.includes(normalizeForSafety(phrase))) {
        if (!groups.includes(group)) groups.push(group);
        if (!terms.includes(phrase)) terms.push(phrase);
      }
    }
  }
  return { matched: groups.length > 0, groups, terms };
}
