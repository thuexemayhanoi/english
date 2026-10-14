#!/usr/bin/env node
// SEO RESEARCH INGEST (zero-data / cold-start research layer, repository side).
//
// The connectors (OpenRush SERP, keyword, competitor and backlink tools) are read by
// an operator; their exports are JSON envelopes (schema ofe/1.0). Dropped into an
// inbox directory, this script merges them deterministically into the two files the
// matrix engine reads:
//   docs/seo/keyword-evidence.json   _serp_snapshot_ingested, _competitors,
//                                     _competitor_backlinks, _keyword_gap, _ingest_log
//   docs/seo/keyword-universe.json   on-topic demand rows per market
// Accepted inputs: a raw envelope, or {tool, input, result} wrappers around one.
// Rules (AGENTS.md): every figure keeps its tool, market and date; nothing is
// estimated or rounded; off-topic rows are dropped, competitor brand names are
// classified and never targeted; re-ingesting the same files changes nothing; the
// hand-written blocks (_analysis, _content_formats, _domain_baseline, _tracking,
// _site_audits, own_properties) are never touched.
//
// Usage: node scripts/seo-research-ingest.js [--inbox <dir>] [--dry-run]
//        default inbox: docs/seo/research/inbox (git-ignored)
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const ROOT = L.ROOT;
const SEO_DIR = path.join(ROOT, 'docs', 'seo');
const EVIDENCE = path.join(SEO_DIR, 'keyword-evidence.json');
const UNIVERSE = path.join(SEO_DIR, 'keyword-universe.json');
const MARKETS = { 'United States': 'us', 'United Kingdom': 'uk', 'Australia': 'au', 'Vietnam': 'vn', 'Canada': 'ca', 'Singapore': 'sg', 'New Zealand': 'nz' };
const MARKET_NAMES = { us: 'United States', uk: 'United Kingdom', au: 'Australia', vn: 'Vietnam', ca: 'Canada', sg: 'Singapore', nz: 'New Zealand' };
const OUR_HOST = new URL(L.SITE_URL).hostname.replace(/^www\./, '');

// ---------- classification (pure functions, exported for the engine tests) ----------
const GEO = /\b(hanoi|ha noi|vietnam|viet nam|vietnamese|saigon|ho chi minh|hcmc|da nang|danang|hoi an|hue|ha giang|sapa|sa pa|ninh binh|ha long|halong|cat ba|phong nha|da lat|dalat|nha trang|mui ne|phu quoc|laos)\b/i;
const VEHICLE = /\b(motorbiking|motorcycling|motorbike|motorbikes|motorcycle|motorcycles|scooter|scooters|moped|mopeds|bike|bikes|e-bike|ebike|50cc|125cc|110cc|150cc|honda|yamaha|vinfast|suzuki|sym|wave|air ?blade|vision|automatic|semi-automatic|licen[cs]e|licen[cs]es|idp|driving permit|helmet|helmets|rental|rentals|rent|renting|hire|riding|ride|driving|drive|repair|mechanic|garage)\b/i;
const ADJACENT = /\b(traffic|police|rainy season|monsoon|wet season|weather|road|roads|route|routes|loop|petrol|fuel|insurance|laws?|rules|accident|accidents|crash|deaths?)\b/i;
const BRANDS = /\b(13535|tuan|gia hung|gia hưng|james|style motorbikes|motorbike station|chrunix|flamingo|tigit|phung|rentabike|motorvina|extra mile|hanoi midori|duy anh|az motorbikes|rental motorbike vietnam|happiness lane|offroad vietnam|dragon bike|riderly|vbike|hai banh|haibanh|happyzip|izigo|motogo|giang son|qt motorbikes|cozy hostel|ha giang epic|jasmine|bong hostel|hong hao)\b/i;
const OFF_ALWAYS = /\b(cr-?v|civic|accord|br-?v|hr-?v|cars?|suv|hostels?|homestays?|hotels?|mama stay|coffee|pho\b|cost of liv|living cost|cost of life|living expenses|price of living|costs of living|salary|salaries|wage|wages|income|river|rivers|li xi|lixi|red envelope|ky co|eating|food|\beat\b|top gear|what type of food|vietnam special|for sale|sales\b|harley|vtech|razor|gta|juice wrld|hagrid|yugioh|beamng|wuwa|quarter mile|logbook|\bdwg\b|\bpng\b|clipart|\bsvg\b|icon\b)/i;
const OTHER_PLACE = /\b(thailand|thai\b|phuket|sicily|koh|nepal|phnom penh|krabi|cork|dubai|bali|florence|corfu|melbourne|perth|qatar|singapore|malaysia|ireland|\bnz\b|cyprus|essex|london|bangkok|kathmandu|rawai|chang|samui|utah|texas|florida|michigan|\bnj\b|\bnc\b|georgia|virginia|indiana|wisconsin|\bnys?\b|oregon|maryland|massachusetts|maine|tampa|\bvic\b|\bnt\b|\bact\b|california)\b/i;
const OTHER_CITY = /\b(saigon|ho chi minh|hcmc|da nang|danang|hoi an|hue|phu quoc|nha trang|mui ne|da lat|dalat|ha long|halong|cat ba|sapa|sa pa|ha giang|ninh binh|laos)\b/i;
// Big-bike brands and models the business does not rent: real Vietnam demand, adjacent only.
const BIG_BIKE = /\b(bmw|triumph|mutt|ducati|kawasaki|ktm|harley|royal enfield|benelli|cfmoto|gb350|cbr650r?|cb650|cb500|cb300|rebel|africa twin|mt-?07|mt-?09|mt-?15|r3|r15m?|ninja|z900|z650|xsr)\b/i;

