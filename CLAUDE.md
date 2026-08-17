# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A marketing site redesign for **Move Social**, a Brazilian socio-environmental impact consultancy. All copy is in Portuguese (pt-BR). Routes: `/` (home), `/teoria-da-mudanca`, `/publicacoes` + `/publicacoes/[slug]` (blog), `/portfolio` + `/portfolio/[slug]` (case studies), `/contato`, plus the Payload admin at `/admin`. Built with Next.js App Router, TypeScript, Tailwind CSS, and **Payload CMS 3 on MongoDB**.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`). `node_modules` was linked by pnpm 11 — running `pnpm add` with an older pnpm fails with `ERR_PNPM_UNEXPECTED_STORE`; use the version in `packageManager`.

```
pnpm dev                 # start dev server (site + /admin)
pnpm build               # generate import map, then next build
pnpm start               # serve production build
pnpm lint                # next lint
pnpm seed                # RESET + reload all CMS content from data/site.ts
pnpm generate:types      # regenerate payload-types.ts
pnpm generate:importmap  # regenerate app/(payload)/admin/importMap.js
```

`.env` needs `DATABASE_URL` (MongoDB Atlas connection string, **with a database name** before the `?`) and `PAYLOAD_SECRET`. There is no test suite in this project.

## Architecture

### Content lives in Payload, not in `data/` and not in components

Copy, images, projects, team, partners and publications are edited in the admin at `/admin`. The model lives in `collections/` (Projects, Services, Publications, PublicationCategories, TeamMembers, Partners, Media, Users) and `globals/` (Home, TheoryOfChange, ContactPage, SiteSettings).

**When asked to change copy, headings, stats, or images, that's a CMS edit — not a code edit.** Change code only when the *shape* of the content changes (a new field, a new section). Components stay presentational: they receive plain props and never import from Payload.

- `lib/content.ts` is the only place that reads the CMS. Each function returns the exact shape the components already consumed, so the components never learn Payload exists. It filters to `_status: 'published'` and wraps everything in React `cache()` to dedupe per request.
- `lib/resolveImage.ts` collapses the two-track `imageField()` (Media upload **or** external URL) into `{ src, alt }`. **Upload always wins over the external URL** — that's how a Unsplash placeholder gets replaced with real photography without touching code.
- Display numbers (`01`, `02`…) are derived from array position via `displayNumber()`. Never add a manual number field; there would be nothing keeping it in sync.
- Pages are server components with `export const revalidate = 60`.

`data/site.ts` and `data/images.ts` are **no longer read by the site** — they survive only as the input to `scripts/seed.ts`, which performs the one-time load. Re-running `pnpm seed` wipes the content collections and reloads them, so it overwrites anything the client edited in the admin.

SEO comes from `@payloadcms/plugin-seo`, configured in `payload.config.ts` with `tabbedUI`, so every project, publication and page global gets an **SEO** tab. `lib/seo.ts` turns that `meta` group into Next `Metadata`: the CMS field always wins, and the fallback is the page's own content — a document published without touching the SEO tab still ships a correct title, description and OG image. Don't hand-write `metadata` on a route that has a CMS record behind it; use `metadataFromSeo()`.

Publications come in three types (`article`, `download`, `external`), and the type only decides the **action** at the end of the page. Every publication — including external links — has its own page at `/publicacoes/[slug]`, because the rich text field is available to all types and carries the copy that introduces the material. Cards always link to that page, never straight out.

Tones and brand icons are closed `select` fields (`fields/toneField.ts`, `fields/iconField.ts`), never free text: each value maps to classes already written in a component, so an unlisted value would render an unstyled card.

`next.config.ts` allows remote images from `images.unsplash.com` and local paths (Payload serves uploads from `/api/media/file/**`). Uploaded files land in `/media`, which is gitignored.

### Animation stack: GSAP+Lenis for scroll choreography, Framer Motion for simple reveals

- `SmoothScroll` (mounted once, in `app/(frontend)/layout.tsx`) owns the single global `Lenis` instance and pipes its raf loop into `gsap.ticker`, calling `ScrollTrigger.update` on scroll. Don't instantiate another `Lenis` elsewhere — everything scroll-driven should hook into this one instance via `ScrollTrigger`.
- `PortfolioStack` (home) stacks its cards with `position: sticky`, so no ancestor may set `overflow-hidden`.
- `/portfolio` and `/publicacoes` are server components that fetch everything, then hand a plain array to a small client component (`PortfolioBrowser`, `PublicationsBrowser`) that filters in memory. The collections are in the low hundreds of items — filtering client-side keeps the pages static and makes every filter change instant, with no round trip. Revisit if the acervo grows past a few thousand.
- `Reveal` (Framer Motion `whileInView`, `once: true`) is the standard fade/slide-up-on-scroll wrapper used for simple content reveals. `MediaFrame` wraps `next/image` in a `Reveal` with a consistent aspect ratio and hover zoom — use it for any content image instead of a bare `Image`.
- Reduced motion is handled globally via a `prefers-reduced-motion` media query in `app/(frontend)/globals.css`, not per-component.

### Design tokens

Custom Tailwind theme in `tailwind.config.ts` under the `move` namespace, holding the brand's full chromatic system — base (`move-black`, `move-offwhite`/`move-gray`), principais (`move-purple` = Açaí, `move-yellow` = Ipê) and apoio (`move-periwinkle` = Lavanda, `move-coral` = Goiaba, `move-sand` = Areia, `move-light` = Luz, `move-mint` = Capim, `move-green` = Mata) — plus a custom type scale (`eyebrow`, `display-1/2/3`, `body-lg`). Use these tokens rather than arbitrary Tailwind values.

**Don't pair a background token with a hand-picked text color.** The brand guide fixes which typography color each background takes, and that table lives in [`lib/palette.ts`](lib/palette.ts) as `SURFACES` — each entry carries its own `text`, `muted`, `border` and `chip` classes. Reach for `surfaceForEcosystem()` / `surfaceByName()`; the class strings are spelled out there because Tailwind can't see names built at runtime. See [`docs/brand-guide-cores.md`](docs/brand-guide-cores.md) for the source table.

Two traps worth naming: `move-offwhite`/`move-gray` is Off White (`#F2F2F2`) and is **not** `move-light` (Luz, `#FBFFB1`) — Luz is a small graphic accent and never a component background, which is why it has no entry in `SURFACES`. And `move-black` is for typography only, never a dominant background.

Fonts are loaded once via `next/font/google` in `app/(frontend)/layout.tsx` (Raleway → `--font-raleway`, Fraunces variable → `--font-fraunces`). Raleway (`font-sans`) is the only typeface actually used on the site; Fraunces (`font-serif`) is still loaded but no longer referenced anywhere — don't reintroduce `font-serif` on headings without checking with the client first, and don't add other font-loading mechanisms.

`.editorial-container` (in `app/(frontend)/globals.css`) is the shared max-width/gutter wrapper used for page content instead of ad hoc `max-w-*`/`mx-auto` combos.

### `.agents/skills/`

Bundled agent skill packs (GSAP, typography, UI polish, etc.) used to assist development in this repo. Not application code.
