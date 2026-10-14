#!/usr/bin/env node
// LINK GUIDE REFERENCES — turn descriptive, unlinked references to another
// guide ("the brake shoe article covers…", "covered in our documents article",
// "see our guide to deposits") into contextual links, but ONLY when the
// reference can be resolved with high confidence.
//
// Resolution is conservative and deterministic:
// - Candidates are the article's own internal_link_targets (the author's
//   declared related guides) plus any article the phrase names by exact title.
// - The phrase's significant words (stemmed, stop-words removed) are matched
//   against each candidate's slug + title words. A candidate wins only when it
//   matches at least MIN_MATCH significant words, covers at least half of the
//   phrase's significant words, and beats every other candidate outright.
// - The link text is the existing phrase (nothing is rewritten); the URL is the
//   house-style Liquid form. Unresolved references are reported, never guessed.
//
// Usage: node scripts/link-guide-references.js            (dry run + report)
//        node scripts/link-guide-references.js --apply
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const APPLY = process.argv.includes('--apply');
const MIN_MATCH = 2;

const STOP = new Set(['a', 'an', 'the', 'of', 'for', 'to', 'in', 'on', 'and', 'or', 'with', 'your', 'you', 'our', 'this', 'that', 'is', 'are', 'how', 'what', 'when', 'where', 'why', 'which', 'who', 'do', 'does', 'can', 'at', 'by', 'from', 'vs', 'versus', 'guide', 'guides', 'article', 'articles', 'explainer', 'checklist', 'hanoi', 'vietnam', 'motorbike', 'motorbikes', 'motorcycle', 'motorcycles', 'bike', 'bikes', 'rental', 'rentals', 'renting', 'rent', 'rented', 'full', 'dedicated', 'separate', 'companion', 'own', 'its', 'their', 'see', 'read']);
const stem = w => w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(ing|ers|er|ed|es|s)$/, '').replace(/licenc/, 'licens');
const sig = s => [...new Set(String(s).toLowerCase().split(/[^a-z0-9]+/).filter(w => w && !STOP.has(w)).map(stem).filter(w => w.length > 1))];

const articles = L.loadArticles();
const bySlug = {}; for (const a of articles) bySlug[a.fm.slug] = a;
const byTitle = {}; for (const a of articles) byTitle[String(a.fm.title).toLowerCase().trim()] = a.fm.slug;
const tokensOfSlug = {}; for (const a of articles) tokensOfSlug[a.fm.slug] = new Set(sig(a.fm.slug.replace(/-/g, ' ') + ' ' + a.fm.title));

