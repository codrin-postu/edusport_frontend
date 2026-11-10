/** The ice-light summary line above the submit button. */
export function SummaryBand({ children }: { children: string }) {
  return (
    <div data-summary-band className="bg-ice-light px-(--portal-row-pad-x) py-3 text-(length:--portal-text-14) font-semibold text-primary">
      {children}
    </div>
  );
}
