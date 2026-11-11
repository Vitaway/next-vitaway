import { AppointmentDetailScreen } from "@/app/components/plus/care/appointments";

export const metadata = { title: "Appointment details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AppointmentDetailScreen appointmentKey={decodeURIComponent(id)} />;
}
