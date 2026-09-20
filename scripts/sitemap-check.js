#!/usr/bin/env node
// Sitemap coverage check against indexable source content.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();
const pages = L.loadPages();
const raw = fs.readFileSync(path.join(L.ROOT, 'sitemap.xml'), 'utf8');
const locs = L.sitemapLocs(raw, articles);
const abs = (u) => L.SITE_URL + L.BASEURL + u;

// Expected indexable set
const expected = new Set([abs('/'), abs('/articles/'), abs('/about/'), abs('/search/')]);
for (const c of L.CLUSTERS) expected.add(abs('/topics/' + c + '/'));
for (const a of articles) expected.add(abs(L.articleUrl(a)));

const seen = new Set(); let gaps = 0;
for (const u of locs) {
  if (seen.has(u)) { F.add('P1', 'sitemap.xml', u, 'duplicate sitemap URL', 'Deduplicate'); continue; }
  seen.add(u);
  if (!expected.has(u)) { F.add('P1', 'sitemap.xml', u, 'sitemap URL with no corresponding indexable source page', 'Remove or fix'); }
}
for (const u of expected) {
  if (!seen.has(u)) { F.add('P1', 'sitemap.xml', u, 'indexable URL missing from sitemap', 'Extend sitemap template coverage'); gaps++; }
}
// Excluded content accidentally exposed
for (const bad of ['README', 'docs/', '_queue/', '404']) {
  if (locs.some(u => u.includes(bad))) F.add('P1', 'sitemap.xml', '-', 'excluded content in sitemap: ' + bad, 'Remove from sitemap');
}
// noindex pages in sitemap (source-level scan)
for (const p of pages) {
  if (/noindex/i.test(p.raw) && locs.includes(abs(L.pageUrl(p)))) F.add('P1', p.file, L.pageUrl(p), 'noindex page included in sitemap', 'Remove from sitemap or drop noindex');
}
// Topic hubs omitted
for (const c of L.CLUSTERS) {
  if (!locs.includes(abs('/topics/' + c + '/'))) { F.add('P1', 'sitemap.xml', '/topics/' + c + '/', 'topic hub omitted from sitemap', 'Add hub to sitemap'); gaps++; }
}

const report = { tool: 'sitemap-check', counts: F.counts, gaps, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'sitemap-check.json'), JSON.stringify(report, null, 2));
console.log('sitemap-check: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' gaps=' + gaps);
process.exitCode = F.has(['P0']) ? 1 : 0;
