# Resume point: CMS admin registration flow (saved 2026-10-06)

Design phase only. No app code changed in `edusport_backend` or `edusport_frontend`
for this flow; everything lives in `docs/portal/` (decisions, mockups, generators).
Every decision is logged in `docs/portal/DECISIONS.md` (entries dated 2026-10-03 .. 2026-10-06).

## Where to continue
1. Answer the open questions below (show each in the companion first; user decides in companion).
2. Fold the answers into the clickable prototype `mockups/screens/prototype-registrations-v5.html`.
3. Design the remaining screens, one at a time, in the companion:
   - Documente page (final pass: search, season filter, sort, single + ZIP download,
     "Formulare goale de printat" with blank templates).
   - Școala de patinaj: groups list with totals per group and for the whole school,
     assigning children to groups ("Fără grupă" filter).
   - Admin Prezență per day, one column per hour; an extra hour the same day uses
     ANOTHER abonament box; "Adaugă abonament" from attendance when paid at the rink.
4. Then write the spec + implementation plan (superpowers writing-plans) and implement
   with agents (backend fields + registration number, form config, PDFs, Brevo e-mail,
   Sheet columns, Înscrieri panel, members tables, Select/Radio admin components).

## Open questions (in this order)
1. DECIDED 2026-10-06: per-field "Actualizează" ticks in the comparison, ticked by default for every
   differing field except name and birth date (never auto). If the table is never opened, the default
   ticks apply (newer phone / e-mail / contact person written to the record, logged in Istoric).
2-6, 8, 9. DECIDED 2026-10-06 (see DECISIONS.md, open-questions-v2): confirm window A, no e-mail at
   confirmation, button "Confirmă înscrierea", any admin adds abonaments, e-mail required for "complete",
   admin Select/Radio rewrite with the flow, column "Nume sportiv".
7. DECIDED: Școala abonaments cash/POS at the ice rink (rink settles with club), membership fee cash, other lessons mostly cash (transfer possible). Online later.

Now designing: Documente page, then Școala groups, then admin Prezență per hour.

## Decided in this session (short; full text in DECISIONS.md)
- Form: mirrors her Apps Script form, 3 steps "Date înscriere / Abonament / Finalizare înscriere";
  one field per row; site form components; prices + fee + season + period from the CMS
  (Cursuri / Prețuri, Setări site); upsell computed from prices; next-month weekends box;
  laptop/desktop line dropped; "Calitatea" options as in her form; her help text on "Nivel".
- Registration number `<season start year>-<4-digit seq>`, server-assigned.
- Documents: Acord (approved design) + Cerere de adeziune (only if member = Da), both with blank
  print templates; header CLUBUL SPORTIV / EDUSPORT + Sezonul + Nr. (no seal for now); association
  details in a 4-column footer (Contact as aligned label/value, short links); typos fixed except
  "Asociatia Clubul Sportiv EduSport"; no CNP/address collected (hand-written on paper);
  period field in Setări site (now octombrie 2026 - mai 2027).
- After submit: success screen + e-mail via Brevo free (design E1, letter style, 3 steps,
  full-width buttons on mobile, "Documentele vor fi semnate la prima ședință de curs");
  e-mails are queued jobs with retry; WhatsApp = channel link/QR only.
- Înscrieri panel: tabs Date | Abonament | Documente | Istoric; only Date editable (inline
  "Editează"); saving rebuilds and REPLACES the PDF; no automatic e-mail on edits; manual
  "Retrimite e-mailul" with confirmation popup; history entries ("Înscriere înregistrată").
- Sheet: one tab per season, each tab only its own season's columns; consents as two Da/Nu columns;
  "Membru A.C.S." label kept.
- Members: one private members list for everyone + linked public profile (existing `sportsperson`,
  off by default); "Date incomplete" for existing profiles; matching by normalized name +
  birth date + phone + e-mail, never auto-merge; no prices/fee in confirm window; abonament from
  the form is only the parent's INTENT; real abonament added when bought.
- Înscrieri list: no birth date under the name, "Vârstă" column, "Sportiv existent" line under the
  name (no details), all rows same fixed height; filter "Sportiv existent: Da / Nu".
- Panel card "Sportiv existent · <last group season>" with "Compară" expanding an in-place table
  (differences only highlighted, no counts, no age); group optional at confirmation;
  wording "Sportiv existent / Sportiv nou".

## Companion (visual brainstorming) state
- Last server content dir: `edusport_backend/.superpowers/brainstorm/67720-1791189269/content/`
  (it stops after idle; files there are disposable copies).
- Restart: `bash ~/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills/brainstorming/scripts/start-server.sh --project-dir /Users/codrin/Documents/Programming/edusport_backend --open`
  then copy the screen to show into the NEW content dir it prints. The companion shows the most
  recently modified file, so copy (or `touch`) the one to discuss last.
- Light mode: every screen starts with a `<style>` that forces the companion's light variables
  (the user's system is in dark mode). Generators already include it.
- All screens are saved in `docs/portal/mockups/screens/`. Most relevant, in flow order:
  - Form: `form-3steps-v2` (decided), `form-steps-v4` (prices + upsell), `decisions-1-5`.
  - E-mail: `email-e-v2` (E1 decided).
  - Documents: `document-v4`, `adeziune-v3`, `documents-header-v1`, `legal-block-v1`, `legal-footer-v2`.
  - After submit / Sheet: `flow-after-submit-v3`, `flow-doc-sheet-v3`.
  - Panel: `registration-tabs-v4`, `edit-registration-v1`.
  - Members / matching: `members-v1`, `registrations-list-v1`, `row-height-v2` (E),
    `quick-check-v1`, `search-sportiv-v1`, `pending-decisions-v2` (open questions 2-7).
  - **Clickable prototype (latest): `prototype-registrations-v5.html`** (full HTML, opens directly
    in a browser): Înscrieri list, panel tabs, edit, resend popup, Compară, confirm with
    search ("Dumit", "Popescu"), Sportivi list with filters/sort, member record, add abonament.

## Generators
- `docs/portal/mockups/gen_*.py` + `proto_js.js`. Run from that folder; they exec each other
  (e.g. `gen_proto.py` -> gen_members -> gen_confirm -> gen_tabs -> gen_edit -> gen_flow2 -> gen_cms)
  and write throwaway files to `mockups/throw/`. Example: `python3 gen_proto.py screens/prototype-registrations-v5.html`.
- `gen_adeziune.py` / `gen_flow3.py` read `screens/admin-cms-v2.html` (Acord markup) by absolute path.
- Prototype logic lives in `proto_js.js` (state object `st`, filters `F`, custom dropdown `dd()`).

## Needed from the club (not decisions)
- Brevo account and access to the scoaladepatinaj.com DNS at WordPress.com (SPF/DKIM).
- E-mail sign-off wording and step titles if they want their own.
- Original association seal file (only if the seal is added later).

## Paused separately
Coach + parent portal flows: see "Status snapshot (2026-10-03)" at the top of DECISIONS.md.
