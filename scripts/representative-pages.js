#!/usr/bin/env node
// REPRESENTATIVE PAGES — deterministic page-class test set derived from repo
// truth (never hardcoded fragile URLs). Used by Lighthouse CI.
// Output: JSON [{label, url}] to stdout, or a complete LHCI config with
// --lighthouserc (staticDistDir ./_site + modest error-floor assertions).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const arts = L.loadArticles();
function urlOf(a) { return '/articles/' + a.name.replace(/\.md$/, '') + '/'; }

const byBytes = (fn) => [...arts].sort((a, b) => fn(a) - fn(b));
const shortest = byBytes(a => a.raw.length)[0];
const longest = byBytes(a => -a.raw.length)[0];
const withTable = arts.find(a => /\n\|[^\n|]+\|[^\n]*\n\|[-: |]*-[-: |]*\|/.test(a.body));
const withSources = arts.find(a => Array.isArray(a.fm.sources) && a.fm.sources.length > 0);
const reviewRequired = arts.find(a => String(a.fm.review_status || '').toUpperCase() === 'REVIEW_REQUIRED');
const withRelatedPool = arts.filter(a => (Array.isArray(a.fm.internal_link_targets) && a.fm.internal_link_targets.length > 0) || (typeof a.fm.internal_link_targets === 'string' && a.fm.internal_link_targets.trim().length > 0));
const withRelated = (withSources && withRelatedPool.find(a => a.name !== withSources.name)) || withRelatedPool[0];

const pages = [
  { label: 'homepage', url: '/' },
  { label: 'articles-listing', url: '/articles/' },
  { label: 'cluster-hub', url: '/topics/' + L.CLUSTERS[0] + '/' },
  { label: 'short-article', url: urlOf(shortest), slug: shortest.name },
  { label: 'long-article', url: urlOf(longest), slug: longest.name },
  { label: 'article-with-table', url: urlOf(withTable), slug: withTable.name },
  { label: 'article-with-sources', url: urlOf(withSources), slug: withSources.name },
  { label: 'review-required-article', url: urlOf(reviewRequired), slug: reviewRequired.name },
  { label: 'article-with-related-guides', url: urlOf(withRelated), slug: withRelated.name }
];

if (process.argv.includes('--lighthouserc')) {
  const urls = pages.map(p => p.url);
  console.log(JSON.stringify({
    ci: {
      collect: { staticDistDir: './_site', url: urls.map(u => 'http://localhost/' + (u === '/' ? '' : u.replace(/^\//, ''))) },
      assert: {
        assertions: {
          'categories:performance': ['error', { minScore: 0.5 }],
          'categories:accessibility': ['error', { minScore: 0.75 }],
          'categories:best-practices': ['error', { minScore: 0.75 }],
          'categories:seo': ['error', { minScore: 0.8 }]
        }
      },
      upload: { target: 'temporary-public-storage' }
    }
  }, null, 2));
} else {
  console.log(JSON.stringify(pages.map(p => ({ label: p.label, url: p.url })), null, 2));
}
