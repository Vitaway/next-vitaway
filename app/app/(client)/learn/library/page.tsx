import { LibraryScreen } from "@/app/components/plus/academy/my-programme";

export const metadata = { title: "Library" };

export default async function Page({ searchParams }: { searchParams: Promise<{ f?: string }> }) {
  const { f } = await searchParams;
  return <LibraryScreen initialFilter={f} />;
}
