# CUSTOMER INTENTS — First-Party Intent Store (schema)

Status: SCHEMA — awaiting owner data. This store feeds the MASTER MATRIX so the ~1,000 articles reflect real demand, not invented keywords.

## 1. GSC export (thuexemaynguyentu.com, 6–12 months)

Expected columns: query · page · impressions · clicks · position. Processing rules:

1. Normalize queries (lowercase, dedupe near-identical phrasings).
2. Cluster queries into intents (e.g. "rent motorbike hanoi", "cho thuê xe máy hà nội long biên", "motorbike rental near me" → one rental-local intent).
3. Rank intent clusters by impressions + clicks; flag high-impression/low-position clusters (content opportunities).
4. Map each intent cluster to a MASTER MATRIX row; unmatched high-volume intents get priority rows.
5. Vietnamese queries are translated into English intents but stored with the original for reference — the English site targets English intents.

Storage: `docs/data/gsc-queries.csv` (raw, as exported) + `docs/data/intent-clusters.csv` (cluster_id, representative_query, impressions, clicks, avg_position, mapped_matrix_row, language).

## 2. Customer questions (WhatsApp/Zalo/Facebook, anonymized)

Rules:

1. Owner strips names, phone numbers, and any PII before providing. 100–300 questions expected.
2. Each question is tagged: stage (pre-rental / during / post), topic (licence, price, deposit, bike choice, monthly, delivery, insurance, trip advice, maintenance, electric...), language, frequency if repeated.
3. Questions seed FAQ blocks, article angles, and informational intents that GSC cannot show (voice-of-customer).
4. Example shapes already known: "Do I need a licence?", "Can I rent monthly?", "Which bike for 2 people?", "50cc without licence?", "bike for English teacher?", "how much deposit?"

Storage: `docs/data/customer-questions.csv` (question, stage, topic, frequency, pii_checked).

## 3. Matrix integration

MASTER MATRIX generation order once data lands:

1. GSC intent clusters (real demand)
2. Customer questions (real demand, low competition)
3. Gap analysis vs the 14-cluster skeleton (fill clusters GSC/customers under-represent)
4. Deduplicate near-identical intents, then expand to ~1,000 rows

The skeleton stays as the architecture; first-party data decides priorities, angles and which intents get articles first.
