import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/Sidebar";
import SessionProvider from "@/components/dashboard/SessionProvider";

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
      <div className="flex h-screen w-full bg-surface overflow-hidden">
        <DashboardSidebar />
        <div className="ml-64 flex-grow flex flex-col min-h-screen overflow-hidden">
          {children}
          {/* Status bar */}
          <footer className="h-10 border-t border-outline-variant bg-surface-container-low px-[64px] flex items-center justify-between font-[family-name:var(--font-ibm-plex-mono)] text-[10px] text-secondary flex-shrink-0">
            <div className="flex gap-6">
              <span>SYSTEM_STATUS: OK</span>
              <span>DB: SQLITE</span>
            </div>
            <div className="uppercase">© {new Date().getFullYear()} GWHYYY · ADMIN_ACCESS_LEVEL: 01</div>
          </footer>
        </div>
      </div>
    </SessionProvider>
  );
}
