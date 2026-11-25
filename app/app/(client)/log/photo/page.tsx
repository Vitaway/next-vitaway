import { PhotoReadScreen } from "@/app/components/plus/readings/photo-read";

export const metadata = { title: "Reading from a photo" };

export default async function Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  return <PhotoReadScreen initialType={type ?? null} />;
}
