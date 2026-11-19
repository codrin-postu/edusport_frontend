# Ghid EduSport (staff wiki) — design

Approved mockup: https://claude.ai/artifact/WnjWE7WpSSrYKisKp422w9 (user, 2026-11-19: "looooks so good. let's do it").

## Why

Admins (and later coaches) must learn the system's flows without someone sitting next to them. A wiki with numbered steps, real screenshots and videos teaches each flow once. A second job: explain what the system does, why it is safe (payments especially), and why hosting should stay on Codrin's server.

## Goals

- A multi-page wiki at `/ghid` on the public site, one page per flow, grouped in a sidebar.
- Password gate: "Edusport2026", asked once per device.
- Each flow page: one line on what it is for, optional video, numbered steps with real screenshots and marks on what to click, "Atenție" only where a mistake costs.
- Concept pages: Despre sistem, Siguranță, Găzduire.
- Search across all pages.
- Romanian, short, professional. No filler.

## Non-goals

- Editing in the admin. Only Codrin and Claude edit, in code (user, 2026-11-19).
- Coach part (later, second phase; same structure).
- Narrated videos. Claude records silent screen walkthroughs; Codrin replaces or adds videos later.
- Personal data anywhere: screenshots come from the local test environment with invented names only.

## Anti-goals

- Wordy pages. A step longer than two lines is split or cut.
- Any claim (security, backups, prices, hosting) not checked against the code, the server or a dated source.
- Images reachable without the password.

## Approaches (user picked A)

- A. Pages as files in the website code (picked): fastest, versioned in git, only Codrin and Claude edit.
- B. Pages stored in the admin, editable in the browser: needed only if other admins write pages; much slower (the admin needs its own rich text editor).
- C. Separate wiki app on its own address: extra project to host, does not look like EduSport.

## Decided

- Place: public site host only (`edusport.codrin.space/ghid`), route group `src/app/(ghid)/ghid/`, own layout (no site header/footer). Portal hosts return 404 for `/ghid`.
- Look: portal theme tokens (navy, ice, League Spartan headings, Inter text, square corners), as in the mockup. Desktop: navy top bar with search, contents rail left, article right. Phone: "Cuprins" button opens the contents, search field next to it.
- Password: env `GHID_PASSWORD` (value "Edusport2026" on the server, never in git). `/ghid/intra` shows the password screen; a server action compares in constant time and sets an httpOnly, Secure, SameSite=Lax cookie holding HMAC-SHA256(password, "ghid-v1"), 180 days. Changing the password logs every device out. The middleware checks the cookie for every `/ghid/**` path except `/ghid/intra`, else redirects there with `next`. Wrong password: "Parolă greșită." Attempts limited per IP in memory (10 per 15 minutes).
- Hidden: `X-Robots-Tag: noindex, nofollow` on every `/ghid` response, `Disallow: /ghid` in robots, not in the sitemap.
- Content: TypeScript data, one module per page under `src/content/ghid/`, typed blocks: paragraph, list, sub-heading, steps (text + optional shot), warn ("Atenție"), video, links. Inline markup: `**bold**` only. A registry lists sections and page order (sidebar, previous/next).
- Images: JPG files in `content/ghid/img/` at the repo root (not `public/`), served by a route handler `/ghid/img/[...path]` behind the same cookie; copied into the production image.
- Shots: `scripts/ghid/shots.mjs` (Playwright) logs into the local admin, runs each shot's steps, saves the JPG and computes the marks from the selectors to highlight (boxes in percent, written to a JSON next to the image). Pages reference a shot by id; marks come from the JSON.
- Videos: silent recordings by the same script (Playwright video), uploaded by Codrin to the Strapi Media library; a video block holds the URL. A page without a video shows no video block.
- Search: index built on the server from all pages (title, section, plain text); client filter, case and diacritics insensitive, every word must match; results show title and section. "/" focuses the field.

## Pages (admin part)

- Început: Despre sistem; Siguranță; Primii pași (sign-in, new device code, menu, phone use).
- Club: Înscrieri (receive, message, confirm, move season or school, archive, export, select several on the phone); Sportivi (record, update data, documents, mark as member, Parcurs and badges); Grupe și program (groups, calendar and series, breaks, announcements); Prezență; Plăți (record a payment, cancel a payment, prices, accounting views); Tabele (saved tables, filters, export).
- Administrare: Echipa (add an admin, roles, portal access for coaches); Site (pages, articles, images in Media, competitions); Date personale (export, anonymize, what is kept); Găzduire.
- Membership: a student becomes a member when an admin ticks it; payments are recorded separately (user, 2026-11-19). The cancelled-payment display is still open; the page describes current behaviour (cancelled stays in the list, struck through) and changes if the user decides otherwise.

## Concept page rules

- Siguranță and the payment safety section list only what the code and the server do today, each claim checked: roles per area, admin sign-in, sessions, history of changes, payments cancelled not deleted, who recorded each payment, HTTPS, nightly backups, error tracking, personal data handling.
- Găzduire: two options. Stay on Codrin's server, 6 euro per month, rounded to 30 lei, with what that includes (only what runs today: backups, monitoring with a daily report, error tracking, updates, one responsible person). Or move to a separate host: what it takes (provider account, server, setup, domain, backups, updates, monitoring, who answers at night) and its cost, from the providers' public price pages, dated. Recommendation: stay, with the reasons above.

## Builder check answers (decided by Claude, low impact)

- Scope: one plan. Platform first (gate, layout, registry, search, image route, shots script, e2e), then content section by section: Început and Plăți first, then the rest in sidebar order. Each content task ships its pages with their shots.
- Facts for Siguranță and Găzduire: Claude checks them on the server (`ssh edusport-vm`: backup cron and files, monitoring agent, GlitchTip), in the backend code (roles, sign-in, history, payments) and on providers' public price pages (dated). A claim that cannot be checked is left out, never written as fact.
- Shots environment: the existing local environment (Strapi on 1340 with invented test data, login refreshed by the existing helper that writes a Playwright storage state). The shots script takes the storage state path and base URL as arguments; it is a manual tool, not run in CI.
- Password env: CI and e2e use a dummy `GHID_PASSWORD`. Missing variable fails closed: the gate refuses every password. The real value goes into the frontend's production env on the server at release, with the user's go-ahead.
- Videos: Strapi Media URLs are public but unguessable and show only invented test data; accepted. Media host must be allowed by the page's CSP and media rules if any apply.
- Rate limit key: `X-Real-IP` (nginx sets it from `$remote_addr`; one frontend container `edusport-frontend`), so an in-memory limiter is correct.
- Images: JPG, 1280 px wide, quality about 80 (about 100 KB each). Plain git, no LFS; budget about 10 MB for the admin part.

## Left to the builder

- Exact component split, file names inside the decided folders, search ranking among matches.
- Which screens each flow needs (at most one shot per step; text-only steps are fine).
- Text drafting (Fable allowed), then trimmed to the copy rules: no em dash, no middle dot, straight quotes, terse.

## Testing

- Playwright e2e (behaviour only): `/ghid` redirects to the password screen; a wrong password stays with "Parolă greșită."; the right password opens the wiki and survives a reload; an image URL without the cookie is refused; `/ghid` responses carry noindex; search finds a page by a word without diacritics; previous/next follow the registry; portal hosts return 404 for `/ghid`.
- Token check, lint, type check as in CI.
