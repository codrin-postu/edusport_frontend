/** Today as YYYY-MM-DD in Bucharest (the club's day), for links that need a date. */
export function bucharestToday(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Bucharest" }).format(new Date());
}
