export type ProspectGate = {
  email: string | null;
  stage: string;
  email_status: string | null;
  lawful_basis: string | null;
  source_url: string | null;
  suppressed_at: string | null;
  unsubscribed_at: string | null;
};

export type SendCheck = { label: string; ready: boolean };

export function prospectSendChecks(prospect: ProspectGate | null, savedRecipient: string | null): SendCheck[] {
  return [
    { label: "Prospect record found", ready: Boolean(prospect) },
    { label: "Recipient matches the prospect record", ready: Boolean(prospect?.email && (!savedRecipient || prospect.email.toLowerCase() === savedRecipient.toLowerCase())) },
    { label: "Stage is qualified or contacted", ready: Boolean(prospect && ["qualified", "contacted"].includes(prospect.stage)) },
    { label: "Email is verified or accepted risk", ready: ["verified", "risky"].includes(prospect?.email_status ?? "") },
    { label: "Lawful basis reviewed", ready: Boolean(prospect?.lawful_basis?.trim()) },
    { label: "Public source URL recorded", ready: /^https?:\/\//.test(prospect?.source_url ?? "") },
    { label: "Not suppressed or unsubscribed", ready: Boolean(prospect) && !prospect?.suppressed_at && !prospect?.unsubscribed_at },
  ];
}
