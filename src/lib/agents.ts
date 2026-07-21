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

export const agents: Agent[] = [
  {
    id: "inbox-custodian",
    title: "The Inbox Custodian",
    chapter: "Exhibit Alpha",
    description:
      "Triages a personal inbox every morning, archiving the noise and drafting a reply only when a real human is actually waiting on one.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "personal-mailbox-manager.yml" },
  },
  {
    id: "correspondence-clerk",
    title: "The Correspondence Clerk",
    chapter: "Exhibit Bravo",
    description:
      "Keeps a second personal inbox honest, sorting bills from leads from spam, and flagging anything that genuinely needs a signature.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "atxruders-mailbox-manager.yml" },
  },
  {
    id: "calendar-cartographer",
    title: "The Calendar Cartographer",
    chapter: "Exhibit Charlie",
    description:
      "Scans incoming email for dates buried in the fine print and quietly adds them to a shared calendar before anyone forgets.",
    cadence: "Daily · 7am CT",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burke-portfolio", workflow: "personal-mailbox-manager.yml" },
  },
  {
    id: "site-keeper",
    title: "The Site Keeper",
    chapter: "Exhibit Delta",
    description:
      "Rebuilds and redeploys this very site on a standing schedule, so it never drifts too far out of date.",
    cadence: "Monthly · 1st, 6am UTC",
    trigger: "scheduled",
    source: { kind: "github-actions", repo: "FlorenceBixby/burkeruder-ai", workflow: "monthly-rebuild.yml" },
  },
  {
    id: "morning-digest",
    title: "The Morning Digest",
    chapter: "Exhibit Echo",
    description:
      "A daily research briefing that reads Hacker News, GitHub, and the wider web so you don't have to, then reports back on what's actually worth knowing.",
    cadence: "Planned",
    trigger: "concept",
  },
  {
    id: "blog-correspondent",
    title: "The Blog Correspondent",
    chapter: "Exhibit Foxtrot",
    description:
      "Drafts and publishes blog content on a running schedule, keeping the lights on even when nobody's home.",
    cadence: "Mon / Wed / Fri · 9am CT",
    trigger: "scheduled",
  },
  {
    id: "prospecting-machine",
    title: "The Prospecting Machine",
    chapter: "Exhibit Golf",
    description:
      "An end-to-end pipeline that finds prospects, scores them, drafts outreach, and files the paperwork in the CRM.",
    cadence: "Mon / Wed / Fri · ~6am CT",
    trigger: "scheduled",
  },
  {
    id: "account-warden",
    title: "The Account Warden",
    chapter: "Exhibit Hotel",
    description:
      "Keeps watch over the health of every sending mailbox, catching problems before they turn into a deliverability headache.",
    cadence: "Daily · 8am CT",
    trigger: "scheduled",
  },
  {
    id: "daily-briefing",
    title: "The Daily Briefing",
    chapter: "Exhibit India",
    description:
      "A standing morning report on the state of the business, written and delivered before the first coffee.",
    cadence: "Daily · 6:45am CT",
    trigger: "scheduled",
  },
  {
    id: "reply-handler",
    title: "The Reply Handler",
    chapter: "Exhibit Juliett",
    description:
      "Reads cold-email replies and decides what happens next, interested, not interested, or unsubscribe, without a human in the loop.",
    cadence: "Event-driven, weekly fallback sweep",
    trigger: "event-driven",
  },
  {
    id: "lead-concierge",
    title: "The Lead Concierge",
    chapter: "Exhibit Kilo",
    description:
      "Chats with visitors on the website, then routes anything worth following up on straight to the inbox.",
    cadence: "Event-driven",
    trigger: "event-driven",
  },
  {
    id: "newsletter-desk",
    title: "The Newsletter Desk",
    chapter: "Exhibit Lima",
    description:
      "A public sign-up page and daily archive for a research newsletter, running quietly on its own slice of Cloudflare.",
    cadence: "Planned",
    trigger: "concept",
  },
];
