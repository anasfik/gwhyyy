import InquiriesManager from "@/components/dashboard/InquiriesManager";
export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  return <InquiriesManager initialQuery={q ?? ""} initialStatus={status} />;
}
