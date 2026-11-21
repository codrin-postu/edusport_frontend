import { renderInline } from "@/lib/ghid/inline";

export function Warn({ text }: { text: string }) {
  return (
    <div role="note" className="flex max-w-(--portal-narrow-860) flex-col gap-1 border-card border-warn-line bg-warn-bg p-4">
      <b className="font-display text-(length:--portal-text-15) font-extrabold">Atenție</b>
      <span className="text-(length:--portal-text-14)">{renderInline(text)}</span>
    </div>
  );
}
