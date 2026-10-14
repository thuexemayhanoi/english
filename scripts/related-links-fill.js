#!/usr/bin/env node
// RELATED LINKS FILL — give every article at least two explicit inbound links.
//
// An article is "dynamically listed" by its hub and the all-guides index, but
// 120 articles had no explicit inbound link at all (no other article names them
// in internal_link_targets, no body link). This tool adds the article's slug to
// the internal_link_targets of two closely related articles, which the article
// layout renders as "Related guides" cards. Front matter only; prose untouched.
//
// Source selection (deterministic): articles in the same subcluster, else the
// same cluster; prefer articles the orphan itself already links to (a natural
// reciprocal pair), then those with the fewest existing targets; never more
// than MAX_TARGETS targets on a source; never self; never duplicates.
//
// Usage: node scripts/related-links-fill.js            (dry run, prints plan)
//        node scripts/related-links-fill.js --apply
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const APPLY = process.argv.includes('--apply');
const WANT_INBOUND = 2;
const MAX_TARGETS = 9;

const articles = L.loadArticles();
const bySlug = {}; for (const a of articles) bySlug[a.fm.slug] = a;
const targetsOf = a => String(a.fm.internal_link_targets || '').split(',').map(s => s.trim()).filter(Boolean);
// --same-silo: count only inbound cards from articles in the same topic cluster, so an
// article whose cards all come from other silos is treated as needing a same-silo card.
const SAME_SILO = process.argv.includes('--same-silo');
const inbound = {};
for (const a of articles) for (const t of targetsOf(a)) { if (SAME_SILO && bySlug[t] && bySlug[t].fm.topic_cluster !== a.fm.topic_cluster) continue; inbound[t] = (inbound[t] || 0) + 1; }
const bodyIn = {};
for (const a of articles) for (const h of L.extractLinks(a.body)) { const m = h.match(/^\/articles\/([a-z0-9-]+)\/?$/); if (m) bodyIn[m[1]] = (bodyIn[m[1]] || 0) + 1; }

const pending = {}; // source slug -> [new target slugs]
const plan = [];
for (const a of articles) {
  const s = a.fm.slug;
  const have = (inbound[s] || 0) + (bodyIn[s] || 0);
  if (have >= WANT_INBOUND) continue;
  const need = WANT_INBOUND - have;
  const own = new Set(targetsOf(a));
  const candidates = articles.filter(b => b.fm.slug !== s && b.fm.topic_cluster === a.fm.topic_cluster);
  const score = b => {
    const bt = targetsOf(b).concat(pending[b.fm.slug] || []);
    if (bt.includes(s) || bt.length >= MAX_TARGETS) return null;
    let sc = 0;
    if (String(b.fm.subcluster || '') === String(a.fm.subcluster || '')) sc += 10;
    if (own.has(b.fm.slug)) sc += 5;
    sc -= bt.length * 0.1;
    return sc;
  };
  const ranked = candidates.map(b => ({ b, sc: score(b) })).filter(x => x.sc !== null).sort((x, y) => y.sc - x.sc || x.b.fm.slug.localeCompare(y.b.fm.slug));
  const chosen = ranked.slice(0, need).map(x => x.b.fm.slug);
  for (const src of chosen) (pending[src] = pending[src] || []).push(s);
  plan.push({ article: s, had: have, sources: chosen });
}

let written = 0;
if (APPLY) {
  for (const [src, add] of Object.entries(pending)) {
    const a = bySlug[src];
    const current = targetsOf(a);
    const next = current.concat(add.filter(t => !current.includes(t)));
    const line = 'internal_link_targets: "' + next.join(', ') + '"';
    const re = /^internal_link_targets:.*$/m;
    if (!re.test(a.raw)) { console.error('no internal_link_targets line in ' + a.file); process.exitCode = 1; continue; }
    fs.writeFileSync(path.join(L.ROOT, a.file), a.raw.replace(re, line));
    written++;
  }
}
console.log((APPLY ? 'APPLIED' : 'DRY RUN') + ': ' + plan.length + ' article(s) below ' + WANT_INBOUND + ' explicit inbound links; ' + Object.keys(pending).length + ' source article(s) receive new related targets' + (APPLY ? '; files written: ' + written : ''));
for (const p of plan.slice(0, 12)) console.log('  ' + p.article + ' (had ' + p.had + ') <- ' + p.sources.join(', '));
if (plan.length > 12) console.log('  … ' + (plan.length - 12) + ' more');
const unfilled = plan.filter(p => p.sources.length < WANT_INBOUND - p.had);
if (unfilled.length) console.log('Could not fully fill: ' + unfilled.map(p => p.article).join(', '));
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', APPLY ? 'related-links-fill.json' : 'related-links-fill-dry-run.json'), JSON.stringify({ tool: 'related-links-fill', mode: APPLY ? 'apply' : 'dry-run', generated: new Date().toISOString(), plan, sources: pending }, null, 2));
