"use client";

import { useEffect, useRef, useState } from "react";
import { SearchNormal1 } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { MobileApiError, asList, errorMessage, mobileRequest } from "@/lib/plus/client/api";
import { invalidate } from "@/lib/plus/client/use-resource";
import { AppBar, Avatar, CenterSpinner, EmptyState, useFeedback } from "../ui/vita";
import { AuthField } from "../ui/fields";

const navyA = (a: number) => `rgba(var(--vc-navy-rgb),${a})`;

type Person = { id: number | string; firstName: string; lastName: string; email: string; picture: string; type: string };

function parsePerson(raw: Record<string, unknown>): Person {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    id: (raw.id as number | string) ?? "",
    firstName: s(raw.first_name),
    lastName: s(raw.last_name),
    email: s(raw.email),
    picture: s(raw.profile_picture),
    type: s(raw.user_type),
  };
}
const fullName = (p: Person) => `${p.firstName} ${p.lastName}`.trim() || p.email;

/** add_user_to_room.dart: search people by name or email and add one to the room. */
export function AddUserToRoomScreen({ roomId }: { roomId: string }) {
  const t = useT();
  const { toast, confirm } = useFeedback();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const seq = useRef(0);
  const api = `/api/v1/mobile/chat/rooms/${encodeURIComponent(roomId)}`;

  const search = async (q: string) => {
    const id = ++seq.current;
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      setError("");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body = await mobileRequest<unknown>(`${api}/users`, { query: { search: q.trim() } });
      if (id !== seq.current) return;
      const list = Array.isArray(body) ? body : asList((body as Record<string, unknown> | null)?.users);
      setResults(list.map((u) => parsePerson(u as Record<string, unknown>)).filter((p) => p.id !== ""));
    } catch (e) {
      if (id !== seq.current) return;
      setError(e instanceof MobileApiError && e.status ? errorMessage(e.body, t("add_user_failed")) : t("network_error"));
    } finally {
      if (id === seq.current) {
        setLoading(false);
        setSearched(true);
      }
    }
  };

  // Debounced like the Flutter search field.
  useEffect(() => {
    const timer = window.setTimeout(() => void search(query), 500);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const add = async (person: Person) => {
    const ok = await confirm({
      title: t("add_user"),
      message: `${t("add_user_msg1")} ${fullName(person)} ${t("add_user_msg2")}`,
      confirmLabel: t("confirm"),
      cancelLabel: t("cancel"),
    });
    if (!ok) return;
    try {
      await mobileRequest(`${api}/add-user`, { method: "POST", body: { user_id: person.id } });
      toast(`${fullName(person)} ${t("add_user_success").trim()}`);
      invalidate(`chat:room:${roomId}`, "chat:rooms");
    } catch (e) {
      toast(e instanceof MobileApiError && e.status ? errorMessage(e.body, t("add_user_failed")) : t("network_error"), { error: true });
    }
  };

  return (
    <div className="vita-page" style={{ background: "var(--vc-canvas)", minHeight: "100dvh" }}>
      <AppBar title={t("add_user_title")} />
      <div style={{ padding: "8px 20px 16px" }}>
        <AuthField hint={t("search_user")} icon={<SearchNormal1 size={18} color="currentColor" />} value={query} onChange={setQuery} autoFocus />
      </div>
      {loading ? (
        <CenterSpinner />
      ) : error ? (
        <EmptyState title={error} actionLabel={t("retry")} onAction={() => search(query)} />
      ) : !searched ? (
        <EmptyState title={t("search_user")} subtitle={t("add_user_msg1")} />
      ) : results.length === 0 ? (
        <EmptyState title={t("no_results")} />
      ) : (
        <div style={{ padding: "0 20px calc(24px + env(safe-area-inset-bottom))", display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((person) => (
            <button
              key={String(person.id)}
              type="button"
              onClick={() => void add(person)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 10, background: "var(--vc-surface)", border: `1px solid ${navyA(0.06)}`, textAlign: "left", width: "100%" }}
            >
              <Avatar url={person.picture} size={46} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "var(--vc-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName(person)}</span>
                <span style={{ display: "block", marginTop: 2, fontSize: 12, fontWeight: 600, color: navyA(0.45) }}>{person.type}</span>
              </span>
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: "color-mix(in srgb, var(--vc-mint) 28%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vc-navy)", flex: "none" }} aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
