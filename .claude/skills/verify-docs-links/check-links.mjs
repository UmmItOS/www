#!/usr/bin/env node
// Exhaustive check of docs link integrity over the real files (no mocks).
// P1 every internal /docs link (MDX + src) resolves to a page
// P2 every #anchor in such a link matches a heading in the target page
// P3 every .mdx is reachable from content/docs/meta.json (sidebar)
// P4 every meta.json entry names an existing page or folder
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { slug as ghSlug } from 'github-slugger';

const DOCS = 'content/docs';
const walk = (d) => readdirSync(d).flatMap((n) => {
  const p = join(d, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// URL path -> mdx file. index.mdx maps to its folder.
const pages = new Map();
for (const f of walk(DOCS).filter((f) => f.endsWith('.mdx'))) {
  let s = relative(DOCS, f).replace(/\.mdx$/, '');
  s = s === 'index' ? '' : s.replace(/(^|\/)index$/, '');
  pages.set('/docs' + (s ? '/' + s : ''), f);
}

const errors = [];
const anchors = (f) => new Set([...readFileSync(f, 'utf8').matchAll(/^#{1,6}\s+(.+?)\s*$/gm)]
  .map((m) => ghSlug(m[1].replace(/[`*_]/g, ''))));

// P1, P2
const sources = [...walk(DOCS).filter((f) => f.endsWith('.mdx')), ...walk('src').filter((f) => /\.tsx?$/.test(f))];
const re = /\]\((\/docs[^)\s]*)\)|href=["'](\/docs[^"']*)["']|href:\s*['"](\/docs[^'"]*)['"]/g;
for (const f of sources) {
  for (const m of readFileSync(f, 'utf8').matchAll(re)) {
    const [path, hash] = (m[1] || m[2] || m[3]).split('#');
    const target = pages.get(path.replace(/\/$/, ''));
    if (!target) errors.push(`P1 ${f}: ${m[0]} -> no such page`);
    else if (hash && !anchors(target).has(hash)) errors.push(`P2 ${f}: #${hash} not a heading in ${target}`);
  }
}

// P3, P4
const reachable = new Set();
const meta = (dir) => {
  const mf = join(dir, 'meta.json');
  const entries = existsSync(mf) ? JSON.parse(readFileSync(mf, 'utf8')).pages ?? [] : readdirSync(dir).map((n) => n.replace(/\.mdx$/, ''));
  for (const e of entries.filter((e) => !/^---.*---$/.test(e))) {
    const file = join(dir, e + '.mdx'), sub = join(dir, e);
    if (existsSync(file)) reachable.add(file);
    else if (existsSync(sub) && statSync(sub).isDirectory()) meta(sub);
    else errors.push(`P4 ${mf}: "${e}" is neither ${file} nor a folder`);
  }
};
meta(DOCS);
for (const f of pages.values()) if (!reachable.has(f)) errors.push(`P3 ${f}: not reachable from any meta.json`);

console.log(`pages=${pages.size} sources=${sources.length}`);
if (errors.length) { console.log(errors.join('\n')); console.log(`FAIL ${errors.length}`); process.exit(1); }
console.log('PASS');
