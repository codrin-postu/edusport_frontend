import { cn } from "@/utils/cn";

interface NameStackProps {
  name: string;
  /** The name sits on a dark (navy) surface. */
  onDark?: boolean;
  className?: string;
}

/**
 * The editorial "stacked name" treatment used for athletes: the first word
 * filled solid, everything after outlined (WebkitTextStroke). Shared by the
 * sportivi index Spotlight and the athlete detail hero — keeping it in one
 * place keeps both surfaces pixel-identical.
 */
export default function NameStack({ name, onDark = false, className }: NameStackProps) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.toUpperCase() ?? "";
  const rest = parts.slice(1).join(" ").toUpperCase();

  const content = (
    <>
      <span className={cn("block", onDark ? "text-primary-on-dark" : "text-primary")}>{first}</span>
      {rest && (
        <span
          className="block"
          style={{
            color: "transparent",
            WebkitTextStroke: onDark ? "1.5px var(--color-retro-cream)" : "1.5px var(--color-navy)",
          }}
        >
          {rest}
        </span>
      )}
    </>
  );

  // No wrapper by default, so the DOM matches the two call sites exactly
  // (an h1/h2 with text-athlete-name wraps this directly).
  return className ? <span className={className}>{content}</span> : content;
}

export { NameStack };
