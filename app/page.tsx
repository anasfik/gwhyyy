import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";
import ProjectsGrid from "@/components/portfolio/ProjectsGrid";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ServicesGrid from "@/components/portfolio/ServicesGrid";
import ProcessSteps from "@/components/portfolio/ProcessSteps";
import FaqSection from "@/components/portfolio/FaqSection";
import TestimonialsSection from "@/components/portfolio/TestimonialsSection";
import ContactForm from "@/components/portfolio/ContactForm";
import PageTracker from "@/components/portfolio/PageTracker";
import StickyCTA from "@/components/portfolio/StickyCTA";

export default function HomePage() {
  return (
    <>
      <PageTracker />
      <Nav />
      <main id="main" className="pt-20">
        <Hero />
        <ProjectsGrid />
        <ExperienceSection />
        <ServicesGrid />
        <ProcessSteps />
        <TestimonialsSection />
        <FaqSection />
        <ContactForm />
      </main>
      <Footer />
      <StickyCTA />
    </>
  );
}
