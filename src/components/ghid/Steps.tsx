import { renderInline } from "@/lib/ghid/inline";
import type { Step } from "@/lib/ghid/types";
import { Shot } from "./Shot";

export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-6 p-0">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center bg-surface-dark font-display text-(length:--portal-text-16) font-extrabold text-primary-on-dark">{i + 1}</span>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="m-0 mt-1 max-w-[62ch] text-(length:--portal-text-15)">{renderInline(s.text)}</p>
            {s.shot && <Shot id={s.shot} />}
          </div>
        </li>
      ))}
    </ol>
  );
}
