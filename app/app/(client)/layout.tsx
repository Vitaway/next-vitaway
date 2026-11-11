import ClientFrame from "@/app/components/plus/shell/client-frame";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ClientFrame>{children}</ClientFrame>;
}
