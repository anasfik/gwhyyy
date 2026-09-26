import Link from "next/link";
import { getProjects, getSiteContent } from "@/lib/site-content";
import ProjectCard from "./ProjectCard";

export default function ProjectsGrid() {
  const { copy } = getSiteContent();
  const projects = getProjects(getSiteContent());
  const last = String(projects.length).padStart(2, "0");
  return (
    <section className="section border-b border-line" id="work" aria-labelledby="work-title">
      <div className="shell">
        <div className="mb-16 max-w-3xl">
          <p className="label mb-5 text-signal">{copy.work.eyebrow} / 01–{last}</p>
          <h2 id="work-title" className="text-balance text-4xl font-semibold tracking-[-.055em] md:text-6xl">{copy.work.heading}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{copy.work.body}</p>
        </div>
        <div className="space-y-20 md:space-y-28">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
        <Link href="/projects" className="link-arrow mt-16 inline-flex border-b border-signal pb-2 text-sm font-medium">{copy.work.allLink} <span className="ml-2 inline-block text-signal">→</span></Link>
      </div>
    </section>
  );
}
