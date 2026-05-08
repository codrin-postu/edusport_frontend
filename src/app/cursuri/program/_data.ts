import type { ProgramPageData } from "./_types";

export const PROGRAM_PAGE_DATA: ProgramPageData = {
  bannerTitle: "Program Cursuri",
  bannerSubtitle:
    "Orarul sesiunilor pe grupe de vârstă și nivel. Verifică weekendurile cu cursuri în calendarul de mai jos.",
  seasonLabel: "2025–2026",
  seasonStart: "2025-10",
  seasonEnd: "2026-05",

  scheduleGroups: [
    {
      timeSlot: "10:00 - 10:50",
      courses: ["Primii Pași", "Intermediari Silver", "Avansați Silver"],
    },
    {
      timeSlot: "11:00 - 11:50",
      courses: ["Începători", "Intermediari Bronze", "Avansați Bronze"],
    },
  ],

  disclaimers: [
    "Programul cursurilor poate suferi modificări în funcție de evenimentele desfășurate de patinoar sau alte situații ce obligă clubul să reprogrameze cursurile. În acest caz cursanții vor fi anunțați în cel mai scurt timp posibil. Ședințele care n-au fost ținute din motive obiective, vor fi reprogramate la o dată ulterioară.",
    "Grupa / ora la care va fi încadrat cursantul va fi comunicată după înscriere, urmând ca programarea finală a orei să fie stabilită după testarea efectivă a cursantului (în prima oră de curs).",
    "Avansarea copiilor de la o grupă la alta se va face de către instructori doar în momentul în care cursantul va realiza corect elementele tehnice necesare pentru elementele lucrate la următoarea grupă.",
    "Fiecare instructor se va ocupa de un număr de 8–10 cursanți/ședință la grupele Primii Pași și Începători și 15 cursanți/ședință la grupele Intermediari și Avansați.",
  ],

  // Single source of truth for the full season calendar.
  // type "curs"    = course weekend (teal in calendar, shown in weekend list)
  // type "liber"   = off weekend (gray in calendar, shown in weekend list)
  // type "holiday" = national/public holiday (amber in calendar only)
  // type "vacation"= school vacation period (indigo in calendar only)
  // startDate/endDate are inclusive ISO dates "YYYY-MM-DD"
  calendarEvents: [
    // ── Course weekends ──────────────────────────────────────────────────────
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-10-04", endDate: "2025-10-05" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-10-11", endDate: "2025-10-12" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-10-18", endDate: "2025-10-19" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-10-25", endDate: "2025-10-26" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-11-08", endDate: "2025-11-09" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-11-15", endDate: "2025-11-16" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-11-22", endDate: "2025-11-23" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-12-06", endDate: "2025-12-07" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2025-12-20", endDate: "2025-12-21" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-01-10", endDate: "2026-01-11" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-01-17", endDate: "2026-01-18" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-01-24", endDate: "2026-01-25" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-01-31", endDate: "2026-01-31" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-02-01", endDate: "2026-02-01" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-02-07", endDate: "2026-02-08" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-02-21", endDate: "2026-02-22" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-02-28", endDate: "2026-02-28" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-03-07", endDate: "2026-03-08" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-03-14", endDate: "2026-03-15" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-03-21", endDate: "2026-03-22" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-03-28", endDate: "2026-03-29" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-04-04", endDate: "2026-04-05" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-04-11", endDate: "2026-04-12" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-04-18", endDate: "2026-04-19" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-04-25", endDate: "2026-04-26" },

    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-05-02", endDate: "2026-05-03" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-05-09", endDate: "2026-05-10" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-05-16", endDate: "2026-05-17" },
    { type: "curs", description: "10:00–10:50 · 11:00–11:50", startDate: "2026-05-23", endDate: "2026-05-24" },

    // ── Off weekends ─────────────────────────────────────────────────────────
    { type: "liber", startDate: "2025-11-01", endDate: "2025-11-02" },
    { type: "liber", startDate: "2025-11-29", endDate: "2025-11-30" },
    { type: "liber", startDate: "2025-12-13", endDate: "2025-12-14" },
    { type: "liber", startDate: "2025-12-27", endDate: "2025-12-28" },
    { type: "liber", startDate: "2026-01-03", endDate: "2026-01-04" },
    { type: "liber", startDate: "2026-02-14", endDate: "2026-02-15" },
    { type: "liber", startDate: "2026-05-30", endDate: "2026-05-31" },

    // ── National holidays ─────────────────────────────────────────────────────
    { type: "holiday", startDate: "2025-11-01", endDate: "2025-11-01", title: "Ziua Tuturor Sfinților" },
    { type: "holiday", startDate: "2025-11-30", endDate: "2025-11-30", title: "Sf. Andrei" },
    { type: "holiday", startDate: "2025-12-01", endDate: "2025-12-01", title: "Ziua Națională" },
    { type: "holiday", startDate: "2025-12-25", endDate: "2025-12-26", title: "Crăciun" },
    { type: "holiday", startDate: "2026-01-01", endDate: "2026-01-02", title: "Anul Nou" },
    { type: "holiday", startDate: "2026-01-24", endDate: "2026-01-24", title: "Unirea Principatelor" },
    { type: "holiday", startDate: "2026-04-20", endDate: "2026-04-21", title: "Paști" },
    { type: "holiday", startDate: "2026-05-01", endDate: "2026-05-01", title: "Ziua Muncii" },

    // ── School vacations ──────────────────────────────────────────────────────
    { type: "vacation", startDate: "2025-10-25", endDate: "2025-11-02", title: "Vacanță de toamnă" },
    { type: "vacation", startDate: "2025-12-20", endDate: "2026-01-11", title: "Vacanță de iarnă" },
    { type: "vacation", startDate: "2026-01-31", endDate: "2026-02-08", title: "Vacanță semestrială" },
    { type: "vacation", startDate: "2026-04-11", endDate: "2026-04-26", title: "Vacanță de primăvară" },
  ],
};
