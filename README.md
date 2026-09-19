BUILD THE ENGLISH MOTORBIKE BLOG FOUNDATION NOW

TARGET REPOSITORY — ONLY:
thuexemayhanoi/english

LIVE TARGET:
https://thuexemayhanoi.github.io/english/

Do NOT modify:
thuexemayhanoi/blog
or any other repository.

==================================================
MISSION
==================================================

Build the production-ready foundation for an English-language
Hanoi Motorbike / Vietnam Motorbike Knowledge Hub.

This project will eventually contain approximately 1,000 high-quality English articles.

DO NOT write the 1,000 articles in this task.

This task is to:

1. build the complete blog/site foundation
2. build the information architecture
3. create the project documentation/data foundation
4. create README.md as the permanent PROJECT MAP for future agents
5. deploy and verify the site

==================================================
BUSINESS
==================================================

Business:
Hanoi Motorbike Rental Nguyen Tu

Address:
112 Nguyen Van Cu Street, Bo De, Long Bien, Hanoi, Vietnam

Phone:
+84 942 467 674

WhatsApp:
https://wa.me/84942467674

Zalo:
https://zalo.me/0942467674

Opening hours:
09:00–21:00 daily

Main business website:
https://thuexemaynguyentu.com/

For uncertain vehicle availability use:

“Contact us to confirm current availability.”

Never invent:
- discounts
- promotions
- free delivery
- fleet size
- customer numbers
- years of experience
- awards
- rankings
- guarantees
- insurance
- 24/7 support
- guaranteed rescue
- guaranteed delivery times

==================================================
STEP 1 — INSPECT FIRST
==================================================

Inspect the current MAIN branch before editing.

The repository may currently contain only README.md or a minimal structure.

Do not assume files exist.

Report the existing structure before making major architectural decisions.

==================================================
STEP 2 — CREATE JEKYLL FOUNDATION
==================================================

Build a GitHub Pages compatible Jekyll site.

Use:

url: https://thuexemayhanoi.github.io
baseurl: /english
lang: en

Create an appropriate structure such as:

_config.yml

index.html or index.md

404.html

robots.txt

README.md

OWNER-FACTS.md
SOURCE-MAP.md
CUSTOMER-INTENTS.md
MODEL-DATABASE.md
MASTER-MATRIX.md

_data/
  navigation.yml
  categories.yml
  site.yml

_includes/
  head.html
  header.html
  footer.html
  breadcrumbs.html
  bike-card.html
  article-card.html
  contact-cta.html
  schema.html

_layouts/
  default.html
  home.html
  page.html
  post.html
  category.html

assets/
  css/
    main.css
  js/
    main.js
    search.js
  icons/
    original SVG icon assets if needed

_posts/

_queue/

categories or appropriate content landing pages.

You may improve this structure if there is a clear technical reason.

Keep it simple enough for GitHub Pages.

==================================================
STEP 3 — SITE DESIGN
==================================================

Build an ORIGINAL design.

Do not clone competitors.

Design direction:

- modern
- clean
- mobile-first
- motorcycle-focused
- fast
- accessible
- useful for international visitors

Implement:

LIGHT
DARK
AUTO

theme modes.

Remember the visitor's theme selection locally where appropriate.

Do not use an external icon CDN.

Use a consistent SVG icon system.

No emoji as functional UI controls.

==================================================
STEP 4 — HOMEPAGE
==================================================

Create a useful English homepage.

The homepage should clearly communicate that the website is an English knowledge hub about:

- Hanoi motorbike rental
- scooters and motorcycles
- 50cc bikes
- electric motorcycles
- maintenance
- riding
- Vietnam laws/licences
- Hanoi travel
- motorcycle trips

Suggested homepage sections:

1. Hero
2. Main topic categories
3. Motorbike Rental Guides
4. Bike Reviews
5. 50cc & Electric
6. Maintenance & Repair
7. Riding Skills
8. Vietnam Motorbike Law
9. Hanoi Guides
10. Motorbike Trips
11. Latest Articles
12. Contact CTA
13. Large structured footer

