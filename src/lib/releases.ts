export interface Release {
  tag: string;
  name: string;
  date: string; // ISO
  prerelease: boolean;
  body: string;
  url: string;
}

// Fetched at build / revalidated hourly, so no client-side GitHub rate limits.
export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/UmmItOS/UmmItOS/releases?per_page=100',
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      tag_name: string;
      name: string | null;
      published_at: string;
      prerelease: boolean;
      body: string | null;
      html_url: string;
    }>;
    return data.map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      date: r.published_at,
      prerelease: r.prerelease,
      body: r.body || '',
      url: r.html_url,
    }));
  } catch {
    return [];
  }
}
