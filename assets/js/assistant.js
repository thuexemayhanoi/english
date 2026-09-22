(function () {
  // Guide Assistant — static client-side retrieval over site content + approved business facts.
  // Deterministic retrieval, no external AI/API. History lives in page memory only.
  var fab = document.getElementById('assistantFab');
  var panel = document.getElementById('assistantPanel');
  var backdrop = document.getElementById('assistantBackdrop');
  var closeBtn = document.getElementById('assistantClose');
  var msgs = document.getElementById('assistantMsgs');
  var suggest = document.getElementById('assistantSuggest');
  var form = document.getElementById('assistantForm');
  var input = document.getElementById('assistantInput');
  var indexUrl = document.querySelector('script[data-assistant-index]');
  var indexPromise = null;
  var biz = window.ASSISTANT_BUSINESS || null;
  var isOpen = false;
  var lastFocused = null;

  function norm(s) {
    return (s || '').toLowerCase().replace(/[^a-z0-9áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  var SYN = {
    price: ['price', 'cost', 'rate', 'how much', 'fee', 'vnd'],
    licence: ['licence', 'license', 'driving licence', 'permit', 'idp'],
    rent: ['rent', 'rental', 'hire', 'renting'],
    monthly: ['monthly', 'month', 'long term', 'long-term'],
    helmet: ['helmet', 'crash helmet'],
    fine: ['fine', 'fines', 'penalty', 'punishment', 'ticket'],
    alcohol: ['alcohol', 'drink driving', 'drunk', 'drinking', 'beer', 'wine'],
    c50: ['50cc', 'moped', 'xe gan may'],
    electric: ['electric', 'e-bike', 'ebike', 'electric bike'],
    deposit: ['deposit', 'security'],
    insurance: ['insurance', 'insured', 'coverage'],
    delivery: ['deliver', 'delivery', 'pickup', 'pick up', 'drop off'],
    address: ['address', 'location', 'where', 'located', 'find you', 'shop'],
    hours: ['opening hours', 'open', 'close', 'closing', 'what time'],
    contact: ['whatsapp', 'zalo', 'phone', 'call', 'contact', 'number'],
    tourist: ['tourist', 'tourists', 'foreigner', 'foreigners', 'visitor', 'traveler', 'traveller'],
    trips: ['trip', 'trips', 'route', 'itinerary', 'travel', 'ride from hanoi'],
    maintenance: ['maintenance', 'repair', 'oil', 'chain', 'service', 'tyre', 'tire'],
    safety: ['safety', 'safe', 'dangerous', 'accident']
  };

  function expand(q) {
    var tokens = norm(q).split(' ').filter(Boolean);
    var out = tokens.slice();
    var qs = ' ' + norm(q) + ' ';
    Object.keys(SYN).forEach(function (k) {
      SYN[k].forEach(function (w) {
        if (qs.indexOf(' ' + w + ' ') !== -1 || qs.indexOf(w) !== -1) out.push(k);
      });
    });
    return out;
  }

  var STOP = {
    i: 1, you: 1, your: 1, the: 1, a: 1, an: 1, and: 1, or: 1, of: 1, to: 1, in: 1,
    on: 1, at: 1, for: 1, is: 1, are: 1, be: 1, do: 1, does: 1, did: 1, can: 1,
    could: 1, will: 1, would: 1, what: 1, which: 1, who: 1, me: 1, my: 1, we: 1,
    it: 1, its: 1, with: 1, that: 1, this: 1, have: 1, has: 1, need: 1, tell: 1,
    about: 1, please: 1, there: 1, they: 1, from: 1, how: 1, get: 1, any: 1, some: 1
  };

  // simple stem variants: plural / gerund / past tense
  function stems(t) {
    var v = [t];
    if (t.length > 4 && t.slice(-3) === 'ing') v.push(t.slice(0, -3), t.slice(0, -3) + 'e');
    if (t.length > 3 && t.slice(-1) === 's') v.push(t.slice(0, -1));
    if (t.length > 4 && t.slice(-2) === 'ed') v.push(t.slice(0, -2));
    return v;
  }
  function hits(hay, t) {
    for (var i = 0; i < stems(t).length; i++) if (hay.indexOf(stems(t)[i]) !== -1) return true;
    return false;
  }

  function loadIndex() {
    if (!indexPromise) {
      var url = indexUrl ? indexUrl.getAttribute('data-assistant-index') : null;
      indexPromise = fetch(url).then(function (r) { return r.json(); });
    }
    return indexPromise;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function msg(role, html) {
    var div = document.createElement('div');
    div.className = 'amsg amsg-' + role;
    div.innerHTML = html;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function sourceLine(recs) {
    var h = '<div class="amsg-sources"><span class="amsg-src-label">Sources:</span><ul>';
    recs.forEach(function (r) {
      h += '<li><a href="' + esc(r.url) + '">' + esc(r.title) + '</a></li>';
    });
    h += '</ul></div>';
    return h;
  }

  function contactBlock() {
    var b = biz || {};
    return '<div class="amsg-contact">' +
      '<a href="tel:' + esc(b.phone_href || '') + '">Call</a>' +
      '<a href="' + esc(b.whatsapp || '#') + '" rel="noopener">WhatsApp</a>' +
      '<a href="' + esc(b.zalo || '#') + '" rel="noopener">Zalo</a>' +
      '<a href="' + esc((window.ASSISTANT_LINKS && window.ASSISTANT_LINKS.contact) || '/english/contact/') + '">Contact page</a>' +
      '<a href="' + esc((window.ASSISTANT_LINKS && window.ASSISTANT_LINKS.search) || '/english/search/') + '">Search guides</a></div>';
  }

  // ---- Business intent detection (curated approved facts only) ----
  function businessAnswer(q) {
    if (!biz) return null;
    var n = norm(q);
    var has = function () {
      for (var i = 0; i < arguments.length; i++) if (n.indexOf(arguments[i]) !== -1) return true;
      return false;
    };
    // Model price lookup
    if (has('how much', 'price', 'cost', 'rate', 'rent')) {
      var models = biz.prices || [];
      for (var i = 0; i < models.length; i++) {
        var parts = norm(models[i].model).split(' ');
        var modelName = norm(models[i].model);
        if (n.indexOf(modelName) !== -1) {
          var s = 'Published rate for the ' + esc(models[i].model) + ': ' +
            esc(models[i].day) + '/day' +
            (models[i].week ? ', ' + esc(models[i].week) + '/week' : '') +
            (models[i].month ? ', ' + esc(models[i].month) + '/month' : '') + '. ' +
            esc(biz.availability_fallback || '');
          return { text: s };
        }
      }
      if (has('50cc') || has('electric', 'e-bike', 'ebike')) {
        return { text: esc(biz.no_fixed_price_note || '') };
      }
      if (has('price', 'prices', 'how much', 'rate', 'cost')) {
        var list = (biz.prices || []).map(function (p) {
          return '<li>' + esc(p.model) + ': ' + esc(p.day) + '/day' +
            (p.week ? ', ' + esc(p.week) + '/week' : '') +
            (p.month ? ', ' + esc(p.month) + '/month' : '') + '</li>';
        }).join('');
        return { text: 'Published rates:<ul class="amsg-list">' + list + '</ul>' + esc(biz.prices_note || '') };
      }
    }
    if (has('deposit', 'security')) return { text: esc(biz.deposit || '') };
    if (has('insurance', 'insured', 'coverage')) return { text: esc(biz.insurance || '') + ' Consider travel or personal insurance that covers riding.' };
    if (has('monthly', 'long term', 'long-term')) return { text: 'Yes — monthly rental is available. Rental periods: ' + esc(biz.rental_periods || '') + '. ' + esc(biz.availability_fallback || '') };
    if (has('late')) return { text: esc(biz.late_return || '') };
    if (has('refund', 'early return')) return { text: esc(biz.early_return || '') };
    if (has('pay', 'payment', 'card', 'cash')) return { text: 'Accepted payments: ' + esc(biz.payments || '') + '.' };
    if (has('deliver', 'delivery', 'pickup', 'pick up')) return { text: esc(biz.delivery || '') };
    if (has('where', 'address', 'location', 'located', 'find you')) return { text: 'We are at ' + esc(biz.address || '') + '.' };
    if (has('open', 'close', 'hours', 'what time')) return { text: 'Opening hours: ' + esc(biz.opening_hours || '') + '.' };
    if (has('phone', 'whatsapp', 'zalo', 'call', 'number', 'contact')) {
      return { text: 'Phone / WhatsApp / Zalo: ' + esc(biz.phone || '') + '.' };
    }
    return null;
  }

  // ---- Article retrieval ----
  function retrieve(q, index) {
    var tokens = expand(q).filter(function (t) { return t.length >= 2 && !STOP[t]; });
    if (!tokens.length) return [];
    var qs = norm(q);
    var scored = index.map(function (rec) {
      var title = norm(rec.title);
      var desc = norm(rec.description || '');
      var tags = norm((rec.tags || []).join(' '));
      var text = norm(rec.text || '');
      var score = 0;
      tokens.forEach(function (t) {
        if (title && hits(title, t)) score += 8;
        if (desc && hits(desc, t)) score += 4;
        if (tags && hits(tags, t)) score += 5;
        if (text && hits(text, t)) score += 1;
      });
      if (qs && title && title.indexOf(qs) !== -1) score += 10;
      return { rec: rec, score: score };
    }).filter(function (s) { return s.score >= 6; })
      .sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, 3).map(function (s) { return s.rec; });
  }

  function answer(q) {
    var bizAns = businessAnswer(q);
    loadIndex().then(function (index) {
      var recs = retrieve(q, index);
      if (bizAns) {
        // Business facts come from the owner-approved fact store, not articles.
        msg('bot', '<p>' + bizAns.text + '</p>');
        return;
      }
      if (recs.length) {
        var underReview = recs.filter(function (r) { return r.review_status && r.review_status !== 'VERIFIED'; });
        var lead = recs[0];
        if (underReview.length && underReview.indexOf(lead) !== -1) {
          msg('bot', '<p>This guide is currently under legal-source review. Please read the guide for context and verify current rules before riding.</p>' + sourceLine(recs));
        } else {
          msg('bot', '<p>' + esc(lead.description || lead.title) + '</p>' + sourceLine(recs));
        }
        return;
      }
      msg('bot', "<p>I couldn't find a reliable answer in the current guides.</p>" + contactBlock());
    }).catch(function () {
      msg('bot', "<p>I couldn't load the guide index right now.</p>" + contactBlock());
    });
  }

  // ---- Overlay management (mirrors hardened contact-sheet pattern) ----
  function openPanel() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = fab;
    // Only one overlay at a time: tell the contact sheet to close.
    document.dispatchEvent(new CustomEvent('overlay:opening', { detail: { id: 'assistant' } }));
    if (backdrop) { backdrop.hidden = false; backdrop.classList.add('is-open'); }
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    fab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (input) input.focus();
    if (!msgs.childElementCount) {
      msg('bot', "Hi! I can help you find information from Nguyen Tu\u2019s motorbike guides. Ask about rentals, licences, 50cc bikes, safety, maintenance or trips.");
    }
  }
  function closePanel() {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    fab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (backdrop) {
      backdrop.classList.remove('is-open');
      window.setTimeout(function () {
        if (backdrop && !isOpen) backdrop.hidden = true;
      }, 220);
    }
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (fab) fab.addEventListener('click', openPanel);
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  if (backdrop) backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (panel.classList.contains('is-open')) closePanel();
  });
  // Contact sheet opens -> close assistant (single-overlay rule)
  document.addEventListener('overlay:opening', function (e) {
    if (e.detail && e.detail.id !== 'assistant' && isOpen) closePanel();
  });

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (input.value || '').trim();
    if (!q) return;
    msg('user', '<p>' + esc(q) + '</p>');
    input.value = '';
    answer(q);
  });
  if (suggest) suggest.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-q]');
    if (!b) return;
    input.value = b.getAttribute('data-q');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  });
})();
