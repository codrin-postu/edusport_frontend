import { createDraftStore, hasContent } from "@/lib/form-draft";

/**
 * The registration form's draft.
 *
 * The key is unchanged from when this file held the implementation, so drafts
 * saved by an earlier build are still found.
 *
 * This is the one form that advertises its draft elsewhere on the site: the
 * resume bar reads this store to offer the way back. See
 * components/blocks/resume-registration.tsx.
 */
const store = createDraftStore("edusport.inscrieri.draft.v1");

export const loadDraft = store.load;
export const saveDraft = store.save;
export const clearDraft = store.clear;
export { hasContent };
export type { FormDraft } from "@/lib/form-draft";
