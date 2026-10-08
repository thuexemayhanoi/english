#!/usr/bin/env node
// Rendered-site audit: inspects actual Jekyll output in _site/.
// No network access. Run after `jekyll build` (CI uses actions/jekyll-build-pages).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const SITE_DIR = path.join(L.ROOT, '_site');
const F = new L.Findings();

if (!fs.existsSync(SITE_DIR)) {
  console.error('rendered-site-audit: _site/ not found. Build the site first (jekyll build).');
  process.exit(2);
}

function walkSite(dir, out) {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSite(p, out); else out.push(p);
  }
  return out;
}

const files = walkSite(SITE_DIR);
const htmlFiles = files.filter(f => f.endsWith('.html'));
const rel = (f) => '/' + path.relative(SITE_DIR, f).split(path.sep).join('/');
const siteUrlOf = (f) => {
  let u = rel(f);
  if (u.endsWith('/index.html')) u = u.slice(0, -'index.html'.length) || '/';
  return u;
};
const fileForUrl = (u) => {
  // u: site-root-relative URL like /articles/x/ or /about/
  if (u.endsWith('/')) return path.join(SITE_DIR, u.slice(1), 'index.html');
  return path.join(SITE_DIR, u.slice(1));
};

const canonicalSeen = {};
let htmlPages = 0;

for (const f of htmlFiles) {
  const url = siteUrlOf(f);
  const rf = rel(f);
  const raw = fs.readFileSync(f, 'utf8');
  htmlPages++;

  // <title>: exactly one, non-empty
  const titles = [...raw.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)].map(m => m[1].trim());
  if (titles.length === 0) F.add('P1', rf, url, 'rendered page has no <title>', 'Check layout/title pipeline');
  else if (titles.length > 1) F.add('P1', rf, url, 'rendered page has multiple <title> tags', 'Remove duplicate title tags');
  else if (titles[0] === '') F.add('P1', rf, url, 'rendered page has empty <title>', 'Provide a title');

  // meta description
  if (!/<meta\s+name="description"/i.test(raw)) F.add('P2', rf, url, 'rendered page has no meta description', 'Add description front matter or site default');

  // canonical
  const canons = [...raw.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/gi)].map(m => m[1]);
  if (canons.length === 0) F.add('P1', rf, url, 'rendered page has no canonical link', 'Check canonical pipeline');
  for (const c of canons) {
    if (!c.startsWith(L.SITE_URL + L.BASEURL)) F.add('P1', rf, url, 'canonical is not on the configured custom domain: ' + c, 'Check url/baseurl/absolute_url');
    if (c.startsWith(L.SITE_URL + '/english/')) F.add('P1', rf, url, 'stale /english baseurl link in canonical: ' + c, 'Remove the legacy project-site baseurl');
    if (c !== L.SITE_URL + url) F.add('P1', rf, url, 'canonical does not match rendered page URL: ' + c, 'Use the current page URL on the custom domain');
    if (canonicalSeen[c]) F.add('P1', rf, url, 'duplicate canonical ' + c + ' (also ' + canonicalSeen[c] + ')', 'Two rendered pages share a canonical URL');
    else canonicalSeen[c] = rf;
  }

  // noindex
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(raw)) {
    if (url === '/404.html' || url === '/404') F.add('P3', rf, url, '404 page is noindex (acceptable)', '-');
    else F.add('P1', rf, url, 'accidental noindex on indexable rendered page', 'Remove noindex');
  }

  // H1 count: exactly one meaningful H1 expected
  const h1s = [...raw.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  if (h1s.length === 0) F.add('P1', rf, url, 'rendered page has no H1', 'Add a title/H1');
  else if (h1s.length > 1) F.add('P1', rf, url, 'rendered page has ' + h1s.length + ' H1 tags', 'Keep exactly one H1 per page');

  // Internal links between rendered pages
  for (const m of raw.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('https://thuexemayhanoi.github.io/english')) { F.add('P1', rf, url, 'stale legacy GitHub Pages URL: ' + href, 'Use the custom domain or a root-relative internal URL'); continue; }
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    if (href === '/english' || href.startsWith('/english/')) { F.add('P1', rf, url, 'stale /english baseurl link: ' + href, 'Remove the legacy project-site baseurl'); continue; }
    let target = href.split('#')[0].split('?')[0];
    if (!target || !target.startsWith('/')) continue; // relative-to-page or unknown
    // strip baseurl prefix if present (links are relative_url'd, i.e. start with /english)
    if (target.startsWith(L.BASEURL)) target = target.slice(L.BASEURL.length) || '/';
    if (target.startsWith('/assets')) {
      if (!fs.existsSync(path.join(SITE_DIR, target.slice(1)))) F.add('P1', rf, url, 'broken asset link: ' + href, 'Fix asset path');
      continue;
    }
    if (/\.(css|js|json|xml|png|jpg|svg|webp|ico)$/i.test(target)) {
      if (!fs.existsSync(fileForUrl(target))) F.add('P1', rf, url, 'broken file link: ' + href, 'Fix path');
      continue;
    }
    if (!fs.existsSync(fileForUrl(target))) F.add('P1', rf, url, 'broken internal link: ' + href, 'Fix or remove the link');
  }

  // JSON-LD syntax after Liquid rendering
  const ldBlocks = [...raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let types = [];
  for (const b of ldBlocks) {
    try {
      const d = JSON.parse(b[1].trim());
      const arr = Array.isArray(d) ? d : [d];
      types = types.concat(arr.map(x => x['@type']).filter(Boolean));
      for (const x of arr) {
        if (x['@type'] === 'BreadcrumbList' && !Array.isArray(x.itemListElement)) F.add('P1', rf, url, 'BreadcrumbList without itemListElement', 'Fix breadcrumb schema');
      }
    } catch (e) {
      F.add('P1', rf, url, 'invalid JSON-LD after rendering: ' + e.message, 'Fix Liquid output in schema block');
    }
  }

  // Article pages must carry Article/BlogPosting schema
  if (/^\/articles\/[^/]+\/$/.test(url) || /^\/articles\/[^/]+\/index\.html$/.test(rel(f)) || rel(f).startsWith('/articles/') && rel(f) !== '/articles/index.html') {
    if (url !== '/articles/' && !types.some(t => t === 'BlogPosting' || t === 'Article')) F.add('P1', rf, url, 'article page missing Article/BlogPosting schema', 'Check article layout schema block');
  }

  // Breadcrumbs expected on all non-home pages
  if (url !== '/' && !/breadcrumbs|BreadcrumbList/i.test(raw)) F.add('P2', rf, url, 'no breadcrumbs on non-home page', 'Include breadcrumbs.html');
}

