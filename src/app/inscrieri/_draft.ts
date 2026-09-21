import type { CustomAnswer } from "@/lib/strapi-forms";

/**
 * Local draft of the registration form.
 *
 * The form lives on one page while the schedule and the regulations live on
 * others, so a parent who wants to check either loses everything they typed:
 * the answers are React state and nothing outlives the navigation. The same
 * applies to the back button, a mistyped tap, and iOS discarding a backgrounded
 * tab, which it does aggressively.
 *
 * Kept in localStorage rather than sessionStorage on purpose: sessionStorage is
 * per tab, so it would not survive the tab being discarded, which is the case
 * we most need to cover on a phone.
 */

const KEY = "edusport.inscrieri.draft.v1";

// Long enough to survive "I'll finish this tonight", short enough that a
// half-filled form does not resurface weeks later on a shared device.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface FormDraft {
  step: number;
  answers: Record<string, CustomAnswer>;
  savedAt: number;
}

/** True when the draft holds something worth restoring. */
export function hasContent(answers: Record<string, CustomAnswer>): boolean {
  return Object.values(answers).some((v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "boolean") return v;
    return true;
  });
}

export function loadDraft(): FormDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as FormDraft;
    if (!draft || typeof draft !== "object" || !draft.answers) return null;
    if (!Number.isFinite(draft.savedAt) || Date.now() - draft.savedAt > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    if (!hasContent(draft.answers)) return null;
    return draft;
  } catch {
    // Corrupt or unreadable (private mode, quota, hand-edited): behave as if
    // there were no draft rather than breaking the form.
    return null;
  }
}

export function saveDraft(step: number, answers: Record<string, CustomAnswer>): void {
  if (typeof window === "undefined") return;
  try {
    if (!hasContent(answers)) {
      window.localStorage.removeItem(KEY);
      return;
    }
    const draft: FormDraft = { step, answers, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage full or blocked. Saving is a convenience, never a requirement,
    // so a failure here must not interrupt someone filling the form.
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Same reasoning as saveDraft.
  }
}
