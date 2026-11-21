# Design system

## Design read

An independent engineer selling product work to founders and SaaS teams. The reference feeling is an engineering field notebook or a technical publication, not an agency landing page and not an AI startup. Light, legible, specific. Real product evidence before decoration.

- `DESIGN_VARIANCE: 6` — asymmetric editorial grids, but predictable reading order.
- `MOTION_INTENSITY: 3` — one entrance on the hero; hover transitions elsewhere; no scroll hijack.
- `VISUAL_DENSITY: 4` — generous section spacing, bordered lists instead of card stacks.

## Visual direction

- **One theme:** light only. `color-scheme: light`; no section-level theme flips.
- **One accent:** brand lime, used for emphasis and final CTA bands. Forest green carries links, arrows, and focus.
- **Shape:** zero border radius across buttons, inputs, images, and panels. The only circles are the status dot, the success checkmark, and native radios.
- **Material:** flat paper, 1px rules, white media frames. No gradients, orbs, glass, glow, noise, or fake terminal chrome.
- **Images:** real screenshots from Reqistry, pub.dev, Gathr, and Rollee, plus the official Reqistry mark. Architecture diagrams are typographic, not fake UI.

## Tokens

Defined in `tailwind.config.ts` and `app/globals.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#f3f4ee` | page background |
| `ink` | `#11140f` | body text, filled buttons |
| `panel` | `#e9ebe2` | alternating section background |
| `raised` / `white` | `#ffffff` | media frames, inputs, form panels |
| `line` | `#d5d9ce` | 1px rules and borders |
| `muted` | `#596157` | secondary text |
| `forest` | `#1d4a2a` | links, arrows, focus ring, selected controls |
| `signal` | `#b7f56a` | brand accent, final CTA background |
| `flare` | `#e6ffb8` | link hover highlight |
| `danger` | `#a32218` | form errors |

Contrast checks: ink on paper ≈ 16.5:1; muted on paper ≈ 6.4:1; paper on forest ≈ 9.5:1; ink on signal ≈ 13:1. All body and button combinations target WCAG AA or better.

Dashboard tokens (`surface`, `on-surface`, `outline-variant`, etc.) intentionally remain dark and are scoped to admin screens.

## Typography

- **Sans:** Geist, self-hosted via `next/font/local` (`app/fonts/GeistVF.woff`).
- **Mono:** Geist Mono, used for labels, counters, sources, and technical metadata.
- **Body:** 17px / 1.6, muted colour for secondary copy.
- **Display:** 600 weight, `-0.055em` tracking, `0.96` line height, `text-wrap: balance`.
- **Scale:** 12 / 14 / 17 / 20 / 24 / 30 / 36 / 48 / 64 / 86 px through Tailwind and `clamp()`.
- **Labels:** 11px mono, uppercase, `0.13em` tracking. No label appears above every section; the homepage uses two small labels.

## Layout

- Shell: `min(100% - 2.5rem, 1280px)`.
- Sections: `clamp(4rem, 8vw, 7rem)` block padding.
- Grid: 2-column hero and case-study header; 4-column metric strip; 12-column service bento; 2-column lists on tablet and up. Every multi-column block collapses to one column below 768px.
- Rules over cards. A section does not repeat the same card grid twice.
- Media aspect ratio is fixed (`1440/950` for web shots) to prevent layout shift.

## Components

| Component | Notes |
| --- | --- |
| `Nav` | Sticky, 64px, three links + one CTA. Full-screen mobile menu, Escape to close, 44px targets. |
| `Footer` | Brand, navigation, contact, availability, privacy. No fake deploy timestamp. |
| `SiteShell` | Header + main + footer for all public pages. |
| `Monogram` | Typographic MAF panel; real identity without a fabricated portrait. |
| `ProjectCard` | Real screenshot, category, outcome, case-study link. |
| `ContactForm` | One step, native radios/select, optional disclosure, scroll-to-state, values preserved on failure. |
| Buttons | Two variants only: filled ink, outline. Same labels for same intent. |
| Links | Underline or arrow; forest hover; visible focus. |
| FAQ | Native `<details>`/`<summary>`, no client JS. |

## States

- **Hover:** underline highlight, arrow shift, border darkening.
- **Focus:** 2px forest outline with 3px offset on every interactive element.
- **Active:** 1px translate on filled buttons.
- **Loading:** submit button disabled, label changes to “Sending…”, `aria-busy`.
- **Success:** bordered panel with check, explicit “saved” wording, reset action; scrolled into view.
- **Error:** inline `role="alert"`, text preserved, email fallback shown.
- **Disabled:** reduced opacity and `cursor-wait` only while sending.

## Motion

- One CSS entrance on the hero and screenshot; 650ms `cubic-bezier(.16,1,.3,1)`.
- 160–220ms hover transitions.
- `prefers-reduced-motion` disables animation duration and smooth scrolling globally.
- No `window.scroll` listeners, no animation loops, no parallax.

## Accessibility

- Skip link to `#main`.
- Landmarks, one `h1` per page, ordered headings.
- Form labels above controls; required fields marked in text and with native `required`; a description hint is wired with `aria-describedby`.
- Native form semantics; no custom comboboxes.
- Status and error regions use `role="status"` / `role="alert"`.
- Focus is never removed; mobile menu remains keyboard-operable.
- Colour is not the only signal: selected service also uses a filled background and a checked radio.
- Images have descriptive alt text based on what the screenshot shows.

## Responsive rules

- `< 640px`: single column, 20px gutters, stacked CTAs, 2-column metric strip.
- `640–1024px`: two-column forms and lists; nav links remain visible from 768px.
- `≥ 1024px`: asymmetric hero and case-study header; sticky aside on service pages; 4-column metrics.
- `≥ 1280px`: full brand signature appears in the nav; shell caps at 1280px.
- No horizontal overflow at 390, 768, or 1440 px in QA. See `QA-REPORT.md`.

## Why this and not the old look

The previous lime-on-black dashboard treatment signalled “technical”, but it flattened services, proof, and inquiry into the same dense grid. The new system keeps the brand lime as an accent and moves the reading surface to paper and ink: easier for non-technical buyers, better contrast, real screenshots instead of generated diagrams, and a clear visual hierarchy from offer to proof to inquiry.
