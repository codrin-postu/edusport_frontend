import { createDraftStore, hasContent } from "@/lib/form-draft";

/**
 * The registration form's draft.
 *
 * v2 since the form mirrors the club's script form (phase 2): a v1 draft holds
 * the old questions and step order, so it is dropped instead of restored.
 *
 * This is the one form that advertises its draft elsewhere on the site: the
 * resume bar reads this store to offer the way back. See
 * components/blocks/resume-registration.tsx.
 */
const store = createDraftStore("edusport.inscrieri.draft.v2");
const legacy = createDraftStore("edusport.inscrieri.draft.v1");

export const loadDraft = store.load;
export const saveDraft = store.save;
export const clearDraft = store.clear;
/** Removes a draft saved by the old form, once, when the new form mounts. */
export const clearLegacyDraft = legacy.clear;
export { hasContent };
export type { FormDraft } from "@/lib/form-draft";
