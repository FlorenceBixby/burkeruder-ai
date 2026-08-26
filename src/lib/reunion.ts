// ── THE REUNION SLATE ───────────────────────────────────────────────
// Edit this list to change which windows appear on the ballot.
// Each entry becomes one row on the ballot and one column in the box score.
// `id` is what gets stored in the database — renaming an id orphans old votes,
// so change labels freely but leave ids alone once people start voting.

export type Vote = "yes" | "maybe" | "no";

export interface ReunionWindow {
  id: string;
  label: string; // short column head for the box score
  dates: string; // display range
  days: string;  // day-of-week range
  note: string;  // why this window
  start: string; // ISO date, used for chronological tiebreaks
}

export const REUNION_YEAR = 2027;

export const REUNION_WINDOWS: ReunionWindow[] = [
  { id: "w-mar",  label: "MAR",  dates: "March 12–14",      days: "Fri–Sun", note: "Spring break for most districts", start: "2027-03-12" },
  { id: "w-may",  label: "MAY",  dates: "May 28–31",        days: "Fri–Mon", note: "Memorial Day — long weekend",     start: "2027-05-28" },
  { id: "w-jun",  label: "JUN",  dates: "June 18–20",       days: "Fri–Sun", note: "School's out, before vacations",  start: "2027-06-18" },
  { id: "w-jul4", label: "JUL 4", dates: "July 2–5",        days: "Fri–Mon", note: "Independence Day — long weekend", start: "2027-07-02" },
  { id: "w-jul",  label: "JUL",  dates: "July 23–25",       days: "Fri–Sun", note: "High summer",                     start: "2027-07-23" },
  { id: "w-sep",  label: "SEP",  dates: "September 3–6",    days: "Fri–Mon", note: "Labor Day — long weekend",        start: "2027-09-03" },
  { id: "w-nov",  label: "NOV",  dates: "November 24–28",   days: "Wed–Sun", note: "Thanksgiving week",               start: "2027-11-24" },
];

export interface Ballot {
  id: string;
  name: string;
  household: string | null;
  party_size: number;
  picks: Record<string, Vote>;
  note: string | null;
  created_at: string;
}

export interface Standing {
  window: ReunionWindow;
  yes: number;
  maybe: number;
  no: number;
  cast: number;
  heads: number;   // people who can definitely come
  maybeHeads: number;
  pct: number;     // (yes + maybe/2) / cast
}

// Classic W-L-T standings: YES is a win, MAYBE is a tie, NO is a loss.
export function computeStandings(ballots: Ballot[]): Standing[] {
  return REUNION_WINDOWS.map((w) => {
    let yes = 0, maybe = 0, no = 0, heads = 0, maybeHeads = 0;
    for (const b of ballots) {
      const v = b.picks?.[w.id];
      if (v === "yes") { yes++; heads += b.party_size; }
      else if (v === "maybe") { maybe++; maybeHeads += b.party_size; }
      else if (v === "no") { no++; }
    }
    const cast = yes + maybe + no;
    return { window: w, yes, maybe, no, cast, heads, maybeHeads, pct: cast ? (yes + maybe / 2) / cast : 0 };
  }).sort((a, b) =>
    b.pct - a.pct ||
    b.heads - a.heads ||
    a.window.start.localeCompare(b.window.start)
  );
}

export function formatPct(pct: number): string {
  return pct.toFixed(3).replace(/^0/, "");
}
