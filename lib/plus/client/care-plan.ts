import { asList, mobileRequest } from "./api";
import { useResource } from "./use-resource";
import { normalizeEnrolment, type Enrolment } from "../programmes";

const ENROLMENTS_KEY = "/api/v1/mobile/enrolments";
const PACKAGES_KEY = "/api/v1/mobile/membership-packages";

export type MembershipPackage = {
  code: string;
  name: string;
  tagline: string;
  who_it_is_for: string;
  price_rwf: number;
  currency: string;
  billing: "free" | "one_payment" | "monthly";
  duration_days: number;
  sort_order: number;
  inclusions: Record<string, unknown>;
  status: string;
};

export function useMyEnrolments() {
  return useResource<Enrolment[]>(ENROLMENTS_KEY, async () => asList(await mobileRequest(ENROLMENTS_KEY + "/")).map(normalizeEnrolment));
}

export type CarePlanState = {
  loading: boolean;
  enrolments: Enrolment[];
  current: Enrolment | null;
  onTrial: boolean;
  active: boolean;
  daysLeft: number;
};

export function useCarePlan(): CarePlanState {
  const res = useMyEnrolments();
  const enrolments = res.data ?? [];
  const trial = enrolments.find((e) => (e.trial?.daysLeft ?? 0) > 0 && (e.stage === "on_trial" || e.stage === "active" || e.paymentState === "trial")) ?? enrolments.find((e) => e.stage === "on_trial") ?? null;
  const active = enrolments.find((e) => e.stage === "active" || e.stage === "waiting_for_care_team") ?? null;
  const current = trial ?? active ?? enrolments[0] ?? null;
  return {
    loading: res.loading,
    enrolments,
    current,
    onTrial: Boolean(trial),
    active: Boolean(trial || active),
    daysLeft: trial?.trial?.daysLeft ?? 0,
  };
}

export function useMembershipPackages() {
  return useResource<MembershipPackage[]>(PACKAGES_KEY, async () => {
    const body = await mobileRequest(PACKAGES_KEY + "/");
    const record = body && typeof body === "object" ? (body as { results?: unknown }) : {};
    const rows = asList<MembershipPackage>(record.results ?? body);
    return rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  });
}
