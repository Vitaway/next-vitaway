import { MealPlanScreen } from "@/app/components/plus/academy/my-programme";

export const metadata = { title: "Meal plan" };

export default async function Page({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course } = await searchParams;
  return <MealPlanScreen courseId={course || "HW"} />;
}
