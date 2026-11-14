import { VisitPlanScreen } from "@/app/components/plus/care/visit-plans";

export const metadata = { title: "Take-home plan" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VisitPlanScreen id={Number(id) || 0} />;
}
