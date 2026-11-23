import { GHID_SHOTS } from "@/content/ghid";
import { badgeOutside, stepMarks } from "@/lib/ghid/shots";

/** A screenshot with the marks its step names, numbered from 1 only when `numbered`. Renders nothing when the shot id has no entry in shots.json. */
export function Shot({ id, marks, numbered }: { id: string; marks?: string[]; numbered?: boolean }) {
  const s = GHID_SHOTS[id];
  if (!s) return null;
  return (
    <div className="relative max-w-(--portal-narrow-860) border-card border-card-line bg-surface-raised">
      {/* eslint-disable-next-line @next/next/no-img-element -- gated route, not a public image for next/image */}
      <img src={`/ghid/img/${id}.jpg`} alt={s.alt} width={s.w} height={s.h} loading="lazy" className="block h-auto w-full" />
      {stepMarks(id, s, marks, numbered).map((m, i) => (
        <span
          key={i}
          className="absolute border-(length:--portal-mark-h) border-ice-blue"
          style={{ left: `${m.box[0]}%`, top: `${m.box[1]}%`, width: `${m.box[2]}%`, height: `${m.box[3]}%` }}
        >
          {m.n !== undefined && (
            <i
              className={`absolute grid size-5 place-items-center bg-ice-blue font-display text-(length:--portal-text-13) font-extrabold not-italic text-white ${
                badgeOutside(m.box) ? "top-[calc(-1*var(--portal-mark-h))] right-[calc(100%+var(--portal-mark-h))]" : "top-0 left-0"
              }`}
            >
              {m.n}
            </i>
          )}
        </span>
      ))}
    </div>
  );
}
