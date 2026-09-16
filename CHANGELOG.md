# Changelog

Public site for Scoala de Patinaj EduSport. Grouped by what reached production.
Production deploys are manual (Actions > Deploy frontend > pick a ref).

## Unreleased (on `staging`, 11 commits ahead of `main`)

Everything below is committed and pushed to `staging` but has not been merged to
`main` or deployed. Last production deploy: 2026-08-24 from `main` (`3053d8c`).

### Added
- Skate results on sportsperson and realizari pages, read through the Strapi
  `/skate/*` proxy (`2cad698`).
- Public forms rendered from the CMS config, including custom questions and
  extra answers submitted alongside the fixed fields (`2be28f5`, `8cb4ae5`).
- Registration submits to the in-house backend instead of the external form
  (`f1dff4f`).
- Calendar consumes the backend occurrence model, with hourly slots, tooltips
  and a mobile layout (`c1229cf`, `d06079c`).
- Optional Sentry SDK for GlitchTip, inert without a DSN (`df0a215`).

### Changed
- `fetchStrapi` default revalidate lowered from 60 to 30 minutes (`6b728d5`).
- Program calendar window widened to 2 months before and 3 months after the
  season (`a2c68ab`).

### Fixed
- Responsive landing and nav fixes, cream page surface behind every page
  (`ff66422`).
- Content and theme audit cleanups across pages (`5c6d654`).

## 2026-08-24 (deployed)

### Added
- Umami analytics wired through build args (`NEXT_PUBLIC_UMAMI_*`) plus a
  `track()` helper and instrumented events (`3053d8c`, `fdcdf1a`).
- Parteneri page copy driven by Strapi (`c970eda`).

### Changed
- CI split into separate check and deploy jobs, deploy gated and phased,
  ssh-action pinned, gitleaks working-tree scan added (`31b4796`, `93fa678`,
  `11cd0b2`).
- Closed-registration season text now comes from site-settings; dead
  `facebookUrl2` dropped (`4940c1b`).

### Fixed
- Type and lint errors that were breaking the production build (`98a74b4`,
  `2e04597`).

## 2026-08-23

### Added
- Voluntariat and parteneri pages (`da43860`).
- Weekly grid calendar view on top of a FullCalendar refactor (`fa0e66b`).
- SEO pass: centralized site URL, OG image, manifest, AI-crawler rules,
  structured data (`32b4997`).

### Changed
- Retro redesign for the sportivi listing, spotlight card and profile page
  (`66974a1`).
- Retro type scale and component polish across pages (`467fc62`).
- Parteneri, voluntariat and sportsperson bio wired to Strapi (`965d412`).

## 2026-08-09

### Changed
- Retro design became the site-wide theme and the landing page became the home
  page (`ff08f14`), with shared retro tokens and utilities (`646af98`,
  `da51d75`).

## 2026-05

### Added
- Sportivi listing and profile pages, shared `Pagination` component
  (`14bd3a8`, `03523b1`).
- Article gallery and video fields plus an admin preview route (`af880ac`),
  reusable `GalleryCarousel` with a mobile swipe lightbox (`e64b7d3`).
- Inscrieri flow mirroring the Google Form fields with a slanted-pill stepper
  (`c386136`), realizari numeric placements with an image lightbox (`ec1ec5e`),
  themed 404 (`a233210`).
- Unified `Select` component (`1353766`).
- Production hand-off: Dockerfile, deploy scripts, docs, env template, manual
  GitHub Actions deploy with a branch selector (`feb551c`, `62b7744`,
  `b8511dd`).

### Changed
- Homepage blocks split into server shells plus client animation islands
  (`0f759fc`); Strapi populate queries narrowed with on-demand revalidate
  (`037272d`).

## 2026-04-16

### Added
- First full build of the site: homepage blocks, cursuri section, calendar and
  FullCalendar components, contact, despre-noi, noutati, inscrieri and
  protectia-datelor pages, header, footer, shared UI, Strapi data layer and SEO
  utilities.
- Crystal bouncing loader replacing the original skate loader (`609b066`).

## 2026-03

### Added
- Inscrieri stepper animations and field stagger.
- Homepage scroll choreography: sticky About Us panels, `SquareTransition`
  diagonal wipe, LatestArticle stagger reveals.
- Footer WhatsApp column with responsive QR.

## 2025-08 to 2025-09

### Added
- Project scaffold: Create Next App, Docker, eslint, shadcn navigation, header
  and footer, placeholder pages, first courses page.
