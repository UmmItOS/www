import { execFileSync } from 'node:child_process';

// The last git commit that changed a docs file's contents, read at build. Follows renames and
// skips commits that only moved the file (old and new blob are the same).
export function getLastModified(docPath: string): Date | undefined {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--raw', '--no-abbrev', '--format=@%cI', '--', `content/docs/${docPath}`],
      { encoding: 'utf8' },
    );
    let date: string | undefined;
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) date = line.slice(1);
      else if (line.startsWith(':') && date) {
        const [, , oldBlob, newBlob] = line.split(' ');
        if (oldBlob !== newBlob) return new Date(date);
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}
