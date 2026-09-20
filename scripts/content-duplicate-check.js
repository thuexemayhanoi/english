#!/usr/bin/env node
// Duplicate / cannibalization precheck (exact + near-duplicate heuristics).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
const stop = new Set(['the','and','for','you','your','with','what','how','why','are','can','from','that','this','have','need','when','where','not','does','viet','vietnam','hanoi','motorbike','motorcycle','guide','rules','law']);
const tokens = (s) => norm(s).filter(w => !stop.has(w));

// Exact duplicates
const seenTitle = {}, seenSlug = {}, seenDesc = {}, seenQuery = {};
for (const a of articles) {
  const t = String(a.fm.title || '').trim().toLowerCase();
  if (t) { if (seenTitle[t]) F.add('P1', a.file, L.articleUrl(a), 'exact duplicate title with ' + seenTitle[t], 'Differentiate the intent'); else seenTitle[t] = a.file; }
  const s = String(a.fm.slug || '').trim();
  if (s) { if (seenSlug[s]) F.add('P0', a.file, L.articleUrl(a), 'exact duplicate slug with ' + seenSlug[s], 'Slugs must be unique'); else seenSlug[s] = a.file; }
  const d = String(a.fm.description || '').trim().toLowerCase();
  if (d) { if (seenDesc[d]) F.add('P1', a.file, L.articleUrl(a), 'exact duplicate description with ' + seenDesc[d], 'Rewrite'); else seenDesc[d] = a.file; }
  const q = String(a.fm.primary_query || a.fm.search_intent || '').trim().toLowerCase();
  if (a.fm.primary_query) { if (seenQuery[q]) F.add('P1', a.file, L.articleUrl(a), 'duplicate primary_query with ' + seenQuery[q], 'Split or merge intents'); else seenQuery[q] = a.file; }
}

// Near-duplicate: title token Jaccard > 0.6
function jaccard(a, b) { const A = new Set(tokens(a)), B = new Set(tokens(b)); if (!A.size || !B.size) return 0; let inter = 0; for (const x of A) if (B.has(x)) inter++; return inter / (A.size + B.size - inter); }
for (let i = 0; i < articles.length; i++) {
  for (let j = i + 1; j < articles.length; j++) {
    const t1 = String(articles[i].fm.title || ''), t2 = String(articles[j].fm.title || '');
    const sim = jaccard(t1, t2);
    if (sim > 0.6) F.add('P2', articles[j].file, L.articleUrl(articles[j]), 'near-duplicate title (similarity ' + sim.toFixed(2) + ') vs ' + articles[i].file, 'Manual review: split or differentiate');
    const h1 = L.findH1s(articles[i].body)[0], h2 = L.findH1s(articles[j].body)[0];
    if (h1 && h2 && jaccard(h1, h2) > 0.7) F.add('P3', articles[j].file, L.articleUrl(articles[j]), 'repeated H1 pattern vs ' + articles[i].file, 'Vary structure');
  }
}

const report = { tool: 'content-duplicate-check', counts: F.counts, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'content-duplicate-check.json'), JSON.stringify(report, null, 2));
console.log('content-duplicate-check: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3);
process.exitCode = F.has(['P0']) ? 1 : 0;
