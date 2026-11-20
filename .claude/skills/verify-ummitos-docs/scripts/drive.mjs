#!/usr/bin/env node
// Drive the verification instance in headless Chromium over the DevTools protocol.
// No dependencies: needs Node 22+ (global WebSocket/fetch) and `chromium` on PATH.
//
// Usage: drive.mjs <label> <step> [<step> ...]
//   A step is  name|arg|arg  (quote it; | separates the arguments).
//   Steps run in order. The first failure stops the run, saves a
//   <label>.fail.png / <label>.fail.dom.html, and exits 1.
//
//   goto|<path>                    open a site path (waits for the load event)
//   waitfor|<css>[|<ms>]           wait until the selector exists (default 8000)
//   click|<css>                    click the first match
//   click-text|<css>|<substring>   click the first match whose text contains the substring
//   assert-url|<path>              the page path starts with <path> (waits up to 5s)
//   press|<key>                    keypress on the page: "/" "Escape" "Enter" or one character
//   type|<text>                    type into the focused element
//   sleep|<ms>
//   count|<css>                    print the number of matches
//   text|<css>                     print the text of the first match
//   assert-count|<css>|<op>|<n>    op is one of == >= <= > <
//   assert-text|<css>|<substring>  first match's text contains the substring
//   assert-js|<expression>         a page JavaScript expression must be truthy (escape hatch;
//                                  the expression may contain "|")
//   shot|<name>                    screenshot  -> <label>.<name>.png
//   dom|<name>                     DOM         -> <label>.<name>.dom.html
//
// Every step result is appended to <evidence>/<label>.steps.txt (the transcript).
// The browser is a child of this process and is stopped when it ends.

import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const here = new URL('.', import.meta.url).pathname;
process.chdir(execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: here, encoding: 'utf8' }).trim());

const [label, ...steps] = process.argv.slice(2);
if (!label || steps.length === 0) {
  console.error('usage: drive.mjs <label> <step>...   (see the header of this file)');
  process.exit(2);
}
if (!existsSync('.verify/run/port') || !existsSync('.verify/run/run-id')) {
  console.error('no instance: run scripts/launch.sh first');
  process.exit(1);
}
const base = `http://127.0.0.1:${readFileSync('.verify/run/port', 'utf8').trim()}`;
const evidence = join('.verify/evidence', readFileSync('.verify/run/run-id', 'utf8').trim());
mkdirSync(evidence, { recursive: true });
const transcript = join(evidence, `${label}.steps.txt`);
writeFileSync(transcript, '');
const log = (line) => { console.log(line); appendFileSync(transcript, line + '\n'); };

// Start our own headless browser with its own profile. Headless Chromium reports
// (hover: none) like a touch screen; the blink settings make it a mouse desktop.
// Set DRIVE_TOUCH=1 to keep the touch behaviour.
const profile = resolve('.verify/run/chrome-profile-drive');
mkdirSync(profile, { recursive: true });
rmSync(join(profile, 'DevToolsActivePort'), { force: true });
const chrome = spawn('chromium', [
  '--headless', '--disable-gpu', '--hide-scrollbars', '--window-size=1500,1000',
  ...(process.env.DRIVE_TOUCH ? [] : ['--blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4']),
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
const stopBrowser = async () => {
  chrome.kill('SIGTERM');
  await Promise.race([new Promise((r) => chrome.once('exit', r)), sleep(5000)]);
  if (chrome.exitCode === null) chrome.kill('SIGKILL');
};
const watchdog = setTimeout(() => { console.error('driver timeout (120s)'); chrome.kill('SIGKILL'); process.exit(3); }, 120000);

let port;
for (let i = 0; i < 50 && !port; i++) {
  if (existsSync(join(profile, 'DevToolsActivePort'))) port = readFileSync(join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0];
  else await sleep(300);
}
if (!port) { console.error('Chromium did not publish a debug port'); await stopBrowser(); process.exit(1); }

const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = targets.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

let nextId = 0;
const pending = new Map();
const waiters = [];
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(new Error(m.error.message)) : res(m.result);
  } else if (m.method) {
    for (const w of waiters.filter((x) => x.method === m.method)) { waiters.splice(waiters.indexOf(w), 1); w.res(m.params); }
  }
});
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++nextId; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const once = (method, ms = 20000) => new Promise((res, rej) => {
  const w = { method, res }; waiters.push(w);
  setTimeout(() => { const k = waiters.indexOf(w); if (k >= 0) { waiters.splice(k, 1); rej(new Error(`timeout waiting for ${method}`)); } }, ms);
});
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(`page error: ${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}`);
  return r.result.value;
};
await send('Page.enable');
await send('Runtime.enable');

