export interface Project {
  id: string;
  title: string;
  chapter: string;
  description: string;
  tags: string[];
  status: "live" | "wip" | "concept";
  href?: string;
  year: string;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "The Personal Dossier",
    chapter: "Exhibit I",
    description: "A meticulously curated portrait of one man's professional exploits, rendered in pixels and prose. Also: this website.",
    tags: ["React", "Next.js", "Framer Motion"],
    status: "live",
    href: "https://burkeruder.com",
    year: "2025",
  },
  {
    id: "placeholder-1",
    title: "Operation: Classified",
    chapter: "Exhibit II",
    description: "Details of this particular venture remain classified pending further development. Check back after the next expedition.",
    tags: ["TBD", "Coming Soon"],
    status: "concept",
    year: "2026",
  },
  {
    id: "placeholder-2",
    title: "The Cloud Cartographer",
    chapter: "Exhibit III",
    description: "An ongoing cartographic effort to map the vast and treacherous terrain of enterprise cloud infrastructure.",
    tags: ["Cloud", "Security", "AWS"],
    status: "wip",
    year: "2026",
  },
];
