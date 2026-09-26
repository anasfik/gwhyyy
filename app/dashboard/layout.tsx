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
      <div className="flex min-h-screen w-full bg-surface">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden pt-14 lg:ml-64 lg:pt-0">
          <div className="flex-1 overflow-hidden">{children}</div>
          <footer className="flex h-10 flex-shrink-0 items-center justify-between border-t border-outline-variant bg-surface-container-low px-4 lg:px-16 font-mono text-[10px] text-secondary">
            <div className="flex gap-4 lg:gap-6">
              <span>SYSTEM_STATUS: OK</span>
              <span className="hidden sm:inline">DB: SQLITE</span>
              <span className="hidden md:inline">CONTENT: LIVE</span>
            </div>
            <div className="uppercase">© {new Date().getFullYear()} GWHYYY</div>
          </footer>
        </div>
      </div>
    </SessionProvider>
  );
}
