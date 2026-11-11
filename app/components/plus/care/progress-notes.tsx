"use client";

import { Calendar1, Refresh, Stickynote, TaskSquare } from "iconsax-react";
import { useT } from "@/lib/plus/i18n";
import { useMe } from "@/lib/plus/client/data";
import { relativeDayLabel, useProgressNotes, type CoachNote } from "@/lib/plus/client/care";
import { usePlusPaths } from "@/lib/plus/plus-paths";
import { ActionButton, AppBar, Avatar, Card, CenterSpinner, CircleButton, EmptyState, SectionLabel } from "../ui/vita";

function NoteCard({ note, coachView, onOpen }: { note: CoachNote; coachView: boolean; onOpen: () => void }) {
  const t = useT();
  const who = coachView ? note.userProfile : note.coachProfile;
  return (
    <button type="button" onClick={onOpen} style={{ display: "block", width: "calc(100% - 20px)", margin: 10, textAlign: "left", borderRadius: 6, background: "var(--vc-surface)", boxShadow: "0 2px 5px 2px rgba(var(--vc-navy-rgb),0.06)", color: "var(--vc-navy)" }}>
      <div style={{ padding: 10, display: "flex", alignItems: "center" }}>
        <Avatar url={who.profilePicture} size={50} />
        <div style={{ marginLeft: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vc-ink)" }}>{who.firstName}</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: "rgba(var(--vc-navy-rgb),0.55)" }}>{relativeDayLabel(note.timestamp, t)}</div>
        </div>
      </div>
      <div style={{ padding: "0 10px 10px" }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{t("note")}</div>
        <div style={{ fontSize: 13, color: "rgba(var(--vc-navy-rgb),0.55)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{note.note}</div>
        <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: "rgba(var(--vc-navy-rgb),0.55)" }}>
          {t("recommendations")}: {note.recommendations.length}
        </div>
      </div>
    </button>
  );
}

export function ProgressNotesScreen() {
  const t = useT();
  const { user } = useMe();
  const { push } = usePlusPaths();
  const { notes, loading, error, reload } = useProgressNotes();
  const coach = user?.user_type === "coach";
  const title = coach ? t("progress_notes_coach") : t("progress_notes_title");
  const refresh = (
    <CircleButton label={t("retry")} onClick={() => void reload()}>
      <Refresh size={18} color="currentColor" />
    </CircleButton>
  );
  return (
    <div className="vita-page">
      <AppBar title={title} actions={error ? undefined : refresh} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <CenterSpinner />
        ) : error && !notes.length ? (
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <p style={{ margin: "0 0 16px", color: "var(--vc-navy)" }}>Failed to load progress notes</p>
            <ActionButton label={t("retry")} icon={<Refresh size={16} color="currentColor" />} onClick={reload} />
          </div>
        ) : !notes.length ? (
          <EmptyState title="No visit notes yet" subtitle="Notes from your coach will show up here after a visit." />
        ) : (
          <div style={{ paddingBottom: 24 }}>
            {notes.map((n) => (
              <NoteCard key={n.id} note={n} coachView={coach} onOpen={() => push(`/notes/${n.id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProgressNoteScreen({ id }: { id: number }) {
  const t = useT();
  const { notes, loading } = useProgressNotes();
  const note = notes.find((n) => n.id === id);
  const coach = note?.coachProfile;
  const coachName = coach ? `${coach.firstName} ${coach.lastName}`.trim() : "";
  return (
    <div className="vita-page">
      <AppBar title={t("progress_notes_title")} />
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <CenterSpinner />
        ) : !note ? (
          <EmptyState title="No visit notes yet" subtitle="Notes from your coach will show up here after a visit." />
        ) : (
          <div style={{ padding: "8px 20px 32px" }}>
            <Card>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Avatar url={coach?.profilePicture} size={52} />
                <div style={{ marginLeft: 14, flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "var(--vc-navy)" }}>{coachName || "—"}</div>
                  <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "rgba(var(--vc-navy-rgb),0.5)" }}>
                    <Calendar1 size={13} color="currentColor" />
                    {relativeDayLabel(note.timestamp, t)}
                  </div>
                </div>
              </div>
            </Card>
            <div style={{ height: 20 }} />
            <SectionLabel icon={<Stickynote size={18} color="currentColor" />} label={t("progress_notes_title")} />
            <div style={{ height: 10 }} />
            <Card>
              <div style={{ fontSize: 15, lineHeight: 1.5, fontWeight: 500, whiteSpace: "pre-wrap", color: "rgba(var(--vc-navy-rgb),0.78)" }}>{note.note.trim() ? note.note : "—"}</div>
            </Card>
            {note.recommendations.length ? (
              <>
                <div style={{ height: 24 }} />
                <SectionLabel icon={<TaskSquare size={18} color="currentColor" />} label={t("recommendations")} />
                <div style={{ height: 10 }} />
                <Card padding="6px 18px">
                  {note.recommendations.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", padding: "14px 0", borderBottom: i === note.recommendations.length - 1 ? undefined : "1px solid rgba(var(--vc-navy-rgb),0.06)" }}>
                      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(92,224,198,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--vc-navy)", flex: "none" }}>{i + 1}</span>
                      <span style={{ marginLeft: 12, paddingTop: 3, fontSize: 14, lineHeight: 1.5, fontWeight: 500, color: "rgba(var(--vc-navy-rgb),0.78)" }}>{r}</span>
                    </div>
                  ))}
                </Card>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