Do not pretend empty article sections already contain hundreds of articles.

Handle empty states cleanly.

==================================================
STEP 5 — NAVIGATION
==================================================

Create clear English navigation.

Suggested top-level architecture:

Home

Rental
Reviews
50cc
Electric
Maintenance
Riding
Vietnam Law
Hanoi
Trips
About / Contact

Use logical URLs and avoid excessive nesting.

Mobile navigation must remain usable around 390px width.

A useful sticky mobile navigation may be implemented.

==================================================
STEP 6 — CATEGORY / HUB ARCHITECTURE
==================================================

Create hub/category architecture for these main clusters:

01 Hanoi Motorbike Rental

02 Monthly Rental / Expats / Teachers

03 Scooter Reviews

04 Motorcycle Reviews

05 Manual & Clutch Motorcycles

06 50cc Motorcycles

07 Electric Motorcycles & E-Bikes

08 Maintenance & Repair

09 Parts & Accessories

10 Riding Skills & Safety

11 Vietnam Motorbike Law & Licences

12 Hanoi Travel

13 Motorbike Trips From Hanoi

14 Vietnam Travel Related to Riding

Do not generate thin doorway pages merely to create URLs.

Each hub should have a clear future content purpose.

==================================================
STEP 7 — ARTICLE SYSTEM
==================================================

Create a scalable article layout.

Posts should support fields such as:

title
slug
description
author
category
tags
content_type
search_intent
topic_cluster
vehicle_type
manufacturer
model
model_year
last_reviewed
sources
internal_link_targets

Do not require irrelevant fields for every article.

Post layout should support:

- title
- description
- breadcrumbs
- updated/reviewed date where appropriate
- article body
- related articles
- source/reference section when relevant
- contact CTA where contextually useful

==================================================
STEP 8 — MOTORCYCLE CARDS
==================================================

Create reusable original motorcycle/model cards.

Possible fields:

- image
- manufacturer
- model
- category
- engine size / motor power
- transmission
- licence information
- fuel / battery
- range where applicable
- suitable use
- model year
- learn-more CTA

The component must not imply that every reviewed model is rented by Nguyen Tu.

Rental availability is separate from editorial vehicle information.

==================================================
STEP 9 — SEARCH
==================================================

Implement a lightweight static search solution that works on GitHub Pages without a private backend.

Prefer simple JavaScript/static-index architecture.

It must fail gracefully if no articles exist yet.

Do not introduce unnecessary third-party services.

==================================================
STEP 10 — FOOTER
==================================================

Build a large accordion-style footer suitable for mobile.

It may take general inspiration from modern ecommerce interfaces, including Apple-like information density, but:

DO NOT clone Apple.

Use original:
- styling
- spacing
- icons
- interactions
- labels

Footer groups may include:

Explore
Motorbike Rental
Bike Guides
Maintenance
Vietnam Law
Hanoi Travel
Motorbike Trips
About Nguyen Tu
Contact

Include verified contact information.

==================================================
STEP 11 — SEO FOUNDATION
==================================================

Create:

canonical URLs

meta title support

meta description support

Open Graph

Twitter metadata where useful

BreadcrumbList schema

WebSite schema

Organization / LocalBusiness schema only with verified facts

Article / BlogPosting schema where appropriate

sitemap.xml support

RSS/feed if useful

robots.txt

Do not invent LocalBusiness facts.

Use GitHub Pages supported plugins only.

Recommended where compatible:

jekyll-sitemap
jekyll-feed

robots.txt should allow normal crawling and reference:

https://thuexemayhanoi.github.io/english/sitemap.xml

==================================================
STEP 12 — BASEURL SAFETY
==================================================

The site is deployed under:

/english

Use relative_url and absolute_url correctly.

Never create:

/english/english/...

Never hardcode the baseurl repeatedly.

Check all:

CSS
JavaScript
icons
navigation
canonical
sitemap
internal links

under the /english deployment path.

==================================================
STEP 13 — README.md = PROJECT MAP
==================================================

README.md is NOT a decorative README.

