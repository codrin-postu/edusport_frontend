# Phase 3a reference screenshots

Captured with Playwright (Chromium, 1440x900, light mode) directly from
`prototype-registrations-v5.html` (self-contained; the JS matching
`../proto_js.js` is inlined in the HTML, driven through the page's own
`st`/`P` objects). All states below are real, interactive states of v5 —
none are mocked up separately.

## 1. Înscrieri list

- `proto-list-full.png` — full page, default state (reg r1 "Maria Dumitrescu" selected in the right panel).
- `proto-list-table-crop.png` — crop of the list table: columns (Nr., Trimis la, Nume sportiv, Vârstă, Status, Completat de, Membru A.C.S.), and the "Sportiv existent" line shown under Maria Dumitrescu's name (blue icon + text, no extra detail).
- `proto-list-searchbar-crop.png` — crop of the toolbar: search input "Caută după nr. înscriere, nume, părinte, email sau telefon..." and the season selector "Sezon 2026-2027 (activ)". (v5 has no other filter row on this screen — no status/"în club" filter chips.)

## 2. Registration panel, per tab

Matched registration (r1, Maria Dumitrescu, match level "Sigur"):
- `proto-panel-matched-date.png` / `-full.png` — Date tab, read mode, with the "Sportiv existent" match card collapsed above the tabs.
- `proto-panel-matched-abon.png` / `-full.png` — Abonament tab (membership choice, desired subscription, source, GDPR/Regulament consent).
- `proto-panel-matched-docs.png` / `-full.png` — Documente tab (Acord + Cerere de adeziune doc rows, e-mail log, "Retrimite e-mailul").
- `proto-panel-matched-ist.png` / `-full.png` — Istoric tab (single "Înscriere înregistrată" entry).

Unmatched registration (r2, Andrei Popescu, no match):
- `proto-panel-unmatched-date.png` / `-full.png` — Date tab, no match card shown (nothing to compare).
- `proto-panel-unmatched-abon.png` / `-full.png` — Abonament tab.
- `proto-panel-unmatched-docs.png` / `-full.png` — Documente tab (1 document only — no Cerere de adeziune, since `member:'Nu'`).
- `proto-panel-unmatched-ist.png` / `-full.png` — Istoric tab.

## 3. "Sportiv existent" match card

- `proto-matchcard-collapsed.png` — collapsed card on r1: avatar, "Sportiv existent", last known group, "Compară" link.
- `proto-matchcard-compare-open.png` / `-full.png` — after clicking "Compară": inline diff table (Nume, Data nașterii, Părinte, Telefon, E-mail — matching registration vs. club record) plus "Deschide fișa completă" link. No update checkboxes here (those only appear in the confirm-window compare, see below).

## 4. Confirm window ("Confirmă înscrierea")

- `proto-confirm-existing-preselected.png` / `-full.png` — opened on r1 (match "Sigur"): "Sportiv existent" choice card preselected automatically, "Sportiv nou" card available but not selected.
- `proto-confirm-compare-open.png` / `-full.png` — "Compară și actualizează" expanded: diff table with a checked "Actualizează" tick on the one differing field (Telefon: "0722 111 22" -> "0722 111 222").
- `proto-confirm-search-dumit.png` — "Caută alt sportiv" opened, typed "Dumit": live-filtered result list (Maria Dumitrescu, Andrei Dumitrescu, Ioana Dumitru) with the matched substring highlighted.
- `proto-confirm-search-popescu.png` — same search box, typed "Popescu": filtered result list.
- `proto-confirm-new-athlete.png` / `-full.png` — opened on r2 (no match): "Sportiv nou" shown directly ("Se creează o fișă nouă: Andrei Popescu, 02.09.2016"), with a "Caută un sportiv existent" link instead of choice cards.
- `proto-confirm-group-picker-open.png` — on the r2 (Sportiv nou) modal: the "Grupa" dropdown open, showing the group list with the suggested group ("Primii Pași", from `last:'Nu a participat'`) checked.

## 5. Toast after confirming

- `proto-toast-confirmed-full.png` — full page right after confirming r2: bottom-right toast "Andrei Popescu a fost confirmată." with the action link "Deschide fișa sportivului".
- `proto-toast-crop.png` — crop of the toast element alone.

## 6. Panel of an already-confirmed registration

- `proto-panel-confirmed.png` / `-full.png` — r2's panel right after confirming: status badge "CONFIRMAT", Istoric tab auto-selected showing "Confirmat. Sportiv nou creat; grupa Primii Pași.", and the footer button is "Deschide fișa sportivului" (the "Confirmă înscrierea" button is gone).

---

## Conflict pairs (old mockup vs. prototype-registrations-v5)

**a) "Același sportiv / Alt sportiv" vs "Sportiv existent / Sportiv nou"**
- Old (`pending-decisions-v2.html`, `search-sportiv-v1.html`): choice labelled **"Același sportiv"** / **"Alt sportiv"** (e.g. "Același sportiv: confirmă înscrierea").
- v5: choice cards are labelled **"Sportiv existent"** ("Înscrierea se adaugă la această fișă") / **"Sportiv nou"** ("Se creează o fișă nouă: ..."). See `proto-confirm-existing-preselected.png`.

