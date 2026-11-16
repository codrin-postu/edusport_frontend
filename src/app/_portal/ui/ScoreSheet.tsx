import { SHEET } from "@/lib/portal/copy";
import { infoText, judgeCount, judgeLabels, markText, scoreText, segmentTotals, type SheetSegment } from "@/lib/portal/score-sheet";

const CELL = "px-2 py-1.5 whitespace-nowrap";
const NUM = `${CELL} text-right tabular-nums`;
const HEAD = `${CELL} bg-ice-light text-(length:--portal-text-11) font-bold text-muted`;

function Segment({ seg }: { seg: SheetSegment }) {
  const labels = judgeLabels(judgeCount(seg));
  const totals = segmentTotals(seg);
  return (
    <section className="flex flex-col gap-2 border-t border-line-subtle px-(--portal-row-pad-x) py-3">
      <h4 className="text-(length:--portal-text-15) font-extrabold">{seg.name}</h4>
      {totals.length > 0 && (
        <dl className="flex flex-wrap gap-x-5 gap-y-1">
          {totals.map((t) => (
            <div key={t.label} className="flex items-baseline gap-1.5">
              <dt className="text-(length:--portal-text-12) text-muted">{t.label}</dt>
              <dd className="font-display font-extrabold text-(length:--portal-text-16) tabular-nums">{scoreText(t.value)}</dd>
            </div>
          ))}
        </dl>
      )}
      {seg.elements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-(length:--portal-text-13)">
            <thead>
              <tr>
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.order}</th>
                <th scope="col" className={`${HEAD} text-left`}>{SHEET.element}</th>
                <th scope="col" className={`${HEAD} text-left`}>{SHEET.info}</th>
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.baseValue}</th>
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.goe}</th>
                {labels.map((l) => <th key={l} scope="col" className={`${HEAD} text-right`}>{l}</th>)}
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.score}</th>
              </tr>
            </thead>
            <tbody>
              {seg.elements.map((e) => (
                <tr key={e.order} className="border-t border-line-subtle">
                  <td className={NUM}>{e.order}</td>
                  <td className={`${CELL} font-bold`}>{e.name}</td>
                  <td className={CELL}>{infoText(e)}</td>
                  <td className={NUM}>{scoreText(e.baseValue)}</td>
                  <td className={NUM}>{scoreText(e.goe)}</td>
                  {labels.map((_, i) => <td key={i} className={NUM}>{markText(e.judges[i] ?? null)}</td>)}
                  <td className={`${NUM} font-bold`}>{scoreText(e.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {seg.components.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-(length:--portal-text-13)">
            <thead>
              <tr>
                <th scope="col" className={`${HEAD} text-left`}>{SHEET.component}</th>
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.factor}</th>
                {labels.map((l) => <th key={l} scope="col" className={`${HEAD} text-right`}>{l}</th>)}
                <th scope="col" className={`${HEAD} text-right`}>{SHEET.score}</th>
              </tr>
            </thead>
            <tbody>
              {seg.components.map((c) => (
                <tr key={c.name} className="border-t border-line-subtle">
                  <td className={`${CELL} font-bold`}>{c.name}</td>
                  <td className={NUM}>{scoreText(c.factor)}</td>
                  {labels.map((_, i) => <td key={i} className={NUM}>{scoreText(c.judges[i] ?? null)}</td>)}
                  <td className={`${NUM} font-bold`}>{scoreText(c.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** The judges' protocol of one result: per segment its totals, the elements table and the components table; the judge columns scroll sideways. */
export function ScoreSheet({ segments }: { segments: SheetSegment[] }) {
  return <div className="flex flex-col bg-surface">{segments.map((s) => <Segment key={s.name} seg={s} />)}</div>;
}
