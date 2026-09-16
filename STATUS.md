# Status - edusport_frontend

Last reviewed: 2026-08-30. Ecosystem map: `../ECOSYSTEM.md`.
Shipping history: `CHANGELOG.md`.

## Where it runs

| | |
| --- | --- |
| Production | https://edusport.codrin.space (VM 178.105.192.111, container `edusport-frontend` on 127.0.0.1:3000) |
| Deploy | GitHub Actions > Deploy frontend > Run workflow > pick a ref. Manual only. |
| Deployed on the VM | `main` @ `bda8be3`, released 2026-08-30 via Actions. Level with `origin/main`. |
| Branch in use | `main`. `staging` was merged in on 2026-08-30 and is no longer the working branch. |
| Working tree | clean |

## What works

- Full public site: home, cursuri, program (calendar), despre-noi (echipa,
  sportivi), realizari, noutati, inscrieri, contact, parteneri, voluntariat,
  protectia datelor, 404.
- Content comes from Strapi through `fetchStrapi` with 30 minute ISR and an
  on-demand revalidate endpoint.
- Retro design system is site-wide: shared color tokens, type scale and
  utilities in `globals.css`.
- Calendar renders backend occurrences (hourly, recurring, exceptions) in month
  and week views with tooltips and a mobile layout.
- Registration posts to the in-house backend; forms and their custom questions
  are rendered from the CMS config.
- Sportsperson and realizari pages show competition results pulled from
  skate-results via the Strapi proxy.
- `track()` helper instruments events throughout the site.
- Sentry SDK present for GlitchTip, inert until a DSN is set.
- CI: lint, typecheck and gitleaks as blocking jobs, npm audit informational.

## What is left

### Release and infrastructure
- [x] **Analytics fixed** 2026-08-30. Umami had recorded zero events because the
      deployed image predated `3053d8c`, which passes the `NEXT_PUBLIC_UMAMI_*`
      vars as build args (they must be inlined during `next build`). The live
      bundle now loads `script.js`; a synthetic pageview to
      `/__deploy-verification` confirmed the pipeline end to end. That one event
      is test traffic, not a visitor.
- [x] Umami website record repointed from `scoaladepatinaj.com` to
      `edusport.codrin.space`.
- [x] `staging` merged into `main` and deployed 2026-08-30. Forms, skate
      results, calendar occurrences and Sentry are all in production.
- [ ] Domain cutover. `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_STRAPI_URL` in
      `DEPLOY.md` point at `scoaladepatinaj.com` and `cms.scoaladepatinaj.com`,
      which still serve the old WordPress.com site. Live stack is on
      `*.codrin.space`.
- [ ] Set `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` on the VM once the GlitchTip
      project exists, so errors actually arrive.
- [ ] Optional: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` to upload
      source maps.

### Landing v2
`src/app/landing-v2` holds no `page.tsx`; it is a block library that
`src/app/page.tsx` imports. The redesign is already the live home page, there is
no separate `/landing-v2` route (it correctly 404s).
- [ ] Wordmark WebGL hover-morph is desktop only (`hidden md:block`). To ship on
      mobile, attach it to the mobile wordmark and auto-trigger the sweep on
      scroll into view.
- [ ] Warm red and yellow accents exploration (`#F2291A`, `#FCD129`) is on hold.

### Known open items from the older fix list (`PROGRESS.md`)
- [ ] Landing hero in mobile landscape is crowded, and the wave divider pins to
      the bottom on short screens. Both need a hero-height layout decision.
- [ ] Mobile scroll nav shows a fixed wavy band; confirm whether it is the
      MenuPanel tube lines.
- [ ] Empty area under the calendar before the Scoala de patinaj block needs a
      design decision.

### Content and data
- [ ] Featured sportsperson stays empty until at least one athlete has a linked
      competition. Data, not a bug.
- [ ] **No athlete is linked to skate-results yet.** All 60 sportspeople in
      production have an empty `skateResultsSlug`, so the results section
      renders nothing anywhere. Link them in the admin to make the feature
      visible.
- [ ] Competition ordering on the frontend was reported as not showing the most
      recent first. Re-verify once athletes are linked.

## Gotchas worth remembering

- WebGL does not render in headless Chrome, so the wordmark morph has to be
  checked visually by a human.
- `position: fixed` inside the hero container resolves against the hero's
  transformed ancestor. Panels and buttons must be portalled to `document.body`.
- Code exploration in this repo goes through the dual-graph or jcodemunch MCP,
  per the project policy in `CLAUDE.md`.
