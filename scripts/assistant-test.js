#!/usr/bin/env node
// Guide Assistant test suite — runs AssistantCore against the knowledge index.
// Mode 1 (default): emulate the Jekyll-built assistant-index.json from source files
//   (articles + FAQ include), mirroring the Liquid chunking in assistant-index.json.
// Mode 2: node scripts/assistant-test.js <url-or-path> — test an actual built index
//   (e.g. the live https://thuexemayhanoi.github.io/english/assistant-index.json).
// Plain Node.js, no dependencies.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BASEURL = '/english';

// ---------- Minimal YAML reader for _data/assistant-business.yml (flat keys + price list) ----------
function loadBiz() {
  const raw = fs.readFileSync(path.join(ROOT, '_data/assistant-business.yml'), 'utf8');
  const biz = { prices: [] };
  let cur = null;
  for (const line of raw.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(/^\s*-\s+model:\s*"(.*)"\s*$/);
    if (m) { cur = { model: m[1] }; biz.prices.push(cur); continue; }
    const kv = line.match(/^([a-z_]+):\s*"(.*)"\s*$/);
    if (kv && !line.startsWith(' ')) { biz[kv[1]] = kv[2]; continue; }
    const kv2 = line.match(/^\s+(day|week|month):\s*"(.*)"\s*$/);
    if (kv2 && cur) { cur[kv2[1]] = kv2[2]; continue; }
  }
  return biz;
}

// ---------- Index emulation (mirrors the Liquid template) ----------
function stripFrontMatter(raw) {
  const m = raw.match(/^---\n.*?\n---\n/s);
  return m ? raw.slice(m[0].length) : raw;
}

function parseFmMap(raw) {
  const m = raw.match(/^---\n(.*?)\n---\n/s);
  const fm = {};
  if (!m) return fm;
  let listKey = null;
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const kv = line.match(/^([a-z_]+):\s*"?(.*?)"?\s*$/);
    if (kv && !line.startsWith(' ')) { fm[kv[1]] = kv[2]; listKey = null; continue; }
    const li = line.match(/^\s*-\s*"?(.*?)"?\s*$/);
    if (li && listKey) { (fm[listKey] = fm[listKey] || []).push(li[1]); }
    if (kv && line.startsWith(' ')) { listKey = kv[1]; fm[listKey] = []; }
  }
  return fm;
}

function buildIndexEmulated() {
  const chunks = [];
  // Articles
  const dir = path.join(ROOT, '_articles');
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md'))) {
    const raw = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = parseFmMap(raw);
    const content = stripFrontMatter(raw);
    const url = BASEURL + '/articles/' + f.replace(/\.md$/, '') + '/';
    const secs = content.split('\n## ');
    secs.forEach((sec, si) => {
      const ps = sec.split('\n\n');
      const heading = si === 0 ? fm.title : ps[0].trim();
      const bodyps = si === 0 ? ps : ps.slice(1);
      const pairmod = si === 0 ? 0 : 1;
      const bodytxt = bodyps.join('\n\n').trim();
      if (!bodytxt || !heading) return;
      const wc = bodytxt.split(' ').length;
      const emit = (x) => chunks.push({ t: fm.title, h: heading, x, u: url, topic: fm.topic_cluster,
        tags: fm.tags || [], st: 'article', rs: fm.review_status || null });
      if (wc <= 280) { emit(bodytxt); return; }
      bodyps.forEach((p, pi) => {
        if (pi % 2 !== pairmod) return;
        const b2 = bodyps.slice(pi, pi + 2).join('\n\n').trim();
        if (b2) emit(b2);
      });
    });
  }
  // FAQ (include body, Liquid links resolved to baseurl)
  const faqBody = fs.readFileSync(path.join(ROOT, '_includes/faq-body.html'), 'utf8')
    .replace(/\{\{\s*'([^']*)'\s*\|\s*relative_url\s*\}\}/g, (m, p) => BASEURL + p);
  const faqsecs = faqBody.split('<h2');
  faqsecs.forEach((fsec, i) => {
    if (i === 0) return;
    const sidm = fsec.match(/id="([^"]*)"/);
    if (!sidm) return;
    const faqurl = BASEURL + '/faq/#' + sidm[1];
    const h3s = fsec.split('<h3>');
    h3s.forEach((item, j) => {
      if (j === 0) return;
      const qa = item.split('</h3>');
      const q = qa[0].trim();
      const rest = qa.slice(1).join('');
      const ansP = rest.split('</p>')[0];
      const ans = ansP.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (!q || !ans) return;
      chunks.push({ t: 'Hanoi Motorbike Rental FAQ', h: q, x: ans, u: faqurl,
        topic: 'faq', tags: [], st: 'faq', rs: null, qa: true });
    });
  });
  return { v: 2, chunks };
}

function loadIndexActual(target) {
  let raw;
  if (/^https?:/.test(target)) {
    // Synchronous fetch via curl (kept dependency-free).
    raw = require('child_process').execFileSync('curl', ['-s', '--max-time', '30', target], { encoding: 'utf8' });
  } else {
    raw = fs.readFileSync(target, 'utf8');
  }
  return JSON.parse(raw);
}

// ---------- Test runner ----------
const Core = require('../assets/js/assistant-core.js');

