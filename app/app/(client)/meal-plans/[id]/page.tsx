import { MealPlanScreen } from "@/app/components/plus/care/meal-plans";

export const metadata = { title: "Meal plan" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MealPlanScreen id={Number(id) || 0} />;
}
