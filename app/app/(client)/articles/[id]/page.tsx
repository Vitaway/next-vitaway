import { ArticleScreen } from "@/app/components/plus/learn/learn";

export const metadata = { title: "Article" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleScreen id={Number(id) || 0} />;
}
