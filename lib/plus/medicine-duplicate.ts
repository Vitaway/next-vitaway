/** W7: read the /medications/check-duplicate/ answer. */
export function duplicateOf(body: unknown): { id: number; name: string } | null {
  if (!body || typeof body !== "object") return null;
  const dup = (body as { duplicate_of?: unknown }).duplicate_of;
  if (!dup || typeof dup !== "object") return null;
  const d = dup as { id?: unknown; name?: unknown };
  if (d.name == null) return null;
  return { id: Number(d.id) || 0, name: String(d.name) };
}
