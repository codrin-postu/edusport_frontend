"use client";

import Icon from "@/components/ui/icon";
import { useToast } from "@/app/_portal/ui/Toast";

/** 44px square icon button: copies `text`, then shows `copied` in the shared toast. */
export function CopyButton({ text, label, copied }: { text: string; label: string; copied: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => toast.show(copied));
      }}
      className="flex size-(--portal-tap) items-center justify-center bg-transparent text-secondary outline-none focus-visible:outline-2 focus-visible:outline-offset-(--focus-offset) focus-visible:outline-focus"
    >
      <Icon name="portal-copy" size="18" />
    </button>
  );
}
