#!/usr/bin/env node
// JSON-LD schema validation (syntax + known field rules).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const OWNER_FACTS = ['Hanoi Motorbike Rental Nguyen Tu', '112 Nguyen Van Cu Street', '+84 942 467 674', '09:00'];

function checkJsonLd(text, file, url, knownTypes) {
  const blocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const typesSeen = {};
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b[1].trim()); } catch (e) { F.add('P1', file, url, 'invalid JSON-LD: ' + e.message, 'Fix syntax'); continue; }
    const arr = Array.isArray(data) ? data : [data];
    for (const d of arr) {
      const t = d['@type'];
      typesSeen[t] = (typesSeen[t] || 0) + 1;
      if (t === 'Article' || t === 'BlogPosting') {
        if (d.datePublished && d.dateModified && d.datePublished === d.dateModified) F.add('P2', file, url, 'datePublished equals dateModified (backfilled from last_reviewed?)', 'Use real publication date');
        if (d.url && !/^https?:\/\//.test(String(d.url))) F.add('P2', file, url, 'schema URL not absolute', 'Use absolute URL');
      }
      if (t === 'BreadcrumbList') {
        if (!Array.isArray(d.itemListElement)) F.add('P1', file, url, 'BreadcrumbList without itemListElement', 'Fix schema');
      }
      if (t === 'LocalBusiness') {
        const s = JSON.stringify(d);
        for (const fact of OWNER_FACTS) if (s.includes(fact)) { /* consistent with owner facts */ }
        // Flag invented-looking claims
        for (const bad of ['aggregateRating', 'review', 'priceRange', 'openingHours.*24']) {
          if (new RegExp(bad.replace('.', '\\.'), 'i').test(s)) F.add('P1', file, url, 'LocalBusiness contains ' + bad + ' (not in OWNER-FACTS)', 'Remove invented business claims');
        }
      }
    }
  }
  return typesSeen;
}

const articles = L.loadArticles();
const pages = L.loadPages();

// Article layout emits BlogPosting JSON-LD dynamically; article files themselves should not conflict
for (const a of articles) {
  const types = checkJsonLd(a.body, a.file, L.articleUrl(a));
  if (types.BlogPosting || types.Article) F.add('P2', a.file, L.articleUrl(a), 'article body contains its own Article schema (layout also emits one)', 'Remove duplicate schema block');
  // Layout contract: datePublished defaults to last_reviewed — flag articles where that would be wrong
  if (!a.fm.date_published && a.fm.last_reviewed) F.add('P2', a.file, L.articleUrl(a), 'layout datePublished falls back to last_reviewed; add date_published', 'Add date_published front matter');
}
for (const p of pages) {
  checkJsonLd(p.raw, p.file, L.pageUrl(p));
  if (p.file.startsWith('topics/') && !p.raw.includes('CollectionPage') && p.fm.layout === 'cluster') F.add('P3', p.file, L.pageUrl(p), 'hub without CollectionPage schema', 'Consider adding it');
}
// Duplicate conflicting schema blocks on the same page
for (const p of pages) {
  const n = (p.raw.match(/application\/ld\+json/g) || []).length;
  if (n > 2) F.add('P2', p.file, L.pageUrl(p), n + ' JSON-LD blocks on one page', 'Consolidate');
}

const report = { tool: 'schema-check', counts: F.counts, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'schema-check.json'), JSON.stringify(report, null, 2));
console.log('schema-check: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' blocking=' + F.blocking.length);
process.exitCode = F.hasBlocking ? 1 : 0;
