# Google Search Central baseline for SEO Package 3

- Date: 2026-10-25. Target: thuexemayhanoi/english (https://en.rentbikehanoi.com/). Research only.
- Calls used: 10 tool calls (27 page fetches plus 2 web searches = 29 URL-level operations, under the cap of 30). The searches only located URLs; their summaries are not cited.
- Failed reads: none. Notes: (a) `.../structured-data/faqpage` redirected to https://developers.google.com/search/updates because the FAQ documentation no longer exists; (b) the fetched text of the spam-policies and Business Profile pages shows no "Last updated" line, and the spam-policies text ends at "Scam and fraud".
- Method: text as returned by the fetch tool on 2026-10-25. Bullets paraphrase the page. "Implication" lines are the researcher's reading, not Google statements. `GSC` = https://developers.google.com/search/docs.

## 1. Helpful, reliable, people-first content
- URL: GSC/fundamentals/creating-helpful-content. Last updated: 2026-10-05.
- Ranking systems aim to prioritize helpful, reliable content made for people, not content made to manipulate rankings. The page gives self-assessment questions on originality, completeness, value versus other results, and sloppy or mass-produced pages.
- Who: make clear who created the content, with bylines where readers expect them. Google strongly encourages accurate authorship information and calls fabricated creator profiles deception.
- How: explain how content was produced, including automation or AI use where readers would expect disclosure.
- Why: content should exist primarily to help people. Using automation mainly to manipulate rankings violates the spam policies.
- E-E-A-T is not itself a specific ranking factor. Systems use a mix of factors that can identify it, trust matters most, and YMYL topics get extra weight. Changing page dates to look fresh without substantial change is a listed warning sign. Quote: "Are you writing to a particular word count because you've heard or read that Google has a preferred word count? (No, we don't.)"
- Implication for this site:
  - The 1,600-word Package 2 target is an owner editorial rule, not a Google requirement.
  - Leaving `last_reviewed` unchanged without a real review matches the date warning.
  - Author, About and sourcing signals must be truthful, never invented.

## 2. Spam policies
- URL: GSC/essentials/spam-policies. Last updated: not shown.
- Spam includes attempts to manipulate ranking or generative AI responses. Violations can lower rankings or remove pages, via automated systems or manual action.
- Scaled content abuse: many pages made mainly to manipulate rankings, however created (examples: AI pages without added value, stitched or scraped content). Such content should be excluded from Search.
- Doorway abuse: pages made to rank for similar queries that funnel to less useful pages. Examples: city or region pages funnelling to one page, and substantially similar pages closer to search results than a browseable hierarchy.
- Keyword stuffing examples: blocks of text listing cities and regions a page tries to rank for, phone-number lists without added value, unnatural repetition.
- Site reputation policy concerns third-party content hosted to exploit the host's ranking signals.
- Implication for this site:
  - "No new articles for gaps" and distinct cluster intents fit the scaled-content and doorway wording.
  - Avoid district or city list blocks written for rankings.
  - Site reputation matters only if guest content is ever added.

## 3. Title links
- URL: GSC/appearance/title-link. Last updated: 2025-12-10.
- Every page needs a descriptive, concise `<title>`. Quote: "there's no limit on how long a `<title>` element can be". The title link is truncated as needed, typically to fit the device width.
- Avoid keyword stuffing and repeated or boilerplate titles. Add the brand briefly at the start or end with a delimiter.
- Google builds title links automatically from the title element, main visual title, headings such as h1, `og:title`, prominent text, anchor text, links pointing to the page, and WebSite structured data. It may replace inaccurate, obsolete, half-empty or wrong-language titles.
- Make the main title clear, for example the first visible h1.
- Implication for this site:
  - No fixed length rule exists. The repo's 65-character brand-suffix rule is a local presentation choice.
  - Keep title, h1 and WebSite data consistent, because Google may rewrite from them.

## 4. Snippets and meta descriptions
- URL: GSC/appearance/snippet. Last updated: 2026-04-20.
- Snippets come mainly from page content. Google sometimes uses the meta description when it describes the page better, and different queries can show different snippets.
- No limit on meta description length; it is truncated as needed, typically to device width.
- Write unique, page-specific descriptions and prioritize key URLs. Programmatic descriptions are acceptable if human-readable and diverse. Keyword lists are less likely to be shown.
- Controls: `nosnippet`, `max-snippet`, `data-nosnippet`. "Read more" deep links need content that is immediately visible, not hidden in tabs.
- Implication for this site:
  - No meta length rule. Keep descriptions unique and consistent with verified facts; do not expect them to be displayed.

## 5. Structured data
**5a General.** GSC/appearance/structured-data/sd-policies. Last updated: 2026-07-10.
- Rich result eligibility requires the content and spam policies plus the general guidelines. JSON-LD is recommended. Do not block marked-up pages with robots.txt or noindex.
- Do not mark up content that readers cannot see, or misleading content such as fake reviews. A structured data manual action removes rich result eligibility and does not affect web ranking. Missing required properties means no eligibility.

**5b FAQPage.** GSC/appearance/structured-data/faqpage now redirects to https://developers.google.com/search/updates.
- Changelog 2026-05-08: deprecation notice; the feature no longer appears in Search starting 2026-05-07. Changelog 2026-06-15: documentation removed because the FAQ rich result "is no longer shown".
- Older Google post (2023-08-08, https://developers.google.com/search/blog/2023/08/howto-faq-changes): FAQ rich results were then limited to authoritative government and health sites; no need to proactively remove the markup; unused structured data causes no problems but has no visible effect.
- The 2026 entries do not say whether to keep or remove FAQPage markup.

**5c LocalBusiness.** GSC/appearance/structured-data/local-business. Last updated: 2026-09-08.
- Required: `name`, `address`. Recommended: `geo`, `openingHoursSpecification`, `priceRange`, `telephone` (with country and area code), `url`. Use the most specific subtype. May go on any page, though a business-information page suits it.

**5d Article.** GSC/appearance/structured-data/article. Last updated: 2026-09-08.
- No required properties. Recommended: `author` (name and url), `datePublished`, `dateModified`, concise `headline`, `image`. Purpose: better understanding and title text, images and dates in results.

**5e BreadcrumbList.** GSC/appearance/structured-data/breadcrumb. Last updated: 2026-09-08.
- At least two `ListItem`s. Breadcrumbs should reflect a typical user path, not mirror the URL. Available on desktop in all regions and languages.

**5f Organization.** GSC/appearance/structured-data/organization. Last updated: 2026-09-08.
- No required properties. Recommended on the home page or one about page, not every page. For a local business, also follow the LocalBusiness fields. `name` should match the site name.

- Implication for this site:
  - Keep FAQPage markup only where the Q&A is visible on the page (check `faq_in_body: true` pages). Do not expect FAQ rich results.
  - LocalBusiness and Organization values must match OWNER-FACTS; neither is required on every page.
  - Article markup is advisory.

## 6. AI features and your website
- URLs: GSC/appearance/ai-features (2025-12-10); GSC/fundamentals/ai-optimization-guide (2026-07-10); GSC/crawling-indexing/control-what-you-share (2026-10-21).
- A page must be indexed and eligible to show in Search with a snippet to be a supporting link in AI Overviews or AI Mode. The older page says there are no additional technical requirements. The newer guide adds that the site must be included in "Search generative AI features" in Search Console. The control page describes a site-wide "Search generative AI control". No default state is stated.
- Specific optimization is not required. The usual fundamentals apply: crawlable pages, internal links, page experience, text content, images, structured data matching visible text, up-to-date Business Profile.
- Preview controls: `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`. Google-Extended covers training and grounding in some other Google systems.
- Separate content for every query or fan-out variation, made mainly to manipulate rankings or AI responses, violates scaled content abuse.
- Measurement: Generative AI performance report in Search Console. Quote: "Structured data isn't required for generative AI search, and there's no special schema.org markup you need to add."
- Implication for this site:
  - No special markup or AI files are needed, and no pages for fan-out queries.
  - Owner-only task: confirm the Search Console generative AI control for the property.

## 7. Link best practices and internal linking
- URL: GSC/crawling-indexing/links-crawlable. Last updated: 2025-12-10.
- Google generally crawls only `<a>` elements with an `href`. Script-event links and non-anchor elements are not reliably parsed.
- Anchor text should be descriptive, reasonably concise and relevant to both pages. Avoid "click here". Write naturally and do not cram keywords into anchors. Quote: "keyword stuffing is a violation of our spam policies".
- Image links use `alt` as anchor text.
- Every page you care about should be linked from at least one other page, with in-context links to helpful resources. Linking out to sources is fine; use `nofollow`, `sponsored` or `ugc` where they fit.
- Implication for this site:
  - Contextual, descriptive anchors are recommended; exact-match anchors are not required.
  - Use real `<a href>` links and avoid orphan pages.

## 8. Canonicalization and duplicate content
- URL: GSC/crawling-indexing/consolidate-duplicate-urls. Last updated: 2026-07-10.
- Signals by strength: redirects (strong), `rel="canonical"` (strong), sitemap inclusion (weak). They can be combined, none is required, and Google picks a canonical itself if none is given.
- Best practice: self-referential canonical, absolute URLs, sitemap and canonical consistent, internal links to the canonical URL, no robots.txt or noindex for canonicalization. A canonical link is only accepted in `<head>`. Google prefers HTTPS.
- Implication for this site:
  - Self-referential absolute canonicals matching the sitemap are the documented approach; keep slugs and canonicals stable.

## 9. Sitemaps, robots.txt and llms.txt
- URLs: GSC/crawling-indexing/sitemaps/overview (2025-12-10); GSC/crawling-indexing/robots/intro (2025-12-10).
- A sitemap lists the pages you consider important. Google can usually find most pages if they are properly linked. Sitemaps help large, new or rich-media sites; a well-linked site of about 500 pages or fewer may not need one.
- robots.txt mainly manages crawler traffic and is not a mechanism for keeping a page out of Google. A blocked URL can still be indexed without a description; use `noindex` or a password.
- llms.txt, exact statements. The AI optimization guide (2026-07-10) says you do not need machine-readable files, AI text files, markup or Markdown to appear in Google Search, because Google Search itself does not use them; Google may crawl and index many file types without special treatment. Its recap says to ignore "creating unnecessary AI text files (like llms.txt)". The changelog (2026-06-15) says such files are not needed for Search, will not affect visibility or rankings positively or negatively, and may be kept for other services. Nothing further is stated.
- Implication for this site:
  - The Package 2 baseline alone lists 693 articles, above the roughly 500-page guide, so keep the sitemap.
  - llms.txt is neutral for Google; keep it only as hygiene for other systems.

## 10. Page experience and Core Web Vitals
- URLs: GSC/appearance/page-experience (2026-09-22); GSC/appearance/core-web-vitals (2025-12-10).
- Metrics: LCP within 2.5 seconds, INP under 200 milliseconds, CLS under 0.1. The page lists INP and does not list FID.
- Core Web Vitals are used by ranking systems, but there is no single page-experience signal. Other aspects do not directly raise rankings.
- Good scores do not guarantee top rankings, and chasing perfect scores only for SEO may not be the best use of time. Quote: "There is no single signal."
- Implication for this site:
  - Lighthouse and CWV work is user-experience hygiene. Do not promise ranking gains from it.

## 11. Images and mobile-first indexing
- URLs: GSC/appearance/google-images (2026-03-02); GSC/crawling-indexing/mobile/mobile-sites-mobile-first-indexing (2025-12-10).
- Use `<img>` with `src`; supported formats include JPEG, PNG, WebP, SVG and AVIF. Keep a `src` fallback with `srcset` or `picture`. Quote: "Google doesn't index CSS images."
- Alt text is the most important image metadata: useful, in context, keywords used appropriately. Stuffed alt text may be seen as spam. Short descriptive filenames give light clues.
- Google uses the mobile version for indexing and ranking. Responsive design is recommended, and then content and metadata match. Do not lazy-load primary content upon user interaction.
- Implication for this site:
  - Descriptive, factual alt text and real `<img>` tags.
  - Responsive layout satisfies mobile-first; check lazy loading does not hide content from Googlebot.

## 12. Localized versions and hreflang
- URL: GSC/specialty/international/localized-versions. Last updated: 2026-09-21.
- The page applies "if you have multiple versions of a page for different languages or regions" (examples: translated template, regional variations, full translations).
- Each version lists itself and all others, with return links and fully-qualified URLs; `x-default` is suggested as a fallback. Google does not use hreflang or the `lang` attribute to detect language.
- A single-language site with no alternates is not explicitly addressed (NOT ADDRESSED). That no tags are needed is an inference from the conditional wording.
- Implication for this site:
  - No hreflang, language switcher or /vi/ pages are needed, matching the English-only rule.

## 13. Local ranking (Business Profile help)
- URL: https://support.google.com/business/answer/7091. Last updated: not shown.
- Local results are mainly based on relevance, distance and popularity (heading: "Prominence"). Prominence is how well known a business is, based on information such as links from other websites and review count and ratings.
- Verify the business, keep address, hours, category and attributes complete, reply to reviews, add photos. There is no way to request or pay for a better local ranking.
- Implication for this site:
  - Profile, review and outreach work is owner-only. Site NAP must match the profile and OWNER-FACTS.

## Extra pages read
- Do you need an SEO? (GSC/fundamentals/do-i-need-seo, 2026-06-05): check third-party tool recommendations against official Google guidance, ask whether "AEO"/"GEO" advice matches Google's generative AI guidance; no one can guarantee a #1 ranking.
- Generative AI content (GSC/fundamentals/using-gen-ai-content, 2026-10-01): many pages without added value may breach scaled content abuse; fact-check AI output including titles, descriptions, structured data and alt text.
- URL structure (GSC/crawling-indexing/url-structure, 2026-10-21): descriptive words, hyphens not underscores; URLs are case sensitive.
- Changelog (https://developers.google.com/search/updates): no last-updated line; entries run to 2026-10-23; the only source for the FAQ and llms.txt notes above.

## Common SEO-tool claims vs Google's stated position

| Claim | Google's stated position | Source URL | Confidence |
|---|---|---|---|
| Titles must stay under a fixed length | No limit on `<title>` length; truncated to device width; keep concise | GSC/appearance/title-link | STATED |
| Meta descriptions must be about 155 characters | No limit; truncated to device width; page text may be used instead | GSC/appearance/snippet | STATED |
| Hit a word-count target | No preferred word count; no ideal page length | GSC/fundamentals/creating-helpful-content; GSC/fundamentals/ai-optimization-guide | STATED |
| Keep keyword density at X% | No density figure on pages read; unnatural repetition is keyword stuffing | GSC/essentials/spam-policies | NOT ADDRESSED (density) |
| E-E-A-T is a ranking factor | Not itself a specific ranking factor; a mix of factors; trust matters most | GSC/fundamentals/creating-helpful-content | STATED |
| FAQ schema earns FAQ rich results | Feature no longer shown since 2026-05-07; documentation removed 2026-06-15 | https://developers.google.com/search/updates | STATED |
| Unused FAQ markup must be deleted | 2023 post: no need to remove; no problems caused; not restated in 2026 | https://developers.google.com/search/blog/2023/08/howto-faq-changes | STATED (2023 only) |
| llms.txt helps Google or AI Overviews | Google Search does not use it; no positive or negative effect on visibility or rankings; fine for other services | GSC/fundamentals/ai-optimization-guide; https://developers.google.com/search/updates | STATED |
| AI Overviews need special markup | No special schema.org markup; structured data not required for generative AI search | GSC/fundamentals/ai-optimization-guide | STATED |
| Write a page per query or fan-out variation | Doing so mainly to manipulate rankings violates scaled content abuse | GSC/fundamentals/ai-optimization-guide; GSC/essentials/spam-policies | STATED |
| Exact-match anchors for internal links | Anchors should be descriptive, concise, natural; do not cram keywords; exact-match not named | GSC/crawling-indexing/links-crawlable | NOT ADDRESSED (exact-match by name) |
| Core Web Vitals are a heavy ranking weight | Used by ranking systems; no single page-experience signal; no weight given | GSC/appearance/page-experience | STATED (weight NOT ADDRESSED) |
| Author bylines boost rankings | Bylines strongly encouraged where expected; fake profiles are deception; Article `author` recommended; ranking effect not stated | GSC/fundamentals/creating-helpful-content; GSC/appearance/structured-data/article | NOT ADDRESSED (ranking effect) |
| Update dates to look fresh | Listed as a warning sign without substantial change | GSC/fundamentals/creating-helpful-content | STATED |
| Structured data raises rankings | Pages read describe understanding and rich result eligibility; no boost stated | GSC/appearance/structured-data/sd-policies | NOT ADDRESSED |
| Single-language sites need hreflang | Page is conditional on multiple versions; single-version sites not discussed | GSC/specialty/international/localized-versions | NOT ADDRESSED |