function classify(keyword) {
  const kw = String(keyword || '').toLowerCase().trim();
  if (!kw) return null;
  if (OFF_ALWAYS.test(kw)) return null;
  const geo = GEO.test(kw);
  if (OTHER_PLACE.test(kw) && !geo) return null;
  if (BRANDS.test(kw)) return 'competitor-brand';
  if (BIG_BIKE.test(kw)) return GEO.test(kw) ? 'adjacent' : null;
  const veh = VEHICLE.test(kw);
  if (geo && veh) {
    if (OTHER_CITY.test(kw) && !/hanoi/i.test(kw) && /rent|hire|rental/i.test(kw)) return 'other-city';
    return 'core';
  }
  if (geo && ADJACENT.test(kw)) return 'adjacent';
  return null;
}
function topicOf(keyword) {
  const kw = String(keyword || '').toLowerCase();
  if (/licen[cs]e|idp|permit|paperwork|blue ?card/i.test(kw)) return 'licence-and-paperwork';
  if (/\b(buy|buying|price in vietnam|motorbike vietnam price|motorbike price)\b/i.test(kw)) return 'buying-vs-renting';
  if (/\b(repair|mechanic|garage|servic(e|ing)|maintenance|oil change|tyre|tire|battery)\b/i.test(kw)) return 'maintenance';
  if (/\b(helmet|helmets|gloves|jacket|rain ?coat|phone holder|lock|gear)\b/i.test(kw)) return 'parts-and-gear';
  if (/\b(trip|trips|loop|route|routes|tour|tours|holiday|holidays|itinerary|across|around|to ho chi minh|ho chi minh to|saigon to|north|ha giang|sapa|ninh binh|cat ba|ha long|phong nha)\b/i.test(kw)) return 'routes-and-trips';
  if (/\b(safe|safety|traffic|police|riding|ride|driving|drive|laws?|rules|accident|accidents|crash|deaths?|on a motorbike)\b/i.test(kw)) return 'riding-and-safety';
  if (/\b(50cc|125cc|110cc|150cc|honda|yamaha|vinfast|suzuki|sym|wave|air ?blade|vision|automatic|electric|e-bike|ebike|moped|mopeds|scooter|scooters|best)\b/i.test(kw) && !/rent|hire|rental/i.test(kw)) return 'vehicles';
  if (/hanoi/i.test(kw) && /rent|hire|rental/i.test(kw)) return /month|monthly|long term|long-term|weekly/i.test(kw) ? 'monthly-rental' : 'rental-hanoi';
  if (/rent|hire|rental/i.test(kw)) return 'rental-vietnam';
  return 'general';
}

