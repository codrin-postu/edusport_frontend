# Portal login transition: report

Status: DONE_WITH_CONCERNS

Commits (branch feat/portal-login)
- 171e7e4 feat(portal): branded login frame with ribbon and brand font
- 5388dd2 feat(portal): entry transition from login to the app
- f539268 docs(plan): sportiv login reuses the branded frame and entry transition

Tests
- `npx playwright test -c playwright.e2e.config.ts tests/e2e/portal-login.spec.ts tests/e2e/portal-auth.spec.ts`: 30 passed (after Task 2; Task 1 run: 18 login specs passed).
- `npx tsc --noEmit`: clean. `npx eslint "src/app/(antrenor)" src/lib/portal tests/e2e/portal-login.spec.ts`: clean.

Screenshots (committed in Task 1)
- docs/portal/mockups/screens/login-transition/built-desktop.png (1280x800)
- docs/portal/mockups/screens/login-transition/built-phone.png (390x844)
- docs/portal/mockups/screens/login-transition/built-small.png (320x568)
Compared with s_AntrenorDesktopIntrare and s_AntrenorIntrare: panel, ribbon and brand match; the form card inner styling is the existing portal components (not the mock's League Spartan Google button etc.).

Deviations
- TDD: implementation for Task 1 was written before the first red run; the first run did fail on real layout bugs (margin collapse of the 330px form offset, fixed with padding-top) and test-locator issues.
- Task 3 target file was not in this worktree (it lives on another branch, commit 46166f2). I restored it from that commit, edited it, and committed it, so it enters this branch as a new file. "ice look" was in the Goal line, not a task. I also added the new e2e assertions to Task 5, and "mounts EntryReveal" to Task 6's shell layout.
- Entry transition also wired into ResetForm (it also signs in via window.location.assign("/")); the plan listed only login and invite.
- Phone ribbon: svg pinned right (240px wide) with a 900px lead-in off the left edge, so arcs stay circular but the dash timing along the very long path differs slightly from the mock.
- Navy panel and phone block use clip-path round (computed border-radius stays 0px).
- Font assertion: next/font renames the family, so the test matches /climate ?crisis/i and checks a loaded FontFace instead of the literal "Climate Crisis".
- Playwright default config is reducedMotion reduce; the transition tests emulate no-preference.
- Transition CSS lives in src/app/globals.css (keyframes, `.entry-*`, `.auth-*`).

Concerns
- EntryReveal reads the flag in an effect, so the app can paint one frame before the overlay appears.
- Task 3 file will conflict trivially on merge if the other branch also edits it.
