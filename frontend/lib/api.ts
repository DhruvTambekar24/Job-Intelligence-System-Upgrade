const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function safeJsonFetch(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  const text = await res.text();

  if (!res.ok) {
    const msg = `HTTP ${res.status} ${res.statusText}: ${text}`;
    throw new Error(msg);
  }

  if (!text) return [];

  try {
    return JSON.parse(text);
  } catch (err) {
    // Response wasn't JSON (e.g. HTML error page). Surface useful message.
    const message = String(text).slice(0, 200);
    throw new Error(`Invalid JSON response: ${message}`);
  }
}

export async function getTopSkills() {
  try {
    return await safeJsonFetch(`${BASE_URL}/top-skills`);
  } catch (err) {
    console.warn('getTopSkills failed:', err);
    return [];
  }
}

export async function getJobsByCity() {
  try {
    return await safeJsonFetch(`${BASE_URL}/jobs-by-city`);
  } catch (err) {
    console.warn('getJobsByCity failed:', err);
    return [];
  }
}

export async function getJobTrends() {
  try {
    return await safeJsonFetch(`${BASE_URL}/job-trends`);
  } catch (err) {
    console.warn('getJobTrends failed:', err);
    return [];
  }
}
export async function getMatchedJobs(skills: string[]) {
  return await safeJsonFetch(`${BASE_URL}/jobs/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skills),
  });
}
export async function getJobClusters() {
  try {
    return await safeJsonFetch(`${BASE_URL}/job-clusters`);
  } catch (err) {
    console.warn("getJobClusters failed:", err);
    return { jobs: [], cluster_distribution: [] };
  }
}
export async function getCooccurrence() {
  try {
    const data = await safeJsonFetch(`${BASE_URL}/skill-cooccurrence`);

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.relations)) {
      return data.relations;
    }

    if (Array.isArray(data?.cooccurrence)) {
      return data.cooccurrence;
    }

    return [];
  } catch (err) {
    console.warn('getCooccurrence failed:', err);
    return [];
  }
}
export async function getJobs({
  page = 1,
  limit = 10,
  search,
  skill,
}: {
  page?: number;
  limit?: number;
  search?: string;
  skill?: string;
}) {
  try {
    let url = `${BASE_URL}/jobs?page=${page}&limit=${limit}`;

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    if (skill) {
      url += `&skill=${encodeURIComponent(skill)}`;
    }

    return await safeJsonFetch(url);
  } catch (err) {
    console.warn("getJobs failed:", err);
    return {
      page,
      limit,
      count: 0,
      jobs: [],
    };
  }
}
export async function getRecommendations(skills: string[]) {
  try {
    return await safeJsonFetch(`${BASE_URL}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skills),
    });
  } catch (err) {
    console.warn('getRecommendations failed:', err);
    return [];
  }
}