import { ProgrammeDetailScreen } from "@/app/components/plus/programmes/screens";

export const metadata = { title: "Programme" };

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ProgrammeDetailScreen code={decodeURIComponent(code)} />;
}
