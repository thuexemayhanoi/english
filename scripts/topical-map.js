#!/usr/bin/env node
// TOPICAL MAP (Weapon 06) — the Pillar–Hub–Silo map of the site with evidence.
//
// Reads the live source tree (lib.js), the hand-authored keyword ownership map, the
// English SEO Master Matrix JSON (keyword-universe mapping, content gap register, row
// priorities) and the research evidence, and writes docs/seo/topical-map.{json,md}:
//   - one node per topic cluster: hub, articles, subclusters, words, review state,
//     priorities, silo integrity (in-silo vs cross-silo in-body links, articles with no
//     in-silo inbound link, hub start-here links), most-linked URLs, money pages;
//   - demand per cluster and market from the keyword universe (third-party estimates
//     already mapped to serving URLs by the matrix engine), owned keywords, SERP
//     questions served, gaps;
//   - keyword clusters by serving URL (intent mix, weak matches) and split keyword
//     families (one stemmed family served by several URLs = cannibalisation risk);
//   - deterministic recommendations, every one REVIEW_REQUIRED: tooling never adds
//     articles, rewrites prose or changes a URL (AGENTS.md).
// Runs after scripts/english-seo-matrix.js; without the matrix it still writes the
// link-graph part and says what is missing. Zero dependencies.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const ROOT = L.ROOT;
const OUT_DIR = path.join(ROOT, 'docs', 'seo');
const TODAY = new Date().toISOString().slice(0, 10);
const readJSON = (p, fb) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return fb; } };
const mdCell = v => String(v == null ? '' : v).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

// ---------- inputs ----------
const articles = L.loadArticles();
const pages = L.loadPages();
const matrix = readJSON(path.join(OUT_DIR, 'english-seo-master-matrix.json'), null);
const kwTargets = readJSON(path.join(OUT_DIR, 'keyword-targets.json'), { groups: [] });
const evidence = readJSON(path.join(OUT_DIR, 'keyword-evidence.json'), {});
const missing = [];
if (!matrix) missing.push('docs/seo/english-seo-master-matrix.json (run scripts/english-seo-matrix.js first): demand, keyword clusters and the SERP register are empty');
const mapped = matrix && matrix.summary && matrix.summary.keywordUniverse ? matrix.summary.keywordUniverse.mapped || [] : [];
const register = matrix && matrix.summary ? matrix.summary.contentGaps || [] : [];
const rowsByUrl = {}; if (matrix) for (const r of matrix.rows || []) rowsByUrl[r.url] = r;