It must become the permanent OPERATING MAP for the project.

Any future AI/coding agent should be able to read README.md first and understand the entire project.

README must contain:

# Project Identity

Repository
Live URL
Business
Purpose
Language

# Current Architecture

Explain every important folder and file.

Example:

_config.yml → global Jekyll config
_data/ → structured site data
_includes/ → reusable components
_layouts/ → templates
_posts/ → published articles
_queue/ → unpublished article production
assets/ → CSS/JS/icons
OWNER-FACTS.md → authoritative business rules
SOURCE-MAP.md → research source catalogue
CUSTOMER-INTENTS.md → customer/search intent database
MODEL-DATABASE.md → vehicle research database
MASTER-MATRIX.md → article production plan

# Agent Start Procedure

Every future agent must:

1. read README.md
2. read OWNER-FACTS.md
3. inspect current MAIN
4. read relevant project data
5. check MASTER-MATRIX before writing articles
6. preserve verified existing work
7. perform changes
8. validate
9. deploy
10. runtime check
11. update README/project state when architecture materially changes

# Business Safety Rules

Summarize all forbidden invented claims.

# Content Workflow

SOURCE MAP
→ CUSTOMER INTENTS
→ MODEL DATABASE
→ MASTER MATRIX
→ ARTICLE BATCH
→ QA
→ COMMIT
→ DEPLOY
→ VERIFY

# Publishing Workflow

_queue/
→ QA
→ approved
→ _posts/
→ build
→ runtime verification

# Git Strategy

Do not create one commit per article.

Preferred batch:
50–100 articles per meaningful content commit.

# SEO Architecture

Explain hub structure and internal linking philosophy.

# Current Status

Use checkboxes such as:

[x] Jekyll foundation
[x] responsive UI
[x] theme system
[x] sitemap
[x] robots
[x] schema
[x] hub architecture
[ ] MASTER MATRIX approved
[ ] article production started
[ ] 100 articles
[ ] 500 articles
[ ] 1000 articles

Only tick items actually completed.

# Next Recommended Actions

Clearly state what the next agent should do.

# Deployment Verification

Record the latest VERIFIED:

MAIN HEAD
Pages run ID
build result
deploy result
runtime checks

Never fabricate this section.

==================================================
STEP 14 — OWNER-FACTS.md
==================================================

Create OWNER-FACTS.md.

Structure:

APPROVED
UNVERIFIED
NEEDS OWNER CONFIRMATION
HISTORICAL / DO NOT USE

Populate it with verified project/business facts already supplied.

This file has higher authority for business claims than competitor websites.

==================================================
STEP 15 — SOURCE-MAP.md
==================================================

Create the source database/map.

Classify sources:

A = primary / authoritative
B = strong specialist
C = commercial reference
D = forum/community/inspiration

Include the reference websites already supplied in project context.

For every source record:

source
category
reliability
topics
appropriate use
limitations
copyright warning if relevant

Important rule:

FIRST-PARTY VERIFIED DATA
>
OFFICIAL / GOVERNMENT
>
MANUFACTURER
>
SPECIALIST PUBLICATION
>
COMMERCIAL WEBSITE
>
FORUM

Do not determine truth by majority vote.

==================================================
STEP 16 — CUSTOMER-INTENTS.md
==================================================

Populate initial customer/search-intent families using supplied owner history and available Search Console/SiteGuru evidence.

Clearly label provenance:

OWNER-HISTORY
GSC-DERIVED
RESEARCH-DERIVED
GENERATED-EXPANSION

Never claim a generated keyword was seen in GSC.

Use English intent families such as:

Hanoi motorbike rental
motorbike rental Hanoi
rent a motorbike in Hanoi
Hanoi Old Quarter motorbike rental
monthly motorbike rental Hanoi
scooter rental Hanoi
motorcycle rental Hanoi
motorbike rental for expats
motorbike rental for teachers

Expand naturally into informational and commercial intent families.

==================================================
STEP 17 — MODEL-DATABASE.md
==================================================

Create the model database structure.

