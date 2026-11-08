# Portal Redesign on the Canvas (index)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement these plans task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Both portals (coach `antrenor.`, student and parent `sportiv.`) look exactly like the Design canvas, every component included, while the public website keeps its look. Differences are standardised: one token theme file, documented variants, one shared portal UI folder.

**Decision:** user, 2026-11-09 (`docs/portal/DECISIONS.md`, "2026-11-09 open decisions answered", last two lines).

**Spec:** `docs/superpowers/specs/2026-11-09-portal-canvas-design.md` (mechanism, token list, component inventory, public-site guard).

## Documents

| Doc | Repo and branch | Tasks | Content |
|---|---|---|---|
| Spec `docs/superpowers/specs/2026-11-09-portal-canvas-design.md` | frontend, `feat/portal` | | the rule, token tables, inventory of the 34 + 8 + 9 components and the login |
| Plan A `docs/superpowers/plans/2026-11-09-portal-theme-kit.md` | frontend, `feat/portal` | 10 | public baseline and guards, component tokens, `src/styles/portal-theme.css`, root layout wiring, shared folder move, icons, kit, kit preview e2e |
| Plan B `docs/superpowers/plans/2026-11-09-coach-canvas-screens.md` | frontend, `feat/portal` | 15 | every coach screen on the kit, phone and desktop, mock extended, look sweep, click-through |
| Backend `docs/superpowers/plans/2026-11-09-coach-portal-additions.md` | backend, `docs/portal-redesign-plan` (worktree `edusport_backend/.claude/worktrees/plan-redesign`) | 9 | dated move and remove, calendar, next class, location, athlete detail, Istoric not-done rows, competitions with a source |
| Phase 7 frontend `2026-11-07-phase7-frontend-{index,1-shell-bff,2-screens}.md` (amended) | frontend, `feat/portal` | 14 | the sportiv app, now on the theme and kit, screens from `sportiv-canvas-current` |
| Phase 7 backend `2026-11-07-phase7-{index,1-access-accounts,2-sportiv-routes,3-competitions}.md` | backend, `feat/athletes` (unchanged) | 26 | sportiv access, routes, competitions (`CompetitionSource`) |

## Order

1. **In parallel:** the backend additions (Tasks 1 to 7 and 9; Task 8 waits, see 4) and plan A (Tasks 1 and 2 first and reviewed as batch A, then 3 to 10).
2. **Plan B** after plan A is merged. It runs against the mock; its Task 15 click-through needs the backend additions Tasks 1 to 7 merged.
3. **Phase 7:** backend 7-1, then 7-2 and 7-3 in parallel (as the phase 7 backend index says); then the phase 7 frontend (cut `feat/sportiv` from `feat/portal` with plans A and B merged).
4. **Backend additions Task 8** (real competition source) after 7-3 Task 5 is merged. Until then the coach Concursuri tab and the athlete page answer `{ available: false }` and show "Rezultatele nu sunt disponibile acum.".

Model and risk per task are in each plan's table. One e2e run at a time on this machine; full suites run once per plan in a background worktree (plans A Task 10 and B Task 15).

## Cross-plan contracts

- The backend additions' "HTTP contracts" bind plan B Task 1 (types copied verbatim into `src/lib/portal/api-types.ts`, routes added to `src/lib/portal/coach-routes.ts`).
- Plan A's kit and `portal-theme.css` bind plan B and phase 7 frontend: neither defines a colour, size or component look of its own; new differences become lines in `portal-theme.css`.
- Plan B Task 1 adds `weekdayShort`, `monthShort`, `longDay`, `shortWhen`, `dayMonthYear`, `phoneLinks` to `src/lib/portal/format.ts`; phase 7 frontend Task 3 reuses them.

## User answers 2026-11-09

The nine questions raised while planning, answered by the user; the spec and plans carry these values.

1. **Date block:** 52 x 52 with radius 6px on both portals, a named exception to the no-rounded rule, through `--portal-dateblock-w`, `--portal-dateblock-h`, `--portal-dateblock-radius` (the place block shares them).
2. **End block, status block band and session band:** 96px on both portals (`--portal-endblock-w`).
3. **Bottom menu:** rounded as on the canvas (18px, active item 13px), a named exception like the spinner. Shape checks in e2e allow exactly these exceptions: bottom menu, its active item, date and place blocks, spinner.
4. **Mută:** only into the coach's own groups (backend Task 2 refuses others with 403).
5. **Move or removal from a later date:** the child's row shows "până pe <d mmm>" (for example "până pe 12 noi") until that day; the backend exposes the date on the group member list (`CoachMember.leavesOn`, backend Task 4); plan B Tasks 9 and 10 show it.
6. **Concursuri "Toți sportivii":** every coach sees all club athletes; "Grupele mele" filters.
7. **Athlete page, Grupe row:** plain row with a chevron, no level block.
8. **Athlete page, Prezențe:** no "Istoric ›" link.
9. **Desktop sidebar:** as the canvas, Profil behind the account button at its foot.

## Open questions for the user

None.
