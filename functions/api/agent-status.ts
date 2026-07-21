import { agents, type Agent } from "../../src/lib/agents";

interface Env {
  GITHUB_TOKEN: string;
  CF_API_TOKEN: string;
  CF_ACCOUNT_ID: string;
}

type Status = "ok" | "failing" | "deployed" | "unknown";

interface StatusEntry {
  status: Status;
  lastRun: string | null;
}

const CACHE_SECONDS = 300;

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

async function resolveStatus(agent: Agent, env: Env): Promise<StatusEntry> {
  if (!agent.source) return { status: "unknown", lastRun: null };
  try {
    if (agent.source.kind === "github-actions") {
      return await fetchGithubActionsStatus(agent.source.repo, agent.source.workflow, env.GITHUB_TOKEN);
    }
    return await fetchWorkerDeployStatus(agent.source.script, env.CF_ACCOUNT_ID, env.CF_API_TOKEN);
  } catch {
    return { status: "unknown", lastRun: null };
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const cache = (caches as unknown as { default: Cache }).default;
  const cacheKey = new Request(context.request.url, context.request);
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const entries = await Promise.all(
    agents.map(async (agent) => [agent.id, await resolveStatus(agent, context.env)] as const)
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
