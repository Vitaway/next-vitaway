import { MedicationDetailScreen } from "@/app/components/plus/meds/screens";

export const metadata = { title: "Medicine" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MedicationDetailScreen id={Number(id) || 0} />;
}
