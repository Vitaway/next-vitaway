import { PathLessonScreen } from "@/app/components/plus/learn/your-path";

export const metadata = { title: "Your path" };

export default async function Page({ params }: { params: Promise<{ week: string; lesson: string }> }) {
  const { week, lesson } = await params;
  return <PathLessonScreen week={Number(week) || 0} lessonId={lesson} />;
}
