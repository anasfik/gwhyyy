"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "@/config/site";
import { projectPresentation } from "./project-presentation";

export default function ProjectLogoStrip({ projects }: { projects: Project[] }) {
  const scroll = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { setReduced(media.matches); setPaused(media.matches); };
    preference();
    media.addEventListener("change", preference);
    return () => media.removeEventListener("change", preference);
  }, []);

  useEffect(() => {
    const viewport = scroll.current;
    if (!viewport) return;
    const items = Array.from(viewport.querySelectorAll<HTMLElement>(".brand-item"));
    const groups = viewport.querySelectorAll<HTMLElement>(".brand-group");
    let positions: { element: HTMLElement; center: number }[] = [];
    let frame = 0;
    let last = 0;
    let remainder = 0;
    let visible = true;
    const updateFocus = () => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      const zone = Math.min(viewport.clientWidth * 0.4, 220);
      positions.forEach(({ element, center: itemCenter }) => {
        const focus = Math.max(0, 1 - Math.abs(itemCenter - center) / zone);
        element.style.setProperty("--focus", reduced ? "1" : String(focus));
      });
    };
    const measure = () => {
      positions = items.map(element => ({ element, center: element.offsetLeft + element.offsetWidth / 2 }));
      updateFocus();
    };
    const tick = (now: number) => {
      if (last && visible && !document.hidden && !paused && !hovered && !reduced && groups.length > 1) {
        remainder += Math.min(now - last, 50) * 0.028;
        const step = Math.floor(remainder);
        viewport.scrollLeft += step;
        remainder -= step;
        const length = groups[1].offsetLeft - groups[0].offsetLeft;
        if (length > 0 && viewport.scrollLeft >= length) viewport.scrollLeft -= length;
      }
      last = now;
      if (!paused && !reduced) frame = window.requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(measure);
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    resize.observe(viewport);
    intersection.observe(viewport);
    viewport.addEventListener("scroll", updateFocus, { passive: true });
    measure();
    if (!paused && !reduced) frame = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      viewport.removeEventListener("scroll", updateFocus);
    };
  }, [paused, hovered, reduced, projects]);

  if (!projects.length) return null;
  return (
    <section aria-label="Projects and teams" className="brand-strip border-b border-line">
      <div className="shell flex items-center justify-between gap-4 pt-5">
        <p className="text-xs text-muted">Built by me. Built with others.</p>
        <button type="button" className="motion-control px-3 text-xs" disabled={reduced} onClick={() => setPaused(value => !value)} aria-label={`${paused ? "Play logo strip" : "Pause logo strip"}${reduced ? " (reduced motion enabled)" : ""}`}>
          {paused ? "Play" : "Pause"}
        </button>
      </div>
      <div
        ref={scroll}
        className="brand-scroll"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setPaused(true)}
        onPointerDown={() => setPaused(true)}
        onWheel={() => setPaused(true)}
        onKeyDown={() => setPaused(true)}
      >
        <div className="brand-track">
          {[0, 1].map(copy => (
            <ul key={copy} className="brand-group" aria-hidden={copy === 1 ? true : undefined} inert={copy === 1}>
              {projects.map(project => {
                const presentation = projectPresentation[project.slug];
                return (
                  <li key={project.slug} className="brand-item" style={{ "--brand-color": presentation?.color || "#1d4a2a" } as CSSProperties}>
                    <Link href={`/work/${project.slug}`} className="brand-link" tabIndex={copy === 1 ? -1 : undefined}>
                      {presentation?.logo
                        ? <Image src={presentation.logo} alt="" width={40} height={40} className="brand-logo" />
                        : <span className="brand-monogram" aria-hidden="true">{presentation?.initials || project.name.slice(0, 2)}</span>}
                      <span>{project.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