// Audit every public file, including JS fallbacks and generated JSON. The
// normal HTML link audit above does not see URLs inside these resources.
function checkPublicUrl(value, file, base, label) {
  const raw = String(value || '').trim().replace(/&amp;/g, '&');
  if (!raw || /^(?:#|mailto:|tel:|data:|javascript:)/i.test(raw)) return;
  let target;
  try { target = new URL(raw, L.SITE_URL + base); }
  catch (e) { F.add('P1', file, base, 'broken file link: invalid ' + label + ' URL ' + raw, 'Fix the URL'); return; }
  if (target.origin !== L.SITE_URL) return;
  if (target.pathname === '/english' || target.pathname.startsWith('/english/')) {
    F.add('P1', file, base, 'stale /english baseurl link: ' + raw, 'Use the site root');
    return;
  }
  if (!fs.existsSync(fileForUrl(target.pathname))) {
    F.add('P1', file, base, 'broken file link: ' + label + ' ' + raw, 'Fix the link to the built site');
  }
}

const publicTextFiles = files.filter(f => /\.(?:html|css|js|json|xml|txt|webmanifest)$/i.test(f));
for (const f of publicTextFiles) {
  const source = rel(f);
  const base = siteUrlOf(f);
  const raw = fs.readFileSync(f, 'utf8');
  const legacy = raw.match(/https?:\/\/thuexemayhanoi\.github\.io\/english(?:\/|(?=["'\s?#<]))/i);
  if (legacy) F.add('P1', source, base, 'stale legacy GitHub Pages URL: ' + legacy[0], 'Use the custom domain');
  const oldPath = raw.match(/(?:https?:\/\/en\.rentbikehanoi\.com|["'=(])\/english(?:\/|(?=["'\s?#<]))/i);
  if (oldPath) F.add('P1', source, base, 'stale /english baseurl link in public output: ' + oldPath[0], 'Use the site root');
  if (f.endsWith('.html')) {
    for (const m of raw.matchAll(/\b(?:href|src|poster|data-index|action|srcset)\s*=\s*["']([^"']+)["']/gi)) {
      const label = m[0].split('=')[0].trim().toLowerCase();
      const values = label === 'srcset' ? m[1].split(',').map(s => s.trim().split(/\s+/)[0]) : [m[1]];
      for (const value of values) checkPublicUrl(value, source, base, label);
    }
    const og = raw.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i);
    if (og && og[1] !== L.SITE_URL + base) F.add('P1', source, base, 'public output Open Graph URL differs from page URL', 'Use the page canonical URL');
  }
  if (f.endsWith('.css')) {
    for (const m of raw.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) checkPublicUrl(m[1], source, base, 'CSS asset');
  }
}

const articleUrls = new Set(htmlFiles.map(siteUrlOf).filter(u => /^\/articles\/[^/]+\/$/.test(u)));
function readPublicJson(name) {
  const file = path.join(SITE_DIR, name);
  if (!fs.existsSync(file)) { F.add('P1', name, '/', 'missing public ' + name, 'Check Jekyll output'); return null; }
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) { F.add('P1', name, '/', 'invalid public ' + name + ': ' + e.message, 'Fix the generated JSON'); return null; }
}
const search = readPublicJson('search.json');
if (search) {
  if (!Array.isArray(search) || search.length !== articleUrls.size) {
    F.add('P1', 'search.json', '/', 'public output search index article count differs from built articles', 'Generate one entry per article');
  } else {
    const seen = new Set();
    for (const entry of search) {
      if (!articleUrls.has(entry.url) || seen.has(entry.url)) F.add('P1', 'search.json', '/', 'broken internal link: search URL ' + entry.url, 'Use each built article URL exactly once');
      seen.add(entry.url);
      checkPublicUrl(entry.url, 'search.json', '/', 'search URL');
    }
  }
}
const assistant = readPublicJson('assistant-index.json');
if (assistant) {
  const chunks = assistant.chunks;
  if (!Array.isArray(chunks) || !chunks.length) {
    F.add('P1', 'assistant-index.json', '/', 'public output assistant index has no chunks', 'Check Liquid generation');
  } else {
    const covered = new Set();
    for (const chunk of chunks) {
      checkPublicUrl(chunk.u, 'assistant-index.json', '/', 'assistant URL');
      if (chunk.st === 'article' && articleUrls.has(chunk.u)) covered.add(chunk.u);
    }
    if (covered.size !== articleUrls.size) F.add('P1', 'assistant-index.json', '/', 'public output assistant index omits built articles', 'Index every article');
  }
}
const manifest = readPublicJson('manifest.webmanifest');
if (manifest) {
  if (manifest.start_url !== '/' || manifest.scope !== '/') F.add('P1', 'manifest.webmanifest', '/', 'public output manifest scope is not root', 'Use root start_url and scope');
  for (const icon of manifest.icons || []) checkPublicUrl(icon.src, 'manifest.webmanifest', '/', 'manifest icon');
}
const robotsFile = path.join(SITE_DIR, 'robots.txt');
if (!fs.existsSync(robotsFile) || !/^Sitemap:\s*https:\/\/en\.rentbikehanoi\.com\/sitemap\.xml\s*$/m.test(fs.readFileSync(robotsFile, 'utf8'))) {
  F.add('P1', 'robots.txt', '/', 'public output robots sitemap differs from custom domain', 'Declare the root sitemap URL');
}

// Rendered sitemap.xml: URLs must correspond to real files; no excluded content
const sitemapFile = path.join(SITE_DIR, 'sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  const sm = fs.readFileSync(sitemapFile, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  const seen = new Set();
  for (const u of locs) {
    if (seen.has(u)) { F.add('P1', 'sitemap.xml', u, 'duplicate sitemap URL', 'Deduplicate'); continue; }
    seen.add(u);
    if (!u.startsWith(L.SITE_URL + L.BASEURL)) { F.add('P1', 'sitemap.xml', u, 'sitemap URL not on configured custom domain', 'Fix url/baseurl/absolute_url'); continue; }
    const sitePath = u.slice((L.SITE_URL + L.BASEURL).length) || '/';
    if (/README|docs\/|_queue|404/.test(sitePath)) { F.add('P1', 'sitemap.xml', u, 'excluded content in sitemap', 'Remove from sitemap'); continue; }
    if (!fs.existsSync(fileForUrl(sitePath))) F.add('P1', 'sitemap.xml', u, 'sitemap URL with no corresponding rendered page', 'Fix sitemap template');
  }
} else {
  F.add('P1', 'sitemap.xml', '-', 'rendered sitemap.xml missing from _site', 'Check sitemap.xml source');
}

// search.json sanity
const searchJson = path.join(SITE_DIR, 'search.json');
if (fs.existsSync(searchJson)) {
  try { JSON.parse(fs.readFileSync(searchJson, 'utf8')); } catch (e) { F.add('P1', 'search.json', '-', 'rendered search.json is invalid JSON', 'Fix template'); }
}

const report = { tool: 'rendered-site-audit', counts: F.counts, renderedPages: htmlPages, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'rendered-site-audit.json'), JSON.stringify(report, null, 2));
console.log('rendered-site-audit: pages=' + htmlPages + ' P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3 + ' blocking=' + F.blocking.length);
process.exitCode = F.hasBlocking ? 1 : 0;
