/** The only round element of the coach app. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      data-spinner
      aria-label="Se încarcă"
      className={`inline-block size-6 animate-spin motion-reduce:animate-none rounded-full border-retro border-line-subtle border-t-primary ${className ?? ""}`}
    />
  );
}
