#!/usr/bin/env node
// JSON-LD schema validation (syntax + known field rules).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const OWNER_FACTS = ['Hanoi Motorbike Rental Nguyen Tu', '112 Nguyen Van Cu Street', '+84 942 467 674', '09:00'];
// NAP guard (name, address, phone, hours): every business-facing surface must carry
// the docs/OWNER-FACTS.md values exactly. A mismatch is a P1 business-fact defect and
// is never auto-fixed (AGENTS.md: business facts are owner-only).
const NAP = { name: 'Hanoi Motorbike Rental Nguyen Tu', street: '112 Nguyen Van Cu Street', phone: '+84 942 467 674', phoneDigits: '84942467674', opens: '09:00', closes: '21:00' };
const phoneDigits = v => { let d = String(v || '').replace(/\D/g, ''); if (/^0\d{9}$/.test(d)) d = '84' + d.slice(1); return d; };
function checkNapText(text, file, url, opts) {
  const o = Object.assign({ hours: true, address: true }, opts || {});
  const lines = String(text).split('\n');
  lines.forEach((line, i) => {
    // phone numbers written for the business (+84 ... / 84 ... / tel: / wa.me / zalo.me)
    for (const m of line.matchAll(/(?:\+84|\b84)[\s.\-]?\(?0?\)?[\s.\-]?\d(?:[\d\s.\-]{7,11})\d\b/g)) {
      const d = phoneDigits(m[0]);
      if (d.length >= 10 && d.length <= 12 && d !== NAP.phoneDigits) F.add('P1', file, url, 'NAP mismatch (phone "' + m[0].trim() + '" is not ' + NAP.phone + ') at line ' + (i + 1), 'Use the OWNER-FACTS phone exactly');
    }
    for (const m of line.matchAll(/(?:tel:|wa\.me\/|zalo\.me\/)\+?(\d{9,13})/g)) {
      if (phoneDigits(m[1]) !== NAP.phoneDigits) F.add('P1', file, url, 'NAP mismatch (link "' + m[0] + '" is not the OWNER-FACTS phone) at line ' + (i + 1), 'Point tel:/wa.me/zalo.me links at ' + NAP.phone);
    }
    // An address claim is a house number followed by the street. A wrong number is a
    // P1 defect; the approved number without the approved "Street" form is a P3 format
    // drift. Plain street-name mentions in prose ("Nguyen Van Cu is a wide road") are fine.
    if (o.address) for (const m of line.matchAll(/\b(\d{1,4}[A-Za-z]?)\s+(?:Đ\.\s*|D\.\s*|Duong\s+)?Nguy[eễ]n V[aă]n C[uừ]\b[^,.;)]*/gi)) {
      if (m[1] !== '112') F.add('P1', file, url, 'NAP mismatch (address "' + m[0].trim() + '" is not "' + NAP.street + '") at line ' + (i + 1), 'Use the OWNER-FACTS address exactly');
      else if (!m[0].includes(NAP.street) && !/Nguyễn Văn Cừ/.test(m[0])) F.add('P3', file, url, 'NAP format drift (address "' + m[0].trim() + '" should read "' + NAP.street + '") at line ' + (i + 1), 'Write the address as in OWNER-FACTS');
    }
    if (o.hours) for (const m of line.matchAll(/\b(\d{1,2}:\d{2})\s*(?:–|—|-|&ndash;|&mdash;|to)\s*(\d{1,2}:\d{2})\b/g)) {
      if (m[1] !== NAP.opens || m[2] !== NAP.closes) F.add('P1', file, url, 'NAP mismatch (opening hours "' + m[0] + '" are not ' + NAP.opens + '-' + NAP.closes + ') at line ' + (i + 1), 'Use the OWNER-FACTS opening hours exactly');
    }
  });
}
function checkNapNode(d, file, url) {
  const types = [].concat(d['@type'] || []);
  if (!types.some(t => /LocalBusiness|Organization/.test(String(t)))) return;
  const phones = [d.telephone].concat([].concat(d.contactPoint || []).map(c => c && c.telephone)).filter(Boolean);
  for (const p of phones) if (phoneDigits(p) !== NAP.phoneDigits) F.add('P1', file, url, 'NAP mismatch (schema telephone "' + p + '" is not ' + NAP.phone + ')', 'Use the OWNER-FACTS phone exactly');
  if (d.name && types.some(t => /LocalBusiness/.test(String(t))) && d.name !== NAP.name) F.add('P1', file, url, 'NAP mismatch (schema name "' + d.name + '" is not "' + NAP.name + '")', 'Use the OWNER-FACTS business name exactly');
  const addr = d.address && typeof d.address === 'object' ? d.address : null;
  if (addr && addr.streetAddress && !String(addr.streetAddress).includes(NAP.street)) F.add('P1', file, url, 'NAP mismatch (schema streetAddress "' + addr.streetAddress + '")', 'Use the OWNER-FACTS address exactly');
  for (const h of [].concat(d.openingHoursSpecification || [])) if (h && (h.opens || h.closes) && (h.opens !== NAP.opens || h.closes !== NAP.closes)) F.add('P1', file, url, 'NAP mismatch (schema opening hours ' + h.opens + '-' + h.closes + ')', 'Use the OWNER-FACTS opening hours exactly');
  if (typeof d.openingHours === 'string' && !/09:00-21:00/.test(d.openingHours)) F.add('P1', file, url, 'NAP mismatch (schema openingHours "' + d.openingHours + '")', 'Use the OWNER-FACTS opening hours exactly');
}

function checkJsonLd(text, file, url, knownTypes) {
  const blocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const typesSeen = {};
  for (const b of blocks) {
    let data;
    try { data = JSON.parse(b[1].trim()); } catch (e) { F.add('P1', file, url, 'invalid JSON-LD: ' + e.message, 'Fix syntax'); continue; }
    const arr = Array.isArray(data) ? data : Array.isArray(data['@graph']) ? data['@graph'] : [data];
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
      checkNapNode(d, file, url);
      if ([].concat(t || []).some(x => /LocalBusiness/.test(String(x)))) {
        const s = JSON.stringify(d);
        // Flag invented-looking claims (JSON keys, so "reviewedBy"/"2024" never match)
        for (const bad of ['aggregateRating', 'review', 'reviews', 'priceRange']) {
          if (new RegExp('"' + bad + '"\\s*:').test(s)) F.add('P1', file, url, 'LocalBusiness contains ' + bad + ' (not in OWNER-FACTS)', 'Remove invented business claims');
        }
        if (/"openingHours"\s*:\s*"[^"]*24/.test(s)) F.add('P1', file, url, 'LocalBusiness claims 24-hour opening (not in OWNER-FACTS)', 'Remove invented business claims');
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
// NAP guard over every business-facing surface (hours checked only where the business
// states its own hours; articles are scanned for phone/address only because they
// legitimately quote other time ranges).
for (const p of pages) checkNapText(p.raw, p.file, L.pageUrl(p), { hours: /^(index\.html|contact\.md|about\.md|faq\.md|terms\.md|privacy\.md)$/.test(p.file) });
for (const a of articles) checkNapText(a.raw, a.file, L.articleUrl(a), { hours: false });
for (const extra of ['llms.txt', '_data/faq.json', '_data/assistant-business.yml', '_includes/contact-sheet.html', '_includes/footer.html', '_includes/faq-body.html', '_layouts/default.html']) {
  const fp = path.join(L.ROOT, extra);
  if (fs.existsSync(fp)) checkNapText(fs.readFileSync(fp, 'utf8'), extra, '/', { hours: true });
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
