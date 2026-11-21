import { notFound } from "next/navigation";
import MailDraftFlow from "@/components/dashboard/MailDraftFlow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Review draft | GWHYYY Admin", robots: { index: false, follow: false } };

export default async function ReviewMailDraft({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  return <MailDraftFlow id={Number(id)} step="review" />;
}
