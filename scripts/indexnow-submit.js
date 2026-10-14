#!/usr/bin/env node
// INDEXNOW SUBMISSION — tells the IndexNow search engines (Bing, Yandex, Seznam,
// Naver and partners) which URLs of the live site changed, so a new or edited guide
// is crawled within hours instead of whenever the crawler returns. Google does not
// use IndexNow; Google discovery stays with the sitemap and Search Console (owner).
//
// Zero dependencies. Safe by construction:
//   - only URLs present in the LIVE sitemap are ever submitted (never a draft, never
//     a URL outside https://en.rentbikehanoi.com);
//   - the key file (<key>.txt at the repo root, served at the site root) must be live
//     before anything is sent, so a submission can never race the Pages deploy;
//   - nothing in the repository is modified; the only side effect is reports/indexnow.json.
//
// Usage:
//   node scripts/indexnow-submit.js --all                      every sitemap URL (first run / full refresh)
//   node scripts/indexnow-submit.js --since <sha> --until <sha> URLs whose source files changed between two commits
//   node scripts/indexnow-submit.js --urls /articles/a/,/faq/   explicit paths or absolute URLs
//   add --dry-run to list without sending, --no-wait to skip the key-file liveness wait.
'use strict';
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execFileSync } = require('child_process');
const L = require('./lib');

const ROOT = L.ROOT;
const SITE = L.SITE_URL.replace(/\/$/, '');
const HOST = new URL(SITE).host;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000;
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = n => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const log = (...a) => console.log('indexnow:', ...a);
function fail(msg, code) { console.error('indexnow: ' + msg); process.exit(code == null ? 1 : code); }

const keyFile = fs.readdirSync(ROOT).find(f => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) fail('no IndexNow key file (<32 hex chars>.txt) at the repository root');
const KEY = fs.readFileSync(path.join(ROOT, keyFile), 'utf8').trim();
if (KEY !== keyFile.replace(/\.txt$/, '')) fail('the key file must contain exactly its own file name without .txt');
const KEY_LOCATION = SITE + '/' + keyFile;

function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = body == null ? null : Buffer.from(JSON.stringify(body));
    const req = https.request({ method, hostname: u.hostname, path: u.pathname + u.search, headers: Object.assign({ 'User-Agent': 'en.rentbikehanoi.com indexnow-submit (GitHub Actions)' }, data ? { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': data.length } : {}) }, res => {
      let out = ''; res.setEncoding('utf8'); res.on('data', c => { out += c; }); res.on('end', () => resolve({ status: res.statusCode, body: out }));
    });
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function liveSitemapUrls() {
  const r = await request('GET', SITE + '/sitemap.xml');
  if (r.status !== 200) fail('live sitemap returned HTTP ' + r.status);
  const locs = [...r.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => m[1].trim());
  if (locs.length < 10) fail('live sitemap has only ' + locs.length + ' URLs; refusing to submit');
  return new Set(locs);
}

// Source files -> canonical URLs, using the same rules as the audits (lib.js).
function urlsForFiles(files) {
  const articles = L.loadArticles(); const pages = L.loadPages();
  const out = new Set();
  for (const f of files) {
    const a = articles.find(x => x.file === f); if (a) { out.add(SITE + L.articleUrl(a)); continue; }
    const p = pages.find(x => x.file === f); if (p) { out.add(SITE + L.pageUrl(p)); continue; }
    const hub = f.match(/^topics\/([a-z0-9-]+)\/index\.md$/); if (hub) out.add(SITE + '/topics/' + hub[1] + '/');
  }
  return out;
}
function changedFiles(since, until) {
  const out = execFileSync('git', ['diff', '--name-only', '--diff-filter=AMR', since, until], { cwd: ROOT, encoding: 'utf8' });
  return out.split('\n').map(s => s.trim()).filter(Boolean);
}

async function waitForKey() {
  for (let i = 1; i <= 24; i++) {
    try { const r = await request('GET', KEY_LOCATION); if (r.status === 200 && r.body.trim() === KEY) return true; log('key file not live yet (HTTP ' + r.status + '), attempt ' + i + '/24'); }
    catch (e) { log('key file check failed: ' + e.message + ', attempt ' + i + '/24'); }
    await sleep(30000);
  }
  return false;
}

async function submit(urlList) {
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  let last = null;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      last = await request('POST', ENDPOINT, payload);
      if (last.status === 200 || last.status === 202) return last;
      if (last.status === 429 || last.status >= 500) { log('HTTP ' + last.status + ', retrying in ' + (attempt * 15) + 's'); await sleep(attempt * 15000); continue; }
      return last; // 400 invalid format, 403 key not valid, 422 URLs not owned by host: not retryable
    } catch (e) { log('request failed: ' + e.message + ', attempt ' + attempt + '/4'); await sleep(attempt * 15000); }
  }
  return last || { status: 0, body: 'no response' };
}

(async () => {
  const mode = flag('--all') ? 'all' : opt('--urls') ? 'urls' : (opt('--since') && opt('--until')) ? 'changed' : null;
  if (!mode) fail('usage: --all | --since <sha> --until <sha> | --urls <paths>', 2);
  const live = await liveSitemapUrls();
  let wanted;
  if (mode === 'all') wanted = new Set(live);
  else if (mode === 'urls') wanted = new Set(opt('--urls').split(',').map(s => s.trim()).filter(Boolean).map(u => /^https?:\/\//.test(u) ? u : SITE + (u.startsWith('/') ? u : '/' + u)));
  else {
    const files = changedFiles(opt('--since'), opt('--until'));
    wanted = urlsForFiles(files);
    log(files.length + ' changed files -> ' + wanted.size + ' candidate URLs');
    // A shared layout/include/data change touches every page; submit the hubs and key pages
    // rather than the whole site, so IndexNow never sees 1,000 unchanged URLs after a CSS tweak.
    if (files.some(f => /^(_layouts|_includes|_data)\//.test(f) || f === 'sitemap.xml')) for (const u of live) if (/\/topics\/[a-z0-9-]+\/$/.test(u) || /^https?:\/\/[^/]+\/$/.test(u)) wanted.add(u);
  }
  const urlList = [...wanted].filter(u => live.has(u)).slice(0, MAX_URLS);
  const skipped = [...wanted].filter(u => !live.has(u));
  if (skipped.length) log('not in the live sitemap, skipped: ' + skipped.join(', '));
  const report = { date: new Date().toISOString(), mode, host: HOST, keyLocation: KEY_LOCATION, requested: wanted.size, submitted: urlList.length, skippedNotInSitemap: skipped.length, dryRun: flag('--dry-run'), status: null, urls: urlList.slice(0, 200) };
  if (!urlList.length) { log('nothing to submit'); write(report); return; }
  log(urlList.length + ' URL(s) to submit' + (flag('--dry-run') ? ' (dry run)' : ''));
  for (const u of urlList.slice(0, 20)) log('  ' + u);
  if (urlList.length > 20) log('  ... and ' + (urlList.length - 20) + ' more');
  if (flag('--dry-run')) { write(report); return; }
  if (!flag('--no-wait') && !(await waitForKey())) fail('key file ' + KEY_LOCATION + ' never came live; nothing submitted');
  const res = await submit(urlList);
  report.status = res.status;
  write(report);
  if (res.status === 200 || res.status === 202) log('accepted (HTTP ' + res.status + ')');
  else fail('rejected: HTTP ' + res.status + ' ' + String(res.body).slice(0, 200));
})().catch(e => fail(e.stack || e.message));

function write(report) {
  fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'reports', 'indexnow.json'), JSON.stringify(report, null, 1) + '\n');
}
