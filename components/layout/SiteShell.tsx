import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getSiteContent } from "@/lib/site-content";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { links, copy } = getSiteContent();
  return (
    <>
      <Nav copy={copy.nav} brand={copy.brand} github={links.github} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
