import MailDraftFlow from "@/components/dashboard/MailDraftFlow";

export const dynamic = "force-dynamic";
export const metadata = { title: "New draft | GWHYYY Admin", robots: { index: false, follow: false } };

export default async function NewMailDraft({ searchParams }: { searchParams: Promise<{ prospectId?: string; email?: string }> }) {
  const { prospectId, email } = await searchParams;
  return <MailDraftFlow prospectId={/^\d+$/.test(prospectId ?? "") ? Number(prospectId) : undefined} initialEmail={email} step="review" />;
}
