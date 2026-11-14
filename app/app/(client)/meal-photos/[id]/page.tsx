import { MealPhotoDetailScreen } from "@/app/components/plus/meals/meal-photos";

export const metadata = { title: "Meal photo" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MealPhotoDetailScreen id={Number(id) || 0} />;
}
