export const workspaceNavigation = [
  { label: "Workspace", items: [{ href: "/dashboard", label: "Today" }, { href: "/dashboard/analytics", label: "Analytics" }] },
  { label: "Clients", items: [{ href: "/dashboard/messages", label: "Inquiries" }, { href: "/dashboard/prospects", label: "Prospects" }] },
  { label: "Email", items: [{ href: "/dashboard/mail", label: "Drafts" }, { href: "/dashboard/mail/history", label: "Sent & history" }, { href: "/dashboard/mail/replies", label: "Replies" }, { href: "/dashboard/mail/blocked", label: "Blocked addresses" }, { href: "/dashboard/mail/settings", label: "Sender settings" }] },
  { label: "Website", items: [{ href: "/dashboard/content", label: "Identity & availability" }, { href: "/dashboard/content/copy", label: "Page copy" }, { href: "/dashboard/projects", label: "Projects" }, { href: "/dashboard/content/services", label: "Services & stack" }, { href: "/dashboard/content/experience", label: "Experience" }, { href: "/dashboard/content/faq", label: "FAQ & search" }, { href: "/dashboard/settings", label: "Publishing & backups" }] },
];

type ReadinessMail = { status: string; approved_hash: string | null; attempted_at: string | null; is_test: number | boolean };
type ReadinessSettings = { paused: boolean; senderConfirmed: boolean; legalConfirmed: boolean; mode: string; dailyCap: number; repliesReviewedAt?: string | null };
export function mailReadiness(mail: ReadinessMail, settings: ReadinessSettings, attempts: number, now = Date.now()) {
  const age = now - Date.parse(settings.repliesReviewedAt ?? "");
  const checks = [
    { label: mail.attempted_at ? "Already attempted. Never resend." : "Not previously attempted", ready: !mail.attempted_at },
    { label: "Exact saved preview approved", ready: mail.status === "approved" && Boolean(mail.approved_hash) },
    { label: "Dispatch enabled", ready: !settings.paused },
    { label: "Sender confirmed", ready: settings.senderConfirmed },
    { label: "Daily allowance available", ready: attempts < settings.dailyCap },
  ];
  if (!mail.is_test) checks.push(
    { label: "Live mode and legal review", ready: settings.mode === "live" && settings.legalConfirmed },
    { label: "Inbox reviewed in the last ten minutes (or confirmed automatic sync)", ready: age >= 0 && age <= 600000 },
  );
  return checks;
}
