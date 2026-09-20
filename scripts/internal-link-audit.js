#!/usr/bin/env node
// Internal link audit: broken links, orphans, hub<->article connectivity.
// Orphan detection is Liquid/Jekyll-aware: cluster.html lists articles dynamically
// by topic_cluster, articles/index.md lists all articles dynamically, and the
// homepage lists the latest six. An article reached through those templates is
// NOT an orphan even if no raw source file contains its literal URL.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();
const pages = L.loadPages();
const slugs = new Set(articles.map(a => a.fm.slug).filter(Boolean));
const knownUrls = new Set(articles.map(L.articleUrl).concat(pages.map(L.pageUrl)).concat(L.CLUSTERS.map(c => '/topics/' + c + '/')).concat(['/']));

const linkSources = [];
for (const a of articles) linkSources.push({ kind: 'article', file: a.file, url: L.articleUrl(a), fm: a.fm, body: a.body });
for (const p of pages) if (!p.file.startsWith('_layouts') && !p.file.startsWith('_includes')) linkSources.push({ kind: 'page', file: p.file, url: L.pageUrl(p), fm: p.fm, body: p.body, raw: p.raw });

let broken = 0, orphan = 0;
const inbound = {}; // article slug/url -> count of explicit inbound links
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
  // tally explicit inbound links for articles
  const hay = links.join(' ') + ' ' + viaTargets;
  for (const a of articles) {
    const s = a.fm.slug;
    if (s && hay.includes(s)) inbound[s] = (inbound[s] || 0) + 1;
    if (hay.includes(L.articleUrl(a))) inbound[s] = (inbound[s] || 0) + 1;
  }
}
for (const a of articles) {
  const s = a.fm.slug;
  // Liquid-aware orphan rule: dynamically listed via valid hub + all-guides index
  if (L.isDynamicallyListed(a)) continue;
  if (s && !inbound[s]) { F.add('P2', a.file, L.articleUrl(a), 'orphan article: no internal links point to it (explicit or dynamic)', 'Assign a valid topic_cluster with an existing hub, or link it explicitly'); orphan++; }
}

const report = { tool: 'internal-link-audit', counts: F.counts, brokenLinks: broken, orphans: orphan, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'internal-link-audit.json'), JSON.stringify(report, null, 2));
console.log('internal-link-audit: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' broken=' + broken + ' orphans=' + orphan + ' blocking=' + F.blocking.length);
process.exitCode = F.hasBlocking ? 1 : 0;
