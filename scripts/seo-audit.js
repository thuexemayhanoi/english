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
  const usesSiteDefaults = file === 'index.html'; // default layout falls back to site.title/site.description
  if (!fm.title || String(fm.title).trim() === '') F.add(usesSiteDefaults ? 'P2' : 'P1', file, url, 'missing title' + (usesSiteDefaults ? ' (site default used)' : ''), 'Add a title front-matter value');
  else titleCount[String(fm.title).trim()] = (titleCount[String(fm.title).trim()] || 0) + 1;
  // Description
  if (!fm.description || String(fm.description).trim() === '') F.add(x.isArticle ? 'P1' : 'P2', file, url, 'missing meta description' + (usesSiteDefaults ? ' (site default used)' : ''), 'Add a description front-matter value');
  else descCount[String(fm.description).trim()] = (descCount[String(fm.description).trim()] || 0) + 1;

  // Canonical / URL sanity (all pages use layout default; canonical = page.url | absolute_url)
  const abs = L.SITE_URL + L.BASEURL + url;
  if (url.includes('/english/english')) F.add('P0', file, url, 'doubled /english/english/ path', 'Fix permalink/baseurl');
  if (canonCount[abs]) F.add('P0', file, url, 'duplicate canonical ' + abs, 'Fix permalinks; two pages share a URL');
  canonCount[abs] = true;

  if (/noindex/i.test(JSON.stringify(fm))) F.add('P1', file, url, 'accidental noindex', 'Remove noindex from front matter');

  // Sitemap inclusion for indexable pages
  if (!sitemapHas(abs) && url !== '/404.html') F.add('P1', file, url, 'missing from sitemap.xml', 'Add URL to sitemap template coverage');

  // H1 checks (source-level; layouts inject H1 from title)
  const h1s = L.findH1s(x.body);
  const hasH1FromTitle = !!fm.title;
  if (!hasH1FromTitle && h1s.length === 0) F.add('P1', file, url, 'no H1', 'Add title or an H1 heading');
  const contentH1s = h1s.filter(h => !String(fm.title || '').includes(h));
  if (contentH1s.length > 0 && hasH1FromTitle) F.add('P2', file, url, 'multiple H1 (layout title H1 + body H1)', 'Demote body H1 to H2');

  // Article-specific: BlogPosting schema comes from layout; check metadata presence
  if (x.isArticle) {
    if (fm.review_status === 'REVIEW_REQUIRED') F.add('P2', file, url, 'article marked REVIEW_REQUIRED', 'Verify facts against primary sources, then clear review_status');
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

// Orphan articles: no other page/article links to them
const allBodies = all.map(x => L.extractLinks(x.body).join(' ') + ' ' + String(x.fm.internal_link_targets || '')).join(' ');
for (const a of articles) {
  const u = L.articleUrl(a);
  const slug = a.fm.slug || '';
  if (!allBodies.includes(u) && !allBodies.includes(slug)) F.add('P2', a.file, u, 'orphan article (nothing links to it)', 'Add it to a hub or related-guides list');
}

// Invalid topic hub references
for (const a of articles) {
  if (a.fm.topic_cluster && !L.CLUSTERS.includes(a.fm.topic_cluster)) F.add('P1', a.file, L.articleUrl(a), 'unknown topic_cluster ' + a.fm.topic_cluster, 'Use one of the 14 canonical clusters');
}

const report = { tool: 'seo-audit', counts: F.counts, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'seo-audit.json'), JSON.stringify(report, null, 2));
console.log('seo-audit: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3);
process.exitCode = F.has(['P0']) ? 1 : 0;
