import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/portfolio/Hero";
import ProjectsGrid from "@/components/portfolio/ProjectsGrid";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ServicesGrid from "@/components/portfolio/ServicesGrid";
import ProcessSteps from "@/components/portfolio/ProcessSteps";
import ContactForm from "@/components/portfolio/ContactForm";
import PageTracker from "@/components/portfolio/PageTracker";

export default function HomePage() {
  return (
    <>
      <PageTracker />
      <Nav />
      <main className="pt-20">
        <Hero />
        <ProjectsGrid />
        <ExperienceSection />
        <ServicesGrid />
        <ProcessSteps />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
