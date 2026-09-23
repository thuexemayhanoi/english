#!/usr/bin/env node
// Temporary docs-sync applier for Batch 9 (removed after it runs once).
'use strict';
const fs = require("fs");
const payload = {"replacements":[
{"file":"README.md","find":"- 442 published articles:","replace":"- 457 published articles:"},
{"file":"README.md","find":"and 50 cluster-9 parts, accessories & riding gear Part 2 articles (Batch 8, 2026-09-23 — see docs/matrix/batch-8-status.md). Clusters 10 and 8 are COMPLETE (all 55 safety and all 120 maintenance intents).","replace":"50 cluster-9 parts, accessories & riding gear Part 2 articles (Batch 8, 2026-09-23 — see docs/matrix/batch-8-status.md), and 15 cluster-9 parts, accessories & riding gear Part 3 articles completing cluster 9 (Batch 9, 2026-09-23 — see docs/matrix/batch-9-status.md). Clusters 8, 9 and 10 are COMPLETE (all 55 safety, all 120 maintenance and all 90 parts/gear intents)."},
{"file":"README.md","find":"parts-gear hub lists all 75 parts/gear guides.","replace":"parts-gear hub lists all 90 parts/gear guides."},
{"file":"README.md","find":"1. 7 topic clusters have zero published articles (planned content, not a defect — next up per MASTER-MATRIX.md ordering: cluster 9 parts/gear Part 2 (65 rows)).","replace":"1. 6 topic clusters have zero published articles (planned content, not a defect — next up per MASTER-MATRIX.md ordering: clusters 3–4 scooter and motorcycle reviews, with specification population from manufacturer pages into docs/MODEL-DATABASE.md first)."},
{"file":"README.md","find":"Sitemap covers all indexable URLs (464 at the Batch-8 state; verified against the build report).","replace":"Sitemap covers all indexable URLs (479 at the Batch-9 state; verified against the build report)."},
{"file":"README.md","find":"Latest verified implementation commit: 651e00e23bef7c2e67b54d4196e83b68ddf4185f (Batch 8: 50 cluster-9 parts/gear Part 2 articles in five part-commits 5b6009f–d667458 plus QA fixes 651e00e). Verified live on Pages on 2026-09-23: new article pages (e.g. helmet-safety-standards-explained-vietnam, gps-trackers-motorbikes-vietnam) resolve on the live site, the parts-gear hub lists the new guides, and the live sitemap carries the new batch-8 slugs (464 indexable URLs at the Batch-8 state; 443 article URLs incl. the /articles/ index).","replace":"Latest verified implementation commit: 56c2896b03d537e33f682c116a8eb0cdfc3033c6 (Batch 9: 15 cluster-9 parts/gear Part 3 articles in two part-commits 43358bd and 56c2896; cluster 9 complete). Verified live on Pages on 2026-09-23: all 15 new article pages resolve on the live site, the parts-gear hub shows the 90-guide count, and the passing Quality Gate rendered-site audit confirms sitemap coverage (479 indexable URLs expected at the Batch-9 state; 458 article URLs incl. the /articles/ index)."},
{"file":"README.md","find":"Latest verified Quality Gate run: 35822647185 (commit 651e00e, success, 2026-09-23).","replace":"Latest verified Quality Gate run: 35827544583 (commit 56c2896, success, 2026-09-23)."},
{"file":"README.md","find":"Latest verified Pages run: 35822647157 (commit 651e00e, success, 2026-09-23).","replace":"Latest verified Pages run: 35827544229 (commit 56c2896; build/deploy checks success, 2026-09-23)."},
{"file":"README.md","find":"Batch 8 complete (2026-09-23): 50 cluster-9 parts, accessories & riding gear Part 2 articles published; cluster 9 at 75/90; site-wide 442 published articles. Next: cluster 9 Part 3 (15 remaining) to complete the parts/gear cluster, then the next approved cluster per docs/MASTER-MATRIX.md batch order (clusters 3–4, specification population from manufacturer pages into docs/MODEL-DATABASE.md first), continuing to use OWNER-FACTS.md as the only source of business and pricing claims and primary/manufacturer sources for any technical specification.","replace":"Batch 9 complete (2026-09-23): 15 cluster-9 parts, accessories & riding gear Part 3 articles published; cluster 9 COMPLETE at 90/90; site-wide 457 published articles. Next: the next approved cluster per docs/MASTER-MATRIX.md batch order — clusters 3–4 scooter and motorcycle reviews, with specification population from manufacturer pages into docs/MODEL-DATABASE.md first (initial Honda VN rows verified 2026-09-23), continuing to use OWNER-FACTS.md as the only source of business and pricing claims and primary/manufacturer sources for any technical specification."},
{"file":"README.md","find":"- 2026-09-23 (28): Batch 8","replace":"- 2026-09-23 (29): Batch 9 — parts, accessories & riding gear (cluster 9) Part 3, cluster COMPLETE: 15 articles published in two part-commits (43358bd, 56c2896; MM-0377–MM-0391). Parts/gear 15 (9.1 helmets: helmet-fasteners-retention-systems, helmet-sun-heat-damage-vietnam, prescription-glasses-under-helmet; 9.2 riding-gear: earplugs-motorbike-wind-noise, hi-vis-vests-motorbike-riders; 9.3 accessories-luggage: pet-carriers-motorbikes-vietnam, waterproof-document-pouches-motorbike; 9.4 security: security-marking-kits-motorbike; 9.5 parts-accessories: portable-jump-starter-packs-motorbikes, tyre-pressure-monitoring-systems-motorbikes, bar-end-weights-vibration, aftermarket-horns-motorbikes, aftermarket-exhausts-motorbikes-vietnam, frame-sliders-engine-case-protection, tank-pads-scooters). Cluster 9 is COMPLETE (90/90). Same content rules as Batch 8: no invented prices, availability, promotions, torque values, capacities or legal claims (horn and exhaust articles direct readers to verify current regulations); OWNER-FACTS is the only source of business claims. All 15 articles cross-linked into the internal-link graph; internal_link_targets validated against published slugs (0 broken references). QA: Quality Gate PASS (run 35827544583 on commit 56c2896, no blocking findings; the part-1 commit 43358bd also passed its gate run); Pages deployment run 35827544229 with build/deploy checks success; all 15 new slugs verified live on Pages (article pages, parts-gear hub 90-guide count). Groundwork for the next batch order step: initial verified Honda VN specification rows recorded in docs/MODEL-DATABASE.md (retrieved 2026-09-23; cluster 3 scooter reviews next). State docs: docs/matrix/batch-9-status.md (authoritative batch record), master-matrix.csv 15 new rows (457 rows), MASTER-MATRIX.md counts, README state sections. 457 published articles site-wide.\n- 2026-09-23 (28): Batch 8"},
{"file":"README.md","find":"docs/matrix/master-matrix.csv currently holds 392 committed rows","replace":"docs/matrix/master-matrix.csv currently holds 457 committed rows"},
{"file":"README.md","find":"and 25 cluster-9 parts/gear rows (25 published, 65 planned remaining)","replace":"and 90 cluster-9 parts/gear rows (90 published, cluster 9 complete)"},
{"file":"README.md","find":"-> parts-gear Part 2 -> then model/travel clusters.","replace":"-> parts-gear Part 3 (batch 9, 15 intents, COMPLETE 2026-09-23, cluster 9 done) -> then model/travel clusters."},
{"file":"README.md","find":"docs/matrix/batch-7-status.md is the authoritative record for the maintenance Part 4 batch (cluster 8 complete).","replace":"docs/matrix/batch-7-status.md is the authoritative record for the maintenance Part 4 batch (cluster 8 complete). docs/matrix/batch-8-status.md and docs/matrix/batch-9-status.md are the authoritative records for the parts/gear Part 2 and Part 3 batches (cluster 9 complete)."},
{"file":"README.md","find":"- _queue/: empty (no drafts pending).","replace":"- Batch 9 (parts/gear Part 3): COMPLETE — 15 cluster-9 articles published 2026-09-23 in two part-commits (43358bd, 56c2896); MM-0377–MM-0391: 9.1 helmets 3, 9.2 riding-gear 2, 9.3 accessories-luggage 2, 9.4 security 1, 9.5 parts-accessories 7. Cluster 9 is COMPLETE: 90 of 90 intents published. Same content rules as Batch 8 (no invented prices, availability, promotions, torque values, capacities or legal claims; OWNER-FACTS only for business claims). All 15 articles cross-linked into the internal-link graph. See docs/matrix/batch-9-status.md.\n- _queue/: empty (no drafts pending)."},
{"file":"docs/MASTER-MATRIX.md","find":"Cluster 9 (parts, accessories & riding gear): 75 of 90 published (25 in Batch 6, 50 in Batch 8 — see docs/matrix/batch-8-status.md); 15 remaining (Part 3 next).","replace":"Cluster 9 (parts, accessories & riding gear) is COMPLETE: 90 of 90 intents published (25 in Batch 6, 50 in Batch 8, 15 in Batch 9 — see docs/matrix/batch-9-status.md)."},
{"file":"docs/MASTER-MATRIX.md","find":"docs/matrix/batch-8-status.md is the authoritative record for the parts/gear Part 2 batch (2026-09-23, MM-0327–MM-0376).","replace":"docs/matrix/batch-8-status.md is the authoritative record for the parts/gear Part 2 batch (2026-09-23, MM-0327–MM-0376). docs/matrix/batch-9-status.md is the authoritative record for the parts/gear Part 3 batch (2026-09-23, MM-0377–MM-0391; cluster 9 complete)."},
{"file":"docs/MASTER-MATRIX.md","find":"The CSV currently holds 442 committed rows:","replace":"The CSV currently holds 457 committed rows:"},
{"file":"docs/MASTER-MATRIX.md","find":"and 75 cluster-9 parts/gear rows (75 published, 15 planned remaining)","replace":"and 90 cluster-9 parts/gear rows (90 published; cluster 9 complete)"},
{"file":"docs/MASTER-MATRIX.md","find":"cluster 9 part 3 (15 remaining) — NEXT","replace":"cluster 9 part 3 (15 remaining) — COMPLETE (Batch 9, 2026-09-23); clusters 3–4 (spec population from manufacturer pages into MODEL-DATABASE first) — NEXT"}
]};
function flex(content, find, replace) {
  if (content.includes(find)) {
    const i = content.indexOf(find);
    const second = content.indexOf(find, i + 1);
    if (second !== -1) throw new Error("ambiguous match: " + find.slice(0, 60));
    return content.slice(0, i) + replace + content.slice(i + find.length);
  }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(find.trim().split(/\s+/).map(esc).join("\\s+"));
  const m = content.match(re);
  if (!m) throw new Error("not found: " + find.slice(0, 60));
  const m2 = content.match(new RegExp(re.source, "g")) || [];
  if (m2.length !== 1) throw new Error("ambiguous flexible match (" + m2.length + "): " + find.slice(0, 60));
  return content.replace(re, () => replace);
}
const byFile = {};
for (const r of payload.replacements) { (byFile[r.file] = byFile[r.file] || []).push(r); }
for (const [file, rs] of Object.entries(byFile)) {
  let c = fs.readFileSync(file, "utf8");
  for (const r of rs) { c = flex(c, r.find, r.replace); console.log("applied:", file, "::", r.find.slice(0, 50)); }
  fs.writeFileSync(file, c);
}
// Append the batch-9 rows to the master matrix CSV.
const csvPath = "docs/matrix/master-matrix.csv";
let csv = fs.readFileSync(csvPath, "utf8");
let rows = fs.readFileSync("docs/matrix/batch-9-rows.csv", "utf8").replace(/\r?\n/g, "\r\n").trim();
csv = csv.replace(/\r?\n$/, "");
csv = csv + "\r\n" + rows + "\r\n";
fs.writeFileSync(csvPath, csv);
console.log("master-matrix.csv rows now:", csv.split(/\r?\n/).filter(Boolean).length);
// Clean up the temporary applier files.
fs.unlinkSync("docs/matrix/batch-9-rows.csv");
fs.unlinkSync("scripts/tmp-apply-batch9.js");
fs.unlinkSync(".github/workflows/apply-batch9-docs.yml");
console.log("batch-9 docs sync applied.");
