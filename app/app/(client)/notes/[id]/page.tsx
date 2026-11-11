import { ProgressNoteScreen } from "@/app/components/plus/care/progress-notes";

export const metadata = { title: "Progress notes" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProgressNoteScreen id={Number(id) || 0} />;
}
