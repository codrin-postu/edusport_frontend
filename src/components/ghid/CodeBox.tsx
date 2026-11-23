/** A command block; scrolls sideways inside itself, so a long line never widens the page. */
export function CodeBox({ text }: { text: string }) {
  return (
    <pre tabIndex={0} className="m-0 max-w-(--portal-narrow-860) overflow-x-auto border-card border-card-line bg-surface-subtle p-4 font-mono text-(length:--portal-text-14)">
      <code>{text}</code>
    </pre>
  );
}
