import type { CustomAnswer } from "@/lib/strapi-forms";

/**
 * Local draft of a multi-step form, one store per form.
 *
 * Forms live on one page while the schedule, the regulations and the rest live
 * on others, so someone who leaves to check anything loses what they typed: the
 * answers are React state and nothing outlives the navigation. The same applies
 * to the back button, a mistyped tap, and iOS discarding a backgrounded tab,
 * which it does aggressively.
 *
 * localStorage rather than sessionStorage on purpose: sessionStorage is per tab,
 * so it would not survive the tab being discarded, which is the case we most
 * need to cover on a phone.
 *
 * Each form gets its own key. Whether a form advertises its saved draft
 * elsewhere on the site is a separate decision: registration does, through the
 * resume bar, and volunteering deliberately does not.
 */

// Long enough to survive "I'll finish this tonight", short enough that a
// half-filled form does not resurface weeks later on a shared device.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface FormDraft {
  step: number;
  answers: Record<string, CustomAnswer>;
  savedAt: number;
}

/** True when the answers hold something worth restoring. */
export function hasContent(answers: Record<string, CustomAnswer>): boolean {
  return Object.values(answers).some((v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "boolean") return v;
    return true;
  });
}

export interface DraftStore {
  key: string;
  load(): FormDraft | null;
  save(step: number, answers: Record<string, CustomAnswer>): void;
  clear(): void;
}

export function createDraftStore(key: string): DraftStore {
  return {
    key,

    load(): FormDraft | null {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const draft = JSON.parse(raw) as FormDraft;
        if (!draft || typeof draft !== "object" || !draft.answers) return null;
        if (!Number.isFinite(draft.savedAt) || Date.now() - draft.savedAt > MAX_AGE_MS) {
          window.localStorage.removeItem(key);
          return null;
        }
        if (!hasContent(draft.answers)) return null;
        return draft;
      } catch {
        // Corrupt or unreadable (private mode, quota, hand-edited): behave as
        // if there were no draft rather than breaking the form.
        return null;
      }
    },

    save(step, answers): void {
      if (typeof window === "undefined") return;
      try {
        if (!hasContent(answers)) {
          window.localStorage.removeItem(key);
          return;
        }
        const draft: FormDraft = { step, answers, savedAt: Date.now() };
        window.localStorage.setItem(key, JSON.stringify(draft));
      } catch {
        // Storage full or blocked. Saving is a convenience, never a
        // requirement, so a failure must not interrupt someone filling a form.
      }
    },

    clear(): void {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* same reasoning as save */
      }
    },
  };
}