// ---------- nodes ----------
const SITE = L.SITE_URL.replace(/\/$/, '');
function normHref(href) {
  let h = String(href || '').trim();
  if (!h || /^(mailto:|tel:|javascript:)/i.test(h)) return null;
  if (/^https?:\/\//i.test(h)) { if (!h.startsWith(SITE)) return null; h = h.slice(SITE.length) || '/'; }
  if (!h.startsWith('/')) return null;
  h = h.split('#')[0].split('?')[0]; if (!h) return null;
  if (!/\.[a-z0-9]+$/i.test(h) && !h.endsWith('/')) h += '/';
  return h;
}
const words = s => L.stripLiquid(String(s || '')).replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#*_>|-]+/g, ' ').split(/\s+/).filter(w => /[a-z0-9]/i.test(w)).length;
const nodes = {};
for (const a of articles) {
  const url = L.articleUrl(a);
  const targets = a.fm.internal_link_targets; const rel = (Array.isArray(targets) ? targets : String(targets || '').split(',')).map(s => String(s).trim()).filter(Boolean).map(s => '/articles/' + s.toLowerCase() + '/');
  nodes[url] = { url, type: 'article', cluster: String(a.fm.topic_cluster || ''), subcluster: String(a.fm.subcluster || ''), title: String(a.fm.title || ''), intent: String(a.fm.search_intent || 'informational'), words: words(a.body), reviewStatus: String(a.fm.review_status || 'VERIFIED'), lastReviewed: String(a.fm.last_reviewed || ''), bodyOut: new Set(L.extractLinks(a.body).map(normHref).filter(h => h && h !== url)), relatedOut: new Set(rel.filter(h => h !== url)) };
}
const hubs = {};
for (const p of pages) {
  const hm = p.file.match(/^topics\/([a-z0-9-]+)\/index\.md$/); const url = hm ? '/topics/' + hm[1] + '/' : L.pageUrl(p);
  nodes[url] = { url, type: hm ? 'hub' : 'page', cluster: hm ? hm[1] : '', subcluster: '', title: String(p.fm.title || ''), intent: hm ? 'pillar' : '', words: words(p.body), reviewStatus: '', lastReviewed: '', bodyOut: new Set(L.extractLinks(p.body).map(normHref).filter(h => h && h !== url)), relatedOut: new Set() };
  if (hm) hubs[hm[1]] = nodes[url];
}
const clusterOf = url => (nodes[url] && nodes[url].cluster) || '';

// ---------- edges ----------
const inBody = {}, inRelated = {}, inSiloBody = {}, crossEdges = {};
const addIn = (map, url, from) => { (map[url] = map[url] || new Set()).add(from); };
for (const n of Object.values(nodes)) {
  for (const t of n.bodyOut) {
    if (!nodes[t]) continue;
    addIn(inBody, t, n.url);
    const same = n.cluster && n.cluster === clusterOf(t);
    if (same) addIn(inSiloBody, t, n.url);
    else if (n.type !== 'page' && nodes[t].type !== 'page') { const k = (n.cluster || '(site)') + '>' + (clusterOf(t) || '(site)'); crossEdges[k] = (crossEdges[k] || 0) + 1; }
  }
  for (const t of n.relatedOut) if (nodes[t]) addIn(inRelated, t, n.url);
}

// ---------- keyword ownership ----------
const owned = {}; // cluster -> [{keyword, owner, coverage, variant}]
const coverageByKw = {}; if (matrix && matrix.summary) for (const k of matrix.summary.keywordOwnership || []) coverageByKw[k.keyword + '|' + k.owner] = k.coverage;
for (const g of kwTargets.groups || []) for (const k of g.keywords || []) {
  const c = clusterOf(k.owner) || '(site)';
  (owned[c] = owned[c] || []).push({ keyword: k.keyword, owner: k.owner, coverage: coverageByKw[k.keyword + '|' + k.owner] || '', variant: !!k.variant_of, gap: !!k.gap });
}

// ---------- demand (keyword universe mapped by the matrix) ----------
const TOPIC_CLUSTER = { 'rental-hanoi': 'rental', 'monthly-rental': 'monthly-rental', 'rental-vietnam': 'vietnam-travel', 'licence-and-paperwork': 'law-licences', vehicles: 'scooters', 'riding-and-safety': 'safety', 'routes-and-trips': 'trips', 'buying-vs-renting': 'rental', maintenance: 'maintenance', 'parts-and-gear': 'parts-gear', general: '' };
const markets = matrix && matrix.summary && matrix.summary.keywordUniverse ? Object.keys(matrix.summary.keywordUniverse.volumeByMarket || {}) : [];
const demand = {}; // cluster -> { keywords, weak, volume: {m: n}, rows: [] }
const demandGaps = {}; // suggested cluster -> rows
for (const r of mapped) {
  if (r.relevance !== 'core') continue;
  if (!r.servedBy) { const c = TOPIC_CLUSTER[r.topic] || '(unassigned)'; (demandGaps[c] = demandGaps[c] || []).push(r); continue; }
  const c = clusterOf(r.servedBy) || '(site)';
  const d = demand[c] = demand[c] || { keywords: 0, weak: 0, volume: {}, rows: [] };
  d.keywords++; if (r.strength === 'partial') d.weak++; d.rows.push(r);
  for (const [m, v] of Object.entries(r.volume || {})) d.volume[m] = (d.volume[m] || 0) + (v || 0);
}

// ---------- SERP register per cluster ----------
const serpServed = {}; const serpGaps = register.filter(g => g.gap);
for (const g of register) if (g.servedBy) { const c = clusterOf(g.servedBy) || '(site)'; (serpServed[c] = serpServed[c] || []).push(g); }

// ---------- keyword clusters by serving URL + split families ----------
const STOP = new Set('a an the of for to in on and or with your you our this that is are how what when where why which who do does can at by from vs versus i my it its be need needed want get'.split(' '));
const stem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/s$/, '').replace(/(ing|ers|er|ed|es|al)$/, '').replace(/licenc/, 'licens').replace(/motorcycl/, 'motorbik').replace(/^rental$/, 'rent').replace(/^hir$/, 'hire').replace(/^vietnamese$/, 'vietnam');
const sig = s => [...new Set(String(s).toLowerCase().split(/[^a-z0-9]+/).filter(w => w && !STOP.has(w)).map(stem).filter(w => w.length > 1))].sort().join(' ');
const byUrl = {};
for (const r of mapped) {
  if (r.relevance !== 'core' || !r.servedBy) continue;
  const k = byUrl[r.servedBy] = byUrl[r.servedBy] || { url: r.servedBy, type: nodes[r.servedBy] ? nodes[r.servedBy].type : 'page', cluster: clusterOf(r.servedBy), keywords: [], volume: {}, intents: {}, weak: 0, flags: [] };
  k.keywords.push(r.keyword); if (r.strength === 'partial') k.weak++;
  const it = r.intent || 'unknown'; k.intents[it] = (k.intents[it] || 0) + 1;
  for (const [m, v] of Object.entries(r.volume || {})) k.volume[m] = (k.volume[m] || 0) + (v || 0);
}
const maxVol = v => Math.max(0, ...Object.values(v || {}).map(x => x || 0));
for (const k of Object.values(byUrl)) {
  const commercial = (k.intents.commercial || 0) + (k.intents.transactional || 0), info = k.intents.informational || 0;
  if (k.type === 'article' && commercial && info) k.flags.push('mixed intent (' + commercial + ' commercial/transactional, ' + info + ' informational): keep one primary intent, let the hub carry the rest');
  if (k.weak === k.keywords.length) k.flags.push('served only by partial matches: the page does not name these keywords');
  if (k.type === 'article' && k.keywords.filter(kw => { const r = mapped.find(x => x.keyword === kw); return r && maxVol(r.volume) >= 100; }).length >= 2) k.flags.push('head terms land on an article: make sure the hub links it in Start here');
}
const keywordClusters = Object.values(byUrl).sort((a, b) => maxVol(b.volume) - maxVol(a.volume) || a.url.localeCompare(b.url));
const families = {};
for (const r of mapped) { if (r.relevance !== 'core' || !r.servedBy) continue; const f = sig(r.keyword); (families[f] = families[f] || { family: f, urls: new Set(), keywords: [] }); families[f].urls.add(r.servedBy); families[f].keywords.push(r.keyword); }
const splitFamilies = Object.values(families).filter(f => f.urls.size > 1).map(f => ({ family: f.family, urls: [...f.urls].sort(), keywords: f.keywords.sort() })).sort((a, b) => b.urls.length - a.urls.length || a.family.localeCompare(b.family));

