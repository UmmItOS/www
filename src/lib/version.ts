export async function getVersion(): Promise<string> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/UmmItOS/UmmItOS/releases/latest',
      { next: { revalidate: 3600 } },
    );
    if (res.ok) {
      const data = await res.json() as { tag_name?: string };
      if (data?.tag_name) return data.tag_name;
    }
  } catch {}
  return 'v0.7.0';
}
