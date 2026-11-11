"use client";

import { useCallback, useEffect, useState } from "react";
import { UserSearch } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { asList, mobileRequest } from "@/lib/plus/client/api";
import { parseCoach, type Coach } from "@/lib/plus/client/chat";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { AppBar, CenterSpinner, EmptyState, Photo } from "../ui/vita";
import { stashCoach } from "./support";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

/** find_coach.dart: every coach from /coaches/, in rows by speciality. */
export function FindCoachScreen() {
  const t = useT();
  const { push } = usePlusPaths();
  const [coaches, setCoaches] = useState<Coach[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setFailed(false);
    setCoaches(null);
    try {
      setCoaches(asList(await mobileRequest("/coaches/")).map(parseCoach));
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const groups = new Map<string, Coach[]>([["Generalists", []]]);
  for (const coach of coaches ?? []) {
    const key = coach.profile.speciality || "Generalists";
    groups.set(key, [...(groups.get(key) ?? []), coach]);
  }
  const rows = [...groups.entries()].filter(([, list]) => list.length > 0);

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)", minHeight: "100dvh" }}>
      <AppBar
        title={t("find_coach")}
        actions={
          <span style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }} aria-hidden>
            <UserSearch size={20} color="currentColor" />
          </span>
        }
      />
      {failed ? (
        <div style={{ paddingTop: 64 }}>
          <EmptyState title={t("coaches_load_failed")} subtitle={t("coaches_load_failed_body")} actionLabel={t("retry")} onAction={load} />
        </div>
      ) : coaches === null ? (
        <CenterSpinner />
      ) : coaches.length === 0 ? (
        <EmptyState title={t("no_coaches")} subtitle={t("no_coaches_body") || undefined} />
      ) : (
        <div style={{ padding: "16px 16px calc(16px + env(safe-area-inset-bottom))" }}>
          {rows.map(([category, list]) => (
            <section key={category} style={{ marginBottom: 24 }}>
              <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: "var(--vc-navy)" }}>{category}</h2>
              <div className="vita-hscroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollSnapType: "x proximity", WebkitOverflowScrolling: "touch" }}>
                {list.map((coach) => (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => {
                      stashCoach(coach);
                      push(`/coaches/${coach.id}`);
                    }}
                    style={{ flex: "none", width: 200, textAlign: "left", background: "var(--vc-surface)", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden", scrollSnapAlign: "start", padding: 0 }}
                  >
                    <Photo url={coach.profile.profile_picture} style={{ width: 200, height: 160, objectFit: "cover", display: "block", borderRadius: 0 }} />
                    <span style={{ display: "block", padding: 8 }}>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{`${coach.first_name} ${coach.last_name}`.trim()}</span>
                      <span style={{ display: "block", marginTop: 2, fontSize: 14, color: navyA(0.55), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{coach.profile.speciality || t("health_coach")}</span>
                      <span style={{ display: "inline-block", marginTop: 4, padding: "2px 6px", borderRadius: 8, background: navyA(0.1), fontSize: 12, fontWeight: 500, color: "var(--vc-navy)" }}>{t("appointments")}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
