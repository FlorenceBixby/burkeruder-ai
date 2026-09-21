export type AgentTrigger = "scheduled" | "event-driven" | "concept";

export type AgentSource =
  | { kind: "github-actions"; repo: string; workflow: string }
  | { kind: "cloudflare-worker"; script: string };

export interface Agent {
  id: string;
  title: string;
  chapter: string;
  description: string;
  cadence: string;
  trigger: AgentTrigger;
  source?: AgentSource;
  /** Who this agent reports to. The Chief of Staff reports to Burke. */
  reportsTo?: string;
  /** Marks the supervisor card — rendered first, with its reports listed under it. */
  supervisor?: boolean;
}

// Personal automations only (burke.ruder@gmail.com side). Anything doing work
// on behalf of The Interesting Group lives on TIG's own ops dashboard instead —
// keeps this site from double-counting agents that are already tracked there.
export const agents: Agent[] = [
  {
    id: "chief-of-staff",
    title: "Burke's Chief of Staff",
    chapter: "First Mate",
    description:
      "The supervisor every personal agent reports to. Keeps the ledger of what they've flagged, notices when one goes quiet, and surfaces anything that actually needs Burke — in the tools he works in, not by email.",
    cadence: "Always on · Cloudflare Durable Object",
    trigger: "event-driven",
    source: { kind: "cloudflare-worker", script: "chief-of-staff" },
    supervisor: true,
    reportsTo: "Burke",
  },
  {
    id: "hull-inspector",
    title: "The Hull Inspector",
    chapter: "Ship's Engineer",
    description:
      "Walks every repo once a day looking for known-vulnerable dependencies, merges the safe fixes on its own, and hands anything risky to a human instead of guessing.",
    cadence: "Daily · 8am CT",
    trigger: "scheduled",
    source: { kind: "cloudflare-worker", script: "security-agent" },
    reportsTo: "Chief of Staff",
  },
  {
    id: "inbox-custodian",
    title: "The Inbox Custodian",
    chapter: "Rope Technician",
    description:
      "Triages a personal inbox every morning, archiving the noise and drafting a reply only when a real human is actually waiting on one.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "personal-mailbox-manager.yml" },
    reportsTo: "Chief of Staff",
  },
  {
    id: "calendar-cartographer",
    title: "The Calendar Cartographer",
    chapter: "Navigation Officer",
    description:
      "Scans incoming email for dates buried in the fine print and quietly adds them to a shared calendar before anyone forgets.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "personal-mailbox-manager.yml" },
  },
  {
    id: "site-keeper",
    title: "The Site Keeper",
    chapter: "Ship's Carpenter",
    description:
      "Rebuilds and redeploys this very site on a standing schedule, so it never drifts too far out of date.",
    cadence: "Monthly · 1st, 6am UTC",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burkeruder-ai", workflow: "monthly-rebuild.yml" },
  },
  {
    id: "morning-digest",
    title: "The Weekly Digest",
    chapter: "Deep-Sea Documentarian",
    description:
      "A weekly research briefing that reads Hacker News, GitHub, and the wider web so you don't have to, then reports back Sunday morning on what was actually worth knowing.",
    cadence: "Weekly · Sunday 7am CT",
    trigger: "scheduled",
  },
  {
    id: "sailing-master",
    title: "The Sailing Master",
    chapter: "Sailing Master",
    description:
      "Reads the morning's readiness signal, checks the week's training budget against what's already logged, and charts the day's session onto the calendar before the crew is even awake.",
    cadence: "Daily · ~9:30am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "training-calendar-sync.yml" },
  },
  {
    id: "newsletter-desk",
    title: "The Newsletter Desk",
    chapter: "Ship's Cook",
    description:
      "A public sign-up page and daily archive for a research newsletter, running quietly on its own slice of Cloudflare.",
    cadence: "Planned",
    trigger: "concept",
  },
];
