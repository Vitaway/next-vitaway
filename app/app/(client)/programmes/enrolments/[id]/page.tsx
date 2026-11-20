import { EnrolmentScreen } from "@/app/components/plus/programmes/screens";

export const metadata = { title: "My programme" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EnrolmentScreen id={Number(id) || 0} />;
}
