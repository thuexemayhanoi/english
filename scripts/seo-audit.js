#!/usr/bin/env node
// SEO audit: title/meta/canonical/sitemap/orphan/link checks over source files.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();
const pages = L.loadPages();
const sitemapRaw = fs.readFileSync(path.join(L.ROOT, 'sitemap.xml'), 'utf8');
const sitemapLocsList = L.sitemapLocs(sitemapRaw, articles);
const sitemapHas = (u) => sitemapLocsList.includes(u);

const titleCount = {}, descCount = {}, canonCount = {};
const all = [];
for (const a of articles) all.push({ file: a.file, fm: a.fm, body: a.body, url: L.articleUrl(a), isArticle: true });
for (const p of pages) { if (!p.file.startsWith('_')) all.push({ file: p.file, fm: p.fm, body: p.body, url: L.pageUrl(p), isArticle: false }); }

// URLs known to exist (for link/orphan analysis)
const known = new Set(all.map(x => x.url).concat(L.CLUSTERS.map(c => '/topics/' + c + '/')));

for (const x of all) {
  const { fm, url, file } = x;
  const skipIndex = file === '404.html' || file === 'README.md'; // excluded from Jekyll output
  if (skipIndex) continue;

  // Title
  // index.html intentionally falls back to site.title/site.description in the
  // default layout, so its rendered meta is correct — no finding for defaults.
  const usesSiteDefaults = file === 'index.html'; // default layout falls back to site.title/site.description
  if (!usesSiteDefaults && (!fm.title || String(fm.title).trim() === '')) F.add('P1', file, url, 'missing title', 'Add a title front-matter value');
  else titleCount[String(fm.title).trim()] = (titleCount[String(fm.title).trim()] || 0) + 1;
  // Description
  if (!usesSiteDefaults && (!fm.description || String(fm.description).trim() === '')) F.add(x.isArticle ? 'P1' : 'P2', file, url, 'missing meta description', 'Add a description front-matter value');
  else descCount[String(fm.description).trim()] = (descCount[String(fm.description).trim()] || 0) + 1;

  // Canonical / URL sanity (all pages use layout default; canonical = page.url | absolute_url)
  const abs = L.SITE_URL + L.BASEURL + url;
  if (url.includes('/english/english')) F.add('P0', file, url, 'doubled /english/english/ path', 'Fix permalink/baseurl');
  if (canonCount[abs]) F.add('P0', file, url, 'duplicate canonical ' + abs, 'Fix permalinks; two pages share a URL');
  canonCount[abs] = true;

  if (/noindex/i.test(JSON.stringify(fm))) F.add('P1', file, url, 'accidental noindex', 'Remove noindex from front matter');

  // Sitemap inclusion for indexable pages
  if (!sitemapHas(abs) && url !== '/404.html') F.add('P1', file, url, 'missing from sitemap.xml', 'Add URL to sitemap template coverage');

  // H1 checks (source-level, rendered-HTML aware)
  // Templates that inject an H1 from the front-matter title: article layout
  // and cluster layout. Includes can also contribute an H1 (faq.md ->
  // faq-body.html starts with <h1>), so count those too.
  const layoutInjectsH1 = x.isArticle || String(fm.layout || '') === 'cluster';
  const bodyH1s = L.findH1s(x.body);
  const includeH1 = /\{%\s*include\s+faq-body/.test(x.body);
  const totalH1 = bodyH1s.length + (((layoutInjectsH1 && fm.title) || includeH1) ? 1 : 0);
  if (totalH1 === 0) F.add('P1', file, url, 'no H1', 'Add title or an H1 heading');
  if (layoutInjectsH1 && fm.title && bodyH1s.some(h => !String(fm.title).includes(h))) F.add('P2', file, url, 'multiple H1 (layout title H1 + body H1)', 'Demote body H1 to H2');

  // Article-specific: BlogPosting schema comes from layout; check metadata presence
  if (x.isArticle) {
    const rsVal = String(fm.review_status || '').toUpperCase();
    if (fm.review_status && rsVal !== 'VERIFIED' && rsVal !== 'REVIEW_REQUIRED') {
      F.add('P1', file, url, 'invalid review_status value: ' + JSON.stringify(fm.review_status), 'Use VERIFIED or REVIEW_REQUIRED (enum is uppercase)');
    }
    if (rsVal === 'REVIEW_REQUIRED') F.add('P2', file, url, 'article marked REVIEW_REQUIRED', 'Verify facts against primary sources, then clear review_status');
    if (fm.last_reviewed) { const d = new Date(fm.last_reviewed); if (isNaN(d.getTime())) F.add('P1', file, url, 'invalid last_reviewed date', 'Use YYYY-MM-DD'); }
  }

  // Internal links out (markdown + html)
  const links = L.extractLinks(x.body);
  let internal = 0;
  for (const href of links) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    internal++;
    let target = href.split('#')[0];
    if (target.includes('/english/english')) F.add('P0', file, url, 'internal link with doubled /english/english/', 'Fix link to use relative_url-compatible path');
    if (target.startsWith('/') && !known.has(target) && target !== '/' && !target.startsWith('/assets')) F.add('P1', file, url, 'broken internal link ' + target, 'Fix or remove the link');
  }
  if (x.isArticle && internal === 0 && !fm.internal_link_targets) F.add('P2', file, url, 'no internal links from article', 'Add internal_link_targets or contextual links');

  // Length warnings (P3 only)
  if (fm.title && String(fm.title).length > 65) F.add('P3', file, url, 'title longer than 65 chars', 'Consider a shorter title');
  if (fm.description && String(fm.description).length > 165) F.add('P3', file, url, 'meta description longer than 165 chars', 'Consider a shorter description');
}

// Duplicates
for (const [t, n] of Object.entries(titleCount)) if (n > 1) F.add('P1', '-', '-', 'duplicate title "' + t + '" x' + n, 'Differentiate titles to avoid cannibalization');
for (const [d, n] of Object.entries(descCount)) if (n > 1) F.add('P2', '-', '-', 'duplicate meta description x' + n, 'Rewrite one description');

// Orphan articles: same Liquid-aware rule as internal-link-audit.js.
// An article listed dynamically by its topic hub and the all-guides index is
// reachable from rendered HTML even if no source file contains its literal
// URL; only articles with neither dynamic listing nor explicit inbound links
// are orphans.
const inboundSeo = {};
for (const x of all) {
  const hay = L.extractLinks(x.body).join(' ') + ' ' + String(x.fm.internal_link_targets || '');
  for (const a of articles) {
    const s = a.fm.slug || '';
    const u = L.articleUrl(a);
    if ((s && hay.includes(s)) || hay.includes(u)) inboundSeo[s || u] = true;
  }
}
for (const a of articles) {
  if (L.isDynamicallyListed(a)) continue;
  const key = a.fm.slug || L.articleUrl(a);
  if (!inboundSeo[key]) F.add('P2', a.file, L.articleUrl(a), 'orphan article (no explicit or dynamic inbound link)', 'Assign a valid topic_cluster with an existing hub, or link it explicitly');
}

// Invalid topic hub references
for (const a of articles) {
  if (a.fm.topic_cluster && !L.CLUSTERS.includes(a.fm.topic_cluster)) F.add('P1', a.file, L.articleUrl(a), 'unknown topic_cluster ' + a.fm.topic_cluster, 'Use one of the 14 canonical clusters');
}

const report = { tool: 'seo-audit', counts: F.counts, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo-audit.json'), JSON.stringify(report, null, 2));
console.log('seo-audit: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' blocking=' + F.blocking.length);
process.exitCode = F.hasBlocking ? 1 : 0;
