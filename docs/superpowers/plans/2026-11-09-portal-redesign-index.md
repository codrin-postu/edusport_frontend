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

## Open questions for the user

Each has a default the plans use until answered, chosen so the answer is one token value or one small change.

1. **Date block shape.** Coach canvas: 56 x 52, square corners. Student canvas: 52 x 52, radius 6px. Standardise on one? Default in the plans: coach (56 x 52, square), through `--portal-dateblock-w` and `--portal-dateblock-radius`.
2. **End block and session band width.** Coach end block 96px, student session band 92px. One width for both? Default: 96px (`--portal-endblock-w`).
3. **Rounded bottom menu.** The canvas floating menu uses radius 18px and its active item 13px; the standing rule says no rounded shapes (approved for the sportiv app in phase 7, 2026-11-07). Keep the canvas radii for both portals? Default: yes, as the canvas (`--portal-nav-radius`, `--portal-nav-item-radius`).
4. **Mută to which groups.** May a coach move a child only into another of his own groups, or into any active group of the season? Default: own groups only (backend Task 2 refuses others with 403).
5. **Future-dated move or removal in the group list.** After "Mută" or "Scoate" from a later date, the child stays in the group until that day. Should the row show that (for example "până pe 12 noi")? Default: the row stays as it is until the date, no note.
6. **"Toți sportivii" in Concursuri.** Every coach sees the results of every club athlete (results are public on skate-results), or only of his groups? Default: every club athlete, with "Grupele mele" as the filter, as the canvas shows.
7. **Athlete page, Grupe row end block.** The canvas shows a navy end block "Bronze" on the group row. What should it say (level, section, nothing)? No data field holds it. Default: plain row with a chevron, no end block.
8. **Athlete page, "Istoric ›" link on Prezențe.** The canvas has the link but no coach screen lists one athlete's presences. Add such a screen, link to the admin, or drop the link? Default: no link.
9. **Desktop sidebar without Profil.** The canvas desktop sidebar lists Azi, Grupe, Concursuri, Istoric and puts Profil behind the account button at its foot; the phone menu lists all five. Keep it so? Default: as the canvas.