function run(chunks, label) {
  const biz = loadBiz();
  let pass = 0, fail = 0;
  const results = [];
  function ask(q, ctx) {
    return Core.answer(q, { chunks, biz, ctx: ctx || {} });
  }
  function check(name, q, expect, ctx) {
    const r = ask(q, ctx);
    const text = r.html.toLowerCase();
    const bad = expect.filter(e => text.indexOf(e.toLowerCase()) === -1);
    const ok = bad.length === 0;
    if (ok) { pass++; results.push({ q, ok: true, conf: r.confidence, ans: r.html.slice(0, 110) }); }
    else { fail++; results.push({ q, ok: false, conf: r.confidence, missing: bad, ans: r.html.slice(0, 110) }); }
    return r;
  }

  // Single-turn business + retrieval
  check('vision price', 'How much is a Honda Vision?', ['200,000 VND', '800,000–1,000,000 VND']);
  check('sirius price', 'How much is a Sirius?', ['150,000 VND']);
  check('electric price', 'How much is an electric bike?', ['200,000 VND']);
  check('50cc price', 'How much is a 50cc?', ['No fixed price is published']);
  check('airblade availability', 'Do you have an Air Blade today?', ['listed in Nguyen Tu', 'contact us to confirm current availability']);
  check('delivery', 'Can you deliver to Tay Ho?', ['may be available depending on location']);
  check('cards', 'Do you accept cards?', ['Card payment is not confirmed']);
  check('deposit', 'What is the deposit?', ['2,000,000–5,000,000 VND']);
  check('insurance', 'Do you provide insurance?', ['does not provide motorbike insurance']);
  check('licence tourists', 'Do tourists need a licence?', ['licence']);
  check('location', 'Where are you?', ['112 Nguyen Van Cu Street']);
  check('hours', 'What time do you close?', ['09:00–21:00']);
  check('chain', 'What happens if the chain is loose?', ['chain']);
  check('1949 idp', 'Does a 1949 IDP work?', ['1968', 'Vienna']);
  check('beer', 'Can I drink one beer and ride?', ['alcohol']);

  // Multi-turn
  let r1 = check('multi: vision first', 'How much is a Honda Vision?', ['200,000 VND']);
  check('multi: monthly follow-up', 'What about monthly?', ['1,800,000–2,000,000 VND'], r1.ctx);
  let r2 = check('multi: licence first', 'Do tourists need a licence?', ['licence']);
  check('multi: 50cc follow-up', 'What about 50cc?', ['50cc'], r2.ctx);

  // Typos
  check('typo vison', 'vison price', ['200,000 VND']);
  check('typo airblade', 'airblade rent', ['Air Blade']);
  check('typo lisence', 'lisence vietnam', ['licence']);

  // Fallback
  const fb = ask('xyz nonsense banana');
  if (fb.fallback && fb.html.indexOf("couldn't find") !== -1) { pass++; results.push({ q: 'xyz nonsense banana', ok: true, conf: fb.confidence }); }
  else { fail++; results.push({ q: 'xyz nonsense banana', ok: false, ans: fb.html.slice(0, 110) }); }

  // Never claim stock
  const stock = ask('Do you have a Honda Wave today?');
  if (/contact us to confirm current availability/i.test(stock.html)) { pass++; results.push({ q: 'stock safety', ok: true }); }
  else { fail++; results.push({ q: 'stock safety', ok: false, ans: stock.html.slice(0, 110) }); }
  // Availability answers must never imply confirmed current stock
  const stock2 = ask('Is the Vision currently available?');
  if (!/\bin stock\b|currently available|yes, .*(available|in stock)/i.test(stock2.html)) { pass++; results.push({ q: 'no-stock-overclaim', ok: true }); }
  else { fail++; results.push({ q: 'no-stock-overclaim', ok: false, ans: stock2.html.slice(0, 110) }); }

  // Report
  console.log('=== Guide Assistant test: ' + label + ' ===');
  console.log('chunks: ' + chunks.length + ' | FAQ units: ' + chunks.filter(c => c.qa).length);
  for (const r of results) {
    console.log((r.ok ? 'PASS' : 'FAIL') + ' [' + (r.conf || '-') + '] ' + r.q +
      (r.ok ? '' : '  MISSING: ' + JSON.stringify(r.missing)) +
      (r.ok ? ' :: ' + (r.ans || '').replace(/\s+/g, ' ').slice(0, 90) : ' :: ' + (r.ans || '').replace(/\s+/g, ' ').slice(0, 90)));
  }
  console.log('RESULT: ' + pass + ' passed, ' + fail + ' failed, ' + chunks.length + ' chunks (' +
    chunks.filter(c => c.qa).length + ' FAQ)');
  return { pass, fail, chunks: chunks.length, faqs: chunks.filter(c => c.qa).length };
}

const arg = process.argv[2];
let summary;
if (arg) {
  const idx = loadIndexActual(arg);
  summary = run(idx && idx.chunks ? idx.chunks : idx, 'actual index: ' + arg);
} else {
  const idx = buildIndexEmulated();
  summary = run(idx.chunks, 'emulated index (local source)');
}
if (summary.fail > 0) {
  console.error('assistant-test: ' + summary.fail + ' test(s) FAILED — exit 1');
  process.exit(1);
}
process.exit(0);
