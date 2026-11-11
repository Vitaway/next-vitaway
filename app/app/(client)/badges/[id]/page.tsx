import { BadgeDetailScreen } from "@/app/components/plus/learn/learn";

export const metadata = { title: "Badge" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BadgeDetailScreen index={Number(id) || 0} />;
}
