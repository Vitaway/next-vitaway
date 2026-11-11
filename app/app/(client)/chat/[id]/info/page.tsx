import { ChatInfoScreen } from "@/app/components/plus/support/chat-info";

export const metadata = { title: "Chat details" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatInfoScreen roomId={decodeURIComponent(id)} />;
}
