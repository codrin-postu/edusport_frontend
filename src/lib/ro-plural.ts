/**
 * Romanian count agreement for eyebrow labels such as "5 medalii" / "20 de
 * medalii". `one` and `many` are the bare noun forms (singular / plural),
 * not full strings — the count is prefixed here.
 */
export function roCount(n: number, one: string, many: string): string {
  if (n === 1) return `1 ${one}`;
  const mod100 = n % 100;
  if (mod100 >= 20 || (n >= 100 && mod100 === 0)) return `${n} de ${many}`;
  return `${n} ${many}`;
}
