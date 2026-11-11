import { ChatScreen } from "@/app/components/plus/support/chat";

export const metadata = { title: "Chat" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatScreen roomId={decodeURIComponent(id)} />;
}
