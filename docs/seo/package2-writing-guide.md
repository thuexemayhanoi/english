# SEO Package 2 — writing and verification guide

Standard for expanding an existing article (300-500 words at baseline) to at least 1,600 words of real content. Owner-approved scope extension of 2026-10-25; the rules in `AGENTS.md` ("SEO Package 2") and `docs/OWNER-FACTS.md` always win over this guide. The 1,600-word figure is an editorial requirement of the site owner, not a ranking threshold published by Google: depth means answering the whole search intent, never repeating text to reach a count.

## 1. What a writer may and may not touch

- Edit only the one assigned file `_articles/<slug>.md`. Do not commit, push, stash, switch branches or edit any other file. To abandon an article, restore it with `git checkout -- _articles/<slug>.md`.
- Never change: `slug`, `category`, `content_type`, `search_intent`, `topic_cluster`, `subcluster`, `date_published`, `review_status`, the URL, the permalink or the canonical. Do not delete existing sources or existing body content: extend around it, reorder lightly if the flow needs it, and correct a statement only when it is wrong (say so in the summary).
- `title` and `description` stay as they are unless the primary keyword is missing from the title or the description is over 165 characters or misleading; any change needs a reason in the summary. Do not touch `last_reviewed`: it is stamped after the independent review passes.
- Allowed front matter additions: `sources:` entries (existing format, see section 6) and slugs in `internal_link_targets` (existing slugs only, at most 4 new ones in total, separated by ", " because the layout splits on it). Each target becomes a related-guide card, so keep the list curated (the site median is 5 cards); body links do not need a matching target.
- No H1 (`#`) in the body: the layout renders the title as the only H1. Use `##` and `###`.
- Do not add `faq:` front matter. If the article already has `faq:` front matter, the layout renders it as "Common questions": do not repeat those questions in the body.

## 2. Facts: what each kind of claim needs

| Kind of claim | Allowed source | Rule |
|---|---|---|
| Business (prices, deposit, hours, address, phone, policies, delivery, insurance, payments, availability) | `docs/OWNER-FACTS.md` only | Publish approved figures exactly; never extrapolate or derive a price for another model; models: "Contact us to confirm current availability"; 50cc and electric rates: contact only; delivery "may be available depending on location and arrangement". **Prices: the owner's reference table differs from OWNER-FACTS for some weekly and monthly cells and for the 50cc and E-Bike day rates (`docs/seo/price-reconciliation.md`, owner decision pending): add no weekly, monthly, 50cc or E-Bike price in new text; the daily rates of the five listed models and the 2,000,000-5,000,000 VND deposit range are consistent and may be used; point to the price guide for the rest** |
| Legal (licences, fines, helmets, traffic rules, IDP) | Primary sources (chinhphu.vn, gov.vn, official gazette) read in this session, or the facts already stated in a VERIFIED legal article of this site | Cite article numbers; keep legal fact and practical advice in separate sentences; link the VERIFIED guide; if the primary source cannot be read, do not write the claim |
| Model specifications | `docs/MODEL-DATABASE.md` verified rows or the manufacturer's official page read in this session | Never invent torque, power, weight, tank size, oil capacity, tyre pressure, electrical values or service intervals; an unverified field stays out |
| Places, routes, opening rules, distances, events | Official or reputable page found in this session | Cite it; leave out volatile details (ticket prices, hours, closure dates) unless the source is current and dated |
| Practical riding or ownership advice | General expertise | Write it as guidance ("a mechanic will usually...", "a common mistake is..."), with no invented numbers and no invented experience |

Hard prohibitions (any of these fails verification): invented first-hand experience ("we tested", "in our experience", "last week a renter..."), customers, testimonials, reviews, ratings, statistics or percentages without a source, "years of experience", fleet size, promotions, discounts, free services, guaranteed availability, delivery time or rescue, 24/7 support, "insurance included", a universal "no deposit", keeping a customer's passport, fixed delivery fees, card or e-wallet payments, rankings, awards, competitor brand names. A hypothetical scenario is allowed only when it is clearly labelled as illustrative ("Imagine a renter who...") and contains no invented statistic.

If a fact cannot be verified, do not write it. If the article cannot reach 1,600 words without unverifiable material, restore the original file and report `REVIEW_REQUIRED` with the specific reason; do not pad.

## 3. What makes the added words worth reading

Start from the brief (`node scripts/seo-package2.js --brief <slug>`): primary and secondary keywords, intent, the recorded searcher questions this URL is meant to serve, rank and AI-citation flags, and valid link candidates. Read the article, `docs/OWNER-FACTS.md` and two to four neighbours before writing. Then fill the gaps a searcher still has after the current text. Depth comes from, in this order of value:

1. A decision aid: criteria, a comparison table, a "if you are X choose Y" matrix, a step-by-step process with what to check at each step.
2. Verified specifics: exact approved figures, article numbers, manufacturer figures from the model database, place facts with a source.
3. Realistic situations and common mistakes, each with the reason it matters and what to do instead.
4. Local context for Hanoi riders and renters (geography, traffic patterns, seasons, parking) only where it is sourced or plainly general knowledge.
5. A short FAQ (4-6 questions) of real searcher questions, answered directly in 2-4 sentences from verified content, placed near the end.

Not accepted: restating the same advice in new words, generic introductions or conclusions, lists of obvious statements, the same skeleton in every article, filler transitions, keyword repetition. Choose the section pattern that fits the intent instead of a template:

- Commercial or rental decision: short answer, who it suits, comparison table, how to decide, what to check at handover, published costs (exact), mistakes, FAQ.
- How-to or technical: short answer, how it works, symptoms or steps, what is normal and what is not, when to stop and see a mechanic, mistakes, FAQ.
- Place or route: short answer, orientation, route options, timing and seasons, parking and safety, what to bring, how to combine with other guides, FAQ.
- Legal: short answer, the rule with article numbers, who it applies to, practical consequences, common misunderstandings, what to do, FAQ.
- Model comparison: verdict, verified spec table, how the specs translate into use, who should choose which, availability wording, FAQ.

