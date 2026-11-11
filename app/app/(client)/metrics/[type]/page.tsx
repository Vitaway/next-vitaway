import MetricDetailScreen from "@/app/components/plus/readings/metric-detail";

export const metadata = { title: "Health metric" };

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <MetricDetailScreen type={decodeURIComponent(type)} />;
}
