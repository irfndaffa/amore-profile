const GITHUB_API = "https://api.github.com";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !repo) {
    throw new Error(
      "GITHUB_TOKEN and GITHUB_REPO env vars must be set to save admin changes.",
    );
  }
  return { token, repo, branch };
}

async function githubRequest(path: string, init?: RequestInit) {
  const { token } = getConfig();
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API error ${res.status}: ${body}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function getFileSha(filePath: string): Promise<string | undefined> {
  const { repo, branch } = getConfig();
  try {
    const data = await githubRequest(
      `/repos/${repo}/contents/${encodeURIComponent(filePath)}?ref=${branch}`,
    );
    return (data as { sha?: string })?.sha;
  } catch {
    return undefined;
  }
}

export async function commitFile({
  filePath,
  content,
  message,
  isBase64 = false,
}: {
  filePath: string;
  content: string;
  message: string;
  isBase64?: boolean;
}): Promise<void> {
  const { repo, branch } = getConfig();
  const sha = await getFileSha(filePath);
  const base64Content = isBase64
    ? content
    : Buffer.from(content, "utf-8").toString("base64");

  await githubRequest(
    `/repos/${repo}/contents/${encodeURIComponent(filePath)}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: base64Content,
        branch,
        ...(sha ? { sha } : {}),
      }),
    },
  );
}

export async function deleteFile({
  filePath,
  message,
}: {
  filePath: string;
  message: string;
}): Promise<void> {
  const { repo, branch } = getConfig();
  const sha = await getFileSha(filePath);
  if (!sha) return; // already gone

  await githubRequest(
    `/repos/${repo}/contents/${encodeURIComponent(filePath)}`,
    {
      method: "DELETE",
      body: JSON.stringify({ message, sha, branch }),
    },
  );
}

export async function commitJson(
  filePath: string,
  data: unknown,
  message: string,
): Promise<void> {
  const json = JSON.stringify(data, null, 2) + "\n";
  await commitFile({ filePath, content: json, message });
}
