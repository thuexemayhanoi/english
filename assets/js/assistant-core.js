/* Guide Assistant core — deterministic client-side retrieval and answer composition.
 * Pure logic, no DOM: shared by assets/js/assistant.js (browser) and
 * scripts/assistant-test.js (Node). No external AI/API, no persistence.
 * Works over the v2 chunk index (assistant-index.json) plus the curated
 * approved business facts (_data/assistant-business.yml).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AssistantCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- Normalization ----------
  function norm(s) {
    return (s || '').toLowerCase()
      .replace(/[^a-z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s-]/g, ' ')
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var STOP = {
    i: 1, you: 1, your: 1, the: 1, a: 1, an: 1, and: 1, or: 1, of: 1, to: 1, in: 1,
    on: 1, at: 1, for: 1, is: 1, are: 1, be: 1, do: 1, does: 1, did: 1, can: 1,
    could: 1, will: 1, would: 1, what: 1, which: 1, who: 1, me: 1, my: 1, we: 1,
    it: 1, its: 1, with: 1, that: 1, this: 1, have: 1, has: 1, need: 1, tell: 1,
    about: 1, please: 1, there: 1, they: 1, from: 1, how: 1, get: 1, any: 1, some: 1,
    much: 1, many: 1, when: 1, where: 1, was: 1, were: 1, if: 1, so: 1, by: 1, us: 1
  };

  // ---------- Synonym groups (customer wording) ----------
  var SYN = {
    price: ['price', 'cost', 'rate', 'fee', 'vnd', 'expensive', 'cheap', 'charge'],
    licence: ['licence', 'license', 'lisence', 'permit', 'idp', 'legal', 'allowed', 'law'],
    rent: ['rent', 'rental', 'hire', 'renting', 'lease'],
    day: ['day', 'daily', 'per day'],
    week: ['week', 'weekly', 'per week'],
    month: ['monthly', 'month', 'long term', 'long-term', 'longer term'],
    deposit: ['deposit', 'security'],
    insurance: ['insurance', 'insured', 'coverage', 'cover'],
    delivery: ['deliver', 'delivery', 'pickup', 'pick up', 'drop off', 'dropoff', 'bring the bike', 'bring bike'],
    location: ['address', 'location', 'where', 'located', 'find you', 'shop', 'based'],
    hours: ['opening hours', 'hours', 'open', 'close', 'closing', 'what time'],
    contact: ['whatsapp', 'zalo', 'phone', 'call', 'contact', 'number'],
    availability: ['available', 'availability', 'today', 'in stock', 'have', 'got'],
    tourist: ['tourist', 'tourists', 'foreigner', 'foreigners', 'visitor', 'traveler', 'traveller'],
    helmet: ['helmet', 'crash helmet'],
    fine: ['fine', 'fines', 'penalty', 'punishment', 'ticket'],
    alcohol: ['alcohol', 'drink driving', 'drunk', 'drinking', 'beer', 'wine'],
    c50: ['50cc', 'moped', 'xe gan may', '50 cc'],
    electric: ['electric', 'e-bike', 'ebike', 'e bike', 'electric bike', 'electric motorbike', 'electric motorcycle'],
    maintenance: ['maintenance', 'repair', 'oil', 'chain', 'service', 'tyre', 'tires', 'tire', 'brakes'],
    safety: ['safety', 'safe', 'dangerous', 'accident'],
    trips: ['trip', 'trips', 'route', 'itinerary', 'travel', 'ride from hanoi'],
    payment: ['pay', 'payment', 'card', 'cash', 'momo', 'qr'],
    late: ['late', 'overdue'],
    refund: ['refund', 'early return', 'return early']
  };

  // ---------- Model aliases ----------
  var MODELS = [
    { canonical: 'Honda Wave', keys: ['honda wave', 'wave'] },
    { canonical: 'Yamaha Sirius', keys: ['yamaha sirius', 'sirius'] },
    { canonical: 'Honda Vision', keys: ['honda vision', 'vision', 'vison'] },
    { canonical: 'Honda Air Blade', keys: ['honda air blade', 'air blade', 'airblade', 'blade'] },
    { canonical: 'Honda Click', keys: ['honda click', 'click'] },
    { canonical: 'Yamaha Mio', keys: ['yamaha mio', 'mio'] },
    { canonical: 'E-Bike', keys: ['e-bike', 'e bike', 'ebike', 'electric bike', 'electric motorbike', 'electric motorcycle', 'electric'] }
  ];

  // ---------- Lightweight typo correction ----------
  // Small dictionary of high-value terms; edit distance 1 only, length >= 5.
  var DICT = ['licence', 'license', 'motorbike', 'motorcycles', 'motorcycle', 'scooter', 'deposit',
    'insurance', 'helmet', 'delivery', 'availability', 'vietnam', 'hanoi', 'vision', 'airblade',
    'blade', 'sirius', 'monthly', 'weekly', 'rental', 'tourist', 'traveller', 'traveler',
    'maintenance', 'battery', 'charging', 'passport', 'payment'];

  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 9;
    var m = a.length, n = b.length;
    var prev = [], cur = [];
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      cur[0] = i;
      for (var k = 1; k <= n; k++) {
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + (a[i - 1] === b[k - 1] ? 0 : 1));
      }
      var t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }

  function correctToken(t) {
    if (t.length < 5 || DICT.indexOf(t) !== -1) return t;
    for (var i = 0; i < DICT.length; i++) {
      if (editDistance(t, DICT[i]) <= 1) return DICT[i];
    }
    return t;
  }

  // ---------- Query parsing ----------
  function parseQuery(q, ctx) {
    ctx = ctx || {};
    var n = ' ' + norm(q) + ' ';
    // typo correction per token
    var tokens = norm(q).split(' ').filter(Boolean).map(correctToken);
    var nc = ' ' + tokens.join(' ') + ' ';

    function has() {
      for (var i = 0; i < arguments.length; i++) if (nc.indexOf(arguments[i]) !== -1) return true;
      return false;
    }
    function hasRaw() {
      for (var i = 0; i < arguments.length; i++) if (n.indexOf(arguments[i]) !== -1) return true;
      return false;
    }

    var parsed = { raw: q, norm: nc.trim(), tokens: tokens, model: null, period: null, intents: {} };

    // model detection
    for (var mi = 0; mi < MODELS.length; mi++) {
      for (var ki = 0; ki < MODELS[mi].keys.length; ki++) {
        if (hasRaw(MODELS[mi].keys[ki])) { parsed.model = MODELS[mi].canonical; break; }
      }
      if (parsed.model) break;
    }
    // 50cc as a subject (not a model with prices)
    parsed.c50 = hasRaw('50cc', '50 cc', 'moped');
    parsed.electric = hasRaw('electric', 'e-bike', 'e bike', 'ebike');

    // intents
    var intentMap = {
      price: ['price', 'cost', 'rate', 'fee', 'how much', 'vnd', 'expensive', 'cheap', 'charge'],
      licence: ['licence', 'license', 'permit', 'idp', 'legal', 'allowed', 'law'],
      deposit: ['deposit', 'security'],
      insurance: ['insurance', 'insured', 'coverage', 'cover'],
      delivery: ['deliver', 'delivery', 'pickup', 'pick up', 'drop off', 'dropoff', 'bring'],
      location: ['where', 'address', 'location', 'located', 'find you', 'shop', 'based'],
      hours: ['hours', 'open', 'close', 'closing', 'what time'],
      contact: ['whatsapp', 'zalo', 'phone', 'call', 'contact', 'number'],
      availability: ['available', 'availability', 'today', 'in stock', 'do you have', 'have you'],
      payment: ['pay', 'payment', 'card', 'cash', 'momo', 'qr'],
      maintenance: ['chain', 'oil', 'maintenance', 'repair', 'service', 'tyre', 'tire', 'brakes', 'loose'],
      late: ['late'],
      refund: ['refund', 'early return', 'return early'],
      rent: ['rent', 'rental', 'hire', 'renting']
    };
    Object.keys(intentMap).forEach(function (k) {
      for (var i = 0; i < intentMap[k].length; i++) if (has(intentMap[k][i])) { parsed.intents[k] = true; break; }
    });
    if (has('how much')) parsed.intents.price = true;

    // period
    if (has('month', 'monthly', 'long term', 'long-term')) parsed.period = 'month';
    else if (has('week', 'weekly')) parsed.period = 'week';
    else if (has('day', 'daily')) parsed.period = 'day';

    // ---- multi-turn context ----
    var followUp = has('what about', 'and the', 'monthly', 'per month', 'per week', 'per day') ||
      tokens.filter(function (t) { return !STOP[t]; }).length <= 3;
    if (!parsed.model && ctx.model && (followUp || parsed.period)) parsed.model = ctx.model;
    if (!parsed.intents.price && !parsed.intents.licence && ctx.intent && followUp) parsed.intents[ctx.intent] = true;
    if (parsed.c50 && ctx.intent === 'licence' && !parsed.intents.licence) parsed.intents.licence = true;
    if (parsed.electric && ctx.intent === 'licence' && !parsed.intents.licence) parsed.intents.licence = true;

    return parsed;
  }

  // ---------- Token matching helpers ----------
  function stems(t) {
    var v = [t];
    if (t.length > 4 && t.slice(-3) === 'ing') { v.push(t.slice(0, -3)); v.push(t.slice(0, -3) + 'e'); }
    if (t.length > 3 && t.slice(-1) === 's') v.push(t.slice(0, -1));
    if (t.length > 4 && t.slice(-2) === 'ed') v.push(t.slice(0, -2));
    return v;
  }
  function hits(hay, t) {
    var v = stems(t);
    for (var i = 0; i < v.length; i++) {
      // Short tokens (3 chars or fewer) must match whole words. Substring
      // matching creates false positives such as "one" inside "Underbones",
      // which let irrelevant chunks outrank the right answer.
      if (t.length <= 3) {
        if ((' ' + hay + ' ').indexOf(' ' + v[i] + ' ') !== -1) return true;
      } else if (hay.indexOf(v[i]) !== -1) {
        return true;
      }
    }
    return false;
  }
  function cleanText(s) {
    // strip markdown link syntax for display: [text](url) -> text
    return (s || '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
  }
  function sentences(text, max) {
    // No regex lookbehind: older mobile Safari cannot parse it.
    var clean = cleanText(text);
    var parts = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [clean];
    var out = [];
    var words = 0;
    for (var i = 0; i < parts.length && out.length < (max || 3); i++) {
      var s = parts[i].trim();
      if (!s) continue;
      out.push(s);
      words += s.split(' ').length;
      if (words > 70) break;
    }
    return out.join(' ');
  }

  // ---------- Business answers (deterministic, approved facts only) ----------
  function findModelPrice(biz, canonical) {
    var list = (biz && biz.prices) || [];
    for (var i = 0; i < list.length; i++) if (list[i].model === canonical) return list[i];
    return null;
  }

  function businessAnswer(parsed, biz) {
    if (!biz) return null;
    var p = parsed;
    var av = biz.availability_fallback || '';

    // model availability question
    if (p.intents.availability && p.model) {
      return { text: p.model + ' is listed in Nguyen Tu\u2019s published rental information. ' + av, model: p.model, intent: 'availability' };
    }
    if (p.intents.availability && p.c50) {
      return { text: '50cc motorbikes have historically been offered. ' + av, intent: 'availability' };
    }

    // price questions
    if ((p.intents.price || p.intents.rent) && p.model) {
      var pr = findModelPrice(biz, p.model);
      if (pr) {
        var s = 'Published rate for the ' + pr.model + ': ' + pr.day + '/day';
        if (p.period === 'week' && pr.week) s = 'Published rate for the ' + pr.model + ': ' + pr.week + '/week';
        else if (p.period === 'month' && pr.month) s = 'Published rate for the ' + pr.model + ': ' + pr.month + '/month';
        else {
          if (pr.week) s += ', ' + pr.week + '/week';
          if (pr.month) s += ', ' + pr.month + '/month';
        }
        if ((p.period === 'week' && !pr.week) || (p.period === 'month' && !pr.month)) {
          s = 'Published rate for the ' + pr.model + ': ' + pr.day + '/day. No ' + p.period + ' rate is published for this model — contact us for ' + p.period + ' options';
        }
        s += '. ' + av;
        return { text: s, model: pr.model, intent: 'price' };
      }
    }
    if (p.intents.price && p.c50) {
      return { text: biz.no_fixed_price_note || 'No fixed price is published for 50cc bikes — contact us for a quote.', intent: 'price' };
    }
    if (p.intents.price && !p.model) {
      var list = (biz.prices || []).map(function (x) {
        return x.model + ': ' + x.day + '/day' +
          (x.week ? ', ' + x.week + '/week' : '') +
          (x.month ? ', ' + x.month + '/month' : '');
      });
      return { text: 'Published rates:\n' + list.join('\n') + '\n' + (biz.prices_note || ''), intent: 'price', list: true };
    }

    // monthly without a specific model
    if (p.period === 'month' && !p.model && !p.intents.price) {
      return { text: 'Yes — monthly rental is available. Rental periods: ' + (biz.rental_periods || '') + '. ' + av, intent: 'rent' };
    }

    if (p.intents.deposit) return { text: 'Deposit: ' + (biz.deposit || ''), intent: 'deposit' };
    if (p.intents.insurance) return { text: (biz.insurance || '') + ' If you want cover for riding, arrange insurance before you ride.', intent: 'insurance' };
    if (p.intents.late) return { text: biz.late_return || '', intent: 'late' };
    if (p.intents.refund) return { text: biz.early_return || '', intent: 'refund' };
    if (p.intents.payment) return { text: 'Accepted payments: ' + (biz.payments || ''), intent: 'payment' };
    if (p.intents.delivery) return { text: biz.delivery || '', intent: 'delivery' };
    if (p.intents.location) return { text: 'Nguyen Tu is at ' + (biz.address || '') + '. See the contact page for the map.', intent: 'location' };
    if (p.intents.hours) return { text: 'Opening hours: ' + (biz.opening_hours || '') + '.', intent: 'hours' };
    if (p.intents.contact) return { text: 'Phone / WhatsApp / Zalo: ' + (biz.phone || '') + '.', intent: 'contact' };

    return null;
  }

  // ---------- Hybrid chunk ranking ----------
  function rank(parsed, chunks) {
    var tokens = parsed.tokens.filter(function (t) { return t.length >= 2 && !STOP[t]; });
    if (!tokens.length) return [];
    var qphrase = parsed.norm;
    var results = chunks.map(function (ch) {
      var h = norm(ch.h);
      var t = norm(ch.t);
      var body = norm(ch.x);
      var tags = norm((ch.tags || []).join(' '));
      var topic = norm(ch.topic || '');
      var score = 0;
      var matched = 0;
      tokens.forEach(function (tok) {
        var m = false;
        if (h && hits(h, tok)) { score += 12; m = true; }
        if (t && hits(t, tok)) { score += 8; m = true; }
        if (tags && hits(tags, tok)) { score += 5; m = true; }
        if (topic && hits(topic, tok)) { score += 3; m = true; }
        if (body && hits(body, tok)) { score += 2; m = true; }
        if (m) matched++;
      });
      var coverage = tokens.length ? matched / tokens.length : 0;
      score += coverage * 10;
      // exact phrase bonuses
      if (qphrase.length > 8) {
        if (h && h.indexOf(qphrase) !== -1) score += 25;
        else if (body && body.indexOf(qphrase) !== -1) score += 8;
      }
      // FAQ question units are high-value for direct customer questions
      if (ch.qa && h) score += Math.round(coverage * 12);
      // verified legal content preferred for licence/law intents
      if (parsed.intents.licence && ch.rs === 'VERIFIED') score += 6;
      return { ch: ch, score: score, coverage: coverage };
    }).filter(function (r) { return r.score > 0 && r.coverage >= 0.5; })
      .sort(function (a, b) { return b.score - a.score; });
    return results;
  }

  // ---------- Follow-up chips ----------
  var FOLLOWUPS = {
    price: ['What is the deposit?', 'Is monthly rental cheaper?', 'Contact to rent'],
    modelPrice: ['Monthly price', 'What is the deposit?', 'Contact to rent'],
    licence: ['50cc rules', 'IDP rules', 'Fines overview'],
    deposit: ['Rental prices', 'Payment methods', 'Contact to rent'],
    insurance: ['Rental prices', 'Safety guides'],
    delivery: ['Where are you?', 'Opening hours', 'Contact to rent'],
    location: ['Opening hours', 'Can you deliver?', 'Contact to rent'],
    hours: ['Where are you?', 'Can you deliver?'],
    payment: ['What is the deposit?', 'Rental prices'],
    availability: ['Rental prices', 'Contact to rent'],
    article: ['Open the full guide', 'Contact to rent']
  };

  function followUps(kind) {
    return (FOLLOWUPS[kind] || FOLLOWUPS.article).slice(0, 3);
  }

  // ---------- Main entry ----------
  // answer(q, {chunks, biz, ctx}) -> {
  //   html, sources, followUps, ctx, confidence, fallback }
  function answer(q, opts) {
    opts = opts || {};
    var chunks = opts.chunks || [];
    var biz = opts.biz || null;
    var ctx = opts.ctx || {};
    var parsed = parseQuery(q, ctx);

    var newCtx = {
      model: parsed.model || ctx.model || null,
      intent: Object.keys(parsed.intents)[0] || ctx.intent || null,
      topic: ctx.topic || null,
      url: ctx.url || null
    };

    // 1. Business-fact answers are authoritative
    var bizAns = businessAnswer(parsed, biz);
    if (bizAns) {
      newCtx.model = bizAns.model || newCtx.model;
      newCtx.intent = bizAns.intent || newCtx.intent;
      var text = bizAns.list
        ? '<p>Published rates:</p><ul class="amsg-list">' + bizAns.text.split('\n').slice(1, -1).map(function (l) { return '<li>' + escapeHtml(l) + '</li>'; }).join('') + '</ul><p>' + escapeHtml(bizAns.text.split('\n').pop()) + '</p>'
        : '<p>' + escapeHtml(bizAns.text) + '</p>';
      return {
        html: text, sources: [], followUps: followUps(bizAns.model ? 'modelPrice' : bizAns.intent),
        ctx: newCtx, confidence: 'high', fallback: false
      };
    }

    // 2. Chunk retrieval
    var ranked = rank(parsed, chunks);
    if (ranked.length && ranked[0].score >= 18) {
      var top = ranked.slice(0, 2).map(function (r) { return r.ch; });
      var lead = top[0];
      newCtx.url = lead.u;
      var body = sentences(lead.x, 3);
      var html = '<p>' + escapeHtml(body) + '</p>';
      if (lead.rs && lead.rs !== 'VERIFIED') {
        html += '<p><em>This guide is currently under legal-source review — verify current rules before relying on the details.</em></p>';
      } else if (parsed.intents.licence && lead.st === 'article') {
        html += '<p><em>Laws change — verify current rules before you ride.</em></p>';
      }
      return {
        html: html,
        sources: top.map(function (ch) { return { title: ch.st === 'faq' ? ch.h : ch.t, url: ch.u }; }),
        followUps: followUps(parsed.intents.licence ? 'licence' : 'article'),
        ctx: newCtx,
        confidence: ranked[0].score >= 30 ? 'high' : 'medium',
        fallback: false
      };
    }

    // 3. Safe fallback
    return {
      html: "<p>I couldn't find a reliable answer in the current Nguyen Tu guides.</p>",
      sources: [], followUps: [], ctx: newCtx, confidence: 'low', fallback: true
    };
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return {
    norm: norm,
    parseQuery: parseQuery,
    businessAnswer: businessAnswer,
    rank: rank,
    answer: answer,
    followUps: followUps,
    sentences: sentences,
    escapeHtml: escapeHtml
  };
});
