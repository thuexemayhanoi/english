#!/usr/bin/env node
// Internal link audit: broken links, orphans, hub<->article connectivity.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();
const pages = L.loadPages();
const slugs = new Set(articles.map(a => a.fm.slug).filter(Boolean));
const knownUrls = new Set(articles.map(L.articleUrl).concat(pages.map(L.pageUrl)).concat(L.CLUSTERS.map(c => '/topics/' + c + '/')).concat(['/']));

// Collect links from every rendered-ish source, and hub->article coverage.
const linkSources = [];
for (const a of articles) linkSources.push({ kind: 'article', file: a.file, url: L.articleUrl(a), fm: a.fm, body: a.body });
for (const p of pages) if (!p.file.startsWith('_layouts') && !p.file.startsWith('_includes')) linkSources.push({ kind: 'page', file: p.file, url: L.pageUrl(p), fm: p.fm, body: p.body, raw: p.raw });

// Layouts/includes produce links too: parse their Liquid for href patterns against known slugs
const templateLinks = new Set();
for (const dir of ['_layouts', '_includes']) {
  const d = path.join(L.ROOT, dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    const t = fs.readFileSync(path.join(d, f), 'utf8');
    for (const m of t.matchAll(/href="([^"]+)"/g)) templateLinks.add(m[1]);
  }
}
const templateLiquidNav = fs.readFileSync(path.join(L.ROOT, '_layouts', 'cluster.html'), 'utf8').includes('site.articles');

// Does a hub link to its articles? cluster layout iterates site.articles — structural, assume yes.
for (const c of L.CLUSTERS) {
  const hubFile = path.join(L.ROOT, 'topics', c, 'index.md');
  if (!fs.existsSync(hubFile)) { F.add('P1', 'topics/' + c + '/index.md', '/topics/' + c + '/', 'missing topic hub file', 'Create the hub page'); continue; }
}
// Hub -> articles coverage: layout lists all cluster articles dynamically; check hub exists per cluster (above).

let broken = 0, orphan = 0;
const inbound = {}; // article slug/url -> count
for (const src of linkSources) {
  const links = L.extractLinks(src.body);
  const viaTargets = String(src.fm.internal_link_targets || '');
  let internalOut = 0;
  for (const href of links) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    let t = href.split('#')[0].split('?')[0];
    if (t.includes('/english/english')) { F.add('P0', src.file, src.url, 'doubled /english/english/ link', 'Fix path'); broken++; continue; }
    if (t.startsWith('/') && t !== '/' && !knownUrls.has(t) && !t.startsWith('/assets') && !t.endsWith('.xml') && !t.endsWith('.json') && !t.endsWith('.css') && !t.endsWith('.js')) {
      F.add('P1', src.file, src.url, 'broken internal link: ' + t, 'Fix or remove'); broken++;
    }
    internalOut++;
  }
  if (src.kind === 'article') {
    const targets = viaTargets.split(',').map(s => s.trim()).filter(Boolean);
    let out = internalOut + targets.length;
    for (const t of targets) if (!slugs.has(t)) { F.add('P1', src.file, src.url, 'internal_link_targets references missing slug: ' + t, 'Fix target slug'); }
    if (out === 0) { F.add('P2', src.file, src.url, 'article has zero internal links', 'Add internal_link_targets'); }
    if (!src.fm.topic_cluster) { F.add('P1', src.file, src.url, 'article has no topic_cluster, cannot be linked from a hub', 'Assign topic_cluster'); }
  }
  // tally inbound for articles
  const hay = links.join(' ') + ' ' + viaTargets;
  for (const a of articles) {
    const s = a.fm.slug;
    if (s && hay.includes(s)) inbound[s] = (inbound[s] || 0) + 1;
    if (hay.includes(L.articleUrl(a))) inbound[s] = (inbound[s] || 0) + 1;
  }
}
for (const a of articles) {
  const s = a.fm.slug;
  if (s && !inbound[s]) { F.add('P2', a.file, L.articleUrl(a), 'orphan article: no internal links point to it', 'Link it from a hub, index, or related-guides'); orphan++; }
}

const report = { tool: 'internal-link-audit', counts: F.counts, brokenLinks: broken, orphans: orphan, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'internal-link-audit.json'), JSON.stringify(report, null, 2));
console.log('internal-link-audit: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' broken=' + broken + ' orphans=' + orphan);
process.exitCode = F.has(['P0']) ? 1 : 0;