Vary headings and openings. Do not use "Introduction", "Conclusion" or "Final thoughts" headings.

## 4. Shape and style

- Length: at least 1,600 words by `node scripts/seo-package2.js --words <slug>`; normally 1,700-2,400. At least 5 `##` sections, with `###` where a section has distinct sub-points.
- Lead: keep the existing answer-first opening (about 20-80 words) and keep it accurate; the page may already rank for it.
- Mobile: paragraphs of 2-4 sentences, tables of at most 4 columns, lists for steps and checklists.
- British English as the site writes it (licence, tyre, kerb); no emojis, no exclamation marks, no hype; amounts as `150,000 VND`; Hanoi place names without diacritics as elsewhere on the site.
- The primary keyword appears naturally in the lead and at most a few more times; use plain synonyms instead of repeating it.

## 5. Internal links (Pillar-Hub-Silo)

- 6-14 contextual links in the body, house style `[descriptive anchor]({{ '/articles/<slug>/' | relative_url }})`, hub style `{{ '/topics/<cluster>/' | relative_url }}`. Choose targets from the brief's link candidates; every slug must exist; no self links; no more than three links to one target.
- Prefer the same silo and the money pages (price, requirements, deposit, how to rent) where the reader would need them; add cross-silo links to the VERIFIED legal guides for licence questions instead of re-explaining the law.
- Anchors describe the destination ("the rental deposit guide"), never "click here"; do not repeat one exact-match anchor. Keep the existing links.

## 6. Sources

- Add a `sources:` entry only for a page read in this session, in the existing format: `"https://host/path — Title or description — what it supports (retrieved 2026-10-25)"`. Keep every existing entry unchanged. `docs/OWNER-FACTS.md` may be listed in the non-URL form already used by the site.
- Prefer official sources; do not cite blogs, forums or retailers for legal or technical facts.

Research tools: `WebSearch` (standard mode) finds sources but its summaries are not a source by themselves. The sandbox cannot fetch web pages directly. To read one page for one fact, use `mcp__Firecrawl__firecrawl_scrape` with `formats: ["query"]` and a narrow `queryOptions.prompt` (5 credits each; at most 3 per article, only for a legal or technical claim that needs a primary source). Do not use other paid connectors.

## 7. Verification checklist (independent verifier)

The verifier did not write the article and tries to refute it. For the assigned slug:

1. Run `node scripts/seo-package2.js --lint <slug>`: every ERROR is a blocker; judge every CONFIRM item in context.
2. Read the whole article against `docs/OWNER-FACTS.md`: every price, deposit, hours, address, phone, policy, delivery, insurance, payment and availability statement, and every forbidden claim in section 2.
3. List every external factual claim (law, specification, place fact, number). Each must be supported by a cited source read in this session or by a VERIFIED article of this site; re-read the key sources (Firecrawl query-scrape, at most 4 reads) for numbers and legal statements. Unsupported or contradicted claims are findings.
4. Check for invented experience, customers, reviews, results or statistics; padding (repeated points, generic filler); a copy-paste skeleton; keyword stuffing.
5. Check links: every link exists and is relevant, anchors are descriptive, the silo structure is respected, no competitor.
6. Check against the original (`git show 7fcfc73:_articles/<slug>.md`): front matter integrity, nothing deleted without a reason, the lead still answers the query, title and description changes justified.
7. Compare with the two most similar sibling articles for overlap: the intents must stay distinct.

Verdicts: `PASS`; `FIX_REQUIRED` with each finding (severity BLOCKER, MAJOR or MINOR, the quoted text, the reason and the fix); `REVIEW_REQUIRED` when a needed fact cannot be verified. A BLOCKER or MAJOR finding means FIX_REQUIRED.

## 8. Lessons from batch 1 (first drafts failed verification in 4 of 5 articles)

The failures were avoidable. Before returning a draft, check yours against this list:

- **Invented specifics.** Bridge lengths, hectares, distances, minutes, "the single best ride", "most riders", "usually a single bike": every number and superlative needs a source read this session (or a verified database figure); otherwise leave it out. The lint lists every new numeric claim for confirmation.
- **Implied policies.** Do not describe how the shop works beyond OWNER-FACTS: no delivery person, no forecourt, no return on the deposit, no after-hours return, no test ride, no "agree the cost before the bike moves" unless the sentence says it is something to ask. Write what a renter should ask or check, not what the shop does.
- **Prices.** Daily rates of the six models and the deposit range only (section 2). Do not mention that another model has no weekly rate; do not name an E-Bike or 50cc price.
- **Internal wording in reader text.** Never write "owner-approved", "OWNER-FACTS", "this fix", "per the guide", file names or process remarks; say "published" for rates. The lint rejects this.
- **Repetition.** Say each point once (the availability line, the 09:00-21:00 window, "pickup is simplest", the insurance sentence). A section that restates another in new words fails.
- **Order and basis must agree.** A list headed "ranked" or "best first" needs a stated criterion that produces that order; otherwise call it "compared" and say it is ordered by rider type.
- **Quote sources exactly** ("can be a hectic place", not "is"); describe a source's whole statement, not the convenient half.
- **Scope.** Keep to the intent of the URL; link to the sibling that owns another intent instead of re-explaining it. Do not exceed about 2,400 words.
- **Tell the owner what you found.** If you notice that another article contradicts a source (for example advice that conflicts with a Zone 1 rule, or an insurance statement that conflicts with OWNER-FACTS), list it in the summary; do not edit that file.

