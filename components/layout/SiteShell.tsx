import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { getSiteContent } from "@/lib/site-content";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const { links, availability, copy } = getSiteContent();
  return (
    <>
      <Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
