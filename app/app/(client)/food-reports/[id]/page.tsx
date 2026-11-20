import { FoodReportScreen } from "@/app/components/plus/meals/food-report";

export const metadata = { title: "Food report" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FoodReportScreen id={Number(id) || 0} />;
}
