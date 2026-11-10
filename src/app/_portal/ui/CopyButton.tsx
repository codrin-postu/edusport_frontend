"use client";

import Icon from "@/components/ui/icon";
import { useToast } from "@/app/_portal/ui/Toast";

/** 44px square icon button: copies `text`, then shows `copied` (or `failed` when the browser refuses) in the shared toast. */
export function CopyButton({ text, label, copied, failed }: { text: string; label: string; copied: string; failed: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={async() => {
        try {
          await navigator.clipboard.writeText(text);
          toast.show(copied);
        } catch {
          toast.show(failed);
        }
      }}
      className="flex size-(--portal-tap) items-center justify-center bg-transparent text-secondary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
    >
      <Icon name="portal-copy" size="18" />
    </button>
  );
}