**b) "Confirmă și adaugă în club" vs "Confirmă înscrierea"**
- Old (`registration-tabs-v4.html`, `edit-registration-v1.html`): primary button text is **"Confirmă și adaugă în club"**.
- v5: primary button (both on the panel footer and inside the modal) reads **"Confirmă înscrierea"**. See `proto-panel-matched-date.png` (footer) and `proto-confirm-existing-preselected.png` (modal footer).

**c) quick-check-v1 "Primii Pași în 2025-2026 · 12 ani · 1 diferență" / "Anul trecut" row vs v5 card**
- Old (`quick-check-v1.html`): compact compare table includes a dedicated **"Anul trecut"** row ("Primii Pași 2025-2026" vs "a răspuns: Începători") and a header line "Primii Pași în 2025-2026 · 12 ani · 1 diferență".
- v5: the match-card compare table (`cmpTable`) only compares Nume, Data nașterii, Părinte, Telefon, E-mail — **no "Anul trecut" / previous-season row exists**, and no "N diferențe" count header. See `proto-matchcard-compare-open.png` and `proto-confirm-compare-open.png`.

**d) match-words-v4 option A details after the label vs v5 list line**
- Old (`match-words-v4.html`, option A): list line reads **"Sportiv existent · Maria Dumitrescu, Primii Pași 2025-2026"** (name + last group shown inline).
- v5: the list line is just **"Sportiv existent"** with no name/group detail appended (the detail only appears later, in the panel's match card). See `proto-list-table-crop.png`.

**e) registrations-list-v1 "Posibil existent" + filter "În club: Existent / Posibil / Nou" vs v5**
- Old (`registrations-list-v1.html`): distinguishes **"Sportiv existent"** (blue, certain) from **"Posibil existent"** (orange, uncertain), plus a dedicated filter **"În club": Existent / Posibil / Nou**.
- v5: match levels still exist in data (`match.lvl: 'Sigur'|'Probabil'`), but the list always shows the same **"Sportiv existent"** label regardless of level, and the confidence only shows up as a badge ("Sigur"/"Probabil" via `.lvl`, not actually rendered in the list row). There is **no "În club" filter in v5** — not in v5 (the Înscrieri toolbar only has search + season selector, confirmed in `proto-list-searchbar-crop.png`).

**f) "Nume copil" vs "Nume sportiv"**
- Old (`registrations-list-v1.html`, `match-words-v4.html`): column header is **"Nume copil"**.
- v5: column header is **"Nume sportiv"**. See `proto-list-table-crop.png`.

**g) members-v1 confirm section vs v5 confirm window**
- Old (`members-v1.html`): single compact modal with an inline match banner (`<span class="lvl s">Sigur</span> Există deja în club: ...`) and two **radio buttons** ("Folosește fișa existentă" / "Creează sportiv nou"), diff table embedded directly below.
- v5: uses two **clickable choice cards** ("Sportiv existent" / "Sportiv nou", see item a) instead of radios, and the inline "Sigur/Probabil" badge text is not shown in the confirm window at all (only implicitly via which card is preselected). See `proto-confirm-existing-preselected.png`.

**h) members-v1 "e-mail optional for date complete" vs v5**
- Old (`members-v1.html`): explicitly labels the field **"E-mail (opțional)"** and states **"E-mailul rămâne opțional."** for a complete athlete profile.
- v5: the member "Date" tab's own required-fields note says **"Obligatorii pentru 'complet': nume, data nașterii, persoana de contact, telefon, e-mail."** — e-mail is now required, not optional. (Not captured as a screenshot in this batch — it's on the Sportivi > athlete file "Date" tab, outside the requested Înscrieri-only capture list; confirmed by reading `proto_js.js` / the inlined script's `vMember()` required-field logic directly.)

**i) edit-registration-v1 "Regenerează" button and "Trimitem documentul corectat?" vs v5 edit**
- Old (`edit-registration-v1.html`): the Documente tab has an explicit **"Regenerează"** link next to each document, and saving an edited field pops a separate confirm dialog **"Trimitem documentul corectat?"** before resending.
- v5: there is no "Regenerează" action on the Documente tab (only "Vezi" / "Descarcă" per document, see `proto-panel-matched-docs.png`); saving an edit on the Date tab instead auto-regenerates the document and shows a toast ("Salvat. Documentul a fost refăcut.") with no separate confirmation step — not in v5 as a distinct dialog.

**j) list search placeholder in mockups vs current code text**
- Mockups (`pending-decisions-v2.html`, `quick-check-v1.html`) and v5 itself all use: **"Caută după nr. înscriere, nume, părinte, email sau telefon..."** (same text — no conflict between mockups and v5 here).
- Current code (`edusport_backend/src/admin/dashboard/InscrieriPage.tsx:219`): **"Caută după nume, număr, părinte, e-mail sau telefon..."** — different word order (nume before număr vs. "nr. înscriere" first) and different "e-mail" vs "email" spelling. This is a real mockup-vs-code conflict, not a mockup-vs-mockup one. See `proto-list-searchbar-crop.png` for the v5/mockup wording.
