import { ReceiptScreen } from "@/app/components/plus/programmes/screens";

export const metadata = { title: "Receipt" };

export default async function Page({ params }: { params: Promise<{ id: string; ref: string }> }) {
  const { id, ref } = await params;
  return <ReceiptScreen id={Number(id) || 0} reference={decodeURIComponent(ref)} />;
}