const KEYS = {
  Escape: { key: 'Escape', code: 'Escape', vk: 27 },
  Enter: { key: 'Enter', code: 'Enter', vk: 13, text: '\r' },
  '/': { key: '/', code: 'Slash', vk: 191, text: '/' },
};
const press = async (k) => {
  const d = KEYS[k] ?? { key: k, code: k.length === 1 ? `Key${k.toUpperCase()}` : k, vk: k.toUpperCase().charCodeAt(0), text: k.length === 1 ? k : undefined };
  await send('Input.dispatchKeyEvent', { type: d.text ? 'keyDown' : 'rawKeyDown', key: d.key, code: d.code, windowsVirtualKeyCode: d.vk, text: d.text });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: d.key, code: d.code, windowsVirtualKeyCode: d.vk });
};
const q = (css) => JSON.stringify(css);
const OPS = { '==': (a, b) => a === b, '>=': (a, b) => a >= b, '<=': (a, b) => a <= b, '>': (a, b) => a > b, '<': (a, b) => a < b };

const save = async (name, kind) => {
  if (kind === 'png') {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const f = join(evidence, `${label}.${name}.png`); writeFileSync(f, Buffer.from(data, 'base64')); return f;
  }
  const f = join(evidence, `${label}.${name}.dom.html`);
  writeFileSync(f, await evaluate('document.documentElement.outerHTML')); return f;
};

async function run(step) {
  const [name, a, b, c] = step.split('|');
  switch (name) {
    case 'goto': { const loaded = once('Page.loadEventFired'); await send('Page.navigate', { url: base + a }); await loaded; await sleep(500); return `opened ${a}`; }
    case 'waitfor': {
      const end = Date.now() + Number(b ?? 8000);
      while (Date.now() < end) { if (await evaluate(`!!document.querySelector(${q(a)})`)) return `found ${a}`; await sleep(200); }
      throw new Error(`never appeared: ${a}`);
    }
    case 'click': {
      const r = await evaluate(`(() => { const e = document.querySelector(${q(a)}); if (!e) return 'missing'; e.click(); return 'ok'; })()`);
      if (r !== 'ok') throw new Error(`no element to click: ${a}`);
      await sleep(300); return `clicked ${a}`;
    }
    case 'click-text': {
      const r = await evaluate(`(() => { const e = [...document.querySelectorAll(${q(a)})].find((x) => x.textContent.includes(${q(b)})); if (!e) return 'missing'; e.click(); return 'ok'; })()`);
      if (r !== 'ok') throw new Error(`no ${a} containing ${JSON.stringify(b)}`);
      await sleep(500); return `clicked ${a} containing ${JSON.stringify(b)}`;
    }
    case 'assert-url': {
      let p = '';
      for (let i = 0; i < 25; i++) { p = await evaluate('location.pathname'); if (p.startsWith(a)) return `at ${p}`; await sleep(200); }
      throw new Error(`at ${p}, wanted a path starting with ${a}`);
    }
    case 'press': await press(a); await sleep(300); return `pressed ${a}`;
    case 'type': await send('Input.insertText', { text: a }); await sleep(600); return `typed "${a}"`;
    case 'sleep': await sleep(Number(a)); return `slept ${a}ms`;
    case 'count': return String(await evaluate(`document.querySelectorAll(${q(a)}).length`));
    case 'text': return JSON.stringify(await evaluate(`(document.querySelector(${q(a)})?.textContent ?? '').trim().slice(0, 200)`));
    case 'assert-count': {
      const n = await evaluate(`document.querySelectorAll(${q(a)}).length`);
      if (!OPS[b]) throw new Error(`bad operator ${b}`);
      if (!OPS[b](n, Number(c))) throw new Error(`${a}: found ${n}, wanted ${b} ${c}`);
      return `${a}: ${n} ${b} ${c}`;
    }
    case 'assert-text': {
      const t = await evaluate(`(document.querySelector(${q(a)})?.textContent ?? '')`);
      if (!t.includes(b)) throw new Error(`${a}: text ${JSON.stringify(t.trim().slice(0, 120))} lacks ${JSON.stringify(b)}`);
      return `${a} contains ${JSON.stringify(b)}`;
    }
    case 'assert-js': {
      const expr = step.slice('assert-js|'.length);   // the expression may contain "|", so take the whole remainder
      const v = await evaluate(expr);
      if (!v) throw new Error(`falsy (${JSON.stringify(v)}): ${expr}`);
      return `true: ${expr}`;
    }
    case 'shot': return await save(a, 'png');
    case 'dom': return await save(a, 'dom');
    default: throw new Error(`unknown step: ${name}`);
  }
}

let failed = false;
for (const step of steps) {
  try { log(`PASS ${step}  ->  ${await run(step)}`); }
  catch (e) {
    log(`FAIL ${step}  ->  ${e.message}`);
    try { await save('fail', 'png'); await save('fail', 'dom'); } catch {}
    failed = true; break;
  }
}
clearTimeout(watchdog);
ws.close();
await stopBrowser();
log(failed ? 'DRIVE: FAIL' : 'DRIVE: OK');
process.exit(failed ? 1 : 0);
