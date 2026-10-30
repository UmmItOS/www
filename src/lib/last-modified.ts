import { execFileSync } from 'node:child_process';

// The last git commit time for a docs file, read at build. Returns undefined
// when git history is unavailable (e.g. a shallow clone) so the page still renders.
export function getLastModified(docPath: string): Date | undefined {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', `content/docs/${docPath}`],
      { encoding: 'utf8' },
    ).trim();
    return out ? new Date(out) : undefined;
  } catch {
    return undefined;
  }
}
