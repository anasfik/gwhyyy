"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Project } from "@/config/site";
import { projectPresentation } from "./project-presentation";

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(true);
  const canRotate = projects.length > 1 && !paused && !hovered && !focused && !hidden && !reduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { setReduced(media.matches); setPaused(media.matches); };
    const visibility = () => setHidden(document.hidden);
    preference();
    visibility();
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!canRotate) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % projects.length), 6000);
    return () => window.clearInterval(timer);
  }, [canRotate, projects.length]);

  if (!projects.length) return null;
  const current = active % projects.length;
  const move = (direction: number) => {
    setPaused(true);
    setActive((current + direction + projects.length) % projects.length);
  };

  return (
    <section
      aria-label="Project showcase"
      aria-roledescription="carousel"
      data-active-project={projects[current].slug}
      className="showcase"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => { setFocused(true); setPaused(true); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="showcase-window">
        <div className="showcase-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {projects.map((project, index) => {
            const image = project.media?.[0];
            return (
              <article key={project.slug} className="showcase-slide" aria-roledescription="slide" aria-label={`${index + 1} of ${projects.length}: ${project.name}`} inert={index !== current}>
                <Link href={`/work/${project.slug}`} className="showcase-link" tabIndex={index === current ? 0 : -1}>
                  <div className="showcase-image">
                    {image ? (
                      <Image src={image.src} alt={image.alt} fill priority={index === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-top" />
                    ) : <span className="showcase-fallback">{project.name}</span>}
                    <span className="showcase-open" aria-hidden="true">↗</span>
                  </div>
                  <div className="showcase-caption">
                    <span className="text-xl font-medium tracking-[-.035em]">{project.name}</span>
                    <span className="text-xs text-muted">{project.role || project.category}</span>
                  </div>
                </Link>
                <p className="showcase-note" key={`${project.slug}-note`}>
                  <span aria-hidden="true">↳</span> {projectPresentation[project.slug]?.note || project.summary}
                </p>
              </article>
            );
          })}
        </div>
      </div>
      {projects.length > 1 && (
        <div className="showcase-controls">
          <p className="font-mono text-xs text-muted" aria-live={paused ? "polite" : "off"} aria-atomic="true">
            {String(current + 1).padStart(2, "0")} <span aria-hidden="true">/</span> <span className="sr-only">of</span> {String(projects.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1">
            <button type="button" className="motion-control px-3 text-xs" onClick={() => setPaused(value => !value)} disabled={reduced} aria-label={`${paused ? "Play showcase" : "Pause showcase"}${reduced ? " (reduced motion enabled)" : ""}`}>
              {paused ? "Play" : "Pause"}
            </button>
            <button type="button" className="motion-control" aria-label="Previous project" onClick={() => move(-1)}>←</button>
            <button type="button" className="motion-control" aria-label="Next project" onClick={() => move(1)}>→</button>
          </div>
        </div>
      )}
    </section>
  );
}
