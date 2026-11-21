export function Video({ src, length }: { src: string; length?: string }) {
  return (
    <div className="flex max-w-(--portal-narrow-860) flex-col gap-2 border-card border-card-line bg-surface-raised p-4">
      <div className="flex items-baseline gap-3">
        <b className="font-display text-(length:--portal-text-15) font-extrabold">Video</b>
        {length && <span className="text-(length:--portal-text-13) text-muted">{length}</span>}
      </div>
      <video controls preload="metadata" src={src} className="block h-auto w-full bg-surface-dark" />
    </div>
  );
}
