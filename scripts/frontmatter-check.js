#!/usr/bin/env node
// Front-matter validator for _articles.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const F = new L.Findings();
const articles = L.loadArticles();
const slugSeen = {};

const REQUIRED = ['title', 'slug', 'description', 'topic_cluster', 'content_type', 'search_intent', 'last_reviewed'];
const CLUSTER_TYPE = { 'law-licences': 'legal' };

for (const a of articles) {
  const fm = a.fm;
  for (const err of a.parseErrors) F.add('P1', a.file, L.articleUrl(a), 'YAML parse issue: ' + err, 'Fix quoting');
  for (const k of REQUIRED) {
    const v = fm[k];
    if (v === undefined || v === null) F.add('P1', a.file, L.articleUrl(a), 'missing required field ' + k, 'Add ' + k);
    else if (Array.isArray(v) ? v.length === 0 : String(v).trim() === '') F.add('P1', a.file, L.articleUrl(a), 'empty value for ' + k, 'Fill in ' + k);
  }
  if (fm.slug) {
    if (slugSeen[fm.slug]) F.add('P0', a.file, L.articleUrl(a), 'duplicate slug ' + fm.slug + ' (also ' + slugSeen[fm.slug] + ')', 'Slugs must be unique');
    slugSeen[fm.slug] = a.file;
    if (!/^[a-z0-9-]+$/.test(fm.slug)) F.add('P2', a.file, L.articleUrl(a), 'slug not lowercase-kebab: ' + fm.slug, 'Use lowercase letters, digits, hyphens');
  }
  if (fm.topic_cluster && !L.CLUSTERS.includes(fm.topic_cluster)) F.add('P1', a.file, L.articleUrl(a), 'unknown topic_cluster ' + fm.topic_cluster, 'Use a canonical cluster');
  for (const dk of ['date_published', 'last_reviewed']) {
    if (fm[dk]) { const d = new Date(fm[dk]); if (isNaN(d.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(String(fm[dk]))) F.add('P1', a.file, L.articleUrl(a), 'invalid date ' + dk + '=' + fm[dk], 'Use YYYY-MM-DD'); }
  }
  // Sensitive content rules
  const isLegal = fm.content_type === 'legal' || a.fm.topic_cluster === 'law-licences';
  if (isLegal) {
    if (!fm.sources || fm.sources.length === 0) F.add('P1', a.file, L.articleUrl(a), 'legal article without sources', 'Legal content must cite primary sources');
    if (!fm.last_reviewed) F.add('P1', a.file, L.articleUrl(a), 'legal article without last_reviewed', 'Record review date');
  }
  const isModelTech = ['model-review', 'technical', 'maintenance'].includes(String(fm.content_type));
  if (isModelTech) {
    if (String(fm.content_type).includes('model') && !fm.manufacturer) F.add('P2', a.file, L.articleUrl(a), 'model content without manufacturer', 'Add manufacturer metadata');
    if (!fm.sources || fm.sources.length === 0) F.add('P2', a.file, L.articleUrl(a), 'technical content without sources', 'Cite specification sources');
  }
  if (fm.sources && !Array.isArray(fm.sources)) F.add('P1', a.file, L.articleUrl(a), 'sources is not an array', 'Use a YAML list');
  if (fm.internal_link_targets && typeof fm.internal_link_targets === 'string' && fm.internal_link_targets.includes(',') && !fm.internal_link_targets.includes(', ')) {
    F.add('P3', a.file, L.articleUrl(a), 'internal_link_targets uses "," without space; layout splits on ", "', 'Use "slug-a, slug-b" format');
  }
}

const report = { tool: 'frontmatter-check', counts: F.counts, findings: F.items };
fs.mkdirSync(path.join(L.ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(L.ROOT, 'reports', 'frontmatter-check.json'), JSON.stringify(report, null, 2));
console.log('frontmatter-check: P0=' + F.counts.P0 + ' P1=' + F.counts.P1 + ' P2=' + F.counts.P2 + ' P3=' + F.counts.P3);
process.exitCode = F.has(['P0']) ? 1 : 0;
