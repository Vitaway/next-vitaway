import { ReminderDetailScreen } from "@/app/components/plus/reminders/reminders";

export const metadata = { title: "Reminder" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReminderDetailScreen id={decodeURIComponent(id)} />;
}
