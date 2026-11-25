import { MealPhotoComposeScreen } from "@/app/components/plus/meals/meal-photos";

export const metadata = { title: "Send a meal photo" };

export default async function Page({ searchParams }: { searchParams: Promise<{ retake_of?: string }> }) {
  const { retake_of: retakeOf } = await searchParams;
  const id = Number(retakeOf);
  return <MealPhotoComposeScreen retakeOf={Number.isFinite(id) && id > 0 ? id : undefined} />;
}