// Reference patterns. Group 1 = the phrase that becomes the link text.
const PATTERNS = [
  /\b(the [a-z0-9][a-z0-9' \-]{2,60}? (?:article|guide|explainer|checklist))(?= (?:covers|lists|explains|walks|goes|shows|has|describes|sets out|runs|is|does|gives|details|compares|applies|answers|tells|breaks|lays|holds|deals|puts|spells|works|takes|maps|ranks|weighs|sorts|handles|explores))/gi,
  /\b(our (?:dedicated |separate |companion |full )?[a-z0-9][a-z0-9' \-]{2,60}? (?:article|guide|explainer|checklist))\b/gi,
  /\bcovered in (?:our |the )((?:[a-z0-9][a-z0-9' \-]{2,60}? )(?:article|guide|explainer|checklist))\b/gi,
  /\bsee our guide (?:to|on) ([a-z0-9][a-z0-9' \-]{2,60}?)(?=[.,;:)])/gi,
  /\((see ([a-z0-9][a-z0-9' \-]{2,70}?))\)/gi
];
const PROTECT = [/\[[^\]\n]*\]\([^)\n]*\)/g, /\{\{[\s\S]*?\}\}/g, /\{%[\s\S]*?%\}/g, /`[^`\n]*`/g, /<a\b[^>]*>[\s\S]*?<\/a>/gi, /<[^>\n]+>/g, /https?:\/\/[^\s)]+/g];
function protectedRanges(text) { const r = []; for (const re of PROTECT) for (const m of text.matchAll(re)) r.push([m.index, m.index + m[0].length]); return r; }
const inRanges = (ranges, s, e) => ranges.some(([a, b]) => s < b && e > a);

// A phrase must read as ONE reference: at most 7 words, no second determiner,
// no "and" joining two references, no dash fragments.
function phraseIsClean(phrase) {
  const w = phrase.trim().split(/\s+/);
  if (w.length > 7) return false;
  if (/\s[-–—]\s/.test(phrase) || /\band\b/i.test(phrase)) return false;
  if (w.slice(1).some(x => /^(the|our|a|an|see|this|that|these|those|its|their)$/i.test(x))) return false;
  return true;
}

function resolve(phrase, a) {
  if (!phraseIsClean(phrase)) return null;
  const exact = byTitle[phrase.toLowerCase().replace(/^(the|our|see) /, '').trim()];
  if (exact && exact !== a.fm.slug) return { slug: exact, why: 'exact title' };
  const words = sig(phrase);
  if (!words.length) return null;
  const candidates = String(a.fm.internal_link_targets || '').split(',').map(s => s.trim()).filter(s => s && bySlug[s] && s !== a.fm.slug);
  const scored = candidates.map(s => ({ s, hit: words.filter(w => tokensOfSlug[s].has(w)).length })).sort((x, y) => y.hit - x.hit);
  if (!scored.length) return null;
  const best = scored[0]; const second = scored[1];
  // One distinctive word ("the deposit article") is accepted only when exactly
  // one declared related guide contains it.
  if (words.length === 1 && best.hit === 1 && (!second || second.hit === 0)) return { slug: best.s, why: 'unique word among related guides' };
  if (best.hit < MIN_MATCH || best.hit * 2 < words.length) return null;
  if (second && second.hit === best.hit) return null;
  return { slug: best.s, why: best.hit + '/' + words.length + ' words' };
}

const report = { files: 0, links: 0, unresolved: [], perFile: [] };
for (const a of articles) {
  const body = a.body; const ranges = protectedRanges(body);
  const edits = [];
  for (const re of PATTERNS) {
    for (const m of body.matchAll(re)) {
      const phrase = m[1]; const s = m.index + m[0].indexOf(phrase); const e = s + phrase.length;
      if (inRanges(ranges, s, e) || edits.some(x => s < x.e && e > x.s)) continue;
      const r = resolve(phrase, a);
      if (!r) { report.unresolved.push({ file: a.file, phrase }); continue; }
      edits.push({ s, e, phrase, slug: r.slug, why: r.why });
    }
  }
  if (!edits.length) continue;
  edits.sort((x, y) => x.s - y.s);
  let out = ''; let last = 0;
  for (const ed of edits) { out += body.slice(last, ed.s) + '[' + ed.phrase + "]({{ '/articles/" + ed.slug + "/' | relative_url }})"; last = ed.e; }
  out += body.slice(last);
  report.files++; report.links += edits.length;
  report.perFile.push({ file: a.file, links: edits.map(ed => ({ phrase: ed.phrase, slug: ed.slug, why: ed.why })) });
  if (APPLY) {
    const fmEnd = a.raw.indexOf('\n---', 3) + 4; const head = a.raw.slice(0, fmEnd);
    if (head + body !== a.raw) { console.error('FRONT MATTER SPLIT MISMATCH ' + a.file); process.exitCode = 1; continue; }
    fs.writeFileSync(path.join(L.ROOT, a.file), head + out);
  }
}
console.log((APPLY ? 'APPLIED' : 'DRY RUN') + ': ' + report.files + ' article(s), ' + report.links + ' descriptive reference(s) resolved -> contextual links; unresolved (left as prose): ' + report.unresolved.length);
for (const f of report.perFile.slice(0, 10)) console.log('  ' + f.file + ': ' + f.links.map(l => '"' + l.phrase + '" -> ' + l.slug + ' (' + l.why + ')').join('; '));
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', APPLY ? 'link-guide-references.json' : 'link-guide-references-dry-run.json'), JSON.stringify({ tool: 'link-guide-references', mode: APPLY ? 'apply' : 'dry-run', generated: new Date().toISOString(), summary: { files: report.files, links: report.links, unresolved: report.unresolved.length }, perFile: report.perFile, unresolved: report.unresolved }, null, 2));