// ---------- helpers ----------
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return String(u || ''); } };
const dateOf = s => (String(s || '').match(/^\d{4}-\d{2}-\d{2}/) || [''])[0];
const marketCode = loc => MARKETS[loc] || (loc ? String(loc).toLowerCase().replace(/[^a-z]+/g, '-') : 'us');
const readJSON = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return fallback; } };
const num = v => (v == null || v === '' || isNaN(Number(v))) ? null : Number(v);
const round = (v, d) => v == null ? null : Math.round(v * Math.pow(10, d)) / Math.pow(10, d);
const uniq = arr => [...new Set(arr)];

// Unwrap {tool, input, result} or take a raw envelope; detect the tool from the payload.
function detect(doc) {
  const env = doc && doc.result && doc.result.schema_version ? doc.result : doc;
  if (!env || !env.data || typeof env.data !== 'object') return null;
  const d = env.data; const input = (doc && doc.input) || {};
  let tool = (doc && doc.tool) || '';
  if (!tool) {
    if (env.domain === 'serp' && d.query) tool = 'inspect_serp';
    else if (d.seed && Array.isArray(d.keywords)) tool = 'research_keywords';
    else if (Array.isArray(d.gaps)) tool = 'compare_keyword_coverage';
    else if (Array.isArray(d.competitors) && !d.top_keywords) tool = 'discover_competitors';
    else if (d.summary && Array.isArray(d.top_keywords)) tool = 'inspect_domain';
    else if (env.domain === 'backlinks' && d.authority) tool = 'inspect_backlinks';
  }
  return tool ? { tool, env, d, input } : null;
}

function serpEntry(d, market) {
  const organic = (d.organic || []).map(o => ({ position: o.position, domain: host(o.url), url: o.url, title: o.title || '' }));
  const ours = organic.filter(o => host(o.url) === OUR_HOST || host(o.url).endsWith('.' + OUR_HOST));
  const brand = organic.filter(o => /nguyen[_ -]?tu|nguyentu/i.test(o.url + ' ' + o.title));
  const pathOf = o => (o.url.length < 90 && !/^https?:\/\/[^/]+\/?$/.test(o.url)) ? ' ' + o.url.replace(/^https?:\/\/(www\.)?/, '').replace(/^[^/]+/, '') : '';
  return {
    query: d.query, market: MARKET_NAMES[market] || d.location || 'United States', fetched_at: d.fetched_at || '',
    features: d.item_types_present || [],
    local_pack: (d.local_pack || []).map(l => ({ title: l.title, domain: host(l.url || ''), rating: l.rating ? l.rating.value : null, reviews: l.rating ? l.rating.votes_count : null })),
    featured_snippet: d.featured_snippet ? (d.featured_snippet.url || true) : null,
    people_also_ask: d.people_also_ask || [], related_searches: d.related_searches || [],
    organic_top: organic.slice(0, 10).map(o => o.position + '. ' + o.domain + pathOf(o)),
    en_rentbikehanoi_positions: ours.map(o => o.position),
    brand_mentions: brand.map(o => o.position + '. ' + o.domain + ' — ' + o.title),
    total_available: (d.total_available != null ? d.total_available : undefined)
  };
}

