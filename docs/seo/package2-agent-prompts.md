# SEO Package 2 — agent procedures

How a batch is run with individual subagents (writer, independent verifier, fixer, delta verifier). The binding standard is `docs/seo/package2-writing-guide.md`; this file only fixes the procedure so a batch can be repeated by any session. Parameters the lead passes: `SLUG`, `GROUP`, `QUEUE`, `WORDS` (original), `DATE`, `NOTES` (angle and constraints of this article), `SIBLINGS` (the other articles of the same batch and their angles), `FINDINGS`, `PREV` (commit to diff against).

## Common rules for every agent

- Repository `/home/user/english` (Jekyll site, English-only motorbike guide for Hanoi; business Hanoi Motorbike Rental Nguyen Tu). Load research tools with ToolSearch (`select:WebSearch,mcp__Firecrawl__firecrawl_scrape`); the sandbox cannot fetch web pages directly. Firecrawl: `formats: ["query"]` with a narrow `queryOptions.prompt`, 5 credits per read.
- Do not commit, push, stash or switch branches. Edit no file except the one assigned article.
- Be economical: issue independent reads in one message, write the article with one Write call (at most three Edit calls for later corrections), at most 6 web calls, and keep the final reply short.

## WRITER

Expand `_articles/SLUG.md` (URL `/articles/SLUG/`, group GROUP, queue QUEUE) from about WORDS words to at least 1,600 words (normally 1,700-2,300) of real, verified content under the owner-approved SEO Package 2.

1. In one message read: `docs/seo/package2-writing-guide.md` (binding; section 8 lists the failures of batch 1), `docs/OWNER-FACTS.md`, `docs/seo/price-reconciliation.md`, the article, and the output of `node scripts/seo-package2.js --brief SLUG`. Then read 2-4 neighbours from the brief and the SIBLINGS you must not duplicate (they are expanded in the same batch: link to them, do not repeat them).
2. Research only the gaps a searcher still has after the current text. Place facts, laws, specifications and numbers need a source read in this session; practical advice may be general guidance without numbers.
3. Write the article. Keep the existing content (extend around it), answer first in the lead, fit the structure to the intent, 6-14 contextual internal links from the brief, sources entries only for pages you read (percent-encode parentheses in URLs), no weekly, monthly, 50cc or E-Bike price.
4. Run `node scripts/seo-package2.js --lint SLUG`: zero ERROR, resolve every CONFIRM item (source it or remove it), explain remaining WARN items.
5. Reply in at most 200 words: final word count, sections added, sources added, anything removed or unverifiable, and any OTHER article you noticed that contradicts a source (do not edit it). If the article cannot reach 1,600 words with verified material, restore the original (`git checkout -- _articles/SLUG.md`) and reply `REVIEW_REQUIRED` with the specific reason.

## VERIFIER (independent: it did not write the article; it tries to refute it)

Read `docs/seo/package2-writing-guide.md` (sections 2, 5, 7, 8), `docs/OWNER-FACTS.md`, `docs/seo/price-reconciliation.md` and the whole article; run `node scripts/seo-package2.js --lint SLUG` and `--brief SLUG`; compare with the original via `git show 7fcfc73:_articles/SLUG.md`. Check: (1) every business statement against OWNER-FACTS and every prohibited claim (no weekly, monthly, 50cc or E-Bike price); (2) every external factual claim (law, specification, place fact, number, date) is supported by a cited source or a VERIFIED site guide and says what the article says: re-read the sources that carry weight with Firecrawl query-scrape (at most 4 reads); (3) invented experience, customers, reviews, statistics, implied shop policies; (4) padding, repetition, generic filler; (5) links exist and are descriptive; (6) front matter integrity versus the original and nothing correct deleted; (7) the lead still answers the query and the intent stays distinct from siblings. Do not edit any file.

Reply in plain text, at most 700 words: first line `VERDICT: PASS`, `VERDICT: FIX_REQUIRED` or `VERDICT: REVIEW_REQUIRED` (PASS only without a BLOCKER or MAJOR finding), then one line per finding `[BLOCKER|MAJOR|MINOR] "quoted text" - issue - concrete fix`, then the claims and sources checked in two lines.

## FIXER

Fix round for `_articles/SLUG.md`. An independent verifier refuted the current draft. Read `docs/seo/package2-writing-guide.md` section 8 and the article, then fix EVERY BLOCKER and MAJOR finding and the cheap MINOR ones, keeping everything that was correct; if a claim cannot be verified, remove or rewrite it rather than keep it. Findings: FINDINGS. Run `node scripts/seo-package2.js --lint SLUG` (zero ERROR) before replying. Reply in at most 120 words: what changed per finding.

## DELTA VERIFIER

Second independent verification of `_articles/SLUG.md` after a fix round. Read `docs/seo/package2-writing-guide.md` (sections 2 and 8), `docs/OWNER-FACTS.md` and the article; run `git diff PREV -- _articles/SLUG.md` to see exactly what changed since the previous verification, then check (a) that each earlier finding is fixed (FINDINGS), (b) every changed or added passage with the same checks as a full verification (source, OWNER-FACTS, no invented policy, no repetition), (c) a quick whole-article read for new contradictions. Re-read at most 3 sources with Firecrawl. Do not edit any file. Same reply format as the verifier.

## Lead checklist after the agents

Judge each verdict; apply fixes by FIXER or by hand; record `node scripts/seo-package2.js --record BATCH --slugs ... --date DATE --stamp --qa "..." --notes "..."` only for PASS articles (an unverifiable one is `--review SLUG --reason "..."` and the original is restored); then `node scripts/build-report.js`, `node scripts/english-seo-matrix.js`, `node scripts/topical-map.js`, `node scripts/seo-package2.js --write`, the full QA, the progress log, one pull request, merge on green CI, `--commit BATCH SHA` in the next batch.
