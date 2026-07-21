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
}

// Personal automations only (burke.ruder@gmail.com side). Anything doing work
// on behalf of The Interesting Group lives on TIG's own ops dashboard instead —
// keeps this site from double-counting agents that are already tracked there.
export const agents: Agent[] = [
  {
    id: "inbox-custodian",
    title: "The Inbox Custodian",
    chapter: "Rope Technician",
    description:
      "Triages a personal inbox every morning, archiving the noise and drafting a reply only when a real human is actually waiting on one.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "personal-mailbox-manager.yml" },
  },
  {
    id: "correspondence-clerk",
    title: "The Correspondence Clerk",
    chapter: "Safety Diver",
    description:
      "Keeps a second personal inbox honest, sorting bills from leads from spam, and flagging anything that genuinely needs a signature.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "atxruders-mailbox-manager.yml" },
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
    title: "The Morning Digest",
    chapter: "Deep-Sea Documentarian",
    description:
      "A daily research briefing that reads Hacker News, GitHub, and the wider web so you don't have to, then reports back on what's actually worth knowing.",
    cadence: "Planned",
    trigger: "concept",
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
