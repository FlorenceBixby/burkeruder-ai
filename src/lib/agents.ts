export interface Agent {
  id: string;
  title: string;
  chapter: string;
  description: string;
}

export const agents: Agent[] = [
  {
    id: "morning-digest",
    title: "The Morning Digest",
    chapter: "Exhibit I",
    description:
      "A daily research briefing that reads Hacker News, GitHub, and the wider web so you don't have to, then reports back on what's actually worth knowing.",
  },
  {
    id: "inbox-custodian",
    title: "The Inbox Custodian",
    chapter: "Exhibit II",
    description:
      "Triages a personal inbox every morning, archiving the noise and drafting a reply only when a real human is actually waiting on one.",
  },
  {
    id: "correspondence-clerk",
    title: "The Correspondence Clerk",
    chapter: "Exhibit III",
    description:
      "Keeps a business inbox honest, sorting bills from leads from spam, and flagging anything that genuinely needs a signature.",
  },
  {
    id: "calendar-cartographer",
    title: "The Calendar Cartographer",
    chapter: "Exhibit IV",
    description:
      "Scans incoming email for dates buried in the fine print and quietly adds them to a shared calendar before anyone forgets.",
  },
  {
    id: "blog-correspondent",
    title: "The Blog Correspondent",
    chapter: "Exhibit V",
    description:
      "Drafts and publishes blog content on a running schedule, keeping the lights on even when nobody's home.",
  },
  {
    id: "prospecting-machine",
    title: "The Prospecting Machine",
    chapter: "Exhibit VI",
    description:
      "An end-to-end pipeline that finds prospects, scores them, drafts outreach, and files the paperwork in the CRM.",
  },
  {
    id: "reply-handler",
    title: "The Reply Handler",
    chapter: "Exhibit VII",
    description:
      "Reads cold-email replies and decides what happens next, interested, not interested, or unsubscribe, without a human in the loop.",
  },
  {
    id: "newsletter-desk",
    title: "The Newsletter Desk",
    chapter: "Exhibit VIII",
    description:
      "A public sign-up page and daily archive for a research newsletter, running quietly on its own slice of Cloudflare.",
  },
];