// ---------- per-cluster assembly ----------
const clusters = L.CLUSTERS.map(c => {
  const arts = Object.values(nodes).filter(n => n.type === 'article' && n.cluster === c);
  const hub = hubs[c] || null;
  const startHere = hub ? [...hub.bodyOut].filter(h => /^\/articles\//.test(h) && nodes[h]).length : 0;
  const startHereOwn = hub ? [...hub.bodyOut].filter(h => nodes[h] && clusterOf(h) === c).length : 0;
  let inSilo = 0, crossOut = 0, crossIn = 0;
  for (const a of arts) for (const t of a.bodyOut) { if (!nodes[t] || nodes[t].type === 'page') continue; if (clusterOf(t) === c) inSilo++; else crossOut++; }
  for (const n of Object.values(nodes)) if (n.type !== 'page' && n.cluster !== c) for (const t of n.bodyOut) if (nodes[t] && clusterOf(t) === c) crossIn++;
  const noInSiloInbound = arts.filter(a => !(inSiloBody[a.url] && inSiloBody[a.url].size)).map(a => a.url).sort();
  const topInbound = arts.map(a => ({ url: a.url, inbound: inBody[a.url] ? inBody[a.url].size : 0, related: inRelated[a.url] ? inRelated[a.url].size : 0 })).sort((x, y) => y.inbound - x.inbound || y.related - x.related || x.url.localeCompare(y.url)).slice(0, 5);
  const money = arts.filter(a => a.intent === 'commercial').map(a => ({ url: a.url, inbound: inBody[a.url] ? inBody[a.url].size : 0, inSiloInbound: inSiloBody[a.url] ? inSiloBody[a.url].size : 0, related: inRelated[a.url] ? inRelated[a.url].size : 0, priority: rowsByUrl[a.url] ? rowsByUrl[a.url].priority : '' })).sort((x, y) => x.inSiloInbound - y.inSiloInbound || x.url.localeCompare(y.url));
  const sub = {}; for (const a of arts) sub[a.subcluster || '(none)'] = (sub[a.subcluster || '(none)'] || 0) + 1;
  const pri = { P0: 0, P1: 0, P2: 0, P3: 0 }; for (const a of arts) { const r = rowsByUrl[a.url]; if (r && pri[r.priority] != null) pri[r.priority]++; }
  const reviewed = arts.map(a => a.lastReviewed).filter(Boolean).sort();
  const own = (owned[c] || []);
  const d = demand[c] || { keywords: 0, weak: 0, volume: {}, rows: [] };
  return {
    cluster: c, hub: hub ? { url: hub.url, title: hub.title, words: hub.words, startHereLinks: startHere, startHereOwnCluster: startHereOwn } : null,
    articles: arts.length, commercial: arts.filter(a => a.intent === 'commercial').length, informational: arts.filter(a => a.intent !== 'commercial').length,
    subclusters: sub, words: { avg: arts.length ? Math.round(arts.reduce((n, a) => n + a.words, 0) / arts.length) : 0, min: arts.length ? Math.min(...arts.map(a => a.words)) : 0 },
    review: { verified: arts.filter(a => a.reviewStatus !== 'REVIEW_REQUIRED').length, reviewRequired: arts.filter(a => a.reviewStatus === 'REVIEW_REQUIRED').length, oldestReview: reviewed[0] || '', newestReview: reviewed[reviewed.length - 1] || '' },
    priorities: pri,
    links: { inSiloBody: inSilo, crossSiloOut: crossOut, crossSiloIn: crossIn, inSiloShare: pct(inSilo, inSilo + crossOut), articlesWithoutInSiloInbound: noInSiloInbound.length, articlesWithoutInSiloInboundSample: noInSiloInbound.slice(0, 10) },
    topInbound, moneyPages: money,
    keywords: { owned: own.length, ownedPrimary: own.filter(k => !k.variant).length, coveredFull: own.filter(k => k.coverage === 'full').length, list: own },
    demand: { keywords: d.keywords, weak: d.weak, volume: d.volume, top: d.rows.slice().sort((a, b) => b.maxVolume - a.maxVolume).slice(0, 8).map(r => ({ keyword: r.keyword, volume: r.volume, servedBy: r.servedBy, strength: r.strength })), gaps: (demandGaps[c] || []).map(r => ({ keyword: r.keyword, volume: r.volume, topic: r.topic })) },
    serp: { questionsServed: (serpServed[c] || []).length, sample: (serpServed[c] || []).slice(0, 6).map(g => g.question) },
    recommendations: []
  };
});

// ---------- recommendations (deterministic, REVIEW_REQUIRED) ----------
const recs = [];
const rec = (cluster, severity, rule, detail, action) => { const r = { cluster, severity, rule, detail, action, status: 'REVIEW_REQUIRED' }; recs.push(r); const c = clusters.find(x => x.cluster === cluster); if (c) c.recommendations.push(r); };
for (const c of clusters) {
  if (!c.hub) { rec(c.cluster, 'P1', 'missing-hub', 'no topics/' + c.cluster + '/index.md', 'restore the pillar page'); continue; }
  if (c.hub.startHereLinks < 3) rec(c.cluster, 'P2', 'hub-start-here', 'the pillar curates ' + c.hub.startHereLinks + ' start-here article link(s)', 'add 3-6 curated links to the commercial and core guides of the silo (hub body only)');
  if (c.hub.startHereLinks && c.hub.startHereOwnCluster < c.hub.startHereLinks) rec(c.cluster, 'P3', 'hub-links-outside-silo', (c.hub.startHereLinks - c.hub.startHereOwnCluster) + ' start-here link(s) point outside the silo', 'keep most start-here links inside the silo; cross-silo pointers belong in the body copy');
  for (const m of c.moneyPages.filter(x => x.inSiloInbound < 2).slice(0, 12)) rec(c.cluster, 'P3', 'money-page-inbound', m.url + ' has ' + m.inSiloInbound + ' in-silo in-body inbound link(s) (' + m.related + ' related cards)', 'add a contextual link from two same-silo guides whose topic leads to this page');
  if (c.links.articlesWithoutInSiloInbound) rec(c.cluster, 'P3', 'silo-orphans', c.links.articlesWithoutInSiloInbound + ' article(s) receive no in-body link from their own silo (hub listing and related cards only)', 'work the list below into contextual links from same-silo guides, highest-demand pages first');
  if (c.articles && c.links.inSiloShare < 50) rec(c.cluster, 'P3', 'silo-leak', 'only ' + c.links.inSiloShare + '% of in-body links from this silo stay inside it', 'review whether cross-silo links are intentional pointers (fine) or the silo lacks its own connective links');
  for (const g of c.demand.gaps) rec(c.cluster, 'P3', 'demand-gap', '"' + g.keyword + '" (' + Object.entries(g.volume || {}).map(([m, v]) => m + ' ' + v).join(', ') + ') has no serving URL', 'serve it inside an existing guide of this silo or record it as not a target (no new article)');
  for (const k of c.keywords.list.filter(k => !k.variant && !k.gap && k.coverage && k.coverage !== 'full')) rec(c.cluster, 'P3', 'owned-keyword-coverage', '"' + k.keyword + '" is only ' + k.coverage + 'ly covered by the title and description of ' + k.owner, 'work the keyword naturally into the title or description of the owner (no stuffing)');
}
for (const f of splitFamilies) rec(clusterOf(f.urls[0]) || '(site)', 'P3', 'split-family', 'keyword family "' + f.family + '" (' + f.keywords.join(', ') + ') is served by ' + f.urls.length + ' URLs: ' + f.urls.join(', '), 'declare one owner in docs/seo/keyword-targets.json and let the others support it');
for (const k of keywordClusters) for (const fl of k.flags) rec(k.cluster || '(site)', 'P3', 'keyword-cluster', k.url + ': ' + fl, 'review in the keyword universe mapping');
if (serpGaps.length) rec('(site)', 'P3', 'serp-gap', serpGaps.length + ' recorded People-also-ask / related-search question(s) have no serving URL: ' + serpGaps.map(g => '"' + g.question + '"').join(', '), 'answer only where an owner-approved or verified fact exists; off-topic questions stay unanswered');
const order = { P0: 0, P1: 1, P2: 2, P3: 3 }; recs.sort((a, b) => order[a.severity] - order[b.severity] || a.cluster.localeCompare(b.cluster) || a.rule.localeCompare(b.rule) || a.detail.localeCompare(b.detail));

// ---------- summary + outputs ----------
const totalInSilo = clusters.reduce((n, c) => n + c.links.inSiloBody, 0), totalCross = clusters.reduce((n, c) => n + c.links.crossSiloOut, 0);
const summary = {
  generated: TODAY, mode: matrix && matrix.summary ? matrix.summary.mode : 'ZERO-DATA (no matrix)', clusters: clusters.length, articles: Object.values(nodes).filter(n => n.type === 'article').length,
  inSiloBodyLinks: totalInSilo, crossSiloBodyLinks: totalCross, inSiloShare: pct(totalInSilo, totalInSilo + totalCross),
  articlesWithoutInSiloInbound: clusters.reduce((n, c) => n + c.links.articlesWithoutInSiloInbound, 0),
  hubsWithFewerThan3StartHere: clusters.filter(c => c.hub && c.hub.startHereLinks < 3).length,
  demandByMarket: Object.fromEntries(markets.map(m => [m, { served: clusters.reduce((n, c) => n + (c.demand.volume[m] || 0), 0) + ((demand['(site)'] && demand['(site)'].volume[m]) || 0), total: matrix.summary.keywordUniverse.volumeByMarket[m].core }])),
  keywordClusters: keywordClusters.length, splitFamilies: splitFamilies.length, serpQuestionsServed: register.filter(g => g.servedBy).length, serpGaps: serpGaps.length,
  recommendations: recs.reduce((o, r) => (o[r.severity] = (o[r.severity] || 0) + 1, o), {}), missing
};
const crossSiloEdges = Object.entries(crossEdges).map(([k, v]) => ({ from: k.split('>')[0], to: k.split('>')[1], links: v })).sort((a, b) => b.links - a.links || a.from.localeCompare(b.from) || a.to.localeCompare(b.to));
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'topical-map.json'), JSON.stringify({ summary, clusters, crossSiloEdges, keywordClusters, splitFamilies, recommendations: recs }, null, 1) + '\n');

