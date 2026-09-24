#!/usr/bin/env node
// Maintenance escalation helpers for the Weekly Maintenance workflow.
// Plain Node.js, no dependencies. Requires GITHUB_TOKEN and GITHUB_REPOSITORY.
// Subcommands:
//   issue   - create/update/close the single "Automated maintenance findings" issue
//             based on reports/maintenance.json (no duplicate weekly issues; a
//             completely clean run closes the issue instead of creating noise).
//   pr      - create a maintenance PR for safe fixes and attempt a squash merge
//             ONLY after the complete gate passed in the calling job. If the
//             merge is refused (branch protection / permissions), the PR stays
//             open for review — security is never weakened.
// Never creates articles or rewrites substantive content.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const repo = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
if (!repo || !token) { console.error('maintenance-escalate: GITHUB_TOKEN/GITHUB_REPOSITORY missing'); process.exit(1); }
const ISSUE_TITLE = 'Automated maintenance findings';
const api = (p, method, body) => fetch('https://api.github.com' + p, {
  method: method || 'GET',
  headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'maintenance' },
  body: body ? JSON.stringify(body) : undefined
});

function reportBody(m) {
  const lines = [];
  lines.push('Automated weekly maintenance report.');
  lines.push('');
  lines.push('- Run (UTC): ' + m.timestamp);
  lines.push('- MAIN SHA audited: ' + m.sha);
  lines.push('- Result: ' + m.result);
  lines.push('- Published articles: ' + m.articleCount + ' (baseline ' + m.baselineArticleCount + '), clusters: ' + m.clusters);
  lines.push('- QA tool findings: P0=' + (m.toolSeverityTotals ? m.toolSeverityTotals.P0 : 0) + ' P1=' + (m.toolSeverityTotals ? m.toolSeverityTotals.P1 : 0) + ' P2=' + (m.toolSeverityTotals ? m.toolSeverityTotals.P2 : 0) + ' P3=' + (m.toolSeverityTotals ? m.toolSeverityTotals.P3 : 0));
  lines.push('- Assistant tests: ' + m.assistant.summary + ', broken links: ' + m.brokenLinks + ', orphans: ' + m.orphans);
  lines.push('');
  if (m.blocking.length) {
    lines.push('## Blocking findings (must be fixed)');
    for (const b of m.blocking) lines.push('- [' + b.severity + '/' + b.area + '] ' + b.detail);
    lines.push('');
  }
  if (m.reviewItems.length || (m.toolReviewCounts && Object.keys(m.toolReviewCounts).length)) {
    lines.push('## Findings requiring review (not auto-fixed)');
    for (const r of m.reviewItems) lines.push('- [' + r.severity + '/' + r.area + '] ' + r.detail);
    for (const t of Object.keys(m.toolReviewCounts || {})) lines.push('- QA tool ' + t + ': ' + m.toolReviewCounts[t] + ' P2/P3 finding(s) — see reports/' + t + '.json');
    lines.push('');
  }
  if (m.safeFixesAvailable.length) {
    lines.push('## Safe fixes available');
    for (const s of m.safeFixesAvailable) lines.push('- ' + s.file + ' (' + (s.kind === 'internal_link_target' ? s.from + ' -> ' + s.to : s.kind) + ')');
    lines.push('');
  }
  if (m.result === 'FAIL') lines.push('The Quality Gate on this run FAILED. Treat as urgent.');
  lines.push('');
  lines.push('Full report: reports/maintenance-latest.md (workflow artifact `maintenance-report`).');
  return lines.join('\n');
}

async function findOpenIssue() {
  const r = await api('/repos/' + repo + '/issues?state=open&per_page=100');
  const list = await r.json();
  return (list || []).find(i => i.title === ISSUE_TITLE) || null;
}

