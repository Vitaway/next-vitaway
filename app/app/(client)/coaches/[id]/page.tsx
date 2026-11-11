import { CoachDetailsScreen } from "@/app/components/plus/support/coaches";

export const metadata = { title: "Coach" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CoachDetailsScreen id={Number(id) || 0} />;
}