// ---------- ingest ----------
function ingest(inbox, opts) {
  opts = opts || {};
  const ev = readJSON(EVIDENCE, null) || { _about: 'Recorded third-party keyword evidence consumed by scripts/english-seo-matrix.js. Every figure was returned by a named tool on the stated date; nothing is estimated.' };
  const uni = readJSON(UNIVERSE, null) || { rows: [], sources: [] };
  const files = fs.existsSync(inbox) ? fs.readdirSync(inbox).filter(f => f.endsWith('.json')).sort() : [];
  const log = Array.isArray(ev._ingest_log) ? ev._ingest_log.slice() : [];
  const rowsByKw = {}; for (const r of uni.rows || []) rowsByKw[String(r.keyword).toLowerCase().trim()] = r;
  const srcKey = s => [s.tool, s.seed || s.domain || s.scope || '', s.mode || '', s.market || '', s.date || ''].join('|');
  const sources = {}; for (const s of uni.sources || []) sources[srcKey(s)] = s;
  const serp = ev._serp_snapshot_ingested && Array.isArray(ev._serp_snapshot_ingested.queries) ? ev._serp_snapshot_ingested : { queries: [] };
  const serpByKey = {}; for (const q of serp.queries) serpByKey[q.query.toLowerCase() + '|' + (q.market || '')] = q;
  const comp = ev._competitors && typeof ev._competitors === 'object' ? ev._competitors : {};
  const deepDives = Object.assign({}, comp.deep_dives || {});
  if (comp.deep_dive && comp.deep_dive.domain && !deepDives[comp.deep_dive.domain]) deepDives[comp.deep_dive.domain] = comp.deep_dive;
  const bl = ev._competitor_backlinks && typeof ev._competitor_backlinks === 'object' ? ev._competitor_backlinks : {};
  const blDomains = Object.assign({}, bl.domains || {});
  let gap = ev._keyword_gap && typeof ev._keyword_gap === 'object' ? ev._keyword_gap : null;
  const summary = { files: files.length, ingested: 0, skipped: [], serps: 0, keywordFiles: 0, rowsKept: 0, rowsDropped: 0 };

  const addRow = (keyword, market, k, src, ranking) => {
    const key = String(keyword || '').toLowerCase().trim(); const cls = classify(key);
    if (!cls) { summary.rowsDropped++; return false; }
    const r = rowsByKw[key] = rowsByKw[key] || { keyword: key, relevance: cls, topic: topicOf(key), intent: k.intent || '', volume: {}, cpc_usd: {}, competition: {}, competitors_ranking: [], sources: [] };
    r.relevance = cls; r.topic = topicOf(key);
    if (market && k.monthly_volume != null) r.volume[market] = k.monthly_volume;
    if (market && k.cpc_usd != null) r.cpc_usd[market] = round(k.cpc_usd, 2);
    if (market && k.competition_level) r.competition[market] = k.competition_level;
    if (!r.intent && k.intent) r.intent = k.intent;
    if (src && !r.sources.includes(src)) r.sources.push(src);
    for (const c of ranking || []) if (c && c.competitor && !r.competitors_ranking.some(x => x.domain === c.competitor)) r.competitors_ranking.push({ domain: c.competitor, position: c.position, url: c.url });
    summary.rowsKept++; return true;
  };

  for (const file of files) {
    const doc = readJSON(path.join(inbox, file), null);
    const det = detect(doc);
    if (!det) { summary.skipped.push(file + ': not a recognised connector export'); continue; }
    const { tool, env, d, input } = det;
    const date = dateOf(d.fetched_at || (env.coverage && env.coverage.as_of) || '');
    const market = marketCode(d.location || input.location || 'United States');
    const logEntry = { file, tool, date, market };
    if (tool === 'inspect_serp') {
      const e = serpEntry(d, market); e.total_available = env.coverage ? env.coverage.total_available : undefined; if (e.total_available === undefined) delete e.total_available;
      const key = e.query.toLowerCase() + '|' + e.market; const prev = serpByKey[key];
      if (!prev) { serpByKey[key] = e; }
      else if (prev.fetched_at < e.fetched_at) { e.history = (prev.history || []).concat([{ fetched_at: prev.fetched_at, en_rentbikehanoi_positions: prev.en_rentbikehanoi_positions, brand_mentions: prev.brand_mentions }]).slice(-24); serpByKey[key] = e; }
      logEntry.scope = e.query; summary.serps++;
    } else if (tool === 'research_keywords') {
      const src = 'research_keywords ' + d.mode + ' "' + d.seed + '" ' + market;
      let kept = 0; for (const k of d.keywords || []) if (addRow(k.keyword, market, k, src)) kept++;
      const s = { tool: 'OpenRush research_keywords', seed: d.seed, mode: d.mode, market, date, returned: env.coverage ? env.coverage.returned : (d.keywords || []).length, total_available: env.coverage ? env.coverage.total_available : null, on_topic_rows: kept };
      sources[srcKey(s)] = s; logEntry.scope = d.mode + ' "' + d.seed + '"'; logEntry.rows_kept = kept; summary.keywordFiles++;
    } else if (tool === 'compare_keyword_coverage') {
      const src = 'compare_keyword_coverage vs ' + (d.competitors || []).join(', ') + ' ' + market;
      let kept = 0; for (const k of d.gaps || []) if (addRow(k.keyword, market, k, src, k.competitors_ranking)) kept++;
      const clusters = Object.fromEntries(Object.entries(d.intent_clusters || {}).map(([k, v]) => [k, Array.isArray(v) ? v.length : v]));
      const s = { tool: 'OpenRush compare_keyword_coverage', domain: d.domain, competitors: d.competitors || [], market, date, returned: env.coverage ? env.coverage.returned : (d.gaps || []).length, total_available: env.coverage ? env.coverage.total_available : null, on_topic_rows: kept, intent_clusters: clusters };
      sources[srcKey(s)] = s;
      gap = { tool: 'OpenRush compare_keyword_coverage', date, market: MARKET_NAMES[market] || market, domain: d.domain, competitors: d.competitors || [], returned: s.returned, total_available: s.total_available, intent_clusters: clusters, on_topic_rows: kept, note: (gap && gap.note) || 'The target has no indexed keywords yet, so the gap list is everything these competitors rank for; off-topic rows are dropped, on-topic rows are merged into docs/seo/keyword-universe.json with the competitor position recorded.' };
      logEntry.scope = d.domain + ' vs ' + (d.competitors || []).join(','); logEntry.rows_kept = kept; summary.keywordFiles++;
    } else if (tool === 'inspect_domain') {
      const src = 'inspect_domain ' + d.domain + ' top keywords ' + market;
      let kept = 0; for (const k of d.top_keywords || []) if (addRow(k.keyword, market, k, src, [{ competitor: d.domain, position: k.position, url: k.url }])) kept++;
      deepDives[d.domain] = { tool: 'OpenRush inspect_domain', domain: d.domain, date, market: MARKET_NAMES[market] || market, summary: d.summary, intent_mix: d.intent_mix,
        top_keywords: (d.top_keywords || []).map(k => ({ keyword: k.keyword, position: k.position, url: k.url, monthly_volume: k.monthly_volume, intent: k.intent })),
        top_pages: (d.top_pages || []).map(p => ({ url: p.url, organic_keywords: p.organic_keywords, est_traffic_month: p.estimated_organic_traffic_per_month, top_3_keywords: p.top_3_keywords })),
        likely_competitors: (d.likely_competitors || []).map(c => ({ domain: c.competitor, shared_keywords: c.shared_keywords, est_traffic_month: c.competitor_estimated_organic_traffic, organic_keywords: c.competitor_organic_keywords })) };
      const s = { tool: 'OpenRush inspect_domain', domain: d.domain, market, date, on_topic_rows: kept }; sources[srcKey(s)] = s;
      logEntry.scope = d.domain; logEntry.rows_kept = kept; summary.keywordFiles++;
    } else if (tool === 'discover_competitors') {
      comp.tool = 'OpenRush discover_competitors' + (input.seed_keywords ? ' (seed_keywords mode)' : d.domain && d.domain !== '(seed-keyword-based)' ? ' (domain mode)' : '') + ' + inspect_domain';
      comp.date = date; comp.market = MARKET_NAMES[market] || market; comp.seeds = input.seed_keywords || comp.seeds || [];
      comp.total_available = env.coverage ? env.coverage.total_available : null;
      comp.note = comp.note || 'Who consistently ranks across the seed queries in the live SERP database; global platform/UGC domains are excluded by the tool. shared_keywords = seeds the domain ranks for; visibility is the tool\'s weighted score. en.rentbikehanoi.com itself holds no indexed position on any seed (new domain).';
      comp.rows = (d.competitors || []).map(c => ({ domain: c.competitor, shared_keywords: c.shared_keywords, avg_position: round(c.avg_position, 1), median_position: c.median_position, visibility: round(c.visibility, 2) }));
      logEntry.scope = (comp.seeds || []).length + ' seeds';
    } else if (tool === 'inspect_backlinks') {
      const clean = (d.referring_domains || []).filter(r => (r.spam_score || 0) <= 20).sort((a, b) => b.referring_page_rank - a.referring_page_rank || a.domain.localeCompare(b.domain));
      blDomains[d.domain] = { date, authority: d.authority, referring_domains_returned: (d.referring_domains || []).length, referring_domains_total: env.coverage ? env.coverage.total_available : null,
        clean_referring_domains: clean.map(r => ({ domain: r.domain, page_rank: r.referring_page_rank, backlinks: r.backlinks, spam_score: r.spam_score, first_seen: String(r.first_seen || '').slice(0, 10) })),
        spam_or_network_domains: (d.referring_domains || []).length - clean.length };
      logEntry.scope = d.domain;
    }
    const k = file + '|' + date; if (!log.some(x => x.file + '|' + x.date === k)) log.push(logEntry);
    summary.ingested++;
  }

  // ---------- assemble ----------
  const serpQueries = Object.values(serpByKey).sort((a, b) => a.query.localeCompare(b.query) || String(a.market).localeCompare(String(b.market)));
  if (serpQueries.length) ev._serp_snapshot_ingested = { tool: 'OpenRush inspect_serp (ingested by scripts/seo-research-ingest.js)', date: serpQueries.map(q => dateOf(q.fetched_at)).sort().pop(), note: 'Live SERP snapshots per query and market: features, local-pack entries (ratings and review counts as displayed), People also ask, related searches, top organic results, our own positions and brand mentions. People-also-ask questions feed the content gap register and the Common questions on the hubs (answers only from OWNER-FACTS or a VERIFIED article). A newer snapshot of the same query and market replaces the old one and keeps its positions in history.', queries: serpQueries };
  if (comp.rows || Object.keys(deepDives).length) {
    comp.deep_dives = Object.fromEntries(Object.keys(deepDives).sort().map(k => [k, deepDives[k]]));
    const strongest = (comp.rows || []).map(r => r.domain).find(dm => deepDives[dm]) || Object.keys(comp.deep_dives)[0];
    if (strongest) comp.deep_dive = deepDives[strongest];
    ev._competitors = comp;
  }
  if (Object.keys(blDomains).length) ev._competitor_backlinks = Object.assign({ tool: 'OpenRush inspect_backlinks (views authority + referring_domains)', note: 'domain_rank is the index\'s 0-1000 domain score; row-level page_rank is PAGE-level, not domain authority. clean_referring_domains keeps rows with spam_score <= 20 (the rest are link networks, casino/mirror sites and directories, deliberately not listed as prospects). Prospecting is an owner task; links are never bought. Domains listed in own_properties belong to the competitors themselves and are skipped in the prospect list.' }, bl, { date: Object.values(blDomains).map(v => v.date).sort().pop(), domains: Object.fromEntries(Object.keys(blDomains).sort().map(k => [k, blDomains[k]])) });
  if (gap) ev._keyword_gap = gap;
  ev._ingest_log = log.sort((a, b) => a.file.localeCompare(b.file) || String(a.date).localeCompare(String(b.date)));

  const maxVol = r => Math.max(0, ...Object.values(r.volume || {}).map(v => v || 0));
  const rows = Object.values(rowsByKw).map(r => Object.assign({}, r, { relevance: classify(r.keyword), topic: topicOf(r.keyword) })).filter(r => r.relevance).sort((a, b) => maxVol(b) - maxVol(a) || a.keyword.localeCompare(b.keyword));
  for (const r of rows) { r.sources.sort(); r.competitors_ranking.sort((a, b) => a.domain.localeCompare(b.domain)); }
  const srcList = Object.values(sources).sort((a, b) => srcKey(a).localeCompare(srcKey(b)));
  const universe = {
    _about: uni._about || 'Zero-data / cold-start keyword universe for en.rentbikehanoi.com. Every row is a demand estimate from a third-party search index read through the OpenRush connector on the date given (no Google Search Console, GA4 or rank data exists yet). Volumes are the index\'s monthly estimates per market (English queries made from that country); they are evidence for prioritisation, never facts to publish. Rows are kept only when on-topic (relevance core = Hanoi/Vietnam motorbike, scooter, rental, licence, riding, repair or gear; adjacent = Vietnam riding context without the vehicle word; other-city = rental intent for a city the business does not serve; competitor-brand = another rental brand\'s name, never a target). Off-topic rows returned by the tools are dropped by scripts/seo-research-ingest.js. scripts/english-seo-matrix.js maps each row to the URL that serves it and writes docs/seo/keyword-universe.md.',
    _rules: uni._rules || ['Never invent or round volumes; copy the tool value with its market and date.', 'Competitor brand names are recorded for SERP understanding only and are never targeted in titles, headings or copy.', 'No new articles are created for gaps (production plan complete): a gap is served inside the nearest existing URL or left as REVIEW_REQUIRED for the owner.', 'Replace or supplement this file with Search Console data when it exists (DATA-DRIVEN mode, see README).'],
    generated: srcList.map(s => s.date).filter(Boolean).sort().pop() || uni.generated || '',
    markets: Object.fromEntries(uniq(rows.flatMap(r => Object.keys(r.volume)).concat(srcList.map(s => s.market))).filter(Boolean).sort().map(m => [m, MARKET_NAMES[m] || m])),
    sources: srcList,
    rows
  };
  summary.universeRows = rows.length;
  summary.byRelevance = rows.reduce((o, r) => (o[r.relevance] = (o[r.relevance] || 0) + 1, o), {});
  summary.serpQueries = serpQueries.length;
  if (!opts.dryRun) {
    fs.mkdirSync(SEO_DIR, { recursive: true });
    fs.writeFileSync(EVIDENCE, JSON.stringify(ev, null, 1) + '\n');
    fs.writeFileSync(UNIVERSE, JSON.stringify(universe, null, 1) + '\n');
  }
  return { summary, evidence: ev, universe };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const opt = n => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
  const inbox = path.resolve(ROOT, opt('--inbox') || path.join('docs', 'seo', 'research', 'inbox'));
  const res = ingest(inbox, { dryRun: args.includes('--dry-run') });
  const s = res.summary;
  console.log('seo-research-ingest: ' + s.ingested + '/' + s.files + ' files from ' + path.relative(ROOT, inbox) + (args.includes('--dry-run') ? ' (dry run)' : '') + ' -> SERP snapshots ' + s.serpQueries + ', universe rows ' + s.universeRows + ' (' + Object.entries(s.byRelevance || {}).map(([k, v]) => k + ' ' + v).join(', ') + '); rows kept ' + s.rowsKept + ', dropped ' + s.rowsDropped);
  for (const x of s.skipped) console.log('  skipped ' + x);
}
module.exports = { classify, topicOf, detect, serpEntry, ingest };
