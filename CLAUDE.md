# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A marketing site redesign for **Move Social**, a Brazilian socio-environmental impact consultancy. All copy is in Portuguese (pt-BR). Three routes: `/` (home), `/teoria-da-mudanca` (theory of change), `/contato` (contact). Built with Next.js App Router, TypeScript, and Tailwind CSS.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

```
pnpm dev      # start dev server
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # next lint
```

There is no test suite in this project.

## Architecture

### Content lives in `data/`, not in components

`data/site.ts` centralizes all copy and structured content: nav items, the 7 "goals" (used both as the full-bleed horizontal scroll sequence and the stacked mobile fallback), deliverables, services comparison lists, principles, metrics, and contact info. `data/images.ts` centralizes every image source and alt text behind a `unsplash(id)` helper.

**When asked to change copy, headings, stats, or images, edit the relevant `data/*.ts` file — not the component that renders it.** Components are intentionally presentational and map over these arrays.

Images are currently Unsplash placeholders (see comment at the top of `data/images.ts`). `next.config.ts` only allows remote images from `images.unsplash.com`; swapping to real photography means updating both files together. `Hero` and `HorizontalGoals` accept an optional `videoSrc`/`goal.image` override for when real footage/photography replaces a placeholder.

### Animation stack: GSAP+Lenis for scroll choreography, Framer Motion for simple reveals

- `SmoothScroll` (mounted once, in `app/layout.tsx`) owns the single global `Lenis` instance and pipes its raf loop into `gsap.ticker`, calling `ScrollTrigger.update` on scroll. Don't instantiate another `Lenis` elsewhere — everything scroll-driven should hook into this one instance via `ScrollTrigger`.
- `HorizontalGoals` is the centerpiece scroll interaction: a `lg:`-only pinned, horizontally-scrubbed panel sequence built with `gsap.context` + `ScrollTrigger` (pin + scrub + snap). Below `lg`, the same `goals` data renders as a plain stacked card list instead — the two markup blocks must be kept in sync when `goals` data changes shape.
- `Reveal` (Framer Motion `whileInView`, `once: true`) is the standard fade/slide-up-on-scroll wrapper used for simple content reveals. `MediaFrame` wraps `next/image` in a `Reveal` with a consistent aspect ratio and hover zoom — use it for any content image instead of a bare `Image`.
- Reduced motion is handled globally via a `prefers-reduced-motion` media query in `app/globals.css`, not per-component.

### Design tokens

Custom Tailwind theme in `tailwind.config.ts` under the `move` color namespace (`move-purple`, `move-periwinkle`, `move-green`, `move-mint`, `move-yellow`, `move-offwhite`, `move-black`, `move-gray`, `move-line`) plus custom type scale (`eyebrow`, `display-1/2/3`, `body-lg`). Use these tokens rather than arbitrary Tailwind color/size values to stay consistent with the rest of the site.

Fonts are loaded once via `next/font/google` in `app/layout.tsx` (Raleway → `--font-raleway`, Fraunces variable → `--font-fraunces`) and referenced through the `font-sans`/`font-serif` Tailwind families — don't add other font-loading mechanisms.

`.editorial-container` (in `app/globals.css`) is the shared max-width/gutter wrapper used for page content instead of ad hoc `max-w-*`/`mx-auto` combos.

### `.agents/skills/`

Bundled agent skill packs (GSAP, typography, UI polish, etc.) used to assist development in this repo. Not application code.
