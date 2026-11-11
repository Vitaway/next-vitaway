import { VisitReportScreen } from "@/app/components/plus/care/visit-reports";

export const metadata = { title: "After-Visit Summary" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VisitReportScreen id={Number(id) || 0} />;
}
