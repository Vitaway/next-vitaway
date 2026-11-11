import { RequestAppointmentScreen } from "@/app/components/plus/support/coaches";

export const metadata = { title: "Request appointment" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RequestAppointmentScreen id={Number(id) || 0} />;
}
