#!/usr/bin/env node
// LINK BARE SLUGS — deterministic repair of a specific, reader-visible defect:
// article prose that references another guide by its bare slug, e.g.
//   "...the deposit terms deserve attention — see motorbike-rental-deposit-monthly-hanoi"
// Each bare slug that EXACTLY matches an existing article slug becomes a real
// contextual link in the house style:
//   [<that article's title>]({{ '/articles/<slug>/' | relative_url }})
//
// Safety rules (why this is deterministic and low-risk):
// - Only exact matches against the current _articles inventory are touched;
//   a slug-like token that matches nothing is left alone and reported.
// - Existing markdown/HTML links, Liquid tags, code spans, URLs and front
//   matter are protected: nothing inside them is modified.
// - Link text is the target article's own title (never invented); a target
//   whose title contains "|" is skipped on table lines so tables stay valid.
// - No other prose, fact, number or heading is changed. One slug -> one link.
//
// Usage: node scripts/link-bare-slugs.js            (dry run, prints a report)
//        node scripts/link-bare-slugs.js --apply    (writes the files)
//        node scripts/link-bare-slugs.js --apply --only slug-a,slug-b
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const APPLY = process.argv.includes('--apply');
const onlyArg = process.argv.find((a, i) => process.argv[i - 1] === '--only');
const ONLY = onlyArg ? new Set(onlyArg.split(',').map(s => s.trim()).filter(Boolean)) : null;

const articles = L.loadArticles();
const titleBySlug = {};
for (const a of articles) if (a.fm.slug) titleBySlug[a.fm.slug] = String(a.fm.title || '').trim();

// Ranges of the body that must never be edited.
const PROTECT = [
  /\[[^\]\n]*\]\([^)\n]*\)/g,           // markdown links [text](url)
  /\{\{[\s\S]*?\}\}/g,                   // Liquid output
  /\{%[\s\S]*?%\}/g,                     // Liquid tags
  /`[^`\n]*`/g,                          // inline code
  /<a\b[^>]*>[\s\S]*?<\/a>/gi,           // HTML links
  /<[^>\n]+>/g,                          // other HTML tags (attributes may hold slugs)
  /https?:\/\/[^\s)]+/g,                 // absolute URLs
  /\/articles\/[a-z0-9-]+\/?/g           // root-relative article paths
];
function protectedRanges(text) {
  const ranges = [];
  for (const re of PROTECT) for (const m of text.matchAll(re)) ranges.push([m.index, m.index + m[0].length]);
  return ranges;
}
const inRanges = (ranges, s, e) => ranges.some(([a, b]) => s < b && e > a);

const SLUG_TOKEN = /[a-z0-9]+(?:-[a-z0-9]+){2,}/g;   // at least three hyphenated parts
const BOUNDARY_BEFORE = /[a-z0-9\/\-_.#]/i;            // char classes that mean "not a free-standing token"
const BOUNDARY_AFTER = /[a-z0-9\/\-_]/i;

const report = { files: 0, links: 0, skippedTable: 0, unmatched: {}, perFile: [] };

for (const a of articles) {
  if (ONLY && !ONLY.has(a.fm.slug)) continue;
  const body = a.body;
  const ranges = protectedRanges(body);
  const lineStarts = []; // for table detection
  let idx = -1; do { lineStarts.push(idx + 1); idx = body.indexOf('\n', idx + 1); } while (idx !== -1);
  const lineOf = pos => { let lo = 0, hi = lineStarts.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= pos) lo = mid; else hi = mid - 1; } return lo; };
  const isTableLine = pos => body.slice(lineStarts[lineOf(pos)]).trimStart().startsWith('|');

  let out = ''; let last = 0; let n = 0; const changes = [];
  for (const m of body.matchAll(SLUG_TOKEN)) {
    const tok = m[0]; const s = m.index; const e = s + tok.length;
    if (tok === a.fm.slug) continue;                       // self-reference stays prose
    const before = s > 0 ? body[s - 1] : ''; const after = body[e] || '';
    if (BOUNDARY_BEFORE.test(before) || BOUNDARY_AFTER.test(after)) continue;
    if (inRanges(ranges, s, e)) continue;
    const title = titleBySlug[tok];
    if (!title) {
      if (/-(?:hanoi|vietnam|guide|checklist|review|explained|rules|law)$/.test(tok) || tok.split('-').length >= 4) report.unmatched[tok] = (report.unmatched[tok] || 0) + 1;
      continue;
    }
    if (isTableLine(s) && title.includes('|')) { report.skippedTable++; continue; }
    const link = '[' + title.replace(/\]/g, '\\]') + "]({{ '/articles/" + tok + "/' | relative_url }})";
    out += body.slice(last, s) + link; last = e; n++;
    changes.push(tok);
  }
  if (!n) continue;
  out += body.slice(last);
  report.files++; report.links += n;
  report.perFile.push({ file: a.file, links: n, slugs: [...new Set(changes)] });
  if (APPLY) {
    const fmEnd = a.raw.indexOf('\n---', 3) + 4;
    const head = a.raw.slice(0, fmEnd);
    // lib.parseFrontMatter keeps the body byte-for-byte (head + body === raw).
    if (head + body !== a.raw) { console.error('FRONT MATTER SPLIT MISMATCH for ' + a.file + ' — not written'); process.exitCode = 1; continue; }
    const rebuilt = head + out;
    // Guard: nothing but the inserted links may differ.
    const stripLinks = s => s.replace(/\[[^\]]*\]\(\{\{ '\/articles\/[a-z0-9-]+\/' \| relative_url \}\}\)/g, m => m.match(/\/articles\/([a-z0-9-]+)\//)[1]);
    if (stripLinks(rebuilt) !== stripLinks(a.raw)) { console.error('GUARD FAILED for ' + a.file + ' — not written'); process.exitCode = 1; continue; }
    fs.writeFileSync(path.join(L.ROOT, a.file), rebuilt);
  }
}

report.perFile.sort((x, y) => y.links - x.links);
console.log((APPLY ? 'APPLIED' : 'DRY RUN') + ': ' + report.files + ' article(s), ' + report.links + ' bare slug reference(s) -> contextual links; skipped on table lines: ' + report.skippedTable);
const unmatched = Object.entries(report.unmatched).sort((a, b) => b[1] - a[1]);
if (unmatched.length) console.log('Slug-like references with NO matching article (left untouched, review manually): ' + unmatched.map(([k, v]) => k + ' x' + v).join(', '));
for (const f of report.perFile.slice(0, 15)) console.log('  ' + f.file + ': ' + f.links + ' (' + f.slugs.slice(0, 4).join(', ') + (f.slugs.length > 4 ? ', …' : '') + ')');
if (report.perFile.length > 15) console.log('  … ' + (report.perFile.length - 15) + ' more file(s)');
// The apply report is the audit trail consumed by scripts/english-seo-matrix.js
// (Status column); a dry run never overwrites it.
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
const reportName = APPLY ? 'link-bare-slugs.json' : 'link-bare-slugs-dry-run.json';
fs.writeFileSync(path.join(L.ROOT, 'reports', reportName), JSON.stringify({ tool: 'link-bare-slugs', mode: APPLY ? 'apply' : 'dry-run', generated: new Date().toISOString(), summary: { files: report.files, links: report.links, skippedTable: report.skippedTable }, unmatched: report.unmatched, perFile: report.perFile }, null, 2));