let md = '# Topical map (Pillar–Hub–Silo)\n\n';
md += 'Generated ' + TODAY + ' by `scripts/topical-map.js` from the source tree, `docs/seo/keyword-targets.json`, the English SEO Master Matrix (`docs/seo/english-seo-master-matrix.json`: keyword-universe mapping, content gap register, priorities) and the research evidence. **Mode: ' + summary.mode + '.** Demand figures are third-party monthly estimates per market already mapped to serving URLs by the matrix engine; they are prioritisation evidence, never facts to publish. Every recommendation is REVIEW_REQUIRED: tooling never creates articles, rewrites prose or changes a URL.\n\n';
if (missing.length) md += '> Missing inputs: ' + missing.join('; ') + '\n\n';
md += '## Site summary\n\n- Clusters: ' + summary.clusters + ' (pillar hubs) · articles: ' + summary.articles + '\n- In-body links inside their silo: ' + summary.inSiloBodyLinks + ' (' + summary.inSiloShare + '%) · cross-silo: ' + summary.crossSiloBodyLinks + '\n- Articles with no in-body inbound link from their own silo: ' + summary.articlesWithoutInSiloInbound + '\n- Hubs curating fewer than 3 start-here links: ' + summary.hubsWithFewerThan3StartHere + '\n- Demand served (core keywords, by market): ' + Object.entries(summary.demandByMarket).map(([m, v]) => m.toUpperCase() + ' ' + v.served + '/' + v.total).join(', ') + '\n- Keyword clusters (serving URLs): ' + summary.keywordClusters + ' · split keyword families: ' + summary.splitFamilies + '\n- SERP questions served: ' + summary.serpQuestionsServed + ' · unserved: ' + summary.serpGaps + '\n- Recommendations: ' + Object.entries(summary.recommendations).map(([k, v]) => k + ' ' + v).join(', ') + '\n\n';
md += '## Cluster table\n\n| Cluster | Hub | Articles (commercial) | Avg words | Review required | P1/P2 | In-silo links | Cross out/in | In-silo share | No in-silo inbound | Start-here links | Owned keywords (full) | Demand ' + markets.map(m => m.toUpperCase()).join('/') + ' | SERP Qs | Recs |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n';
for (const c of clusters) md += '| ' + c.cluster + ' | ' + (c.hub ? mdCell(c.hub.title) : '(missing)') + ' | ' + c.articles + ' (' + c.commercial + ') | ' + c.words.avg + ' | ' + c.review.reviewRequired + ' | ' + c.priorities.P1 + '/' + c.priorities.P2 + ' | ' + c.links.inSiloBody + ' | ' + c.links.crossSiloOut + '/' + c.links.crossSiloIn + ' | ' + c.links.inSiloShare + '% | ' + c.links.articlesWithoutInSiloInbound + ' | ' + (c.hub ? c.hub.startHereLinks : 0) + ' | ' + c.keywords.owned + ' (' + c.keywords.coveredFull + ') | ' + markets.map(m => c.demand.volume[m] || 0).join('/') + ' | ' + c.serp.questionsServed + ' | ' + c.recommendations.length + ' |\n';
md += '\n## Clusters\n\n';
for (const c of clusters) {
  md += '### ' + c.cluster + (c.hub ? ' — ' + mdCell(c.hub.title) + ' (' + c.hub.url + ')' : ' — hub missing') + '\n\n';
  md += '- Articles: ' + c.articles + ' (' + c.commercial + ' commercial, ' + c.informational + ' informational) in ' + Object.keys(c.subclusters).length + ' subclusters: ' + Object.entries(c.subclusters).sort().map(([k, v]) => mdCell(k) + ' ' + v).join(', ') + '\n';
  md += '- Words: avg ' + c.words.avg + ', min ' + c.words.min + ' · review: ' + c.review.verified + ' verified, ' + c.review.reviewRequired + ' review required · last_reviewed ' + c.review.oldestReview + ' → ' + c.review.newestReview + '\n';
  md += '- Links: ' + c.links.inSiloBody + ' in-silo in-body, ' + c.links.crossSiloOut + ' out to other silos, ' + c.links.crossSiloIn + ' in from other silos (' + c.links.inSiloShare + '% stay inside) · ' + c.links.articlesWithoutInSiloInbound + ' article(s) without an in-silo inbound link' + (c.hub ? ' · hub start-here links ' + c.hub.startHereLinks + ' (' + c.hub.startHereOwnCluster + ' inside the silo)' : '') + '\n';
  if (c.topInbound.length) md += '- Most linked: ' + c.topInbound.map(t => t.url + ' (' + t.inbound + ' in-body, ' + t.related + ' cards)').join(', ') + '\n';
  if (c.moneyPages.length) md += '- Money pages (fewest in-silo inbound first): ' + c.moneyPages.slice(0, 8).map(m => m.url + ' (' + m.inSiloInbound + ' in-silo, ' + m.inbound + ' total, ' + m.related + ' cards' + (m.priority ? ', ' + m.priority : '') + ')').join(', ') + (c.moneyPages.length > 8 ? ' … ' + c.moneyPages.length + ' in total' : '') + '\n';
  if (c.keywords.owned) md += '- Owned keywords: ' + c.keywords.list.map(k => '"' + mdCell(k.keyword) + '"' + (k.variant ? ' (variant)' : '') + ' → ' + k.owner + (k.coverage ? ' [' + k.coverage + ']' : '')).join('; ') + '\n';
  md += '- Demand served: ' + c.demand.keywords + ' core keyword(s) (' + c.demand.weak + ' weak)' + (markets.length ? ' · ' + markets.map(m => m.toUpperCase() + ' ' + (c.demand.volume[m] || 0)).join(', ') : '') + (c.demand.top.length ? ' · top: ' + c.demand.top.map(t => '"' + mdCell(t.keyword) + '" ' + Object.entries(t.volume).map(([m, v]) => m + ' ' + v).join('/') + ' → ' + t.servedBy + (t.strength === 'partial' ? ' (weak)' : '')).join('; ') : '') + '\n';
  if (c.demand.gaps.length) md += '- Demand gaps: ' + c.demand.gaps.map(g => '"' + mdCell(g.keyword) + '" ' + Object.entries(g.volume).map(([m, v]) => m + ' ' + v).join('/')).join('; ') + '\n';
  md += '- SERP questions served: ' + c.serp.questionsServed + (c.serp.sample.length ? ' (e.g. ' + c.serp.sample.map(mdCell).join(' · ') + ')' : '') + '\n';
  if (c.recommendations.length) { md += '- Recommendations (REVIEW_REQUIRED):\n'; for (const r of c.recommendations) md += '  - **' + r.severity + ' ' + r.rule + '**: ' + mdCell(r.detail) + ' → ' + mdCell(r.action) + '\n'; }
  if (c.links.articlesWithoutInSiloInboundSample.length) md += '- Without in-silo inbound (sample): ' + c.links.articlesWithoutInSiloInboundSample.join(', ') + (c.links.articlesWithoutInSiloInbound > 10 ? ' … (' + c.links.articlesWithoutInSiloInbound + ')' : '') + '\n';
  md += '\n';
}
md += '## Cross-silo link flows (top 25)\n\n| From | To | In-body links |\n|---|---|---|\n';
for (const e of crossSiloEdges.slice(0, 25)) md += '| ' + e.from + ' | ' + e.to + ' | ' + e.links + ' |\n';
md += '\n## Keyword clusters by serving URL (top 40 by demand)\n\n| Serving URL | Type | Cluster | Keywords | Weak | Intents | ' + markets.map(m => m.toUpperCase()).join(' | ') + ' | Flags |\n|---|---|---|---|---|---|' + markets.map(() => '---').join('|') + '|---|\n';
for (const k of keywordClusters.slice(0, 40)) md += '| ' + k.url + ' | ' + k.type + ' | ' + (k.cluster || '-') + ' | ' + k.keywords.length + ': ' + mdCell(k.keywords.slice(0, 6).join(', ') + (k.keywords.length > 6 ? ' …' : '')) + ' | ' + k.weak + ' | ' + Object.entries(k.intents).map(([i, n]) => i + ' ' + n).join(', ') + ' | ' + markets.map(m => k.volume[m] || 0).join(' | ') + ' | ' + mdCell(k.flags.join('; ')) + ' |\n';
md += '\n## Split keyword families (' + splitFamilies.length + ')\n\nOne stemmed keyword family served by several URLs is a cannibalisation risk at the variant level; declare one owner in `docs/seo/keyword-targets.json`.\n\n' + (splitFamilies.length ? '| Family | URLs | Keywords |\n|---|---|---|\n' + splitFamilies.map(f => '| ' + mdCell(f.family) + ' | ' + f.urls.join(', ') + ' | ' + mdCell(f.keywords.join(', ')) + ' |').join('\n') + '\n' : 'None.\n');
md += '\n## All recommendations (' + recs.length + ', REVIEW_REQUIRED)\n\n| Severity | Cluster | Rule | Detail | Action |\n|---|---|---|---|---|\n';
for (const r of recs) md += '| ' + r.severity + ' | ' + r.cluster + ' | ' + r.rule + ' | ' + mdCell(r.detail) + ' | ' + mdCell(r.action) + ' |\n';
fs.writeFileSync(path.join(OUT_DIR, 'topical-map.md'), md);
console.log('topical-map: ' + summary.clusters + ' clusters, ' + summary.articles + ' articles; in-silo links ' + summary.inSiloBodyLinks + ' (' + summary.inSiloShare + '%), cross-silo ' + summary.crossSiloBodyLinks + '; no in-silo inbound ' + summary.articlesWithoutInSiloInbound + '; keyword clusters ' + summary.keywordClusters + ', split families ' + summary.splitFamilies + '; recommendations ' + Object.entries(summary.recommendations).map(([k, v]) => k + '=' + v).join(' ') + (missing.length ? '; missing: ' + missing.length + ' input(s)' : '') + '; wrote docs/seo/topical-map.{json,md}');
