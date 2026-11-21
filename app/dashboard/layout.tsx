import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WorkspaceShell from "@/components/dashboard/WorkspaceShell";
import SessionProvider from "@/components/dashboard/SessionProvider";
import localFont from "next/font/local";
import "./workspace.css";

const manrope = localFont({ src: "../fonts/Manrope.ttf", variable: "--font-workspace", display: "swap" });

export const metadata = {
  title: "Admin Dashboard | GWHYYY",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <SessionProvider session={session}>
      <div className={manrope.variable}><WorkspaceShell>{children}</WorkspaceShell></div>
    </SessionProvider>
  );
}
