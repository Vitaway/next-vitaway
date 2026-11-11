import { AddUserToRoomScreen } from "@/app/components/plus/support/add-user";

export const metadata = { title: "Add user" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AddUserToRoomScreen roomId={decodeURIComponent(id)} />;
}
