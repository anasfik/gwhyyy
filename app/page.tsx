import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";
import ProjectsGrid from "@/components/portfolio/ProjectsGrid";
import ServicesGrid from "@/components/portfolio/ServicesGrid";
import EngineeringDepth from "@/components/portfolio/EngineeringDepth";
import ProcessSteps from "@/components/portfolio/ProcessSteps";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import OpenSourceSection from "@/components/portfolio/OpenSourceSection";
import FaqSection from "@/components/portfolio/FaqSection";
import ContactForm from "@/components/portfolio/ContactForm";
import PageTracker from "@/components/portfolio/PageTracker";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const siteConfig = getSiteContent();
  const { availability, links, personal, copy, budgetOptions } = siteConfig;
  return <><PageTracker /><Nav copy={copy.nav} brand={copy.brand} calendly={links.calendly} availabilityLabel={availability.label} /><main id="main" className="pt-[72px]"><Hero /><ProjectsGrid /><ServicesGrid /><EngineeringDepth /><ProcessSteps /><ExperienceSection /><OpenSourceSection /><FaqSection /><ContactForm budgetOptions={[...budgetOptions]} email={personal.email} calendly={links.calendly} copy={copy.contact} /></main><Footer /></>;
}
