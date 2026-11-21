import { notFound } from "next/navigation";
import OutreachManager from "@/components/dashboard/OutreachManager";
export const dynamic = "force-dynamic";
export default async function MailSection({ params }: { params: Promise<{ view: string }> }) {
  const { view } = await params;
  if (view !== "history" && view !== "replies" && view !== "blocked" && view !== "settings") notFound();
  return <OutreachManager view={view} />;
}