async function cmdIssue() {
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'reports', 'maintenance.json'), 'utf8'));
  const open = await findOpenIssue();
  const actionable = m.blocking.length || m.reviewItems.length || (m.result === 'FAIL');
  if (!actionable) {
    if (open) {
      await api('/repos/' + repo + '/issues/' + open.number + '/comments', 'POST', { body: 'Maintenance run on ' + m.timestamp + ' (SHA ' + m.sha + ') is fully clean — result ' + m.result + '. Closing this tracking issue. It will be reopened automatically if a future weekly run finds something actionable.' });
      await api('/repos/' + repo + '/issues/' + open.number, 'PATCH', { state: 'closed', state_reason: 'completed' });
      console.log('maintenance-escalate: clean run — issue #' + open.number + ' closed.');
    } else {
      console.log('maintenance-escalate: clean run, no open issue, nothing created.');
    }
    return;
  }
  const body = reportBody(m);
  if (open) {
    await api('/repos/' + repo + '/issues/' + open.number, 'PATCH', { body });
    await api('/repos/' + repo + '/issues/' + open.number + '/comments', 'POST', { body: 'Weekly run ' + m.timestamp + ' (SHA ' + m.sha + ') — result ' + m.result + '. Body updated with current unresolved findings.' });
    console.log('maintenance-escalate: updated issue #' + open.number);
  } else {
    const r = await api('/repos/' + repo + '/issues', 'POST', { title: ISSUE_TITLE, body, labels: ['maintenance', 'automated'] });
    if (r.ok) console.log('maintenance-escalate: created issue #' + (await r.json()).number);
    else { console.error('maintenance-escalate: create failed', r.status, await r.text()); process.exit(1); }
  }
}

async function cmdPr(headBranch, files) {
  const fixes = files && files.length ? files : JSON.parse(fs.readFileSync(path.join(ROOT, 'reports', 'maintenance.json'), 'utf8')).fixesApplied || [];
  if (!fixes.length) { console.log('maintenance-escalate: no fixes to publish.'); return 0; }
  // Idempotent: reuse an existing open PR from this exact maintenance branch to
  // main instead of creating a duplicate (safe-fix job re-runs produce the same
  // deterministic branch name). The head filter uses the OWNER:branch format.
  const owner = repo.split('/')[0];
  const lr = await api('/repos/' + repo + '/pulls?state=open&head=' + encodeURIComponent(owner + ':' + headBranch) + '&base=main');
  let pr = null;
  if (lr.ok) {
    const list = await lr.json();
    pr = (list || []).find(p => p.head && p.head.ref === headBranch) || null;
  }
  const body = 'Applied by the Weekly Maintenance safe-fix job. The COMPLETE Quality Gate (all validators, Jekyll build with the GitHub Pages toolchain, rendered-site audit, Guide Assistant tests, article/slug inventory) passed on this exact repaired state before this PR was created.\n\nFixes applied: ' + fixes.join(', ') + '\n\nSafe-fix policy: deterministic, low-risk only. No article content, legal facts, business facts, prices, specifications or editorial text was rewritten.\n\nIf the squash merge below fails (branch protection/permissions), this PR stays open for review.';
  if (pr) {
    // Re-run of the same maintenance branch: refresh the body, leave one PR.
    await api('/repos/' + repo + '/pulls/' + pr.number, 'PATCH', { body });
    console.log('maintenance-escalate: reusing existing open PR #' + pr.number + ' (' + pr.html_url + ')');
  } else {
    const r = await api('/repos/' + repo + '/pulls', 'POST', {
      title: 'Automated maintenance: deterministic safe fixes',
      head: headBranch, base: 'main',
      body
    });
    if (!r.ok) { console.error('maintenance-escalate: PR create failed', r.status, await r.text()); process.exit(1); }
    pr = await r.json();
    console.log('maintenance-escalate: created PR #' + pr.number + ' (' + pr.html_url + ')');
  }
  const mr = await api('/repos/' + repo + '/pulls/' + pr.number + '/merge', 'PUT', { merge_method: 'squash' });
  if (mr.ok) { console.log('maintenance-escalate: PR #' + pr.number + ' squash-merged.'); return 0; }
  console.log('maintenance-escalate: auto-merge not permitted (' + mr.status + ') — PR #' + pr.number + ' left open for review.');
  console.log((await mr.text()).slice(0, 300));
  return 0;
}

const cmd = process.argv[2];
if (cmd === 'issue') cmdIssue().then(() => process.exit(0), e => { console.error(e); process.exit(1); });
else if (cmd === 'pr') cmdPr(process.argv[3], process.argv.slice(4)).then(c => process.exit(c), e => { console.error(e); process.exit(1); });
else { console.error('usage: maintenance-escalate.js issue | pr <head-branch> [files...]'); process.exit(1); }
