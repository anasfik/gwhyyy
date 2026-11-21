import { notFound } from "next/navigation";
import MailDraftFlow from "@/components/dashboard/MailDraftFlow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Send message | GWHYYY Admin", robots: { index: false, follow: false } };

export default async function SendMailDraft({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  return <MailDraftFlow id={Number(id)} step="send" />;
}
