export async function getVersion(): Promise<string> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/UmmItOS/UmmItOS/tags?per_page=1',
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = await res.json() as { name: string }[];
      if (data?.[0]?.name) return data[0].name;
    }
  } catch {}
  return 'v0.7.0';
}
