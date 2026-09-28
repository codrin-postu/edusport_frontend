"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "@/utils/cn";
import IconButton from "./icon-button";

type DialogWidth = "sm" | "md";

const WIDTH: Record<DialogWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
};

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  eyebrow?: string;
  description?: React.ReactNode;
  /** Accessible name for the close IconButton. Defaults to Romanian copy. */
  closeLabel?: string;
  hideClose?: boolean;
  /** sm: max-w-sm. md (default): max-w-md. */
  width?: DialogWidth;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Modal dialog on Radix primitives: retro-boxed surface, centered, with an
 * eyebrow + title header and an optional description.
 */
function Dialog({
  open,
  onOpenChange,
  title,
  eyebrow,
  description,
  closeLabel = "Închide",
  hideClose = false,
  width = "md",
  className,
  children,
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-dialog bg-overlay",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "motion-reduce:animate-none",
          )}
        />
        <DialogPrimitive.Content
          {...(!description && { "aria-describedby": undefined })}
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-dialog",
            "w-[calc(100%-2rem)]",
            WIDTH[width],
            "max-h-[85vh] overflow-y-auto",
            "bg-surface border-retro border-line shadow-retro p-6",
            "outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "motion-reduce:animate-none",
            className,
          )}
        >
          {!hideClose && (
            <DialogPrimitive.Close asChild>
              <IconButton icon="close" label={closeLabel} className="absolute top-2 right-2" />
            </DialogPrimitive.Close>
          )}
          {eyebrow && <p className="text-label text-accent mb-2">{eyebrow}</p>}
          <DialogPrimitive.Title className="text-title text-primary">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-2 text-body-sm text-secondary">
              {description}
            </DialogPrimitive.Description>
          )}
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Action row for Dialog footers: right-aligned buttons that wrap on narrow widths. */
function DialogActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-6 flex flex-wrap items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

/** Re-exported Radix Close, for Cancel buttons inside DialogActions. */
const DialogClose = DialogPrimitive.Close;

export default Dialog;
export { Dialog, DialogActions, DialogClose };
