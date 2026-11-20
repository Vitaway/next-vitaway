import { PaymentStatusScreen } from "@/app/components/plus/programmes/screens";

export const metadata = { title: "Payment" };

export default async function Page({ params }: { params: Promise<{ id: string; ref: string }> }) {
  const { id, ref } = await params;
  return <PaymentStatusScreen id={Number(id) || 0} reference={decodeURIComponent(ref)} />;
}