Future records may contain:

manufacturer
model
year
vehicle_type
engine_cc
motor_power
transmission
battery
claimed_range
fuel_capacity
seat_height
weight
licence_notes
official_source
last_verified

DO NOT invent missing values.

Prefer manufacturer sources.

Unknown means UNKNOWN.

==================================================
STEP 18 — MASTER-MATRIX.md
==================================================

Create the MASTER MATRIX framework for approximately 1,000 future English articles.

Do NOT write the articles yet.

Develop the cluster allocation and matrix structure.

Each future article row should support:

ID
cluster
subcluster
primary topic
proposed title
primary intent
search intent
audience
content type
source basis
fresh research required
legal/technical sensitivity
closest related topic
differentiation reason
internal links
status

Start building the matrix from available research.

Run conceptual checks for:

duplicate intent
semantic overlap
cannibalization
thin content
doorway topics

Quality is more important than reaching exactly 1,000.

Do not manufacture filler just to reach a number.

==================================================
STEP 19 — QUEUE
==================================================

Create:

_queue/

and exclude it from production output.

This is where future unpublished content can be prepared.

Do not build an automatic mass publisher in this task unless one is genuinely required for the architecture.

==================================================
STEP 20 — MOBILE QA
==================================================

Test around 390px width.

Verify:

no horizontal overflow

header/navigation usable

theme toggle usable

cards fit screen

search usable

buttons tappable

footer accordion usable

text readable

contact actions usable

==================================================
STEP 21 — VALIDATION
==================================================

Validate:

YAML
HTML
CSS
JavaScript
Liquid/Jekyll compatibility
internal links
relative_url/baseurl handling
schema
canonical URLs
robots
sitemap
mobile rendering

Avoid broken code tokens caused by accidental line wrapping.

==================================================
STEP 22 — COMMIT STRATEGY
==================================================

This is a foundation build.

Prefer ONE coherent foundation commit if possible.

If connector limitations require multiple commits:
keep the number small and logical.

Do NOT create hundreds of tiny commits.

Do NOT create a README-only verification commit.

==================================================
STEP 23 — DEPLOYMENT
==================================================

Push the actual source changes.

Wait for the final native GitHub Pages workflow.

Then verify the final remote MAIN HEAD.

Verify:

BUILD
DEPLOY

Then perform live runtime checks.

At minimum check:

homepage
CSS
JavaScript
mobile navigation
Light/Dark/Auto
one category/hub page
contact links
robots.txt
sitemap.xml
404 behavior
canonical
schema presence

==================================================
DEFINITION OF COMPLETE
==================================================

Do NOT report COMPLETE merely because files were generated locally.

COMPLETE requires:

actual source changed
+
remote commit exists
+
MAIN contains it
+
GitHub Pages final build succeeds
+
deployment succeeds
+
live runtime checks succeed

==================================================
FINAL REPORT FORMAT
==================================================

When finished report exactly:

PROJECT FOUNDATION: COMPLETE / PARTIAL / BLOCKED

MAIN HEAD:
<exact SHA>

COMMIT(S):
<exact SHA list>

PAGES RUN ID:
<exact run>

BUILD:
SUCCESS / FAILED / UNKNOWN

DEPLOY:
SUCCESS / FAILED / UNKNOWN

FILES CREATED:
<list>

FILES MODIFIED:
<list>

README PROJECT MAP:
CREATED / UPDATED

OWNER FACTS:
CREATED / UPDATED

SOURCE MAP:
CREATED / UPDATED

CUSTOMER INTENTS:
CREATED / UPDATED

MODEL DATABASE:
CREATED / UPDATED

MASTER MATRIX:
CREATED / UPDATED

ROBOTS:
<live URL + result>

SITEMAP:
<live URL + result>

MOBILE QA:
<actual checks>

RUNTIME CHECKS:
<actual checks>

LIMITATIONS:
<real limitations only>

NEXT RECOMMENDED STEP:
<one clear next phase>

Never fabricate PASS, SHA, Pages run IDs or runtime results.

Proceed now.
