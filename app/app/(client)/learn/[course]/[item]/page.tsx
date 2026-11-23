import { CoursePlayer } from "@/app/components/plus/academy/player";

export const metadata = { title: "Learn" };

export default async function Page({ params }: { params: Promise<{ course: string; item: string }> }) {
  const { course, item } = await params;
  return <CoursePlayer courseId={decodeURIComponent(course)} itemId={decodeURIComponent(item)} />;
}
