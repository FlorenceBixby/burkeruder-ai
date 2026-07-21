import { agents, type Agent, type AgentSource } from "../../src/lib/agents";

interface Env {
  GITHUB_TOKEN: string;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
  // JSON map of agent id -> AgentSource, for agents whose real repo/Worker
  // name isn't safe to check into this public repo (kept out of src/lib/agents.ts
  // and injected at runtime instead so it never ships in the client bundle).
  AGENT_SOURCES?: string;
}

type Status = "ok" | "failing" | "deployed" | "unknown";

interface StatusEntry {
  status: Status;
  lastRun: string | null;
}

const CACHE_SECONDS = 300;

function parsePrivateSources(raw: string | undefined): Record<string, AgentSource> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, AgentSource>;
  } catch {
    return {};
  }
}

async function fetchGithubActionsStatus(
  repo: string,
  workflow: string,
  token: string
): Promise<StatusEntry> {
  const res = await fetch(
    `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/runs?per_page=5`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "burkeruder-ai-status",
      },
    }
  );
  if (!res.ok) return { status: "unknown", lastRun: null };

  const data: { workflow_runs?: Array<{ conclusion: string | null; updated_at: string; created_at: string }> } =
    await res.json();
  const runs = data.workflow_runs ?? [];
  const settled = runs.find((r) => r.conclusion !== null) ?? runs[0];
  if (!settled) return { status: "unknown", lastRun: null };

  const status: Status = settled.conclusion === "success" ? "ok" : settled.conclusion === null ? "unknown" : "failing";
  return { status, lastRun: settled.updated_at ?? settled.created_at };
}

async function fetchWorkerDeployStatus(
  script: string,
  accountId: string,
  token: string
): Promise<StatusEntry> {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/services/${script}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return { status: "unknown", lastRun: null };

  const data: { result?: { modified_on?: string } } = await res.json();
  const modifiedOn = data.result?.modified_on ?? null;
  return { status: modifiedOn ? "deployed" : "unknown", lastRun: modifiedOn };
}

async function resolveStatus(
  agent: Agent,
  env: Env,
  privateSources: Record<string, AgentSource>
): Promise<StatusEntry> {
  const source = agent.source ?? privateSources[agent.id];
  if (!source) return { status: "unknown", lastRun: null };
  try {
    if (source.kind === "github-actions") {
      return await fetchGithubActionsStatus(source.repo, source.workflow, env.GITHUB_TOKEN);
    }
    return await fetchWorkerDeployStatus(source.script, env.CF_ACCOUNT_ID, env.CF_API_TOKEN);
  } catch {
    return { status: "unknown", lastRun: null };
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const privateSources = parsePrivateSources(context.env.AGENT_SOURCES);
  const entries = await Promise.all(
    agents.map(async (agent) => [agent.id, await resolveStatus(agent, context.env, privateSources)] as const)
  );
  const result = Object.fromEntries(entries);

  const response = new Response(JSON.stringify(result), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_SECONDS}`,
      "Access-Control-Allow-Origin": "*",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
};
