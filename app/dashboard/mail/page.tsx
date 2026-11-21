import { redirect } from "next/navigation";
import MailQueue from "@/components/dashboard/MailQueue";

export const dynamic = "force-dynamic";
export const metadata = { title: "Drafts | GWHYYY Admin", robots: { index: false, follow: false } };

export default async function MailPage({ searchParams }: { searchParams: Promise<{ prospectId?: string; messageId?: string; email?: string }> }) {
  const { prospectId, messageId, email } = await searchParams;
  if (/^\d+$/.test(messageId ?? "")) redirect(`/dashboard/mail/draft/${messageId}`);
  if (/^\d+$/.test(prospectId ?? "")) redirect(`/dashboard/mail/new?prospectId=${prospectId}${email ? `&email=${encodeURIComponent(email)}` : ""}`);
  return <MailQueue />;
}
